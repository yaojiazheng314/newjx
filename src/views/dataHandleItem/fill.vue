<template>
	<handle-fill-dept v-if="dStatus" :is-fill="true" />
	<handle-fill-per v-else-if="pStatus" :is-fill="true" />
	<!-- excel填报 -->
	<excel-fill-dept v-else-if="edStatus" :is-fill="true" />
	<excel-fill-per v-else-if="epStatus" :is-fill="true" />
</template>

<script>
import HandleFillDept from './components/HandleFillDept'
import HandleFillPer from './components/HandleFillPer'
/* excel填报页面 */
import ExcelFillDept from './components/ExcelFillDept'
import ExcelFillPer from './components/ExcelFillPer'
export default {
  name: 'EditForm',
  components: { HandleFillDept, 
								HandleFillPer, 
								ExcelFillDept, 
								ExcelFillPer },
	data() {
		return {
			dStatus: false,
			pStatus: false,
			edStatus: false,
			epStatus: false
		}
	},
	created() {
		const status = this.$route.query.type
		if (status === '科室') {
			this.dStatus = true
		} else if (status === '人员') {
			this.pStatus = true
		} else if (status === 'excelDept') {
			this.edStatus = true
		} else if (status === 'excelPer') {
			this.epStatus = true
		}
	}
}
</script>
