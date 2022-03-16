<template>
	<el-card
		shadow="hover"
		:body-style="{ padding: '20px' }">
		
		<div
			style="font-size: 14px;"
			class="mb-10">
			<span 
				style="font-weight: bold;">
				{{ item.feedBackDeptName }}
			</span>
			<span
				style="float: right;">
				<span
					style="color: #9b9b9b;">
					{{ label1 }}
				</span>
				<span>
					{{ sumFeedBackVal }}
				</span>
				<span
					style="color: #9b9b9b;" 
					class="ml-5">
					{{ label2 }}
				</span>
				<span>
					{{ sumReportSumVal }}
				</span>
			</span>
			
		</div>
		
		<dept-info-table
			:items="item.reportItems" />
		
		<div class="mt-10">
			<div 
				style="float: left;"
				class="mb-10">
				<el-tag
					:type="statusTagType(item.status)" 
					disable-transitions>{{ item.status === 0 ? '未上报' : item.status === 1 ? '已上报' : '已审核'}}
					<i style="color: #20B2AA" 
						:class="statusIcon(item.status)" />
					</el-tag>
			</div>
			
			<el-button 
				v-if="item.status === 0"
				style="float: right;"
				class="handle-button mb-10"
				size="mini"
				@click="clickBtn1">
				{{ labelBtn1 }}
			</el-button>
			
		</div>
		
	</el-card>
</template>

<script>
import DeptInfoTable from './DeptInfoTable'
export default {
	name: 'fbr-dashboard-dept-info-card',
	components: { DeptInfoTable },
	props: {
		// { feedBackDept, feedBackDeptName, yearmonth, status, reportItems }
		item: Object
	},
	data() {
		return {
			// attr
			label1: "绩效总计：",
			label2: "分配总计：",
			
			labelBtn1: "分配填报"
		}
	},
	computed: {
		sumFeedBackVal: function () {
			var value = 0
			const reportItems = this.item.reportItems
			for (let i = 0, l = reportItems.length; i < l; i++) {
				let val = reportItems[i].feedBackVal
				value += val !== undefined && val !== null ? val : 0
			}
			return value
		},
		sumReportSumVal: function () {
			var value = 0
			const reportItems = this.item.reportItems
			for (let i = 0, l = reportItems.length; i < l; i++) {
				let val = reportItems[i].reportSumVal
				value += val !== undefined && val !== null ? val : 0
			}
			return value
		}
			
	},
	methods: {
		statusTagType(status) {
			return status === 0 ? 'warning' : status === 1 ? 'success' : 'info'
		},
		statusIcon(status) {
			return status === 0 ? 'el-icon-edit' : status === 1 ? 'el-icon-upload' : 'el-icon-success'
		},
		
		clickBtn1() {
			const query = {
				feedBackDept: this.item.feedBackDept,
				feedBackDeptName: this.item.feedBackDeptName,
				yearmonth: this.item.yearmonth
			}
			this.$emit('clickFillBtn', query)
		}
	}
}
</script>

<style>
</style>
