<template>
	<div class="app-container">
		<!-- 收入类别列表 -->
		<charge-type-table 
			v-if="!showEditForm"
			@toEditForm="loadEditForm" />
		
		<!-- 编辑收入类别页面 -->
		<edit-form 
			v-else
			:parentBaseChargeType="readChargeType"
			@closeEditForm="closeEditForm"/>
		
	</div>
</template>

<script>
import ChargeTypeTable from './ChargeTypeTable'	
import EditForm from './EditForm'

export default {
	name: "base-charge-type",
	components: { ChargeTypeTable, EditForm },
	data() {
		return {
			// attr
			showEditForm: false,  // 显示编辑收入类别页面
			// data
			readChargeType: null  // 读取编辑的收入类别
		}
	},
	created() {
		
	},
	methods: {
		/**
		 * 加载chargeType编辑绑定页面
		 * @param {Object} baseChargeType: {id, code, name...}
		 */
		loadEditForm(baseChargeType) {
			this.showEditForm = true
			this.readChargeType = baseChargeType
		},
		
		closeEditForm() {
			this.showEditForm = false
		}
		
	}
	
}
</script>

<style>
</style>
