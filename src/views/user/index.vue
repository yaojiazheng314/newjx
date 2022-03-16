<template>
	<div class="app-container">
		<div class="filter-container">
			<el-select 
				v-model="listQuery.user" 
				filterable clearable 
				placeholder="选择或输入用户别名" 
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
			<el-select 
				v-model="listQuery.role" 
				filterable clearable 
				placeholder="选择或输入角色" 
				class="searchClass">
				<el-option 
					v-for="item in roleParams" 
					:key="item.roleId" 
					:label="item.name" 
					:value="item.roleId">
					<span style="float: left">{{ item.name }}</span>
					<span style="float: right; color: #8492a6; font-size: 13px">
						{{ item.userNum }}用户
					</span>
				</el-option>
			</el-select>
			<el-button v-waves type="primary" size="mini" @click="handleFilter" round>
				查 询
			</el-button>
			<el-tooltip 
				class="item" effect="dark" 
				content="注册用户" placement="right">
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
			<el-table-column prop="username" label="用户名">
			</el-table-column>
			<el-table-column prop="name" label="别名">
			</el-table-column>
			<el-table-column prop="personName" label="系统对应人员">
			</el-table-column>
			<el-table-column prop="departmentName" label="所属科室">
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
		<user-edit-dialog 
			v-if="editStatus"
			:dialogStatus="dialogStatus" 
			:dialogFormVisible="dialogFormVisible"
			:userData="userData"
			@closedialog="closedialog"
			@getList="getList"
			@getUserParams="getUserParams">
		</user-edit-dialog>
	</div>
</template>

<script>
	import { fetchUser, getUserParam } from '@/api/user'
	import { getDepartmentParam	} from '@/api/department'
	import { getRoleList } from '@/api/role'
	import waves from '@/directive/waves'
	import UserEditDialog from './components/UserEditDialog'
	export default {
		name: 'User',
		components: { UserEditDialog },
		directives: { waves },
		data() {
			return {
				list: null,
				total: 0,
				listLoading: false,
				listQuery: {
					currentPage: 1,
					pagesize: 10,
					user: null,
					department: null,
					role: null
				},
				userParams: [],
				departmentParams: [],
				roleParams: [],
				editStatus: false,
				dialogStatus: '',
				dialogFormVisible: false,
				userData: {}
			}
		},
		created() {
			this.getList()
		},
		mounted() {
			this.getUserParams()
			this.getDepartmentParams()
			this.getRoleParams()
		},
		methods: {
			getList() {
				var self = this
				self.listLoading = true
				const query = self.listQuery
				fetchUser(query).then(response => {
					self.list = response.data.users
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
				this.dialogStatus = '注册用户'
				this.dialogFormVisible = true
				this.userData = {
					id: null,
					username: '',
					person: null,
					roles: []
				}
			},
			handleEdit(data) {
				this.editStatus = true
				this.dialogStatus = '编辑用户'
				this.dialogFormVisible = true
				this.userData = data
			},
			closedialog() {
				this.editStatus = false
				this.dialogStatus = ''
				this.dialogFormVisible = false
			},
			handleCurrentChange(currentPage) {
				this.listQuery.currentPage = currentPage
				this.getList()
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
			getRoleParams() {
				getRoleList().then(res => {
					this.roleParams = res.data
				})
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
