<template>
  <el-table
  	:data="list"
    style="width: 100%;"
    :row-style="getRowClass" :header-row-style="getRowClass"
    :header-cell-style="getRowClass"
    :loading="loading"
  	height="400">
  	<el-table-column
  		prop="deptName"
  		label="绩效科室">
  	</el-table-column>
  	<el-table-column
  		prop="hisDeptName"
  		label="HIS科室">
  	</el-table-column>
  	<el-table-column
  		prop="hisPerName"
  		label="HIS人员">
  	</el-table-column>
  	<el-table-column
  		prop="sumVal"
  		label="收入">
  	</el-table-column>
  </el-table>
</template>

<script>
import { getKdysList } from '@/api/dataMonitor'
export default {
  props: {
  	department: {
  		type: Array
  	},
  	startDate: {
  		type: String
  	},
  	endDate: {
  		type: String
  	}
  },
  name: 'Kdys',
  data() {
  	return {
      list: [],
  		loading: false
  	}
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      const query = {
        departments: this.department,
        startDate: this.startDate,
        endDate: this.endDate
      }
      getKdysList(query).then(res => {
        this.list = res.data
        this.loading = false
      })
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      return "background-color: transparent; color: #fff;";
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-table, .el-table__expanded-cell {
  background-color: transparent;
}
</style>
