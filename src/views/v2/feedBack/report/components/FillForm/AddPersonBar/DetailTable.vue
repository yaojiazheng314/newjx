<template>
	<el-table 
		:data="tableData"
		border
		:header-cell-style="tableHeaderStyle">
		
		<el-table-column prop="feedBackItemName" label="分配项" />
		
		<el-table-column prop="yearmonth" label="年 月" />
		
		<el-table-column prop="feedBackVal" label="发放绩效" />
		
		<el-table-column prop="reportPerNum" label="填报人数" />
		
		<el-table-column prop="reportSumVal" label="已填报" />

		<el-table-column prop="reportRestVal" label="未填报" />
		
	</el-table>
</template>

<script>
export default {
	name: 'detail-table',
	props: {
		tableData: Array
	},
	methods: {
		// table style
		tableHeaderStyle({ row, column, rowIndex, columnIndex }) {
		  return `width: 100%;
		              background-color: #F5F5F5;
		              border-top: 1px solid #d3e1f0;
		              border-bottom: 1px solid #d3e1f0;
		              color: #606266;
		              font-weight: normal;`
		}
		
	}
}
</script>

<style>
</style>
