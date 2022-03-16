<template>
	<el-card shadow="hover">
		<div slot="header" class="clearfix">
      <span>{{ yearmonth }}绩效分配明细</span>
    </div>
		<ve-histogram
			:data="chartData"
			:extend="extend">
		</ve-histogram>
	</el-card>
</template>

<script>
import VeHistogram from 'v-charts/lib/histogram.common'
import { getFeedBackPersonDetail } from '@/api/home'
export default {
	name: 'ReportHistogram',
	components: { VeHistogram },
	data() {
		this.chartSettings = {},
    this.extend = {
      'xAxis.0.axisLabel.rotate': 45
    }
		return {
			yearmonth: '',
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
			getFeedBackPersonDetail(query).then(res => {
				if (res.data !== null) {
					this.yearmonth = res.data.yearmonth
					this.chartData.columns = res.data.columns
					this.chartData.rows = res.data.rows
				}
			})
		}
	}
}
</script>
