<template>
	<div id="assigneeDialog" style="height: 650px; width: 1500px; ">
		<el-dialog 
			customClass="customWidth"
			:title="dialogStatus" 
			:show-close="showClose"
			:close-on-click-modal="false"
			:visible.sync="visible"
			@close="closeDialog" >
			
	
					<el-date-picker
						v-model="yearmonth"
						type="month"
						placeholder="选择调整年月"
						format="yyyy 年 M 月"
						value-format="yyyy-MM"
						:clearable="false"
						:editable="false"
					
						class="searchClass" >
					</el-date-picker>
	
			<el-tooltip 
				class="item" effect="dark" 
				content="新增收入调整" placement="top">
				<el-button 
					type="primary" 
					icon="el-icon-plus" size="mini" 
					@click="addNewAssignee" 
					plain circle>
				</el-button>
			</el-tooltip>
			<el-button v-waves type="primary" size="mini" @click="handleSave" round>
				保存
			</el-button>
			&nbsp;
			<label class="filter-container-right-label">调增总金额</label><label class="filter-container-right-label-num">{{sumAdd}}</label>
			&nbsp;&nbsp;&nbsp;&nbsp;
			<label class="filter-container-right-label">调减总金额</label><label class="filter-container-right-label-num">{{sumSub}}</label>
			<el-table 
				:loading="loading" 
				:data="assigneeList" 
				fit stripe highlight-current-row style="width:1400px"
        height="450" useVirtual>
				<el-table-column
					label="序号"
					type="index"
					width="50"
					align="center">
				<template slot-scope="scope">
						<span>{{ scope.$index + 1}}</span>
				</template>
				</el-table-column>
				<el-table-column label="收入类别">					
					<template slot-scope="scope">
						<el-select 
							v-if="scope.row.edit"
							v-model="scope.row.incomeType" 
							filterable 
							placeholder="请选择收入类别">
							<el-option
								v-for="item in sflbParams"
								:key="item.id"
								:label="item.name"
								:value="item.id">
							</el-option>
						</el-select>
						<!-- <span v-else>{{ scope.row.hospName }}</span> -->
					</template>
				</el-table-column>
				
			   <el-table-column label="调增科室">
			    <template slot-scope="scope">
			      <el-select 
							v-if="scope.row.edit"
			      	v-model="scope.row.deptmentId1" 
							filterable 
			      	placeholder="请选择调增科室">
			      	<el-option 
							v-for="item in departmentParams" 
							:key="item.id" 
							:label="item.name + '_' + item.fplb" 
							:value="item.id">
							<span style="float: left">{{ item.name }}</span>
							<span style="float: right; color: #8492a6; font-size: 13px">
								{{ item.fplb }}
							</span>
						</el-option>
			      </el-select>
						<!-- <span v-else>{{ scope.row.itfName }}</span> -->
			    </template>
			  </el-table-column>
			  <el-table-column label="原金额">
			    <template slot-scope="scope">
			      <el-input type = 'number'
				  		v-if="scope.row.edit"
						v-model.trim="scope.row.originalValue1" 
						@focus="changeIndex(scope.$index)"
						style="width: 150px;">
					</el-input>
						<!-- <span v-else>{{ scope.row.itfName }}</span> -->
			    </template>
			  </el-table-column>
			  <el-table-column label="调增比例">
			    <template slot-scope="scope">
			      <el-input type = 'number'
				  		v-if="scope.row.edit"
				  		@focus="changeIndex(scope.$index)"
						v-model.trim="scope.row.ratio1" 
						style="width: 80px;">
					</el-input>%
						<!-- <span v-else>{{ scope.row.itfName }}</span> -->
			    </template>
			  </el-table-column>
			  <el-table-column label="调增金额">
			    <template slot-scope="scope">
			      <el-input type = 'number' v-if="scope.row.edit"
						v-model.trim="scope.row.modifyValue1" 
						style="width: 100px;">
					</el-input>
						<!-- <span v-else>{{ scope.row.itfName }}</span> -->
			    </template>
			  </el-table-column>
			   <el-table-column label="调减科室">
			    <template slot-scope="scope">
			      <el-select 
							v-if="scope.row.edit"
			      	v-model="scope.row.deptmentId2" 
							filterable 
			      	placeholder="请选择调减科室">
			      	<el-option 
							v-for="item in departmentParams" 
							:key="item.id" 
							:label="item.name + '_' + item.fplb" 
							:value="item.id">
							<span style="float: left">{{ item.name }}</span>
							<span style="float: right; color: #8492a6; font-size: 13px">
								{{ item.fplb }}
							</span>
						</el-option>
			      </el-select>
						<!-- <span v-else>{{ scope.row.itfName }}</span> -->
			    </template>
			  </el-table-column>
			  <el-table-column label="原金额">
			    <template slot-scope="scope">
			      <el-input type = 'number'
				  		v-if="scope.row.edit"
						@focus="changeIndex(scope.$index)"
						v-model.trim="scope.row.originalValue2" 
						style="width: 150px;">
					</el-input>
						<!-- <span v-else>{{ scope.row.itfName }}</span> -->
			    </template>
			  </el-table-column>
			  <el-table-column label="调增比例">
			    <template slot-scope="scope">
			      <el-input type = 'number'
				  v-if="scope.row.edit"
				  		@focus="changeIndex(scope.$index)"
						v-model.trim="scope.row.ratio2" 
						style="width: 80px;">
					</el-input>%
						<!-- <span v-else>{{ scope.row.itfName }}</span> -->
			    </template>
			  </el-table-column>
			  <el-table-column label="调减金额">
			    <template slot-scope="scope">
			      <el-input type = 'number' v-if="scope.row.edit"
						v-model.trim="scope.row.modifyValue2" 
						style="width: 100px;">
					</el-input>
						<!-- <span v-else>{{ scope.row.itfName }}</span> -->
			    </template>
			  </el-table-column>
			  <el-table-column label="调整原因">
			    <template slot-scope="scope">
			     <el-input type = 'text' v-if="scope.row.edit"
						v-model.trim="scope.row.modifyreason" 
						style="width: 100px;">
					</el-input>
				
          			<!-- </el-input> -->
						<!-- <span v-else>{{ scope.row.itfName }}</span> -->
			    </template>
			  </el-table-column>
				
			  <el-table-column align="center" label="操作" with="100">
			    <template slot-scope="scope">
						<div v-if="scope.row.edit">
							<!-- <el-tooltip 
								class="item" effect="dark" 
								content="保存" placement="left">
								<el-button
									type="success" size="mini" 
									icon="el-icon-check"
									:loading="scope.row.subLoading"
									@click="confirmAssignee(scope.row)"
									plain circle>
								</el-button>	
							</el-tooltip> -->
								<el-tooltip 
								class="item" effect="dark" 
								content="复制" placement="right">
								<el-button
									type="danger" icon="el-icon-document-copy"
									size="mini" 
									@click="copyData(scope.$index, scope.row)"
									plain circle></el-button>
							</el-tooltip>
							<el-tooltip 
								class="item" effect="dark" 
								content="删除" placement="right">
								<el-button
									type="danger" icon="el-icon-delete-solid"
									size="mini" 
									@click="delData(scope.$index, scope.row)"
									plain circle></el-button>
							</el-tooltip>
						
						</div>
						<!-- <el-button 
							v-else
							type="text" 
							icon="el-icon-edit"
							size="mini"
							@click="scope.row.edit=!scope.row.edit">编辑
						</el-button> -->
			    </template>
			  </el-table-column>
			</el-table>
		</el-dialog>
	</div>
