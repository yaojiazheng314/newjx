<template>
	<div class="app-container">
		<div class="filter-container">
			<el-select 
				v-model="listQuery.bnsDataItem" 
				filterable clearable 
				placeholder="选择手动填报核算因子"
				class="searchClass">
				<el-option 
					v-for="item in handleItemParams" 
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
						{{ prefix }}{{ scope.row.linkNum }}{{ dSuffix }}</span>
					<span 
						v-else
						class="example-person">
						{{ prefix }}{{ scope.row.linkNum }}{{ pSuffix }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="reportNum" label="已填报">
				<template slot-scope="scope">
					<span 
						v-if="scope.row.reportNum === 0"
						class="example-nodata">
						暂无
					</span>
					<span
						v-else-if="scope.row.type === '科室'"
						class="example-department">
						{{ prefix }}{{ scope.row.reportNum }}{{ dSuffix }}
					</span>
					<span
						v-else
						class="example-person">
						{{ prefix }}{{ scope.row.reportNum }}{{ pSuffix }}
					</span>
				</template>
			</el-table-column>
			<el-table-column prop="sumVal" label="总计">
				<template slot-scope="scope">
					<count-to
						v-if="scope.row.type === '科室'"
					  :start-val="startVal"
					  :end-val="scope.row.sumVal"
					  :duration="duration"
					  :decimals="decimals"
					  :separator="separator"
					  :autoplay="true"
						class="example-department"/>
					<count-to
						v-else
					  :start-val="startVal"
					  :end-val="scope.row.sumVal"
					  :duration="duration"
					  :decimals="decimals"
					  :separator="separator"
					  :autoplay="true"
						class="example-person"/>
				</template>
			</el-table-column>
			<el-table-column prop="avgVal" label="平均值">
				<template slot-scope="scope">
					<count-to
						v-if="scope.row.type === '科室'"
					  :start-val="startVal"
					  :end-val="scope.row.avgVal"
					  :duration="duration"
					  :decimals="decimals"
					  :separator="separator"
					  :autoplay="true"
						class="example-department"/>
					<count-to
						v-else
					  :start-val="startVal"
					  :end-val="scope.row.avgVal"
					  :duration="duration"
					  :decimals="decimals"
					  :separator="separator"
					  :autoplay="true"
						class="example-person"/>
				</template>
			</el-table-column>
			<el-table-column align="center" label="操作" width="300">
				<template slot-scope="scope">
					<el-tag v-if="accountStatus" type="success">
						已封账
					</el-tag>
					<el-button 
						v-else v-waves 
						@click="routerTo(scope.row, false)"
						type="primary" size="mini" plain>
						填报
					</el-button>
					<el-button 
						v-waves 
						@click="routerTo(scope.row, true)"
						type="primary" size="mini" plain>
						批量填报
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
import { getHandleItemList, getHandleItemParam } from "@/api/bnsDataItemReport";
import { getPersonParam } from "@/api/person";
import { getAccountStatusForAdjust } from "@/api/accountStatus";
import { getDepartmentParam,getBaseCurrentYearmonth } from "@/api/department";
import { formatDate } from "@/utils/date";
import waves from "@/directive/waves";
import countTo from "vue-count-to";
export default {
  name: "HandleItem",
  directives: { waves },
  components: { countTo },
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
        yearmonth: null,
        userID: null
      },
      accountStatus: false,
      handleItemParams: [],
      personParams: [],
      departmentParams: [],
      startVal: 0,
      duration: 1500,
      decimals: 2,
      separator: ",",
      dSuffix: " 科室",
      pSuffix: " 人员",
      prefix: "共 ",
      autoplay: true,
      isAccountCancel: null
    };
  },
  mounted() {
    // this.setDefaultYearmonth();
    this.getUserInfo();    
    this.getHandleItemParams();
    this.getPersonParams();
    this.getDepartmentParams();
		this.getAccountStatusForAll();
		this.getBaseCurrentYearmonth();
		
  },
  methods: {
		 getBaseCurrentYearmonth() {
      var self = this;
      getBaseCurrentYearmonth().then(response => {
				// var defYearmonth = response.data;
        // const ymStr = formatDate(defYearmonth, "yyyy-MM");
				self.listQuery.yearmonth =  response.data;
				this.getList();
      });
    },
    getAccountStatusForAll() {
      var self = this;
      self.listLoading = true;
      const query = self.listQuery;
      getAccountStatusForAdjust(query).then(response => {
        self.isAccountCancel = response.data;
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
			console.log(query);
      //   getAccountStatusForAdjust(query).then(response => {
      //     self.isAccountCancel = response.data;
      //     self.listLoading = false;
      //   });
      getHandleItemList(query).then(response => {
        self.accountStatus = response.data.accountStatus;
        self.isAccountCancel = response.data.accountStatusIsCancel;
        self.list = response.data.handleItems;
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
    getHandleItemParams() {
      var self = this;
      const query = self.listQuery;
      getHandleItemParam(query).then(response => {
        this.handleItemParams = response.data;
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
    comonRouterTo(data, excelFlag) {
      var self = this;
      const ym = self.listQuery.yearmonth;
      let type = "";
      if (excelFlag) {
        if (data.type === "科室") {
          type = "excelDept";
        } else if (data.type === "人员") {
          type = "excelPer";
        }
      } else {
        type = data.type;
      }
      const accountStatus = self.accountStatus;
      self.$router.push({
        path: "/itemReport/handleFill",
        query: {
          itemID: data.bnsDataItem,
          itemName: data.bnsDataItemName,
          ym: ym,
          type: type,
          accountStatus: accountStatus
        }
      });
    },
    routerTo(data, excelFlag) {
      var self = this;
      var canOperator = false;
      if (self.isAccountCancel == 0) {
        self
          .$confirm(
            "该月已取消封账，调整数据会影响报表数据, 是否继续?",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
          .then(() => {
            this.comonRouterTo(data, excelFlag);
          });
      }
      if (self.isAccountCancel == 2) {
        canOperator = true;
      }

      if (canOperator) {
        this.comonRouterTo(data, excelFlag);
      }
    }
  }
};
</script>
