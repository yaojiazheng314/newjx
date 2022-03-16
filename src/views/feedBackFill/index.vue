<template>
	<div class="app-container">
		<div class="filter-container">
			<el-select 
				v-model="listQuery.feedBackItem" 
				filterable clearable 
				placeholder="选择或输入分配项"
				class="searchClass">
				<el-option 
					v-for="v in assigneeFbParams" 
					:key="v.id" 
					:label="v.name" 
					:value="v.id">
					<span style="float: left">{{ v.name }}</span>
				</el-option>
			</el-select>
			<el-select 
				v-model="listQuery.assigneeDept" 
				filterable clearable 
				placeholder="选择或输入科室" 
				class="searchClass">
				<el-option 
					v-for="d in assigneeDeptParams" 
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
			<el-button 
				v-waves 
				type="info" 
				size="mini" 
				@click="openCRDialog"
				plain>
				汇总表
				<i style="color: #20B2AA" 
					class="el-icon-s-data" />
			</el-button>
		</div>
		
		<el-table 
			:data="list" 
			v-loading="listLoading" 
			stripe
			style="width: 100%">
			<el-table-column prop="feedBackItemName" label="分配项">
			</el-table-column>
			<el-table-column prop="feedBackDeptName" label="分配科室">
				<template slot-scope="scope">
					<span class="example-department">
						{{ scope.row.feedBackDeptName }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="feedBackVal" label="分配绩效">
				<template slot-scope="scope">
					<count-to
					  :start-val="startVal"
					  :end-val="scope.row.feedBackVal"
					  :duration="duration"
					  :separator="separator"
					  :autoplay="true"
						class="example-department"/>
				</template>
			</el-table-column>
			<el-table-column prop="reportPerNum" label="已分配人数">
				<template slot-scope="scope">
					<count-to
					  :start-val="startVal"
					  :end-val="scope.row.reportPerNum"
					  :duration="duration"
					  :separator="separator"
						prefix="已分配"
						suffix="人"
					  :autoplay="true"
						class="example-person"/>
				</template>
			</el-table-column>
			<el-table-column prop="reportSumVal" label="已分配绩效">
				<template slot-scope="scope">
					<count-to
					  :start-val="startVal"
					  :end-val="scope.row.reportSumVal"
					  :duration="duration"
					  :separator="separator"
					  :autoplay="true"
						class="example-person"/>
				</template>
			</el-table-column>
			<el-table-column prop="status" label="状态">
				<template slot-scope="scope">
					<el-tag 
						:type="scope.row.status === 0 ? 
						'warning' : scope.row.status === 1 ? 'success' : 'info'" 
						disable-transitions>{{ scope.row.status === 0 ? '未上报' : scope.row.status === 1 ? '已上报' : '已审核'}}
						<i style="color: #20B2AA" 
							:class="scope.row.status === 0 ? 
						'el-icon-edit' : scope.row.status === 1 ? 'el-icon-upload' : 'el-icon-success'" />
						</el-tag>
				</template>
			</el-table-column>
			<el-table-column align="center" label="操作" width="100">
				<template slot-scope="scope">
					<el-tag v-if="accountStatus" type="success">
						已封账
					</el-tag>
					<el-button 
						v-else-if="scope.row.status === 0"
						@click="routerTo(scope.row)"
						type="primary" size="mini" plain round>
						分配填报
					</el-button>
					<el-button 
						v-else-if="scope.row.status !== 0"
						@click="routerTo(scope.row)"
						type="info" size="mini" plain>
						明细
						<i style="color: #20B2AA" 
							class="el-icon-document" />
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
		<!-- 汇总表 -->
		<collect-report
			v-if="cRStatus"
			:dialogVisible="dialogVisible"
			:yearmonth="listQuery.yearmonth"
			:userID="listQuery.userID"
			@closeCRDialog="closeCRDialog">
		</collect-report>
	</div>
</template>

<script>
	import { getAssigneeFbParam,
					 getAssigneeParam,
					 getReportList } from '@/api/feedBackReport'
	import { formatDate } from '@/utils/date'
	import waves from '@/directive/waves'
	import countTo from 'vue-count-to'
	import CollectReport from './components/CollectReport'
	export default {
		name: 'FeedBackFill',
		directives: { waves },
		components: { countTo, CollectReport },
		data() {
			return {
				list: [],
				total: 0,
				listLoading: false,
				listQuery: {
					currentPage: 1,
					pagesize: 10,
					feedBackItem: null,
					assigneeDept: null,
					yearmonth: '',
					userID: null
				},
				accountStatus: false,
				assigneeFbParams: [],
				assigneeDeptParams: [],
				startVal: 0,
				duration: 2000,
				decimals: 2,
				separator: ',',
				autoplay: true,
				cRStatus: false,
				dialogVisible: false
			}
		},
		mounted() {
			this.setDefaultYearmonth()
			this.getUserInfo()
			this.getList()
			this.getAssigneeFbParams()
			this.getAssigneeDeptParams()
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
				getReportList(query).then(response => {
					self.accountStatus = response.data.accountStatus
					self.list = response.data.reportItem
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
			getAssigneeFbParams() {
				var self = this
				const query = self.listQuery
				getAssigneeFbParam(query).then(response => {
					this.assigneeFbParams = response.data
				})
			},
			getAssigneeDeptParams() {
				var self = this
				const query = self.listQuery
				getAssigneeParam().then(response => {
					this.assigneeDeptParams = response.data
				})
			},
			/* 汇总表 start*/
			openCRDialog() {
				this.cRStatus = true
				this.dialogVisible = true
			},
			closeCRDialog() {
				this.cRStatus = false
				this.dialogVisible = false
			},
			/* 汇总表 end*/
			/* 分配明细 */
			routerTo(data) {
				var self = this
				self.$router.push({
			  path: '/feedBack/reportFill',
			  query: {
						feedBackItem: data.feedBackItem,
						feedBackItemName: data.feedBackItemName,
						feedBackDept: data.feedBackDept,
						feedBackDeptName: data.feedBackDeptName,
						yearmonth: data.yearmonth,
						userID: self.listQuery.userID
					}
				})
			}
		}
	}
</script>
