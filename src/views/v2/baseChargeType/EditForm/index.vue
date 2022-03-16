<template>
	<div v-if="loadStatus">
		
		<!-- 操作栏 -->
		<operate-bar 
			:parentBtns="buttons"
			:totalNum="totalType"
			:currentNum="currentType"
			@clickReturnBtn="clickReturnBtn"
			@clickSaveBtn="clickSaveBtn"
			@clickLast="clickLast"
			@clickNext="clickNext" />
		
		<!-- BaseChargeType基础数据 -->
		<base-data-form 
			ref="baseDataForm"
			:parentBaseChargeType="baseChargeType"/>
		
		<!-- Link表 operatebar -->
		<link-table-operate-bar 
			:parentBaseChargeType="baseChargeType"
			@addLinks="addLinks"/>
			
		<!-- Link表 -->
		<link-table 
			ref="linkTable"
			:parentBaseChargeType="baseChargeType" />
		
		<!-- 操作栏 -->
		<operate-bar
			:parentBtns="buttons"
			:totalNum="totalType"
			:currentNum="currentType"
			@clickReturnBtn="clickReturnBtn"
			@clickSaveBtn="clickSaveBtn"
			@clickLast="clickLast"
			@clickNext="clickNext" />

	</div>
</template>

<script>
import { BaseChargeType } from '@/model/base-charge-type'
import { Button } from '@/components/Models/button'
import OperateBar from '@/components/FormOperateBar'

import BaseDataForm from './BaseDataForm'
import LinkTableOperateBar from './LinkTableOperateBar'
import LinkTable from './LinkTable/index'
export default {
	name: 'charge-type-edit-form',
	components: { OperateBar, BaseDataForm, LinkTableOperateBar, LinkTable },
	props: {
		parentBaseChargeType: Object  // BaseChargeType: { id, code, name... }
	},
	data() {
		return {
			// operate-bar data
			buttons: [ new Button('保 存', 'clickSaveBtn', '')	],
			// attr
			loadStatus: false,
			alertMsg: null,  // loading msg
			lastOrNextLoading: null,
			// data
			totalType: 0,  // 收入类别总数
			currentType: 0,  // 当前收入类别
			baseChargeType: null
			
		}
	},
	created() {
		this.baseChargeType = this.parentBaseChargeType
		const baseChargeTypeId = this.baseChargeType.id
		if (baseChargeTypeId !== undefined && baseChargeTypeId !== null) {
			this.loadData(baseChargeTypeId)
		}
	},
	methods: {
		reload() {
			this.loadStatus = false
			this.$nextTick(() => {
				this.loadStatus = true
			})
		},
		// loadData
		async loadData(baseChargeTypeId) {
			const data = await BaseChargeType.getData(baseChargeTypeId)
			this.setData(data)
		},
		async clickLast() {
			this.waitingLastOrNext('获取上一个收入类别...')
			const baseChargeTypeId = this.baseChargeType.id
			const data = await BaseChargeType.getLastOrNextData(baseChargeTypeId, 'last')
			this.setData(data)
			this.closeWaitingLastOrNext()
		},
		async clickNext() {
			this.waitingLastOrNext('获取下一个收入类别...')
			const baseChargeTypeId = this.baseChargeType.id
			const data = await BaseChargeType.getLastOrNextData(baseChargeTypeId, 'next')
			this.setData(data)
			this.closeWaitingLastOrNext()
		},
		setData(data) {
			this.baseChargeType = data.data
			this.totalType = data.totalNum
			this.currentType = data.currentNum
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
		
		// addLinks
		addLinks(links) {
			this.$refs.linkTable.addLinks(links)
		},
	
		// buttons click methods
		clickReturnBtn() {
			this.$emit('closeEditForm')
		},
		
		clickSaveBtn() {
			const baseChargeType = this.$refs.baseDataForm.getData()
			const links = this.$refs.linkTable.getData()
			this.saveData(baseChargeType, links)
		},
		
		/* ---- data methods ---- */
		async saveData(baseChargeType, links) {
			this.showLoading("收入类别信息保存中...")
			const res = await BaseChargeType.doSave(baseChargeType, links)
			let status = res.status
			switch(status) {
				case 200:
					this.finishLoading("保存成功", 'success');
					break;
				default:
					this.finishLoading(res.msg, 'error');
			}
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
