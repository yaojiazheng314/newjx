<template>
	<div class="base-data-container">
		
		<div class="base-data-name">{{ theme }}</div>
		
		<!-- form -->
		<el-form
			ref="form"
			:model="baseCostType"
			:inline="true">
			
			<el-form-item label="调整比例:" prop="ratio">
				<el-input-number 
					size="mini"
					v-model="baseCostType.ratio"
					controls-position="right" />
			</el-form-item>
			
		</el-form>
		
	</div>
</template>

<script>
export default {
	name: "cost-type-base-form",
	props: {
		parentBaseCostType: Object
	},
	data() {
		return {
			// data
			baseCostType: null
		}
	},
	computed: {
		theme: function () {
			return `${this.baseCostType.code} ${this.baseCostType.name}`
		}
	},
	created() {
		this.baseCostType = this.parentBaseCostType
	},
	methods: {
		getData() {
			return this.baseCostType
		}
	}
	
}
</script>

<style>
.base-data-container {
	background-color: #eff5fb;
	padding: 15px 15px 5px;
	font: normal 14px "lucida Grande",Verdana,"Microsoft YaHei";
}

.base-data-name {
	margin-bottom: 8px;
	font: bold 16px "lucida Grande",Verdana,"Microsoft YaHei";
}


</style>
