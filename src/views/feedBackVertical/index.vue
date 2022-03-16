<template>
	<div class="app-container">
		<div class="filter-container">
			<el-select 
				v-model="listQuery.feedBackItem" 
				filterable clearable 
				placeholder="选择或输入分配项"
				class="searchClass">
				<el-option 
					v-for="v in verticalFbParams" 
					:key="v.id" 
					:label="v.name" 
					:value="v.id">
					<span style="float: left">{{ v.name }}</span>
				</el-option>
			</el-select>
			<el-select 
				v-model="listQuery.department" 
				filterable clearable 
				placeholder="选择或输入科室" 
				class="searchClass">
				<el-option 
					v-for="d in departmentParams" 
					:key="d.id" 
					:label="d.name + '_' + d.type" 
					:value="d.id">
					<span style="float: left">{{ d.name }}</span>
					<span style="float: right; color: #8492a6; font-size: 13px">
						{{ d.type }}
					</span>
				</el-option>
			</el-select>
			<el-date-picker
				v-model="listQuery.yearmonth"
				type="month"
				placeholder="选择月"
				format="yyyy 年 M 月"
				value-format="yyyy-MM"
				:clearable="false"
				:editable="false"
				@change="handleFilter"
				class="searchClass">
			</el-date-picker>
			<el-button 
				v-waves type="primary" 
				size="mini" 
				@click="handleFilter" 
				round>
				查 询
			</el-button>
		</div>
		
		<el-table 
			:data="list" 
			v-loading="listLoading" 
			stripe
			style="width: 100%">
			<el-table-column prop="feedBackItemName" label="分配项">
			</el-table-column>
			<el-table-column prop="assigneeNum" label="分配科室">
				<template slot-scope="scope">
					<count-to
					  :start-val="startVal"
					  :end-val="scope.row.assigneeNum"
					  :duration="duration"
					  :separator="separator"
						prefix="共"
					  suffix="科室"
					  :autoplay="true"
						class="example-department"/>
				</template>
			</el-table-column>
			<el-table-column prop="sumVal" label="分配总额">
				<template slot-scope="scope">
					<count-to
					  :start-val="startVal"
					  :end-val="scope.row.sumVal"
					  :duration="duration"
					  :separator="separator"
					  :autoplay="true"
						class="example-department"/>
				</template>
			</el-table-column>
			<el-table-column prop="vdDeptNum" label="已分配科室">
				<template slot-scope="scope">
					<count-to
					  :start-val="startVal"
					  :end-val="scope.row.vdDeptNum"
					  :duration="duration"
					  :separator="separator"
						prefix="已分配"
						suffix="科室"
					  :autoplay="true"
						class="example-person"/>
				</template>
			</el-table-column>
			<el-table-column prop="vdSumVal" label="已分配值">
				<template slot-scope="scope">
					<count-to
					  :start-val="startVal"
					  :end-val="scope.row.vdSumVal"
					  :duration="duration"
					  :separator="separator"
					  :autoplay="true"
						class="example-person"/>
				</template>
			</el-table-column>
			<el-table-column align="center" label="操作" width="100">
				<template slot-scope="scope">
					<el-tag v-if="accountStatus" type="success">
						已封账
					</el-tag>
					<el-button 
						v-else
						 @click="fillVerticalData(scope.row)"
						type="primary" size="mini" plain round>
						分配填报
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
		<!-- 垂直分配填报 -->
		<vertical-data-dialog
			v-if="verticalStatus"
			:dialogStatus="dialogStatus" 
			:dialogVisible="dialogVisible"
			:feedBackData="feedBackData"
			@closeDialog="closeDialog"
			@getList="getList">
		</vertical-data-dialog>
	</div>
</template>

<script>
	import { getVerticalFbParams, getVerticalList } from '@/api/feedBack'
	import { getDepartmentParam	} from '@/api/department'
	import { formatDate } from '@/utils/date'
	import waves from '@/directive/waves'
	import countTo from 'vue-count-to'
	import VerticalDataDialog from './components/VerticalDataDialog'
	export default {
		name: 'DeptRun',
		directives: { waves },
		components: { countTo, VerticalDataDialog },
		data() {
			return {
				list: [],
				total: 0,
				listLoading: false,
				listQuery: {
					currentPage: 1,
					pagesize: 10,
					feedBackItem: null,
					department: null,
					yearmonth: '',
					userID: null
				},
				accountStatus: false,
				verticalFbParams: [],
				departmentParams: [],
				startVal: 0,
				duration: 2000,
				decimals: 2,
				separator: ',',
				autoplay: true,
				feedBackData : {},
				verticalStatus: false,
				dialogStatus: '',
				dialogVisible: false
			}
		},
		mounted() {
			this.setDefaultYearmonth()
			this.getUserInfo()
			this.getList()
			this.getVerticalFbParams()
			this.getDepartmentParams()
		},
		methods: {
			setDefaultYearmonth() {
				var self = this
				const month = new Date().getMonth() - 1
				var defYearmonth = new Date(new Date().setMonth(month, 1))
				const ymStr = formatDate(defYearmonth, 'yyyy-MM')
				self.listQuery.yearmonth = ymStr
			},
			getUserInfo() {
				var self = this
				self.listQuery.userID = self.$store.getters.userID
			},
			getList() {
				var self = this
				self.listLoading = true
				const query = self.listQuery
				getVerticalList(query).then(response => {
					self.accountStatus = response.data.accountStatus
					self.list = response.data.vdItems
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
			handleCurrentChange(currentPage) {
				this.listQuery.currentPage = currentPage
				this.getList()
			},
			getVerticalFbParams() {
				var self = this
				const query = self.listQuery
				getVerticalFbParams(query).then(response => {
					this.verticalFbParams = response.data
				})
			},
			getDepartmentParams() {
				getDepartmentParam().then(response => {
					this.departmentParams = response.data
				})
			},
			fillVerticalData(data) {
				this.verticalStatus = true,
				this.dialogStatus = data.feedBackItemName + '的垂直分配数据',
				this.feedBackData = {
					feedBackItem: data.feedBackItem,
					yearmonth: this.listQuery.yearmonth,
					feedBackItemName: data.feedBackItemName,
					sumVal: data.sumVal
				}
				this.dialogVisible = true
			},
			closeDialog() {
				this.verticalStatus = false,
				this.dialogStatus = '',
				this.dialogVisible = false
			}
		}
	}
</script>
