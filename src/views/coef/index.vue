<template>
	<div class="app-container">
		<div class="filter-container">
			<el-select 
				v-model="listQuery.bnsCoef" 
				filterable clearable 
				placeholder="选择或输入核算权重"
				class="searchClass">
				<el-option 
					v-for="item in coefParams" 
					:key="item.id" 
					:label="item.name" 
					:value="item.id">
					<span style="float: left">{{ item.name }}</span>
					<el-tooltip 
							:content="'默认值: ' + item.defaultValue" 
							placement="right">
						<span style="float: right; color: #8492a6; font-size: 13px">
							{{ item.defaultValue }}
						</span>
					</el-tooltip>	
				</el-option>
			</el-select>
			<el-select 
				v-model="listQuery.person" 
				filterable clearable 
				placeholder="选择或输入姓名" 
				class="searchClass">
				<el-option 
					v-for="item in personParams" 
					:key="item.id" 
					:label="item.name + '_' + item.departmentName" 
					:value="item.id">
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
				v-model="listQuery.position" 
				filterable clearable 
				placeholder="选择或输入职位"
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
			<el-button 
				v-waves type="primary" 
				size="mini" 
				@click="handleFilter" 
				round>
				查 询
			</el-button>
			<el-tooltip 
				class="item" effect="dark" 
				content="新建核算权重" placement="right">
				<el-button 
					v-waves 
					type="primary" 
					icon="el-icon-edit" size="mini" 
					@click="handleCreate" 
					circle>
				</el-button>
			</el-tooltip>
		</div>

		<el-table 
			:data="list" 
			v-loading="listLoading" 
			style="width: 100%">
			<el-table-column prop="name" label="名称">
			</el-table-column>
			<el-table-column prop="defaultValue" label="默认值">
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
			<el-table-column prop="departmentNum" label="特定科室">
				<template slot-scope="scope">
					<el-button 
						type="text" size="small"
						@click="handleAddDepartments(scope.row)">
						共{{ scope.row.departmentNum }}科室
					</el-button>
				</template>
			</el-table-column>
			<el-table-column prop="personNum" label="特定人员">
				<template slot-scope="scope">
					<el-button 
						type="text" size="small"
						@click="handleAddPeople(scope.row)">
						共{{ scope.row.personNum }}人员
					</el-button>
				</template>
			</el-table-column>
			<el-table-column prop="positionNum" label="特定职位">
				<template slot-scope="scope">
					<el-button 
						type="text" size="small"
						@click="handleAddPositions(scope.row)">
						共{{ scope.row.positionNum }}职位
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
		<coef-edit-dialog 
			v-if="editStatus"
			:dialogStatus="dialogStatus" 
			:dialogFormVisible="dialogFormVisible"
			:coefData="coefData"
			@closedialog="closedialog"
			@getList="getList"
			@getCoefParams="getCoefParams">
		</coef-edit-dialog>
		<!-- 添加权重特定科室 -->
		<add-departments
			v-if="addDeptStatus"
			:addDeptDialogStatus="addDeptDialogStatus"
			:addDeptVisible="addDeptVisible"
			:coefData="coefData"
			:runYearMonthList="runYearMonthList"
			@closeAddDeptDialog="closeAddDeptDialog"
			@getList="getList"
			@getCoefParams="getCoefParams">			
		</add-departments>
		<!-- 添加权重特定人员 -->
		<add-people
			v-if="addPerStatus"
			:addPerDialogStatus="addPerDialogStatus"
			:addPerVisible="addPerVisible"
			:coefData="coefData"
			:runYearMonthList="runYearMonthList"
			@closeAddPerDialog="closeAddPerDialog"
			@getList="getList"
			@getCoefParams="getCoefParams">
		</add-people>
		<!-- 添加权重特定职位 -->
		<add-positions
			v-if="addPosStatus"
			:addPosDialogStatus="addPosDialogStatus"
			:addPosVisible="addPosVisible"
			:coefData="coefData"
			:runYearMonthList="runYearMonthList"
			@closeAddPosDialog="closeAddPosDialog"
			@getList="getList"
			@getCoefParams="getCoefParams">
		</add-positions>
	</div>
