<template>
	<report-container 
		:reportRouteType="reportRouteType">
	</report-container>
</template>

<script>
import reportContainer from '@/components/reportContainer'
export default {
	name: 'Analysis',
	components: { reportContainer },
	data() {
		return {
			reportRouteType: '业务分析'
		}
	}
}
</script>