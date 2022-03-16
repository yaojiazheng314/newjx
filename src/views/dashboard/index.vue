<template>
  <div class="dashboard-container">
		<!-- 第一行 用户信息 用户半年分配绩效堆叠面积图 -->
		<el-row :gutter="32">
		  <el-col :xs="24" :sm="24" :lg="6">
		    <!-- 用户信息 修改密码 -->
				<user-info />
		  </el-col>
			<el-col :xs="24" :sm="24" :lg="18">
			  <!-- 用户半年分配绩效堆叠面积图 -->
				<half-year-feed-back />
			</el-col>
		</el-row>
		<!-- 第二行 用户当前绩效分配总额饼图 当前分配绩效柱状图 -->
		<el-row :gutter="32">
		  <el-col :xs="24" :sm="24" :lg="8">
		    <!-- 用户当前绩效分配总额饼图 -->
				<current-feed-back-pie />
		  </el-col>
			<el-col :xs="24" :sm="24" :lg="16">
			  <!-- 当前分配绩效柱状图 -->
				<report-histogram />
			</el-col>
		</el-row> 
		<!-- 第三行 二次分配快速入口 绩效留言板 当月绩效满意度评级 -->
		<el-row :gutter="32">
		  <el-col :xs="24" :sm="24" :lg="12">
		    <!-- 留言 -->
				<leave-message 
					v-if="isAlive" 
					style="margin-top: 32px;" />
		  </el-col>
			<el-col :xs="24" :sm="24" :lg="12">
			  <!-- 当前分配绩效柱状图 -->
				<calendar style="margin-top: 32px;" />
			</el-col>
		</el-row>
  </div>
</template>

<script>
import UserInfo from './components/UserInfo'
import HalfYearFeedBack from './components/HalfYearFeedBack'
import CurrentFeedBackPie from './components/CurrentFeedBackPie'
import ReportHistogram from './components/ReportHistogram'
import LeaveMessage from './components/LeaveMessage'
import Calendar from './components/Calendar'
export default {
  name: 'Dashboard',
	components: { UserInfo,
								HalfYearFeedBack,
								CurrentFeedBackPie,
								ReportHistogram,
								LeaveMessage,
								Calendar },
	provide() {
		return {
			reload: this.reload
		}
	},
	data() {
		return {
			isAlive: true
		}
	},
	methods: {
		reload() {
			this.isAlive = false
			this.$nextTick(function() {
				this.isAlive = true
			})
		}
	}
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;
	
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
