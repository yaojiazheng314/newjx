<template>
	<!-- excel读取 -->
	<excel-dept-data v-if="edStatus" :is-fill="true" />
	<excel-per-data v-else-if="epStatus" :is-fill="true" />
</template>

<script>
/* excel页面 */
import ExcelDeptData from './components/ExcelDeptData'
import ExcelPerData from './components/ExcelPerData'
export default {
  name: 'EditForm',
  components: { ExcelDeptData, 
								ExcelPerData },
	data() {
		return {
			edStatus: false,
			epStatus: false
		}
	},
	created() {
		const status = this.$route.query.type
		if (status === '科室') {
			this.edStatus = true
		} else if (status === '人员') {
			this.epStatus = true
		}
	}
}
</script>
