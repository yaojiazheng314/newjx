<template>
	<div id="aimConfigEditDialog">
		<el-dialog 
			:title="dialogStatus" 
			:show-close="showClose"
			:close-on-click-modal="false"
			:visible.sync="dialogVisible"
			width="45%">
			<el-form 
				label-position="left" inline>
				<!-- 1.目标名称 2.责任科室 3.责任人 4.验收日期 -->
				<el-form-item>
					<el-form-item label="名称(代码)" prop="name">
						{{ aimProgressForm.aimConfigName }}
					</el-form-item>
					<el-form-item label="责任科室" prop="respDeptName">
						{{ aimProgressForm.respDeptName }}
					</el-form-item>
					<el-form-item label="责任人" prop="respPerson">
						{{ aimProgressForm.respPerName }}
					</el-form-item>
				</el-form-item>
				<!-- 目标执行说明 -->
				<el-form-item label="执行说明" prop="requirement">
					<el-input
						type="textarea"
						placeholder="目标执行说明"
						v-model.trim="aimProgressForm.requirement"
						:rows="5"
						readonly
						style="width: 600px;">
					</el-input>
				</el-form-item>
				<!-- 汇报类型为自主汇报 显示预期结果 -->
				<el-form-item 
					v-if="aimProgressForm.reportType == independentReport"
					label="预期结果" 
					prop="expectedResult">
					<el-input
						type="textarea"
						placeholder="输入目标执行说明"
						v-model.trim="aimProgressForm.expectedResult"
						:rows="4"
						readonly
						style="width: 600px;">
					</el-input>
				</el-form-item>
				<!-- 汇报类型为客观数据 -->
				<!-- 当前进度 -->
				<el-form-item label="当前进度">
					<el-progress 
						v-if="aimProgressForm.reportType == objectiveData"
						:text-inside="true" 
						:stroke-width="18" 
						:percentage="aimProgressForm.progress"
						style="margin-top: 10px; width: 600px;"
						color="rgba(142, 113, 199, 0.7)">
					</el-progress>
					<!-- 自主汇报进度 -->
					<el-slider 
						v-if="aimProgressForm.reportType == independentReport"
						v-model="aimReport.reportProgress"
						style="width: 600px; color: mediumpurple;"
						show-input>
					</el-slider>
				</el-form-item>
				<!-- 预期值 实际值 -->
				<el-form-item 
					v-if="aimProgressForm.reportType == objectiveData"
					label="预期值:" style="width: 150px;"
					prop="expectedValue">
					<count-to
					  :start-val="0"
					  :end-val="aimProgressForm.expectedValue"
					  :duration="2000"
					  :autoplay="true"
						class="example-department"/>
				</el-form-item>
				<!-- aimConfig配置了客观因子 再显示客观数据 -->
				<el-form-item 
					v-if="aimProgressForm.reportType == objectiveData 
					&& (aimProgressForm.objectiveDataItem 
					|| aimProgressForm.objectiveDataFormula)"
					label="实际值:">
					<count-to
					  :start-val="0"
					  :end-val="aimReport.reportValue"
					  :duration="2000"
					  :autoplay="true"
						class="example-person"/>
				</el-form-item>
				<!-- 目标进度记录 允许为空 -->
				<el-form-item label="进度记录">
					<el-input
						type="textarea"
						placeholder="目标进度记录"
						v-model.trim="aimReport.reportResult"
						:rows="5"	maxlength="300"	show-word-limit
						style="width: 600px;">
					</el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeDialog">返 回</el-button>
				<el-button 
					type="primary"
					:loading="loading"
					:disabled="submitStatus"
					@click="submitReport">
					提 交 
				</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import countTo from 'vue-count-to'
