<template>
	<div class="app-container">
		
		<!-- 上报科室分配明细列表 -->
		<dept-report-table
			ref="deptReportTable"
			v-show="!showExamineForm"
			@toExamineForm="loadExamineForm" />
		
		<!-- 审批界面 -->
		<examine-form 
			v-if="showExamineForm"
			:parentData="readDeptReportInfo"
			@closeExamineForm="closeExamineForm"/>
		
	</div>
</template>

<script>
import DeptReportTable from './components/DeptReportTable'
import ExamineForm from './components/ExamineForm'
export default {
	name: 'feed-back-examine',
	components: { DeptReportTable, ExamineForm },
	data() {
		return {
			// attr
			showExamineForm: false,
			// data
			readDeptReportInfo: null  // { feedBackDept, user, yearmonth } 
		}
	},
	created() {
		
	},
	methods: {
		loadExamineForm(deptReportInfo) {
			this.showExamineForm = true
			this.readDeptReportInfo = deptReportInfo
		},
		
		closeExamineForm() {
			this.showExamineForm = false
			this.$refs.deptReportTable.loadData()
		}
		
	}
}
</script>

<style>
</style>
