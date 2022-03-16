<template>
    <div class="app-container">
        <div class="filter-container">
            <span class="demonstration">年度</span>
            <el-date-picker
                v-model="year"
                type="year"
                value-format="yyyy"
                placeholder="选择年"
                @change="yearChangeHandle"
                class="searchClass"
            >
            </el-date-picker>

            <el-button
                type="primary"
                icon="el-icon-plus"
                size="small"
                @click="createTarget"
                v-waves
                >生成年度目标</el-button
            >
        </div>
        <div class="aimConfig">
            <div class="left">
                <el-card class="box-card">
                    <el-tree
                        :data="treeData"
                        node-key="id"
                        default-expand-all
                        :expand-on-click-node="false"
                        accordion
                        :props="defaultProps"
                    >
                    </el-tree>
                </el-card>
            </div>
        </div>

        <el-dialog title="正在生成年度目标" :visible.sync="dialogVisible" :close="dialogClose" width="80%">
            <el-steps :active="stepActive" simple>
                <el-step title="基本信息"></el-step>
                <el-step title="权重信息"></el-step>
                <el-step title="年度目标预览"></el-step>
            </el-steps>

            <el-card class="box-card" v-show="basicInfoVisible">
                <el-radio-group v-model="yearBasis" @change="basicYearChange">
                    年度依据
                    <el-radio :label="1">历届</el-radio>
                    <el-radio :label="2">目标库</el-radio>
                </el-radio-group>
                <el-divider></el-divider>
                <div>
                    <el-select
                    @change="previousYearChange"
                    v-show="previousYearVisible"
                    width="100%"
                    v-model="previousYear">
                    <el-option
                        v-for="item in previousYears"
                        :key="item.yearTemp"
                        :label="item.yearTemp"
                        :value="item.yearTemp">
                    </el-option>
                </el-select>
                </div>
                <el-divider></el-divider>
                <el-tree
                    :data="basisTreeData"
                    node-key="id"
                    default-expand-all
                    :expand-on-click-node="false"
                    accordion
                    :render-content="basisRenderContent"
                    :props="defaultProps"
                >
                </el-tree>
            </el-card>

            <el-card class="box-card" v-show="weightInfoVisible">
                <div slot="header" class="clearfix">

                    <span>年度：{{adjustmentYear}}</span>

                    <el-form :inline="true" class="demo-form-inline" v-show="adjustmentRatioVisibel">
                        <el-form-item label="调整比率">
                            <el-input v-model="adjustmentRatio" placeholder="调整比率"></el-input>
                        </el-form-item>
                        <el-form-item>%</el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="adjustmentRatioSubmit">调整</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <el-table
                    v-loading="weightInfoLoading"
                    :data="weightInfoTreeData"
                    row-key="id"
                    border
                    default-expand-all
                    :tree-props="{
                        children: 'children',
                        hasChildren: 'hasChildren',
                    }">
                    <el-table-column prop="indicator" label="目标名称" width="600"
>
                    </el-table-column>
                    <el-table-column
                        prop="weight"
                        label="目标值"
                        width="150"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <el-input
                                :disabled="inputDisabled"
                                v-if="scope.row.targetvaluestype === 1"
                                v-model="scope.row.targetvalues"
                                type="number"
                                size="small"
                            ></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="weight"
                        label="关系"
                        width="150"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <el-select 
                              v-if="scope.row.targetvaluestype === 1"
                              :disabled="inputDisabled"
                              v-model="scope.row.relation" 
                              filterable clearable 
                              placeholder="选择与目标值关系" 
                            >
                              <el-option 
                                v-for="item in relation_option" 
                                :key="item.value" 
                                :label="item.text" 
                                :value="item.value">
                  
                              </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="weight"
                        label="分值"
                        width="100"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <el-input
                                :disabled="inputDisabled"
                                v-if="scope.row.targetvaluestype === 1"
                                v-model="scope.row.topScore"
                                type="number"
                                size="small"
                            ></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="weight"
                        label="操作"
                        align="center"
                        v-if="adjustmentRatioVisibel"
                    >
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.targetvaluestype === 1" type="primary" @click="partAdjustmentRatio(scope.row)">调整</el-button>
                            <el-switch
                              @change="basisTreeUpdata(scope.row)"
                              v-if="scope.row.children.length === 0"
                              v-model="scope.row.state"
                              active-color="#13ce66"
                              inactive-color="#ff4949"
                              :active-value="1"
                              :inactive-value="0">
                            </el-switch>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>

            <el-button
                style="margin-top: 12px"
                :disabled="previousDisable"
                @click="stepChange('p')"
                >上一步</el-button
            >
            <el-button
                style="margin-top: 12px"
                :disabled="nextDisable"
                @click="stepChange('n')"
                >下一步</el-button
            >
            <el-button
                style="margin-top: 12px"
                :disabled="completeDisable"
                @click="submitTarget"
                >完成</el-button
            >
        </el-dialog>
    </div>
</template>

