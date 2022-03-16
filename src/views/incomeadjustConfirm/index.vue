<template>
	<div class="app-container">
		<div class="filter-container">
			
			<el-date-picker
				v-model="listQuery.yearmonth"
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
			<el-button v-waves type="primary" size="mini" @click="handleConfirm" round>
				审核
			</el-button>
			<el-button v-waves type="primary" size="mini" @click="handleConfirmCancel" round>
				取消审核
			</el-button>
			
		</div>

		<el-table 
			:data="list" 
			v-loading="listLoading" 
			style="width: 100%"
			:row-class-name="tableRowClassName">
			<el-table-column prop="name" label="调整分类">
			</el-table-column>
			<el-table-column prop="yearMonth" label="调增年月">
			</el-table-column>
			<el-table-column prop="modifyTypeName1" label="调增类型">
			</el-table-column>
			<el-table-column prop="mzbs1" label="科室属性">
			</el-table-column>
			<el-table-column prop="deptmentName1" label="调增科室">
			</el-table-column>
			<el-table-column prop="hospName1" label="科室院属">
			</el-table-column>
			<el-table-column prop="originalValue1" label="调增原始值">
			</el-table-column>
			<el-table-column prop="ratio1" label="调增率">
			</el-table-column>
			<el-table-column prop="modifyValue1" label="调增值">
			</el-table-column>
			<el-table-column prop="modifyTypeName2" label="调减类型">
			</el-table-column>
			<el-table-column prop="mzbs2" label="科室属性">
			</el-table-column>
			<el-table-column prop="deptmentName2" label="调减科室">
			</el-table-column>
			<el-table-column prop="hospName2" label="科室院属">
			</el-table-column>
			<el-table-column prop="originalValue2" label="调减原始值">
			</el-table-column>
			<el-table-column prop="ratio2" label="调减率">
			</el-table-column>
			<el-table-column prop="modifyValue2" label="调减值">
			</el-table-column>
			<el-table-column prop="modifyState" label="审核状态">
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
			:sflbParams="sflbParams"
			:personData="personData"
			@closedialog="closedialog"
			@getList="getList">
		</person-edit-dialog>
	</div>
</template>

<script>
// import { fetchPeople, fuzzyQueryPerParam } from '@/api/person'
import {
  fetchIncomeAdjustConfirmDataList,
  confirmIncomeAdjustData,
  confirmCancelIncomeAdjustData
} from "@/api/incomAdjust";
import { getHisDepartmentParam } from "@/api/hisDepartment";
import { getChargeTypeParam } from "@/api/binding";
// import { getPositionList } from '@/api/position'
import { Message, MessageBox } from "element-ui";
import waves from "@/directive/waves";
import { formatDate } from "@/utils/date";
import PersonEditDialog from "./components/incomeAdjustEditDialog";
export default {
  name: "Person",
  components: { PersonEditDialog },
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
        person: null,
        department: null,
        status: "",
        yearmonth: "",
        position: null
      },
      departmentParams: [],
      sflbParams: [], //收费类别参数
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
    this.setDefaultYearmonth();
    this.getDepartmentParams();
    this.getSflbParams();
    // this.getPositionParams()
  },
  methods: {
    setDefaultYearmonth() {
      var self = this;
      const month = new Date().getMonth() - 1;
      var defYearmonth = new Date(new Date().setMonth(month, 1));
      const ymStr = formatDate(defYearmonth, "yyyy-MM");
      self.listQuery.yearmonth = ymStr;
    },
    getList() {
      var self = this;
      self.listLoading = true;
      self.listQuery.status =
        self.listQuery.status == null ? "" : self.listQuery.status;
      const query = self.listQuery;
      fetchIncomeAdjustConfirmDataList(query).then(response => {
        self.list = response.data.incomeAdjustData;
        self.total = response.data.total;
        self.isAccountCancel = response.data.accountStatusIsCancel;
        self.listLoading = false;
      });
    },
    /* 模糊查询全院人员 */
    // remoteMethod(query) {
    // 	if (query !== '') {
    //     this.remoteLoading = true;
    // 		const search = {
    // 			keyword: query
    // 		}
    //     fuzzyQueryPerParam(search).then(res => {
    // 			this.fuzzyQueryPerParams = res.data
    // 		})
    // 		this.remoteLoading = false;
    //   }else {
    //     this.fuzzyQueryPerParams = [];
    //   }
    // },
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
    handleConfirm() {
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
            this.handleConfirmCom();
          });
      }
      if (self.isAccountCancel == 2) {
        canOperator = true;
      }

      if (canOperator) {
        this.handleConfirmCom();
      }
    },
    handleConfirmCom() {
      var self = this;
      self.listLoading = true;
      self.listQuery.status =
        self.listQuery.status == null ? "" : self.listQuery.status;
      const query = self.listQuery;

      this.showLoading("正在重新调整收入数据，请稍候...");
      confirmIncomeAdjustData(query).then(res => {
        let status = res.status;
        if (status === 200) {
          this.finishLoading("该年度收入调整完毕", "success");
        } else {
          this.finishLoading(res.msg, "error");
        }
      });
      this.getList();
    },
    handleConfirmCancel() {
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
            this.handleConfirmCancelCom();
          });
      }
      if (self.isAccountCancel == 2) {
        canOperator = true;
      }

      if (canOperator) {
        this.handleConfirmCancelCom();
      }
    },
    handleConfirmCancelCom() {
      var self = this;
      self.listLoading = true;
      self.listQuery.status =
        self.listQuery.status == null ? "" : self.listQuery.status;
      const query = self.listQuery;

      confirmCancelIncomeAdjustData(query).then(res => {
        this.$notify({
          title: "成功",
          message: query.yearmonth + "收入取消审核成功",
          type: "success",
          duration: 6000
        });
      });
      this.getList();
    },
    handleEdit(data) {
      this.editStatus = true;
      this.dialogStatus = "编辑收入调整信息";
      this.dialogFormVisible = true;
      this.personData = data;
    },
    getPersonDataInfo(data) {
      this.editStatus = true;
      this.dialogStatus = "查看收入调整信息";
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
      getHisDepartmentParam().then(response => {
        this.departmentParams = response.data;
      });
    },
    /* 获取收费类别参数列表 */
    getSflbParams() {
      getChargeTypeParam().then(res => {
        this.sflbParams = res.data;
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
