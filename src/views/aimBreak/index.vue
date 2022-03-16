<template>
    <div class="app-container">
        <div class="filter-container">
            <span class="demonstration">年度</span>
            <el-date-picker v-model="year" type="year" value-format="yyyy" placeholder="选择年" @change="yearChangeHandle" class="searchClass">
            </el-date-picker>
            <!-- <el-button type="primary" icon="el-icon-plus" size="small" @click="targetBreak()" v-waves>目标分解</el-button> -->
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
                        :render-content="renderContent" 
                        :props="defaultProps"
                        >
                    </el-tree>
                </el-card>
            </div>
            <div class="right">
                <el-card class="box-card">
                    <el-table :data="tableData" style="width: 100%">
                        <el-table-column prop="deptName" label="科室" width="180">
                        </el-table-column>
                        <el-table-column prop="year" label="年度" width="180">
                        </el-table-column>
                        <el-table-column prop="departmentValue" label="科室全年目标">
                        </el-table-column>
                        <el-table-column prop="targetName" label="总目标名称">
                        </el-table-column>
                        <el-table-column prop="fullTarget" label="总目标">
                        </el-table-column>
                        <el-table-column prop="" label="操作">
                            <template slot-scope="scope">
                                <el-button @click="handleDistribute(scope.row)" type="text" size="small">派发/取消派发</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </div>
        </div>

        <!-- 目标分解框 -->
        <el-dialog title="目标分解" :visible.sync="dialogVisible" width="80%" :before-close="targetBreakClose">
            <div>
                <div class="break_box_header">
                    <div>目标信息 {{selectedTarget.indicator}}</div>
                    <div v-if="selectedTarget.targetValuesType === 0">等于</div>
                    <div v-if="selectedTarget.targetValuesType === 0">目标值 {{selectedTarget.targetvalues}}</div>
                    <div v-if="selectedTarget.targetValuesType === 1">目标值 {{selectedTarget.tagetValuesSelect === 1 ? '有' : '无'}}</div>
                    <div>目标年度 {{year}}</div>
                </div>

                <div class="break_box_main">
                    <div class="break_box_main_department">
                        <div class="break_box_main_department_header">
                            <p>科室模板选择</p>
                            <p>已选择{{selectedDepartmentNum}}个科室</p>
                        </div>
                        <div class="break_box_main_department_tree">
                            <el-input class="department_tree_filter_input" placeholder="请输入您要查找的科室" v-model="filterText">
                            </el-input>
                            <el-tree   :default-checked-keys="defaultCheckedDepartment"
 :data="departmentData" show-checkbox node-key="id" ref="departmentTree" :props="departmentProps" :filter-node-method="filterNode" @check-change="departmentCheckChange">
                            </el-tree>
                        </div>
                    </div>

                    <div class="break_box_main_table">
                        <el-table :data="departmentTableData" border style="width: 100%">
                            <el-table-column prop="deptName" label="科室"> </el-table-column>
                            <el-table-column prop="" label="关系">  <template slot-scope="scope" v-if="selectedTarget.targetValuesType === 1">
                                    <span>=</span>
                                </template> </el-table-column>
     
                            <el-table-column prop="departmentValue" label="科室全年目标">
                                <template slot-scope="scope" v-if="selectedTarget.targetValuesType === 0">
                                    <el-input v-model.number="scope.row[scope.column.property]" size="mini">
                                    </el-input>
                                </template>
                                <template slot-scope="scope" v-if="selectedTarget.targetValuesType === 1">
                                    <span>{{selectedTarget.tagetValuesSelect === 1 ? '有' : '无'}}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>

                <div class="break_box_footer">
                    <el-button @click="submitTargetBreak">保存</el-button>
                    <el-button @click="targetBreakClose">取消</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import waves from "@/directive/waves";
