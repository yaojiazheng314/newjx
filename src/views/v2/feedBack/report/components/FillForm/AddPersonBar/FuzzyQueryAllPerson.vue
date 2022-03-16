<template>
	<el-select
		style="width: 280px;"
		size="mini"
		v-model="optionSelected"
		value-key="person"
		multiple filterable
		remote reserve-keyword
		placeholder="输入人员编码/姓名或科室名称查询"
		:no-data-text="noOptionsText"
		:remote-method="remoteMethod"
		:loading="remoteLoading"
		@change="changeSelected">
		<el-option
			v-for="item in params"
			:key="item.person"
			:value="item">
			<span style="float: left">{{ item.perName }}</span>
			<span style="color: #8492a6; font-size: 13px">
				{{ item.perCode }}
			</span>
			<span style="float: right; color: #8492a6; font-size: 13px">
				{{ item.perDeptName }}
			</span>
		</el-option>
	</el-select>
</template>

<script>
import { getAllHospPersonParam } from '@/api/feedBackReport'
export default {
	name: 'fuzzy-query-all-person',
	props: {
		queryData: Object  // { feedBackDept, user, yearmonth }
	},
	data() {
		return {
			// attr
			noOptionsText: "没有符合条件的人员",
			remoteLoading: false,
			// data
			params: [],
			optionSelected: [],
		}
	},
	methods: {
		remoteMethod(query) {
			if (query !== '') {
		    this.remoteLoading = true;
				const search = {
					keyWord: query,
					feedBackItem: null,
					feedBackDept: this.queryData.feedBackDept,
					userID: this.queryData.user
				}
		    getAllHospPersonParam(search).then(res => {
					this.params = res.data
				})
				this.remoteLoading = false;
		  }else {
		    this.params = [];
		  }
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
