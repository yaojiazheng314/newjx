<template>
  <div class="dashboard-editor-container">
		<el-row :gutter="8">
      <el-col 
				:xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" 
				:lg="{span: 6}" :xl="{span: 6}" 
				style="margin-bottom:30px;">
        <box-card />
      </el-col>
			
			<el-col 
				:xs="{span: 24}" :sm="{span: 12}" 
				:md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}"
				 style="margin-left:30px; margin-bottom:30px;">
			  <todo-list />
			</el-col>
			
			<el-col 
				:xs="{span: 24}" :sm="{span: 12}" 
				:md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}"
				 style="margin-left:30px; margin-bottom:30px;">
					<el-date-picker
						v-model="resultQuery.yearmonth"
						type="month"
						placeholder="选择月"
						format="yyyy 年 M 月"
						value-format="yyyy-MM"
						:clearable="false"
						:editable="false"
						@change="getAccountStatus"
						class="searchClass">
					</el-date-picker>
						
					<el-card class="box-card">
						<div slot="header">
							<span>数据封存明细</span>
							<el-tooltip v-if="accountStatus" content="点击解除封账"
								placement="left">
								<el-button 
									style="float: right;" 
									size="mini"
									type="success"
									:loading="closeLoading"
									@click="relieveAccountStatus"
									round>已封账</el-button>
							</el-tooltip>
							<el-button 
								v-if="accountStatus === false"
								style="float: right;" 
								size="mini"
								type="primary"
								:loading="closeLoading"
								@click="closeAccountStatusNew"
								round>封账</el-button>
						
						</div>
						<div >
								<span>数据生成</span>
							<el-button 
								v-if="accountDataStatus === 0"
								style="float: right;" 
								size="mini"
								type="primary"
								:loading="closeLoading"
								@click="generateNextMonth"
								round>生成下月数据</el-button>
						</div>
						<el-row :gutter="20">
							<el-col 
								:span="16"
								 style="margin-left:30px; margin-bottom:30px;">
								<el-table
									:data="closeFlowPath"
									style="width: 100%;">
									<el-table-column
										prop="step"
										label="步骤"
										width="280">
									</el-table-column>
									<el-table-column
										prop="status"
										label="状态"
										width="100">
										<template slot-scope="scope">
											<el-tag 
												v-if="scope.row.status"
												type="success">
												已封存
											</el-tag>
											<el-tag
												v-else 
												type="warning">
												未封存
											</el-tag>
										</template>
									</el-table-column>
								</el-table>
							</el-col>
							<el-col 
								:span="4"
								 style="float: left; margin-left:30px; margin-top:35px;">
								<el-progress 
									v-if="percentage === 100"
									type="circle" 
									:percentage="percentage"
									color="#8e71c7"
									status="text">
									已封账
								</el-progress>
								<el-progress 
									v-else
									type="circle" 
									:percentage="percentage"
									status="text">
									未封账
								</el-progress>
							</el-col>
						</el-row>
					</el-card>
			</el-col>
    </el-row>
    <!-- <panel-group @handleSetLineChartData="handleSetLineChartData" /> -->

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <!-- <line-chart :chart-data="lineChartData" /> -->
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import BoxCard from './components/BoxCard'
import TodoList from './components/TodoList'
import { formatDate } from '@/utils/date'
import { getStatus, closeAccount, relieveAccount,closeAccountNew,getAccountDataStatus,generateNextMonth } from '@/api/accountStatus'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'AccountStatus',
  components: {
    PanelGroup,
    LineChart,
    BoxCard,
		TodoList
  },
  data() {
    return {
			accountStatus: false,
      lineChartData: lineChartData.newVisitis,
			closeLoading: false,
			resultQuery: {
				yearmonth: '',
				userID: null,
			},
			accountDataStatus:null,
			percentage: 0,
			closeFlowPath: [
				{key: 1, step: '科室公式核算信息' , status: false},
				{key: 2, step: '人员公式核算信息' , status: false},
				{key: 3, step: '因子数据信息' , status: false}
			]
			/* elementUI 2.9.1
			colors: [
        {color: '#f56c6c', percentage: 20},
        {color: '#e6a23c', percentage: 40},
        {color: '#5cb87a', percentage: 60},
        {color: '#1989fa', percentage: 80},
        {color: '#6f7ad3', percentage: 100}
       ] */
		}
  },
	mounted() {
		this.setDefaultYearmonth()
		this.getUserInfo()
		this.getAccountStatus()
		this.getAccountDataStatus()
	},
  methods: {
		getAccountStatus() {
			var self = this
			const query = self.resultQuery
			this.getAccountDataStatus()
			getStatus(query).then(response => {
				self.accountStatus = response.data
				if (self.accountStatus) {
					self.closeFlowPath.map(v => {
						v.status = true
					})
					self.percentage = 100
				}else {
					self.closeFlowPath.map(v => {
						v.status = false
					})
					self.percentage = 0
				}
			})
		},
			getAccountDataStatus() {
			var self = this
			const query = self.resultQuery
			getAccountDataStatus(query).then(response => {
				self.accountDataStatus = response.data
				
			})
		},
		setDefaultYearmonth() {
			var self = this
			const month = new Date().getMonth() - 1
			var defYearmonth = new Date(new Date().setMonth(month, 1))
			const ymStr = formatDate(defYearmonth, 'yyyy-MM')
			self.resultQuery.yearmonth = ymStr
		},
		getUserInfo() {
			var self = this
			self.resultQuery.userID = self.$store.getters.userID
		},
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
		closeAccountStatus() {
			var self = this
			self.closeLoading = true
			const closeData = self.resultQuery
			closeAccount(closeData).then(response => {
				let resultStatus = response.status
				if (resultStatus === 520) {
					self.percentage = 0
					self.$confirm(response.msg, '提示', {
						type: 'warning',
						center: true
					}).then(() => {
						self.$message({
							type: 'info',
							message: '稍候重试'
						})
					}).catch(() => {
						self.$message({
							type: 'info',
							message: '稍候重试'
						})
					})
					self.closeLoading = false
					self.getAccountStatus()
				}else {
					let successMsg = '终审封账完成'
					self.$notify({
					  title: '成功',
					  message: successMsg,
					  type: 'success',
					  duration: 6000
					})
					self.percentage = 100
					self.closeLoading = false
					self.getAccountStatus()
				}
			})
		},
		generateNextMonth(){
			var self = this
			self.closeLoading = true
			const closeData = self.resultQuery
			generateNextMonth(closeData).then(response => {
				let resultStatus = response.status
				if (resultStatus === 520) {
					self.percentage = 0
					self.$confirm(response.msg, '提示', {
						type: 'warning',
						center: true
					}).then(() => {
						self.$message({
							type: 'info',
							message: '稍候重试'
						})
					}).catch(() => {
						self.$message({
							type: 'info',
							message: '稍候重试'
						})
					})
					self.closeLoading = false
					self.getAccountStatus()
				}else {
					let successMsg = '终审封账完成'
					self.$notify({
					  title: '成功',
					  message: successMsg,
					  type: 'success',
					  duration: 6000
					})
					self.percentage = 100
					self.closeLoading = false
					self.getAccountStatus()
				}
			})
		},
		closeAccountStatusNew() {
			var self = this
			self.closeLoading = true
			const closeData = self.resultQuery
			closeAccountNew(closeData).then(response => {
				let resultStatus = response.status
				if (resultStatus === 520) {
					self.percentage = 0
					self.$confirm(response.msg, '提示', {
						type: 'warning',
						center: true
					}).then(() => {
						self.$message({
							type: 'info',
							message: '稍候重试'
						})
					}).catch(() => {
						self.$message({
							type: 'info',
							message: '稍候重试'
						})
					})
					self.closeLoading = false
					self.getAccountStatus()
				}else {
					let successMsg = '终审封账完成'
					self.$notify({
					  title: '成功',
					  message: successMsg,
					  type: 'success',
					  duration: 6000
					})
					self.percentage = 100
					self.closeLoading = false
					self.getAccountStatus()
				}
			})
		},
		relieveAccountStatus() {
			var self = this
			self.closeLoading = true
			const relieveData = self.resultQuery
			relieveAccount(relieveData).then(response => {
				let resultStatus = response.status
				if (resultStatus === 520) {
					self.percentage = 0
					self.$confirm(response.msg, '提示', {
						type: 'warning',
						center: true
					}).then(() => {
						self.$message({
							type: 'info',
							message: '稍候重试'
						})
					}).catch(() => {
						self.$message({
							type: 'info',
							message: '稍候重试'
						})
					})
					self.closeLoading = false
					self.getAccountStatus()
				}else {
					let successMsg = '封账已解除'
					self.$notify({
						title: '成功',
						message: successMsg,
						type: 'success',
						duration: 6000
					})
					self.percentage = 0
					self.closeLoading = false
					self.getAccountStatus()
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;
	
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
.box-card {
    width: 650px;
		margin-top: 15px;
	}
</style>
