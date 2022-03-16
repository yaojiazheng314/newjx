<template>
<div class="app-container rectificationReport">
  <div class="top">
    <!-- <el-date-picker v-model="date" type="month" placeholder="选择年月">
    </el-date-picker> -->
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
						{{ item.information }}
					</span>
				</el-option>
			</el-select>

      <el-select 
				v-model="listQuery.tempId" 
				filterable clearable 
				placeholder="选择或输入模板" 
				class="searchClass">
				<el-option 
					v-for="item in tempParams" 
					:key="item.id" 
					:label="item.name" 
					:value="item.id">
					<span style="float: left">{{ item.name }}</span>
				</el-option>
			</el-select>
    <!-- 查询按钮 -->
    <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter">
      查询
    </el-button>
    <el-button v-waves type="danger" size="mini" @click="handleReportSelected" round>
				批量上报
			</el-button>
  </div>
  <div v-show="isShow">
    <el-table ref="listTable"  :data="tableData" v-loading="listLoading"  style="width: 100%">
      <el-table-column
				type="selection"
        :selectable="selectAble"
				width="55">
			</el-table-column>
      <el-table-column prop="yearmonth" label="考核年月">
      </el-table-column>
      <el-table-column prop="tempName" label="考核模板">
      </el-table-column>
      <el-table-column prop="departmentName" label="考核科室">
      </el-table-column>
      <el-table-column prop="score" label="考核分数">
      </el-table-column>
       <el-table-column prop="stateText" label="上报状态">
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
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
    <el-dialog :title="tableTitle" :show-close="true" :close-on-click-modal="false" :visible.sync="tableShow" width="80%">
      <el-card class="box-card" v-for="(item,index) in allList" :key="index">
        <el-table :data="item.unionAppliedTargets" v-loading="loading" :row-style="{height:0+'px'}"
:cell-style="{padding:0+'px'}" :span-method="objectSpanMethod" border>
          <el-table-column label="维度" header-align="center" align="center" prop="firstTarget">
          </el-table-column>

          <el-table-column label="分数" header-align="center" align="center" prop="firstScore">
          </el-table-column>

          <el-table-column label="二级指标" header-align="center" align="center" prop="secondTarget">
          </el-table-column>

          <el-table-column label="分数" header-align="center" align="center" prop="secondScore">
          </el-table-column>

          <el-table-column label="三级指标" header-align="center" align="center" prop="thirdTarget">
          </el-table-column>
          <!-- <el-table-column label="数据来源" header-align="center" align="center" prop="thirdWeight"></el-table-column>
      <el-table-column label="评分标准" header-align="center" align="center" prop="thirdWeight"></el-table-column> -->
          <el-table-column label="最终得分" header-align="center" align="center" prop="thirdScore"></el-table-column>
          <el-table-column label="考核状态" header-align="center" align="center" prop="examStateStr"></el-table-column>
           <el-table-column label="原因" header-align="center" align="center" prop="scoreReasion"></el-table-column>
           <el-table-column label="整改状态" header-align="center" align="center" prop="rectificationStateText"></el-table-column>
          <el-table-column label="操作" prop="operator" width="100px" header-align="center" align="center">
            <template slot-scope="scope">
              <el-button v-if="scope.row.couldRectification" @click="rectificationReport(scope.row)" type="text" size="small">
                整改上报
              </el-button>
              <el-button v-if="scope.row.couldRectification" @click="reasonReport(scope.row)" type="text" size="small">
                查看原因
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="bottom">
          <el-button type="warning" plain @click="rejectEvent(item.examMonthId)" :disabled="item.couldObjectionReport ? false : true">有异议，驳回重审</el-button>
          <el-button type="success" plain @click="reportingAudit(item.examMonthId)" :disabled="item.couldObjectionReport ? false : true">上报审核</el-button>
        </div>
      </el-card>
    </el-dialog>

    <!-- <div v-if="allList == '' && isShow">没有您要查询的数据</div> -->
  </div>
  <!-- 配置数据来源 -->
  <el-dialog :title="dialogTitle" :show-close="showClose" :close-on-click-modal="false" :visible.sync="dialogShow">
    <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 8}" placeholder="请输入内容" v-model="content">
    </el-input>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog" class="guo-btn yellow-btn">
        返 回
      </el-button>
      <el-button v-if="dataId != ''" type="primary" @click="submitRectification" :loading="loading" class="guo-btn light-blue-btn">
        保存整改
      </el-button>
      <el-button v-else type="primary" @click="sourcesSave" :loading="loading" class="guo-btn light-blue-btn">
        提 交
      </el-button>
    </div>
  </el-dialog>
<!-- 查看扣分原因 -->
</div>
</template>

