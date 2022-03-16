<template>
	<div>
	<el-table
		ref="tableData"
		style="width: 100%;"
		height="350"
		:data="tableData"
		v-loading="loading"
		highlight-current-row
		:header-cell-style="tableHeaderStyle">
		<el-table-column
			label="序号"
			type="index"
			width="50"
			fixed
			align="center">
			<template slot-scope="scope">
					<span>{{ scope.$index + 1}}</span>
			</template>
		</el-table-column>
		<el-table-column
		  prop="personInfo"
		  label="被分配人员"
			fixed
			show-overflow-tooltip
		  width="220">
		</el-table-column>
		<el-table-column
		  prop="coefficient"
		  label="系数"			
			show-overflow-tooltip
		  width="100">
		  <template slot-scope="scope">
			  <el-input			  
			  	v-model="scope.row.coefficient"
			  ></el-input>
		  </template>
		</el-table-column>
		<el-table-column
		  prop="idCard"
		  label="身份证"
			fixed
			show-overflow-tooltip
		  width="150">
		</el-table-column>
		<!-- 动态加载填报列 -->
		<el-table-column
			v-for="(item, index) in tableHeaders"
			:key="index"
			:prop="item.prop"
			:label="item.label">
			<template slot-scope="scope">
				<el-input-number 
					style="width: 70%;"
					v-model="scope.row[item.prop]"
					size="mini"
          disabled
					controls-position="right"
					@change="(val) => { changeFillVal(val, item.prop) }"/>
			</template>
		</el-table-column>
		
		<!-- 合计 -->
		<el-table-column
			align="center"
			label="合计"
			width="100">
			<template slot-scope="scope">
				<count-to
				  :start-val="0"
				  :end-val="sumRowVal(scope.row)"
				  :duration="300"
				  :separator="','"
					:decimals="2"
				  :autoplay="true" />
			</template>
		</el-table-column>
		<el-table-column
			align="center"
			label="分配明细"
			width="100">
			<template slot-scope="scope">
				<el-tooltip content="追加明细" placement="top-start">
					<span class="pointer" @click="addDetail(scope.row, scope.$index)">
						<i class="el-icon-circle-plus" />
					</span>
				</el-tooltip>
			</template>
		</el-table-column>
		<!-- 备注 -->
		<el-table-column
		  prop="remarks"
		  label="备注"
		  width="500">
			<template slot-scope="scope">
				<el-input
					type="textarea"
					:rows="1"
					:autosize="{minRows: 1, maxRows: 4}"
					v-model="scope.row.remarks"
					:maxlength="200"
					:show-word-limit="scope.row.remarks.length > 99"/>
			</template>
		</el-table-column>
		
		<el-table-column
			align="center"
			label="操作"
			width="100">
			<template slot-scope="scope">
				<el-tooltip content="删除" placement="top-start">
					<span class="pointer" @click="remove(scope.row, scope.$index)">
						<i class="el-icon-delete" />
					</span>
				</el-tooltip>
			</template>
		</el-table-column>
		
		
	</el-table>

  <!-- 编辑框 -->
		<person-edit-dialog 
			v-if="editStatus"
			:dialogStatus="dialogStatus" 
			:dialogFormVisible="dialogFormVisible"
			:typeParams="typeParams"
			:personData="detailData"
			@closedialog="closedialog"
			@updateReport="updateReport"
		>
		</person-edit-dialog>

	</div>
  
</template>

