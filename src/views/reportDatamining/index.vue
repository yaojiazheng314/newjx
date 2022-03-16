<template>
	<report-container 
		:reportRouteType="reportRouteType">
	</report-container>
</template>

<script>
import reportContainer from '@/components/reportContainer'
export default {
	name: 'Datamining',
	components: { reportContainer },
	data() {
		return {
			reportRouteType: '数据挖掘'
		}
	}
}
</script>