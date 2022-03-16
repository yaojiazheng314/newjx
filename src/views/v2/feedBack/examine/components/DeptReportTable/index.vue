<template>
	<div>
		<link-page-title :title="title" :tip="tip" />
		<filter-bar 
			:parentYearmonth="yearmonth"
			@changeYearmonth="changeYearmonth"
			@changeFuzzyQueryStr="changeFuzzyQueryStr"
			@loadData="loadData" />

		<operate-bar
		  :page="deptReportPage.page"
		  :totalPage="deptReportPage.totalPage"
		  @handlePage="handlePage"
			@cancelReport="cancelReport"
			@passAll="passAll" />
		
		<report-status-table 
			ref="reportStatusTable"
			:deptReportPage="deptReportPage"
			@handleSelection="handleSelection"
			@rowClick="rowClick" />
		
		<operate-bar
		  :page="deptReportPage.page"
		  :totalPage="deptReportPage.totalPage"
		  @handlePage="handlePage"
			@cancelReport="cancelReport"
			@passAll="passAll" />
		
	</div>
</template>

<script>
import { DeptReportPage } from '@/model/feed-back-dept-report-page'
import LinkPageTitle from '@/components/LinkPageTitle'
import { FeedBackReportStatus } from '@/model/feed-back-report-status'
import { formatDate } from '@/utils/date'
import FilterBar from './FilterBar'
import OperateBar from './OperateBar'
import ReportStatusTable from './ReportStatusTable'
export default {
	name: 'dept-report-table',
	components: { LinkPageTitle, FilterBar, OperateBar, ReportStatusTable },
	data() {
		return {
			// attr
			title: "绩效分配反馈审核",
			// page attr
			pageLimit: 20,
			yearmonth: '',
			fuzzyQueryName: '',
			// data
			deptReportPage: {},
			selectedItems: []
		}
	},
	computed: {
		tip() {
			let total = this.deptReportPage.total === undefined ? 0 : this.deptReportPage.total
			let unExamineNum = (this.deptReportPage.unExamineNum === undefined ||
			this.deptReportPage.unExamineNum === null) ? 0 : this.deptReportPage.unExamineNum
		  return `(共 ${total} 上报科室，${unExamineNum} 科室待审核)`
		}
	},
	mounted() {
		this.loadData()
		this.setDefaultYearmonth()
	},
	methods: {
		async loadData() {
			// console.log('加载数据')
			this.$refs.reportStatusTable.showLoading(true)
			this.deptReportPage = new DeptReportPage(this.pageLimit, this.yearmonth, this.fuzzyQueryName)
			await this.deptReportPage.doQuery()
			this.$refs.reportStatusTable.showLoading(false)
		},
		
		/* ---- filter-bar ---- */
		changeYearmonth(val) {
			// console.log(val)
			this.yearmonth = val
		},
		
		setDefaultYearmonth() {
				// var self = this
				const month = new Date().getMonth()
				var defYearmonth = new Date(new Date().setMonth(month, 1))
				const ymStr = formatDate(defYearmonth, 'yyyy-MM')
				// console.log(ymStr)
				this.yearmonth = ymStr
			},
		changeFuzzyQueryStr(val) {
			// console.log(val)
			this.fuzzyQueryName = val
		},
		/* ---- operate-bar ---- */
		/**
		 * @description 处理分页查询操作
		 * @param {String} flag: "next"/"last"/"jump"
		 * @param {Number} pageNum: 跳转到的页面
		 */
		handlePage(flag, pageNum) {
		  switch (flag) {
		    case "next":
		      this.deptReportPage.getNextPage();
		      break;
		    case "last":
		      this.deptReportPage.getLastPage();
		      break;
		    case "jump":
		      this.deptReportPage.jumpTo(pageNum);
		      break;
		  }
		},
		
		async passAll() {
			this.showLoading('正在审核通过全部科室的分配上报内容...')
			const res = await FeedBackReportStatus.passAllReport(this.yearmonth, 2)
			let status = res.status
			if (status === 520) {
				this.finishLoading(res.msg, 'error')
			} else {
				this.finishLoading('全部上报科室通过审核', 'success')
			}
			this.loadData()
		}, 
		
		/* ---- operate-bar events ---- */
		async cancelReport() {
			this.showLoading('正在取消选中科室的分配上报...')
			let len = this.selectedItems.length
			if (len === undefined || len === 0) {
				this.msgBox('未选择任何上报科室', 'warning')
				return
			}
			var saveData = []
			for (let i = 0; i < len; i++) {
				let item = this.selectedItems[i]
				let reportStatus = {
					department: item.feedBackDept,
					yearmonth: item.yearmonth,
					user: item.user,
					status: 0,
					feedBackItem:item.feedBackItem
				}
				saveData.push(reportStatus)
			}
			const res = await FeedBackReportStatus.saveList(saveData)
			let status = res.status
			if (status === 520) {
				this.finishLoading(res.msg, 'error')
			} else {
				this.finishLoading('取消上报完成', 'success')
			}
			this.loadData()
		},
		
		/* ---- report-status-table events ---- */
		handleSelection(val) {
		  this.selectedItems = val
		},
		
		/**
		 * @param {Object} row: {feedBackDept, user, yearmonth}
		 */
		rowClick(row) {
		  this.$emit('toExamineForm', row)
		},
		
		/* ---- loading ---- */
		showLoading(msg) {
		  this.alertMsg = this.$message({
		      duration: 0,
		      center: true,
		      iconClass: 'el-icon-loading',
		      customClass: 'alert-msg-success',
		      message: msg
		    })
		},
		finishLoading(msg, type) {
		  this.alertMsg.close()
		  this.$message({
		    message: msg,
		    center: true,
		    type: type,
		    duration: 6000
		  })
		},
		
		msgBox(msg, type) {
			this.$message({
			  message: msg,
			  center: true,
			  type: type,
			  duration: 5000
			})
		}
	}
}
</script>

<style>
</style>
