<template>
<div class="assessment" v-loading="pageLoading">
  <div class="filter-container">
    <!-- <el-input v-model="listQuery.department" placeholder="请输入科室" style="width:200px" clearable></el-input>
    <el-select v-model="listQuery.status" filterable clearable placeholder="请选择状态">
      <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id">
        <span style="float: left">{{ item.name }}</span>
      </el-option>
    </el-select> -->
    <!-- <el-date-picker v-model="listQuery.date" type="month" placeholder="选择月">
    </el-date-picker> -->
    <el-date-picker
				v-model="listQuery.date"
				type="month"
				placeholder="选择月"
				format="yyyy 年 M 月"
				value-format="yyyy-MM"
				:clearable="false"
				:editable="false"
				>
			</el-date-picker>
    <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter">
      查询
    </el-button>
  </div>
  <div class="bottom">
    <div class="left">
      <el-card class="box-card">
        <!-- <el-button v-waves type="primary" icon="el-icon-thumb" @click="unifiedEvent">多选一键考核</el-button> -->
        <!-- <h3>
          <p>科室</p>
          <p>状态</p>
        </h3> -->
        <el-tree :data="treeData" :props="defaultProps" :default-checked-keys="defaultList" @check="checkEvent" @check-change="currentChange"  default-expand-all :expand-on-click-node="false" @node-click="treeHandleNodeClick" :render-content="renderContent"></el-tree>
      </el-card>
    </div>
    <div class="right">
      <!-- 可能循环 -->
      <el-card v-if="treeLevel" class="box-card">
        <!-- <div v-for="(item,index) in timeList" :key="index" style="padding-bottom:20px;borer-bottom:1px solid #ccc"> -->
          <!-- <el-form>
            <el-form-item label="当前名称">{{item.deptPersonName}}</el-form-item>
            <el-form-item label="考核类型">{{item.frequencyText}}</el-form-item>
          </el-form> -->
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
          <el-select
            v-model="listQuery.state"
            clearable
            placeholder="选择状态" 
          >
            <el-option value="1" label="未考核">未考核</el-option>
            <el-option value="2" label="已考核">已考核</el-option>
            <el-option value="3" label="重新考核">重新考核</el-option>
            <el-option value="-1" label="暂存">暂存</el-option>
          </el-select>
          <el-button v-waves type="primary" icon="el-icon-search" @click="timeListFilter">
            查询
          </el-button>
          <el-button v-waves type="primary" icon="el-icon-search" @click="oneKeyBatchDept">
            一键考核
          </el-button>
          <el-table ref="listTable" :data="timeList" style="width: 100%">
            <el-table-column 
              type="selection"
              :selectable="selectAble"
              width="55">
            </el-table-column>
            <el-table-column prop="yearmonth" label="时间">
            </el-table-column>
            <el-table-column prop="examState" label="状态">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.examState === 1" type="danger">未考核</el-tag>
                <el-tag v-else-if="scope.row.examState === 2" type="success">已考核</el-tag>
                <el-tag v-else-if="scope.row.examState === 3" type="danger">重新考核</el-tag>
                <el-tag v-else-if="scope.row.examState === -1" type="danger">暂存</el-tag>
                <el-tag v-else type="danger"></el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="tempName" label="指标名称">
            </el-table-column>
            <el-table-column prop="departName" label="科室名称">
            </el-table-column>
            <el-table-column prop="targetName" label="考核依据">
            </el-table-column>
             <el-table-column prop="score" label="得分">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
              <!-- 1表示不能评分，2表示可评分，3表示查看， -->
              <template slot-scope="scope">
                <el-button type="text" size="small" v-if="scope.row.examState == '2'" @click="scoreEvent(scope.row,false)">查看评分</el-button>
                <el-button type="text" size="small" v-if="scope.row.examState == '2'" @click="modifyEvent(scope.row,false)">重新考核</el-button>
                <el-button type="text" size="small" v-else @click="scoreEvent(scope.row,true)">评分</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @current-change="currentPageChange"
            background
            layout="prev, pager, next"
            :page-size="pagesize"
            :current-page	="currentPage"
            :total="total">
          </el-pagination>
        <!-- </div> -->
      </el-card>
    </div>
    <div>
      <el-dialog title="依据评分" :visible.sync="dialogFormVisible">
        <el-card class="box-card">
          <el-table :data="dataList" style="width: 100%">
            <el-table-column prop="indicator" label="项目">
            </el-table-column>
            <el-table-column prop="code" label="考核" width="100">
              <template slot-scope="scope">
                <el-input v-model="scope.row.score" placeholder="请输入内容" type="number" disabled=""></el-input>
              </template>
            </el-table-column>
             
            <el-table-column fixed="right" label="操作" width="70">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="sourcesShowEvent(scope.row,scope.$index)">查看依据</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <el-card class="box-card" v-if="sourcesShow">
          <el-table :data="tableList" style="width: 100%">
            <el-table-column prop="name" label="依据名" width="100">
            </el-table-column>
            <el-table-column prop="ifData" label="数据" width="130">
              <template slot-scope="scope">
                  <!-- 如果录入类型的就是input，如果是接口显示 0:没有框  1：手动输入  2：只读-->
                  <el-input type="number" v-model="scope.row.ifData"  max="100" min="0" placeholder="请输入内容" v-if="scope.row.dataSourceType === 1" @change="scoreComputed(scope.row)"></el-input>
                  <el-input type="number" v-model="scope.row.ifData"  max="100" min="0" placeholder="请输入内容" v-if="scope.row.dataSourceType !== 1 " disabled></el-input>                    
              </template>
            </el-table-column>
           
            <el-table-column prop="code" label="考核得分" width="130">
              <template slot-scope="scope">
                <!--*不能修改的（3）：1:区间法  2：目标值法 5：按项数评分 6：自定义 *input框（1）：7：一次性评分  *单选radio（2）：3：一票否决  4：单项否决-->
                <el-input type="number" v-model="scope.row.score"  max="100" min="0" placeholder="请输入内容" v-if="scope.row.operateType == 1" @change="scoreComputed(scope.row)"></el-input>
                <el-radio-group v-model="scope.row.score" v-if="scope.row.operateType == 2" @change="scoreComputed(scope.row)">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
                <el-input type="number" v-model="scope.row.score"  max="100" min="0" @input.native="onInput0_100" placeholder="请输入内容" v-if="scope.row.operateType == 3" disabled></el-input>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="打分类型">
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
            <el-table-column prop="reason" label="扣分原因" width="300" >
              <template slot-scope="scope">
                  <!-- 如果录入类型的就是input，如果是接口显示 0:没有框  1：手动输入  2：只读-->
                <el-input type="text" v-model="scope.row.scoreReasion" placeholder="输入原因"  v-if="scope.row.scoringMethod === 7" ></el-input>                    
              </template>
            </el-table-column>
          </el-table>   
        </el-card>
        <el-button v-if="scoreBtnVisible" type="primary" @click="storageEvent" class="allSave">考核暂存</el-button>
        <el-button v-if="scoreBtnVisible" type="success" @click="saveEvent" class="allSave">考核完毕</el-button>
      </el-dialog>
    </div>
  </div>

