<template>
	<div class="app-container">
		<div class="filter-container">
			
			
			<!-- 查询人员 -->
			<el-select
				v-model="listQuery.person"
				filterable clearable
				remote
				reserve-keyword
				placeholder="编码/姓名/所属科室/'全部'"
				:remote-method="remoteMethod"
				:loading="remoteLoading"
				style="width: 250px;"
				class="searchClass">
				<el-option
					v-for="item in fuzzyQueryPerParams"
					:key="item.id"
					:label="item.name"
					:value="item.id">
					<span style="float: left">{{ item.code }}</span>
					<span style="float: left">{{ item.name }}</span>
					<span style="float: right; color: #8492a6; font-size: 13px">
						{{ item.departmentName }}
					</span>
				</el-option>
			</el-select>
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
			<el-button v-waves type="primary" size="mini" @click="handleFilter" round>
				查 询
			</el-button>
			<el-button v-waves type="primary" size="mini" @click="handleCreate" round>
				新建人员调整
			</el-button>
			
		</div>

		<el-table 
			:data="list" 
			v-loading="listLoading" 
			style="width: 100%"
			:row-class-name="tableRowClassName">
		
			<el-table-column prop="departmentName" label="科室">
			</el-table-column>
			<el-table-column prop="personName" label="姓名">
			</el-table-column>
			<el-table-column prop="startTime" label="开始时间">
			</el-table-column>
			<el-table-column prop="endTime" label="结束时间">
			</el-table-column>
			
			<el-table-column label="操作" width="150">
				<template slot-scope="scope">

					
					<el-button  v-if="scope.row.currentState === 0 && scope.row.orinFlag == 1"
						@click="handleDelte(scope.row)"
						type="text" size="small">
						删除
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="pagination-container">
			<el-pagination 
				@size-change="handleSizeChange" 
				@current-change="handleCurrentChange" 
				:current-page="listQuery.currentPage"
				:page-sizes="[10, 15, 20, 25, 30]" 
				:page-size="listQuery.pagesize" 
				layout="total, sizes, prev, pager, next, jumper"
				background
				:total="total">
			</el-pagination>
		</div>
		<!-- 编辑框 -->
		<person-edit-dialog 
			v-if="editStatus"
			:dialogStatus="dialogStatus" 
			:dialogFormVisible="dialogFormVisible"
			:departmentParams="departmentParams"
			:sflbParams="sflbParams"
			:personData="personData"
			:personParams="personParams"
			@closedialog="closedialog"
			@getList="getList">
		</person-edit-dialog>
		
	</div>
</template>

<script>
import {
  fetchPeople,
  fuzzyQueryPerParam,
  fetchPeopleAdjust,
  getPersonParam,
  deletePersonAdjust
} from "@/api/person";
import { getDepartmentParam } from "@/api/department";

// import { getPositionList } from '@/api/position'
import waves from "@/directive/waves";
import { formatDate } from "@/utils/date";
import PersonEditDialog from "./components/incomeAdjustEditDialog";

