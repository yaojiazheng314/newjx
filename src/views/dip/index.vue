<template>
	<div class="app-container">
		<div class="filter-container">
			
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
      <el-autocomplete
				v-model="listQuery.department"
				:fetch-suggestions="querySearchDeptName"
				:trigger-on-focus="false"
				placeholder="输入科室名称查询"
				style="width: 230px;">
			</el-autocomplete>
			<!-- <el-select 
				v-model="listQuery.department" 
				filterable clearable 
				placeholder="选择或输入HIS收入科室" 
				class="searchClass">
				<el-option 
					v-for="item in departmentParams" 
					:key="item.id" 
					:label="item.itfDepartmentName + '_' + item.mzbs+ '_' + item.hospName" 
					:value="item.id">
					<span style="float: left">{{ item.itfDepartmentName }}</span>
					
					<span style="float: right; color: #8492a6; font-size: 13px">
						{{ item.mzbs }}
					</span>
					<span style="float: right; color: #8492a6; font-size: 13px">
						{{ item.hospName }}
					</span>
				</el-option>
			</el-select> -->
			<el-select 
				v-model="listQuery.person" 
				filterable clearable 
				placeholder="选择或输入医保类别" 
				class="searchClass">
				<el-option 
					v-for="item in sflbParams" 
					:key="item.id" 
					:label="item.name" 
					:value="item.id">
					<span style="float: left">{{ item.name }}</span>
					
				</el-option>
			</el-select>
			<el-button v-waves type="primary" size="mini" @click="handleFilter" round>
				查 询
			</el-button>
	
			<el-button v-waves type="danger" size="mini" @click="handleDeleteSelected" round>
				删除选中
			</el-button>
      <el-button
    	type="primary" plain icon="el-icon-download"
    	size="mini"
    	@click="exportExcel"> 导出excel</el-button>
		
		</div>

		<el-table 
			ref="listTable"
			:data="list" 
      height="720"
			v-loading="listLoading" 
			style="width: 100%"
			:row-class-name="tableRowClassName">
			<el-table-column 
       
				type="selection"
				width="55">
			</el-table-column>
			<el-table-column prop="qdh" label="清单号" >
			</el-table-column>
      <el-table-column prop="patientName" label="姓名">
			</el-table-column>
			<el-table-column prop="cbType" label="参保类型">
			</el-table-column>
			<el-table-column prop="patientNo" label="医保号">
			</el-table-column>
			<el-table-column prop="jsTime" label="结算时间">
			</el-table-column>
      <el-table-column prop="totalFee" label="总费用">
			</el-table-column>
			<el-table-column prop="score" label="评分">
			</el-table-column>
			<el-table-column prop="scoreLevel" label="评分等级">
			</el-table-column>
		<el-table-column prop="beforeCompare" label="与初始评分比较">
			</el-table-column>
      <el-table-column prop="initFzzd" label="初始分组诊断">
			</el-table-column>
      <el-table-column prop="initFzzdName" label="初始分组诊断名称">
			</el-table-column>
       <el-table-column prop="initSffz" label="初始分组手术组">
			</el-table-column>
      <el-table-column prop="initSffzName" label="初始分组手术组名称">
			</el-table-column>
      <el-table-column prop="initCsfzScore" label="初始分组分值">
			</el-table-column>
       <el-table-column prop="fzInfo" label="分组信息">
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<el-button 
						@click="getPersonDataInfo(scope.row)" 
						type="text" size="small">
						查看
					</el-button>
					<el-button v-if="scope.row.modifyState === '未审核'"
						@click="handleEdit(scope.row)"
						type="text" size="small">
						编辑
					</el-button>
					<el-button v-if="scope.row.modifyState === '未审核'"
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
			@closedialog="closedialog"
			@getList="getList">
		</person-edit-dialog>
		<!-- 新增框 -->
		<data-new-dialog 
			v-if="addStatus"
			:dialogStatus="dialogStatus" 
			:dialogFormVisible="dialogFormVisible"
			:departmentParams="departmentParams"
			:sflbParams="sflbParams"
			:personData="personData"
			@closedialog="closedialog"
			@getList="getList">
		</data-new-dialog>
	</div>
</template>

<script>
// import { fetchPeople, fuzzyQueryPerParam } from '@/api/person'
import {
  fetchIncomeAdjustDataList,
  deleteIncomeAdjustData,
  deleteIncomeAdjustDataMore,
  getIncomeAdjustDataForExcel
} from "@/api/incomAdjust";
import { getHisDepartmentParam } from "@/api/hisDepartment";
import { fetchDipInfo } from "@/api/dip";
import { getChargeTypeParam } from "@/api/binding";
// import { getPositionList } from '@/api/position'
import waves from "@/directive/waves";
import { formatDate } from "@/utils/date";
import { handleDownloadExcel } from "@/vendor/exportReportExcel";

