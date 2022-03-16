<template>
	<div 
		id="departmentInfoForm"
		v-show="formVisible"
		class="dashboard-container">
		<el-row :gutter="20">
			<el-col :span="14">
					<el-form
						label-position="left" inline>
						<!-- 1.目标名称 2.责任科室 3.责任人 4.验收日期 -->
						<el-form-item>
							<el-form-item label="名称(代码)" prop="name">
								{{ aimConfigForm.name }}
							</el-form-item>
							<el-form-item label="责任科室" prop="respDeptName">
								{{ aimConfigForm.respDeptName }}
							</el-form-item>
							<el-form-item label="责任人" prop="respPerson">
								{{ aimConfigForm.respPerName }}
							</el-form-item>
						</el-form-item>
						<!-- 目标执行说明 -->
						<el-form-item label="执行说明" prop="requirement">
							{{ aimConfigForm.requirement }}
						</el-form-item>
						<!-- 汇报类型为自主汇报 显示预期结果 -->
						<el-form-item 
							v-if="aimConfigForm.reportType == independentReport"
							label="预期结果:" 
							prop="expectedResult">
							<span>{{ aimConfigForm.expectedResult }}</span>
						</el-form-item>
						<!-- 预期值 实际值 -->
						<el-form-item 
							v-if="aimConfigForm.reportType == objectiveData"
							label="预期值:" style="width: 150px;"
							prop="expectedValue">
							<count-to
							  :start-val="0"
							  :end-val="aimConfigForm.expectedValue"
							  :duration="2000"
							  :autoplay="true"
								class="example-department"/>
						</el-form-item>
					</el-form>
			</el-col>
			<el-col :span="10">
				<aim-child-weight
					v-if="waterfallStatus"
					:aimConfigParent="aimConfigForm.parent" />
			</el-col>
		</el-row>
		<el-row>
			<aim-progress-line
				v-if="lineStatus"
				:aimConfig="aimConfigForm.id"></aim-progress-line>
		</el-row>
		<el-row>
			<!-- 进度表 -->
			<el-card class="box-card">
				<el-table
					:data="aimProgressList"
					style="width: 100%;">
					<el-table-column
						prop="yearmonth"
						label="时间">
					</el-table-column>
					<el-table-column
						prop="progress"
						label="完成度">
						<template slot-scope="scope">
							<el-progress 
								:percentage="scope.row.progress">
							</el-progress>
						</template>
					</el-table-column>
					<el-table-column
						prop="progressStatus"
						label="状态" align="center">
						<template slot-scope="scope">
							<el-tag>
								{{ scope.row.progressStatus }}
							</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="进度报告" align="center">
						<template slot-scope="scope">
							<el-button 
								@click="checkAimProgressReport(scope.row)"
								type="text" size="small">
								查看
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-card>
		</el-row>
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
import countTo from 'vue-count-to'
import AimChildWeight from '../../aimConfig/components/AimChildWeight'
import ReportListDialog from '../../aimReport/components/ReportListDialog'
import AimProgressLine from './AimProgressLine'
import { getAimProgressListByAimConfig } from '@/api/aim'
export default {
	props: {
		formVisible: {
			type: Boolean
		},
		aimConfigData: {
			type: Object
		}
	},
	name: 'AimConfigInfo',
	components: { countTo, 
								AimChildWeight,
								AimProgressLine,
								ReportListDialog },
	data() {
		return {
			//汇报类型
			objectiveData: '客观数据',
			independentReport: '自主汇报',
			aimConfigForm: {
				id: null,
				name: '',
				respDeptName: '', //责任科室名称
				respPerName: '', //责任人姓名
				requirement: '', //目标执行说明
				reportType: '', //汇报类型：自主汇报/客观数据
				expectedResult: '', //期待到达的结果
				expectedValue: 0.0, //预期值
			},
			aimProgressList: [], //进度表
			/* 目标进度报告 */
			aimProgressData: {},
			reportListStatus: false,
			reportsVisible: false,
			reportsStatus: '',
			editFlg: false,
			/* 加载图表 */
			waterfallStatus: false,
			lineStatus: false
		}		
	},
	created() {
		this.getAimConfigInfo()
		this.loadParentWeightWaterfall()
		this.loadAimProgressLine()
		this.getAimProgressList()
	},
	mounted() {
		
	},
	methods: {
		getAimConfigInfo() {
			var self = this
			const data = self.aimConfigData
			self.aimConfigForm = Object.assign({}, data)
		},
		loadParentWeightWaterfall() {
			this.waterfallStatus = false
			const parentAim = this.aimConfigForm.parent
			if (parentAim != null) {
				this.$nextTick(() => {
		     	this.waterfallStatus = true
		    })
			}
		},
		loadAimProgressLine() {
			this.lineStatus = false
			const aimConfig = this.aimConfigForm.id
			if (aimConfig != null) {
				this.$nextTick(() => {
			   	this.lineStatus = true
			  })
			}
		},
		getAimProgressList() {
			const aimConfig = this.aimConfigForm.id
			const query = {
				aimConfig: aimConfig
			}
			getAimProgressListByAimConfig(query).then(res => {
				this.aimProgressList = res.data
			})
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
		},
		resetForm() {	
			this.aimConfigForm.id = null;
			this.aimConfigForm.name = '';
			this.aimConfigForm.code = '';
			this.aimConfigForm.status = '启用';
			this.aimConfigForm.parent = null;
			this.aimConfigForm.type = '';
			this.aimConfigForm.category = '';
			this.aimConfigForm.hosp = null;
			this.aimConfigForm.information = '';
		},
		closeForm() {
			this.$refs['aimConfigForm'].clearValidate()
			this.resetForm()
			this.$emit('closeform')
		}
	},
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;
	
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
