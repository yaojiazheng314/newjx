<template>
	<div>
	<el-table
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
		  width="520">
		</el-table-column>
		
		<el-table-column
		  prop="coefficient"
		  label="分配系数"
			fixed
			show-overflow-tooltip
		  width="100">
		</el-table-column>
		<!-- 动态加载填报列 -->
		<el-table-column
			v-for="(item, index) in tableHeaders"
			:key="index"
			:prop="item.prop"
			:label="item.label">
		</el-table-column>
		
		<!-- 合计 -->
		<el-table-column
			align="center"
			label="合计">
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
				<el-tooltip content="查看明细" placement="top-start">
					<span class="pointer" @click="addDetail(scope.row, scope.$index)">
						<i class="el-icon-document" />
					</span>
				</el-tooltip>
			</template>
		</el-table-column>
		<!-- 备注 -->
		<el-table-column
		  prop="remarks"
		  label="备注"
		  width="300">
			<template slot-scope="scope">
				<el-input
					:readonly="true"
					type="textarea"
					:rows="1"
					:autosize="{minRows: 1, maxRows: 4}"
					v-model="scope.row.remarks"/>
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
		>
		</person-edit-dialog>

	</div>
</template>

<script>
import countTo from "vue-count-to";
import { FeedBackReportVOList } from "@/model/feed-back-report-vo";
import { getFeedBackTypeParams } from "@/api/feedBackReport";
import PersonEditDialog from "./DetailDialog";
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
	  typeParams:null,
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
  mounted() {
     this.getFeedBackTypeParams();
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.loading = true;
      const params = this.parentData;
      this.feedBackReportVOList = new FeedBackReportVOList(
        params.feedBackItem,
        params.feedBackDept,
        params.user,
        params.yearmonth,
        "reported"
      );
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
 /* 获取收费类别参数列表 */
    getFeedBackTypeParams() {
      getFeedBackTypeParams().then(res => {
        
        this.typeParams = res.data;
      });
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
    }
  }
};
</script>

<style>
</style>
