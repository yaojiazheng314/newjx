<template>
	<div class="app-container">
		<div class="filter-container">
			<!-- 成本类别名称模糊查询 -->
			<el-autocomplete
				v-model="listQuery.name"
				:fetch-suggestions="querySearchName"
				:trigger-on-focus="false"
				placeholder="输入成本类别名称查询"
				style="width: 230px;">
			</el-autocomplete>	
			<!-- 查询按钮 -->
			<el-button
			 v-waves
			 size="mini"
			 type="primary"
			 icon="el-icon-search"
			 @click="handleFilter">
				查询
			</el-button>
		</div>
		<!-- 收费类别列表 -->
		<el-table 
			:data="list" 
			v-loading="loading" 
			style="width: 100%">
			<el-table-column 
				
				prop="code" 
				label="成本类别编码"
				width="200">
			</el-table-column>
			<el-table-column 
				
				prop="name" 
				label="成本类别名称"
				width="200">
			</el-table-column>

			<el-table-column 
				label="操作" width="100">
				<template slot-scope="scope">
					
					 <el-button 
						
						@click="editAssignee(scope.row)"
						type="text" size="small">
						绑定
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

		<assignee-dialog
			v-if="assigneeStatus"
			:assDialogStatus="assDialogStatus" 
			:assDialogVisible="assDialogVisible"
			:feedBackData="feedBackData"
			@closeAssigneeDialog="closeAssigneeDialog"
			@getList="getList">
		</assignee-dialog>
	</div>

	
</template>

<script>
import waves from '@/directive/waves'
import countTo from 'vue-count-to'
import { fuzzyQueryCostTypeName, 
				 fetchCostTypeList } from '@/api/binding'
import AssigneeDialog from './components/BindDialog'
export default {
	name: 'Basis',
	directives: { waves },
	components: { countTo,AssigneeDialog },
	data() {
		return {
			list: null,
			total: 0,
			loading: false,
			listQuery: {
				currentPage: 1,
				pagesize: 10,
				name: '' //收费类别名称模糊查询
			},
				assigneeStatus: false,
				assDialogStatus: '',
				assDialogVisible: false,
				feedBackData: {}
		}
	},
	created() {
		this.getList()
	},
	methods: {
		getList() {
			var self = this
			self.loading = true
			const query = self.listQuery
			fetchCostTypeList(query).then(response => {
				const chargeTypes = response.data.chargeTypes
				self.list = chargeTypes.map(v => {
					self.$set(v, 'edit', false)
					self.$set(v, 'subLoading', false)
					return v
				})
				self.total = response.data.total
				self.loading = false
			})
		},
		/* 获取模糊查询收费类别名称内容 */
		querySearchName(queryString, cb) {
			let sugParam = {
				keyword: queryString
			}
			fuzzyQueryCostTypeName(sugParam).then(res => {
				var suggestions = res.data
				cb(suggestions)
			})
		},

		/* 分页查询 */
		handleFilter() {
			this.listQuery.currentPage = 1
			this.getList()
		},
		handleSizeChange(size) {
			this.listQuery.pagesize = size
			this.getList()
		},
		handleCurrentChange(currentPage) {
			this.listQuery.currentPage = currentPage
			this.getList()
		},
		editBindHISType(data) {
				this.bindHISTypeStatus = true
				this.bindHISTypeDialogStatus = data.name + '绑定HIS成本分类'
				this.bindHISTypeDialogVisible = true
				this.bindHISTypeData = data				
			},
		closedialog() {
				this.editStatus = false
				this.dialogStatus = ''
				this.dialogFormVisible = false
				this.feedBackData = {}
			},
			editAssignee(data) {
				this.assigneeStatus = true
				this.assDialogStatus = data.name + '绑定HIS成本分类'
				this.assDialogVisible = true
				this.feedBackData = data
			},
			closeAssigneeDialog() {
				this.assigneeStatus = false
				this.assDialogStatus = ''
				this.assDialogVisible = false
				this.feedBackData = {}
			}

	}
}
</script>
<style>
</style>
