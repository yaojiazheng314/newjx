<template>
	<report-container 
		:reportRouteType="reportRouteType">
	</report-container>
</template>

<script>
import reportContainer from '@/components/reportContainer'
export default {
	name: 'ControlCost',
	components: { reportContainer },
	data() {
		return {
			reportRouteType: '医保管控'
		}
	}
}
</script>