export default {
  directives: { waves },
  name: "Person",
  components: { PersonEditDialog },
  directives: { waves },
  data() {
    return {
      list: null,
      total: 0,
      sumAdd: 0.0,
      sumSub: 0.0,
      listLoading: false,
      remoteLoading: false,
      listQuery: {
        currentPage: 1,
        pagesize: 10,
        person: null,
        department: null,
        status: "",
        yearmonth: "",
        position: null
      },
      departmentParams: [],
      sflbParams: [], //收费类别参数
      fuzzyQueryPerParams: [],
      personParams: [],
      editStatus: false,
      addStatus: false,
      dialogStatus: "",
      dialogFormVisible: false,
      personData: {},
      isAccountCancel: null
    };
  },
  created() {
    this.getList();
  },
  mounted() {
    // this.setDefaultYearmonth()
    this.getPersonParams();
    this.getDepartmentParams();
    // this.getSflbParams();
    // this.getPositionParams()
  },
  methods: {
    getPersonParams() {
      var self = this;
      getPersonParam().then(response => {
        self.personParams = response.data;
      });
    },
    setDefaultYearmonth() {
      var self = this;
      const month = new Date().getMonth() - 1;
      var defYearmonth = new Date(new Date().setMonth(month, 1));
      const ymStr = formatDate(defYearmonth, "yyyy-MM");
      self.listQuery.yearmonth = ymStr;
    },
    getList() {
      var self = this;
      self.listLoading = true;
      // self.listQuery.status = self.listQuery.status == null ? '' : self.listQuery.status
      const query = self.listQuery;
      fetchPeopleAdjust(query).then(response => {
        self.list = response.data.data;
        self.total = response.data.total;
        self.isAccountCancel = response.data.accountStatusIsCancel;
        // self.sumAdd = response.data.sumAdd
        // self.sumSub =  response.data.sumSub
        self.listLoading = false;
      });
    },
    /* 模糊查询全院人员 */
    remoteMethod(query) {
      if (query !== "") {
        this.remoteLoading = true;
        const search = {
          keyword: query
        };
        fuzzyQueryPerParam(search).then(res => {
          this.fuzzyQueryPerParams = res.data;
        });
        this.remoteLoading = false;
      } else {
        this.fuzzyQueryPerParams = [];
      }
    },
    tableRowClassName({ row, rowIndex }) {
      // if (row.positionName === '科主任') {
      //   return 'kzr-row';
      // } else if (row.positionName === '护士长') {
      //   return 'hsz-row';
      // }
      return "";
    },
    handleFilter() {
      this.listQuery.currentPage = 1;
      this.getList();
    },
    handleSizeChange(size) {
      this.listQuery.pagesize = size;
      this.getList();
    },
    handleCreate() {
      var self = this;
      var canOperator = false;
      if (self.isAccountCancel == 0) {
        self
          .$confirm(
            "存在已取消封账的月份，调整数据会影响报表数据, 是否继续?",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
          .then(() => {
            this.handleCreateCom();
          });
      }
      if (self.isAccountCancel == 2) {
        canOperator = true;
      }

      if (canOperator) {
        this.handleCreateCom();
      }
    },
    handleCreateCom() {
      this.editStatus = true;
      this.dialogStatus = "新增人员调整记录";
      this.dialogFormVisible = true;
    },
    handleEdit(data) {
      this.editStatus = true;
      this.dialogStatus = "编辑收入调整信息";
      this.dialogFormVisible = true;
      this.personData = data;
    },
    handleDelte(data) {
      // console.log(data)
      this.$confirm(
        "此操作将永久删除" + data.personName + "的调整记录, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          deletePersonAdjust(data).then(res => {
            let resStatus = res.status;
            if (resStatus == 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getList();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    getPersonDataInfo(data) {
      this.editStatus = true;
      this.dialogStatus = "查看收入调整信息";
      this.dialogFormVisible = true;
      this.personData = data;
    },
    closedialog() {
      this.editStatus = false;
      this.dialogStatus = "";
      this.dialogFormVisible = false;
      this.addStatus = false;
    },
    handleCurrentChange(currentPage) {
      this.listQuery.currentPage = currentPage;
      this.getList();
    },
    getDepartmentParams() {
      getDepartmentParam().then(response => {
        this.departmentParams = response.data;
      });
    },
    /* 获取收费类别参数列表 */
    getSflbParams() {
      getChargeTypeParam().then(res => {
        // console.log(res.data)
        this.sflbParams = res.data;
      });
    },
    filterStatus(value, row) {
      return row.status === value;
    }
  }
};
</script>

<style>
.el-table .kzr-row {
  background: oldlace;
}

.el-table .hsz-row {
  background: #f0f9eb;
}

.filter-container-right-label {
  margin-right: 10px;
  color: #42b983;
}
.filter-container-right-label-num {
  color: red;
}
</style>
