<template>
	<report-container 
		:reportRouteType="reportRouteType">
	</report-container>
</template>

<script>
import reportContainer from '@/components/reportContainer'
export default {
	name: 'deptReportAnalysis',
	components: { reportContainer },
	data() {
		return {
			reportRouteType: '科室报表'
		}
	}
}
</script>