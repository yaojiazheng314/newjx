<template>
	<div id="AdjustmentViewDialog">
		<el-dialog 
			:title="assDialogStatus" 
			:show-close="showClose"
			:close-on-click-modal="false"
			:visible.sync="visible"
			@close="closeDialog">
	
		<el-table 
			:data="list" 
			v-loading="listLoading" 
			style="width: 100%"
			:row-class-name="tableRowClassName">
			<el-table-column prop="beforeValue" label="修改前金额">
			</el-table-column>
			<el-table-column prop="modifyValue" label="调整金额">
			</el-table-column>
			<el-table-column prop="operateTime" label="修改时间">
			</el-table-column>
			
			<el-table-column prop="operator" label="修改者">
			</el-table-column>
			
			
		</el-table>
		</el-dialog>
	</div>
</template>

<script>
import { getItemIncomehModifyDataList } from '@/api/bnsDataItemReportModify'

export default {
	props: {
		visibleFlag: {
			type: Boolean
		},
		listData: {
			type: Object
		},
		assDialogStatus: {
			type: String
		}
	},
	name: 'AdjustmentViewDialog',
	data() {
		return {
			showClose: true,
			loading: false,
			visible: false,
			assigneeList: []
		}		
	},
	created() {
		this.visible = this.visibleFlag
	},
	mounted() {		
		const data = this.listData
		if (data.id !== null) {
				this.getList()
			}
	},
	methods: {
		
		getList() {
			var self = this
			self.loading = true
			let query = {
				feedBackItem: self.listData.id
			}
			getItemIncomehModifyDataList(query).then(res => {
				const items = res.data
				self.listData = items.map(v => {
						self.$set(v, 'subLoading', false)
						self.$set(v, 'edit', false)
						return v
					})
				self.loading = false
			})
		},
		
		closeDialog() {
			this.$emit('getList')
			this.$emit('closeAssigneeDialog')
		}
	}
}
</script>

<style>
</style>
