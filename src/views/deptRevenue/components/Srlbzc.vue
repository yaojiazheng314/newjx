<template>
	<ve-ring
    :data="chartData"
    :loading="loading"
    :colors="colors"
    width="100%" height="400px"
    :settings="chartSettings"
    :legend-visible="false"></ve-ring>
</template>

<script>
import VeRing from 'v-charts/lib/ring.common'
import { getSrlbzc } from '@/api/dataMonitor'
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
	name: 'Srlbzc',
	components: { VeRing },
	data() {
    this.chartSettings =  {
      stack: {}
    },
		this.grid = { right: 30 },
    this.chartExtend = {
      xAxis: {
        axisLabel: {
          textStyle: {
            color: "#FFFFFF" //x轴字体颜色
          },
          rotate: 45
        }
      },
      yAxis: {
        axisLabel: {
          textStyle: {
            color: "#FFFFFF" //y轴字体颜色
          }
        }
      }
    }
		return {
      loading: false, //加载图表
      colors: ['#CCFFFF','#FFFFFF','#99CCFF',
                 '#FFFFCC','#CCFFFF','#FFCCCC'],
			chartData: {
				columns: ['revenueName', 'sumVal'],
				rows: []
			}
		}
	},
	created() {
		this.getData()
	},
	methods: {
		getData() {
      this.loading = true
			const query = {
			  departments: this.department,
			  startDate: this.startDate,
			  endDate: this.endDate
			}
			getSrlbzc(query).then(res => {
        if (res.data != null) {
          this.chartData.rows = res.data
        }
        this.loading = false
			})
		}
	}
}
</script>

<style>
</style>
