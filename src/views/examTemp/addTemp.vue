<template>
<div class="app-container addTemp">
  <div class="top">
    <div class="left">
      <el-card class="box-card">
        <el-form ref="tempForm" :model="tempForm" label-position="right" label-width="100px">
          <el-form-item label="模板名称:" prop="tempName">
            <el-input v-model.trim="tempForm.tempName" placeholder="请输入内容" style="width: 200px;">
            </el-input>
          </el-form-item>
          <el-form-item label="种类:" prop="tempType">
            <el-select v-model="tempForm.tempType" placeholder="请选择" @change="tempTypeEvent">
              <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="总分:" prop="totalScore">
            <el-input type="number" v-model.trim="tempForm.totalScore" placeholder="请输入内容" style="width: 200px;">
            </el-input>
          </el-form-item>

          <el-form-item label="考核频率:" prop="frequency">
            <el-select v-model="tempForm.frequency" placeholder="请选择">
              <el-option v-for="item in frequencyList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模板状态:" prop="state">
            <el-select v-model="tempForm.state" placeholder="请选择">
              <el-option v-for="item in stateList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="考核因子:" prop="bnsDataItem">
            <el-select v-model="tempForm.bnsDataItem" placeholder="请选择">
              <el-option v-for="item in dataItem" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

        </el-form>
      </el-card>
    </div>

    <div class="right">
      <el-card class="box-card" v-if="tempForm.tempType != ''">
        <div class="treeTitle">
          <h4>{{tempForm.tempType == 1 ? '科室模板选择' : '个人模板选择'}}</h4>
          <h4>已选择{{selectNum}}个</h4>
        </div>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-input placeholder="输入关键字进行过滤" v-model="filterText" clearable @keyup.enter.native="treeSearchEvent"></el-input>
          </el-col>
          <el-col :span="5">
            <el-button type="primary" icon="el-icon-search" @click="treeSearchEvent">搜索</el-button>
          </el-col>
        </el-row>
        <el-tree ref="treeData" v-loading="treeLoading" :data="treeData" show-checkbox node-key="id" :default-checked-keys="defaultList" default-expand-all :expand-on-click-node="false" :props="defaultProps" @check="checkEvent" @check-change="currentChange"></el-tree>
      </el-card>
    </div>
  </div>

  <div class="bottom">
    <div class="left">
      <el-card class="box-card">
        <el-table :data="tableData" row-key="id" border  :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column prop="indicator" label="指标">
          </el-table-column>
          <el-table-column prop="weight" label="权重" width="100" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.weight" type="number" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" plain v-if="scope.row.levelId == 0" @click="deleltEvent(scope.row)">删除</el-button>
              <!-- <el-button type="primary" size="mini" plain v-else-if="scope.row.hasBasis == 1 && scope.row.children == ''" @click="viewBasisEvent(scope.row)">查看依据</el-button> -->
              <!-- <el-button :type="scope.row.state == 1 ? 'success':'danger'" size="mini" plain v-show="scope.row.children == ''" @click="viewChangeEvent(scope.row)">{{scope.row.state == 1 ? '停用':'启用'}}</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <div class="addIndicator">
          <el-button type="primary" icon="el-icon-plus" size="small" @click="addIndicatorEvent">添加指标</el-button>
        </div>
      </el-card>
      <el-button type="primary" @click="saveEvent" class="allSave">保 存</el-button>
    </div>

    <div class="right">
      <el-card class="box-card" v-if="rightShow">
        <h2 style="text-align:center">依 据</h2>
        <el-collapse>
        <div v-for="(item,index) in addBasisList" :key="index" class="addBasislist">
        <el-collapse-item :title="item.name">
        <el-row>
          <el-col :span="21">
            <el-form>
              <el-form-item label="考核内容">
                {{item.name}}
              </el-form-item>
              <el-form-item label="考核方法">
                {{item.basis}}
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="3">
            <!-- <el-button type="primary" round @click="handleEdit(item)" v-show="item.state == 1">启用</el-button>
            <el-button type="warning" round @click="handleEdit(item)" v-show="item.state == 0">停用</el-button> -->
          </el-col>
        </el-row>
        <IntervalMethod :addBasisForm="item" v-if="item.scoringMethod == 1" />
        <TargetMethod :addBasisForm="item" v-if="item.scoringMethod == 2" />
        <Disposable :addBasisForm="item" v-if="item.scoringMethod == 5" />
        <CustomMethod :addBasisForm="item" v-if="item.scoringMethod == 6" />
        </el-collapse-item>
        </div>
        </el-collapse>
      </el-card>
    </div>

  </div>
  <el-dialog title="指标库" :close-on-click-modal="false" :visible.sync="sourcesShow">
    <el-row :gutter="10">
      <el-col :span="8">
        <el-input v-model="sourcesVal" placeholder="请输入内容" clearable @keyup.enter.native="searchEvent"></el-input>
      </el-col>
      <el-col :span="5">
        <el-button type="primary" icon="el-icon-search" @click="searchEvent">搜索</el-button>
      </el-col>

      <el-col :span="5">
        <el-button type="success" icon="el-icon-plus" @click="addTableList">添加</el-button>
      </el-col>
    </el-row>
    <!-- <el-table :data="sourcessTableData" style="width: 100%">
      <el-table-column prop="indicator" label="指标">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click="addList(scope.row)" type="text" size="small">
            添加至模板
          </el-button>
        </template>
      </el-table-column>
    </el-table> -->
    <el-tree
      ref="sourcessTree"
      :data="sourcessTableData"
      show-checkbox
      node-key="id"
      :filter-node-method="filterNode"
      :default-checked-keys="sourcessChecked"
      :props="targetsProps">
    </el-tree>

  </el-dialog>
