<template>
	<div id="tempinfo">
		<el-dialog
			:title="tempInfoDialogStatus"
			:show-close="showClose"
			:close-on-click-modal="false"
			:visible.sync="tempInfoVisible">
	
			
			

        <div class="left">
        <el-table :data="tableData" row-key="id" border default-expand-all :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column prop="indicator" label="指标">
          </el-table-column>
          <el-table-column prop="weight" label="权重" width="100" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.weight" type="number" size="small" :disabled="true"></el-input>
            </template>
          </el-table-column>
        </el-table>
        </div>

			<div slot="footer" class="dialog-footer">
				<!-- <copy-departments
					ref="copyDeptChild"
					:objectData="formulaData"
					@copyDepts="copyDepts">
				</copy-departments> -->
				<el-button
					@click="closeDialog1"
					class="guo-btn yellow-btn">
					返 回
				</el-button>

			</div>
		</el-dialog>
	</div>
</template>

<script>
import { getMonthTemp } from "@/api/exam";

export default {
  components: {},
  props: {
    tempInfoVisible: {
      type: Boolean
    },
    tempInfoDialogStatus: {
      type: String
    },
    formulaData: {
      type: Object
    }
  },
  name: "tempinfo",
  data() {
    return {
      showClose: false,
      loading: false,
      departmentParams: [],
      remoteLoading: false,
      tableData: [],
      QueryDept: {
        yearmonth: null,
        tempId: null
      }
    };
  },
  mounted() {
    this.QueryDept.yearmonth = this.formulaData.yearmonth;
    this.QueryDept.tempId = this.formulaData.id;
    this.getTemp(this.QueryDept);
  },
  methods: {
    getTemp() {
      getMonthTemp(this.QueryDept).then(res => {
        this.tableData = res.data.targetConfigs;
      });
    },
    closeDialog1() {
      // console.log(1111)
      this.$emit("closeTempInfoDialog");
      // this.$emit("getList");
    }
  }
};
</script>
<style lang="scss">
.el-dialog__body{
  overflow: auto;
}
.left {
    height:600px;
  }
</style>

