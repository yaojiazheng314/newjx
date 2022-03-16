<template>
	<div id="addBasis">
		<el-dialog 
			:title="addFieldDialogStatus" 
			:show-close="showClose"
			:close-on-click-modal="false"
			:visible.sync="addFieldVisible">
			<!-- 添加字段 -->
			<el-tooltip 
				effect="light" 
				content="添加字段" 
				placement="top-start">
				<el-button 
					size="mini" type="primary"
					style="margin-left: 5px;"
					icon="el-icon-plus"
					@click="addField"
					circle plain></el-button>
			</el-tooltip>
			<!-- 清空考核依据列表 -->
			<el-tooltip 
				effect="light" 
				content="清空" 
				placement="right-start">
				<el-button 
					size="mini" type="warning"
					style="margin-left: 5px;"
					icon="el-icon-delete-solid"
					@click="cleanFields"
					circle plain></el-button>
			</el-tooltip>
			<!-- 考核依据别名快速查询 -->
			<el-input
				v-model="searchCode"
				size="mini"
				placeholder="输入字段编码搜索"
				style="width: 200px; float: right;"/>
			<!-- 指标的考核依据列表 -->
			<el-table
				:data="itfaceItemField.fields.filter(data => !searchCode || data.fieldCode.toLowerCase().includes(searchCode.toLowerCase()))"
				style="width: 100%"
				stripe
				height="400">
				<el-table-column
					prop="isUnique"
					:label="itfaceSource == 'proc' ? '删除标识' : '唯一校验'"
					width="100">
					<template slot-scope="scope">
						<el-switch
							v-model="scope.row.isUnique"
							:active-value="1"
							:inactive-value="0"
							:disabled="!scope.row.edit">
						</el-switch>
					</template>
				</el-table-column>
				<el-table-column
					prop="fieldCode"
					label="字段编码"
					width="180">
					<template slot-scope="scope">
						<el-input 
							v-if="scope.row.edit"
							v-model.trim="scope.row.fieldCode" 
							size="mini"
							maxlength="20"
							style="width: 150px;"
							@change="containsCode(scope.row)"
							placeholder="输入字段编码"></el-input>
						<span v-else>{{ scope.row.fieldCode }}</span>
					</template>
				</el-table-column>
				<el-table-column
					prop="fieldType"
					label="字段类型"
					width="180">
					<template slot-scope="scope">
						<el-select 
							v-if="scope.row.edit"
							size="mini"
							style="width: 150px;"
							v-model="scope.row.fieldType" 
							placeholder="请选择字段类型">
							<el-option
								v-for="item in fieldTypeParams"
								:key="item.type"
								:label="item.type"
								:value="item.type">
							</el-option>
						</el-select>
						<span v-else>{{ scope.row.fieldType }}</span>
					</template>
				</el-table-column>
				<el-table-column
					prop="fieldComment"
					label="备注">
					<template slot-scope="scope">
						<el-input 
							v-if="scope.row.edit"
							v-model.trim="scope.row.fieldComment" 
							type="textarea"
							size="mini"
							maxlength="50"
							show-word-limit
							:placeholder="itfaceSource == 'proc' ? '如果此字段是删除标识字段请输入删除条件的值' : '编辑字段备注'"></el-input>
						<span v-else>{{ scope.row.fieldComment }}</span>
					</template>
				</el-table-column>
				<el-table-column
					fixed="right"
					align="center"
					label="操作"
					width="120">
					<template slot-scope="scope">
						<el-button 
							v-if="!scope.row.edit"
							@click="editField(scope.row)" 
							type="text" size="mini"
							icon="el-icon-edit">编辑</el-button>
						<el-button 
							v-else
							@click="cancelEditField(scope.row)" 
							type="text" size="mini" style="color: #E6A23C;"
							icon="el-icon-refresh-right">取消</el-button>
						<el-button 
							@click="deleteField(scope.row)" 
							type="text" size="mini"
							style="color: #F56C6C;"
							icon="el-icon-delete">移除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div slot="footer" class="dialog-footer">
				<el-button 
					@click="closeDialog"
					class="guo-btn yellow-btn">
					返 回
				</el-button>
				<el-button 
					type="primary"
					@click="saveField"
					:loading="loading"
					class="guo-btn light-blue-btn">
					保 存
				</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { getItfaceItemFields, saveItfaceItemField } from '@/api/itface'
