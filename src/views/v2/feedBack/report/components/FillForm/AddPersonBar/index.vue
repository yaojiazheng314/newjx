<template>
	<div 
		class="fbr-ap-operatebar-container">
		
		<!-- 筛选同科室人员 -->
		<select-same-dept-person 
			:queryData="parentData"
			@addPerson="addPerson" />
		
		<!-- 查询全院人员 -->
		<fuzzy-query-all-person 
			:queryData="parentData"
			@addPerson="addPerson" />
			
		<!-- 获取最近年月科室分配的所有人员 -->
		<copy-person-temp 
			:queryData="parentData"
			@addPerson="addPerson" />
		
		<!-- 展开科室分配明细项 -->
		<span 
			v-if="hasData"
			style="float: right; margin-left: 20px; line-height: 2.1;"
			class="text-btn pointer"
			@click="() => { this.showDetail = !this.showDetail }">
			{{ this.showDetail ? "【收起明细】" : "【查看明细】" }}
		</span>
			
		<!-- 汇总用户填报数 -->
		<calc-report-data 
			style="float: right; line-height: 2.1;"
			:feedBackVal="feedBackVal"
			:fillVal="fillVal"
			:restVal="restVal" />
			
		<div
			v-show="showDetail"
			class="mt-10">
			<detail-table 
				:tableData="deptUnreportedItems" />
		</div>
		
		
	</div>
</template>

<script>
import SelectSameDeptPerson from './SelectSameDeptPerson'
import FuzzyQueryAllPerson from './FuzzyQueryAllPerson'
import CopyPersonTemp from './CopyPersonTemp'
import CalcReportData from './CalcReportData'
import DetailTable from './DetailTable'
export default {
	name: 'fbr-ff-bdf-add-person-bar',
	components: { SelectSameDeptPerson, 
								FuzzyQueryAllPerson, 
								CopyPersonTemp,
								CalcReportData,
								DetailTable },
	props: {
		parentData: Object,
		unreportedItems: Array
	},
	data() {
		return {
			// attr
			label1: "[查看明细]",
			showDetail: false,
			// data
			feedBackVal: 0,
			fillVal: 0,
			restVal: 0,
			deptUnreportedItems: []
		}
	},
	computed: {
		hasData: function () {
			return this.deptUnreportedItems.length > 0
		}
	},
	created() {
		this.deptUnreportedItems = this.unreportedItems
		this.calcFillVal()  // 计算填报值
	},
	methods: {
		
		calcFillVal() {
			const items = this.deptUnreportedItems
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
		
		/**
		 * @param {Object} val
		 * @param {Object} feedBackItemName
		 * @param {Object} perNum
		 * @param {Object} removeRow: [ { feedBackItemName: val } ]
		 */
		calcFillValFromReportTable(val, feedBackItemName, perNum, removeRow) {
			// 计算未上报分配项明细
			for (let i = 0, l = this.deptUnreportedItems.length; i < l; i++) {
				let unreportedItem = this.deptUnreportedItems[i]
				unreportedItem.reportPerNum = perNum
				if (feedBackItemName === unreportedItem.feedBackItemName) {
					unreportedItem.reportSumVal = val
					unreportedItem.reportRestVal =unreportedItem.feedBackVal- val
				} else if (feedBackItemName === 'all') {
					let minusVal = removeRow[unreportedItem.feedBackItemName]
					unreportedItem.reportSumVal += minusVal*-1
					unreportedItem.reportRestVal =unreportedItem.feedBackVal- minusVal
				}
			}
			this.calcFillVal()
		},
		
		/**
		 * @description 将选中的人员添加至report-table
		 * @param {Object} options
		 */
		addPerson(options) {
			this.$emit('addPersonToReportTable', options)
		},
		
		/**
		 * @description 科室绩效每个分配项是否等于其已填报数值
		 */
		isFeedBackEqualFill() {
			var isEqual = true
			const items = this.deptUnreportedItems
			for (let i = 0, l = items.length; i < l; i++) {
				let item = items[i]
				if (item.feedBackVal !== item.reportSumVal) {
					return false
				}
			}
			return isEqual
		}
		
	}
	
}
</script>

<style>
.fbr-ap-operatebar-container{
	padding: 10px 15px;
	background-color: rgb(224, 236, 249);
	border-bottom: 1px solid #aac1de;
	font-size: 14px;
	color: #798699;
}
.fbr-ap-operatebar-keytip {
  color: #000;
}
</style>
