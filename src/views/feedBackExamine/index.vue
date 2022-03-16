<template>
	<div class="app-container">
		<div class="filter-container">
			<el-select 
				v-model="listQuery.feedBackItem" 
				filterable clearable 
				placeholder="选择或输入分配项"
				class="searchClass">
				<el-option 
					v-for="v in feedBackParams" 
					:key="v.id" 
					:label="v.name" 
					:value="v.id">
					<span style="float: left">{{ v.name }}</span>
				</el-option>
			</el-select>
			<el-select 
				v-model="listQuery.reportDept" 
				filterable clearable 
				placeholder="选择或输入科室" 
				class="searchClass">
				<el-option 
					v-for="d in deptParams" 
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
			<el-table-column prop="feedBackReleaseVal" label="分配绩效">
				<template slot-scope="scope">
					<span class="example-department">
						{{ scope.row.feedBackReleaseVal }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="reportVal" label="上报绩效">
				<template slot-scope="scope">
					<span class="example-person">
						{{ scope.row.reportVal }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="balance" label="差值">
				<template slot-scope="scope">
					<span style="color: red;">
						{{ scope.row.balance }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="reportPercentage" label="上报进度">
				<template slot-scope="scope">
					<el-progress 
						:percentage="scope.row.reportPercentage" 
						:text-inside="true" :stroke-width="18"
						status="success"></el-progress>
				</template>
			</el-table-column>
			<el-table-column prop="examineNum" label="已审核">
				<template slot-scope="scope">
					<span>{{ scope.row.examineNum }}科室</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="操作" width="100">
				<template slot-scope="scope">
					<el-button 
						@click="examineReport(scope.row)"
						type="primary" size="mini" plain round>
						审核
						<i class="el-icon-document" />
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
		<!-- 审核明细dialog -->
		<examine-dialog
			v-if="examineStatus"
			:dialogStatus="dialogStatus" 
			:dialogVisible="dialogVisible"
			:examineQuery="examineQuery"
			@closeDialog="closeDialog"
			@getList="getList"></examine-dialog>
	</div>
</template>

<script>
	import { getReportStatusList } from '@/api/feedBackReportStatus'
	import { getFeedBackParam } from '@/api/feedBack'
	import { getDepartmentParam	} from '@/api/department'
	import { formatDate } from '@/utils/date'
	import waves from '@/directive/waves'
	import ExamineDialog from './components/ExamineDialog'
	export default {
		name: 'FeedBackFill',
		directives: { waves },
		components: { ExamineDialog },
		data() {
			return {
				list: [],
				total: 0,
				listLoading: false,
				listQuery: {
					currentPage: 1,
					pagesize: 10,
					feedBackItem: null,
					reportDept: null,
					yearmonth: ''
				},
				feedBackParams: [],
				deptParams: [],
				/* 审核dialog */
				examineQuery: {},
				examineStatus: false,
				dialogStatus: '',
				dialogVisible: false
			}
		},
		mounted() {
			this.setDefaultYearmonth()
			this.getList()
			this.getFeedBackItemParams()
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
			getList() {
				var self = this
				self.listLoading = true
				const query = self.listQuery
				getReportStatusList(query).then(response => {
					self.accountStatus = response.data.accountStatus
					const items = response.data.reportStatus
					self.list = items.map(v => {
						let balance = v.feedBackReleaseVal - v.reportVal
						self.$set(v, 'balance', balance)
						let releaseVal = v.feedBackReleaseVal
						let reportVal = v.reportVal
						let percentage = self.calcPercenTage(reportVal, releaseVal)
						self.$set(v, 'reportPercentage', percentage)
						return v
					})
					self.total = response.data.total
					self.listLoading = false
				})
			},
			//计算百分比
			calcPercenTage(numerator, denominator) {
				if (denominator == 0 || numerator == 0) {
					return 0
				} else {
					return (numerator/denominator)*100
				}
			},
			/* 获取参数 */
			//分配项参数
			getFeedBackItemParams() {
				getFeedBackParam().then(response => {
					this.feedBackParams = response.data
				})
			},
			//科室参数
			getDepartmentParams() {
				getDepartmentParam().then(response => {
					this.deptParams = response.data
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
			/* 审核上报 */
			//打开审核明细dialog
			examineReport(data) {
				const yearmonth = this.listQuery.yearmonth
				this.examineQuery = {
					feedBackItem: data.feedBackItem,
					feedBackItemName: data.feedBackItemName,
					yearmonth: yearmonth
				}
				this.examineStatus = true
				this.dialogStatus = yearmonth + data.feedBackItemName + '审核明细'
				this.dialogVisible = true
			},
			//关闭审核明细dialog
			closeDialog() {
				this.examineStatus = false
				this.dialogStatus = ''
				this.dialogVisible = false
				this.examineQuery = {}
			}
		}
	}
</script>
