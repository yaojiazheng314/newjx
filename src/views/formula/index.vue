<template>
<div class="app-container formula">
  <div class="filter-container">
    <!-- 考核模板查询 -->
    <el-select v-model="listQuery.department" filterable clearable placeholder="请选择科室" @change="changeEvent">
      <el-option v-for="item in tempParams" :key="item.id" :label="item.name" :value="item.id">
        <span style="float: left">{{ item.name }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">
					{{ item.type }}
				</span>
      </el-option>
    </el-select>
    <el-select v-model="listQuery.doctor" filterable clearable placeholder="请选择医生">
      <el-option v-for="item in targetParams" :key="item.personId" :label="item.personName" :value="item.personId">
        <span style="float: left">{{ item.personName }}</span>
      </el-option>
    </el-select>
    <!-- <el-date-picker v-model="listQuery.date" type="month" placeholder="选择年月">
    </el-date-picker> -->

    <el-date-picker
				v-model="listQuery.date"
				type="month"
				placeholder="选择月"
				format="yyyy 年 M 月"
				value-format="yyyy-MM"
				:clearable="false"
				:editable="false"			
				class="searchClass">
			</el-date-picker>
    <el-select v-model="listQuery.status" filterable clearable placeholder="请选择状态">
      <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id">
        <span style="float: left">{{ item.name }}</span>
      </el-option>
    </el-select>
    <!-- 查询按钮 -->
    <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter">
      查询
    </el-button>
    <el-button v-waves type="danger" size="mini" @click="handleReportSelected" round>
				批量审核
			</el-button>
  </div>
  <!-- 考核模板列表 名称 模板类型 考核方向 指标数 责任用户 编辑 -->
  <el-table ref="listTable"  :data="list" v-loading="loading" style="width: 100%">
    <el-table-column
				type="selection"
        :selectable="selectAble"
				width="55">
			</el-table-column>
    <el-table-column prop="tempName" label="考核模板">
    </el-table-column>
    <el-table-column prop="deptName" label="考核科室">
    </el-table-column>
    <el-table-column prop="personName" label="经办医生">
    </el-table-column>

    <el-table-column prop="yearmonth" label="考核时间">
    </el-table-column>
    <el-table-column prop="score" label="考核得分">
    </el-table-column>
    <el-table-column prop="frequencyText" label="考核类型">
    </el-table-column>
    <el-table-column prop="rectificationReportStateText" label="状态">
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button v-waves @click="handleEdit(scope.row.examMonthId)" type="text" size="small"  v-if="scope.row.rectificationReportState == 4 || scope.row.rectificationReportState == 5">
          查看上报
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="pagination-container">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.currentPage" :page-sizes="[10, 15, 20, 25, 30]" :page-size="listQuery.pagesize" layout="total, sizes, prev, pager, next, jumper" background :total="total">
    </el-pagination>
  </div>
  <el-dialog :title="title" :visible.sync="editDialog" width="80%" fullscreen>
    <el-table :data="tableList" style="width: 100%" :span-method="objectSpanMethod" border>
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
      <!-- <el-table-column label="数据来源" header-align="center" align="center" prop="thirdWeight"></el-table-column> -->
      <!-- <el-table-column label="评分标准" header-align="center" align="center" prop="thirdWeight"></el-table-column> -->
      <el-table-column label="最终得分" header-align="center" align="center" prop="thirdScore"></el-table-column>
      <el-table-column label="整改状态" header-align="center" align="center" prop="rectificationStateText"></el-table-column>
      <el-table-column label="操作" prop="operator" width="100px" header-align="center" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button v-waves @click="rectificationReport(scope.row)" type="text" size="small" v-if="scope.row.thirdRectificationText != null">
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button v-waves type="primary" @click="examineEvent(3)" v-if="rectificationReportState == 4">审核不通过</el-button>
      <el-button v-waves type="primary" @click="examineEvent(5)" v-if="rectificationReportState == 4">审核通过</el-button>
      <el-button v-waves @click="editDialog = false">关  闭</el-button>
    </span>
  </el-dialog>
  <el-dialog title="" :show-close="showClose" :close-on-click-modal="false" :visible.sync="dialogShow">
    <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 8}" placeholder="请输入内容" v-model="content" disabled="" class="content">
    </el-input>
    <div slot="footer" class="dialog-footer">
      <el-button v-waves @click="dialogShow = false" class="guo-btn yellow-btn">
        返 回
      </el-button>
      <!-- <el-button type="primary" @click="sourcesSave" :loading="loading" class="guo-btn light-blue-btn">
        提 交
      </el-button> -->
    </div>
  </el-dialog>
</div>
</template>

