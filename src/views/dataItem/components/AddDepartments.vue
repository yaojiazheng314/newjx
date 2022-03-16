<template>
	<div id="addDepartments">
		<el-dialog
			:title="addDeptDialogStatus"
			:show-close="showClose"
			:close-on-click-modal="false"
			:visible.sync="addDeptVisible">
			<!-- 输入 类别 或名称 或编码 模糊查询全院科室 -->
			<el-select
				v-model="departmentParams"
				value-key="id"
				multiple
				filterable
				remote
				reserve-keyword
				placeholder="输入科室名称/类别/编码或'全部'查询"
				:remote-method="remoteMethod"
				:loading="remoteLoading"
				size="small"
				class="fuzzyQuery">
				<el-option
					v-for="item in fuzzyQueryDeptParams"
					:key="item.id"
					:label="item.name"
					:value="item">
					<span style="float: left">{{ item.code }}{{ item.name }}</span>
					<span style="float: right; color: #8492a6; font-size: 13px">
						{{ item.type }}
					</span>
				</el-option>
			</el-select>
			<!-- 添加选中 -->
			<el-tooltip
				effect="light"
				content="添加选中的科室"
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
				content="添加查询的全部科室"
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
					@click="cleanDeptData"
					circle plain></el-button>
			</el-tooltip>
			<!-- 科室名称快速查询 -->
			<el-input
				v-model="searchDR"
				size="mini"
				placeholder="输入科室名称搜索"
				style="width: 200px; float: right;"/>
			<!-- 适用科室表 -->
			<el-table
				:data="deptData.filter(data => !searchDR || data.name.toLowerCase().includes(searchDR.toLowerCase()))"
				style="width: 100%"	stripe
				height="400" useVirtual>
				<el-table-column
					prop="code"
					label="编码">
				</el-table-column>
				<el-table-column
					prop="name"
					label="名称">
				</el-table-column>
				<el-table-column
					prop="type"
					label="类型"
					:filters="[{ text: '项目', value: '项目' },
										 { text: '科室', value: '科室' },
										 { text: '主任组', value: '主任组' },
										 { text: '治疗组', value: '治疗组' },
										 { text: '护理组', value: '护理组' }]"
					:filter-method="filterType" filter-placement="bottom-end">
				</el-table-column>
				<el-table-column
					label="操作"
					width="100">
					<template slot-scope="scope">
						<el-button
							@click="deleteDept(scope.row)"
							type="text" size="small"
							style="color: #F56C6C;"
							icon="el-icon-delete">移除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div slot="footer" class="dialog-footer">
				<copy-departments
					ref="copyDeptChild"
					:objectData="itemData"
					@copyDepts="copyDepts">
				</copy-departments>
				<el-button
					@click="closeDialog"
					class="guo-btn yellow-btn">
					返 回
				</el-button>
				<el-button
					type="primary"
					@click="saveItemDepartment"
					:loading="loading"
					class="guo-btn light-blue-btn">
					保 存
				</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import CopyDepartments from '@/components/CopyDepartments'
import { saveDepartments,
				 getDepartments,
				 copyDepartment } from '@/api/bnsDataItem'
