<template>
	<div>
		
		<!-- 操作栏 -->
		<operate-bar
			v-if="loadStatus"
			:parentBtns="buttons"
			:totalNum="totalNum"
			:currentNum="currentNum"
			@clickReturnBtn="clickReturnBtn"
			@clickPassExamineBtn="clickPassExamineBtn"
			@clickCancelReportBtn="clickCancelReportBtn"
			@clickLast="clickLast"
			@clickNext="clickNext" />
			
		<!-- 分配说明 -->
		<base-data-form 
			v-if="loadStatus"
			:parentData="deptReportInfo" />
		
		<!-- 汇总明细表 -->
		<report-data-bar
			v-if="loadStatus"
			:parentData="deptReportInfo"
			:reportedItems="reportedItems"></report-data-bar>
			
		<!-- 填报表 -->
		<report-table
			v-if="loadStatus"
			:tableHeaders="tableHeaders"
			:parentData="deptReportInfo"></report-table>
		
		<!-- 操作栏 -->
		<operate-bar
			v-if="loadStatus"
			:parentBtns="buttons"
			:totalNum="totalNum"
			:currentNum="currentNum"
			@clickReturnBtn="clickReturnBtn"
			@clickPassExamineBtn="clickPassExamineBtn"
			@clickCancelReportBtn="clickCancelReportBtn"
			@clickLast="clickLast"
			@clickNext="clickNext" />
		
	</div>
</template>

<script>
import { Button } from '@/components/Models/button'
import OperateBar from '@/components/FormOperateBar'
import { DeptReportInfo } from '@/model/feed-back-report-dept'
import { FeedBackReportStatus } from '@/model/feed-back-report-status'

import BaseDataForm from './BaseDataForm'
import ReportDataBar from './ReportDataBar'
import ReportTable from './ReportTable'
export default {
	name: 'fbe-examine-form',
	components: { OperateBar, BaseDataForm, ReportDataBar, ReportTable },
	props: {
		parentData: Object
	},
	data() {
		return {
			// attr
			loadStatus: false,
			alertMsg: null,  // loading msg
			lastOrNextLoading: null,
			// save data
			cancelReport: 0,
			passExamine: 2,
			// data
			totalNum: 0,  // 待审核科室总数量
			currentNum: 0,  // 当前审核科室
			deptReportInfo: null,  // {feedBackDept, user, yearmonth}
			reportedItems: [],
			tableHeaders: []  // [{ prop, label }]
		}
	},
	computed: {
		buttons : function () {
			switch (this.deptReportInfo.status) {
				case 1:
					return [ new Button('取消上报', 'clickCancelReportBtn', ''),
									 new Button('通过审核', 'clickPassExamineBtn', '') ]
				case 2:
					return [ new Button('取消上报', 'clickCancelReportBtn', '') ]
				default:
					return []
			}
		}
	},
	created() {
		this.deptReportInfo = this.parentData
	},
	mounted() {
		this.loadData()
	},
	methods: {
		/* ---- base event ---- */
		reload() {
			this.loadStatus = false
			this.$nextTick(() => {
				this.loadStatus = true
			})
		},
		
		async loadData() {
			this.waitingLastOrNext('读取科室绩效分配信息...')
			const params = this.deptReportInfo
			const data = await DeptReportInfo.getDeptReportExamineData(params.feedBackItem,params.feedBackDept, params.user, params.yearmonth, params.status)
			await this.setData(data)
			this.closeWaitingLastOrNext()
		},
		
		/* ---- operate-bar events ---- */
		clickReturnBtn() {
			const yearmonth = this.deptReportInfo.yearmonth
			this.$emit('closeExamineForm', yearmonth)
		},
		
		async clickPassExamineBtn() {
			const item = this.deptReportInfo
			this.showLoading(`提交${item.feedBackDeptName}${item.usersName}的反馈上报内容`)
			const saveItem = {
				feedBackItem:item.feedBackItem,
				department: item.feedBackDept,
				yearmonth: item.yearmonth,
				user: item.user,
				status: this.passExamine  // 取消上报
			}
			const res = await FeedBackReportStatus.saveList([saveItem])
			let status = res.status
			if (status === 520) {
				this.finishLoading(res.msg, 'error')
			} else {
				this.finishLoading(`${item.feedBackDeptName}${item.usersName}的反馈上报已通过审核`, 'success')
				this.deptReportInfo.status = this.passExamine
				this.reload()
			}
		},
		
		async clickCancelReportBtn() {
			const item = this.deptReportInfo
			this.showLoading(`正在取消${item.feedBackDeptName}${item.usersName}的上报，请稍候...`)
			const saveItem = {
				feedBackItem:item.feedBackItem,
				department: item.feedBackDept,
				yearmonth: item.yearmonth,
				user: item.user,
				status: this.cancelReport  // 取消上报
			}
			const res = await FeedBackReportStatus.saveList([saveItem])
			let status = res.status
			if (status === 520) {
				this.finishLoading(res.msg, 'error')
			} else {
				this.finishLoading(`已取消${item.feedBackDeptName}${item.usersName}的上报，${item.usersName}可在[分配填报]中重新进行分配上报`, 'success')
			}
			this.clickReturnBtn()
		},
		
		async setData(data) {
			// 赋值科室分配基础明细
			this.deptReportInfo = data.data
			this.totalNum = data.totalNum
			this.currentNum = data.currentNum
			// 获取科室未上报分配项列表
			const query = {
				feedBackItem:this.deptReportInfo.feedBackItem,
				feedBackDeptId: this.deptReportInfo.feedBackDept,
				userId: this.deptReportInfo.user,
				yearmonth: this.deptReportInfo.yearmonth,
				flag: 1
			}
			const itemsData = await DeptReportInfo.getDeptReportItems(query)
			this.reportedItems = itemsData
			this.tableHeaders = itemsData.map(t => {
				let item = {
					prop: t.feedBackItemName,
					label: t.feedBackItemName,
					feedBackItem: t.feedBackItem
				}
				return item
			})
			this.reload()
		},
		
		async clickLast() {
			this.waitingLastOrNext('读取上一个上报科室信息...')
			const item = this.deptReportInfo
			const data = await DeptReportInfo.getLastOrNextExamineData(item.feedBackItem,item.feedBackDept, item.user, item.yearmonth, 'last')
			this.setData(data)
			this.closeWaitingLastOrNext()
		},
		async clickNext() {
			this.waitingLastOrNext('获取下一个上报科室信息...')
			const item = this.deptReportInfo
			const data = await DeptReportInfo.getLastOrNextExamineData(item.feedBackItem,item.feedBackDept, item.user, item.yearmonth, 'next')
			this.setData(data)
			this.closeWaitingLastOrNext()
		},
		
		// waitingLastOrNext
		waitingLastOrNext(loadingText) {
			this.lastOrNextLoading = this.$loading({
		    lock: true,
		    text: loadingText,
		    spinner: 'el-icon-loading',
		    background: 'rgba(0, 0, 0, 0.7)'
		  });
		},
		
		closeWaitingLastOrNext() {
			this.lastOrNextLoading.close()
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
		}
		
	}
}
</script>

<style>
</style>