</template>

<script>
import { getHospitalInfo } from "@/api/hospital";
import { saveIncomeAdjustData } from "@/api/incomAdjust";
import waves from "@/directive/waves";
import { formatDate } from "@/utils/date";
export default {
	directives: { waves },
  props: {
    feedBackData: {
      type: Object
    },

    dialogFormVisible: {
      type: Boolean
    },
    personData: {
      type: Object
    },
    dialogStatus: {
      type: String
    },
    departmentParams: {
      type: Array
    },
    sflbParams: {
      type: Array
    }
  },
  name: "AssigneeDialog",
  data() {
    return {
      showClose: true,
      loading: false,
      visible: false,
      sumAdd: 0.0,
      sumSub: 0.0,
      yearmonth: "",
      assigneeList: [],
      hisTypeParams: [],
      hospNoParams: [],
      selectedIndex: null,
      canSave: true
    };
  },
  created() {
    this.visible = this.dialogFormVisible;
  },
  mounted() {
    this.setDefaultYearmonth();
    // this.getHisTypeParam()
    // this.getHospNoParams()
    //this.getPositionParams()
    // const data = this.feedBackData

    // if (data.id !== null) {
    // 		this.getList()
    // 	}
  },
  watch: {
    assigneeList: {
      handler(val, oldVal) {
        if (this.selectedIndex !== null) {
          val[this.selectedIndex].modifyValue1 =
            parseFloat(val[this.selectedIndex].originalValue1) *
            parseFloat(val[this.selectedIndex].ratio1) /
            100.0;
          val[this.selectedIndex].modifyValue2 =
            0 -
            parseFloat(val[this.selectedIndex].originalValue2) *
              parseFloat(val[this.selectedIndex].ratio2) /
              100.0;
          this.sumIncomeData();
        }
      },
      deep: true
    }
  },
  methods: {
    setDefaultYearmonth() {
      var self = this;
      const month = new Date().getMonth() - 1;
      var defYearmonth = new Date(new Date().setMonth(month, 1));
      const ymStr = formatDate(defYearmonth, "yyyy-MM");
      self.yearmonth = ymStr;
    },
    changeIndex(index) {
      // console.log(index)
      this.selectedIndex = index;
    },
    getHisTypeParam() {
      var self = this;
      fetchItfCostList().then(res => {
        self.hisTypeParams = res.data;
      });
    },

    addNewAssignee() {
      var self = this;
      let newAssignee = {
        id: null,
        incomeType: null,
        deptmentId1: null,
        originalValue1: null,
        ratio1: null,
        modifyValue1: null,
        modifyType1: null,
        deptmentId2: null,
        originalValue2: null,
        ratio2: null,
        modifyValue2: null,
        modifyType2: null,
        modifyreason: null,
        edit: true,
        subLoading: false,
        yearMonth: null
      };
      self.assigneeList.push(newAssignee);
    },

    handleSave(data) {
      //  console.log(this.assigneeList)
      this.canSave = true;
      this.assigneeList.map((i, index) => {
        this.valideAssignee(i);
      });
      if (this.canSave) {
        // this.assigneeList.map((j, index) => {
        // this.confirmAssignee(j)
				// })
				// console.log(this.assigneeList.length)
        this.confirmAssignees(this.assigneeList, 0);
      }
    },
    sumIncomeData() {
      var self = this;
      self.sumAdd = 0.0;
      self.sumSub = 0.0;
      this.assigneeList.map((data, index) => {
        if (isNaN(data.modifyValue1)) {
          self.sumAdd = self.sumAdd + 0.0;
        } else {
          self.sumAdd = self.sumAdd + parseFloat(data.modifyValue1);
        }
        if (isNaN(data.modifyValue2)) {
          self.sumSub = self.sumSub + 0.0;
        } else {
          self.sumSub = self.sumSub + parseFloat(data.modifyValue2);
        }
      });
    },
    valideAssignee(data) {
      var self = this;
      data.yearMonth = self.yearmonth;
      // console.log(data);
      if (data.incomeType === null) {
        this.canSave = false;
        self.$message({
          message: "未选择收入类别",
          type: "warning"
        });
      } else if (data.modifyValue1 === 0 && data.deptmentId1 === null) {
        this.canSave = false;
        self.$message({
          message: "未选择调增科室",
          type: "warning"
        });
      } else if (data.modifyValue2 === 0 && data.deptmentId2 === null) {
        this.canSave = false;
        self.$message({
          message: "请选调减科室",
          type: "warning"
        });
      } else if (self.yearmonth === "") {
        this.canSave = false;
        self.$message({
          message: "未选择年月",
          type: "warning"
        });
      }
    },
    confirmAssignee(data) {
      var self = this;
      data.yearMonth = self.yearmonth;
      if (data.incomeType === null) {
        self.$message({
          message: "未选择收入类别",
          type: "warning"
        });
      } else if (data.modifyValue1 === 0 && data.deptmentId1 === null) {
        self.$message({
          message: "未选择调增科室",
          type: "warning"
        });
      } else if (data.modifyValue2 === 0 && data.deptmentId2 === null) {
        self.$message({
          message: "请选调减科室",
          type: "warning"
        });
      } else if (self.yearmonth === "") {
        self.$message({
          message: "未选择年月",
          type: "warning"
        });
      } else {
        if ((data.modifyValue1 != 0) & (data.deptmentId1 != null)) {
          data.modifyType1 = 1;
        }
        if ((data.modifyValue2 != 0) & (data.deptmentId2 != null)) {
          data.modifyType2 = 0;
        }
        saveIncomeAdjustData(data).then(res => {
          self.$notify({
            title: "成功",
            message: res.msg,

            type: "success",
            duration: 6000
          });
          // self.getList()
          self.$emit("getList");
          self.$emit("closedialog");
        });
      }
    },
    confirmAssignees(dataList, index = 0) {
			var self = this;
     
			const data = dataList[index];
			 data.yearMonth = self.yearmonth;
				// console.log(data)
      if ((data.modifyValue1 != 0) & (data.deptmentId1 != null)) {
        data.modifyType1 = 1;
      }
      if ((data.modifyValue2 != 0) & (data.deptmentId2 != null)) {
        data.modifyType2 = 0;
      }
      saveIncomeAdjustData(data).then(res => {
        if ( index+1 === dataList.length) {
          self.$notify({
            title: "成功",
            message: res.msg,

            type: "success",
            duration: 6000
          });
          // self.getList()
          self.$emit("getList");
          self.$emit("closedialog");
				}else
				{		
					this.confirmAssignees(dataList,  index+1)
				}
      });
    },
    delData(index, data) {
      var self = this;
      if (data.id === null || data.id === "") {
        self.assigneeList.splice(index, 1);
        this.sumIncomeData();
      } else {
        // let assignee = {
        // 	id: data.id,
        // 	baseChargeId: data.baseCostId,
        // 	itfChargeId: data.itfCostId
        // }
        // delSelectedCostData(assignee).then(res => {
        // 	self.$notify({
        // 	  title: '删除成功',
        // 	  message: data.itfName,
        // 	  type: 'success',
        // 	  duration: 6000
        // 	})
        // 	self.getList()
        // 	self.$emit('getList')
        // })
      }
    },
    copyData(index, data) {
      var self = this;
      let copyAssignee = {
        id: null,
        incomeType: data.incomeType,
        deptmentId1: null,
        originalValue1: data.originalValue1,
        ratio1: data.ratio1,
        modifyValue1: data.modifyValue1,
        deptmentId2: null,
        originalValue2: data.originalValue2,
        ratio2: data.ratio2,
        modifyValue2: data.modifyValue2,
        modifyreason: data.modifyreason,
        edit: true,
        subLoading: false
      };
      self.assigneeList.push(copyAssignee);
    },
    closeDialog() {
      this.$emit("getList");
      this.$emit("closedialog");
    }
  }
};
</script>

<style>
.customWidth {
  width: 80%;
}
.filter-container-right-label {
  margin-right: 10px;
  color: #42b983;
}
.filter-container-right-label-num {
  color: red;
}
</style>
