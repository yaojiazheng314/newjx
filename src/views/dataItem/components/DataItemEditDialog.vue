<template>
	<div id="dataItemEditDialog">
		<el-dialog 
			:title="dialogStatus" 
			:show-close="showClose"
			:close-on-click-modal="false"
			:visible.sync="dialogFormVisible">
			<el-form 
				ref="itemForm"
				:rules="rules"
				:model="itemForm" 
				:inline="true"
				label-position="right" 
				label-width="80px" 
				style="height: 355px; width: 600px; margin-left:50px;">
				<el-form-item label="名称" prop="name">
					<el-input 
						v-model.trim="itemForm.name" 
						style="width: 150px;">
					</el-input>
				</el-form-item>
				<el-form-item label="默认值" prop="defaultValue">
					<el-input-number
					  v-model.number="itemForm.defaultValue"
						:precision="2"
					  style="width: 200px;">
					</el-input-number>
				</el-form-item>
				<el-tooltip 
						:content="'当前状态: ' + itemForm.status" 
						placement="top">
					<el-form-item label="状态" prop="status">
						<el-switch
							v-model="itemForm.status"
							active-value="启用"
							inactive-value="禁用">
						</el-switch>
					</el-form-item>
				</el-tooltip>
				<el-form-item label="适用分类" prop="type">
					<el-radio-group 
						v-model="itemForm.type"
						size="small"
						style="width: 500px;">
						<el-radio-button label="科室" value="科室"></el-radio-button>
						<el-radio-button label="人员" value="人员"></el-radio-button>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="填报科室" prop="fillDepartment">
					<el-select 
						v-model="itemForm.fillDepartment" 
						filterable clearable 
						placeholder="选择或输入科室"
						style="width: 230px;">
						<el-option 
							v-for="item in departmentParams" 
							:key="item.id" 
							:label="item.name + '_' + item.type" 
							:value="item.id">
							<span style="float: left">{{ item.name }}</span>
							<span style="float: right; color: #8492a6; font-size: 13px">
								{{ item.type }}
							</span>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="来源方式" prop="dataSource">
					<el-radio-group v-model="itemForm.dataSource" style="width: 450px;">
						<el-radio label="手动填报" value="手动填报"></el-radio>
						<el-radio label="接口导入" value="接口导入"></el-radio>
						<el-radio label="考核导入" value="考核导入"></el-radio>
						<el-radio label="目标导入" value="目标导入"></el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item 
					label="接口码值" 
					prop="interfaceCode"
					v-if="itemForm.dataSource === '接口导入'">
					<el-input 
						v-model.trim="itemForm.interfaceCode" 
						placeholder="输入'存储过程名|码值'"
						style="width: 230px;">
					</el-input>
				</el-form-item>
				<el-form-item label="数据类型" prop="category">
					<el-select 
						v-model="itemForm.category" 
						filterable clearable 
						placeholder="选择或输入数据类型"
						style="width: 230px;">
						<el-option 
							v-for="item in categoryParams" 
							:key="item" 
							:label="item" 
							:value="item">
							<span style="float: left">{{ item }}</span>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="排列顺序" prop="seq">
					<el-input 
						maxlength="4" 
						type="number"
						v-model.trim="itemForm.seq" 
						style="width: 150px;">
					</el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeDialog">返 回</el-button>
				<el-button 
					type="primary"
					:loading="loading"
					@click="saveDataItemInfo">
					保 存
				</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { saveDataItem } from '@/api/bnsDataItem'
export default {
	props: {
		dialogFormVisible: {
			type: Boolean
		},
		itemData: {
			type: Object
		},
		dialogStatus: {
			type: String
		},
		departmentParams: {
			type: Array
		}
	},
	name: 'DataItemEditDialog',
	data() {
		return {
			showClose: false,
			loading: false,
			categoryParams: ['医疗收入类', '变动成本类', '固定成本类', '工作量类', '其它类'],
			itemForm: {
				id: null,
				name: '',
				defaultValue: 0.0,
				status: '启用',
				type: '科室',
				fillDepartment: null,
				dataSource: null,
				interfaceCode: null,
				category: null,
				seq:0
			},
			rules: {
			   name: [
			     { required: true, message: '请输入名称', trigger: 'blur' },
					 { max: 20, message: '名称长度在20字符以内', trigger: 'blur' },
					 { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不要输入符号' }
			   ],
			   defaultValue: [
			     { required: true, message: '请正确输入默认值', trigger: 'blur' }
			   ],
				 type: [
				   { required: true, message: '请选择适用分类', trigger: 'blur' }
				 ],
			   fillDepartment: [
			     { required: true, message: '请选择填报科室', trigger: 'blur' }
			   ],
			   dataSource: [
			     { required: true, message: '请选择数据来源', trigger: 'blur' }
			   ],
			   interfaceCode: [
			     { required: true, message: '请按照格式"存储过程名|码值"输入接口码', 
					 trigger: 'blur' }
			   ],
			   seq: [
			     { required: true, message: '请输入排序顺序', 
					 trigger: 'blur' }
			   ],
			   category: [
			     { required: true, message: '请选择性质分类', trigger: 'blur' }
			   ]
			}
		}		
	},
	mounted() {
		const data = this.itemData
		if (data.id !== null && data.id !== '') {
				this.itemForm = Object.assign({}, data)
			}
	},
	methods: {
		saveDataItemInfo() {
			var self = this
			self.$refs['itemForm'].validate((valid) => {
		    if (valid) {
					self.loading = true
					const data = self.itemForm
					if (data.dataSource !== "接口导入") {
						data.interfaceCode = null
					}
		      saveDataItem(data).then(response => {
						let resultStatus = response.status
						if (resultStatus === 520) {
							self.loading = false
							self.$confirm(response.msg, '提示', {
								type: 'warning',
								center: true
							}).then(() => {
								self.$message({
									type: 'info',
									message: '稍候重试'
								})
							}).catch(() => {
								self.$message({
									type: 'info',
									message: '稍候重试'
								})
							})
						}else {
							self.$notify({
							  title: '成功',
							  message: response.msg,
							  type: 'success',
							  duration: 6000
							})
							if (data.id === '' || 
							data.id === null) {
								//连续创建
								self.resetForm();
								self.$refs['itemForm'].clearValidate();
							}
							self.loading = false
							self.$emit('getList')
							self.$emit('getDataItemParams')
						}
					})
		    } else {
		      return false;
		    }
		  });
		},
		resetForm() {	
			this.itemForm.id = null
			this.itemForm.name = ''
			this.itemForm.defaultValue = 0.0
			this.itemForm.status = '启用'
			this.itemForm.type = '科室'
			this.itemForm.fillDepartment = null
			this.itemForm.dataSource = null
			this.itemForm.interfaceCode = null
			this.itemForm.category = null
		},
		closeDialog() {
			this.$refs['itemForm'].clearValidate()
			this.resetForm()
			this.$emit('closedialog')
		}
	},
}
</script>

<style>
</style>
