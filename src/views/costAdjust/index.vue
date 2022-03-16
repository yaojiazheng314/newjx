<template>
	<div class="app-container">
		<div class="filter-container">

			<el-select 
				v-model="listQuery.department" 
				filterable clearable 
				placeholder="选择或输入科室" 
				class="searchClass">
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
			<el-date-picker
				v-model="listQuery.yearMonth"
				type="month"
				placeholder="选择月"
				format="yyyy 年 M 月"
				value-format="yyyy-MM"
				:clearable="false"
				:editable="false"
				@change="handleFilter"
				class="searchClass">
			</el-date-picker>

			<el-button v-waves type="primary" size="mini" @click="handleFilter" round>
				查 询
			</el-button>
			<el-button v-waves type="primary" size="mini" @click="handleCreate" round>
				新增单条成本调整
			</el-button>
			<el-button v-waves type="primary" size="mini" @click="handleCreateMore" round>
				新建多条成本调整
			</el-button>
			
			<el-button
    	type="primary" plain icon="el-icon-download"
    	size="mini"
    	@click="exportExcel"> 导出excel模板</el-button>

			
		<upload-excel></upload-excel>
		<label class="filter-container-right-label">调整总金额</label><label class="filter-container-right-label-num">{{adjustTotal}}</label>
		</div>

		<el-table 
			:data="list" 
			v-loading="listLoading" 
			style="width: 100%"
			:row-class-name="tableRowClassName">
			<el-table-column prop="yearmonth" label="调整年月">
			</el-table-column>
			<el-table-column prop="deptCode" label="科室代码">
			</el-table-column>
			<el-table-column prop="deptName" label="科室名称">
			</el-table-column>
			<el-table-column prop="name" label="调整科目">
			</el-table-column>
			<el-table-column prop="adgustValue" label="调整金额">
			</el-table-column>
			<el-table-column prop="confirmFlag" label="审核标志">
			</el-table-column>
			<el-table-column prop="adgustReason" label="调整原因">
			</el-table-column>

			<el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<el-button 
						@click="getPersonDataInfo(scope.row)" 
						type="text" size="small">
						查看
					</el-button>
					<el-button v-if="scope.row.confirmFlag === '未审核'"
						@click="handleEdit(scope.row)"
						type="text" size="small">
						编辑
					</el-button>
					<el-button v-if="scope.row.confirmFlag === '未审核'"
						@click="handleDelete(scope.row)"
						type="text" size="small">
						删除
					</el-button>
				</template>
				
			</el-table-column>
		</el-table>
		<div class="pagination-container">
			<el-pagination 
				@size-change="handleSizeChange" 
				@current-change="handleCurrentChange" 
				:current-page="listQuery.currentPage"
				:page-sizes="[10, 15, 20, 25, 30]" 
				:page-size="listQuery.pagesize" 
				layout="total, sizes, prev, pager, next, jumper"
				background
				:total="total">
			</el-pagination>
		</div>
		<!-- 编辑框 -->
		<person-edit-dialog 
			v-if="editStatus"
			:dialogStatus="dialogStatus" 
			:dialogFormVisible="dialogFormVisible"
			:departmentParams="departmentParams"
			
			:personData="personData"
			@closedialog="closedialog"
			@getList="getList">
		</person-edit-dialog>
		<!-- 新增框 -->
		<data-new-dialog 
			v-if="addStatus"
			:dialogStatus="dialogStatus" 
			:dialogFormVisible="dialogFormVisible"
			:departmentParams="departmentParams"
			:sflbParams="costTypeParams"
			:personData="personData"
			@closedialog="closedialog"
			@getList="getList">
		</data-new-dialog>
	</div>
</template>

