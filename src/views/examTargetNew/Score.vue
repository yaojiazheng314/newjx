<template>
<div class="app-container score" v-loading.body="loading">
  <h2>{{dataTime}}</h2>
  <div class="bottomBox">
  <div class="left">
    <el-card class="box-card">
      <el-table :data="dataList" style="width: 100%">
        <el-table-column prop="indicator" label="项目">
        </el-table-column>
        <el-table-column prop="code" label="考核" width="100">
          <template slot-scope="scope">
            <el-input v-model="scope.row.score" placeholder="请输入内容" type="number"></el-input>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="70">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="sourcesShowEvent(scope.row,scope.$index)">查看依据</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
  <div class="right">
    <el-card class="box-card" v-if="sourcesShow">
      <el-table :data="tableList" style="width: 100%">
         <el-table-column prop="name" label="依据名" width="100">
        </el-table-column>
        <el-table-column prop="ifData" label="数据" width="130">
          <template slot-scope="scope">
              <!-- 如果录入类型的就是input，如果是接口显示 0:没有框  1：手动输入  2：只读-->
              <el-input type="number" v-model="scope.row.ifData" placeholder="请输入内容" v-if="scope.row.dataSourceType === 1" @change="scoreComputed(scope.row)"></el-input>
              <el-input type="number" v-model="scope.row.ifData" placeholder="请输入内容" v-if="scope.row.dataSourceType !== 1 " disabled></el-input>   
          </template>
        </el-table-column>
        <el-table-column prop="code" label="考核得分" width="130">
          <template slot-scope="scope">
            <!--*不能修改的（3）：1:区间法  2：目标值法 5：按项数评分 6：自定义 *input框（1）：7：一次性评分  *单选radio（2）：3：一票否决  4：单项否决-->
            <el-input type="number" v-model="scope.row.score" placeholder="请输入内容" v-if="scope.row.operateType == 1" @change="scoreComputed(scope.row)"></el-input>
            <el-radio-group v-model="scope.row.score" v-if="scope.row.operateType == 2" @change="scoreComputed(scope.row)">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
            <el-input type="number" v-model="scope.row.score" placeholder="请输入内容" v-if="scope.row.operateType == 3" disabled></el-input>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="330">
          <template slot-scope="scope">
            <!-- 1:区间法  2：目标值法  3：一票否决  4：单项否决  5：按项数评分  6：自定义  7：一次性评分 -->
            <IntervalMethod :addBasisForm="scope.row" v-if="scope.row.scoringMethod == 1" />
            <TargetMethod :addBasisForm="scope.row" v-if="scope.row.scoringMethod == 2" />
            <span v-if="scope.row.scoringMethod == 3">一票否决 （注：“是”代表否决 ；“否”代表可以正常算分）</span>
            <span v-if="scope.row.scoringMethod == 4">单项否决</span>
            <Disposable :addBasisForm="scope.row" v-if="scope.row.scoringMethod == 5" />
            <CustomMethod :addBasisForm="scope.row" v-if="scope.row.scoringMethod == 6" />
            <span v-if="scope.row.scoringMethod == 7">一次性评分</span>
          </template>
        </el-table-column>
      </el-table>   
    </el-card>
  </div>
  </div>
  <el-button type="primary" @click="storageEvent" class="allSave">考核暂存</el-button>
  <el-button type="success" @click="saveEvent" class="allSave">考核完毕</el-button>
</div>
</template>

<script>
import { getMonthTargetBasises, grade, realtimeComputing,saveScore } from "@/api/exam";
import IntervalMethod from "./components/IntervalMethod";
import TargetMethod from "./components/TargetMethod";
import Disposable from "./components/Disposable";
import CustomMethod from "./components/CustomMethod";
export default {
  name: "Score",
  components: {
    IntervalMethod,
    TargetMethod,
    Disposable,
    CustomMethod
  },
  data() {
    return {
      dataTime: "",
      dataList: [],
      tableList: [],
      sourcesShow: false,
      addBasisList: [],
      loading: false,
      dataIndex: 0,
      obj: {}
    };
  },
  mounted() {
    this.initPage();
  },
  methods: {
    initPage() {
      this.loading = true;
      getMonthTargetBasises({
        examMonthId: this.$route.query.examMonthId, //考核年月ID
        operatorId: this.$store.getters.userID //操作人员ID
      }).then(res => {
        // console.log(res)
        this.loading = false;
        this.dataTime = res.data.yearmonth;
        this.dataList = res.data.monthTargetBasises;
      });
    },
    // 查看依据
    sourcesShowEvent(data, index) {
      this.tableList = data.monthBasises;
      this.sourcesShow = true;
      this.dataIndex = index;
      this.obj = data;
      console.log(data.monthBasises);
    },
    // 根据依据计算考核分数
    scoreComputed(data) {
      // console.log("change")
      // console.log(data)
      // console.log(this.obj)
      realtimeComputing(this.obj).then(res => {
        console.log(res);
        this.dataList[this.dataIndex].score = res.data.score; //计算得来的值
        this.tableList = res.data.monthBasises;
        this.dataList[this.dataIndex].monthBasises = this.tableList; //更新原数据
      });
    },
    // 考核暂存
    storageEvent() {
      let data = {
        operatorId: this.$store.getters.userID, //操作者ID
        examMonthId: this.$route.query.examMonthId, //考核年月ID
        monthTargetScores: this.dataList
      };
      this.loading = true;
      saveScore(data).then(res => {
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
          this.initPage();
          this.sourcesShow = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    // 考核完毕
    saveEvent() {
      console.log(this.dataList);
      this.$confirm("是否完成考核，确定将不能再次修改此考核", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          let data = {
            operatorId: this.$store.getters.userID, //操作者ID
            examMonthId: this.$route.query.examMonthId, //考核年月ID
            monthTargetScores: this.dataList
          };
          grade(data)
            .then(res => {
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
              this.initPage();
              this.sourcesShow = false;
            })
            .catch(err => {
              this.loading = false;
            });
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="scss">
.score {
  .bottomBox {
    padding-bottom: 12px;
    display: flex;
    display: -webkit-flex;
    // max-height: 700px;
    // overflow-y: auto;
    .left {
      width: 25%;
    }
    .right {
      width: 70%;
    }
  }
}
</style>