import { fuzzyQueryDeptName } from "@/api/department";
export default {
  directives: { waves },
  name: "Person",
 
  directives: { waves },
  data() {
    return {
      list: null,
      total: 0,
      sumAdd: 0.0,
      sumSub: 0.0,
      sum: 0.0,
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
      incomeAdjustDataForExcel:[],
      positionParams:[],
      editStatus: false,
      addStatus: false,
      dialogStatus: "",
      dialogFormVisible: false,
      personData: {}
    };
  },
  created() {
    this.getList();
  },
  mounted() {
    this.setDefaultYearmonth();
    this.getDepartmentParams();
    this.getSflbParams();
    this.getPositionParams();
    // this.getPositionParams()
  },
  methods: {
    /* 获取模糊查询本地科室名称内容 */
    querySearchDeptName(queryString, cb) {
      let sugParam = {
        keyword: queryString
      };
      fuzzyQueryDeptName(sugParam).then(res => {
        var suggestions = res.data;
        cb(suggestions);
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
      self.listQuery.status =
        self.listQuery.status == null ? "" : self.listQuery.status;
      const query = self.listQuery;
      fetchDipInfo(query).then(response => {
        self.list = response.data.dips;
        self.total = response.data.total;

        self.listLoading = false;
      });
    },
    /* 模糊查询全院人员 */
    // remoteMethod(query) {
    // 	if (query !== '') {
    //     this.remoteLoading = true;
    // 		const search = {
    // 			keyword: query
    // 		}
    //     fuzzyQueryPerParam(search).then(res => {
    // 			this.fuzzyQueryPerParams = res.data
    // 		})
    // 		this.remoteLoading = false;
    //   }else {
    //     this.fuzzyQueryPerParams = [];
    //   }
    // },
    exportExcel() {


      var self = this;
      self.listLoading = true;
      self.listQuery.status =
      self.listQuery.status == null ? "" : self.listQuery.status;
      const query = self.listQuery;
      getIncomeAdjustDataForExcel(query).then(response => {        
        self.incomeAdjustDataForExcel = response.data;
        var list = self.incomeAdjustDataForExcel;
      // console.log(list)
      const filename = "收入调整";
      var headers = self.positionParams;
      //  console.log(headers)
      var filterVals = [
        "name",
        "yearMonth",
        "modifyTypeName1",
        "deptmentName1",
        "hospName1",
        "mzbs1",
        "originalValue1",
        "ratio1",
        "modifyValue1",
        "modifyTypeName2",
        "deptmentName2",
        "hospName2",
        "mzbs2",
        "originalValue2",
        "ratio2",
        "modifyValue2",
        "modifyreason"
      ];
      handleDownloadExcel(list, filename, headers, filterVals);
       this.getList();
      });
      
     
     
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
      // this.editStatus = true
      this.addStatus = true;
      // this.dialogStatus = '收入调整单'
      this.dialogFormVisible = true;
      // this.personData = {
      // 	id: null,
      // 	yearMonth: null,
      // 	incomeType: null,
      // 	deptmentId1: null,
      // 	originalValue1: 0.00,
      // 	ratio1: 0.00,
      // 	modifyValue1: 0.00,
      // 	deptmentId2: null,
      // 	originalValue2: 0.00,
      // 	ratio2: 0.00,
      // 	modifyValue2: 0.00,
      // 	modifyreason:''
      // }
    },
    handleEdit(data) {
      console.log(data);
      this.editStatus = true;
      this.dialogStatus = "编辑收入调整信息";
      this.dialogFormVisible = true;
      this.personData = data;
    },
    handleDeleteSelected() {
      const selectedData = this.$refs.listTable.selection;
      //   console.log(selectedData)
      let deleteId = [];
      selectedData.map((item, index) => {
        deleteId.push(item.id);
      });
      // console.log(deleteId.length)
      if (deleteId.length === 0) {
        this.$message({
          message: "未选择要删除的调整项",
          type: "warning"
        });
        return;
      }

      //   console.log(deleteId)

      // 在上面引入删除api 将 deleteId 传入 应该就可以了
      this.$confirm("此操作将永久删除这些调整记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteIncomeAdjustDataMore(deleteId).then(res => {
          let resStatus = res.status;
          if (resStatus == 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getList();
          }
        });
      });
    },
    handleDelte(data) {
      // console.log(data)
      this.$confirm(
        "此操作将永久删除" + data.name + "的调整记录, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          deleteIncomeAdjustData(data).then(res => {
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
      getHisDepartmentParam().then(response => {
        this.departmentParams = response.data;
      });
    },
    getPositionParams() {
     let positionParams = [];
      positionParams.push("调整分类");
      positionParams.push("调整年月");
      positionParams.push("调增类型");
      positionParams.push("调增科室");
      positionParams.push("科室院属");
      positionParams.push("科室属性");
      positionParams.push("调增原始值");
      positionParams.push("调增率%");
      positionParams.push("调增值");
      positionParams.push("调减类型");
      positionParams.push("调减科室");
      positionParams.push("科室院属");
      positionParams.push("科室属性");
      positionParams.push("调减原始值");
      positionParams.push("调减率%");
       positionParams.push("调减值");
      positionParams.push("调整原因");
      this.positionParams =positionParams 
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
    },

    // 表格行内 - 保留两位小数并且添加千位分割符
    handleFormat(row, column) {
      // console.log(row)
      let num = Number(row[column["property"]]);
      let n = 2;
      let symbol = ",";
        if(typeof num!=='number')throw new TypeError('num参数应该是一个number类型');
        if(n<0)throw new Error('参数n不应该小于0');
        var hasDot=parseInt(num)!=num;//这里检测num是否为小数，true表示小数
        var m=(n!=undefined&&n!=null)?n:1;
        num=m==0?num.toFixed(m)+'.':hasDot?(n?num.toFixed(n):num):num.toFixed(m);
        symbol=symbol||',';
        num=num.toString().replace(/(\d)(?=(\d{3})+\.)/g,function(match, p1,p2) {
            return p1 + symbol;
        });
        if(n==0||(!hasDot&&!n)){//如果n为0或者传入的num是整数并且没有指定整数的保留位数，则去掉前面操作中的小数位
            num=num.substring(0,num.indexOf('.'));
        }
        return num;
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
