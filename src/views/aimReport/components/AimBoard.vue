<template>
  <div class="board-column">
    <div class="board-column-header">
      {{ headerText }}
    </div>
    <draggable
      :list="list"
      v-bind="$attrs"
      class="board-column-content"
      :set-data="setData">
      <div 
				v-for="aimProgress in list" 
				:key="aimProgress.id" 
				class="board-item">
				{{ aimProgress.yearmonth }}
        {{ aimProgress.aimConfigName }} 
				<el-button 
					v-if="headerText=='进行中'"
					type="primary" style=" margin-top: 15px; float: right;"
					size="mini" plain @click="reportAimProgress(aimProgress)"
					icon="el-icon-edit">
					记录进度</el-button>
				<el-button
					v-if="headerText=='已完成'"
					type="primary" style=" margin-top: 15px; float: right;"
					size="mini" plain @click="checkAimProgressReport(aimProgress)"
					icon="el-icon-files">
					进度报告</el-button>
      </div>
    </draggable>
		<!-- 进度汇报 -->
		<report-dialog
			v-if="reportStatus"
			:dialogStatus="dialogStatus" 
			:dialogVisible="dialogVisible"
			:aimProgressData="aimProgressData"
			@closeDialog="closeDialog">
		</report-dialog>
		<!-- 进度报告列表 -->
		<report-list-dialog
			v-if="reportListStatus"
			:reportsStatus="reportsStatus" 
			:reportsVisible="reportsVisible"
			:aimProgressData="aimProgressData"
			:editFlg="editFlg"
			@closeReportListDialog="closeReportListDialog">
		</report-list-dialog>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import ReportDialog from './ReportDialog'
import ReportListDialog from './ReportListDialog'
export default {
  name: 'AimBoard',
  components: {
    draggable,
		ReportDialog,
		ReportListDialog
  },
  props: {
    headerText: {
      type: String,
      default: 'Header'
    },
		workingFlg: {
			type: Boolean,
			default: false
		},
    options: {
      type: Object,
      default() {
        return {}
      }
    },
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
	data() {
		return {
			/* 目标实体 */
			aimProgressData: {},
			/* 进度报告dialog */
			reportStatus: false,
			dialogVisible: false,
			dialogStatus: '',
			/* 进度报告列表 */
			reportListStatus: false,
			reportsVisible: false,
			reportsStatus: '',
			editFlg: true
		}
	},
  methods: {
		/* 火狐浏览器bug */
    setData(dataTransfer) {
      dataTransfer.setData('Text', '')
    },
		/* 目标进度汇报 */
		reportAimProgress(data) {
			this.reportStatus = true
			this.dialogVisible = true
			this.dialogStatus = data.yearmonth+data.aimConfigName+'进度记录'
			this.aimProgressData = {
				id: data.id,
				yearmonth: data.yearmonth
			}
		},
		/* 关闭进度报告 */
		closeDialog() {
			this.reportStatus = false
			this.dialogVisible = false
			this.dialogStatus = ''
			this.aimProgressData = {}
		},
		/* 查询目标进度报告列表 */
		checkAimProgressReport(data) {
			this.reportListStatus = true
			this.reportsVisible = true
			this.reportsStatus = data.yearmonth+data.aimConfigName+'进度报告'
			this.aimProgressData = {
				id: data.id,
				reportType: data.reportType
			}
		},
		/* 关闭进度报告列表 */
		closeReportListDialog() {
			this.reportListStatus = false
			this.reportsVisible = false
			this.reportsStatus = ''
			this.aimProgressData = {}
		}
  }
}
</script>
<style lang="scss" scoped>
.board-column {
  min-width: 450px;
  min-height: 100px;
  height: auto;
  overflow: hidden;
  background: #f0f0f0;
  border-radius: 8px;

  .board-column-header {
    height: 50px;
    line-height: 50px;
    overflow: hidden;
    padding: 0 20px;
    text-align: center;
    background: #333;
    color: #fff;
    border-radius: 8px 8px 0 0;
  }

  .board-column-content {
    height: auto;
    overflow: hidden;
    border: 6px solid transparent;
    min-height: 60px;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;

    .board-item {
      cursor: pointer;
      width: 100%;
      height: 64px;
      margin: 5px 0;
      background-color: #fff;
      text-align: left;
      line-height: 54px;
      padding: 5px 10px;
      box-sizing: border-box;
      box-shadow: 0px 1px 2px 0 rgba(0, 0, 0, 0.2);
			border-radius: 5px;
    }
  }
}
</style>