import {
  getAimConfigDataByYear,
  getDissociationListByAimId,
  getDeptTree,
  saveDissociation
} from "@/api/aim";
import { formatDate } from "@/utils/date";
import AppVue from "../../App.vue";
export default {
  name: "AimConfig",
  components: {},
  directives: { waves },

  watch: {
    filterText(val) {
      this.$refs.departmentTree.filter(val);
    }
  },
  data() {
    return {
      selectedDepartmentNum: 0,
      filterText: "",
      dialogVisible: false, //是否显示分解dialog

      year: "", //选中的年度
      selectedTarget: {},
      treeData: [], //树状列表
      defaultProps: {
        children: "children",
        label: "indicator"
      },

      tableData: [], //查看当前目标的分解状态数据

      departmentData: [],
      departmentProps: {
        children: "children",
        label: "name"
      },

      departmentTableData: [],
      // 默认选中的科室id
      defaultCheckedDepartment: [],
      // 默认选中的科室数据
      defaultDepartmentData: [],
    };
  },
  created() {},
  mounted() {
    this.initTreeData();
  },
  methods: {
    yearChangeHandle() {
      this.initTreeData();
    },

    // 初始化数据
    initTreeData() {
      getAimConfigDataByYear(this.year).then(res => {
        this.treeData = [res.data];
        this.basisTreeData = [res.data];
      });
      getDeptTree({ assessed: 1, fuzzy: "" }).then(res => {
        this.departmentData = res.data;
      });
    },

    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 渲染 目标列表
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
              <span on-click={() => this.setDataSources(data, "target")}>
                {node.label}
              </span>
              <button on-click={() => this.showBreakDialog(data)}>
                点击分解
              </button>
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

    // 获取 目标分解数据事件
    setDataSources(data, action) {
      getDissociationListByAimId(data.id).then(res => {
            this.tableData = res.data.items
            this.tableData.forEach(item => {
                item.year = this.year
                item.fullTarget = data.targetvalues
                item.targetName = data.indicator
            })
      });
    },

    showBreakDialog(data) {
      this.dialogVisible = true;
      this.selectedTarget = data;
      console.log(data)
      getDissociationListByAimId(data.id).then(res => {
            this.departmentTableData = res.data.items
            this.defaultDepartmentData = res.data.items
            this.departmentTableData.forEach(item => {
                this.defaultCheckedDepartment.push(item.departmentId)
            })
            this.selectedTarget.tagetValuesSelect = res.data.tagetValuesSelect
            this.selectedTarget.targetValuesType = res.data.targetValuesType
            this.$nextTick(() => {
                this.$refs.departmentTree.setCheckedKeys(this.defaultCheckedDepartment);
            });
      });
    },

    // 目标分解框关闭事件
    targetBreakClose() {
      this.$confirm("确认关闭？")
        .then(_ => {
          this.dialogVisible = false;
          this.defaultCheckedDepartment = []
          this.defaultDepartmentData = []
          this.departmentTableData = []
        })
        .catch(_ => {});
    },

    makeDepartmentTableData() {
      let departmentTableData = [];
      let selected = this.$refs.departmentTree.getCheckedNodes(true, false);

      selected.map((item, index) => {
        if (!item.children) {
            if (this.defaultCheckedDepartment.includes(item.id))
            {
                this.defaultDepartmentData.forEach(department => {
                    if (department.departmentId === item.id)
                    {
                        departmentTableData.push(department)
                    }
                })
            }
            else
            {
                departmentTableData.push({
                    departmentId: item.id,
                    deptName: item.name,
                    departmentValue: 0
                });
            }
        }
      });
      this.departmentTableData = departmentTableData
    },

    departmentCheckChange() {
      let selected = this.$refs.departmentTree.getCheckedNodes(true, false);
      this.selectedDepartmentNum = selected.length;
      this.makeDepartmentTableData();
    },

    submitTargetBreak() {
      let totalTarget = 0;
      this.departmentTableData.forEach(item => {
        totalTarget = item.departmentValue + totalTarget;
      });
      if (totalTarget === this.selectedTarget.targetvalues) {
        let data = {
          dissociation: {
            aimId: this.selectedTarget.id,
            aimTotalValue: this.selectedTarget.targetvalues,
            aimYear: this.year,
            indicator: this.indicator,
            items: this.departmentTableData
          }
        };
        saveDissociation(data).then(res => {
           if (res.status === 200) {
              this.$message({
                type: "success",
                message: "保存成功!"
              });
            }
            else{
                his.$message({
                type: "error",
                message: "保存失败!"
              });
            }
            this.dialogVisible = false;

        });
      } else {
        this.$message({
          message: "目标总值不等",
          type: "error"
        });
      }
    },

    // 派发处理
    handleDistribute() {}
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
    width: 40%;
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

.break_box_header {
  font-size: 20px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid black;
  padding: 10px 0;
}
.break_box_main {
  margin-top: 20px;

  display: flex;
  justify-content: space-between;
  .break_box_main_department {
    width: 50%;
    height: 600px;
    overflow: auto;
    border: 1px solid rgba($color: #000000, $alpha: 0.1);
    .break_box_main_department_header p:nth-child(1) {
      font-size: 20px;
      text-align: center;
    }
    .break_box_main_department_header p:nth-child(2) {
      width: 90%;
      padding: 5px 10px;
      margin: 0 auto;
      text-align: right;
      border-bottom: 1px solid rgba($color: #000000, $alpha: 0.5);
    }
    .break_box_main_department_tree {
      padding: 20px;
    }
    .department_tree_filter_input {
      width: 50%;
    }
  }

  .break_box_main_table {
    width: 40%;
    height: 600px;
    overflow: auto;
  }
}
.break_box_footer {
  text-align: center;
  margin-top: 20px;
}
</style>