</div>
</template>

<script>
import waves from "@/directive/waves";
import Disposable from "../components/Disposable";
import TargetMethod from "../components/TargetMethod";

import { getDepartmentParam, getDepartmentParamWithId } from "@/api/department";

import {
  getExamDeptPersonTree,
  getTimeList,
  oneKeyBatch,
  getExamMonthExeList,
  getExamTempDeptData,
  getMonthTargetBasises,
  realtimeComputing,
  saveScore,
  grade,
  oneKeyBatchDeptNew,
  modifyState
} from "@/api/exam";
import { formatDate } from "@/utils/date";
export default {
  components: { Disposable,TargetMethod },
  props: ["activeName"],
  name: "Assessment",
  directives: {
    waves
  },
  data() {
    return {
      pageLoading: true,
      listQuery: {
        department: "",
        status: "",
        date: null,
        state: ""
      },
      tempParams: [],
      statusList: [
        {
          id: 1,
          name: "未考核"
        },
        {
          id: 2,
          name: "已考核"
        },
        {
          id: 3,
          name: "重新考核"
        }
      ],
      defaultProps: {
        children: "children",
        label: "name"
      },
      treeData: [
        //   {
        //   id: 1,
        //   label: '一级 1',
        //   state:1,
        //   children: [{
        //     id: 4,
        //     label: '二级 1-1',
        //     state:2,
        //     children: [{
        //       id: 9,
        //       label: '三级 1-1-1',
        //       state:3,
        //     }, {
        //       id: 10,
        //       label: '三级 1-1-2',
        //       state:4,
        //     }]
        //   }]
        // }, {
        //   id: 2,
        //   label: '一级 2',
        //   state:1,
        //   children: [{
        //     id: 5,
        //     label: '二级 2-1',
        //     state:2,
        //   }, {
        //     id: 6,
        //     label: '二级 2-2',
        //     state:1,
        //   }]
        // }, {
        //   id: 3,
        //   label: '一级 3',
        //   state:2,
        //   children: [{
        //     id: 7,
        //     label: '二级 3-1',
        //     state:3,
        //   }, {
        //     id: 8,
        //     label: '二级 3-2',
        //     state:4,
        //   }]
        // }
      ],
      treeLevel: false,
      defaultList: [],
      checkedIdList: [],
      dTime: "",
      timeList: [],
      pagesize: 10,
      currentPage: 1,
      total: 0,
      selectedTargetData: {},
      dialogFormVisible: false,
      dataList: [],
      sourcesShow: false,
      dataIndex: 0,
      obj: {},
      tableList: [],
      examMonthId: "",
      targetId: null,
      // 科室列表
      departmentParams: [],
      scoreBtnVisible: true,
      canSave: true
    };
  },
  mounted() {
    // console.log(this.activeName);
    this.setDefaultYearmonth();
    this.getExamMonthExeList();
    this.getDepartmentParams();
    //
    // console.log(this.treeData);
  },
  methods: {
    selectAble(row) {
      if (row.examState === 2) {
        return false;
      } else {
        return true;
      }
    },
    onInput0_100(e) {
      this.$message.closeAll();
      if (e.target.value < 0 || e.target.value > 100) {
        this.$message.warning("只能输入[0,100]区间的数");
      }
      e.target.value = (e.target.value >= 0 && e.target.value <= 100 && e.target.value.match(/^\d{1,3}(\.\d*)?$/)[0]) || null;
    },

    // 获取科室列表
    getDepartmentParams() {
      getDepartmentParam().then(response => {
        this.departmentParams = response.data;
      });
    },
    // 初始树
    getExamMonthExeList() {
      this.treeLevel = false;
      // this.dTimeEvent();
      // console.log(this.listQuery.date)
      getExamMonthExeList({
        operator: this.$store.getters.userID, //登录用户ID
        assessed: this.activeName, //查询类型（1:科室, 2:人员）
        fuzzy: this.listQuery.department, //模糊查询字段
        examState: this.listQuery.status, //考核状态（1:未考核, 2:已考核, 3,重新考核）
        yearmonth: this.listQuery.date
      }).then(res => {
        this.pageLoading = false;
        this.treeData = res.data.children;
        this.addAttr(this.treeData);
        // this.listQuery.date = res.data.yearmonth;
        // console.log(this.treeData);
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
      // console.log(this.dTime);
    },
    //查询
    handleFilter() {
      this.getExamMonthExeList();
    },
    // 递归添加属性,改变原数组
    addAttr(data) {
      data.forEach(item => {
        if (item.examState == 2) {
          this.$set(item, "disabled", true);
        } else {
          this.$set(item, "disabled", false);
        }
        if (item.children && item.children.length) {
          this.addAttr(item.children);
        }
      });
    },
    // 点击树节点
    treeHandleNodeClick(data) {
      if (data.children === null) {
        this.currentPage = 1;
        this.pagesize = 10;
        this.treeLevel = true;
        this.selectedTargetData = data;
        this.getExamTempDeptData(data);
      } else {
        this.treeLevel = false;
      }
    },
    getExamTempDeptData(data) {
      // this.dTimeEvent();
      getExamTempDeptData({
        department: data.department,
        temp: data.examTemp, //被考核类型（1:科室, 2:人员）
        targetId: data.targetId, //当 assessed = 1 时是科室ID, 当 assessed = 2 时是人员ID
        yearmonth: this.listQuery.date, //查询年月，当为null或""时表示查询当前年月
        currentPage: this.currentPage,
        pagesize: this.pagesize
      }).then(res => {
        // console.log(res);
        this.timeList = res.data.DataList;
        this.total = res.data.total;
      });
    },
    checkEvent(checkedNodes, checkedKeys) {},
    currentChange(data, node) {
      if (node && data.children == "") {
        this.checkedIdList.push(data.id);
      } else if (!node && data.children == "") {
        let index = this.checkedIdList.findIndex(v => v == data.id);
        this.checkedIdList.splice(index, 1);
      }
    },
    currentPageChange(newPage) {
      this.currentPage = newPage;
      this.getExamTempDeptData(this.selectedTargetData);
    },
    // 评分
    scoreEvent(data, btnVisible) {
      this.sourcesShow = false;
      this.scoreBtnVisible = btnVisible;
      this.examMonthId = data.id;
      this.targetId = data.targetId;
      getMonthTargetBasises({
        examMonthId: this.examMonthId, //考核年月ID
        operatorId: this.$store.getters.userID, //操作人员ID
        targetId: this.targetId
      }).then(res => {
        // console.log(res)
        this.dialogFormVisible = true;
        this.dataTime = res.data.yearmonth;
        this.dataList = res.data.monthTargetBasises;
        // console.log(this.dataList)
      });
    },
    modifyEvent(data) {
      // this.examMonthId = data.id;
      // this.targetId = data.targetId;
      // let data1 = {
      //   operatorId: this.$store.getters.userID, //操作者ID
      //   examMonthId: this.examMonthId, //考核年月ID
      //   monthTargetScores: this.dataList
      // };

      modifyState(data)
        .then(res => {
          if (res.status == 200) {
            this.$message({
              message: "考核评分已重置，可继续评分",
              type: "success"
            });

            // this.getExamTempDeptData(this.selectedTargetData);
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
          this.timeListFilter();
        })
        .catch(err => {
          this.loading = false;
        });
    },
    // 查看依据
    sourcesShowEvent(data, index) {
      if (this.sourcesShow === true) {
        this.sourcesShow = false;
      } else {
        this.tableList = data.monthBasises;
        this.sourcesShow = true;
        this.dataIndex = index;
        this.obj = data;
        // console.log(data.monthBasises);
      }
    },
    // 多选一键考核
    unifiedEvent() {
      // this.dTimeEvent();
      let data = {
        yearmonth: this.listQuery.date, //一键考核的年月
        assessed: this.activeName, //查询类型（1:科室, 2:人员）
        deptPersonIds: this.checkedIdList, // 一键考核的科室/员工ID列表
        operator: this.$store.getters.userID //登录用户ID
      };
      // console.log(data);
      oneKeyBatch(data).then(res => {
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
        this.getExamDeptPersonTree();
        this.treeLevel = false;
      });
    },
    oneKeyBatchDept() {
      const selectedData = this.$refs.listTable.selection;
      let selectItem = [];
      selectedData.map((item, index) => {
        selectItem.push(item);
      });
      if (selectItem.length === 0) {
        this.$message({
          message: "未选择要一键考核的科室",
          type: "warning"
        });
        return;
      }
      // console.log(selectItem)
      oneKeyBatchDeptNew(selectItem).then(res => {
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
        this.timeListFilter();
      });
    },
    // 渲染tree的右侧
    renderContent(h, { node, data, store }) {
      let state;
      if (data.examState == "1") {
        state = <span style="color:#169BD5"> 未考核 </span>;
      } else if (data.examState == "2") {
        state = <span style="color:#44890E"> 已考核 </span>;
      } else if (data.examState == "3") {
        state = <span style="color:#F22727"> 重新考核 </span>;
      }
      if (data.children && data.children.length != 0) {
        return (
          <span class="custom-tree-node">
            <span> {data.tempName} </span>{" "}
          </span>
        );
      } else {
        return (
          <span class="custom-tree-node">
            <span> {data.tempName} </span> <span> {state} </span>{" "}
          </span>
        );
      }
    },
    setDefaultYearmonth() {
      var self = this;
      const month = new Date().getMonth();
      var defYearmonth = new Date(new Date().setMonth(month, 1));
      const ymStr = formatDate(defYearmonth, "yyyy-MM");
      self.listQuery.date = ymStr;
    },
    // 根据依据计算考核分数
    scoreComputed(data) {
      // console.log("change")
      console.log(data)
      if(data.score > 100){
        data.score =100;
      }
      if(data.score < 0){
        data.score =0;
      }
      // console.log(this.obj)
      realtimeComputing(this.obj).then(res => {
        // console.log(res);
        if(res.data.score > 100)
        {
          res.data.score = 100
        }
        if(res.data.score < 0)
        {
          res.data.score = 0
        }
        this.dataList[this.dataIndex].score = res.data.score; //计算得来的值
        this.tableList = res.data.monthBasises;

        this.dataList[this.dataIndex].monthBasises = this.tableList; //更新原数据
      });
    },
    valideAssignee(data) {
      var self = this;
      // console.log(data);
      if (
        data.scoringMethod === 7 &&
        data.score !== 100 &&
        data.scoreReasion === null
      ) {
        this.canSave = false;
        self.$message({
          message: "一次性评分不是满分，请填写扣分原因",
          type: "warning"
        });
      }
      // if (data.scoringMethod === 7 && data.score < 0) {
      //   this.canSave = false;
      //   self.$message({
      //     message: "未评分，不能保存",
      //     type: "warning"
      //   });
      // }
      if (data.scoringMethod === 7 && data.score === null) {
        this.canSave = false;
        self.$message({
          message: "未评分，不能保存",
          type: "warning"
        });
      }
    },
    // 考核暂存
    storageEvent() {
      this.canSave = true;
      let data = {
        operatorId: this.$store.getters.userID, //操作者ID
        examMonthId: this.examMonthId, //考核年月ID
        monthTargetScores: this.dataList
      };
      let aList = this.tableList;
      if (aList.length <= 0) {
        this.canSave = false;
        this.$message({
          message: "未评分，不能保存",
          type: "warning"
        });
      }
      aList.map((i, index) => {
        this.valideAssignee(i);
      });
      this.loading = true;
      if (this.canSave) {
        saveScore(data)
          .then(res => {
            if (res.status == 200) {
              this.$message({
                message: "恭喜你，操作成功",
                type: "success"
              });
              this.examMonthId = "";
              this.dialogFormVisible = false;
              this.getExamTempDeptData(this.selectedTargetData);
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
      }
    },
    // 考核完毕
    saveEvent() {
      // console.log(this.dataList);
      this.canSave = true;
      let data = {
        operatorId: this.$store.getters.userID, //操作者ID
        examMonthId: this.examMonthId, //考核年月ID
        monthTargetScores: this.dataList
      };
      let aList = this.tableList;
      if (aList.length <= 0) {
        this.canSave = false;
        this.$message({
          message: "未评分，不能保存",
          type: "warning"
        });
      }
      aList.map((i, index) => {
        this.valideAssignee(i);
      });
      if (this.canSave) {
        this.$confirm("是否完成考核，确定将不能再次修改此考核", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.loading = true;

            grade(data)
              .then(res => {
                if (res.status == 200) {
                  this.$message({
                    message: "恭喜你，操作成功",
                    type: "success"
                  });
                  this.examMonthId = "";
                  this.dialogFormVisible = false;
                  this.getExamTempDeptData(this.selectedTargetData);
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
    },
    timeListFilter() {
      // this.currentPage = 1
      const data = this.selectedTargetData;
      getExamTempDeptData({
        department: data.department,
        temp: data.examTemp, //被考核类型（1:科室, 2:人员）
        targetId: data.targetId, //当 assessed = 1 时是科室ID, 当 assessed = 2 时是人员ID
        yearmonth: this.listQuery.date, //查询年月，当为null或""时表示查询当前年月
        currentPage: this.currentPage,
        pagesize: this.pagesize,
        exeDept: this.listQuery.department,
        stat: this.listQuery.state
      }).then(res => {
        // console.log(res);
        this.timeList = res.data.DataList;
        this.total = res.data.total;
      });
      // console.log(this.listQuery.state)
      // console.log(this.listQuery.department)
    }
  }
};
</script>

<style lang="scss">
.assessment {
  padding-top: 10px;

  .bottom {
    display: flex;
    display: -webkit-flex;

    .left {
      width: 40%;

      h3 {
        display: flex;
        display: -webkit-flex;
        justify-content: space-between;
        padding: 0 20px;
        border-bottom: 1px solid #ccc;
        margin: 0;
      }
    }

    .right {
      width: 60%;
    }
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
}
</style>
