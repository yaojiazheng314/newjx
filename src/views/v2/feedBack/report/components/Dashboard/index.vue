<template>
	<div>
		<!-- filter bar -->
		<fliter-bar 
			:parentYearmonth="yearmonth"
			:parentDepartment ="department"
			@changeYearmonth="changeYearmonth"
			@changeDepartment="changeDepartment"
			@reloadData="loadData" />

		<!-- unreported card -->
		<unreported-card 
			v-if="loadStatus"
			:unReportedList="unreportedData"
			@fillDeptFeedBackReport="fillDeptFeedBackReport"/>
		
		<!-- reported card -->
		<reported-card 
			v-if="loadStatus"
			:reportedList="reportedData"
			:yearmonth="yearmonth"
			:userId="curUserId" />
		
		<!-- report histogram -->
		<report-histogram
			v-if="loadStatus"
			:parentYearmonth="yearmonth"
			:parentDepartment="department"/>
			
	</div>
</template>

<script>
import { getMonth } from '@/utils/date'
import { getReportList } from '@/api/feedBackReport'
import { FeedBackReportList } from '@/model/feed-back-report-list'

import FliterBar from './FilterBar'
import UnreportedCard from './UnreportedCard'
import ReportedCard from './ReportedCard'
import ReportHistogram from './ReportHistogram'
export default {
	name: 'fbr-dashboard',
	components: { FliterBar, UnreportedCard, ReportedCard, ReportHistogram },
	props: {
		loadYearmonth: String,
		loadDepartment:Number
	},
	data() {
		return {
			// attr
			curUserId: this.$store.getters.userID,
			loadStatus: false,  // 是否加载子组件
			// data
			yearmonth: "",
			department:null,
			// feedBackReportList:
			//	{yearmonth, userId, items, unreportedItems, reportedItems}
			feedBackReportList: null
		}
	},
	computed: {
		unreportedData: function () {
			return this.feedBackReportList.unReportItemsGroupbyDept
		},
		reportedData: function () {
			return this.feedBackReportList.reportItemsGroupbyDept
		}
	},
	created() {
		this.yearmonth = this.loadYearmonth === "" ? getMonth(true, 0) : this.loadYearmonth
		// console.log(this.loadDepartment)
		this.department = this.loadDepartment
		this.initData()
	},
	methods: {
		/* ---- init ---- */
		async initData() {
			this.feedBackReportList = new FeedBackReportList(this.yearmonth, this.curUserId,this.department)
			// console.log(this.feedBackReportList)
			await this.feedBackReportList.doQuery()
			this.loadStatus = true
		},

		reload() {
			this.loadStatus = false
			this.$nextTick(() => {
				this.loadStatus = true
			})
		},
		
		async loadData() {
			this.feedBackReportList.yearmonth = this.yearmonth
			this.feedBackReportList.department = this.department
			await this.feedBackReportList.doQuery()
			this.reload()
		},
		
		/* ---- filter-bar event ---- */
		changeYearmonth(yearmonth) {
			this.yearmonth = yearmonth
		},
		changeDepartment(department) {
			this.department = department
		},
		/* ---- unreported-card event ---- */
		/**
		 * @param {Object} fillQuery {feedBackDept, feedBackDeptName, yearmonth}
		 */
		fillDeptFeedBackReport(fillQuery) {
			const query = {
				feedBackDeptId: fillQuery.feedBackDept,
				userId: this.curUserId,
				yearmonth: fillQuery.yearmonth
			}
			this.$emit('toFill', query)
		}
		
	}
}
</script>

<style>
</style>
