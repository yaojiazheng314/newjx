<template>
	<div style="display: inline-block; margin: 5px 0 5px 0;">
		
		<!-- select yearmonth -->
		<el-date-picker
			v-model="yearmonth"
			type="month"
			size="small"
			placeholder="选择填报年月"
			format="yyyy 年 M 月"
			value-format="yyyy-MM"
			:clearable="false"
			:editable="false"
			@change="changeYearmonthSelected">
		</el-date-picker>
		
		<el-input
			style="width: 300px;"
			v-model="fuzzyQueryStr"
			placeholder="输入科室名称搜索..."
			size="small"
			@change="changeFuzzyQueryStr">
		</el-input>
		
		<!-- do search button -->
		<el-button
			class="handle-button-blue"
			v-waves 
			type="primary"
			size="small"
			@click="clickBtn" >
			{{ labelBtn }}
		</el-button>
		
	</div>
</template>

<script>
import waves from '@/directive/waves'
import { formatDate } from '@/utils/date'
export default {
	name: '',
	directives: { waves },
	props: {
		parentYearmonth: String
	},
	data() {
		return {
			// attr,
			labelBtn: "查 询",
			// data
			yearmonth: "",
			fuzzyQueryStr: ""
		}
	},
	created() {
		this.setDefaultYearmonth()
	},
	methods: {
		// change parentYearmonth
		changeYearmonthSelected() {
			this.$emit('changeYearmonth', this.yearmonth)
		},
			setDefaultYearmonth() {
				// var self = this
				const month = new Date().getMonth()
				var defYearmonth = new Date(new Date().setMonth(month, 1))
				const ymStr = formatDate(defYearmonth, 'yyyy-MM')
				// console.log(ymStr)
				this.yearmonth = ymStr
			},
		changeFuzzyQueryStr() {
			this.$emit('changeFuzzyQueryStr', this.fuzzyQueryStr)
		},
		clickBtn() {
			this.$emit('loadData')
		}
	}
}
</script>

<style>
</style>