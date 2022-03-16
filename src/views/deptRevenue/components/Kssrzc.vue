<template>
	<ve-bar
    :data="chartData" 
    :loading="loading"
    :colors="barColor"
    width="100%" height="400px"
    :settings="chartSettings"
    :legend-visible="false"
    :grid="grid"
    :extend="chartExtend"></ve-bar>
</template>

<script>
import VeBar from 'v-charts/lib/bar.common'
import { getKssrzc } from '@/api/dataMonitor'
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
	name: 'Kssrzc',
	components: { VeBar },
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
          }
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
      barColor: ['#CCFFFF','#FFFFFF','#99CCFF',
                 '#FFFFCC','#CCFFFF','#FFCCCC'],
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
      this.loading = true
			const query = {
			  departments: this.department,
			  startDate: this.startDate,
			  endDate: this.endDate
			}
			getKssrzc(query).then(res => {
        if (res.data != null) {
          let columns = res.data.columns
          let stack = []
          for (let i = 0; i < columns.length; i++) {
            if (columns[i] != '科室') stack.push(columns[i]);
          }
          this.chartSettings.stack = {
            'xxx': stack
          }
          this.chartData.columns = res.data.columns
          this.chartData.rows = res.data.rows
        }
        this.loading = false
			})
		}
	}
}
</script>

<style>
</style>
