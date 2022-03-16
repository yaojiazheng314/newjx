<template>
	<div class="app-container">
		<div class="filter-container">
			<el-select 
				v-model="listQuery.formula" 
				filterable clearable 
				placeholder="选择或输入公式"
				class="searchClass">
				<el-option 
					v-for="f in deptFormulas" 
					:key="f.id" 
					:label="f.name" 
					:value="f.id">
					<span style="float: left">{{ f.name }}</span>
					<el-tooltip :content="'共'+f.departmentNum+'科室'"
						placement="right">
						<span style="float: right; color: #8492a6; font-size: 13px">
							{{ f.departmentNum }}
						</span>
					</el-tooltip>
				</el-option>
			</el-select>
			<el-select 
				v-model="listQuery.department" 
				filterable clearable 
				placeholder="选择或输入科室" 
				class="searchClass">
				<el-option 
					v-for="d in departmentParams" 
					:key="d.id" 
					:label="d.name + '_' + d.type" 
					:value="d.id">
					<span style="float: left">{{ d.name }}</span>
					<span style="float: right; color: #8492a6; font-size: 13px">
						{{ d.type }}
					</span>
				</el-option>
			</el-select>
			<el-date-picker
				v-model="listQuery.yearmonth"
				type="month"
				placeholder="选择月"
				format="yyyy 年 M 月"
				value-format="yyyy-MM"
				:clearable="false"
				:editable="false"
				@change="handleFilter"
				class="searchClass">
			</el-date-picker>
			<el-button 
				v-waves type="primary" 
				size="mini" 
				@click="handleFilter" 
				round>
				查 询
			</el-button>
			<el-tooltip 
				effect="light" 
				content="核算全部科室公式" 
				placement="top-start">
				<el-button 
					type="warning" 
					size="mini" 
					:disabled="accountStatus"
					@click="isOneKeyCalc" 
					circle>
				</el-button>
			</el-tooltip>
		</div>
		
		<el-table 
			:data="list" 
			v-loading="listLoading" 
			stripe
			style="width: 100%">
			<el-table-column prop="formulaName" label="公 式">
			</el-table-column>
			<el-table-column prop="deptCode" label="科室编码">
				<template slot-scope="scope">
					<el-tag type="info">
						{{ scope.row.deptCode }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="deptName" label="科室名称">
				<template slot-scope="scope">
					<el-tooltip :content="scope.row.deptType" 
						placement="right">
						<span>{{ scope.row.deptName }}</span>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column prop="deptType" label="核算信息">
				<template slot-scope="scope">
					<el-badge 
						:value="scope.row.detailNum" 
						class="badge-number">
						<el-button 
							size="mini" 
							style="color: #0096C4; font-size: 12px;"
							@click="getDeptRunInfo(scope.row)"
							plain round>
							明 细
						</el-button>
					</el-badge>
				</template>
			</el-table-column>
			<el-table-column prop="errLog" label="错误日志">
				<template slot-scope="scope">
					<span 
						v-if="scope.row.errLog === null || scope.row.errLog === ''"
						class="example-nodata">
						暂无
					</span>
					<el-badge 
						v-else
						is-dot
						class="badge">
						<el-tooltip :content="scope.row.errLog" 
							placement="bottom" effect="light">
							<span style="color: #E6A23C;">错误信息</span>
						</el-tooltip>
					</el-badge>
				</template>
			</el-table-column>
			<el-table-column prop="val" label="值">
				<template slot-scope="scope">
					<count-to
					  :start-val="startVal"
					  :end-val="scope.row.val"
					  :duration="duration"
					  :decimals="decimals"
					  :separator="separator"
					  :autoplay="true"
						class="example-department"/>
				</template>
			</el-table-column>
			<el-table-column align="center" label="操作" width="100">
				<template slot-scope="scope">
					<el-tag v-if="accountStatus" type="success">
						已封账
					</el-tag>
					<el-button 
						v-else
						:loading="scope.row.subLoading"
						@click="calcDeptRun(scope.row)"
						type="primary" size="mini" plain round>
						核 算
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
		<!-- 核算明细 -->
		<dept-run-detail
			v-if="detailStatus"
			:dialogStatus="dialogStatus"
			:dialogFormVisible="dialogFormVisible"
			:runData="runData"
			:accountStatus="accountStatus"
			@closeDeptRunDetail="closeDeptRunDetail">
		</dept-run-detail>
		
		<el-dialog
			:title="oneKeyQuestion"
			:visible.sync="oneKeyVisible"
			width="30%"
			center>
			<span style="color: #8492a6; font-size: 15px">
				{{ oneKeyTip }}
			</span>
			<span slot="footer" class="dialog-footer">
				<el-button 
					@click="oneKeyVisible = false">
					取 消
				</el-button>
				<el-button 
					type="primary" 
					v-loading.fullscreen.lock="oneKeyLoading"
					element-loading-text="拼命核算中, 请稍候"
					element-loading-spinner="el-icon-loading"
					element-loading-background="rgba(0, 0, 0, 0.7)"
					@click="doOneKeyRun">
					确 定
				</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { getDeptRunList, doDeptRun, oneKeyRun } from "@/api/bnsForDeptRun";
import { getFormulas } from "@/api/bnsFormula";
import { getDepartmentParam,getBaseCurrentYearmonth } from "@/api/department";
import { formatDate } from "@/utils/date";
import waves from "@/directive/waves";
import countTo from "vue-count-to";
import DeptRunDetail from "./components/DeptRunDetail";
export default {
  name: "DeptRun",
  directives: { waves },
  components: { countTo, DeptRunDetail },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        currentPage: 1,
        pagesize: 10,
        formula: null,
        department: null,
        yearmonth: "",
        userID: null,
        typeFlg: "科室"
      },
      accountStatus: false,
      deptFormulas: [],
      departmentParams: [],
      startVal: 0,
      duration: 1000,
      decimals: 2,
      separator: ",",
      autoplay: true,
      runData: {
        id: null
      },
      detailStatus: false,
      dialogStatus: "",
      dialogFormVisible: false,
      oneKeyVisible: false,
      oneKeyLoading: false,
      oneKeyTip:
        "若没有人员变动所属科室的情况，无需‘一键核算’，因为这会花费一些时间。（注: 根据筛选条件决定核算哪些内容）",
      oneKeyQuestion: "是否一键核算科室公式？"
    };
  },
  mounted() {
    // this.setDefaultYearmonth();
    this.getUserInfo();
    this.getList();
    this.getDeptFormulaParams();
	this.getDepartmentParams();
	this.getBaseCurrentYearmonth();
  },
  methods: {
    getBaseCurrentYearmonth() {
      var self = this;
      getBaseCurrentYearmonth().then(response => {
        // var defYearmonth = response.data;
        // const ymStr = formatDate(defYearmonth, "yyyy-MM");
        self.listQuery.yearmonth = response.data;
        this.getList();
      });
    },
    setDefaultYearmonth() {
      var self = this;
      const month = new Date().getMonth() - 1;
      var defYearmonth = new Date(new Date().setMonth(month, 1));
      const ymStr = formatDate(defYearmonth, "yyyy-MM");
      self.listQuery.yearmonth = ymStr;
    },
    getUserInfo() {
      var self = this;
      self.listQuery.userID = self.$store.getters.userID;
    },
    getList() {
      var self = this;
      self.listLoading = true;
      const query = self.listQuery;
      getDeptRunList(query).then(response => {
        self.accountStatus = response.data.accountStatus;
        const runs = response.data.deptRuns;
        self.list = runs.map(v => {
          self.$set(v, "subLoading", false);
          return v;
        });
        self.total = response.data.total;
        self.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.currentPage = 1;
      this.getList();
    },
    handleSizeChange(size) {
      this.listQuery.pagesize = size;
      this.getList();
    },
    handleCurrentChange(currentPage) {
      this.listQuery.currentPage = currentPage;
      this.getList();
    },
    getDeptFormulaParams() {
      var self = this;
      const query = self.listQuery;
      getFormulas(query).then(response => {
        this.deptFormulas = response.data;
      });
    },
    getDepartmentParams() {
      getDepartmentParam().then(response => {
        this.departmentParams = response.data;
      });
    },
    filterType(value, row) {
      return row.type === value;
    },
    getDeptRunInfo(data) {
      this.runData.id = data.deptRunID;
      this.dialogStatus = data.deptName + data.formulaName + "的公式明细";
      this.detailStatus = true;
      this.dialogFormVisible = true;
    },
    closeDeptRunDetail() {
      this.runData.id = null;
      this.dialogStatus = "";
      this.detailStatus = false;
      this.dialogFormVisible = false;
    },
    calcDeptRun(data) {
      var self = this;
      data.subLoading = true;
      const deptRunVO = {
        deptRunID: data.deptRunID,
        yearmonth: data.yearmonth
      };
      doDeptRun(deptRunVO).then(response => {
        let resultStatus = response.status;
        if (resultStatus === 520 || resultStatus === 500) {
          data.subLoading = false;
          self
            .$confirm(response.msg, "提示", {
              type: "warning",
              center: true
            })
            .then(() => {
              self.$message({
                type: "info",
                message: "稍候重试"
              });
            })
            .catch(() => {
              self.$message({
                type: "info",
                message: "稍候重试"
              });
            });
        } else {
          let successMsg = data.deptName + data.formulaName + "重新核算完成";
          self.$notify({
            title: "成功",
            message: successMsg,
            type: "success",
            duration: 6000
          });
          data.subLoading = false;
          self.getList();
        }
      });
    },
    isOneKeyCalc() {
      this.oneKeyVisible = true;
    },
    doOneKeyRun() {
      var self = this;
      self.oneKeyLoading = true;
      const oneKeyData = {
        userID: self.$store.getters.userID,
        yearmonth: self.listQuery.yearmonth,
        department: self.listQuery.department,
        formula: self.listQuery.formula
      };
      oneKeyRun(oneKeyData).then(response => {
        let resultStatus = response.status;
        if (resultStatus === 520) {
          self.oneKeyLoading = false;
          self
            .$confirm(response.msg, "提示", {
              type: "warning",
              center: true
            })
            .then(() => {
              self.$message({
                type: "info",
                message: "稍候重试"
              });
            })
            .catch(() => {
              self.$message({
                type: "info",
                message: "稍候重试"
              });
            });
        } else {
          self.oneKeyVisible = false;
          self.oneKeyLoading = false;
          self.$notify({
            title: "成功",
            message: "科室公式重新核算完成",
            type: "success",
            duration: 6000
          });
        }
      });
    }
  }
};
</script>
<style scoped>
.badge {
  margin-top: 5px;
  margin-right: 40px;
}
.badge-number {
  margin-top: 8px;
  margin-right: 40px;
}
</style>