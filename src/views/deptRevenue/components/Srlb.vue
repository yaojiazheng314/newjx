<template>
	<word-cloud
    :data="chartData"
    width="100%" height="400px"
    :settings="chartSettings"></word-cloud>
</template>

<script>
import WordCloud from 'v-charts/lib/wordcloud.common'
import { getSrlb } from '@/api/dataMonitor'
export default {
  props: {
  	department: {
  		type: Array
  	},
  	startDate: {
  		type: String
  	},
  	endDate: {
  		type: String
  	}
  },
	name: 'Srlb',
	components: { WordCloud },
	data() {
		this.chartSettings = {
      color: ['#CCFFFF','#FFFFFF','#99CCFF' ],
      sizeMin: 30,
      sizeMax: 80
    }
		return {
			chartData: {
				columns: ['word', 'count'],
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
			  departments: this.department,
			  startDate: this.startDate,
			  endDate: this.endDate
			}
			getSrlb(query).then(res => {
				if (res.data !== null) {
					this.chartData.rows = res.data
				}
			})
		}
	}
}
</script>

<style>
</style>
