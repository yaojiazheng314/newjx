<template>
	<div class="app-container">
		<div class="filter-container">

			<el-input
			style="width: 300px;"
			v-model="listQuery.typeName"
			placeholder="输入名称搜索..."
			size="small"
			>
		</el-input>


			<el-button v-waves type="primary" size="mini" @click="handleFilter" round>
				查 询
			</el-button>
			<el-button v-waves type="primary" size="mini" @click="handleCreate" round>
				新增
			</el-button>


		</div>

		<el-table 
			:data="list" 
			v-loading="listLoading" 
			style="width: 100%"
			:row-class-name="tableRowClassName">
			<el-table-column prop="id" label="编码">
			</el-table-column>
			<el-table-column prop="feedBackTypeName" label="二次分配明细名称">
			</el-table-column>
			<el-table-column prop="status" label="启用状态">
			</el-table-column>


			<el-table-column label="操作" width="150">
				<template slot-scope="scope">

					<el-button 
						@click="handleEdit(scope.row)"
						type="text" size="small">
						编辑
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
		<data-edit-dialog 
			v-if="editStatus"
			:dialogStatus="dialogStatus" 
			:dialogFormVisible="dialogFormVisible"
			
			
			:personData="personData"
			@closedialog="closedialog"
			@getList="getList">
		</data-edit-dialog>
		<!-- 新增框 -->
		<data-new-dialog 
			v-if="addStatus"
			:dialogStatus="dialogStatus" 
			:dialogFormVisible="dialogFormVisible"
			:personData="personData"
			@closedialog="closedialog"
			@getList="getList">
		</data-new-dialog>
	</div>
</template>

<script>

	// import { getPositionList } from '@/api/position'
	import waves from '@/directive/waves'
	import { formatDate } from '@/utils/date'
	import DataEditDialog from './components/EditDialog'
	// import DataNewDialog from './components/NewDialog'
	import { getFeedBackTypeList,saveFeedBackType } from '@/api/feedBack'
	export default {
		directives: { waves },
		name: 'Person',
		components: { DataEditDialog },
		data() {
			return {
				list: null,
				total: 0,
				listLoading: false,
				remoteLoading: false,
				listQuery: {
					currentPage: 1,
					pagesize: 10,
					typeName: null,

				},

				editStatus: false,
				addStatus:false,
				dialogStatus: '',
				dialogFormVisible: false,
				personData: {},

			}
		},
		created() {
			//this.getList()
		},
		mounted() {
			this.getList();
		},
		methods: {
			
			getList() {
				var self = this
				self.listLoading = true
				
				const query = self.listQuery
				// console.log(self.listQuery.yearMonth);
				getFeedBackTypeList(query).then(response => {
					self.list = response.data.FBTypeItems
					self.total = response.data.total
					
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
				this.dialogStatus = '新建'
				this.dialogFormVisible = true
				this.personData = {
					id: null,
					feedBackTypeName: '',
					status:1
				
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
				this.dialogStatus = '编辑'
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
			
			
		
	
			
			filterStatus(value, row) {
				return row.status === value
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
