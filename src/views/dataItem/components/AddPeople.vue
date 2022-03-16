<template>
	<div id="addPeople">
		<el-dialog
			:title="addPerDialogStatus"
			:show-close="showClose"
			:close-on-click-modal="false"
			:visible.sync="addPerVisible">
			<!-- 输入 类别 或名称 或编码 模糊查询全院人员 -->
			<el-select
				v-model="personParams"
				value-key="id"
				multiple
				filterable
				remote
				reserve-keyword
				placeholder="输入姓名/编码/状态/职位/科室或'全部'查询"
				:remote-method="remoteMethod"
				:loading="remoteLoading"
				size="small"
				class="fuzzyQuery">
				<el-option
					v-for="item in fuzzyQueryPerParams"
					:key="item.id"
					:label="item.name"
					:value="item">
					<span style="float: left">{{ item.name }}</span>
					<span style="margin-left: 15px; color: #8492a6; font-size: 13px">
						{{ item.positionName }}
					</span>
					<span style="float: right; color: #8492a6; font-size: 13px">
						{{ item.departmentName }}
					</span>
				</el-option>
			</el-select>
			<!-- 添加选中 -->
			<el-tooltip
				effect="light"
				content="添加选中的人员"
				placement="top-start">
				<el-button
					size="mini" type="primary"
					style="margin-left: 5px;"
					icon="el-icon-plus"
					@click="addChoosenData"
					circle plain></el-button>
			</el-tooltip>
			<!-- 添加全部 -->
			<el-tooltip
				effect="light"
				content="添加查询的全部人员"
				placement="bottom">
				<el-button
					size="mini" type="info"
					style="margin-left: 5px;"
					icon="el-icon-caret-bottom"
					@click="addAllFuzzyQueryData"
					circle plain></el-button>
			</el-tooltip>
			<!-- 清空科室列表 -->
			<el-tooltip
				effect="light"
				content="清空"
				placement="right-start">
				<el-button
					size="mini" type="warning"
					style="margin-left: 5px;"
					icon="el-icon-delete-solid"
					@click="cleanPerData"
					circle plain></el-button>
			</el-tooltip>
			<!-- 科室名称快速查询 -->
			<el-input
				v-model="searchDR"
				size="mini"
				placeholder="输入科室名称搜索"
				style="width: 200px; float: right;"/>
			<!-- 适用人员表 -->
			<el-table
				:data="perData.filter(data => !searchDR || data.departmentName.toLowerCase().includes(searchDR.toLowerCase()))"
				style="width: 100%"	stripe
				height="400" useVirtual>
				<el-table-column
					prop="code"
					label="编码">
				</el-table-column>
				<el-table-column
					prop="name"
					label="姓名">
				</el-table-column>
				<el-table-column
					prop="status"
					label="状态"
					:filters="[{ text: '在职', value: '在职' },
										 { text: '编外', value: '编外' },
										 { text: '离职', value: '离职' },
										 { text: '长期病休', value: '长期病休' },
										 { text: '返聘', value: '返聘' },
										 { text: '其他', value: '其他' }]"
					:filter-method="filterStatus" filter-placement="bottom-end">
				</el-table-column>
				<el-table-column
					prop="departmentName"
					label="所属科室">
				</el-table-column>
				<el-table-column
					prop="positionName"
					label="职位">
				</el-table-column>
				<el-table-column
					label="操作"
					width="100">
					<template slot-scope="scope">
						<el-button
							@click="deletePer(scope.row)"
							type="text" size="small"
							style="color: #F56C6C;"
							icon="el-icon-delete">移除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div slot="footer" class="dialog-footer">
				<copy-people
					ref="copyPerChild"
					:objectData="itemData"
					@copyPers="copyPers">
				</copy-people>
				<el-button
					@click="closeDialog"
					class="guo-btn yellow-btn">
					返 回
				</el-button>
				<el-button
					type="primary"
					@click="saveItemPeople"
					:loading="loading"
					class="guo-btn light-blue-btn">
					保 存
				</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import CopyPeople from '@/components/CopyPeople'
