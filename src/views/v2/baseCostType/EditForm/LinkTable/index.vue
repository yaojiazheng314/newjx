<template>
	<div>
		
		<el-table
		  style="width: 100%;"
		  v-loading="loading"
		  :data="linkList"
		  empty-text="未绑定HIS成本类别"
		  :header-cell-style="tableHeaderStyle">

		  <el-table-column
		    label="编码"
				prop="itfCostCode">
		  </el-table-column>
			
		  <el-table-column
		    label="名称"
				prop="itfCostName">
		  </el-table-column>
			
		  <el-table-column
		    label="来源系统"
				prop="syslb">
		  </el-table-column>
			
			<el-table-column
			  label="特殊标记"
				prop="select1">
				<template slot-scope="scope">
					<el-input 
						size="small"
						v-model="scope.row.select1"
						:maxLength="20" />
				</template>
			</el-table-column>
			
			<el-table-column
				width="200"
				align="center"
			  label="操作"
				prop="select1">
				<template slot-scope="scope">
					<el-button
						size="mini"
						icon="el-icon-delete"
						type="danger"
						@click="removeLink(scope.$index, scope.row)">
						{{ labelRemoveBtn }}
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		
	</div>
</template>

<script>
import { BaseItfCostTypeLink } from '@/model/base-itf-Cost-type-link'
export default {
	name: 'link-table',
	props: {
		parentBaseCostType: Object
	},
	data() {
		return {
			// store data
			curUserId: this.$store.getters.userID,
			// table attr data
			loading: false,
			labelRemoveBtn: "移除",
			// data
			baseCostType: null,
			linkList: []
		}
	},
	created() {
		this.baseCostType = this.parentBaseCostType
		const baseCostTypeId = this.baseCostType.id
		if (baseCostTypeId !== undefined 
					&& baseCostTypeId !== null) {
			this.loadData(baseCostTypeId)
		}		
	},
	methods: {
		// 获取links
		async loadData(baseCostTypeId) {
			this.loading = true
			const data = await BaseItfCostTypeLink.getList(baseCostTypeId)
			this.loading = false
			this.linkList = data
		},
		
		// add links
		addLinks(links) {
			for (let i = 0, l = links.length; i < l; i++) {
				const link =  links[i]
				let existedLink = this.linkList.find(t => link.itfCostCode === t.itfCostCode)
				if (existedLink === undefined) {
					this.linkList.push(link)
					this.$notify({
						title: '添加',
						message: `${link.itfCostCode} ${link.itfCostName}`,
						type: 'success'
					})
				} else {
					this.$notify({
						title: '已选中',
						message: `${link.itfCostCode} ${link.itfCostName}`,
						type: 'info'
					})
				}
				
			}
		},
		
		// remove link
		removeLink(removeIndex, link) {
			this.$notify({
				title: '移除',
				message: `${link.itfCostCode} ${link.itfCostName}`,
				type: 'warning'
			})
			this.linkList.splice(removeIndex, 1)
		},
		
		// table style
		tableHeaderStyle({ row, column, rowIndex, columnIndex }) {
		  if (rowIndex === 0) {
		    if (columnIndex === 0) {
		      return `width: 100%;
		              background-color: #F5F5F5;
		              border-top: 1px solid #d3e1f0;
		              border-bottom: 1px solid #d3e1f0;
		              color: #606266;
		              font-weight: normal;`
		    }
		    return `width: 100%;
		            background-color: #F5F5F5;
		            border-left: 1px solid #f0f0f0;
		            border-top: 1px solid #d3e1f0;
		            border-bottom: 1px solid #d3e1f0;
		            color: #606266;
		            font-weight: normal;`
		  }
		},
		
		// data methods
		getData() {
			return this.linkList
		}
		
	}
}
</script>

<style>
</style>
