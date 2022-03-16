<template>
	<ve-line 
		:data="chartData" 
		:settings="chartSettings"></ve-line>
</template>

<script>
import VeLine from 'v-charts/lib/line.common'
import { getHalfYearFeedBackData } from '@/api/home'
export default {
	name: 'HalfYearFeedBack',
	components: { VeLine },
	data() {
		this.chartSettings = {
      area: true
    }
		return {
			chartData: {
				columns: [],
				rows: []
			}
		}
	},
	created() {
		this.getData()
	},
	methods: {
		getData() {
			const query = {
				userId: this.$store.getters.userID
			}
			getHalfYearFeedBackData(query).then(res => {
				if (res.data !== null) {
					this.chartData.columns = res.data.columns
					this.chartData.rows = res.data.rows
				}
			})
		}
	}
}
</script>

<style>
</style>
