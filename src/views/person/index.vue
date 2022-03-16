<template>
	<div class="app-container">
		<div class="filter-container">
			<!-- 查询人员 -->
			<el-select
				v-model="listQuery.person"
				filterable clearable
				remote
				reserve-keyword
				placeholder="编码/姓名/所属科室/'全部'"
				:remote-method="remoteMethod"
				:loading="remoteLoading"
				style="width: 250px;"
				class="searchClass">
				<el-option
					v-for="item in fuzzyQueryPerParams"
					:key="item.id"
					:label="item.name"
					:value="item.id">
					<span style="float: left">{{ item.code }}</span>
					<span style="float: left">{{ item.name }}</span>
					<span style="float: right; color: #8492a6; font-size: 13px">
						{{ item.departmentName }}
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
				v-model="listQuery.status" 
				filterable clearable 
				placeholder="人员状态"
				class="searchClass">
				<el-option 
					v-for="item in personStatus" 
					:key="item" 
					:label="item" 
					:value="item">
					<span style="float: left">{{ item }}</span>
				</el-option>
			</el-select>
			<el-select 
				v-model="listQuery.position" 
				filterable clearable 
				placeholder="职位"
				class="searchClass">
				<el-option 
					v-for="item in positionParams" 
					:key="item.id" 
					:label="item.name" 
					:value="item.id">
					<span style="float: left">{{ item.name }}</span>
					<span style="float: right; color: #8492a6; font-size: 13px">
						{{ item.peopleNum }}人
					</span>
				</el-option>
			</el-select>
			<el-button v-waves type="primary" size="mini" @click="handleFilter" round>
				查 询
			</el-button>
			<el-tooltip 
				class="item" effect="dark" 
				content="新建人员信息" placement="right">
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
			style="width: 100%"
			:row-class-name="tableRowClassName">
			<el-table-column prop="code" label="编码">
			</el-table-column>
			<el-table-column prop="name" label="姓名">
			</el-table-column>
			<el-table-column prop="departmentName" label="所属科室">
			</el-table-column>
			<el-table-column 
				prop="status" label="状态" 
				:filters="[{ text: '在职', value: '在职' },
									 { text: '编外', value: '编外' },
									 { text: '离职', value: '离职' },
									 { text: '长期病休', value: '长期病休' },
									 { text: '返聘', value: '返聘' },
									 { text: '其他', value: '其他' }]"
			 :filter-method="filterStatus" filter-placement="bottom-end">
				<template slot-scope="scope">
					<el-tag 
						:type="scope.row.status === '在职' ? 
						'primary' : scope.row.status === '编外' ? 'success' : 'danger'" 
						disable-transitions>{{ scope.row.status }}</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="positionName" label="职位">
			</el-table-column>
			<el-table-column prop="professTitleName" label="职称">
			</el-table-column>
			<el-table-column label="操作" width="100">
				<template slot-scope="scope">
					<el-button 
						@click="getPersonDataInfo(scope.row)" 
						type="text" size="small">
						查看
					</el-button>
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
		<person-edit-dialog 
			v-if="editStatus"
			:dialogStatus="dialogStatus" 
			:dialogFormVisible="dialogFormVisible"
			:departmentParams="departmentParams"
			:positionParams="positionParams"
			:personData="personData"
			@closedialog="closedialog"
			@getList="getList">
		</person-edit-dialog>
	</div>
</template>

<script>
	import { fetchPeople, fuzzyQueryPerParam } from '@/api/person'
	import { getDepartmentParam	} from '@/api/department'
	import { getPositionList } from '@/api/position'
	import waves from '@/directive/waves'
	import PersonEditDialog from './components/PersonEditDialog'
	export default {
		name: 'Person',
		components: { PersonEditDialog },
		directives: { waves },
		data() {
			return {
				list: null,
				total: 0,
				listLoading: false,
				remoteLoading: false,
				listQuery: {
					currentPage: 1,
					pagesize: 10,
					person: null,
					department: null,
					status: '',
					position: null
				},
				departmentParams: [],
				personStatus: ['在职', '编外', '离职','返聘'],
				positionParams: [],
				fuzzyQueryPerParams: [],
				editStatus: false,
				dialogStatus: '',
				dialogFormVisible: false,
				personData: {}
			}
		},
		created() {
			this.getList()
		},
		mounted() {
			this.getDepartmentParams()
			this.getPositionParams()
		},
		methods: {
			getList() {
				var self = this
				self.listLoading = true
				self.listQuery.status = self.listQuery.status == null ? '' : self.listQuery.status
				const query = self.listQuery
				fetchPeople(query).then(response => {
					self.list = response.data.people
					self.total = response.data.total
					self.listLoading = false
				})
			},
			/* 模糊查询全院人员 */
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
			tableRowClassName({row, rowIndex}) {
        if (row.positionName === '科主任') {
          return 'kzr-row';
        } else if (row.positionName === '护士长') {
          return 'hsz-row';
        }
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
				this.dialogStatus = '新建人员信息'
				this.dialogFormVisible = true
				this.personData = {
					id: null,
					code: '',
					name: '',
					sex: '男',
					status: '在职',
					email: '',
					phone: '',
					idCard: '',
					position: null,
					professTitle: null,
					department: null
				}
			},
			handleEdit(data) {
				this.editStatus = true
				this.dialogStatus = '编辑人员信息'
				this.dialogFormVisible = true
				this.personData = data
			},
			getPersonDataInfo(data) {
				this.editStatus = true
				this.dialogStatus = '查看人员信息'
				this.dialogFormVisible = true
				this.personData = data
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
			getDepartmentParams() {
				getDepartmentParam().then(response => {
					this.departmentParams = response.data
				})
			},
			getPositionParams() {
				getPositionList().then(response => {
					this.positionParams = response.data
				})
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
