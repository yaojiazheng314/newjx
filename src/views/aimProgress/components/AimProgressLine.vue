<template>
	<ve-line 
		:data="chartData" :extend="extend">
	</ve-line>
</template>

<script>
import VeLine from 'v-charts/lib/line.common'
import { getAimProgressLine } from '@/api/aim'
export default {
	props: {
		//目标id
		aimConfig: {
			type: Number
		}
	},
	name: 'AimChildWeight',
	components: { VeLine },
	data() {
		this.extend = {
			series: {
        label: {
          normal: {
            show: true
          }
        }
      }
    }
		return {
			chartData: {
				columns: ['yearmonth', '完成度'],
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
				aimConfig: this.aimConfig
			}
			getAimProgressLine(query).then(res => {
				this.chartData.rows = res.data
			})
		}
	}
}
</script>

