<template>
	<div class="app-container">
		<el-tabs v-model="activeName">
			<el-tab-pane
				:key="item.reportName"
				v-for="item in reportTabs"
				:label="item.reportName"
				:name="item.reportName">
				<iframe 
					:src="item.reportUrl"
					style="width: 100%; height: 650px;"
					frameborder="no" border="0"
				></iframe>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
import { getAllReports } from '@/api/externalLink'
import waves from '@/directive/waves'
export default {
	name: 'ReportContainer',
	props: {
		//报表路由访问的参数：数据挖掘/业务分析/临床查询/机关查询/财务审核
    //新增：核算分析/运营分析
	  reportRouteType: {
	    type: String
	  }
	},
	directives: { waves },
	data() {
		return {
			activeName: '',
			reportQuery: {
				reportType: '',
				user: null
			},
			reportTabs: [] //存放报表缓存tab页
		}
	},
	created() {
		this.reportQuery.reportType = this.reportRouteType
	},
	mounted() {
		this.getUserInfo()
		this.getReports()
	},
	methods: {
		//获取用户id
		getUserInfo() {
			this.reportQuery.user = this.$store.getters.userID
		},
		/* 获取数据挖掘全部可访问的报表 */
		getReports() {
			var self = this
			const query = self.reportQuery
			getAllReports(query).then(res => {
				self.reportTabs = res.data
			})
		}
	}
}
</script>

<style>
</style>

