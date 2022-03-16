<template>
	<div class="linktable-operatebar-container">
		<span style="margin-left: 10px;">{{ tip1 }}</span>
		<span class="linktable-operatebar-keytip">{{ CostTypeName }}</span>
		<span>{{ tip2 }}</span>
			
		<el-select
			style="width: 300px; margin-left: 5px;"
			size="mini"
			v-model="optionSelected"
			:placeholder="placeHolderSelect"
			filterable multiple clearable
			remote reserve-keyword
			:remote-method="remoteOptions"
			:loading="remoteLoading"
			:no-data-text="noOptionsText"
			value-key="itfCostCode"
			@change="changeSelected">
			<el-option
			  v-for="item in options"
			  :key="item.itfCostCode"
			  :label="`${item.itfCostCode} ${item.itfCostName}`"
			  :value="item" />
		</el-select>
	</div>
</template>

<script>
import { BaseItfCostTypeLink } from '@/model/base-itf-Cost-type-link'
export default {
	name: 'link-table-operate-bar',
	props: {
		parentBaseCostType: Object
	},
	data() {
		return {
			// store data
			curUserId: this.$store.getters.userID,
			// attr
			tip1: "为成本类别",
			tip2: "添加绑定",
			// select attr data
			noOptionsText: "没有符合条件的成本类别",
			remoteLoading: false,
			placeHolderSelect: "输入编码或名称搜索...",
			options: [],  // [ ItfCostType ]
			// data
			baseCostType: null,
			optionSelected: []  // 选中的
		}
	},
	computed: {
		CostTypeName: function () {
			return `[${this.baseCostType.code} ${this.baseCostType.name}]`;
		}
	},
	created() {
		this.baseCostType = this.parentBaseCostType
	},
	methods: {
		/* ---- select ---- */
		async remoteOptions(queryKeyword) {
			if (queryKeyword !== "") {
			  this.remoteLoading = true
			  this.options = await BaseItfCostTypeLink.remoteQueryItfCostType(queryKeyword)
			  this.remoteLoading = false
			} else {
			  this.options = []
			}
		},
		
		changeSelected(options) {
			var links = options.map(item => {
				let link = new BaseItfCostTypeLink(item.itfCostCode, item.itfCostName, item.syslb, this.baseCostType.id, "", this.curUserId)
				return link
			})
			this.$emit('addLinks', links)
			this.optionSelected = []
		}
		
	}
}
</script>

<style>
.linktable-operatebar-container{
	padding: 10px 15px;
	background-color: rgb(224, 236, 249);
	border-bottom: 1px solid #aac1de;
	font-size: 14px;
	color: #798699;
}
.linktable-operatebar-keytip {
  color: #000;
}
</style>
