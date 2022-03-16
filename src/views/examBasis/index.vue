<template>
<div class="app-container examBasis">
  <div class="left">
    <el-card class="box-card">
       <el-tree  class="flow-tree" :data="treeData" node-key="id" :default-expand-all="true" :expand-on-click-node="false" accordion :render-content="renderContent" @node-click="treeHandleNodeClick" :props="defaultProps">
    </el-tree>
    </el-card>
  </div>
  <div class="right">
     <el-card class="box-card" v-if="treeLevel" v-loading="loading">
      <div class="addParent"><el-button type="primary" icon="el-icon-plus" size="small" @click="basisAppend('')" v-waves>添加依据</el-button></div>
      <el-table :data="list" style="width: 100%">
      <el-table-column width="250px" prop="name" label="依据名称">
      </el-table-column>
      <el-table-column align="center" prop="scoringMethodText" label="评分方法">
      </el-table-column>
      <el-table-column prop="bnsDataItemName" label="依据数据来源" align="center">
        <template slot-scope="scopeData">
          <el-button @click="setDataSources(scopeData.row,'sources')" type="text" size="small">
           {{scopeData.row.bnsDataItemName}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="operator" align="center">
        <template slot-scope="scope">
          <el-button @click="basisAppend(scope.row.id)" type="text" size="small">
            修改
          </el-button>
          <el-button @click="handleDel(scope.row)" type="text" size="small">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    </el-card>
  </div>
  <!-- 编辑树形弹窗 -->
    	<el-dialog 
			:title="treeForm.treeNextTitle" 
			:show-close="showClose"
			:close-on-click-modal="false"
			:visible.sync="treeShow">
      <el-form 
				ref="treeForm"
				:model="treeForm" 
				label-position="right" 
				label-width="100px" 
			>
        <el-row>
          <el-col :span="12">
            <el-form-item label="上级指标:" prop="parentName">
              <el-input 
                v-model.trim="treeForm.parentName" 
                placeholder=""
                style="width: 200px;"
                disabled>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上级编码:" prop="parent">
              <el-input 
                v-model.trim="treeForm.parent" 
                placeholder=""
                style="width: 200px;"
                disabled>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
         <el-row>
          <el-col :span="12">
            <el-form-item label="本级指标:" prop="indicator">
              <el-input 
                v-model.trim="treeForm.indicator" 
                placeholder="请输入内容"
                style="width: 200px;">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="排列序号:" prop="order_no">
              <el-input 
                v-model.trim="treeForm.order_no" 
                placeholder="请输入内容"
                type="number"
                style="width: 200px;">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
           
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="设定依据标志:" prop="hasBasis" label-width="180">
              <el-radio-group v-model="treeForm.hasBasis" size="small">
                <el-radio label="1" border>是</el-radio>
                <el-radio label="0" border>否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
             <el-form-item label="责任科室:" prop="department" v-if="treeForm.hasBasis == 1">
               	<el-select 
                v-model="treeForm.department" 
                filterable clearable 
                placeholder="选择或输入科室" 
              >
                <el-option 
                  v-for="item in departmentList" 
                  :key="item.id" 
                  :label="item.name + '_' + item.type" 
                  :value="item.id">
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">
                    {{ item.type }}
                  </span>
                </el-option>
              </el-select>
				  </el-form-item>
          </el-col>
        </el-row>
         <el-row>
          <el-col :span="24">
            <el-form-item label="指标描述:" prop="remark">
              <el-input
                type="textarea"
                placeholder="请输入内容"
                v-model="treeForm.remark"
                maxlength="300"
                show-word-limit
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button 
					@click="closeDialog"
					class="guo-btn yellow-btn">
					返 回
				</el-button>
				<el-button 
					type="primary"
					@click="treeSave"
					:loading="loading"
					class="guo-btn light-blue-btn">
					保 存
					</el-button>
			</div>
		</el-dialog>
    <!-- 配置数据来源 -->
    	<el-dialog 
			:title="sourcesDialogTitle" 
			:show-close="showClose"
			:close-on-click-modal="false"
			:visible.sync="sourcesShow">
      <el-radio v-model="sourcesType" label="1">录入</el-radio>
      <el-radio v-model="sourcesType" label="2">接口</el-radio>
			<el-radio v-model="sourcesType" label="3">公式</el-radio>
      <div v-if="sourcesType == 2" class="sourcesForm">
      <el-row>
        <el-col :span="24">
            <el-select 
              v-model="sourcesName" 
              filterable clearable 
              placeholder="请输入查询内容"
              class="searchClass">
                <el-option 
                  v-for="item in sourcesNameParams" 
                  :key="item.id" 
                  :label="item.name" 
                  :value="item.id">
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">
                    {{ item.type }}
                  </span>
                </el-option>
            </el-select>
          </el-col>
        </el-row>
      </div>
			<div v-else-if="sourcesType == 3" class="sourcesForm">
				<el-select
				  v-model="sourcesName" 
				  filterable clearable 
				  placeholder="请输入公式名称"
				  class="searchClass">
				    <el-option 
				      v-for="item in sourcesFormFormula" 
				      :key="item.id" 
				      :label="item.name" 
				      :value="item.id">
				      <span style="float: left">{{ item.name }}</span>
				      <span style="float: right; color: #8492a6; font-size: 13px">
				        {{ item.type }}
				      </span>
				    </el-option>
				</el-select>
				
			</div>
			
			<div slot="footer" class="dialog-footer">
				<el-button 
					@click="closeDialog"
					class="guo-btn yellow-btn">
					返 回
				</el-button>
				<el-button
					type="primary"
					@click="sourcesSave"
					:loading="loading"
					class="guo-btn light-blue-btn">
					保 存
					</el-button>
			</div>
		</el-dialog>
    <!-- 添加/修改依据 -->
    <el-dialog
      :title="basisTitle"
      :visible.sync="basisShow"
      :show-close="false"
      width="95%">
      <AddBasis :basisId="basisId" :targetId="targetId" @getList="getList" @closeDialog="closeDialog" v-if="basisShow" />
    </el-dialog>
</div>
</template>

<script>
import waves from "@/directive/waves";
import {
  getBasisList,
  getExamTargets,
  getBaseDepartment,
  addTargetDataSource,
  getExamTarget,
  addBasisDataSource,
  deleteExamBasis,
  saveExamTarget,
  deleteExamTarget
} from "@/api/exam";
import {getHandleItemParam, getInterfaceItemParamWithJK } from '@/api/bnsDataItemReport'
import { getFormulaParam } from '@/api/bnsFormula'
import { getDepartmentParam	} from '@/api/department'
import EditDialog from "./components/EditDialog";
import AddBasis from "./addBasis";
export default {
  name: "Basis",
  components: {
    EditDialog,
    AddBasis
  },
  directives: {
    waves
  },
  data() {
    return {
      list: [],
      total: 0,
      loading: false,
      treeData: [],
      defaultProps: {
        children: "children",
        label: "indicator"
      },
      showClose: false,
      treeShow: false,
      treeForm: {
        parentName: "", //上级指标
        parent: "", //上级编码
        id: "", //本级id  本级编码
        indicator: "", //本级指标名
        order_no: "", //序列
        department: "", //责任科室
        hasBasis: "0", //设定依据标志  0否 1是
        remark: "", //指标描述
        from: "",
        treeNextTitle:'', //树形添加下一级title 
      },
      treeLevel: false,
      departmentList: [],
      kariParent: {},
      sourcesShow: false,
      sourcesForm: {},
      sourcesType: "",
      sourcesName: "",
      sourcesNameParams:[],
			sourcesFormFormula: [],  // 公式来源
      targetId:'',   //指标id
      sourcesId:'',  //依据id
      type:'',        //区分是指标的数据源还是依据数据源
      basisShow:false,
      basisId:'',
      basisTitle:'',
      sourcesDialogTitle:'',  //配置数据来源dialogTitle
       
    };
  },

  mounted() {
    this.initTreeData();         //指标树
    this.getBaseDepartment();    //责任科室
    this.getHandleItemParams();  //因子列表
		this.getFormulaParams();	//公式列表
  },
  methods: {
    // 此处开始
    initTreeData() {
      getExamTargets().then(res => {
        this.treeData = [res.data];
      });
    },
    getBaseDepartment() {
      // 责任科室接口
      getDepartmentParam().then(res => {
					this.departmentList = res.data;
			})
    },

    // 获取因子列表数据
    getHandleItemParams() {
				getInterfaceItemParamWithJK({
              bnsDataItem: this.sourcesName,
              userID: this.$store.getters.userID
        }).then(res => {
					this.sourcesNameParams = res.data
				})
			},
		// 获取公式参数列表
		getFormulaParams() {
			getFormulaParam().then(res => {
				this.sourcesFormFormula = res.data
			})
		},
    // 获取右侧列表数据
    getList() {
      // console.log(this.targetId);
      this.loading = true;
      getBasisList({
        examTargetId:this.targetId
      }).then(res => {
        this.loading = false;
        this.list = res.data;
      });
    },
    renderContent(h, { node, data, store }) {
      // 需要一个level  第三层不显示
      // console.log(data.levelId)
      if(data.levelId == -1){
        return (
          <span class="custom-tree-node">
            <span>{node.label}</span>
            <span>
              <el-button
                size="mini"
                type="text"
                on-click={() => this.treeAppend(data)}
              >
                添加下一级
              </el-button>
              <el-button
                size="mini"
                type="text"
                on-click={() => this.treeUpdata(data)}
              >
                修改
              </el-button>
            </span>
          </span>
        );

      }else{
      if(data.hasBasis == 1 || data.levelId == 2){
        return (
          <span class="custom-tree-node">
            <span>{node.label}</span>
            <span>
              <el-button
              size="mini"
              type="text"
              on-click={() => this.setDataSources(data,'target')}
              class="setingButton"
            >
              配置数据来源
            </el-button>
              <el-button
                size="mini"
                type="text"
                on-click={() => this.treeUpdata(data)}
              >
                修改
              </el-button>
              <el-button
                size="mini"
                type="text"
                on-click={() => this.treeRemove(node, data)}
              >
                删除
              </el-button>
            </span>
          </span>
        );
      }else{
        return (
          <span class="custom-tree-node">
            <span>{node.label}</span>
            <span>
              <el-button
                size="mini"
                type="text"
                on-click={() => this.treeAppend(data)}
              >
                添加下一级
              </el-button>
              <el-button
                size="mini"
                type="text"
                on-click={() => this.treeUpdata(data)}
              >
                修改
              </el-button>
              <el-button
                size="mini"
                type="text"
                on-click={() => this.treeRemove(node, data)}
              >
                删除
              </el-button>
            </span>
          </span>
        );
      }
      }
    },
    // 添加下一级
    treeAppend(data) {
      // 阻止事件冒泡
      window.event.stopPropagation();
      // 添加,此处弹出弹窗      *上级为本级的东西
      this.treeShow = true;
      this.treeForm.parentName = data.indicator;
      this.treeForm.parent = data.id;
      this.treeForm.levelId = data.levelId;
      this.treeForm.from = "add";

      this.treeForm.id = null;
      this.treeForm.indicator = "";
      this.treeForm.order_no = "";
      this.treeForm.department = "";
      this.treeForm.hasBasis = "0";
      this.treeForm.remark = "";
      this.treeForm.treeNextTitle = data.indicator + '（添加）';
      // console.log(this.treeForm);
    },

    // 通过id删选出父级的原数据
    filterInitialData(data, id) {
      const obj = data.filter((item, index, self) => {
        if (item.id === id) {
          this.kariParent = item;
        } else {
          if (item.children && item.children.length) {
            this.filterInitialData(item.children, id);
          }
        }
      });
    },
    setDataSources(data,type) {
      // 阻止事件冒泡
      window.event.stopPropagation();
      this.sourcesShow = true;

      this.type = type;
      if(type == 'target'){
        // 查询指标的数据源
        this.targetId = data.id;
        this.sourcesDialogTitle = `配置数据来源(${data.indicator})`;
        this.getExamTarget();
      }else{
        // 查询依据的数据源
        this.sourcesId = data.id;
        this.sourcesType = String(data.dataSourceType);
        this.sourcesName = data.bnsDataItem;
        this.sourcesDialogTitle = `配置数据来源(${data.name})`;
      }
    },
    // 查询指标的数据源
    getExamTarget(){
      getExamTarget({
        targetId:this.targetId
      }).then(res=>{
        this.sourcesType = String(res.data.dataSourceType);
        this.sourcesName = res.data.bnsDataItem;
      })
    },
    // 修改
    treeUpdata(data) {
      // 阻止事件冒泡
      window.event.stopPropagation();
      // console.log(data);
      this.treeShow = true;
      this.filterInitialData(this.treeData, data.parent);
      this.treeForm.parentName = this.kariParent.indicator;
      this.treeForm.parent = data.parent;
      this.treeForm.id = data.id;
      this.treeForm.indicator = data.indicator;
      this.treeForm.order_no = data.orderNo;
      this.treeForm.department = data.department;
      this.treeForm.hasBasis = String(data.hasBasis);
      this.treeForm.remark = data.remark;
      this.treeForm.levelId = data.levelId;
      this.treeForm.from = "edit";
      this.treeForm.treeNextTitle = data.indicator + '（修改）';
    },
    treeRemove(node, data) {
      // 阻止事件冒泡
      window.event.stopPropagation();
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      this.$confirm("此操作将永久删除此项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteExamTarget({
            "id": data.id, //指标ID
          }).then(res=>{
            children.splice(index, 1);
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.treeShow = false;
            this.setInitPage();
          })

        })
        .catch(() => {
        });
    },
    // 指标有变动更新
    setInitPage(){
      this.initTreeData(); 
      this.treeLevel = false;
      this.list = [];
    },
    // 点击树形节点
    treeHandleNodeClick(data) {
      // console.log(data)
      if (data.hasBasis == 1 && data.children == '') {
        this.treeLevel = true;
        this.targetId = data.id;
        this.basisTitle = data.indicator;
        this.getList();
      } else {
        this.treeLevel = false;
      }
    },
    closeDialog() {
      this.treeShow = false;
      this.sourcesShow = false;
      this.basisShow = false;
    },
    treeSave() {
      let data = {
        "id": this.treeForm.id, // 新增时为null,更新时为被更新数据的ID
        "indicator": this.treeForm.indicator, // 指标内容
        "parent":this.treeForm.parent, // 上级指标ID
        "department": this.treeForm.department, // 评分科室ID
        "operator": this.$store.getters.userID, // 登录帐号的ID
        "levelId": this.treeForm.levelId,   //树级别 0：一级，1：二级，2：三级
        "hasBasis": this.treeForm.hasBasis, //是否有依据  0 没有 1有
        "remark":this.treeForm.remark, //指标描述
        "orderNo": this.treeForm.order_no, //排序
      }
      saveExamTarget(data).then(res=>{
        this.treeShow = false;
        this.setInitPage();
      })
    },
    handleDel(data) {
      // console.log(this.targetId)
    this.$confirm("此操作将永久删除此项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteExamBasis({
          id: data.id, 
          }).then(res=>{
            this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getList();
          })
        }).catch(() => {});
    },
    basisAppend(id) {
      this.basisShow = true;
      this.basisId = id;
      // if(id){
      //   this.basisTitle = '修改依据';
      // }else{
      //   this.basisTitle = '添加依据';
      // }
    },
    sourcesSave() {
      let data= {};
      let bnsDataItem 
			const sourceType = this.sourceType
			bnsDataItem = this.sourceType === 1 ? null : this.sourcesName
      if(this.type == 'target'){
        // 指标的数据源配置保存
        data ={
                id: this.targetId, // 指标ID
                dataSourceType: this.sourcesType, //数据来源类型（1.录入，2.接口、3.公式）
                bnsDataItem: bnsDataItem, //当数据来源类型是接口时，此字段代表选择的因子ID、公式ID，录入时为null
              }
        addTargetDataSource(data).then(res=>{
          this.sourcesShow = false;
          this.setInitPage();
        })
      }else{
        // 依据的数据源配置保存
        data = {
          id: this.sourcesId, // 依据ID
          dataSourceType: this.sourcesType, //数据来源类型（1.录入，2.接口）
          bnsDataItem: bnsDataItem, //当数据来源类型是接口时，此字段代表选择的因子ID、公式ID，录入时为null
          }
        addBasisDataSource(data).then(res=>{
          this.sourcesShow = false;
          this.getList();
        })
      }
    },
  }
};
</script>

<style lang="scss">
.examBasis {
  .addParent {
    padding: 5px 0;
    padding-right: 6px;
    text-align: right;
  }
  display: flex;
  display: -webkit-flex;
  .left {
    width: 40%;
  }
  .right {
    width: 60%;
    // max-height: 700px;
    // overflow-y: auto;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .sourcesForm {
    padding: 20px 0;
  }
  .setingButton{
    color:#E6A23C;
  }
  .flow-tree{
        overflow:auto;
        flex:1;
        height:600px;
        margin:10px;
        >>>.el-tree-node{
            > .el-tree-node__children{
                overflow: visible !important
            }
        }
    }
}
</style>
