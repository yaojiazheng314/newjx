<template>
	<exam-month-dept v-if="dStatus" :is-fill="true" />
	<exam-month-per v-else-if="pStatus" :is-fill="true" />
</template>

<script>
import ExamMonthDept from './components/ExamMonthDept'
import ExamMonthPer from './components/ExamMonthPer'
export default {
  name: 'Exec',
  components: { ExamMonthDept, 
								ExamMonthPer },
	data() {
		return {
			dStatus: false,
			pStatus: false
		}
	},
	created() {
		/* 判断考核方向加载不同的考核页面 */
		const status = this.$route.query.examTempAssessed
		if (status === '科室') {
			this.dStatus = true
		} else if (status === '人员') {
			this.pStatus = true
		}
	}
}
</script>
