<template>
	<div class="app-container">
		<div class="filter-container">

			<el-select 
				v-model="listQuery.department" 
				filterable clearable 
				placeholder="选择或输入科室" 
				class="searchClass">
				<el-option 
					v-for="item in departmentParams" 
					:key="item.id" 
					:label="item.name + '_' + item.type" 
					:value="item.id">
					<span style="float: left">{{ item.name }}</span>
					<span style="float: right; color: #8492a6; font-size: 13px">
						{{ item.type }}
					</span>
				</el-option>
			</el-select>
			<el-date-picker
				v-model="listQuery.yearMonth"
				type="month"
				placeholder="选择月"
				format="yyyy 年 M 月"
				value-format="yyyy-MM"
				:clearable="false"
				:editable="false"
				@change="handleFilter"
				class="searchClass">
			</el-date-picker>

			<el-button v-waves type="primary" size="mini" @click="handleFilter" round>
				查 询
			</el-button>
			<el-button v-waves type="primary" size="mini" @click="handlConfirm" round>
				审核
			</el-button>
			<el-button v-waves type="primary" size="mini" @click="handlCancel" round>
				取消审核
			</el-button>
		</div>

		<el-table 
			:data="list" 
			v-loading="listLoading" 
			style="width: 100%"
			:row-class-name="tableRowClassName">
			<el-table-column prop="yearmonth" label="调整年月">
			</el-table-column>
			<el-table-column prop="deptCode" label="科室代码">
			</el-table-column>
			<el-table-column prop="deptName" label="科室名称">
			</el-table-column>
			<el-table-column prop="name" label="调整科目">
			</el-table-column>
			<el-table-column prop="adgustValue" label="调整金额">
			</el-table-column>
			<el-table-column prop="confirmFlag" label="审核标志">
			</el-table-column>
			<el-table-column prop="adgustReason" label="调整原因">
			</el-table-column>

			<el-table-column label="操作" width="100">
				<template slot-scope="scope">
					<el-button 
						@click="getPersonDataInfo(scope.row)" 
						type="text" size="small">
						查看
					</el-button>
					<!-- <el-button 
						@click="handleEdit(scope.row)"
						type="text" size="small">
						编辑
					</el-button> -->
				</template>
			</el-table-column>
		</el-table>
		<div class="pagination-container">
			<el-pagination 
				@size-change="handleSizeChange" 
				@current-change="handleCurrentChange" 
				:current-page="listQuery.currentPage"
				:page-sizes="[10, 15, 20, 25, 30]" 
				:page-size="listQuery.pagesize" 
				layout="total, sizes, prev, pager, next, jumper"
				background
				:total="total">
			</el-pagination>
		</div>
		<!-- 编辑框 -->
		<person-edit-dialog 
			v-if="editStatus"
			:dialogStatus="dialogStatus" 
			:dialogFormVisible="dialogFormVisible"
			:departmentParams="departmentParams"
			
			:personData="personData"
			@closedialog="closedialog"
			@getList="getList">
		</person-edit-dialog>
	</div>
</template>