<script>
	import { fetchDataList,deleteCostAdjustData,costAdjustExcelTemplate,getBaseCostTypeWithId } from '@/api/costAdjust'
	import { getDepartmentParam,getDepartmentParamWithId} from '@/api/department'
	// import { getPositionList } from '@/api/position'
	import waves from '@/directive/waves'
	import { formatDate } from '@/utils/date'
	import personEditDialog from './components/CostAdjustEditDialog'
	import UploadExcel from './components/UploadExcel'
	import { handleDownloadExcel } from '@/vendor/exportReportExcel'
	import DataNewDialog from './components/NewAdjustDialog'
	import { getCostTypeList,saveCostTypeData } from '@/api/costAdjust'
	export default {
		directives: { waves },
		name: 'Person',
		components: { personEditDialog, UploadExcel,DataNewDialog },
		data() {
			return {
				list: null,
				total: 0,
				listLoading: false,
				remoteLoading: false,
				listQuery: {
					currentPage: 1,
					pagesize: 10,
					yearMonth: null,
					department: null,
					status: ''
				},
				costTypeParams: [],
				departmentParams: [],
				departmentParamsWithId: [],	
				positionParams: [],			
				fuzzyQueryPerParams: [],
				editStatus: false,
				addStatus:false,
				dialogStatus: '',
				dialogFormVisible: false,
				personData: {},
				adjustTotal:0.00
			}
		},
		created() {
			//this.getList()
		},
		mounted() {
			this.getCostTypeParams()
			this.setDefaultYearmonth()
			this.getDepartmentParams()
			this.getDepartmentParamsWithId()
			this.getBaseCostTypeWithIdParams()
		},
		methods: {
			getCostTypeParams() {
			var self = this
			getCostTypeList().then(response => {
			  self.costTypeParams = response.data
			})
		},
			setDefaultYearmonth() {
				var self = this
				const month = new Date().getMonth()
				var defYearmonth = new Date(new Date().setMonth(month, 1))
				const ymStr = formatDate(defYearmonth, 'yyyy-MM')
				self.listQuery.yearMonth = ymStr
			},
			getList() {
				var self = this
				self.listLoading = true
				self.listQuery.status = self.listQuery.status == null ? '' : self.listQuery.status
				const query = self.listQuery
				// console.log(self.listQuery.yearMonth);
				fetchDataList(query).then(response => {
					self.list = response.data.FillDataList
					self.total = response.data.total
					self.adjustTotal = response.data.adjustTotal
					self.listLoading = false
				})
			},
			
			tableRowClassName({row, rowIndex}) {
        // if (row.positionName === '科主任') {
        //   return 'kzr-row';
        // } else if (row.positionName === '护士长') {
        //   return 'hsz-row';
        // }
        return '';
      },
			handleFilter() {
				this.listQuery.currentPage = 1
				this.getList()
			},
			handleSizeChange(size) {
				this.listQuery.pagesize = size
				this.getList()
			},
			handleCreate() {
				this.editStatus = true
				this.dialogStatus = '新建调整成本信息'
				this.dialogFormVisible = true
				this.personData = {
					id: null,
					deptCode: '',
					deptName:'',
					name: null,
					adgustValue: null,
					confirmFlag: null,
					adgustReason: ''
				}
			},
			handleCreateMore() {
				 this.editStatus = false
				this.addStatus = true
				 this.dialogStatus = '新建多条成本调整信息'
				this.dialogFormVisible = true
				// this.personData = {
				// 	id: null,
				// 	yearMonth: null,
				// 	incomeType: null,
				// 	deptmentId1: null,
				// 	originalValue1: 0.00,
				// 	ratio1: 0.00,
				// 	modifyValue1: 0.00,
				// 	deptmentId2: null,
				// 	originalValue2: 0.00,
				// 	ratio2: 0.00,
				// 	modifyValue2: 0.00,
				// 	modifyreason:''
				// }
			},
			handleEdit(data) {
				this.editStatus = true
				this.dialogStatus = '编辑调整成本信息'
				this.dialogFormVisible = true
				this.personData = data
			},
			getPersonDataInfo(data) {
				this.editStatus = true
				this.dialogStatus = '查看调整成本信息'
				this.dialogFormVisible = true
				this.personData = data
			},
			closedialog() {
				this.editStatus = false
				this.addStatus = false
				this.dialogStatus = ''
				this.dialogFormVisible = false
			},
			handleCurrentChange(currentPage) {
				this.listQuery.currentPage = currentPage
				this.getList()
			},
			handleDelete(data){
				this.$confirm('此操作将永久删除'+data.name+'的成本调整记录, 是否继续?', '提示', {
				confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					deleteCostAdjustData(data).then(res => {
						let resStatus = res.status
						if (resStatus == 200) {
							this.$message({
							type: 'success',
							message: '删除成功!'
							});
							this.getList()
						}
					})
				}).catch(() => {
					this.$message({
					type: 'info',
					message: '已取消删除'
					});          
				});
			},
			getDepartmentParams() {
				getDepartmentParam().then(response => {
					this.departmentParams = response.data
				})
			},
			getDepartmentParamsWithId() {
				getDepartmentParamWithId().then(response => {
					this.departmentParamsWithId = response.data
				})
			},
			getBaseCostTypeWithIdParams() {
				getBaseCostTypeWithId().then(response => {
					let positionParams = [];
					positionParams.push('科室ID不能删除')
					positionParams.push('科室所属')
					positionParams.push('科室类型')
					positionParams.push('科室')
					response.data.map(item => {
						positionParams.push(item.header)
					})
					positionParams.push('X-调整原因')
					this.positionParams = positionParams
				})
			},
			
			filterStatus(value, row) {
				return row.status === value
			},
			exportExcel(){
				//departmentParams: [],	
				// positionParams: [],	
				// location.href("api/CostAdjust/costAdjustExcelTemplate")
				// costAdjustExcelTemplate().then(response => {
				// 	console.log('成功  正在下載');
				// })
				// console.log(this.departmentParams)
				// console.log(this.positionParams)
				var self = this
				var list = self.departmentParamsWithId
				const filename = 'YYYY-MM&成本调整'
				var headers = self.positionParams
				var filterVals = ['id','information','category','name']
				handleDownloadExcel(list, filename, headers, filterVals)
			},

			importExcel(data){
				console.log(data)
			}
		}
	}
</script>

<style>
  .el-table .kzr-row {
    background: oldlace;
  }

  .el-table .hsz-row {
    background: #f0f9eb;
  }
</style>
