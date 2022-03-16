<template>

	<div id="assigneeDialog" style="height: 400px; width: 500px; ">
     
		<el-dialog 
			customClass="customWidth"
			:title="dialogStatus" 
			:show-close="showClose"
			:close-on-click-modal="false"
			:visible.sync="visible"
			@close="closeDialog" >
			
	 <div class="detail_dialog_header">
      <span>人员：<el-tag>{{personData.perName}}</el-tag></span>
      <span>科室：<el-tag>{{personData.perDeptName}}</el-tag></span>
      <el-tooltip 
				class="item" effect="dark" 
				content="新增二次分配明细" placement="top">
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
      <span>合计:<el-tag>{{totalValue}}</el-tag></span>

    </div>
			 
			
			
			<el-table 
        ref="assigneeList"
				:loading="loading" 
				:data="assigneeList" 
				fit stripe highlight-current-row 
        height="450" useVirtual>
				<el-table-column
  
					label="序号"
					type="index"
					align="center">
				<template slot-scope="scope">
						<span>{{ scope.$index + 1}}</span>
				</template>
				</el-table-column>
				<el-table-column label="分配item项" >					
					<template slot-scope="scope">
						<el-select 
						
							v-model="scope.row.feedBackItemId" 
							filterable 
							placeholder="请选择item分配项">
							<el-option
								v-for="item in itemParams"
								:key="item.feedBackItem"
								:label="item.prop"
								:value="item.feedBackItem">
							</el-option>
						</el-select>

					</template>
				</el-table-column>
				
			 <el-table-column label="分配明细项"  >					
					<template slot-scope="scope">
						<el-select 
							v-model="scope.row.feedBackType" 
							filterable 
							placeholder="请选择分配明细项">
							<el-option
								v-for="item in typeParams"
								:key="item.id"
								:label="item.feedBackTypeName"
								:value="item.id">
							</el-option>
						</el-select>

					</template>
				</el-table-column>
			  <el-table-column label="金额">
			    <template slot-scope="scope">
			      <el-input-number
						v-model.trim="scope.row.dval" 
						>
					</el-input-number>

			    </template>
			  </el-table-column>

				
			  <el-table-column align="center" label="操作" >
			    <template slot-scope="scope">
						<div >

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

			    </template>
			  </el-table-column>
			</el-table>
		</el-dialog>
	</div>
</template>

