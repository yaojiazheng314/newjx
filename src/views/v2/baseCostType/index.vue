<template>
	<div class="app-container">
		<!-- 成本类别列表 -->
		<cost-type-table 
			v-if="!showEditForm"
			@toEditForm="loadEditForm" />
		
		<!-- 编辑成本类别页面 -->
		<edit-form 
			v-else
			:parentBaseCostType="readCostType"
			@closeEditForm="closeEditForm"/>
		
	</div>
</template>

<script>
import CostTypeTable from './CostTypeTable'	
import EditForm from './EditForm'

export default {
	name: "base-Cost-type",
	components: { CostTypeTable, EditForm },
	data() {
		return {
			// attr
			showEditForm: false,  // 显示编辑成本类别页面
			// data
			readCostType: null  // 读取编辑的成本类别
		}
	},
	created() {
		
	},
	methods: {
		/**
		 * 加载CostType编辑绑定页面
		 * @param {Object} baseCostType: {id, code, name...}
		 */
		loadEditForm(baseCostType) {
			this.showEditForm = true
			this.readCostType = baseCostType
		},
		
		closeEditForm() {
			this.showEditForm = false
		}
		
	}
	
}
</script>

<style>
</style>
