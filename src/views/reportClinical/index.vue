<template>
	<report-container 
		:reportRouteType="reportRouteType">
	</report-container>
</template>

<script>
import reportContainer from '@/components/reportContainer'
export default {
	name: 'Clinical',
	components: { reportContainer },
	data() {
		return {
			reportRouteType: '临床查询'
		}
	}
}
</script>