<script>
import {
  fetchConfirmDataList,
  confirmCostTypeData,
  cancelConfirmCostTypeData
} from "@/api/costAdjust";
import { getDepartmentParam } from "@/api/department";
import waves from "@/directive/waves";
import { formatDate } from "@/utils/date";
import { Message, MessageBox } from "element-ui";
import personEditDialog from "./components/CostAdjustDialog";
export default {
  name: "Person",
  components: { personEditDialog },
  directives: { waves },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: false,
      remoteLoading: false,
      alertMsg: null,
      listQuery: {
        currentPage: 1,
        pagesize: 10,
        yearMonth: null,
        department: null,
        status: ""
      },
      departmentParams: [],
      fuzzyQueryPerParams: [],
      editStatus: false,
      dialogStatus: "",
      dialogFormVisible: false,
      personData: {},
      isAccountCancel: null
    };
  },
  created() {
    this.getList();
  },
  mounted() {
    this.getDepartmentParams();
    this.setDefaultYearmonth();
  },
  methods: {
    setDefaultYearmonth() {
      var self = this;
      const month = new Date().getMonth();
      var defYearmonth = new Date(new Date().setMonth(month, 1));
      const ymStr = formatDate(defYearmonth, "yyyy-MM");
      self.listQuery.yearMonth = ymStr;
    },
    getList() {
      var self = this;
      self.listLoading = true;
      self.listQuery.status =
        self.listQuery.status == null ? "" : self.listQuery.status;
      const query = self.listQuery;

      fetchConfirmDataList(query).then(response => {
        self.list = response.data.FillDataList;
        self.total = response.data.total;
        self.isAccountCancel = response.data.accountStatusIsCancel;
        self.listLoading = false;
      });
    },

    tableRowClassName({ row, rowIndex }) {
      // if (row.positionName === '科主任') {
      //   return 'kzr-row';
      // } else if (row.positionName === '护士长') {
      //   return 'hsz-row';
      // }
      return "";
    },
    handleFilter() {
      this.listQuery.currentPage = 1;
      this.getList();
    },
    handleSizeChange(size) {
      this.listQuery.pagesize = size;
      this.getList();
    },
    handlConfirm() {
      var self = this;
      var canOperator = false;
      if (self.isAccountCancel == 1) {
        Message({
          message: "该月已经封账不能进行审核操作！",
          type: "warning",
          duration: 5 * 1000
        });
      }
      if (self.isAccountCancel == 0) {
        self
          .$confirm(
            "该月份已取消封账份，调整数据会影响报表数据, 是否继续?",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
          .then(() => {
            this.handlConfirmCom();
          });
      }
      if (self.isAccountCancel == 2) {
        canOperator = true;
      }

      if (canOperator) {
        this.handlConfirmCom();
      }
    },
    handlConfirmCom() {
      var self = this;
      self.listLoading = true;
      self.listQuery.status =
        self.listQuery.status == null ? "" : self.listQuery.status;
      const query = self.listQuery;
      this.showLoading("正在重新调整成本数据，请稍候...");
      confirmCostTypeData(query).then(res => {
        let status = res.status;
        if (status === 520) {
          this.finishLoading(res.msg, "error");
        } else {
          this.finishLoading("该年度成本调整完毕", "success");
        }
      });
      this.getList();
    },
    handlCancel() {
      var self = this;
      var canOperator = false;
      if (self.isAccountCancel == 1) {
        Message({
          message: "该月已经封账不能进行取消审核操作！",
          type: "warning",
          duration: 5 * 1000
        });
      }
      if (self.isAccountCancel == 0) {
        self
          .$confirm(
            "该月份已取消封账份，调整数据会影响报表数据, 是否继续?",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
          .then(() => {
            this.handlCancelCom();
          });
      }
      if (self.isAccountCancel == 2) {
        canOperator = true;
      }

      if (canOperator) {
        this.handlCancelCom();
      }
    },
    handlCancelCom() {
      var self = this;
      self.listLoading = true;
      self.listQuery.status =
        self.listQuery.status == null ? "" : self.listQuery.status;
      const query = self.listQuery;

      cancelConfirmCostTypeData(query).then(res => {
        this.$notify({
          title: "成功",
          message: query.yearMonth + "成本审核取消成功",
          type: "success",
          duration: 6000
        });
      });
      this.getList();
    },
    handleEdit(data) {
      this.editStatus = true;
      this.dialogStatus = "编辑人员信息";
      this.dialogFormVisible = true;
      this.personData = data;
    },
    getPersonDataInfo(data) {
      this.editStatus = true;
      this.dialogStatus = "查看调整成本信息";
      this.dialogFormVisible = true;
      this.personData = data;
    },
    closedialog() {
      this.editStatus = false;
      this.dialogStatus = "";
      this.dialogFormVisible = false;
    },
    handleCurrentChange(currentPage) {
      this.listQuery.currentPage = currentPage;
      this.getList();
    },
    getDepartmentParams() {
      getDepartmentParam().then(response => {
        this.departmentParams = response.data;
      });
    },
    showLoading(msg) {
      this.alertMsg = this.$message({
        duration: 0,
        center: true,
        iconClass: "el-icon-loading",
        customClass: "alert-msg-success",
        message: msg
      });
    },
    finishLoading(msg, type) {
      this.alertMsg.close();
      this.$message({
        message: msg,
        center: true,
        type: type,
        duration: 6000
      });
    },

    filterStatus(value, row) {
      return row.status === value;
    }
  }
};
</script>

<style>
.el-table .kzr-row {
  background: oldlace;
}

.el-table .hsz-row {
  background: #f0f9eb;
}
</style>
