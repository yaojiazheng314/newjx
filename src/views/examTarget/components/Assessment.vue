<template>
<div class="assessment" v-loading="pageLoading">
  <div class="filter-container">
    <el-input v-model="listQuery.department" placeholder="请输入科室名称" style="width:200px" clearable></el-input>
    <el-select v-model="listQuery.status" filterable clearable placeholder="请选择状态">
      <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id">
        <span style="float: left">{{ item.name }}</span>
      </el-option>
    </el-select>
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
        <el-button v-waves type="primary" icon="el-icon-thumb" @click="unifiedEvent">多选一键考核</el-button>
        <h3>
          <p>科室</p>
          <p>状态</p>
        </h3>
        <el-tree :data="treeData" :props="defaultProps" :default-checked-keys="defaultList" @check="checkEvent" @check-change="currentChange" show-checkbox node-key="id" default-expand-all :expand-on-click-node="false" @node-click="treeHandleNodeClick" :render-content="renderContent"></el-tree>
      </el-card>
    </div>
    <div class="right">
      <!-- 可能循环 -->
      <el-card v-if="treeLevel" class="box-card">
        <div v-for="(item,index) in timeList" :key="index" style="padding-bottom:20px;borer-bottom:1px solid #ccc">
          <el-form>
            <el-form-item label="当前名称">{{item.deptPersonName}}</el-form-item>
            <el-form-item label="考核类型">{{item.frequencyText}}</el-form-item>
          </el-form>
          <el-table :data="item.yearmonths" style="width: 100%">
            <el-table-column prop="yearmonth" label="时间">
            </el-table-column>
            <el-table-column prop="examStateText" label="状态">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
              <!-- 1表示不能评分，2表示可评分，3表示查看， -->
              <template slot-scope="scope">
                <el-button type="text" size="small" v-if="scope.row.operateCode == '3'" @click="scoreEvent(scope.row,3)">查看评分</el-button>
                <el-button type="text" size="small" v-else-if="scope.row.operateCode == '2'" @click="scoreEvent(scope.row,2)">评分</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>
  </div>

</div>
</template>

<script>
import waves from "@/directive/waves";
import { getExamDeptPersonTree, getTimeList, oneKeyBatch } from "@/api/exam";
import { formatDate } from '@/utils/date';
export default {
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
        date: null
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
      timeList: []
    };
  },
  mounted() {
    // console.log(this.activeName);
    this.setDefaultYearmonth()
    this.getExamDeptPersonTree();
    //
    // console.log(this.treeData);
  },
  methods: {
    // 初始树
    getExamDeptPersonTree() {
      this.treeLevel = false;
      // this.dTimeEvent();
      // console.log(this.listQuery.date)
      getExamDeptPersonTree({
        operator: this.$store.getters.userID, //登录用户ID
        assessed: this.activeName, //查询类型（1:科室, 2:人员）
        fuzzy: this.listQuery.department, //模糊查询字段
        examState: this.listQuery.status, //考核状态（1:未考核, 2:已考核, 3,重新考核）
        yearmonth: this.listQuery.date
      }).then(res => {
        this.pageLoading = false;
        this.treeData = res.data.deptPersons;
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
       console.log(this.dTime)
    },
    //查询
    handleFilter() {
      this.getExamDeptPersonTree();
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
      if (data.children == "") {
        this.treeLevel = true;
        this.getTimeList(data.id);
      } else {
        this.treeLevel = false;
      }
    },
    getTimeList(id) {
      // this.dTimeEvent();
      getTimeList({
        operator: this.$store.getters.userID, //操作人员ID
        assessed: this.activeName, //被考核类型（1:科室, 2:人员）
        deptPersonId: id, //当 assessed = 1 时是科室ID, 当 assessed = 2 时是人员ID
        yearmonth: this.listQuery.date //查询年月，当为null或""时表示查询当前年月
      }).then(res => {
        // console.log(res);
        this.timeList = res.data;
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
    // 评分
    scoreEvent(data,num){
      console.log(data)
         this.$router.push({
          path: "/exam/score",
          query: {
            examMonthId:data.examMonthId
					}
        });
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
            <span> {data.name} </span>{" "}
          </span>
        );
      } else {
        return (
          <span class="custom-tree-node">
            <span> {data.name} </span> <span> {state} </span>{" "}
          </span>
        );
      }
    },
    setDefaultYearmonth() {
				var self = this
				const month = new Date().getMonth() 
				var defYearmonth = new Date(new Date().setMonth(month, 1))
				const ymStr = formatDate(defYearmonth, 'yyyy-MM')
				self.listQuery.date = ymStr
			},
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