<script>
import {
  getFeedBackReportDetail,
  updateFeedBackReportDetail
} from "@/api/feedBackReport";
// import { saveIncomeAdjustDataAll } from "@/api/incomAdjust";
import waves from "@/directive/waves";
// import { formatDate } from "@/utils/date";
export default {
  directives: { waves },
  props: {
    dialogFormVisible: {
      type: Boolean
    },
    personData: {
      type: Object
    },
    dialogStatus: {
      type: String
    },

    typeParams: {
      type: Array
    }
  },
  name: "AssigneeDialog",
  computed: {
    totalValue: function() {
      let total = 0;
      this.assigneeList.map(item => {
        total += item.dval;
      });
      return total.toFixed(2);
    }
  },
  data() {
    return {
      showClose: true,
      loading: false,
      visible: false,
      sumAdd: 0.0,
      sumSub: 0.0,
      sum: 0.0,
      yearmonth: "",
      assigneeList: [],
      itemParams: {},
      hospNoParams: [],
      selectedIndex: null,
      canSave: true,
      showDepartment: [],
      showDepartmentPage: 1,
      filterDepartmentKeyword: "",
      listQuery: {
        userId: null,
        yearmonth: null,
        feedBackDept: null,
        person: null,
        feedBackItemId:null
      },
      responseData: null,
      NewResponseData: {
        user: null,
        yearmonth: null,
        feedBackDept: null,
        person: null,
        remarks: "",
        coefficient: null,
        departmentId: null,
        departmentName: null,
        reports: []
      },
      saveReturnData: {
        index: null,
        reportItem: []
      }
    };
  },
  created() {
    this.visible = this.dialogFormVisible;
    this.itemParams = this.personData.feedBackItem;
    this.saveReturnData.index = this.personData.index;
    this.personData.feedBackItem.map(item => {
      let items = {
        feedBackItemId: item.feedBackItem,
        prop: item.prop,
        sumVal: 0
      };
      this.saveReturnData.reportItem.push(items);
    });
    // console.log(this.saveReturnData);
    // this.showDepartment = this.departmentParams.slice(0,10)
  },

  mounted() {
    // this.setDefaultYearmonth();
    // this.getHisTypeParam()
    // this.getHospNoParams()
    //this.getPositionParams()
    // const data = this.feedBackData
    // if (data.id !== null) {
    // 		this.getList()
    // 	}

    this.getList();
    // if(){

    // }
  },

  methods: {
    getList() {
      var self = this;

      self.listLoading = true;
      self.listQuery.userId = self.personData.userId;
      self.listQuery.yearmonth = self.personData.yearmonth;
      self.listQuery.feedBackDept = self.personData.feedBackDeptId;
      self.listQuery.person = self.personData.person;
      const query = self.listQuery;
      getFeedBackReportDetail(query).then(response => {
        self.responseData = response.data;
        if (self.responseData === null) {
          self.NewResponseData.user = self.personData.userId;
          self.NewResponseData.yearmonth = self.personData.yearmonth;
          self.NewResponseData.feedBackDept = self.personData.feedBackDeptId;
          self.NewResponseData.person = self.personData.person;
          self.NewResponseData.coefficient = self.personData.coefficient;
          self.personData.feedBackItem.map(i => {
            let newreport = {
              id: null,
              feedBackItem: i.feedBackItem,
              val: null,
              payableVal: null,
              details: []
            };
            self.NewResponseData.reports.push(newreport);
          });
          // console.log(self.NewResponseData);
          self.responseData = self.NewResponseData;
        } else {
          self.responseData.reports.map(item1 => {
            item1.details.map(item2 => {
              self.assigneeList.push(item2);
            });
          });
        }

        self.listLoading = false;
      });
    },
    changeIndex(index) {
      // console.log(index)
      this.selectedIndex = index;
    },

    addNewAssignee() {
      var self = this;
      let newAssignee = {
        did: null,
        feedBackItemId: null,
        feedBackType: null,
        dval: 0,
        feedBackTypeName: "",
        itemName: ""
      };
      self.assigneeList.push(newAssignee);

      // this.$nextTick(() => {
      //   this.$refs.assigneeList.bodyWrapper.scrollTop = this.$refs.assigneeList.bodyWrapper.scrollHeight;
      // })
    },
    handleSave(data) {
      var self = this;
      //  console.log(this.assigneeList)
      this.canSave = true;
      this.assigneeList.map((i, index) => {
        this.valideAssignee(i);
      });
      if (this.canSave) {
        this.responseData.reports.map((item, key) => {
          this.sum = 0.0;
          this.responseData.reports[key].details = [];
          this.assigneeList.map(i => {
            if (item.feedBackItem === i.feedBackItemId) {
              let detail = {
                did: null,
                feedBackType: i.feedBackType,
                feedBackItemId: i.feedBackItemId,
                dval: i.dval,
                feedBackTypeName: null,
                itemName: null
              };
              this.sum += i.dval;
              this.responseData.reports[key].details.push(detail);
            }
          });

          this.saveReturnData.reportItem.map(ri => {
            if (item.feedBackItem === ri.feedBackItemId) {
              ri.sumVal = this.sum;
            }
          });

        });
        //  console.log(this.saveReturnData)
        updateFeedBackReportDetail(this.responseData).then(res => {
          self.$notify({
            title: "成功",
            message: res.msg,

            type: "success",
            duration: 6000
          });
          // self.getList()
          // self.$emit("reloadData");
          self.$emit("updateReport",this.saveReturnData);
          self.$emit("closedialog");
        });
      }
    },

    valideAssignee(data) {
      var self = this;

      if (data.feedBackItemId === null) {
        this.canSave = false;
        self.$message({
          message: "未选择item类别",
          type: "warning"
        });
      }
      if (data.feedBackType === null) {
        this.canSave = false;
        self.$message({
          message: "未选择二次分配明细",
          type: "warning"
        });
      }
    },
    delData(index, data) {
      var self = this;
      self.assigneeList.splice(index, 1);
      // if (data.id === null || data.id === "") {
      //   self.assigneeList.splice(index, 1);
      //   this.sumIncomeData();
      // }
    },
    closeDialog() {
      // this.$emit("getList");
      this.$emit("closedialog");
    },

    closeDepartmentSelect(value) {
      if (value === false) {
        this.showDepartmentPage = 1;
      }
      // console.log(value)
    }
  }
};
</script>

<style>
.customWidth {
  width: 50%;
}
.filter-container-right-label {
  margin-right: 10px;
  color: #42b983;
}
.filter-container-right-label-num {
  color: red;
}
.detail_dialog_header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
