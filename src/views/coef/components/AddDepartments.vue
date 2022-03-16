<template>
	<div id="addDepartments">
		<el-dialog
			:title="addDeptDialogStatus"
			:show-close="showClose"
			:close-on-click-modal="false"
			:visible.sync="addDeptVisible"
			width="850px">
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
					<span style="float: left">{{ item.name }}</span>
					<span style="margin-left: 15px; color: #8492a6; font-size: 13px">
						{{ item.code }}
					</span>
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
				<el-table-column prop="value" label="权重值">
					<template slot-scope="scope">
						<el-input-number
							v-if="scope.row.edit"
							v-model="scope.row.value"
							controls-position="right"
							placeholder="填报科室权重"
							size="mini"
							style="width: 150px;"
							></el-input-number>
						<span
							v-else
							@click="scope.row.edit = !scope.row.edit">
								{{ scope.row.value }}</span>
					</template>
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
					:objectData="coefData"
					@copyDepts="copyDepts">
				</copy-departments>

				<el-select v-model="runYearMonth" placeholder="请选择">
					<el-option
					v-for="item in runYearMonthList"
					:key="item"
					:label="item"
					:value="item">
					</el-option>
				</el-select>

				<el-button
					@click="closeDialog"
					class="guo-btn yellow-btn">
					返 回
				</el-button>
				<el-button
					type="primary"
					@click="saveCoefDepartment"
					:loading="loading"
					class="guo-btn light-blue-btn">
					保 存
				</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { saveDepartments,
				 getDepartments,
				 copyDepartment } from '@/api/bnsCoef'
import CopyDepartments from '@/components/CopyDepartments'
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
		coefData: {
			type: Object
		},
		runYearMonthList: {
			type: Array
		}
	},
	name: 'AddDepartments',
	data() {
		return {
			showClose: false,
			loading: false,
			departmentParams: [],
			remoteLoading: false,
			fuzzyQueryDeptParams: [], //模糊查询列表
			searchDR: '',
			deptData: [],
			coefDepartment: {
				coef: null,
				dept: []
			},
			runYearMonth: ''
		}
  },
	mounted() {
		const id = this.coefData.id
		if (id !== null && id !== '') {
			this.coefDepartment.coef = id
			this.getCoefDepartments(this.coefDepartment)
		}
	},
	methods: {
		saveCoefDepartment() {
			var self = this
			const runYearMonth = self.runYearMonth
			if(!runYearMonth)
			{
				self.$notify({
					  title: '缺少必填',
					  message: '请选择核算年度',
					  type: 'error',
					  duration: 2000
					})
				return false
			}
	
			self.loading = true
			self.addToCoefDept()
			let data = self.coefDepartment
			data.runYearMonth = runYearMonth
			saveDepartments(data).then(response => {
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
					/* 清空存储的科室重新拉取数据 */
					self.coefDepartment.dept = []
					let param = {
						coef: data.coef
					}
					self.getCoefDepartments(param)
					self.loading = false
					self.$emit('getList')
				}
			})
		},
		addToCoefDept() {
			const length = this.deptData.length
			for (let i = 0; i < length; i++) {
				const dept = this.deptData[i]
				//取出有填报值的科室数据
				const coefVal = dept.value
				if (coefVal !== null) {
					//转换成coefDeptValue
					const coefDeptValue = {
						department: dept.id,
						departmentName: dept.name,
						type: dept.type,
						value: coefVal
					}
					this.coefDepartment.dept.push(coefDeptValue)
				}
			}
		},
		getCoefDepartments(data) {
			var self = this
			getDepartments(data).then(response => {
				const coefDeptData = response.data
				self.deptData = coefDeptData.map(v => {
					self.$set(v, 'edit', false)
					return v
				})
			})
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
				let resultStatus = response.status
				if (resultStatus === 520) {
					loading.close()
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
					self.departmentParams = []
					self.coefDepartment.dept = []
					self.getCoefDepartments(self.coefDepartment)
					self.$emit('getList')
					self.refreshCopyDept('coef')
					loading.close()
				}
			})
		},
		refreshCopyDept(flag) {
			var self = this
			self.$refs.copyDeptChild.refreshCopyParams(flag)
		},
		/* 模糊查询要添加的科室 */
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
		/* 添加选中的科室 */
		addChoosenData() {
			var self = this
			let count = 0
			const choosenData = self.departmentParams
			for (let i = 0; i < choosenData.length; i++) {
				const data = choosenData[i]
				var isContained = self.containsCode(data)
				if (!isContained) {
					//新增的权重适用科室添加value属性 渲染编辑框edit
					self.$set(data, 'edit', true)
					self.$set(data, 'value', 0)
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
		/* 添加全部模糊查询的科室 */
		addAllFuzzyQueryData() {
			var self = this
			let count = 0
			const choosenData = self.fuzzyQueryDeptParams
			for (let i = 0; i < choosenData.length; i++) {
				const data = choosenData[i]
				var isContained = self.containsCode(data)
				if (!isContained) {
					//新增的权重适用科室添加value属性 渲染编辑框edit
					self.$set(data, 'edit', true)
					self.$set(data, 'value', 0)
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
		/* 判断添加的科室是否已存在 */
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
		/* 清空科室列表 */
		cleanDeptData() {
			this.deptData = []
		},
		/* 移除科室 */
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
		/* 根据科室类型过滤 */
		filterType(value, row) {
			return row.type === value
		},
		closeDialog() {
			this.$emit('closeAddDeptDialog')
			this.$emit('getList')
			this.$emit('getCoefParams')
		}
	}
}
</script>
