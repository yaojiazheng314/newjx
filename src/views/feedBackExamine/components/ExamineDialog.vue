<template>
	<div id="examineDialog">
		<el-dialog 
			:title="dialogStatus" 
			:show-close="showClose"
			:close-on-click-modal="false"
			:visible.sync="visible"
			width="60%"
			@close="closeDialog">
			<el-input
				v-model="searchDept"
				size="mini"
				placeholder="输入科室名称搜索"
				style="width: 200px;"/>
			<el-tooltip 
				class="item" effect="dark" 
				content="审核通过全部上报科室" placement="right">
				<el-button 
					type="primary" 
					size="mini" 
					@click="passExamineAll" 
					plain>快速审核
				</el-button>
			</el-tooltip>	
			<el-table 
				:loading="loading" 
				:data="reportStatusList.filter(data => !searchDept || data.feedBackDeptName.toLowerCase().includes(searchDept.toLowerCase()))" 
				fit 
				height="450"
				width="800"
				stripe
				highlight-current-row 
				style="width: 100%">
				<el-table-column prop="feedBackDeptName" label="分配科室">
				</el-table-column>
			  <el-table-column prop="usersName" label="分配用户">
			  </el-table-column>
				<el-table-column prop="feedBackVal" label="下发绩效">
				</el-table-column>
				<el-table-column prop="reportSumVal" label="上报绩效">
				</el-table-column>
				<el-table-column 
					prop="status"
					label="状态"
					:filters="[{ text: '未上报', value: 0 },
										 { text: '已上报', value: 1 },
										 { text: '已审核', value: 2 }]"
					:filter-method="filterStatus">
					<template slot-scope="scope">
						<el-tag 
							:type="scope.row.status === 0 ? 
							'warning' : scope.row.status === 1 ? 'success' : 'primary'" 
							disable-transitions>{{ scope.row.status === 0 ? '未上报' : scope.row.status === 1 ? '已上报' : '已审核'}}
							</el-tag>
					</template>
				</el-table-column>
			  <el-table-column align="center" label="操作" with="200">
			    <template slot-scope="scope">
						<el-button 
							v-if="scope.row.status == 1" 
							size="mini"
							type="text"
							style="color: #67C23A;"
							@click="passExamine(scope.row)">
							审核通过
						</el-button>
						<el-button 
							v-else-if="scope.row.status == 2"
							size="mini"
							@click="reReport(scope.row)"
							icon="el-icon-refresh"
							style="color: #E6A23C;"
							type="text">
							重新上报
						</el-button> 
						<el-button 
							type="text" 
							size="mini"
							icon="el-icon-document-copy"
							@click="routeToDetail(scope.row)">明细</el-button>
			    </template>
			  </el-table-column>
			</el-table>
		</el-dialog>
	</div>
</template>

<script>
import { fetchReportStatusDetail, 
				 examinePassed, backToUnreport,
				 examineAllPassed } from '@/api/feedBackReportStatus'
export default {
	props: {
		dialogVisible: {
			type: Boolean
		},
		examineQuery: {
			type: Object
		},
		dialogStatus: {
			type: String
		}
	},
	name: 'ExamineDialog',
	data() {
		return {
			showClose: true,
			loading: false,
			visible: false,
			searchDept: '',
			reportStatusList: []
		}		
	},
	created() {
		this.visible = this.dialogVisible
	},
	mounted() {
		const data = this.examineQuery
		if (data.feedBackItem !== null) {
				this.getList()
			}
	},
	methods: {
		getList() {
			var self = this
			self.loading = true
			let query = {
				feedBackItem: self.examineQuery.feedBackItem,
				yearmonth: self.examineQuery.yearmonth
			}
			fetchReportStatusDetail(query).then(res => {
				self.reportStatusList = res.data
				self.loading = false
			})
		},
		/* 筛选状态 */
		filterStatus(value, row) {
			return row.status === value
		},
		/* 审核通过所有上报且上报值等于下发值的上报科室 */
		passExamineAll() {
			var self = this
			const data = self.examineQuery
			const reportStatus = {
				feedBackItem: data.feedBackItem,
				yearmonth: data.yearmonth,
			}
			examineAllPassed(reportStatus).then(res => {
				const successMsg = data.yearmonth + data.feedBackItemName + '所有上报科室已审核通过'
				self.$notify({
				  title: '成功',
				  message: successMsg,
				  type: 'success',
				  duration: 6000
				})
				self.getList()
			})
		},
		/* 通过审核 */
		passExamine(data) {
			const reportStatus = {
				feedBackItem: data.feedBackItem,
				yearmonth: data.yearmonth,
				department: data.feedBackDept,
				user: data.user
			}
			examinePassed(reportStatus).then(res => {
				const successMsg = data.yearmonth + data.feedBackItemName + data.feedBackDeptName + '审核通过'
				this.$notify({
				  title: '成功',
				  message: successMsg,
				  type: 'success',
				  duration: 6000
				})
				this.getList()
			})
		},
		/* 重置至未上报状态 */
		reReport(data) {
			const reportStatus = {
				feedBackItem: data.feedBackItem,
				yearmonth: data.yearmonth,
				department: data.feedBackDept,
				user: data.user
			}
			backToUnreport(reportStatus).then(res => {
				const successMsg = data.yearmonth + data.feedBackItemName + data.feedBackDeptName + '已取消上报状态，' + '可以提醒' + data.usersName + '重新填报'
				this.$notify({
				  title: '成功',
				  message: successMsg,
				  type: 'success',
				  duration: 6000
				})
				this.getList()
			})
		},
		/* 查看明细 */
		routeToDetail(data) {
			var self = this
			self.$router.push({
			path: '/feedBack/reportFill',
			query: {
					feedBackItem: data.feedBackItem,
					feedBackItemName: data.feedBackItemName,
					feedBackDept: data.feedBackDept,
					feedBackDeptName: data.feedBackDeptName,
					yearmonth: data.yearmonth,
					userID: data.user
				}
			})
		},
		closeDialog() {
			this.$emit('getList')
			this.$emit('closeDialog')
		}
	}
}
</script>

<style>
</style>