<script>
import {
  getScoredAppliedTargets,
  submitRectificationText,
  raiseObjection,
  reportRectification,
  searchExamedMonthes,
  getExamTempParam,
  selectTempMonthAll,
  reportMore
} from "@/api/exam";
import { getDepartmentParam } from "@/api/department";
import { formatDate } from "@/utils/date";
import waves from "@/directive/waves";
export default {
  name: "ExamMonth",
  directives: {
    waves
  },
  data() {
    return {
      total: 0,
      tableData: [],
      allList: [],
      tableShow: false,
      tableTitle: "",
      tableList: [],
      activeNames: ["0"],
      loading: false,
      dialogTitle: "",
      dialogShow: false,
      showClose: false,
      content: "",
      dataId: "",
      tempParams: [],
      isShow: false,
      dTime: "",
      departmentParams: [],
      examMonthId: "", //一个table的id
      listQuery: {
        currentPage: 1,
        pagesize: 10,
        yearmonth: null,
        department: null,
        tempId: null
      },
      listLoading: false
    };
  },
  mounted() {
    this.setDefaultYearmonth();
    this.getDepartmentParams();
    this.getTempParam();
  },
  methods: {
    setDefaultYearmonth() {
      var self = this;
      const month = new Date().getMonth();
      var defYearmonth = new Date(new Date().setMonth(month, 1));
      const ymStr = formatDate(defYearmonth, "yyyy-MM");
      self.dTime = ymStr;
      self.listQuery.yearmonth = ymStr;
    },
    handleFilter() {
      this.getList();
    },
    getList() {
      var self = this;
      self.listLoading = true;
      selectTempMonthAll(self.listQuery).then(res => {
        console.log(res);
        self.listLoading = false;
        self.isShow = true;
        self.tableData = res.data.temps;
        self.total = res.data.total;
      });
    },
    getDepartmentParams() {
      getDepartmentParam().then(response => {
        this.departmentParams = response.data;
      });
    },
    /* 获取考核模板参数 */
    getTempParam() {
      var self = this;
      getExamTempParam().then(res => {
        self.tempParams = res.data;
      });
    },
    handleClick(data) {
      this.tableShow = true;
      this.tableTitle = data.tempName;
      this.examMonthId = data.id;
      this.getTempTreeList();
    },
    handleSizeChange(size) {
      this.listQuery.pagesize = size;
      this.getList();
    },
    handleCurrentChange(currentPage) {
      this.listQuery.currentPage = currentPage;
      this.getList();
    },
    getTempTreeList() {
      getScoredAppliedTargets({
        yearmonth: this.listQuery.yearmonth, //查询年月，当为null或""时表示查询当前年月
        operatorId: this.$store.getters.userID, //操作人员ID
        examMonthId: this.examMonthId
      }).then(res => {
        console.log(res);
        this.isShow = true;
        this.allList = res.data;
      });
    },

    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (0 <= columnIndex && columnIndex <= 1) {
        return {
          rowspan: row.firstRowspan,
          colspan: row.firstColspan
        };
      } else if (2 <= columnIndex && columnIndex <= 3) {
        return {
          rowspan: row.secondRowspan,
          colspan: row.secondColspan
        };
      } else {
        return {
          rowspan: 1,
          colspan: 1
        };
      }
    },
    rejectEvent(id) {
      this.dialogShow = true;
      this.dialogTitle = "请输入您的异议";
      this.dataId = "";
      this.examMonthId = id;
      this.content = "";
    },
    reportingAudit(id) {
      // 上报审核
      reportRectification({
        examMonthId: id, //考核年月ID
        operatorId: this.$store.getters.userID //操作人员ID
      }).then(res => {
        if (res.status == 200) {
          this.$message({
            message: "恭喜你，操作成功",
            type: "success"
          });
        } else {
          this.$message({
            message: res.msg,
            type: "warning"
          });
        }
        this.getList();
        this.getTempTreeList();
      });
    },
    rectificationReport(data) {
      console.log(data);
      this.dialogShow = true;
      this.dataId = data.id;
      this.dialogTitle = "请输入要整改的内容";
      this.content = data.thirdRectificationText;
    },
    submitRectification() {
      // console.log(this.dataId);
      // console.log(this.content);
      // 保存整改
      submitRectificationText({
        monthTargetAppliedId: this.dataId, //已应用的指标ID
        rectificationText: this.content, //整改方案文本
        operatorId: this.$store.getters.userID //操作人员ID
      }).then(res => {
        // console.log(res)
        if (res.status == 200) {
          this.$message({
            message: "恭喜你，操作成功",
            type: "success"
          });
        } else {
          this.$message({
            message: res.msg,
            type: "warning"
          });
        }
        this.getList();
        this.getTempTreeList();
        this.dialogShow = false;
      });
    },
    sourcesSave() {
      // console.log( this.examMonthId)
      // console.log(this.content)
      raiseObjection({
        examMonthId: this.examMonthId, //考核年月ID
        objection: this.content, //异议内容
        operatorId: this.$store.getters.userID //操作人员ID
      }).then(res => {
        if (res.status == 200) {
          this.$message({
            message: "恭喜你，操作成功",
            type: "success"
          });
        } else {
          this.$message({
            message: res.msg,
            type: "warning"
          });
        }
        this.getList();
        this.initGetList();
        this.dialogShow = false;
      });
    },
    handleReportSelected() {
      const selectedData = this.$refs.listTable.selection;
      console.log(selectedData);
      let selectId = [];
      selectedData.map((item, index) => {
        selectId.push(item.id);
      });
      // console.log(deleteId.length)
      if (selectId.length === 0) {
        this.$message({
          message: "未选择要上报的数据",
          type: "warning"
        });
        return;
      }

      //   console.log(deleteId)

      // 在上面引入删除api 将 deleteId 传入 应该就可以了
      this.$confirm("此操作将上报选择的记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        reportMore(selectId).then(res => {
          let resStatus = res.status;
          if (resStatus == 200) {
            this.$message({
              type: "success",
              message: "上报成功!"
            });
            this.getList();
          }
        });
      });
    },
    selectAble(row) {
      if (
        row.rectificationReportState === 1 ||
        row.rectificationReportState === 2 ||
        row.rectificationReportState === 3
      ) {
        return true;
      } else {
        return false;
      }
    },
    closeDialog() {
      this.dialogShow = false;
    }
  }
};
</script>

<style lang="scss">
.rectificationReport {
  .top {
    padding: 20px 0;
  }

  .bottom {
    width: 100%;
    display: flex;
    justify-content: space-around;
    text-align: center;
    padding: 20px 0;
  }
}
</style>
