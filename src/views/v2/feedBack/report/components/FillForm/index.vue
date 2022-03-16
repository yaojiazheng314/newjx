<template>
	<div>
		
		<!-- 操作栏 -->
		<operate-bar
			:parentBtns="buttons"
			:totalNum="totalNum"
			:currentNum="currentNum"
			@clickReturnBtn="clickReturnBtn"
			@clickSaveBtn="clickSaveBtn"
			@clickSubmitReport="clickSubmitReport"
			@clickLast="clickLast"
			@clickNext="clickNext" />
			
		
			
		<!-- 添加人员操作栏 -->
		<add-person-bar 
			ref="addPersonBar"
			v-if="loadStatus"
			:parentData="unreportedDept"
			:unreportedItems="unreportedItems"
			@addPersonToReportTable="addPersonToReportTable"/>
			
		<!-- 填报表 -->
		<report-table 
			ref="reportTable"
			v-if="loadStatus"
			:tableHeaders="tableHeaders"
			:parentData="unreportedDept"
			@transValToAddPersonBar="transValToAddPersonBar"/>
			<!-- 基础数据与分配说明 -->
		<base-data-form 
			ref="baseDataForm"
			v-if="loadStatus"
			:parentData="unreportedDept" />
			
		<!-- 操作栏 -->
		<operate-bar
			:parentBtns="buttons"
			:totalNum="totalNum"
			:currentNum="currentNum"
			@clickReturnBtn="clickReturnBtn"
			@clickSaveBtn="clickSaveBtn"
			@clickSubmitReport="clickSubmitReport"
			@clickLast="clickLast"
			@clickNext="clickNext" />
		
	</div>
</template>

<script>
import { Button } from '@/components/Models/button'
import OperateBar from '@/components/FormOperateBar'

import { DeptReportInfo } from '@/model/feed-back-report-dept'
import { FeedBackReportList } from '@/model/feed-back-report-list'
import BaseDataForm from './BaseDataForm'
import AddPersonBar from './AddPersonBar'
import ReportTable from './ReportTable'
export default {
	name: 'fbr-ff',
	components: { OperateBar, ReportTable, BaseDataForm, AddPersonBar },
	props: {
		unreportedDeptQuery: Object  // { feedBackDeptId, userId, yearmonth}
	},
	data() {
		return {
			// operate-bar data
			buttons: [ new Button('保 存', 'clickSaveBtn', ''),
								 new Button('提交上报', 'clickSubmitReport', '') ],
			// attr
			loadStatus: false,
			alertMsg: null,  // loading msg
			lastOrNextLoading: null,
			// data
			totalNum: 0,  // 待分配科室总数量
			currentNum: 0,  // 当前分配科室
			unreportedDept: null,  // {feedBackDept, user, yearmonth, reason}
			unreportedItems: [],  // 科室未上报的分配项 [{feedBackItem, feedBackVal, reportPerNum, sumReportVal}]
			tableHeaders: []  // [{ prop, label }]
		}
	},
	created() {
		var query = this.unreportedDeptQuery
		console.log(this.unreportedDeptQuery)
		query.flag = 0  // 未上报数据
		this.loadData(query)
	},
	methods: {
		/* ---- base event ---- */
		reload() {
			this.loadStatus = false
			this.$nextTick(() => {
				this.loadStatus = true
			})
		},
		/* ---- operate-bar events ---- */
		clickReturnBtn() {
			const yearmonth = this.unreportedDeptQuery.yearmonth
			this.$emit('closeFillForm', yearmonth,this.unreportedDeptQuery.feedBackDeptId)
		},
		
		/**
		 * @description 从report-table中获取 feedBackReportList: []
		 * 
		 */
		async clickSaveBtn() {
			this.showLoading('正在保存分配 填报列表，请稍候...')
			// 获取备注内容
			const reportDeptReason = this.$refs.baseDataForm.getSaveData()
			const reportList = this.$refs.reportTable.getSaveData()
			const res = await FeedBackReportList.doSave(reportList, reportDeptReason)
			if (res.status === 520) {
				this.finishLoading(res.msg, 'warning')
			} else {
				this.finishLoading('保存成功', 'success')
			}
		},
		
		/**
		 * @description 提交上报：
		 * 									1.校验科室绩效与已填报是否相等
		 */
		async clickSubmitReport() {
			this.showLoading("正在提交上报,请稍候...")
			// 下发科室绩效是否等于已填报绩效
			var isAllow = this.$refs.addPersonBar.isFeedBackEqualFill()
			// if (!isAllow) {
			// 	this.finishLoading('已填报不等于科室绩效,不能上报', 'warning')
			// 	return
			// }
			// 发送至服务端进行上报
			// 获取备注内容
			const reportDeptReason = this.$refs.baseDataForm.getSaveData()
			const reportList = this.$refs.reportTable.getSaveData()
			const res = await FeedBackReportList.doSubmitReport(reportList, reportDeptReason)
			if (res.status === 520) {
				this.finishLoading(res.msg, 'warning')
			} else {
				this.finishLoading('上报成功', 'success')
				this.clickReturnBtn()
			}
		},
		
		/* ---- add-person-bar events ---- */
		/**
		 * @description 将选中的人员{reportVO}传递至report-table
		 * @param {Object} options [ {reportVO} ]
		 */
		addPersonToReportTable(options) {
			this.$refs.reportTable.addReportVOs(options)
		},
		
		/**
		 * @param {Number} val
		 * @param {String} prop: feedBackItemName
		 */
		transValToAddPersonBar(val, feedBackItemName, perNum, removeRow) {
			this.$refs.addPersonBar.calcFillValFromReportTable(val, feedBackItemName, perNum, removeRow)
		},
		
		/**
		 * @param {Object} query { feedBackDeptId, userId, yearmonth, flag }
		 */
		async loadData(query) {
			// 从服务端获取最新的
			const data = await DeptReportInfo.getData(query)
			this.setData(data)
		},
		async clickLast() {
			this.waitingLastOrNext('读取上一个科室分配信息...')
			const item = this.unreportedDept
			const data = await DeptReportInfo.getLastOrNextData(item.feedBackDept, item.user, item.yearmonth, 0, this.currentNum, 'last')
			this.setData(data)
			this.closeWaitingLastOrNext()
		},
		async clickNext() {
			this.waitingLastOrNext('获取下一个科室分配信息...')
			const item = this.unreportedDept
			const data = await DeptReportInfo.getLastOrNextData(item.feedBackDept, item.user, item.yearmonth, 0, this.currentNum, 'next')
			this.setData(data)
			this.closeWaitingLastOrNext()
		},
		async setData(data) {
			// 赋值科室分配基础明细
			this.unreportedDept = data.data
			this.totalNum = data.totalNum
			this.currentNum = data.currentNum
			// 获取科室未上报分配项列表
			const query = {
				feedBackItem:this.unreportedDept.feedBackItem,
				feedBackDeptId: this.unreportedDept.feedBackDept,
				userId: this.unreportedDept.user,
				yearmonth: this.unreportedDept.yearmonth,
				flag: 0
			}
			const itemsData = await DeptReportInfo.getDeptReportItems(query)
			this.unreportedItems = itemsData
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
