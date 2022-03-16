<template>
	<div class="app-container">
		<div class="filter-container">
			<!-- 接口科室名称模糊查询 -->
			<el-autocomplete
				v-model="listQuery.itfDeptName"
				:fetch-suggestions="querySearchItfDeptName"
				:trigger-on-focus="false"
				placeholder="输入接口科室名称查询"
				style="width: 230px;">
			</el-autocomplete>	
			<!-- <el-select 
                v-model="listQuery.itfDeptName" 
                filterable clearable 
                placeholder="选择或输入HIS接口科室" 
                class="searchClass">
                <el-option 
                    v-for="item in departmentParams" 
                    :key="item.rowIndex" 
                    :label="item.name + '_' + item.hospname+ '_' + item.mzbs" 
                    :value="item.code">
                    <span style="float: left">{{ item.name }}</span>
                    
                    <span style="float: right; color: #8492a6; font-size: 13px">
                        {{ item.mzbs }}
                    </span>
                    <span style="float: right; color: #8492a6; font-size: 13px">
                        {{ item.hospname }}
                    </span>
                </el-option>
            </el-select> -->
			<!-- <el-select 
                v-model="listQuery.deptName" 
                filterable clearable 
                placeholder="选择绩效科室" 
                class="searchClass">
                <el-option 
                    v-for="item in departmentKpiParams" 
                    :key="item.id" 
                    :label="item.name " 
                    :value="item.id">
                    <span style="float: left">{{ item.name }}</span>
                    
                    <span style="float: right; color: #8492a6; font-size: 13px">
                        {{ item.information }}
                    </span>
                    <span style="float: right; color: #8492a6; font-size: 13px">
                        {{ item.type }}
                    </span>
                </el-option>
            </el-select> -->
			<!-- 科室名称模糊查询 -->
			<el-autocomplete
				v-model="listQuery.deptName"
				:fetch-suggestions="querySearchDeptName"
				:trigger-on-focus="false"
				placeholder="输入本系统科室名称查询"
				style="width: 230px;">
			</el-autocomplete>
			<!-- 接口分类 -->
			<el-select 
				v-model="listQuery.syslb" 
				clearable
				placeholder="请选择接口科室来源">
				<el-option
					v-for="item in syslbParams"
					:key="item.value"
					:label="item.value"
					:value="item.value">
				</el-option>
			</el-select>
			<el-select 
                v-model="listQuery.mzbs" 
                filterable clearable 
                placeholder="选择门诊住院" 
                class="searchClass">
                <el-option 
                    v-for="item in mzList" 
                    :key="item.id" 
                    :label="item.name" 
                    :value="item.name">
                   
                </el-option>
            </el-select>
			<el-select 
                v-model="listQuery.hospno" 
                filterable clearable 
                placeholder="选择科室所属" 
                class="searchClass">
                <el-option 
                    v-for="item in hospParams" 
                    :key="item.hospNo" 
                    :label="item.name" 
                    :value="item.hospNo">
                   
                </el-option>
            </el-select>
			<!-- 查询按钮 -->
			<el-button
			 v-waves
			 size="mini"
			 type="primary"
			 icon="el-icon-search"
			 @click="handleFilter">
				查询
			</el-button>
			<!-- 未绑定科室数量 -->
			<el-tag
				type="warning">
				<count-to
					:start-val="0"
					:end-val="unbindingNum"
					:duration="1500"
					:separator="','"
					:decimals="0"
					prefix="剩余: "
					suffix="科室未绑定"
					:autoplay="true"/>
			</el-tag>
			<!-- 快速创建科室 -->
			
		</div>
		<!-- 科室绑定列表 -->
		<!-- itfDepartmentCode itfDepartmentName syslb baseDepartment select1 -->
		<el-table 
			:data="list" 
			v-loading="loading" 
			style="width: 100%">
			<el-table-column 
				prop="itfDepartmentCode" 
				label="接口科室编码">
			</el-table-column>
			<el-table-column 
				prop="subHospName" 
				label="接口科室院属">
			</el-table-column>
			<el-table-column 
				prop="mzbs" 
				label="科室类型">
			</el-table-column>
			<el-table-column 
				prop="itfDepartmentName" 
				label="接口科室名称">
			</el-table-column>
			<el-table-column 
				prop="syslb" 
				label="接口科室来源">
			</el-table-column>
			<el-table-column 
				prop="baseDepartment" 
				label="绑定本系统科室">
				<template slot-scope="scope">
					<!-- 远程查询本地科室 -->
					<el-select
						v-if="scope.row.edit"
						v-model="scope.row.baseDepartment"
						filterable clearable
						remote
						reserve-keyword
						placeholder="名称/类别/编码或'全部'查询"
						:remote-method="remoteMethod"
						:loading="remoteLoading"
						size="small" style="width: 220px;">
						<el-option
							v-for="item in fuzzyQueryDeptParams"
							:key="item.id"
							:label="item.name"
							:value="item.id">
							<span style="float: left">{{ item.name }}</span>
							<span style="float: right; color: #8492a6; font-size: 13px">
								{{ item.type }}
							</span>
						</el-option>
					</el-select>
					<span v-else>
						{{ scope.row.baseDepartmentName }}
					</span>
				</template>
			</el-table-column>
			<el-table-column 
				prop="select1" 
				label="接口特殊标识">
				<template slot-scope="scope">
					<el-input
						v-if="scope.row.edit"
						v-model="scope.row.select1" 
						size="small" style="width: 200px;"/>
					<span v-else>{{ scope.row.select1 }}</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="100">
				<template slot-scope="scope">
					<el-button
						v-if="scope.row.edit"
						type="success" size="mini"
						:loading="scope.row.subLoading"
						@click="bindingDeptLink(scope.row)">
						绑定
					</el-button>
					<el-button 
						v-else
						@click="editDeptLink(scope.row)"
						type="text" size="small">
						编辑
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="pagination-container">
			<el-pagination 
				@size-change="handleSizeChange" 
				@current-change="handleCurrentChange" 
				:current-page="listQuery.currentPage"
				:page-sizes="[10, 15, 20, 25, 100]" 
				:page-size="listQuery.pagesize" 
				layout="total, sizes, prev, pager, next, jumper"
				background
				:total="total">
			</el-pagination>
		</div>
	</div>
