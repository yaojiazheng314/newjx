<template>
	<div class="app-container">
		<div class="filter-container">
			<el-select 
				v-model="listQuery.bnsDataItem" 
				filterable clearable 
				placeholder="选择或输入核算因子"
				class="searchClass">
				<el-option 
					v-for="item in bnsDataItemParams" 
					:key="item.id" 
					:label="item.name" 
					:value="item.id">
					<span style="float: left">{{ item.name }}</span>
					<span style="float: right; color: #8492a6; font-size: 13px">
						{{ item.type }}
					</span>
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
				v-model="listQuery.dataSource" 
				filterable clearable 
				placeholder="来源方式"
				class="searchClass">
				<el-option 
					v-for="item in dataSources" 
					:key="item" 
					:label="item" 
					:value="item">
					<span style="float: left">{{ item }}</span>
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
				content="新建核算因子" placement="right">
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
			<el-table-column 
				prop="type" label="适用类别" 
				:filters="[{ text: '科室', value: '科室' },
									 { text: '人员', value: '人员' }]"
			  :filter-method="filterType" filter-placement="bottom-end">
				<template slot-scope="scope">
					<el-tag 
						:type="scope.row.type === '科室' ? 
						'info' : 'warning'" 
						disable-transitions>{{ scope.row.type }}</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="fillDepartmentName" label="填报科室">
			</el-table-column>
			<el-table-column prop="dataSource" label="数据来源">
			</el-table-column>
			<el-table-column prop="departmentNum" label="适用科室">
				<template slot-scope="scope">
					<el-button 
						type="text" size="small"
						@click="handleAddDepartments(scope.row)"
						:disabled="scope.row.type !== '科室' 
						|| scope.row.dataSource !== '手动填报'">
						共{{ scope.row.departmentNum }}科室
					</el-button>
				</template>
			</el-table-column>
			<el-table-column prop="personNum" label="适用人员">
				<template slot-scope="scope">
					<el-button 
						type="text" size="small"
						@click="handleAddPeople(scope.row)"
						:disabled="scope.row.type !== '人员' 
						|| scope.row.dataSource !== '手动填报'">
						共{{ scope.row.personNum }}人员
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
		<data-item-edit-dialog 
			v-if="editStatus"
			:dialogStatus="dialogStatus" 
			:dialogFormVisible="dialogFormVisible"
			:departmentParams="departmentParams"
			:itemData="itemData"
			@closedialog="closedialog"
			@getList="getList"
			@getDataItemParams="getDataItemParams">
		</data-item-edit-dialog>
		<!-- 添加手动填报科室 -->
		<add-departments
			v-if="addDeptStatus"
			:addDeptDialogStatus="addDeptDialogStatus"
			:addDeptVisible="addDeptVisible"
			:itemData="itemData"
			@closeAddDeptDialog="closeAddDeptDialog"
			@getList="getList"
			@getDataItemParams="getDataItemParams">			
		</add-departments>
		<!-- 添加手动填报人员 -->
		<add-people
			v-if="addPerStatus"
			:addPerDialogStatus="addPerDialogStatus"
			:addPerVisible="addPerVisible"
			:itemData="itemData"
			@closeAddPerDialog="closeAddPerDialog"
			@getList="getList"
			@getDataItemParams="getDataItemParams">
		</add-people>
	</div>
</template>

<script>
	import { getBnsDataItemList, getDataItemParam } from '@/api/bnsDataItem'
	import { getPersonParam } from '@/api/person'
	import { getDepartmentParam	} from '@/api/department'
	import waves from '@/directive/waves'
	import DataItemEditDialog from './components/DataItemEditDialog'
	import AddDepartments from './components/AddDepartments'
	import AddPeople from './components/AddPeople'
	export default {
		name: 'DataItem',
		components: { DataItemEditDialog, AddDepartments, AddPeople },
		directives: { waves },
		data() {
			return {
				list: null,
				total: 0,
				listLoading: false,
				listQuery: {
					currentPage: 1,
					pagesize: 10,
					bnsDataItem: null,
					person: null,
					department: null,
					dataSource: null
				},
				bnsDataItemParams: [],
				personParams: [],
				departmentParams: [],
				dataSources: ['手动填报', '接口导入', '目标导入', '考核导入'],
				editStatus: false,
				dialogStatus: '',
				dialogFormVisible: false,
				itemData: {},
				addDeptStatus: false,
				addDeptDialogStatus: '',
				addDeptVisible: false,
				addPerStatus: false,
				addPerDialogStatus: '',
				addPerVisible: false
			}
		},
		created() {
			this.getList()
		},
		mounted() {
			this.getDataItemParams()
			this.getPersonParams()
			this.getDepartmentParams()
		},
		methods: {
			getList() {
				var self = this
				self.listLoading = true
				const query = self.listQuery
				getBnsDataItemList(query).then(response => {
					self.list = response.data.dataItems
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
				this.dialogStatus = '新建核算因子'
				this.dialogFormVisible = true
				this.itemData = {
					id: null,
					name: '',
					defaultValue: 0.0,
					status: '启用',
					type: '科室',
					fillDepartment: null,
					dataSource: null,
					interfaceCode: null,
					category: null
				}
			},
			handleEdit(data) {
				this.editStatus = true
				this.dialogStatus = '编辑核算因子'
				this.dialogFormVisible = true
				this.itemData = data
			},
			closedialog() {
				this.editStatus = false
				this.dialogStatus = ''
				this.dialogFormVisible = false
				this.itemData = {}
			},
			handleAddDepartments(data) {
				this.addDeptStatus = true
				this.addDeptDialogStatus = '[' + data.name + ']' + '的适用科室'
				this.addDeptVisible = true
				this.itemData = data
			},
			closeAddDeptDialog() {
				this.addDeptStatus = false
				this.addDeptDialogStatus = ''
				this.addDeptVisible = false
				this.itemData = {}
			},
			handleAddPeople(data) {
				this.addPerStatus = true
				this.addPerDialogStatus = '[' + data.name + ']' + '的适用人员'
				this.addPerVisible = true
				this.itemData = data
			},
			closeAddPerDialog() {
				this.addPerStatus = false
				this.addPerDialogStatus = ''
				this.addPerVisible = false
				this.itemData = {}
			},
			handleCurrentChange(currentPage) {
				this.listQuery.currentPage = currentPage
				this.getList()
			},
			getDataItemParams() {
				getDataItemParam().then(response => {
					this.bnsDataItemParams = response.data
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
			filterStatus(value, row) {
				return row.status === value
			},
			filterType(value, row) {
				return row.type === value
			}
		}
	}
</script>
