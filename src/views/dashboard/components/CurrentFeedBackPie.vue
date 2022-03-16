<template>
	<el-card shadow="hover">
		<div slot="header" class="clearfix">
			<span>{{ yearmonth }}绩效分配汇总</span>
		</div>
		<ve-pie 
			:data="chartData" 
			:settings="chartSettings">
		</ve-pie>
	</el-card>
</template>

<script>
import VePie from 'v-charts/lib/pie.common'
import { getCurrentFeedBackData } from '@/api/home'
export default {
	name: 'CurrentFeedBackPie',
	components: { VePie },
	data() {
		this.chartSettings = {
      roseType: 'radius'
    }
		return {
			yearmonth: '',
			chartData: {
				columns: ['分配项', '分配值'],
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
			getCurrentFeedBackData(query).then(res => {
				if (res.data !== null) {
					this.yearmonth = res.data.yearmonth
					this.chartData.rows = res.data.rows
				}
			})
		}
	}
}
</script>

<style>
</style>