<script>
import countTo from "vue-count-to";
import { FeedBackReportVOList } from "@/model/feed-back-report-vo";
import { deleteDeptFeedBackReport } from "@/api/v2/feedBack/report/index";
import PersonEditDialog from "./DetailDialog";
import { getFeedBackTypeParams } from "@/api/feedBackReport";
export default {
  name: "fbr-ff-report-table",
  components: { countTo, PersonEditDialog },
  props: {
    tableHeaders: Array, // [{ prop, label }]
    parentData: Object // { feedBackDept, user, yearmonth }
  },
  data() {
    return {
      // attr
      loading: false,
      // data
      feedBackReportVOList: {}, // FeedBackReportVO
      editStatus: false,
      addStatus: false,
      dialogStatus: "",
      dialogFormVisible: false,
      detailData: {
        coefficient: null,
        id: null,
        idCard: null,
        person: null,
        remarks: null,
        feedBackDeptId: null,
        userId: null,
        yearmonth: null,
        feedBackItem: [],
        perDeptName: null,
        perName: null,
        perDept: null,
        index: null
      }
    };
  },
  computed: {
    tableData: function() {
      return this.feedBackReportVOList.items2;
    }
  },
  created() {
    this.loadData();
  },
  mounted() {
    this.getFeedBackTypeParams();

    // this.getPositionParams()
  },
  methods: {
    async loadData() {
      this.loading = true;
      const params = this.parentData;
      // console.log(params);
      this.feedBackReportVOList = new FeedBackReportVOList(
        params.feedBackItem,
        params.feedBackDept,
        params.user,
        params.yearmonth,
        "unreported"
      );
      // console.log("feedBackReportVOList", this.feedBackReportVOList);
      await this.feedBackReportVOList.doQuery();
      // 为feedBackReportVOList.items2中元素补充tableHeaders
      const items2 = this.feedBackReportVOList.items2;
      var newItems2 = items2.map(t => {
        let newItem2 = t;
        // 遍历tableHeaders补充t的prop
        for (let i = 0, l = this.tableHeaders.length; i < l; i++) {
          let header = this.tableHeaders[i];
          if (
            newItem2[header.prop] === undefined ||
            newItem2[header.prop] === null
          ) {
            // 新属性值为0
            newItem2[header.prop] = 0;
          }
        }
        return newItem2;
      });
      this.feedBackReportVOList.items2 = newItems2;
      this.loading = false;
    },

    sumRowVal(row) {
      var sumVal = 0;
      for (let i = 0, l = this.tableHeaders.length; i < l; i++) {
        let header = this.tableHeaders[i];
        if (row[header.prop] !== undefined && row[header.prop] !== null) {
          sumVal += row[header.prop];
        }
      }
      return sumVal;
    },

    changeFillVal(val, prop) {
      const perNum = this.tableData.length;
      var val = 0;
      for (let i = 0, l = perNum; i < l; i++) {
        val += this.tableData[i][prop];
      }
      this.$emit("transValToAddPersonBar", val, prop, perNum, {});
    },

    remove(row, index) {
      var removeRow = {};
      for (let i = 0, l = this.tableHeaders.length; i < l; i++) {
        let header = this.tableHeaders[i];
        removeRow[header.prop] = row[header.prop];
      }

      const perNum = this.tableData.length - 1;
      this.$emit("transValToAddPersonBar", 0, "all", perNum, removeRow);
      this.feedBackReportVOList.items2.splice(index, 1);
      this.resortTempPerson();
    },

    /**
     * @description 新增人员转换成feedBackReportVOList.items2中的元素
     * @param {Array} reportVOs
     */
    addReportVOs(reportVOs) {
      const items2 = this.feedBackReportVOList.items2;
      var appendItems2 = [];
      for (let i = 0, l = reportVOs.length; i < l; i++) {
        let rv = reportVOs[i];
        // 临时人员直接加入填报表
        if (rv.person === -1) {
          let item2 = this.generateNewTableRow(rv);
          appendItems2.push(item2);
        } else {
          let item2 = items2.find(t2 => rv.person === t2.person);
          if (item2 === undefined) {
            item2 = this.generateNewTableRow(rv);
            appendItems2.push(item2);
          }
        }
      }
      this.feedBackReportVOList.items2 = items2.concat(appendItems2);
      const perNum = this.feedBackReportVOList.items2.length;
      this.$emit("transValToAddPersonBar", 0, "justAddPerNum", perNum, {});
      this.resortTempPerson();
      this.$nextTick(() => {
        this.$refs.tableData.bodyWrapper.scrollTop = this.$refs.tableData.bodyWrapper.scrollHeight;
      });
    },
    /* 获取收费类别参数列表 */
    getFeedBackTypeParams() {
      getFeedBackTypeParams().then(res => {
        // console.log(res.data)
        this.typeParams = res.data;
      });
    },
    /**
     * @description 为临时人员排序
     */
    resortTempPerson() {
      var tempNo = 1;
      for (let i = 0, l = this.tableData.length; i < l; i++) {
        let row = this.tableData[i];
        if (row.person <= -1) {
          row.person = tempNo * -1;
          row.personInfo = `${tempNo}_临时人员`;
          tempNo++;
        }
      }
    },

    /**
     * @description {feedBackReportVOList.items2[0]} new table row
     * @param {Object} reportVO
     */
    generateNewTableRow(reportVO) {
      // console.log(reportVO);
      // let remark = null
      // if(reportVO.person === -1){
      // 	remark =reportVO.remarks
      // }
      var newRow = {
        person: reportVO.person,
        personInfo: `${reportVO.perCode}_${reportVO.perName} ${
          reportVO.perDeptName
        }`,
        remarks: `${reportVO.remarks}`,
        idCard: reportVO.idCard,
        coefficient: 0,
        id: reportVO.id,
        perDept: reportVO.perDept,
        perName: reportVO.perName,
        perDeptName: reportVO.perDeptName
      };
      for (let i = 0, l = this.tableHeaders.length; i < l; i++) {
        let header = this.tableHeaders[i];
        newRow[header.prop] = 0;
      }
      return newRow;
    },

    // 获取用于存储的 feedBackReport列表
    getSaveData() {
      const feedBackItems = this.tableHeaders;
      this.feedBackReportVOList.transItems2ToReportList(feedBackItems);
      const data = this.feedBackReportVOList.reportList;
      // console.log(feedBackItems);
      return data;
    },

    addDetail(data, index) {
      this.detailData.coefficient = data.coefficient;
      this.detailData.id = data.id;
      this.detailData.idCard = data.idCard;
      this.detailData.person = data.person;
      this.detailData.remarks = data.remarks;
      this.detailData.feedBackItem = this.tableHeaders;
      this.detailData.feedBackDeptId = this.feedBackReportVOList.feedBackDeptId;
      this.detailData.userId = this.feedBackReportVOList.userId;
      this.detailData.yearmonth = this.feedBackReportVOList.yearmonth;
      this.detailData.perDeptName = data.perDeptName;
      this.detailData.perName = data.perName;
      this.detailData.perDept = data.perDept;
      this.detailData.index = index;
      // console.log(this.detailData)
      // reportList
      this.editStatus = true;
      this.addStatus = true;
      // this.dialogStatus = '收入调整单'
      this.dialogFormVisible = true;
    },
    closedialog() {
      this.editStatus = false;
      this.dialogStatus = "";
      this.dialogFormVisible = false;
      this.addStatus = false;
    },
    // table style
    tableHeaderStyle({ row, column, rowIndex, columnIndex }) {
      return `width: 100%;
		          background-color: #F5F5F5;
		          border-top: 1px solid #d3e1f0;
		          border-bottom: 1px solid #d3e1f0;
		          color: #606266;
		          font-weight: normal;`;
    },

    updateReport(reportData) {
      const { index, reportItem } = reportData;
      reportItem.map(item => {
        this.feedBackReportVOList.items2[index][`${item.prop}`] = item.sumVal;
        this.changeFillVal(item.sumVal, item.prop);
      });
    }
  }
};
</script>

<style>
</style>