import { fuzzyQueryDeptParam	} from '@/api/department'
export default{
	components: { CopyDepartments },
	props: {
		addDeptVisible: {
			type: Boolean
		},
		addDeptDialogStatus: {
			type: String
		},
		itemData: {
			type: Object
		}
	},
	name: 'AddDepartments',
	data() {
		return {
			showClose: false,
			loading: false,
			remoteLoading: false,
			searchDR: '',
			departmentParams: [],
			fuzzyQueryDeptParams: [], //模糊查询列表
			deptData: [],
			itemDepartment: {
				item: null,
				departments: []
			}
		}
  },
	mounted() {
		const id = this.itemData.id
		if (id !== null && id !== '') {
			this.itemDepartment.item = id
			this.getItemDepartments(this.itemDepartment)
		}
	},
	methods: {
		saveItemDepartment() {
			var self = this
			self.loading = true
			const length = self.deptData.length
			for (let i = 0; i < length; i++) {
				const dept = self.deptData[i].id
				self.itemDepartment.departments.push(dept)
			}
			const data = self.itemDepartment
			saveDepartments(data).then(response => {
				self.$notify({
				  title: '成功',
				  message: response.msg,
				  type: 'success',
				  duration: 6000
				})
				/* 清空存储的科室重新拉取数据 */
				self.itemDepartment.departments = []
				let param = {
					item: data.item
				}
				self.getItemDepartments(param)
				self.loading = false
				self.$emit('getList')
			})
		},
		getItemDepartments(data) {
			var self = this
			getDepartments(data).then(response => {
				self.deptData = response.data
			})
		},
		remoteMethod(query) {
			if (query !== '') {
		    this.remoteLoading = true;
				const search = {
					keyword: query
				}
		    fuzzyQueryDeptParam(search).then(res => {
					this.fuzzyQueryDeptParams = res.data
				})
				this.remoteLoading = false;
		  }else {
		    this.fuzzyQueryDeptParams = [];
		  }
		},
		copyDepts(copyData) {
			var self = this
			const loading = self.$loading({
			  lock: true,
			  text: "正在复制数据，请稍候",
			  spinner: 'el-icon-loading',
			  background: 'rgba(0, 0, 0, 0.7)'
			})
			copyDepartment(copyData).then(response => {
				self.$notify({
				  title: '成功',
				  message: response.msg,
				  type: 'success',
				  duration: 6000
				})
				self.departmentParams = []
				self.itemDepartment.departments = []
				self.getItemDepartments(self.itemDepartment)
				self.$emit('getList')
				self.refreshCopyDept('item')
				loading.close()
			})
		},
		refreshCopyDept(flag) {
			var self = this
			self.$refs.copyDeptChild.refreshCopyParams(flag)
		},
		addChoosenData() {
			var self = this
			let count = 0
			const choosenData = self.departmentParams
			for (let i = 0; i < choosenData.length; i++) {
				const data = choosenData[i]
				var isContained = self.containsCode(data)
				if (!isContained) {
					self.deptData.push(data)
					count++
				}
			}
			self.$message({
			  message: "已添加"+count+"个科室",
			  type: 'success',
			  duration: 4000,
				showClose: true
			})
			//清空选择列表
			self.departmentParams = []
		},
		addAllFuzzyQueryData() {
			var self = this
			let count = 0
			const choosenData = self.fuzzyQueryDeptParams
			for (let i = 0; i < choosenData.length; i++) {
				const data = choosenData[i]
				var isContained = self.containsCode(data)
				if (!isContained) {
					self.deptData.push(data)
					count++
				}
			}
			self.$message({
			  message: "已添加"+count+"个科室",
			  type: 'success',
			  duration: 4000,
				showClose: true
			})
		},
		containsCode(item) {
			const paramID = item.id
			const deptArr = this.deptData.map(v => {
				return v.id
			})
			const length = deptArr.length
			for (let i = 0; i < length; i++) {
				if (deptArr[i] === paramID) {
					return true
				}
			}
			return false
		},
		cleanDeptData() {
			this.deptData = []
		},
		deleteDept(data) {
			const delId = data.id
			let length = this.deptData.length
			for (let i = 0; i < length; i++) {
				const dept = this.deptData[i].id
				if (dept === delId) {
					this.deptData.splice(i, 1)
					break
				}
			}
			let deptName = data.name
			this.$message({
				message: "移除"+deptName,
				type: 'warning',
				duration: 4000,
				showClose: true
			})
		},
		filterType(value, row) {
			return row.type === value
		},
		closeDialog() {
			this.$emit('closeAddDeptDialog')
			this.$emit('getList')
			this.$emit('getDataItemParams')
		}
	}
}
</script>
