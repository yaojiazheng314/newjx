<template>
	<el-select
		style="width: 230px;"
		size="mini"
		v-model="optionSelected" 
		value-key="person"
		filterable multiple clearable
		placeholder="选择要分配的同科室人员"
		@change="changeSelected">
		<el-option-group
			v-for="group in params"
			:key="group.label"
			:label="group.label">
			<el-option
				v-for="item in group.options"
				:key="item.person"
				:label="item.perName"
				:value="item">
			</el-option>
		</el-option-group>
	</el-select>
</template>

<script>
import { getSameDeptPerParam } from '@/api/feedBackReport'
export default {
	name: 'select-same-dept-person',
	props: {
		queryData: Object  // { feedBackDept, user, yearmonth }
	},
	data() {
		return {
			// data
			params: [],
			optionSelected: null  // 选中的人员
		}
	},
	created() {
		// console.log(this.query)
		this.initData()
	},
	methods: {
		initData() {
			const query = {
				feedBackItem: null,  // 不限制分配项
				feedBackDept: this.queryData.feedBackDept,
				userID: this.queryData.user
			}
			// console.log(222)
			// console.log(query)
			getSameDeptPerParam(query).then(res => {
				this.params = res.data
			})
		},
		
		changeSelected(options) {
			this.$emit('addPerson', options)
			this.optionSelected = []
		}
		
	}
	
}
</script>

<style>
</style>
