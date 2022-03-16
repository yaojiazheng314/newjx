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
		
		<!-- BaseCostType基础数据 -->
		<base-data-form 
			ref="baseDataForm"
			:parentBaseCostType="baseCostType"/>
		
		<!-- Link表 operatebar -->
		<link-table-operate-bar 
			:parentBaseCostType="baseCostType"
			@addLinks="addLinks"/>
			
		<!-- Link表 -->
		<link-table 
			ref="linkTable"
			:parentBaseCostType="baseCostType" />
		
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
import { BaseCostType } from '@/model/base-Cost-type'
import { Button } from '@/components/Models/button'
import OperateBar from '@/components/FormOperateBar'

import BaseDataForm from './BaseDataForm'
import LinkTableOperateBar from './LinkTableOperateBar'
import LinkTable from './LinkTable/index'
export default {
	name: 'Cost-type-edit-form',
	components: { OperateBar, BaseDataForm, LinkTableOperateBar, LinkTable },
	props: {
		parentBaseCostType: Object  // BaseCostType: { id, code, name... }
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
			baseCostType: null
			
		}
	},
	created() {
		this.baseCostType = this.parentBaseCostType
		const baseCostTypeId = this.baseCostType.id
		if (baseCostTypeId !== undefined && baseCostTypeId !== null) {
			this.loadData(baseCostTypeId)
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
		async loadData(baseCostTypeId) {
			const data = await BaseCostType.getData(baseCostTypeId)
			this.setData(data)
		},
		async clickLast() {
			this.waitingLastOrNext('获取上一个收入类别...')
			const baseCostTypeId = this.baseCostType.id
			const data = await BaseCostType.getLastOrNextData(baseCostTypeId, 'last')
			this.setData(data)
			this.closeWaitingLastOrNext()
		},
		async clickNext() {
			this.waitingLastOrNext('获取下一个收入类别...')
			const baseCostTypeId = this.baseCostType.id
			const data = await BaseCostType.getLastOrNextData(baseCostTypeId, 'next')
			this.setData(data)
			this.closeWaitingLastOrNext()
		},
		setData(data) {
			this.baseCostType = data.data
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
			const baseCostType = this.$refs.baseDataForm.getData()
			const links = this.$refs.linkTable.getData()
			this.saveData(baseCostType, links)
		},
		
		/* ---- data methods ---- */
		async saveData(baseCostType, links) {
			this.showLoading("收入类别信息保存中...")
			const res = await BaseCostType.doSave(baseCostType, links)
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
