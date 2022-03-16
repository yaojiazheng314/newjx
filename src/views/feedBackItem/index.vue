<template>
	<div class="app-container">
		<div class="filter-container">
			<el-select 
				v-model="listQuery.feedBack" 
				filterable clearable 
				placeholder="选择或输入分配项" 
				class="searchClass">
				<el-option 
					v-for="item in feedBackParams" 
					:key="item.id" 
					:label="item.name" 
					:value="item.id">
					<span style="float: left">{{ item.name }}</span>
				</el-option>
			</el-select>
			<el-select 
				v-model="listQuery.user" 
				filterable clearable 
				placeholder="选择或输入分配责任用户" 
				class="searchClass">
				<el-option 
					v-for="item in userParams" 
					:key="item.id" 
					:label="item.name + '_' + item.username" 
					:value="item.id">
					<span style="float: left">{{ item.name }}</span>
					<span style="float: right; color: #8492a6; font-size: 13px">
						{{ item.username }}
					</span>
				</el-option>
			</el-select>
			<el-select 
				v-model="listQuery.department" 
				filterable clearable 
				placeholder="选择或输入分配科室" 
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
			<el-button v-waves type="primary" size="mini" @click="handleFilter" round>
				查 询
			</el-button>
			<el-tooltip 
				class="item" effect="dark" 
				content="创建分配项" placement="right">
				<el-button 
					v-waves 
					type="primary" 
					icon="el-icon-edit" size="mini" @click="handleCreate" circle>
				</el-button>
			</el-tooltip>
		</div>

		<el-table 
			:data="list" 
			v-loading="listLoading" 
			style="width: 100%">
			<el-table-column prop="name" label="分配项">
			</el-table-column>
			<el-table-column 
				prop="status" label="状态" 
				:filters="[{ text: '启用', value: '启用' },
									 { text: '禁用', value: '禁用' }]"
			 :filter-method="filterStatus" filter-placement="bottom-end">
				<template slot-scope="scope">
					<el-tag 
						:type="scope.row.status === '启用' ? 
						'primary' : 'danger'" 
						disable-transitions>{{ scope.row.status }}</el-tag>
				</template>
			</el-table-column>
			<el-table-column 
				prop="type" label="关联数据项" 
				:filters="[{ text: '因子', value: 'item' },
									 { text: '公式', value: 'formula' }]"
			  :filter-method="filterTermType" filter-placement="bottom-end">
				<template slot-scope="scope">
					<el-tooltip 
						effect="dark" 
						:content="scope.row.termType === 'formula' ?
						'公式' : '因子'" 
						placement="right-start">
						<el-tag 
							:type="scope.row.termType === 'formula' ? 
							'info' : 'warning'" 
							disable-transitions>{{ scope.row.termName }}</el-tag>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column prop="vertical" label="是否垂直分配">
				<template slot-scope="scope">
					<el-tag 
						:type="scope.row.vertical === 1 ? 
						'success' : 'danger'" 
						effect="plain"
						disable-transitions>
						{{ scope.row.vertical === 1 ? '是' : '否' }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="verticalDeptName" label="垂直分配责任科室">
				<template slot-scope="scope">
					<span 
						v-if="scope.row.vertical === 0"
						class="example-nodata">
						暂无
					</span>
					<span 
						v-else-if="scope.row.vertical === 1"
						class="example-department">
						{{ scope.row.verticalDeptName }}
					</span>
				</template>
			</el-table-column>
			<el-table-column prop="assigneeNum" label="绩效分配">
				<template slot-scope="scope">
					<el-button 
						type="text" size="small"
						@click="editAssignee(scope.row)">
						共{{ scope.row.assigneeNum }}科室
					</el-button>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="100">
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
		<edit-dialog 
			v-if="editStatus"
			:dialogStatus="dialogStatus" 
			:dialogFormVisible="dialogFormVisible"
			:feedBackData="feedBackData"
			@closedialog="closedialog"
			@getList="getList"
			@getFeedBackParams="getFeedBackParams">
		</edit-dialog>
		<!-- 分配科室 -->
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
	import { getUserParam } from '@/api/user'
	import { getDepartmentParam	} from '@/api/department'
	import { getFeedBackParam, 
					 getTermParam, 
					 fetchFeedBack } from '@/api/feedBack'
	import waves from '@/directive/waves'
	import EditDialog from './components/EditDialog'
	import AssigneeDialog from './components/AssigneeDialog'
	export default {
		name: 'FeedBackItem',
		components: { EditDialog, AssigneeDialog },
		directives: { waves },
		data() {
			return {
				list: null,
				total: 0,
				listLoading: false,
				listQuery: {
					currentPage: 1,
					pagesize: 10,
					feedBack: null,
					user: null, //分配责任用户
					department: null
				},
				feedBackParams: [],
				userParams: [],
				departmentParams: [],
				editStatus: false,
				dialogStatus: '',
				dialogFormVisible: false,
				assigneeStatus: false,
				assDialogStatus: '',
				assDialogVisible: false,
				feedBackData: {}
			}
		},
		created() {
			this.getList()
		},
		mounted() {
			this.getFeedBackParams()
			this.getUserParams()
			this.getDepartmentParams()
		},
		methods: {
			getList() {
				var self = this
				self.listLoading = true
				const query = self.listQuery
				fetchFeedBack(query).then(response => {
					self.list = response.data.fbItems
					self.total = response.data.total
					self.listLoading = false
				})
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
				this.dialogStatus = '创建分配项'
				this.dialogFormVisible = true
				this.feedBackData = {
					id: null,
					name: '',
					status: '启用',
					termType: '',
					term: null,
					vertical: false,
					verticalDept: null
				}
			},
			handleEdit(data) {
				this.editStatus = true
				this.dialogStatus = '编辑分配项[' + data.name + "]"
				this.dialogFormVisible = true
				this.feedBackData = {
					id: data.id,
					name: data.name,
					status: data.status,
					termType: data.termType === 'formula' ? '公式' : '因子',
					term: data.term,
					vertical: data.vertical === 1 ? '是' : '否',
					verticalDept: data.verticalDept === 0 ? null : data.verticalDept
				}
			},
			closedialog() {
				this.editStatus = false
				this.dialogStatus = ''
				this.dialogFormVisible = false
				this.feedBackData = {}
			},
			handleCurrentChange(currentPage) {
				this.listQuery.currentPage = currentPage
				this.getList()
			},
			getFeedBackParams() {
				getFeedBackParam().then(res => {
					this.feedBackParams = res.data
				})
			},
			getUserParams() {
				getUserParam().then(response => {
					this.userParams = response.data
				})
			},
			getDepartmentParams() {
				getDepartmentParam().then(response => {
					this.departmentParams = response.data
				})
			},
			filterStatus(value, row) {
				return row.status === value
			},
			filterTermType(value, row) {
				return row.termType === value
			},
			editAssignee(data) {
				this.assigneeStatus = true
				this.assDialogStatus = data.name + '绩效分配科室'
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