import { savePeople, getPeople, copyPeople } from '@/api/bnsDataItem'
import { fuzzyQueryPerParam } from '@/api/person'
export default{
	components: { CopyPeople },
	props: {
		addPerVisible: {
			type: Boolean
		},
		addPerDialogStatus: {
			type: String
		},
		itemData: {
			type: Object
		}
	},
	name: 'AddPeople',
	data() {
		return {
			showClose: false,
			loading: false,
			remoteLoading: false, //模糊查询loading
			fuzzyQueryPerParams: [],
			searchDR: '',
			personParams: [],
			perData: [],
			itemPeople: {
				item: null,
				people: []
			}
		}
  },
	mounted() {
		const id = this.itemData.id
		if (id !== null && id !== '') {
			this.itemPeople.item = id
			this.getItemPeople(this.itemPeople)
		}
	},
	methods: {
		saveItemPeople() {
			var self = this
			self.loading = true
			const data = self.itemPeople
			const length = self.perData.length
			for (let i = 0; i < length; i++) {
				const per = self.perData[i].id
				self.itemPeople.people.push(per)
			}
			savePeople(data).then(response => {
				self.$notify({
				  title: '成功',
				  message: response.msg,
				  type: 'success',
				  duration: 6000
				})
				/* 清空存储的人员重新拉取数据 */
				self.itemPeople.people = []
				let param = {
					item: data.item
				}
				self.getItemPeople(param)
				self.loading = false
				self.$emit('getList')
			})
		},
		getItemPeople(data) {
			var self = this
			getPeople(data).then(response => {
				self.perData = response.data
			})
		},
		copyPers(copyData) {
			var self = this
			const loading = self.$loading({
			  lock: true,
			  text: "正在复制数据，请稍候",
			  spinner: 'el-icon-loading',
			  background: 'rgba(0, 0, 0, 0.7)'
			})
			copyPeople(copyData).then(response => {
				self.$notify({
				  title: '成功',
				  message: response.msg,
				  type: 'success',
				  duration: 6000
				})
				self.personParams = []
				self.itemPeople.people = []
				self.getItemPeople(self.itemPeople)
				self.$emit('getList')
				self.refreshCopyPeople('item')
				loading.close()
			})
		},
		refreshCopyPeople(flag) {
			var self = this
			self.$refs.copyPerChild.refreshCopyParams(flag)
		},
		remoteMethod(query) {
			if (query !== '') {
		    this.remoteLoading = true;
				const search = {
					keyword: query
				}
		    fuzzyQueryPerParam(search).then(res => {
					this.fuzzyQueryPerParams = res.data
				})
				this.remoteLoading = false;
		  }else {
		    this.fuzzyQueryPerParams = [];
		  }
		},
		filterStatus(value, row) {
			return row.status === value
		},
		addChoosenData() {
			var self = this
			let count = 0
			const choosenData = self.personParams
			let length = choosenData.length
			for (let i = 0; i < length; i++) {
				const data = choosenData[i]
				var isContained = self.contains(data)
				if (!isContained) {
					self.perData.push(data)
					count++
				}
			}
			self.$message({
			  message: "已添加"+count+"名人员",
			  type: 'success',
			  duration: 4000,
				showClose: true
			})
		},
		addAllFuzzyQueryData() {
			var self = this
			let count = 0
			const choosenData = self.fuzzyQueryPerParams
			let length = choosenData.length
			for (let i = 0; i < length; i++) {
				const data = choosenData[i]
				var isContained = self.contains(data)
				if (!isContained) {
					self.perData.push(data)
					count++
				}
			}
			self.$message({
			  message: "已添加"+count+"名人员",
			  type: 'success',
			  duration: 4000,
				showClose: true
			})
		},
		contains(item) {
			const paramID = item.id
			const perArr = this.perData.map(v => {
				return v.id
			})
			const length = perArr.length
			for (let i = 0; i < length; i++) {
				if (perArr[i] === paramID) {
					return true
				}
			}
			return false
		},
		cleanPerData() {
			this.perData = []
		},
		deletePer(data) {
			const delId = data.id
			let length = this.perData.length
			for (let i = 0; i < length; i++) {
				const per = this.perData[i].id
				if (per === delId) {
					this.perData.splice(i, 1)
					break
				}
			}
			let str = data.departmentName + data.name
			this.$message({
			  message: "移除"+str,
			  type: 'warning',
			  duration: 4000,
				showClose: true
			})
		},
		closeDialog() {
			this.$emit('closeAddPerDialog')
			this.$emit('getList')
			this.$emit('getDataItemParams')
		}
	}
}
</script>
