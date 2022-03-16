<template>
	<ve-waterfall 
		:data="chartData" 
		:settings="chartSettings">
	</ve-waterfall>
</template>

<script>
import VeWaterfall from 'v-charts/lib/waterfall.common'
import { getAimConfigWeightInfo } from '@/api/aim'
export default {
	props: {
		//上级权重id
		aimConfigParent: {
			type: Number
		}
	},
	name: 'AimChildWeight',
	components: { VeWaterfall },
	data() {
		this.chartSettings = {
      totalNum: 100,
      totalName: '总计',
      remainName: '剩余权重'
    }
		return {
			chartData: {
				columns: ['目标', '权重值'],
        rows: []
			},
			restWeight: 0.0
		}
	},
	created() {
		this.getData()
	},
	methods: {
		getData() {
			const query = {
				aimConfig: this.aimConfigParent
			}
			getAimConfigWeightInfo(query).then(res => {
				this.chartData.rows = res.data
			})
		}
	}
}
</script>
