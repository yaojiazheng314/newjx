<template>
	<div id="addPeople">
		<el-dialog
			:title="addPerDialogStatus"
			:show-close="showClose"
			:close-on-click-modal="false"
			:visible.sync="addPerVisible"
			width="1000px">
			<!-- 输入 类别 或名称 或编码 模糊查询全院人员 -->
			<el-select
				v-model="personParams"
				value-key="id"
				multiple
				filterable
				remote
				reserve-keyword
				placeholder="输入姓名/编码/状态/职位/科室或'全部'查询"
				:remote-method="remoteMethod"
				:loading="remoteLoading"
				size="small"
				class="fuzzyQuery">
				<el-option
					v-for="item in fuzzyQueryPerParams"
					:key="item.id"
					:label="item.name"
					:value="item">
					<span style="float: left">{{ item.name }}</span>
					<span style="margin-left: 15px; color: #8492a6; font-size: 13px">
						{{ item.positionName }}
					</span>
					<span style="float: right; color: #8492a6; font-size: 13px">
						{{ item.departmentName }}
					</span>
				</el-option>
			</el-select>
			<!-- 添加选中 -->
			<el-tooltip
				effect="light"
				content="添加选中的人员"
				placement="top-start">
				<el-button
					size="mini" type="primary"
					style="margin-left: 5px;"
					icon="el-icon-plus"
					@click="addChoosenData"
					circle plain></el-button>
			</el-tooltip>
			<!-- 添加全部 -->
			<el-tooltip
				effect="light"
				content="添加查询的全部人员"
				placement="bottom">
				<el-button
					size="mini" type="info"
					style="margin-left: 5px;"
					icon="el-icon-caret-bottom"
					@click="addAllFuzzyQueryData"
					circle plain></el-button>
			</el-tooltip>
			<!-- 清空科室列表 -->
			<el-tooltip
				effect="light"
				content="清空"
				placement="right-start">
				<el-button
					size="mini" type="warning"
					style="margin-left: 5px;"
					icon="el-icon-delete-solid"
					@click="cleanPerData"
					circle plain></el-button>
			</el-tooltip>
			<!-- <el-date-picker
				v-model="coefPeople.yearMonth"
				type="month"
				placeholder="选择月"
				format="yyyy 年 M 月"
				value-format="yyyy-MM"
				:clearable="false"
				:editable="false"
				@change="handleFilter"
				class="searchClass">
			</el-date-picker> -->
			<!-- 科室名称快速查询 -->
			<el-input
				v-model="searchDR"
				size="mini"
				placeholder="输入科室名称搜索"
				style="width: 200px; float: right;"/>
				<!-- 适用人员表 -->
			<el-table
				:data="perData.filter(data => !searchDR || data.departmentName.toLowerCase().includes(searchDR.toLowerCase()))"
				style="width: 100%"	stripe
				height="400" useVirtual>
				<el-table-column
					prop="code"
					width="120"
					label="编码">
				</el-table-column>
				<el-table-column
					prop="name"
					width="120"
					label="姓名">
				</el-table-column>
				<el-table-column
					prop="status"
					width="120"
					label="状态"
					:filters="[{ text: '在职', value: '在职' },
										 { text: '编外', value: '编外' },
										 { text: '离职', value: '离职' },
										 { text: '长期病休', value: '长期病休' },
										 { text: '返聘', value: '返聘' },
										  { text: '其他', value: '其他' }]"
					:filter-method="filterStatus" filter-placement="bottom-end">
				</el-table-column>
				<el-table-column
					prop="departmentName"
					width="120"
					label="所属科室">
				</el-table-column>
				<el-table-column
					prop="positionName"
					width="120"
					label="职位">
				</el-table-column>
				<el-table-column prop="value" label="权重值">
					<template slot-scope="scope">
						<el-input-number
							v-if="scope.row.edit"
							v-model="scope.row.value"
							controls-position="right"
							placeholder="填报人员权重"
							size="mini"
							style="width: 150px;"
							></el-input-number>
						<span
							v-else
							@click="scope.row.edit = !scope.row.edit">
								{{ scope.row.value }}</span>
					</template>
				</el-table-column>
				<el-table-column
					label="操作"
					width="100">
					<template slot-scope="scope">
						<el-button
							@click="deletePer(scope.row)"
							type="text" size="small"
							style="color: #F56C6C;"
							icon="el-icon-delete">移除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div slot="footer" class="dialog-footer">
				<copy-people
					ref="copyPerChild"
					:objectData="coefData"
					@copyPers="copyPers">
				</copy-people>

				<el-select v-model="runYearMonth" placeholder="请选择要核算的年月">
					<el-option
					v-for="item in runYearMonthList"
					:key="item"
					:label="item"
					:value="item">
					</el-option>
				</el-select>
				<el-button
					@click="closeDialog"
					class="guo-btn yellow-btn">
					返 回
				</el-button>
				<el-button
					type="primary"
					@click="saveCoefPeople"
					:loading="loading"
					class="guo-btn light-blue-btn">
					保 存
				</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { savePeople, getPeople, copyPeople } from "@/api/bnsCoef";