</template>

<script>
import waves from "@/directive/waves";
import countTo from "vue-count-to";
import { getHisDepartmentParam } from "@/api/hisDepartment";
import { getDepartmentParam, getDepartmentParamWithId } from "@/api/department";
import { fuzzyQueryDeptParam, fuzzyQueryDeptName } from "@/api/department";
import {
  fuzzyQueryItfDeptName,
  getSyslbParam,
  fetchItfDeptLinkList,
  saveItfDeptLink,
  getBaseHospParam
} from "@/api/binding";
export default {
  name: "Basis",
  directives: { waves },
  components: { countTo },
  data() {
    return {
      list: null,
      total: 0,
      loading: false,
      listQuery: {
        currentPage: 1,
        pagesize: 10,
        itfDeptName: "", //模糊查询接口科室名称
        deptName: "", //模糊查询本系统科室名称
        syslb: "", //接口来源分类
        mzbs: "",
        hospno: ""
      },
      syslbParams: [], //接口来源分类参数
      unbindingNum: 0, //未绑定数量
      departmentParams: [],
      departmentKpiParams: [],
      //模糊查询科室
      remoteLoading: false,
      hospParams: [],
      fuzzyQueryDeptParams: [],
      isAccountCancel: null,
      mzList: [
        {
          id: "门诊",
          name: "门诊"
        },
        {
          id: "住院",
          name: "住院"
        }
      ]
    };
  },
  created() {
    this.getList();
  },
  mounted() {
    this.getSyslbParams();
    this.getDepartmentParams();
    this.getHospParams();
    this.getDepartmentKpiParams();
  },
  methods: {
    getList() {
      var self = this;
      self.loading = true;
      const query = self.listQuery;
      fetchItfDeptLinkList(query).then(response => {
        const deptLinks = response.data.deptLinks;
        self.list = deptLinks.map(v => {
          self.$set(v, "edit", false);
          self.$set(v, "subLoading", false);
          return v;
        });
        self.total = response.data.total;
        self.unbindingNum = response.data.unbindingNumber;
        self.isAccountCancel = response.data.accountStatusIsCancel;
        self.loading = false;
      });
    },
    getDepartmentKpiParams() {
      getDepartmentParam().then(response => {
        this.departmentKpiParams = response.data;
      });
    },
    getDepartmentParams() {
      getHisDepartmentParam().then(response => {
        this.departmentParams = response.data;
      });
    },
    /* 获取接口来源分类参数列表 */
    getSyslbParams() {
      getSyslbParam().then(res => {
        this.syslbParams = res.data;
      });
    },
    /* 获取模糊查询接口科室名称内容 */
    querySearchItfDeptName(queryString, cb) {
      let sugParam = {
        keyword: queryString
      };
      fuzzyQueryItfDeptName(sugParam).then(res => {
        var suggestions = res.data;
        cb(suggestions);
      });
    },
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
    /* 模糊查询全院的科室 */
    remoteMethod(query) {
      if (query !== "") {
        this.remoteLoading = true;
        const search = {
          keyword: query
        };
        fuzzyQueryDeptParam(search).then(res => {
          this.fuzzyQueryDeptParams = res.data;
        });
        this.remoteLoading = false;
      } else {
        this.fuzzyQueryDeptParams = [];
      }
    },
    /* 编辑科室绑定信息 */
    editDeptLinkCom(data) {
      data.edit = !data.edit;
      const baseDepartmentName = data.baseDepartmentName;
      if (baseDepartmentName != undefined && baseDepartmentName != "") {
        this.remoteMethod(baseDepartmentName);
      }
	},
	 editDeptLink(data) {
       var self = this;
      var canOperator = false;
      if (self.isAccountCancel == 0) {
        self
          .$confirm(
            "检测到有取消封账的月份，调整数据会影响报表数据, 是否继续?",
            "提示",
            {
              confirmButtonText: "继续",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
          .then(() => {
            this.editDeptLinkCom(data);
          });
      }
      if (self.isAccountCancel == 2) {
        canOperator = true;
      }

      if (canOperator) {
        this.editDeptLinkCom(data);
      }
    },
    /* 获取院属来源分类参数列表 */
    getHospParams() {
      getBaseHospParam().then(res => {
        this.hospParams = res.data;
      });
    },
    /* 绑定科室 */
    bindingDeptLink(data) {
      data.subLoading = true;
      const deptLink = {
        id: data.id,
        itfDepartmentCode: data.itfDepartmentCode,
        itfDepartmentName: data.itfDepartmentName,
        syslb: data.syslb,
        baseDepartment: data.baseDepartment,
        select1: data.select1
      };
      saveItfDeptLink(data).then(res => {
        this.$notify({
          title: "成功",
          message: data.syslb + data.itfDepartmentName + "绑定成功",
          type: "success",
          duration: 6000
        });
        data.subLoading = true;
        this.getList();
      });
    },
    
    /* 分页查询 */
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
    }
  }
};
</script>
<style>
</style>
