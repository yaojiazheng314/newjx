<template>
	<report-container 
		:reportRouteType="reportRouteType">
	</report-container>
</template>

<script>
import reportContainer from '@/components/reportContainer'
export default {
	name: 'reportRun',
	components: { reportContainer },
	data() {
		return {
			reportRouteType: '核算分析'
		}
	}
}
</script>