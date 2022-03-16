<template>
	<div id="aimConfigEditDialog">
		<el-dialog 
			:title="reportsStatus" 
			:show-close="showClose"
			:close-on-click-modal="false"
			:visible.sync="visible"
			@close="closeDialog"
			width="75%">
			<!-- 时间范围查询 -->
			<el-date-picker
			  v-model="paramTimeRange"
			  type="datetimerange"
			  range-separator="至"
			  start-placeholder="记录开始时间"
			  end-placeholder="记录结束时间"
				:default-time="['00:00:00', '23:59:59']"
				value-format="yyyy-MM-dd HH:mm:ss"
				@change="getList">
			</el-date-picker>
			<!-- 进度报告列表 -->
			<el-table 
				:data="list" 
				v-loading="loading" 
				style="width: 100%">
				<el-table-column 
					prop="reportTime" 
					label="记录时间"
					>
					<template slot-scope="scope">
						<el-date-picker
							v-model="scope.row.reportTime"
							type="datetime" readonly size="mini">
						</el-date-picker>
					</template>
				</el-table-column>
				<!-- 记录进度 -->
				<el-table-column 
					prop="reportProgress" label="进度">
					<template slot-scope="scope">
						<el-progress 
							:text-inside="true" 
							:stroke-width="18" 
							:percentage="scope.row.reportProgress">
						</el-progress>
					</template>
				</el-table-column>
				<el-table-column v-if="reportType == objectiveData"
					prop="reportValue" label="记录值">
				</el-table-column>
				<el-table-column width="500"
					prop="reportStatus" label="记录">
					<template 
						slot-scope="scope">
						<el-input
							v-if="scope.row.edit"
							type="textarea"
							placeholder="修改进度记录"
							v-model.trim="scope.row.reportResult"
							:rows="5"	maxlength="300"	show-word-limit
							style="width: 480px;"></el-input>
						<span v-else>{{ scope.row.reportResult }}</span>
					</template>
				</el-table-column>
				<el-table-column 
					v-if="editFlg"
					label="操作" 
					width="200" align="center">
					<template slot-scope="scope">
						<div v-if="scope.row.edit">
							<el-button
								type="success" size="mini"
								icon="el-icon-s-claim"
								:loading="scope.row.subLoading"
								@click="submitReportResult(scope.row)">
								提交
							</el-button>
							<el-button
								type="danger" size="mini"
								icon="el-icon-delete"
								@click="delAimReport(scope.row)">
								删除
							</el-button>
						</div>
						<el-button 
							v-else
							@click="scope.row.edit = !scope.row.edit"
							type="primary" size="mini"
							icon="el-icon-edit">
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
					:page-sizes="[10, 15, 20, 25, 30]" 
					:page-size="listQuery.pagesize" 
					layout="total, sizes, prev, pager, next, jumper"
					background
					:total="total">
				</el-pagination>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { fetchAimReports, 
				 saveAimReportResult,
				 deleteAimReport } from '@/api/aim'
export default {
	props: {
		reportsVisible: {
			type: Boolean
		},
		reportsStatus: {
			type: String
		},
		aimProgressData: {
			type: Object
		},
		editFlg: {
			type: Boolean
		}
	},
	name: 'ReportListDialog',
	data() {
		return {
			showClose: true,
			visible: false,
			loading: false, //列表加载loading
			paramTimeRange: [], //提交进度报告时间范围
			reportType: '', //目标汇报方式 自主汇报/客观数据
			objectiveData: '客观数据', //自主汇报类型
			list: [], //目标的进度报告列表
			total: 0, //记录总数
			listQuery: {
				currentPage: 1,
				pagesize: 10,
				aimProgress: null, //目标aimProgress.id
				startTime: '', //开始时间
				endTime: '' //结束时间
			}
		}		
	},
	created() {
		this.visible = this.reportsVisible
		const data = this.aimProgressData
		if (data.id !== null && data.id !== '') {
			this.listQuery.aimProgress = data.id //记录aimConfig.id
			this.reportType = data.reportType //目标汇报方式
			this.getList()
		}
	},
	methods: {
		getList() {
			var self = this
			self.loading = true
			//设置时间范围
			self.setQueryTime()
			const query = self.listQuery
			fetchAimReports(query).then(response => {
				const aimReports = response.data.aimReports
				self.list = aimReports.map(v => {
					self.$set(v, 'edit', false)
					self.$set(v, 'subLoading', false)
					return v
				})
				self.total = response.data.total
				self.loading = false
			})
		},
		/* 设置查询时间范围 */
		setQueryTime() {
			const paramTime = this.paramTimeRange == null ? 
				[] : this.paramTimeRange;
			this.listQuery.startTime = paramTime[0];
			this.listQuery.endTime = paramTime[1];
		},
		/* 分页查询 */
		handleFilter() {
			this.listQuery.currentPage = 1
			this.getList()
		},
		handleSizeChange(size) {
			this.listQuery.pagesize = size
			this.getList()
		},
		handleCurrentChange(currentPage) {
			this.listQuery.currentPage = currentPage
			this.getList()
		},
		/* 提交修改的进度记录 */
		submitReportResult(data) {
			var self = this
			data.subLoading = true
			if (data.reportResult == undefined
				|| data.reportResult.length == 0) {
					data.subLoading = false
				self.$message({
					message: '无法提交空的进度记录',
					type: 'warning'
				});
				return
			}
			saveAimReportResult(data).then(res => {
				let resStatus = res.status
				if (resStatus == 200) {
					self.$notify({
					  title: '成功',
					  message: '进度记录修改成功',
					  type: 'success',
					  duration: 6000
					})
					data.subLoading = false
					self.getList()
				}
			})
		},
		/* 删除目标进度记录 */
		delAimReport(data) {
			this.$confirm('此操作将永久删除进度为'+data.reportProgress+'%的进度记录, 是否继续?', '提示', {
				confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
      	deleteAimReport(data).then(res => {
      		let resStatus = res.status
      		if (resStatus == 200) {
      			this.$message({
      			  type: 'success',
      			  message: '删除成功!'
      			});
      			this.getList()
      		}
      	})
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
		},
		/* 关闭列表dialog */
		closeDialog() {
			this.$emit('closeReportListDialog')
		}
	}
}
</script>


