<template>
	<div>
	<el-table
	  style="width: 100%;"
	  v-loading="loading"
	  :data="deptReportPage.pageData"
	  :empty-text="tableEmptyTip"
	  :header-cell-style="tableHeaderStyle"
	  @selection-change="handleSelectionChange"
	  @row-click="rowClick">
		
		<el-table-column
		   align="center"
		   type="selection"
		   width="55" />
			 
		<el-table-column
		  width="55">
		  <template slot="header" slot-scope="scope">
		    <svg-icon
		      style="width: 1.3em; height: 1.3em; padding-top: 5px;"
		      iconClass="icon_status" />
		  </template>
		  <template slot-scope="scope">
		    <el-tooltip
		      placement="bottom-start" effect="light"
		      :content="colIconTip(scope.row.status)">
		      <svg-icon
		        :iconClass="colStatusIcon(scope.row.status)" />
		    </el-tooltip>
		  </template>
		</el-table-column>
		
		<el-table-column
		  width="250"
		  label="上报科室"
			prop="feedBackDeptName"
		  show-overflow-tooltip>
		</el-table-column>
		
		<el-table-column
		  width="250"
		  label="分配人"
			prop="usersName"
		  show-overflow-tooltip>
		</el-table-column>
		
		<el-table-column
		  label="明细" 
			prop="description"
		  show-overflow-tooltip>
		</el-table-column>
		
	</el-table>
	</div>
</template>

<script>
export default {
	name: 'report-status-table',
	props: {
		deptReportPage: Object,
	},
	data() {
		return {
			// attr
			loading: false,
			tableEmptyTip: "没有反馈上报科室",
			selectedNumber: 0,  // 选中数
		}
	},
	methods: {
		showLoading(status) {
		  this.loading = status
		},
		
		// table row data
		colIconTip(status) {
			if (status === 1) {
				return "待审核"
			}
			return "已审核"
		},
		
		colStatusIcon(status) {
			if (status === 1) {
				return 'icon_unexamine'
			}
			return 'icon_examine'
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
		
		handleSelectionChange(val) {
		  this.$emit('handleSelection', val);
		  this.selectedNumber = val.length
		},
		
		/**
		 * @description 处理table点击行
		 * @param {Object} row: {feedBackDept, user, yearmonth}
		 */
		rowClick(row) {
		  this.$emit('rowClick', row);
		}
	}
}
</script>

<style>
</style>
