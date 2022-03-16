<template>
	<div id="addDepartments">
		<el-dialog
			:title="addDeptDialogStatus"
			:show-close="showClose"
			:close-on-click-modal="false"
			:visible.sync="addDeptVisible">
	
			
			
			<!-- 科室名称快速查询 -->
			<el-input
				v-model="searchDR"
				size="mini"
				placeholder="输入科室名称搜索"
				style="width: 200px; float: right;"/>
			<!-- 适用科室表 -->
			<el-table
				:data="deptData.filter(data => !searchDR || data.deptName.toLowerCase().includes(searchDR.toLowerCase()))"
				style="width: 100%" stripe
				height="400" useVirtual>
				<el-table-column
					prop="department"
					label="科室编码">
				</el-table-column>
				<el-table-column
					prop="deptName"
					label="科室名称">
				</el-table-column>

				<!-- <el-table-column
					label="操作"
					width="100">
					<template slot-scope="scope">
						<el-button
							@click="deleteDept(scope.row)"
							type="text" size="small"
							style="color: #F56C6C;"
							icon="el-icon-delete">移除</el-button>
					</template>
				</el-table-column> -->
			</el-table>
			<div slot="footer" class="dialog-footer">
				<!-- <copy-departments
					ref="copyDeptChild"
					:objectData="formulaData"
					@copyDepts="copyDepts">
				</copy-departments> -->
				<el-button
					@click="closeDialog"
					class="guo-btn yellow-btn">
					返 回
				</el-button>

			</div>
		</el-dialog>
	</div>
</template>

<script>
import { getExamMonthTempOfDept } from "@/api/exam";
import { fuzzyQueryDeptParam } from "@/api/department";
export default {
  components: {},
  props: {
    addDeptVisible: {
      type: Boolean
    },
    addDeptDialogStatus: {
      type: String
    },
    formulaData: {
      type: Object
    }
  },
  name: "AddDepartments",
  data() {
    return {
      showClose: false,
      loading: false,
      departmentParams: [],
      remoteLoading: false,
      fuzzyQueryDeptParams: [], //模糊查询列表
      searchDR: "",
      deptData: [],
      QueryDept: {
        yearmonth: null,
        id: null
      }
    };
  },
  mounted() {
    this.QueryDept.yearmonth = this.formulaData.yearmonth;
    this.QueryDept.id = this.formulaData.id;
    this.getformulaDepts(this.QueryDept);
    // let self = this;
    // this.$nextTick(function() {
    //   document.addEventListener("keyup", function(e) {
    //     //此处填写你的业务逻辑即可
    //     if (e.keyCode == 27) {
    //       this.closeDialog();
    //     }
    //   });
    // });
    // const id = this.formulaData.id
    // if (id !== null && id !== '') {
    // 	this.formulaDept.formula = id
    // 	this.getformulaDepts(this.QueryDept)
    // }
  },
  methods: {
    getformulaDepts(param) {
      var self = this;
      getExamMonthTempOfDept(param).then(response => {
        self.deptData = response.data;
      });
    },

    /* 模糊查询要添加的科室 */
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

    /* 移除科室 */
    deleteDept(data) {
      const delId = data.id;
      let length = this.deptData.length;
      for (let i = 0; i < length; i++) {
        const dept = this.deptData[i].id;
        if (dept === delId) {
          this.deptData.splice(i, 1);
          break;
        }
      }
      let deptName = data.name;
      this.$message({
        message: "移除" + deptName,
        type: "warning",
        duration: 4000,
        showClose: true
      });
    },
    /* 根据科室类型过滤 */
    filterType(value, row) {
      return row.type === value;
    },
    closeDialog() {
      this.$emit("closeAddDeptDialog");
      this.$emit("getList");
    }
  }
};
</script>
