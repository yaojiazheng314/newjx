<template>
	<div 
		:style="containerStyle"
		class="app-container">
		<!-- fill-form -->
		<fill-form 			
			v-if="showFill"
			:unreportedDeptQuery="unreportedDeptQuery"
			@closeFillForm="closeFillForm" />
		<!-- dashborad -->
		<dashboard 
			v-else
			:loadYearmonth="loadYearmonth"
			:loadDepartment="loadDepartment"
			@toFill="toFillForm" />
		
		
		
	</div>
</template>

<script>
import Dashboard from './components/Dashboard'
import FillForm from './components/FillForm'
export default {
	name: 'feed-back-report',
	components: { Dashboard, FillForm },
	data() {
		return {
			// attr
			showFill: false,  // 是否显示填报页面
			// data
			loadYearmonth: "",  // 加载dashboard的yearmonth
			loadDepartment:null,
			// 分配科室的填报信息 { feedBackDeptId, userId, yearmonth }
			unreportedDeptQuery: null
		}
	},
	computed: {
		containerStyle: function () {
			if (!this.showFill) {
				return {
					'background-color': '#F5F5F5',
					'padding-bottom': '10px'
				}
			}
			return ''
		}
	},
	methods: {
		/**
		 * @description 加载填报科室分配项FORM
		 * @param {Object} fillDeptQuery: { feedBackDeptId, userId, yearmonth }
		 */
		toFillForm(fillDeptQuery) {
			// console.log('fillDeptQuery1')
			// console.log(fillDeptQuery)
			this.unreportedDeptQuery = fillDeptQuery
			this.showFill = true
		},
		
		closeFillForm(yearmonth,department) {
			this.loadYearmonth = yearmonth
			this.loadDepartment = department
			this.showFill = true
			this.$nextTick(() => {
				this.showFill = false
			})
		}
		
	}
}
</script>

<style>
</style>
