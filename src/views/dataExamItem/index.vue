<template>
	<div class="app-container">
		<div class="filter-container">
			<el-select 
				v-model="listQuery.bnsDataItem" 
				filterable clearable 
				placeholder="选择考核导入核算因子"
				class="searchClass">
				<el-option 
					v-for="item in examItemParams" 
					:key="item.id" 
					:label="item.name" 
					:value="item.id">
					<span style="float: left">{{ item.name }}</span>
					<span style="float: right; color: #8492a6; font-size: 13px">
						{{ item.type }}
					</span>
				</el-option>
			</el-select>
			<el-select 
				v-model="listQuery.person" 
				filterable clearable 
				placeholder="选择或输入姓名" 
				class="searchClass">
				<el-option 
					v-for="item in personParams" 
					:key="item.id" 
					:label="item.name + '_' + item.departmentName" 
					:value="item.id">
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
			<el-date-picker
				v-model="listQuery.yearmonth"
				type="month"
				placeholder="选择月"
				format="yyyy 年 M 月"
				value-format="yyyy-MM"
				:clearable="false"
				:editable="false"
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
				content="提取全部考核结果" 
				placement="top-start">
				<el-button 
					type="warning" 
					icon="el-icon-magic-stick"
					size="mini" 
					:disabled="accountStatus"
					v-loading.fullscreen.lock="drawAllLoading"
					element-loading-text="努力拉取考核结果中, 请稍候"
					element-loading-spinner="el-icon-loading"
					element-loading-background="rgba(0, 0, 0, 0.7)"
					@click="drawAllExamResult" 
					plain
					circle>
				</el-button>
			</el-tooltip>
		</div>
		
		<el-table 
			:data="list" 
			v-loading="listLoading" 
			stripe
			style="width: 100%">
			<el-table-column prop="bnsDataItemName" label="因子名称">
			</el-table-column>
			<el-table-column 
				prop="type" label="适用类别" 
				:filters="[{ text: '科室', value: '科室' },
									 { text: '人员', value: '人员' }]"
			  :filter-method="filterType" filter-placement="bottom-end">
				<template slot-scope="scope">
					<el-tag 
						:type="scope.row.type === '科室' ? 
						'info' : 'warning'" 
						disable-transitions>{{ scope.row.type }}</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="linkNum" label="适用数量">
				<template slot-scope="scope">
					<span 
						v-if="scope.row.linkNum === 0"
						class="example-nodata">
						暂无
					</span>
					<span
						v-else-if="scope.row.type === '科室'"
						class="example-department">
						{{ scope.row.linkNum }}
					</span>
					<span
						v-else
						class="example-person">
						{{ scope.row.linkNum }}
					</span>
				</template>
			</el-table-column>
			<el-table-column prop="reportNum" label="已提取">
				<template slot-scope="scope">
					<span 
						v-if="scope.row.reportNum === 0"
						class="example-nodata">
						暂无
					</span>
					<span
						v-else-if="scope.row.type === '科室'"
						class="example-department">
						{{ scope.row.reportNum }}
					</span>
					<span
						v-else
						class="example-person">
						{{ scope.row.reportNum }}
					</span>
				</template>
			</el-table-column>
			<el-table-column prop="sumVal" label="总计">
				<template slot-scope="scope">
					<span
						v-if="scope.row.type === '科室'"
						class="example-department">
						{{ scope.row.sumVal }}
					</span>
					<span
						v-else
						class="example-person">
						{{ scope.row.sumVal }}
					</span>
				</template>
			</el-table-column>
			<el-table-column prop="avgVal" label="平均值">
				<template slot-scope="scope">
					<span
						v-if="scope.row.type === '科室'"
						class="example-department">
						{{ scope.row.avgVal }}
					</span>
					<span
						v-else
						class="example-person">
						{{ scope.row.avgVal }}
					</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="操作" width="200">
				<template slot-scope="scope">
					<el-tag v-if="accountStatus" type="success">
						已封账
					</el-tag>
					<el-button 
						v-else
						v-waves 
						@click="drawExamData(scope.row)"
						:loading="scope.row.drawLoading"
						icon="el-icon-upload"
						type="text" size="small">
						提 取
					</el-button> 
					<el-button 
						v-waves 
						@click="routerTo(scope.row)"
						icon="el-icon-document"
						style="color: #2B91AF;"
						type="text" size="mini">
						明 细
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
	</div>
