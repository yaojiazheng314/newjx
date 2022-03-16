<template>
<div class="app-container rectificationReport">
  <div class="top">
    <!-- <el-date-picker v-model="date" type="month" placeholder="选择年月">
    </el-date-picker> -->
<el-date-picker
				v-model="date"
				type="month"
				placeholder="选择月"
				format="yyyy 年 M 月"
				value-format="yyyy-MM"
				:clearable="false"
				:editable="false"
				@change="handleFilter"
				class="searchClass">
			</el-date-picker>

    <!-- 查询按钮 -->
    <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter">
      查询
    </el-button>
  </div>
  <div v-show="isShow">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="tempName" label="模板名">
      </el-table-column>
      <el-table-column prop="frequency" label="考核频率">
      </el-table-column>
      <el-table-column prop="totalScore" label="总分">
      </el-table-column>
       <el-table-column prop="rectificationReportStateText" label="上报状态">
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="tableTitle" :show-close="true" :close-on-click-modal="false" :visible.sync="tableShow"  width="80%">
      <el-card class="box-card" v-for="(item,index) in allList" :key="index">
        <el-table :data="item.unionAppliedTargets" v-loading="loading" :row-style="{height:0+'px'}"
:cell-style="{padding:0+'px'}"  :span-method="objectSpanMethod" border>
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
  searchExamedMonthes
} from "@/api/exam";
import {
  formatDate
} from "@/utils/date";
import waves from "@/directive/waves";
export default {
  name: "ExamMonth",
  directives: {
    waves
  },
  data() {
    return {
      tableData: [],
      allList: [],
      tableShow: false,
      tableTitle: '',
      tableList: [
        // {
        //   id: 1,
        //   firstTarget: "一级指标名",
        //   firstWeight: "一级指标比重",
        //   firstScore: "一级指标得分",
        //   firstRowspan: 7,
        //   firstColspan: 1,
        //   secondTarget: "二级指标名1",
        //   secondWeight: "二级指标比重1",
        //   secondScore: "二级指标得分1",
        //   secondRowspan: 1,
        //   secondColspan: 1,
        //   thirdTarget: "三级指标名11",
        //   thirdWeight: "三级指标比重11",
        //   thirdScore: "三级指标得分11"
        // },
        // {
        //   id: 2,
        //   firstTarget: "一级指标名",
        //   firstWeight: "一级指标比重",
        //   firstScore: "一级指标得分",
        //   firstRowspan: 0,
        //   firstColspan: 0,
        //   secondTarget: "二级指标名2",
        //   secondWeight: "二级指标比重2",
        //   secondScore: "二级指标得分2",
        //   secondRowspan: 2,
        //   secondColspan: 1,
        //   thirdTarget: "三级指标名21",
        //   thirdWeight: "三级指标比重21",
        //   thirdScore: "三级指标得分21"
        // },
        // {
        //   id: 3,
        //   firstTarget: "一级指标名",
        //   firstWeight: "一级指标比重",
        //   firstScore: "一级指标得分",
        //   firstRowspan: 0,
        //   firstColspan: 0,
        //   secondTarget: "二级指标名2",
        //   secondWeight: "二级指标比重2",
        //   secondScore: "二级指标得分2",
        //   secondRowspan: 0,
        //   secondColspan: 0,
        //   thirdTarget: "三级指标名21",
        //   thirdWeight: "三级指标比重21",
        //   thirdScore: "三级指标得分21"
        // },
        // {
        //   id: 4,
        //   firstTarget: "一级指标名",
        //   firstWeight: "一级指标比重",
        //   firstScore: "一级指标得分",
        //   firstRowspan: 0,
        //   firstColspan: 0,
        //   secondTarget: "二级指标名3",
        //   secondWeight: "二级指标比重3",
        //   secondScore: "二级指标得分3",
        //   secondRowspan: 4,
        //   secondColspan: 1,
        //   thirdTarget: "三级指标名31",
        //   thirdWeight: "三级指标比重31",
        //   thirdScore: "三级指标得分31"
        // },
        // {
        //   id: 5,
        //   firstTarget: "一级指标名",
        //   firstWeight: "一级指标比重",
        //   firstScore: "一级指标得分",
        //   firstRowspan: 0,
        //   firstColspan: 0,
        //   secondTarget: "二级指标名3",
        //   secondWeight: "二级指标比重3",
        //   secondScore: "二级指标得分3",
        //   secondRowspan: 0,
        //   secondColspan: 0,
        //   thirdTarget: "三级指标名32",
        //   thirdWeight: "三级指标比重32",
        //   thirdScore: "三级指标得分32"
        // },
        // {
        //   id: 6,
        //   firstTarget: "一级指标名",
        //   firstWeight: "一级指标比重",
        //   firstScore: "一级指标得分",
        //   firstRowspan: 0,
        //   firstColspan: 0,
        //   secondTarget: "二级指标名3",
        //   secondWeight: "二级指标比重3",
        //   secondScore: "二级指标得分3",
        //   secondRowspan: 0,
        //   secondColspan: 0,
        //   thirdTarget: "三级指标名33",
        //   thirdWeight: "三级指标比重33",
        //   thirdScore: "三级指标得分33"
        // },
        // {
        //   id: 7,
        //   firstTarget: "一级指标名",
        //   firstWeight: "一级指标比重",
        //   firstScore: "一级指标得分",
        //   firstRowspan: 0,
        //   firstColspan: 0,
        //   secondTarget: "二级指标名3",
        //   secondWeight: "二级指标比重3",
        //   secondScore: "二级指标得分3",
        //   secondRowspan: 0,
        //   secondColspan: 0,
        //   thirdTarget: "三级指标名33",
        //   thirdWeight: "三级指标比重33",
        //   thirdScore: "三级指标得分33"
        // }
      ],
      activeNames: ["0"],
      loading: false,
      dialogTitle: "",
      dialogShow: false,
      showClose: false,
      content: "",
      dataId: "",
      date: null,
      tempParams: [],
      isShow: false,
      dTime: "",
      examMonthId: "", //一个table的id
    };
  },
  mounted() {
    this.setDefaultYearmonth()
  },
  methods: {
    setDefaultYearmonth() {
				var self = this
				const month = new Date().getMonth() 
				var defYearmonth = new Date(new Date().setMonth(month, 1))
				const ymStr = formatDate(defYearmonth, 'yyyy-MM')
        self.dTime = ymStr
        self.date =  ymStr
      },
    handleFilter() {
      this.initGetList();
    },
    initGetList() {
      // this.dTimeEvent();
      if (this.date == null || this.date == "") {
        this.isShow = false;
        this.$message({
          message: "请先填写日期",
          type: "warning"
        });
      } else {
        searchExamedMonthes({
          yearmonth: this.date, //查询年月，当为null或""时表示查询当前年月
          operatorId: this.$store.getters.userID //操作人员ID}).then(res=>{
        }).then(res=>{
          console.log(res)
          this.isShow = true;
          this.tableData = res.data;
        })
      }

    },
    handleClick(data) {
      this.tableShow = true;
      this.tableTitle = data.tempName;
      this.examMonthId = data.examMonthId;
      this.getList();
    },
    getList() {
      // this.dTimeEvent();
      if (this.date == null || this.date == "") {
        this.isShow = false;
        this.$message({
          message: "请先填写日期",
          type: "warning"
        });
      } else {
        getScoredAppliedTargets({
          yearmonth: this.date, //查询年月，当为null或""时表示查询当前年月
          operatorId: this.$store.getters.userID, //操作人员ID
          examMonthId:this.examMonthId
        }).then(res => {
          console.log(res);
          this.isShow = true;
          this.allList = res.data;
          // this.date = res.data[0].yearmonth;
          // this.tableList = res.data.unionAppliedTargets;
        });
      }
    },
    // 日期格式处理
    dTimeEvent() {
      if (this.date != null) {
        let d = new Date(this.date);
        let datetime = d.getFullYear() + "-" + (d.getMonth() + 1);

        let date = this.date == null ? "" : datetime;
        this.dTime =
          date.split("-")[0] +
          (date.split("-")[1].length >= 2 ?
            date.split("-")[1] :
            "0" + date.split("-")[1]);
      } else {
        this.dTime = "";
      }
    },

    objectSpanMethod({
      row,
      column,
      rowIndex,
      columnIndex
    }) {
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
        this.initGetList();
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
        this.initGetList();
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
