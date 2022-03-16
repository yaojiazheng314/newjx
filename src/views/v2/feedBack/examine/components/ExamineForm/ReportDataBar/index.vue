<template>
	<div class="fbe-ef-databar-container">
		
		<!-- 汇总用户填报数 -->
		<calc-report-data 
			:feedBackVal="feedBackVal"
			:fillVal="fillVal"
			:restVal="restVal" />
		
		<!-- 展开科室分配明细项 -->
		<span 
			v-if="hasData"
			style="margin-left: 20px; line-height: 2.1;"
			class="text-btn pointer"
			@click="() => { this.showDetail = !this.showDetail }">
			{{ this.showDetail ? "【收起明细】" : "【查看明细】" }}
		</span>
			
		<div
			v-show="showDetail"
			class="mt-10">
			<detail-table 
				:tableData="reportedItems" />
		</div>
		
	</div>
</template>

<script>
import CalcReportData from './CalcReportData'
import DetailTable from './DetailTable'
export default {
	name: 'fre-ef-report-data-bar',
	components: { CalcReportData, DetailTable },
	props: {
		parentData: Object,
		reportedItems: Array
	},
	data() {
		return {
			// attr
			showDetail: false,
			// data
			items: []
		}
	},
	computed: {
		hasData: function () {
			return this.reportedItems.length > 0
		}
	},
	created() {
		this.items = this.reportedItems
		this.calcFillVal()
	},
	methods: {
		calcFillVal() {
			const items = this.items
			var val1 = 0, val2 = 0
			for (let i = 0, l = items.length; i < l; i++) {
				let item = items[i]
				val1 += item.feedBackVal
				val2 += item.reportSumVal
			}
			this.feedBackVal = val1
			this.fillVal = val2
			this.restVal = val1 - val2
		},
	}
}
</script>

<style>
.fbe-ef-databar-container{
	padding: 10px 15px;
	background-color: rgb(224, 236, 249);
	border-bottom: 1px solid #aac1de;
	font-size: 14px;
	color: #000;
}
.fbe-ef-databar-container-keytip {
  color: #000;
}
</style>
