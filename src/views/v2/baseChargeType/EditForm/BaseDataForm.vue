<template>
	<div class="base-data-container">
		
		<div class="base-data-name">{{ theme }}</div>
		
		<!-- form -->
		<el-form
			ref="form"
			:model="baseChargeType"
			:inline="true">
			
			<el-form-item label="次均成本:" prop="cjcb">
				<el-input-number 
					size="mini"
					v-model="baseChargeType.cjcb"
					controls-position="right" />
			</el-form-item>
			
			<el-form-item label="风险系数:" prop="fxxs">
				<el-input-number 
					size="mini"
					v-model="baseChargeType.fxxs"
					controls-position="right" />
			</el-form-item>
			
			<el-form-item label="患者科室:" prop="hzks">
				<el-input-number 
					size="mini"
					v-model="baseChargeType.hzks"
					controls-position="right" />
			</el-form-item>
			
			<el-form-item label="开单提成:" prop="kdtcxs">
				<el-input-number 
					size="mini"
					v-model="baseChargeType.kdtcxs"
					controls-position="right" />
			</el-form-item>
			
			<el-form-item label="开单系数:" prop="kdxs">
				<el-input-number 
					size="mini"
					v-model="baseChargeType.kdxs"
					controls-position="right" />
			</el-form-item>
			
			<el-form-item label="执行提成:" prop="zxtcxs">
				<el-input-number 
					size="mini"
					v-model="baseChargeType.zxtcxs"
					controls-position="right" />
			</el-form-item>
			
			<el-form-item label="执行系数:" prop="zxxs">
				<el-input-number 
					size="mini"
					v-model="baseChargeType.zxxs"
					controls-position="right" />
			</el-form-item>
			
		</el-form>
		
	</div>
</template>

<script>
export default {
	name: "charge-type-base-form",
	props: {
		parentBaseChargeType: Object
	},
	data() {
		return {
			// data
			baseChargeType: null
		}
	},
	computed: {
		theme: function () {
			return `${this.baseChargeType.code} ${this.baseChargeType.name}`
		}
	},
	created() {
		this.baseChargeType = this.parentBaseChargeType
	},
	methods: {
		getData() {
			return this.baseChargeType
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