<script>
import waves from "@/directive/waves";
import {
  queryExamedTemps,
  getScoredExamMonth,
  audit,
  submitRectificationText,
  searchPersons,
  checkConfirmMore
} from "@/api/exam";
import { fuzzyQueryDeptParam } from "@/api/department";
import { fuzzyQueryPerParam } from "@/api/person";
import { formatDate } from "@/utils/date";
export default {
  name: "DataItem",

  directives: {
    waves
  },
  data() {
    return {
      list: [],
      total: 0,
      loading: false,
      listQuery: {
        currentPage: 1,
        pagesize: 10,
        department: null, //查询模板id
        doctor: null,
        date: null,
        status: ""
      },
      statusList: [
        //考核状态（2：未上报，4：已上报，5：审核通过），可为空
        {
          id: 2,
          name: "未上报"
        },
        {
          id: 4,
          name: "已上报"
        },
        {
          id: 5,
          name: "审核通过"
        }
      ],
      tempParams: [], //科室列表
      targetParams: [], //医生列表
      /* 创建 编辑 考核模板 */
      editDialog: false,
      dialogFormVisible: false,
      tableList: [],
      dTime: "",
      title: "",
      examMonthId: "",
      content: "",
      showClose: false,
      dialogShow: false,
      monthTargetAppliedId: "",
      rectificationReportState: ""
    };
  },
  created() {},
  mounted() {
    this.getTempParam(); //获取科室列表
    this.getTargetParam(null); //获取医生列表
     this.setDefaultYearmonth();
    this.getList();
   
  },
  methods: {
    getList() {
      var self = this;
      self.loading = true;
      // this.dTimeEvent();
      // const query = self.listQuery
      const query = {
        deptId: self.listQuery.department ? self.listQuery.department : "",
        personId: self.listQuery.doctor ? self.listQuery.doctor : "",
        yearmonth: self.listQuery.date, // 考核年月，可为空
        rectificationReportState: self.listQuery.status, //考核状态（2：未上报，4：已上报），可为空
        currentPage: self.listQuery.currentPage, //分页——当前页
        pagesize: self.listQuery.pagesize //分页——每页条数
      };
      // console.log(query);
      queryExamedTemps(query).then(response => {
        // console.log(response);
        self.list = response.data.list;
        self.total = response.data.total;
        self.loading = false;
      });
    },
    /* 获取考核模板参数 */
    getTempParam() {
      var self = this;
      fuzzyQueryDeptParam({
        keyword: ""
      }).then(res => {
        self.tempParams = res.data;
      });
    },
    /* 获取考核指标参数 */
    getTargetParam(id) {
      // 动态获取医生的列表
      // console.log(id)
      var self = this;
      searchPersons({
        deptId: id
      }).then(res => {
        self.targetParams = res.data;
      });
    },
    /* 分页查询 */
    handleFilter() {
      this.listQuery.currentPage = 1;
      this.getList();
    },
    handleSizeChange(size) {
      this.listQuery.pagesize = size;
      this.getList();
    },
    handleCurrentChange(currentPage) {
      this.listQuery.currentPage = currentPage;
      this.getList();
    },
    changeEvent(id) {
      // console.log(id)
      this.listQuery.doctor = "";
      this.getTargetParam(id);
    },

    handleEdit(id) {
      this.editDialog = true;
      // console.log(data)
      getScoredExamMonth({ examMonthId: id }).then(res => {
        this.title = `${res.data.yearmonth}(${res.data.frequencyText})`;
        this.tableList = res.data.unionAppliedTargets;
        this.examMonthId = res.data.examMonthId;
        this.rectificationReportState = res.data.rectificationReportState;
        console.log(res);
      });
    },
    examineEvent(num) {
      // console.log(this.examMonthId)
      // console.log(num)
      audit({
        examMonthId: this.examMonthId, //考核年月ID
        auditResult: num //审核结果（3：审核未通过，5：审核通过
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
        this.editDialog = false;
      });
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // console.log("rowIndex: " + rowIndex + ",columnIndex: " + columnIndex);
      // console.log("row")
      // console.log(row);
      // console.log("column")
      // console.log(column);
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
    // 查看
    rectificationReport(data) {
      this.dialogShow = true;
      this.content = data.thirdRectificationText;
      console.log(data);
      this.monthTargetAppliedId = data.id;
    },
    sourcesSave() {
      // 提交
      // console.log(this.examMonthId);
      // console.log(this.monthTargetAppliedId)
      submitRectificationText({
        monthTargetAppliedId: this.monthTargetAppliedId, //已应用的指标ID
        rectificationText: this.content, //整改方案文本
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
        this.handleEdit(this.examMonthId);
        this.dialogShow = false;
      });
    },
    // 日期格式处理
    dTimeEvent() {
      if (this.listQuery.date != undefined) {
        let d = new Date(this.listQuery.date);
        let datetime = d.getFullYear() + "-" + (d.getMonth() + 1);
        let date = this.listQuery.date == null ? "" : datetime;
        this.dTime =
          date.split("-")[0] +
          (date.split("-")[1].length >= 2
            ? date.split("-")[1]
            : "0" + date.split("-")[1]);
      } else {
        this.dTime = "";
      }
      // console.log(this.dTime)
    },
    selectAble(row){
      if (row.rectificationReportState === 4 ) {
        return true
      }else{
        return false
      }
    },
    handleReportSelected() {
      const selectedData = this.$refs.listTable.selection;
        console.log(selectedData)
      let selectId = [];
      selectedData.map((item, index) => {
        selectId.push(item.examMonthId);
      });
      // console.log(deleteId.length)
      if (selectId.length === 0) {
        this.$message({
          message: "未选择要申报的数据",
          type: "warning"
        });
        return;
      }

      this.$confirm("此操作将申报选择的记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        checkConfirmMore(selectId).then(res => {
          let resStatus = res.status;
          if (resStatus == 200) {
            this.$message({
              type: "success",
              message: "上报审核成功!"
            });
            this.getList();
          }
        });
      });
    },
    setDefaultYearmonth() {
      var self = this;
      const month = new Date().getMonth();
      var defYearmonth = new Date(new Date().setMonth(month, 1));
      const ymStr = formatDate(defYearmonth, "yyyy-MM");
      self.listQuery.date = ymStr;
    }
  }
};
</script>

<style lang="scss">
.formula {
  .content {
    .el-textarea__inner {
      color: #000;
    }
  }
}
</style>