<script>
import waves from "@/directive/waves";
import {
  getAimConfigDataByYear,
  getAimConfigYearList,
  getAimTargets,
  AimConfigDataModifyState,
  generateAimconfig,
  AimConfigDataAdjust,
  AimConfigDataAdjustForEntity,
  updateAimConfigDataStep
} from "@/api/aim";
import { formatDate } from "@/utils/date";
export default {
  name: "AimConfig",
  components: {},
  directives: { waves },
  computed:{

  },
  data() {
    return {
      year: "", //选中的年度
      clickValue: "", //树状列表中被点击的子项
      treeData: [], //树状列表
      defaultProps: {
        children: "children",
        label: "indicator"
      },

      dialogVisible: false, //是否显示生成年度目标步骤框
      stepActive: 0, //步骤中活跃的下标
      previousDisable: true, //上一步按钮是否禁用
      nextDisable: false, //下一步按钮是否禁用
      completeDisable: true, //完成按钮是否禁用

      basicInfoVisible: false,
      weightInfoVisible: false,

      previousYearVisible: true, //历届年份下拉是否显示
      previousYears: [], //历届年份下拉表数组
      previousYear: "",

      basisTreeData: [], //依据树状数据
      yearBasis: 1,
      tableData: [],

      weightInfoTreeData: [],  //权重信息树状数据

      adjustmentRatio: 0,  //调整比率
      adjustmentRatioVisibel: true, //调整比率显示控制
      adjustmentYear:'',
      inputDisabled:false,

      weightInfoLoading: false,
      relation_option:[
          {value:"0",text:"大于"},
          {value:"1",text:"大于等于"},
          {value:"2",text:"等于"},
          {value:"3",text:"小于等于"},
          {value:"4",text:"小于"}
        ],
    };
  },
  created() {},
  mounted() {
    this.initTreeData();
    this.initPreviousYears();
  },
  methods: {
    createTarget(){
      this.dialogVisible = true
      if (this.stepActive === 2) {
        //第三页
        this.inputDisabled = true
        this.adjustmentRatioVisibel = false;
        this.basicInfoVisible = false;
        this.nextDisable = true;
        this.completeDisable = false;
      } else if (this.stepActive === 0) {
        //第一页
        this.previousDisable = true;
        this.basicInfoVisible = true;
        this.weightInfoVisible = false;
      } else {
        //第二页

        //步骤页的切换
        this.weightInfoLoading = true
        this.weightInfoVisible = true;
        this.basicInfoVisible = false;

        //阻止上下步的点击
        this.previousDisable = true
        this.nextDisable = true;

        //获取权重信息数据
        generateAimconfig(this.previousYear + '').then((res) => {
            if(res.status === 200){
                this.weightInfoTreeData = res.data.children
                this.adjustmentRatio = res.data.adjustrate
                this.adjustmentYear = res.data.yeartemp

                //调整框可编辑
                this.inputDisabled = false
                this.adjustmentRatioVisibel = true
                this.nextDisable = false;
                this.previousDisable = false;
                this.completeDisable = true;
                this.weightInfoLoading = false

            }
        })  

      }
    },
    //列表树年度变化
    yearChangeHandle() {
      this.initTreeData();
    },
    initPreviousYears() {
      getAimConfigYearList().then(res => {
        if (res.status === 200) {
          this.previousYears = res.data;
        }
      });
    },

    //{树状数据相关}
    initTreeData() {
      let nowDate = new Date();
      let year = nowDate.getFullYear();
      if (this.year !== "") {
        year = this.year;
      }

      getAimConfigDataByYear(year).then(res => {
        if (res.status === 200) {
          this.treeData = res.data.children;
        }
      });
    },
    renderContent(h, { node, data, store }) {
      // 需要一个level  第三层不显示
      if (data.levelId == -1) {
        return (
          <span class="custom-tree-node">
            <span>{node.label}</span>
          </span>
        );
      } else {
        if (data.hasBasis == 1 || data.levelId == 2) {
          return (
            <span class="custom-tree-node">
              <span>{node.label}</span>
              <span>=</span>
              <span>{node.id}</span>
            </span>
          );
        } else {
          return (
            <span class="custom-tree-node">
              <span>{node.label}</span>
            </span>
          );
        }
      }
    },
    // 点击树形节点
    treeHandleNodeClick(data) {
      this.clickValue = data.indicator;
    },

    //{生成年度目标相关}
    stepChange(sign) {
      //上一页
      if (sign === "p") {
        if (this.stepActive-- <= 0) this.stepActive = 0;
      }
      //下一页
      if (sign === "n") {
        if (this.stepActive++ >= 2) this.stepActive = 2;
      }

      if (this.stepActive === 2) {
        //第三页
        this.inputDisabled = true
        this.adjustmentRatioVisibel = false;
        this.basicInfoVisible = false;
        this.nextDisable = true;
        this.completeDisable = false;
      } else if (this.stepActive === 0) {
        //第一页
        this.previousDisable = true;
        this.basicInfoVisible = true;
        this.weightInfoVisible = false;
      } else {
        //第二页

        //步骤页的切换
        this.weightInfoLoading = true
        this.weightInfoVisible = true;
        this.basicInfoVisible = false;

        //阻止上下步的点击
        this.previousDisable = true
        this.nextDisable = true;

        //获取权重信息数据
        generateAimconfig(this.previousYear + '').then((res) => {
            if(res.status === 200){
                this.weightInfoTreeData = res.data.children
                this.adjustmentRatio = res.data.adjustrate
                this.adjustmentYear = res.data.yeartemp

                //调整框可编辑
                this.inputDisabled = false
                this.adjustmentRatioVisibel = true
                this.nextDisable = false;
                this.previousDisable = false;
                this.completeDisable = true;
                this.weightInfoLoading = false

            }
        })  

      }
    },
    //年度依据变化
    basicYearChange(value) {
      this.basisTreeData = [];
      this.previousYear = "";
      if (value === 2) {
        this.previousYear = 1900
        this.previousYearVisible = false;
        //获取目标库数据
        getAimTargets().then(res => {
          if (res.status === 200) {
            this.basisTreeData = res.data.children;
          }
        });
      } else {
        this.previousYearVisible = true;
      }
    },
    previousYearChange(value) {
        this.previousYear = value
      getAimConfigDataByYear(value).then(res => {
        if (res.status === 200) {
          this.basisTreeData = res.data.children;
        }
      });
    },

    submitTarget() {
        this.weightInfoTreeData = []
        this.basisTreeData = []
        this.dialogVisible = false
        this.basicInfoVisible = false
        this.weightInfoVisible = false
        this.previousYear = ''
        this.stepActive = 0



        this.previousDisable =  true
        this.nextDisable = false
        this.completeDisable= true

        this.previousYearVisible = true, //历届年份下拉是否显示

        this.adjustmentRatio = 0 
        this.adjustmentRatioVisibel = true
        this.inputDisabled = false

        this.yearBasis = 1

        this.initPreviousYears()

        updateAimConfigDataStep(this.adjustmentYear, 0).then((res) => {
          if(res.status === 200){
            this.$notify({
						title: '成功',
						message: res.msg,
						type: 'success',
						duration: 3000
					}) 
          }
        })

    },
    //渲染依据树状数据
    basisRenderContent(h, { node, data, store }) {
      // 需要一个level  第三层不显示
      if (data.levelId == -1) {
        return (
          <span class="custom-tree-node">
            <span>{node.label}</span>
          </span>
        );
      } else {
        if (data.hasBasis == 1 || data.levelId == 2) {
          return (
            <span class="custom-tree-node">
              <span>{node.label}</span>
              <span>{data.state}</span>
            </span>
          );
        } else {
          return (
            <span class="custom-tree-node">
              <span>{node.label}</span>
            </span>
          );
        }
      }
    },
    //停用
    basisTreeUpdata(data) {
      AimConfigDataModifyState(data).then(res => {
        if(res.status === 200){
            this.$notify({
						title: '成功',
						message: res.msg,
						type: 'success',
						duration: 3000
					})         
          }
         //获取权重信息数据
        // generateAimconfig(this.previousYear + '').then((res) => {
        //     if(res.status === 200){
        //         this.weightInfoTreeData = res.data.children
        //         this.adjustmentRatio = res.data.adjustrate
        //         this.adjustmentYear = res.data.yeartemp

        //         //调整框可编辑
        //         this.inputDisabled = false
        //         this.adjustmentRatioVisibel = true
        //         this.nextDisable = false;
        //         this.previousDisable = false;
        //         this.completeDisable = true;
        //         this.weightInfoLoading = false

        //     }
        // }) 
      });
    },

    //整体调整按钮的点击
    adjustmentRatioSubmit(){
        AimConfigDataAdjust(this.adjustmentYear, this.adjustmentRatio).then((res) => {
            if(res.status === 200)
            {
                //获取权重信息数据
                generateAimconfig(this.previousYear + '').then((res) => {
                  if(res.status === 200){
                  this.weightInfoTreeData = res.data.children
                  this.adjustmentRatio = res.data.adjustrate
                  this.adjustmentYear = res.data.yeartemp

                  //调整框可编辑
                  this.inputDisabled = false
                  this.adjustmentRatioVisibel = true
                  this.nextDisable = false;
                  this.previousDisable = false;
                  this.completeDisable = true;
                  this.weightInfoLoading = false

                }
        })  
            }
        })
    },
    //部分调整的点击
    partAdjustmentRatio(data){
        AimConfigDataAdjustForEntity(data).then((res) => {
          if(res.status === 200){
            this.$notify({
						title: '成功',
						message: res.msg,
						type: 'success',
						duration: 3000
					})         
          }
        })
    },

    dialogClose(){
        this.dialogVisible = false
        
    }
  }
};
</script>
<style lang="scss">
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

.aimConfig {
  display: flex;
  .left {
    width: 60%;
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
</style>