</template>

<script>
	import { getcoefList, getCoefParam } from '@/api/bnsCoef'
	import { getRunYearMonthList } from '@/api/bnsForDeptRun'
	import { getPersonParam } from '@/api/person'
	import { getDepartmentParam	} from '@/api/department'
	import { getPositionList } from '@/api/position'
	import waves from '@/directive/waves'
	import CoefEditDialog from './components/CoefEditDialog'
	import AddDepartments from './components/AddDepartments'
	import AddPeople from './components/AddPeople'
	import AddPositions from './components/AddPositions'
	export default {
		name: 'Coef',
		components: { CoefEditDialog, AddDepartments, AddPeople, AddPositions },
		directives: { waves },
		data() {
			return {
				list: null,
				total: 0,
				listLoading: false,
				listQuery: {
					currentPage: 1,
					pagesize: 10,
					bnsCoef: null,
					department: null,
					person: null,
					position: null
				},
				coefParams: [],
				personParams: [],
				departmentParams: [],
				positionParams: [],
				editStatus: false,
				dialogStatus: '',
				dialogFormVisible: false,
				coefData: {},
				addDeptStatus: false,
				addDeptDialogStatus: '',
				addDeptVisible: false,
				addPerStatus: false,
				addPerDialogStatus: '',
				addPerVisible: false,
				addPosStatus: false,
				addPosDialogStatus: '',
				addPosVisible: false,
				runYearMonthList: []
			}
		},
		created() {
			this.getList()
		},
		mounted() {
			this.getCoefParams()
			this.getPersonParams()
			this.getDepartmentParams()
			this.getPositionParams()
			this.getRunYearMonthLists()
		},
		methods: {
			getList() {
				var self = this
				self.listLoading = true
				const query = self.listQuery
				getcoefList(query).then(response => {
					self.list = response.data.coefs
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
				this.dialogStatus = '新建核算权重'
				this.dialogFormVisible = true
				this.coefData = {
					id: null,
					name: '',
					defaultValue: 0.0,
					status: '启用',
					type: '科室'
				}
			},
			handleEdit(data) {
				this.editStatus = true
				this.dialogStatus = '编辑核算权重'
				this.dialogFormVisible = true
				this.coefData = data
			},
			closedialog() {
				this.editStatus = false
				this.dialogStatus = ''
				this.dialogFormVisible = false
				this.coefData = {}
			},
			handleAddDepartments(data) {
				this.addDeptStatus = true
				this.addDeptDialogStatus = '[' + data.name + ']' + '的特定科室'
				this.addDeptVisible = true
				this.coefData = data
			},
			closeAddDeptDialog() {
				this.addDeptStatus = false
				this.addDeptDialogStatus = ''
				this.addDeptVisible = false
				this.coefData = {}
			},
			handleAddPeople(data) {
				this.addPerStatus = true
				this.addPerDialogStatus = '[' + data.name + ']' + '的特定人员'
				this.addPerVisible = true
				this.coefData = data
			},
			closeAddPerDialog() {
				this.addPerStatus = false
				this.addPerDialogStatus = ''
				this.addPerVisible = false
				this.coefData = {}
			},
			handleAddPositions(data) {
				this.addPosStatus = true
				this.addPosDialogStatus = '[' + data.name + ']' + '的特定职位'
				this.addPosVisible = true
				this.coefData = data
			},
			closeAddPosDialog() {
				this.addPosStatus = false
				this.addPosDialogStatus = ''
				this.addPosVisible = false
				this.coefData = {}
			},
			handleCurrentChange(currentPage) {
				this.listQuery.currentPage = currentPage
				this.getList()
			},
			getCoefParams() {
				getCoefParam().then(response => {
					this.coefParams = response.data
				})
			},
			getRunYearMonthLists(){
				getRunYearMonthList().then(response => {
					this.runYearMonthList = response.data
				})
			},
			getPersonParams() {
				getPersonParam().then(response => {
					this.personParams = response.data
				})
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
			},
			filterType(value, row) {
				return row.type === value
			}
		}
	}
</script>
