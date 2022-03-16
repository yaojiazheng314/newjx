<template>
	<div>
		<span class="fbrd-card-title">
			{{ title }}
		</span>
		
		<el-card class="fbrd-card">
			<div
				v-loading="loading"
				element-loading-text="加载中..."
				id="reportPerRanking"
				style="width: 100%; height: 400px;">
			</div>
		</el-card>
	</div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/westeros') // echarts theme
import { getFeedBackDetailV2Echart } from '@/api/v2/feedBack/report/index'
import resize from './mixins/resize'
export default {
  mixins: [ resize ],
	name: 'fbr-report-histogram',
	props: {
		parentYearmonth: String  // yyyy-MM
	},
	data() {
		return {
			// attr
      loading: false,
			title: "分配明细",
			// data
			chart: null
		}
	},
	created() {
    const query = {
			yearmonth: this.parentYearmonth,
    	userId: this.$store.getters.userID
    }
		this.getData(query)
	},
  beforeDestroy () {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
	methods: {
		getData (query) {
      this.loading = true
			getFeedBackDetailV2Echart(query).then(res => {
				const legendData = res.data.legend
        const xAxisData = res.data.xAxis
        this.title = res.data.yearmonth == null ? '分配明细' : res.data.yearmonth + '分配明细'
        const data = res.data.series
        var seriesData = []
        for (var i = 0, l = data.length; i < l; i++) {
          let d = {
            name: data[i].name,
            type: data[i].name === '总计' ? 'line' : 'bar',
            smooth: true,
            data: data[i].data
          }
          seriesData.push(d)
        }
        // 绘制图表
        this.draw(legendData, xAxisData, seriesData)
        this.loading = false
			})
		},
    /* 绘制图表 */
    draw (legendData, xAxisData, seriesData) {
      this.chart = echarts.init(document.getElementById('reportPerRanking'), 'westeros');
      var option = {
        // title: {
        //   text: titleText
        // },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: { data: legendData },
        xAxis: { axisLabel: {interval: 0}, data: xAxisData },
        yAxis: {},
        toolbox: {
          left: 'right',
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {}
          }
        },
        dataZoom: [
          { startValue: xAxisData[0], endValue: xAxisData[14]  },
          { type: 'inside' }
        ],
        series: seriesData
      };
      this.chart.setOption(option);
    }
	}
}
</script>
<style scoped>
.fbrd-card {
	margin-left: 20px;
  height: 450px;
}
.fbrd-card-title {
	font-size: 14px;
	font-weight: 400;
	color: #1f2f3d;
	padding: 10px 25px;
	background: #516b91;
	color: #fff;
	border-radius: 5px;
	position: relative;
	top: 45px;
}
</style>
