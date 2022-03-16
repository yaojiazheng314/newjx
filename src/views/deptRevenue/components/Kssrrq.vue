<template>
	<ve-line
    :data="chartData"
    :loading="loading"
    :colors="colors"
    width="100%" height="600px"
    :legend-visible="false"
    :grid="grid"
    :data-zoom="dataZoom"
    :mark-line="markLine"
    :mark-point="markPoint"
    :extend="chartExtend" :toolbox="toolbox"></ve-line>
</template>

<script>
import VeLine from 'v-charts/lib/line.common'
// 引入echarts模块
import 'echarts/lib/component/markLine'
import 'echarts/lib/component/markPoint'
import 'echarts/lib/component/dataZoom'
import 'echarts/lib/component/toolbox'
import { getKssrrq } from '@/api/dataMonitor'
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
	name: 'Kssrrp',
	components: { VeLine },
	data() {
    this.toolbox = {
      feature: {
        magicType: {type: ['line', 'bar']},
        saveAsImage: {}
      }
    },
    this.dataZoom = [{ type: 'slider', start: 0, end: 32,
      textStyle: {color: "#FFFFFF"} }],
    this.markLine = {
      data: [{ name: '平均线', type: 'average'}]
    },
    this.markPoint = {
      data: [{ name: '最大值', type: 'max' }]
    },
		this.grid = { right: 60 },
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
			getKssrrq(query).then(res => {
        if (res.data != null) {
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
