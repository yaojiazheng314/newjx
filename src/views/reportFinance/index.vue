<template>
	<report-container 
		:reportRouteType="reportRouteType">
	</report-container>
</template>

<script>
import reportContainer from '@/components/reportContainer'
export default {
	name: 'Office',
	components: { reportContainer },
	data() {
		return {
			reportRouteType: '财务审核'
		}
	}
}
</script>