<template>
	<el-table
		:data="items"
		size="mini"
		style="width: 100%;"
		height="150">
		
		<el-table-column prop="feedBackItemName" :label="label1" show-overflow-tooltip />
		<el-table-column prop="feedBackVal" :label="label2" />
		<el-table-column prop="reportPerNum" :label="label3" />
		<el-table-column prop="reportSumVal" :label="label4" />
	</el-table>
</template>

<script>
export default {
	name: 'fbr-dashboard-dept-info-table',
	props: {
		items: Array
	},
	data() {
		return {
			label1: "分配项",
			label2: "分配绩效",
			label3: "已分配人数",
			label4: "已分配绩效"
		}
	}
	
}
</script>

<style>
</style>