import CopyPeople from "@/components/CopyPeople";
import { formatDate } from '@/utils/date'
import { fuzzyQueryPerParam } from "@/api/person";
export default {
  components: { CopyPeople },
  props: {
    addPerVisible: {
      type: Boolean
    },
    addPerDialogStatus: {
      type: String
    },
    coefData: {
      type: Object
    },

    runYearMonthList: {
      type: Array
    }
  },
  name: "AddPeople",
  data() {
    return {
      showClose: false,
      loading: false,
      remoteLoading: false, //模糊查询loading
      fuzzyQueryPerParams: [],
      searchDR: "", //科室名称关键字快速筛选
      personParams: [],
      perData: [],
      coefPeople: {
        coef: null,
        people: []
      },

      runYearMonth: ""
    };
  },
  mounted() {
    // this.setDefaultYearmonth();
    const id = this.coefData.id;
    if (id !== null && id !== "") {
      this.coefPeople.coef = id;
      this.getCoefPeople(this.coefPeople);
    }
  },
  methods: {
    // setDefaultYearmonth() {
    //   var self = this;
    //   const month = new Date().getMonth();
    //   var defYearmonth = new Date(new Date().setMonth(month, 1));
    //   const ymStr = formatDate(defYearmonth, "yyyy-MM");
    //   this.coefPeople.yearMonth = ymStr;
    // },
    handleFilter() {
		const id = this.coefData.id;
      if (id !== null && id !== "") {
        this.coefPeople.coef = id;
        this.getCoefPeople(this.coefPeople);
      }
    },
    saveCoefPeople() {
      var self = this;
      const runYearMonth = self.runYearMonth;
      if (!runYearMonth) {
        self.$notify({
          title: "缺少必填",
          message: "请选择核算年度",
          type: "error",
          duration: 2000
        });
        return false;
      }
      self.loading = true;
      self.addToCoefPeople();
      let data = self.coefPeople;
      data.runYearMonth = runYearMonth;
      savePeople(data).then(response => {
        let resultStatus = response.status;
        if (resultStatus === 520) {
          self.loading = false;
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
            message: response.msg,
            type: "success",
            duration: 6000
          });
          /* 清空存储的人员重新拉取数据 */
          self.coefPeople.people = [];
          let param = {
            coef: data.coef
          };
          self.getCoefPeople(param);
          self.loading = false;
          self.$emit("getList");
        }
      });
    },
    addToCoefPeople() {
      const length = this.perData.length;
      // console.log(this.perData)
      for (let i = 0; i < length; i++) {
        const per = this.perData[i];
        //取出有填报值的人员数据
        const coefVal = per.value;
        if (coefVal !== null) {
          //转换成coefPerValue
          const coefPerValue = {
            person: per.id,
            personName: per.name,
            departmentName: per.departmentName,
            department: per.department,
            value: coefVal
          };
          this.coefPeople.people.push(coefPerValue);
        }
      }
      // console.log(this.coefPeople.people)
    },
    getCoefPeople(data) {
      var self = this;
      getPeople(data).then(response => {
        const coefPerData = response.data;
        self.perData = coefPerData.map(v => {
          self.$set(v, "edit", false);
          return v;
        });
      });
    },
    copyPers(copyData) {
      var self = this;
      const loading = self.$loading({
        lock: true,
        text: "正在复制数据，请稍候",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      copyPeople(copyData).then(response => {
        let resultStatus = response.status;
        if (resultStatus === 520) {
          loading.close();
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
            message: response.msg,
            type: "success",
            duration: 6000
          });
          self.peopleParams = [];
          self.coefPeople.people = [];
          self.getCoefPeople(self.coefPeople);
          self.$emit("getList");
          self.refreshCopyPeople("coef");
          loading.close();
        }
      });
    },
    refreshCopyPeople(flag) {
      var self = this;
      self.$refs.copyPerChild.refreshCopyParams(flag);
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
    /* 筛选人员转态 */
    filterStatus(value, row) {
      return row.status === value;
    },
    /* 添加选择的人员 */
    addChoosenData() {
      var self = this;
      let count = 0;
      const choosenData = self.personParams;
      let length = choosenData.length;
      for (let i = 0; i < length; i++) {
        const data = choosenData[i];
        var isContained = self.contains(data);
        if (!isContained) {
          //新增的权重适用人员添加value属性 渲染编辑框edit
          self.$set(data, "edit", true);
          self.$set(data, "value", 0);
          self.perData.push(data);
          count++;
        }
      }
      self.$message({
        message: "已添加" + count + "名人员",
        type: "success",
        duration: 4000,
        showClose: true
      });
    },
    /* 添加全部模糊查询的人员 */
    addAllFuzzyQueryData() {
      var self = this;
      let count = 0;
      const choosenData = self.fuzzyQueryPerParams;
      let length = choosenData.length;
      for (let i = 0; i < length; i++) {
        const data = choosenData[i];
        var isContained = self.contains(data);
        if (!isContained) {
          //新增的权重适用科室添加value属性 渲染编辑框edit
          self.$set(data, "edit", true);
          self.$set(data, "value", null);
          self.perData.push(data);
          // console.log(self.perData)
          count++;
        }
      }
      self.$message({
        message: "已添加" + count + "名人员",
        type: "success",
        duration: 4000,
        showClose: true
      });
    },
    /* 判断人员列表中是否包含 */
    contains(item) {
      const paramID = item.id;
      const perArr = this.perData.map(v => {
        return v.id;
      });
      const length = perArr.length;
      for (let i = 0; i < length; i++) {
        if (perArr[i] === paramID) {
          return true;
        }
      }
      return false;
    },
    /* 清空人员列表 */
    cleanPerData() {
      this.perData = [];
    },
    /* 将人员从人员列表中移除 */
    deletePer(data) {
      const delId = data.id;
      let length = this.perData.length;
      for (let i = 0; i < length; i++) {
        const per = this.perData[i].id;
        if (per === delId) {
          this.perData.splice(i, 1);
          break;
        }
      }
      let str = data.departmentName + data.name;
      this.$message({
        message: "移除" + str,
        type: "warning",
        duration: 4000,
        showClose: true
      });
    },
    closeDialog() {
      this.$emit("closeAddPerDialog");
      this.$emit("getList");
      this.$emit("getCoefParams");
    }
  }
};
</script>
