<template>
  <div class="app-container">

    <el-table 
			v-loading="listLoading" 
			:data="hospList" 
			border 
			fit 
			highlight-current-row 
			style="width: 100%">

      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
			
			<el-table-column width="220px" align="center" label="名称">
			  <template slot-scope="scope">
			    <span>{{ scope.row.name }}</span>
			  </template>
			</el-table-column>
			
			<el-table-column width="280px" align="center" label="注册码">
			  <template slot-scope="scope">
			    <span>{{ scope.row.registerCode }}</span>
			  </template>
			</el-table-column>

      <el-table-column width="230px" align="center" label="平台服务终止日期">
        <template slot-scope="scope">
          <span>{{ scope.row.endTime }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="200px" align="center" label="备注信息">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input v-model="scope.row.information" class="edit-input" size="small"/>
            <el-button class="cancel-btn" size="small" icon="el-icon-refresh" type="warning" @click="cancelEdit(scope.row)">取消</el-button>
          </template>
          <span v-else>{{ scope.row.information }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button v-if="scope.row.edit" type="success" size="small" icon="el-icon-circle-check-outline" @click="confirmEdit(scope.row)">提交</el-button>
          <el-button v-else type="primary" size="small" icon="el-icon-edit" @click="scope.row.edit=!scope.row.edit">编辑</el-button>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
import { getHospitalInfo, updateHospitalInfo } from '@/api/hospital.js'

export default {
  name: 'Hospital',
  data() {
    return {
      hospList: null,
      listLoading: true,
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getHospitalInfo().then(response => {
        const items = response.data
        // this.hospList = items
        this.listLoading = false
				this.hospList = items.map(v => {
				  this.$set(v, 'edit', false)
				  v.originalInformation = v.information
				  return v
				})
      })
    },
    cancelEdit(row) {
			row.information = row.originalInformation
			row.edit = false
      this.$message({
        message: '备注信息未被修改，已还原',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      row.edit = false
      row.originalInformation = row.information
			const hosp = {
				id: row.id,
				name: row.name,
				registerCode: row.registerCode,
				information: row.information
			}
			updateHospitalInfo(hosp).then(response => {
				const msg = response.msg
				this.$message({
				  message: msg,
				  type: 'success'
				})
			})
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
