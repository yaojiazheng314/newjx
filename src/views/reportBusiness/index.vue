<template>
	<report-container 
		:reportRouteType="reportRouteType">
	</report-container>
</template>

<script>
import reportContainer from '@/components/reportContainer'
export default {
	name: 'reportBusiness',
	components: { reportContainer },
	data() {
		return {
			reportRouteType: '运营分析'
		}
	}
}
</script>