import { getAimReport, saveAimReport } from '@/api/aim'
export default {
	components: { countTo },
	props: {
		dialogVisible: {
			type: Boolean
		},
		dialogStatus: {
			type: String
		},
		aimProgressData: {
			type: Object
		}
	},
	name: 'ReportDialog',
	data() {
		return {
			showClose: false,
			submitStatus: false, //提交锁定状态
			loading: false, //提交目标进度
			//汇报类型
			objectiveData: '客观数据',
			independentReport: '自主汇报',
			/* 目标配置明细 */
			aimProgressForm: {
				id: null,
				name: '', //目标名称 目标代码
				respDeptName: '', //责任科室名称
				respPerName: '', //责任人姓名
				requirement: '', //目标执行说明
				reportType: '', //汇报类型：自主汇报/客观数据
				expectedResult: '', //期待到达的结果
				expectedValue: 0.0, //预期值
				objectiveDataItem: null, //客观因子
				objectiveDataFormula: null, //客观公式
				progress: 0, //当前进度
				progressStatus: '', //目标进度状态
				yearmonth: '' //目标验收、核算年月
			},
			/* 进度报告 用于提交自主汇报类型的目标进度报告 */
			aimReport: {
				id: null, //aimReport.id 用于不关闭dialog更新
				aimConfig: null, //目标配置id
				reportResult: '', //reportType == 自主汇报 时赋值 进度汇报报告
				reportValue: null, //reportType == 客观数据 时赋值 汇报值
				specialNote: '', //特殊记录 限制200字符 用于记录文件地址等 暂不使用
				reportProgress: 0, //提交进度报告时的进度 客观数据读取时的进度
				operator: null //汇报人
			},
			//记录aimReport 避免提交重复数据
			aimReportRecord: {
				aimProgress: null,
				reportResult: '',
				reportProgress: 0
			}
		}		
	},
	created() {
		//提交进度记录的用户id
		this.getUserInfo()
	},
	mounted() {
		const data = this.aimProgressData
		if (data.id !== null && data.id !== '') {
			this.aimReport.aimProgress = data.id //记录aimProgress.id
			this.getAimConfigReport()
		}
	},
	methods: {
		/* 获取用户id */
		getUserInfo() {
			this.aimReport.operator = this.$store.getters.userID
		},
		/* 获取目标报告 
			返回：aimConfig最新进度的实体 */
		getAimConfigReport() {
			const query = this.aimReport
			getAimReport(query).then(res => {
				const aimProgress = res.data.aimProgressVO
				this.aimProgressForm = Object.assign({}, aimProgress)
				if (aimProgress.reportType == this.objectiveData) {
					this.aimReport.reportValue = res.data.objectiveValue
					this.aimReport.reportProgress = aimProgress.progress
				} else if (aimProgress.reportType == this.independentReport) {
					this.aimReport.reportProgress = aimProgress.progress
				}
			})
		},
		/* 提交目标进度记录 */
		submitReport() {
			this.loading = true
			const aimProgress = this.aimProgressForm
			if (aimProgress.reportType == this.objectiveData) {
				//客观数据 记录报告时进度
				this.aimReport.reportProgress = aimProgress.progress
				if (this.aimReport.reportResult.length == 0) {
					this.$message({
						message: '未编辑进度记录不需要提交',
						type: 'warning'
					});
					this.loading = false
					return
				}
			}
			//判断是否提交重复内容
			var isDuplicated = this.checkRepeatSubmit()
			if (isDuplicated) {
				this.loading = false
				return
			}
			const data = this.aimReport
			saveAimReport(data).then(res => {
				this.$notify({
				  title: '成功',
				  message: this.dialogStatus+'进度记录提交成功',
				  type: 'success',
				  duration: 6000
				})
				this.loading = false
				this.submitStatus = true
				this.recordAimReportResult()
				setTimeout(() => {
          this.submitStatus = false
        }, 4000);
			})
		},
		/* 判断是否在提交重复提交的数据 */
		checkRepeatSubmit() {
			const aimReport = this.aimReport
			const aimReportRecord = this.aimReportRecord
			if (aimReport.aimConfig == aimReportRecord.aimConfig
				&& aimReport.reportProgress == aimReportRecord.reportProgress
				&& aimReport.reportResult == aimReportRecord.reportResult) {
				this.$message({
					message: '请勿提交重复内容',
					type: 'warning'
				});
				return true
			} else {
				return false
			}
		},
		/* 提交记录时 记录最新的提交进度和reportResult */
		recordAimReportResult() {
			this.aimReportRecord.aimConfig = this.aimReport.aimConfig
			this.aimReportRecord.reportResult = this.aimReport.reportResult
			this.aimReportRecord.reportProgress = this.aimReport.reportProgress
		},
		/* 重置form页面 startTime、endTime、operator不重置 */
		resetForm() {	
			this.aimProgressForm = {}
		},
		closeDialog() {
			this.resetForm()
			this.$emit('closeDialog')
		}
	}
}
</script>