</template>

<script>
import {
  getExamItemList,
  getExamItemParam,
  drawExamItemData,
  oneKeyDraw,
  supplementDeptOrPer,
  resetDeptOrPer
} from "@/api/bnsDataItemReport";
import { getPersonParam } from "@/api/person";
import { getDepartmentParam, getBaseCurrentYearmonth } from "@/api/department";
import { formatDate } from "@/utils/date";
import waves from "@/directive/waves";
export default {
  name: "ExamItem",
  directives: { waves },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        currentPage: 1,
        pagesize: 10,
        bnsDataItem: null,
        person: null,
        department: null,
        yearmonth: "",
        userID: null
      },
      accountStatus: false,
      examItemParams: [],
      personParams: [],
      departmentParams: [],
      drawAllLoading: false
    };
  },
  mounted() {
    this.setDefaultYearmonth();
    this.getBaseCurrentYearmonth();
    this.getUserInfo();

    this.getExamItemParams();
    this.getPersonParams();
    this.getDepartmentParams();
    
  },
  methods: {
    getBaseCurrentYearmonth() {
      var self = this;
      self.listLoading = true;
      getBaseCurrentYearmonth().then(response => {
				self.listQuery.yearmonth = response.data;
				this.getList();
        self.listLoading = false;
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
      getExamItemList(query).then(response => {
        self.accountStatus = response.data.accountStatus;
        const items = response.data.examItems;
        self.list = items.map(v => {
          self.$set(v, "drawLoading", false);
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
    getExamItemParams() {
      var self = this;
      const query = self.listQuery;
      getExamItemParam(query).then(response => {
        this.examItemParams = response.data;
      });
    },
    getPersonParams() {
      getPersonParam().then(response => {
        this.personParams = response.data;
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
    drawExamData(data) {
      var self = this;
      data.drawLoading = true;
      const ym = self.listQuery.yearmonth;
      const examItem = {
        item: data.bnsDataItem,
        yearmonth: ym,
        //记录操作者
        userID: self.$store.getters.userID
      };
      drawExamItemData(examItem).then(response => {
        let resultStatus = response.status;
        if (resultStatus === 520) {
          data.drawLoading = false;
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
          self.$notify({
            title: "成功",
            message: data.bnsDataItemName + "数据提取完成",
            type: "success",
            duration: 6000
          });
          data.drawLoading = false;
          self.getList();
        }
      });
    },
    drawAllExamResult() {
      var self = this;
      self.drawAllLoading = true;
      const drawAllData = {
        item: self.listQuery.bnsDataItem,
        person: self.listQuery.person,
        department: self.listQuery.department,
        yearmonth: self.listQuery.yearmonth,
        userID: self.$store.getters.userID
      };
      oneKeyDraw(drawAllData).then(response => {
        let resultStatus = response.status;
        if (resultStatus === 520) {
          self.drawAllLoading = false;
          self.$confirm(response.msg, "提示", {
            type: "warning",
            center: true
          });
        } else {
          self.$notify({
            title: "成功",
            message: "全部考核结果拉取完成",
            type: "success",
            duration: 6000
          });
          self.drawAllLoading = false;
          self.getList();
        }
      });
    },
    /* 考核导入数据明细查询 */
    routerTo(data) {
      var self = this;
      const ym = self.listQuery.yearmonth;
      let type = data.type;
      self.$router.push({
        path: "/itemReport/examImportData",
        query: {
          itemID: data.bnsDataItem,
          itemName: data.bnsDataItemName,
          ym: ym,
          type: type
        }
      });
    }
  }
};
</script>