export default{
	props: {
		addFieldVisible: {
			type: Boolean
		},
		addFieldDialogStatus: {
			type: String
		},
		itfaceItemData: {
			type: Object
		}
	},
	name: 'AddBasis',
	data() {
		return {
			showClose: false,
			loading: false,
			searchCode: '',
			itfaceSource: '', //接口类型 视图view/存储过程proc
			itfaceItemField: {
				itfaceItem: null,
				userID: null,
				fields: []
			},
			fieldTypeParams: [{type: 'varchar'},
												{type: 'double'},
												{type: 'int'}]
		}
  },
	mounted() {
		this.getOperatorInfo()
		const id = this.itfaceItemData.id
		this.itfaceSource = this.itfaceItemData.itfaceSource
		if (id !== null && id !== '') {
			this.itfaceItemField.itfaceItem = id
			const param = this.itfaceItemField
			this.getFields(param)
		}
	},
	methods: {
		//获取操作用户
		getOperatorInfo() {
			var self = this
			self.itfaceItemField.userID = self.$store.getters.userID
		},
		/* 保存字段 */
		saveField() {
			var self = this
			self.loading = true
			self.filterFields() //去除不符合存储规则的字段
			const data = self.itfaceItemField
			saveItfaceItemField(data).then(response => {
				self.$notify({
				  title: '保存成功',
				  type: 'success',
				  duration: 6000
				})
				/* 清空存储的依据重新拉取数据 */
				self.itfaceItemField.fields = []
				let param = {
					itfaceItem: data.itfaceItem
				}
				self.getFields(param)
				self.loading = false
				self.$emit('getList')
			})
		},
		/* 去除不符合规则的字段 */
		filterFields() {
			const fields = this.itfaceItemField.fields
			this.itfaceItemField.fields = [] //重置 准备接受符合存储规则的字段
			const fieldslength = fields.length
			for (let i = 0; i < fieldslength; i++) {
				let field = fields[i]
				if (field.fieldCode !== null && field.fieldCode !== ''
					&& field.fieldType !== null && field.fieldType !== '') {
					let fieldData = {
						id: field.id,
						isUnique: field.isUnique,
						fieldCode: field.fieldCode,
						fieldType: field.fieldType,
						fieldComment: field.fieldComment
					}
					this.itfaceItemField.fields.push(fieldData)
				}
			}
		},
		/* 获取接口配置的字段列表 */
		getFields(param) {
			var self = this
			getItfaceItemFields(param).then(res => {
				const fields = res.data
				self.itfaceItemField.fields = fields.map(v => {
						//旧数据存储
						self.$set(v, 'oldIsUnique', v.isUnique)
						self.$set(v, 'oldFieldCode', v.fieldCode)
						self.$set(v, 'oldFieldType', v.fieldType)
						self.$set(v, 'oldFieldComment', v.fieldComment)
						self.$set(v, 'edit', false)
						return v
					})
			})
		},
		/* 添加新字段 */
		addField() {
			const newField = {
				fieldCode: '',
				fieldType: '',
				fieldComment: '',
				isUnique: 0,
				edit: true
			}
			this.itfaceItemField.fields.push(newField)
		},
		/* 编辑字段 */
		editField(row) {
			return row.edit = true
		},
		/* 取消字段 */
		cancelEditField(row) {
			row.isUnique = row.oldIsUnique
			row.fieldCode = row.oldFieldCode
			row.fieldType = row.oldFieldType
			row.fieldComment = row.oldFieldComment
			if (row.fieldCode == null || row.fieldCode == '') {
				row.fieldCode = '' //移除提示
				this.deleteField(row)
			}else {
				row.edit = false
				this.$message({
					message: "字段"+row.fieldCode+"未被修改，已还原",
					type: 'warning',
					duration: 4000,
					showClose: true
				})
				return row
			}
		},
		/* 校验字段编码是否重复 */
		containsCode(item) {
			//将组装其他字段组装成列表
			const fieldArr = []
			this.itfaceItemField.fields.map(v => {
				if (v !== item && v.fieldCode && v.fieldCode !== '' ) {
					fieldArr.push(v)
				}
			})
			const testCode = item.fieldCode
			const length = fieldArr.length
			for (let i = 0; i < length; i++) {
				let field = fieldArr[i]
				if (field !== null && 
							field.fieldCode.toLowerCase() === testCode.toLowerCase()) {
					//提示编码已存在
					this.$message({
						message: '字段编码'+testCode+'已存在，请勿输入重复编码',
						type: 'warning'
					});
					//重复字段置空
					return item.fieldCode = ''
				} 
			}
		},
		/* 清空字段列表 */
		cleanFields() {
			this.itfaceItemField.fields = []
		},
		/* 去除字段 */
		deleteField(data) {
			const delFieldCode = data.fieldCode
			let length = this.itfaceItemField.fields.length
			for (let i = 0; i < length; i++) {
				let fieldCode = this.itfaceItemField.fields[i].fieldCode
				if (fieldCode === delFieldCode) {
					this.itfaceItemField.fields.splice(i, 1)
					break
				}
			}
			this.$message({
				message: "移除字段"+delFieldCode,
				type: 'warning',
				duration: 4000,
				showClose: true
			})	
		},
		closeDialog() {
			this.$emit('closeAddFieldDialog')
			this.$emit('getList')
		}
	}
}
</script>