</div>
</template>

<script>
import waves from "@/directive/waves";
import IntervalMethod from "./components/IntervalMethod";
import TargetMethod from "./components/TargetMethod";
import Disposable from "./components/Disposable";
import CustomMethod from "./components/CustomMethod";
import {
  getTemp,
  getDeptUserTree,
  saveExamTemp,
  getFirstLevelTargets,
  getFirstLevelTargetTree,
  getBasisByTargetId,
  getExamTargets
} from "@/api/exam";
import {  getDataItemParamForExam } from '@/api/bnsDataItem';
export default {
  name: "AddTemp",
  directives: {
    waves
  },
  components: {
    IntervalMethod,
    TargetMethod,
    Disposable,
    CustomMethod
  },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "name"
      },
      tempForm: {
        tempName: "", //模板名称
        tempType: "", //种类
        totalScore: "", //总分
        frequency: "", //考核频率
        state: "", //模板状态
        bnsDataItem: 0
      },
      statusList: [
        {
          value: "1",
          label: "开启"
        },
        {
          value: "2",
          label: "关闭"
        }
      ],
      typeList: [
        {
          value: "2",
          label: "个人模板"
        },
        {
          value: "1",
          label: "科室模板"
        }
      ],
      frequencyList: [
        {
          value: "1",
          label: "年度"
        },
        {
          value: "4",
          label: "季度"
        },
        {
          value: "12",
          label: "月度"
        }
      ],
      stateList: [
        {
          value: "0",
          label: "停用"
        },
        {
          value: "1",
          label: "启用"
        }
      ],
      departmentList: [],
      treeLoading: true,
      treeData: [],
      defaultList: [],
      isCheckClick: false,
      filterText: "",
      selectNum: "0",
      tableData: [],
      checkedKeysList: [],
      checkedIdList: [],
      sourcessTableData: [],
      sourcesShow: false,
      sourcesVal: "",
      loading: false,
      rightShow: false,
      addBasisForm: {}, //获取来的依据数据
      addBasisList: [],
      targetsProps: {
        children: 'children',
        label: 'indicator'
      },
      sourcessChecked: [],
      resetWeightIds: [],
      resetWeightValues: [],
      dataItem:[]
    };
  },
  mounted() {
    if (this.$route.query.id) {
      // 查询接口，修改
      this.getTemp();
    }
    if (!this.isCheckClick) {
      this.selectNum = this.defaultList.length;
    }
    this.getDataItemParamForExam();
  },
  methods: {
    getTemp() {
      getTemp({
        tempId: this.$route.query.id
      }).then(res => {
        // console.log(res);
        this.tempForm.tempName = res.data.name;
        this.tempForm.tempType = res.data.assessed;
        this.tempForm.totalScore = res.data.fullScore;
        this.tempForm.frequency = String(res.data.frequency);
        this.tempForm.state = String(res.data.state);
        this.tempForm.bnsDataItem =res.data.bnsDataItem
        this.tableData = res.data.targetConfigs;
        this.defaultList = res.data.targets;
        this.checkedIdList = res.data.targets;
        this.selectNum = this.checkedIdList.length;
        this.getDeptUserTree();
      });
    },
    getDataItemParamForExam() {
				getDataItemParamForExam().then(response => {
					this.dataItem = response.data
				})
			},
    checkEvent(checkedNodes, checkedKeys) {
      // console.log(checkedKeys)
      this.isCheckClick = true; //是否点击过，因为默认的defaultList不chang保存时就获取不到
      this.checkedKeysList = checkedKeys.checkedNodes.filter(
        val => !val.children
      );
      let checkIdList = [];
      for (let i in this.checkedKeysList) {
        checkIdList.push(this.checkedKeysList[i].id);
      }
      this.checkedIdList = [
        ...new Set([...this.checkedIdList, ...checkIdList])
      ];
      this.selectNum = this.checkedIdList.length;
    },
    currentChange(data, node) {
      if (!node && data.children == null) {
        // console.log(this.checkedIdList)
        let index = this.checkedIdList.findIndex(v => v == data.id);
        this.checkedIdList.splice(index, 1);
        this.selectNum = this.checkedIdList.length;
      }
    },
    // 总保存
    saveEvent() {
      // console.log(this.tempForm);
      // console.log(this.checkedIdList);
      console.log(this.tableData);
      const checkTableData = this.checkTableData(this.tableData)
      if(!checkTableData){
        return false
      }
      let checkIdList = [];
      if (this.isCheckClick) {
        checkIdList = this.checkedIdList;
      } else {
        checkIdList = this.defaultList;
      }
      let id = this.$route.query.id ? this.$route.query.id : null;
      // console.log(checkIdList)
      let data = {
        id: id, //模板ID
        name: this.tempForm.tempName, //模板名称
        assessed: this.tempForm.tempType, //被考核类型（1: 科室, 2: 人员）
        fullScore: this.tempForm.totalScore, //总分
        frequency: this.tempForm.frequency, // 考核频率（1: 按年, 4: 按季度, 12: 按月）
        state: this.tempForm.state, //模板的停用启用（0：停用，1:启用）
        targetConfigs: this.tableData, //指标配置
        targets: checkIdList, //考核目标，如果被考核类型是科室，此字段是科室ID列表，如果被考核类型是人员，此字段是人员列表ID
        operator: this.$store.getters.userID, //操作用户
        bnsDataItem:this.tempForm.bnsDataItem
      };
      // console.log(data)
      saveExamTemp(data).then(res => {
        // 保存接口
        if (res.status == 200) {
          this.$message({
            message: "恭喜你，添加成功",
            type: "success"
          });
        } else {
          this.$message({
            message: res.msg,
            type: "warning"
          });
        }
      });
    },
    checkTableData(dataData, name='') {
      let sum = 0
      let checkChildren = true
      dataData.forEach((value,index) => {
        sum = sum + Number(value.weight)
        if(value.children.length){
          checkChildren = this.checkTableData(value.children,value.indicator)
        }
      })
      if(!checkChildren)
      {
        return false
      }
      if(sum != 100)
      {
        this.$message({
          message: name + '权重总数不为100',
          type: "warning"
        });  
        return false 
      }
      return true
    },
    // 种类切换
    tempTypeEvent(val) {
      this.getDeptUserTree();
      this.checkedKeysList = [];
      this.checkedIdList = [];
      this.treeData = [];
      this.defaultList = [];
      this.isCheckClick = false;
      this.filterText = "";
      this.selectNum = "0";
    },
    // 树形搜索
    treeSearchEvent() {
      this.getDeptUserTree();
    },
    // 获取树形
    getDeptUserTree() {
      this.treeLoading = true;
      getDeptUserTree({
        assessed: this.tempForm.tempType, //查询类型（科室: 1/人员: 2）
        fuzzy: this.filterText //模糊查询字段
      }).then(res => {
        this.treeLoading = false;
        this.treeData = res.data;
        // console.log(this.checkedKeysList)
        if (this.checkedKeysList != "") {
          let checkIdList = [];
          for (let i in this.checkedKeysList) {
            checkIdList.push(this.checkedKeysList[i].id);
          }
          this.defaultList = [
            ...new Set([...this.defaultList, ...checkIdList])
          ];
          this.checkedIdList = this.defaultList;
          // console.log(this.defaultList)
        }
      });
    },
    // 添加指标
    addIndicatorEvent() {
      this.sourcesShow = true;
      this.getFirstLevelTargets();
    },

    filterNode(value, data) {
        if (!value) return true;
        return data.indicator.indexOf(value) !== -1;
      },
    // 指标列表接口
    getFirstLevelTargets() {
      this.sourcessChecked = []
      this.getCheckedExamTargetKey(this.tableData)
      getExamTargets().then(res => {
        this.sourcessTableData = res.data.children;
        this.resetTargetsWeight(this.sourcessTableData)
        
      });
    },
    resetTargetsWeight(data){
      data.forEach(item => {
        if(this.resetWeightIds.includes(item.id))
        {
          item.weight = this.resetWeightValues[this.resetWeightIds.indexOf(item.id)]
        }
        if(item.children.length > 0)
        {
          this.resetTargetsWeight(item.children)
        }
      })
    },
    getCheckedExamTargetKey(data){
       data.forEach(item => {
        if(item.weight)
        {
          this.resetWeightIds.push(item.id)
          this.resetWeightValues.push(item.weight)
        }
        if(item.children.length > 0){
          this.getCheckedExamTargetKey(item.children)
        } else{
          this.sourcessChecked.push(item.id)
        }
      })
    },
    searchEvent() {
        this.$refs.sourcessTree.filter(this.sourcesVal);
    },
    // 添加至模板2.0
    addTableList() {
      this.tableData = []
      let checkedData = this.$refs.sourcessTree.getCheckedNodes().concat(this.$refs.sourcessTree.getHalfCheckedNodes())
      console.log(checkedData)
      checkedData.forEach(item => {
        item.children = []
      })
      this.tableData = this.arrayToJson(checkedData)
      this.sourcesShow = false;


    },
    arrayToJson(treeArray){
			    var r = [];
			    var tmpMap ={};
			    for (var i=0, l=treeArray.length; i<l; i++) {
			     // 以每条数据的id作为obj的key值，数据作为value值存入到一个临时对象里面
			      tmpMap[treeArray[i]["id"]]= treeArray[i]; 
			    } 
			    console.log('tmpMap',tmpMap)
			    for (i=0, l=treeArray.length; i<l; i++) {
			      var key=tmpMap[treeArray[i]["parent"]];
			      console.log('key',key)
			      //循环每一条数据的pid，假如这个临时对象有这个key值，就代表这个key对应的数据有children，需要Push进去
			      //如果这一项数据属于哪个数据的子级
			      if (key) {
			      	// 如果这个数据没有children
			        if (!key["children"]){
			            key["children"] = [];
			            key["children"].push(treeArray[i]);
			        // 如果这个数据有children
			        }else{
			          key["children"].push(treeArray[i]);
			        }       
			      } else {
			        //如果没有这个Key值，就代表找不到属于哪个数据，那就代表没有父级,直接放在最外层
			        r.push(treeArray[i]);
			      }
			    }
			    return r
			   },

    // 添加至模板
    addList(data) {
      // console.log(data.id);
      // console.log(this.tableData.find(n=>n.id == data.id) == undefined);
      if (this.tableData.find(n => n.id == data.id) == undefined) {
        getFirstLevelTargetTree({
          targetId: data.id
        }).then(res => {
          // console.log(res)
          let newList = [res.data];
          this.tableData = [...this.tableData, ...newList];
          this.sourcesShow = false;
        });
      } else {
        this.$message({
          message: "此模板您已添加",
          type: "warning"
        });
      }
    },
    // 删除指标模板
    deleltEvent(data) {
      let dataIndex = this.tableData.findIndex(v => v.id == data.id);
      this.tableData.splice(dataIndex, 1);
      this.rightShow = false;
    },
    // 查看依据
    viewBasisEvent(data) {
      getBasisByTargetId({
        targetId: data.id
      }).then(res => {
        // console.log(res)
        this.addBasisList = res.data;
        for (let i in this.addBasisList) {
          this.addBasisList[i].targetId = data.id;
          for (let j in data.basisStates) {
            if (data.basisStates[j].basisId == this.addBasisList[i].id) {
              this.addBasisList[i].state = data.basisStates[j].basisState;
            }
          }
        }
        this.rightShow = true;
        // console.log(this.addBasisList)
      });
    },
    // 依据停用启用
    handleEdit(basisData) {
      let index = this.addBasisList.findIndex(v => v.id == basisData.id);
      this.$set(
        this.addBasisList,
        index,
        Object.assign({}, basisData, { state: basisData.state == 0 ? 1 : 0 })
      );
      // 修改tableData里的数据
      this.tableChangeEvent(
        this.tableData,
        basisData.targetId,
        basisData.id,
        this.addBasisList[index].state
      );
    },
    // 变换方法
    tableChangeEvent(list, targetId, basisId, val) {
      // console.log(val)
      list.forEach(item => {
        if (item.id == targetId) {
          for (let i in item.basisStates) {
            if (item.basisStates[i].basisId == basisId) {
              item.basisStates[i].basisState = val;
            }
          }
          return;
        }
        if (item.children && item.children != "") {
          this.tableChangeEvent(item.children, targetId, basisId, val);
        }
      });
    },
    // 指标停用启用
    viewChangeEvent(data) {
      this.changeTable(this.tableData, data.id, data.state);
    },
    // 指标的变化方法
    changeTable(list, id, val) {
      list.forEach(el => {
        if (el.id == id) {
          el.state = val == 1 ? 0 : 1;
          return;
        }
        if (el.children && el.children != "") {
          this.changeTable(el.children, id, val);
        }
      });
    },
    // 渲染合并表格
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
      } else if (columnIndex == 3) {
        return {
          rowspan: row.firstRowspan,
          colspan: row.firstColspan
        };
      } else {
        return {
          rowspan: 1,
          colspan: 1
        };
      }
    },
    closeDialog() {
      this.sourcesShow = false;
    }
  }
};
</script>

<style lang="scss">
.addTemp {
  .top {
    display: flex;
    display: -webkit-flex;

    .left {
      width: 40%;

      .box-card {
        height: 390px;
        overflow-y: auto;
      }
    }

    .right {
      width: 60%;

      .box-card {
        max-height: 390px;
        overflow-y: auto;
      }

      .treeTitle {
        display: flex;
        display: -webkit-flex;
        justify-content: space-around;
      }
    }
  }

  .bottom {
    padding-top: 10px;
    display: flex;
    display: -webkit-flex;

    .left {
      width: 40%;

      .box-card {
        // max-height: 50%;
        // overflow-y: auto;
      }

      .addIndicator {
        width: 100%;
        text-align: center;
        margin: 10px 0;
      }
    }

    .right {
      width: 60%;

      .addBasislist {
        // border-bottom: 1px solid #ccc;
        padding: 20px 0;
      }
    }
  }
  .allSave {
    margin-top: 20px;
  }
}
</style>
