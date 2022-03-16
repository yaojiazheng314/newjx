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
			<el-button v-waves type="primary" size="mini" @click="handleCreate" round>
				生成考核数据
			</el-button>
		</div>

		<el-table 
			ref="listTable"
			:data="list" 
			v-loading="listLoading" 
			style="width: 100%"
			>

			<el-table-column prop="yearmonth" label="模板执行年月">
			</el-table-column>
			<el-table-column prop="tempName" label="模板名称">
			</el-table-column>
			<el-table-column prop="sumDept" label="模板包含科室">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleAddDepartments(scope.row)" >
                    
                    <span >共{{ scope.row.sumDept }}科室</span>
                </el-button>
        </template>
			</el-table-column>
		
			<el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<el-button 
						@click="handleTempInfo(scope.row)" 
						type="text" size="small">
						查看
					</el-button>
          <el-button 
						@click="handleCreateSub(scope.row)" 
						type="text" size="small">
						生成考核数据
					</el-button>

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

    
		<!-- 添加手动填报科室 -->
    <add-departments v-if="addDeptStatus" :addDeptDialogStatus="addDeptDialogStatus" :addDeptVisible="addDeptVisible" :formulaData="indexData" @closeAddDeptDialog="closeAddDeptDialog" @getList="getList">
    </add-departments>

    <!-- 查看考核模板 -->
    <TempInfo v-if="tempInfoStatus" :tempInfoDialogStatus="tempInfoDialogStatus" :tempInfoVisible="tempInfoVisible" :formulaData="indexData" @closeTempInfoDialog="closeTempInfoDialog" >
    </TempInfo>
	</div> 
</template>

<script>
// import { fetchPeople, fuzzyQueryPerParam } from '@/api/person'
import {
  getExamMonthTempList,
  getExamMonthTempOfDept,
  GenerateExamMonthByDept,
  checkGenarateInfo
} from "@/api/exam";

// import { getPositionList } from '@/api/position'
import waves from "@/directive/waves";
import { formatDate } from "@/utils/date";
import AddDepartments from "./components/AddDepartments";
import TempInfo from "./components/TempInfo";
export default {
  directives: { waves },
  name: "dataForm",
  components: { AddDepartments, TempInfo },
  directives: { waves },
  data() {
    return {
      list: null,
      total: 0,
      sumAdd: 0.0,
      sumSub: 0.0,
      listLoading: false,
      remoteLoading: false,
      listQuery: {
        currentPage: 1,
        pagesize: 10,
        yearmonth: "",
        tempid: null
      },
      addDeptStatus: false,
      addDeptDialogStatus: "",
      addDeptVisible: false,
      tempInfoStatus: false,
      tempInfoDialogStatus: "",
      tempInfoVisible: false,
      editStatus: false,
      addStatus: false,
      dialogStatus: "",
      dialogFormVisible: false,
      indexData: {},
      creatQuery: {
        yearmonth: "",
        tempid: null
      },
      checkFlag: 0
    };
  },
  created() {
    this.getList();
  },
  mounted() {
    this.setDefaultYearmonth();
    this.addDeptVisible = false;
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
      getExamMonthTempList(query).then(response => {
        self.list = response.data.dataList;
        self.total = response.data.total;

        self.listLoading = false;
      });
    },

    handleFilter() {
      this.addDeptStatus = false;
      this.listQuery.currentPage = 1;
      this.getList();
    },
    handleSizeChange(size) {
      this.listQuery.pagesize = size;
      this.getList();
    },
    handleCreate() {
      var self = this;

      self.creatQuery.yearmonth = self.listQuery.yearmonth;
      self.creatQuery.tempid = self.listQuery.tempid;
      this.chcekCreate(self.creatQuery);

      // console.log(self.checkFlag);
    },
    handleCreateSub(data) {
      console.log(data);
      var self = this;
      self.creatQuery.yearmonth = data.yearmonth;
      self.creatQuery.tempid = data.id;
      this.chcekCreate(self.creatQuery);
      // checkGenarateInfo(self.creatQuery);
      // GenerateExamMonthByDept(self.creatQuery).then(res => {

      //     self.$notify({
      //       title: "成功",
      //       message: res.msg,

      //       type: "success",
      //       duration: 6000
      //     });

      //     this.getList();

      // });
    },
    // checkGenarateInfo(data) {
    //   // var self = this;

    //   checkGenarateInfo(data).then(res => {
    //     console.log(response.data);
    //     this.checkFlag = response.data;
    //     console.log(this.checkFlag);
    //   });
    // },
    handleEdit(data) {},

    chcekCreate(data) {
      checkGenarateInfo(data).then(res => {
        // this.checkFlag = res.data;
        if (res.data === 2) {
          this.$notify({
            title: "错误",
            message: "有考核模板已经审核，不能重新生成",

            type: "error",
            duration: 6000
          });
          return;
        }
        if (res.data === 1) {
          this.$confirm(
            "该年度的已有考核数据是否要重新生成, 是否继续?",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
            .then(() => {
              this.showLoading("正在生成该年度的考核模板...");
              GenerateExamMonthByDept(data).then(res => {
                let status = res.status;
                if (status === 520) {
                  this.finishLoading(res.msg, "error");
                } else {
                  this.finishLoading("该年度的考核模板生成完成", "success");
                }

                this.getList();
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消"
              });
            });
        }
        if (res.data === 0) {
          this.showLoading("正在生成该年度的考核模板...");
          GenerateExamMonthByDept(data).then(res => {
            let status = res.status;
            if (status === 520) {
              this.finishLoading(res.msg, "error");
            } else {
              this.finishLoading("该年度的考核模板生成完成", "success");
            }
            this.getList();
          });
        }
      });
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
      this.addStatus = false;
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
    closeAddDeptDialog() {
      this.addDeptStatus = false;
      this.addDeptDialogStatus = "";
      this.addDeptVisible = false;
      this.indexData = {};
    },
    handleCurrentChange(currentPage) {
      this.listQuery.currentPage = currentPage;
      this.getList();
    },

    handleAddDepartments(data) {
      this.addDeptStatus = true;
      this.addDeptDialogStatus =
        "[" + data.yearmonth + data.tempName + "]" + "的适用科室";
      this.addDeptVisible = true;
      this.indexData = data;
    },
    handleTempInfo(data) {
      this.tempInfoStatus = true;
      this.tempInfoDialogStatus =
        "[" + data.yearmonth + data.tempName + "]" + "的考核模板";
      this.tempInfoVisible = true;
      this.indexData = data;
    },
    closeTempInfoDialog() {
      this.tempInfoStatus = false;
      this.tempInfoDialogStatus = "";
      this.tempInfoVisible = false;
      this.indexData = {};
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

.filter-container-right-label {
  margin-right: 10px;
  color: #42b983;
}
.filter-container-right-label-num {
  color: red;
}
</style>
