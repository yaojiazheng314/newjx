<template>
	<div id="logDialog">
		<el-dialog 
			:title="logDialogStatus" 
			:show-close="showClose"
			:close-on-click-modal="false"
			:visible.sync="visible"
			@close="closeDialog"
			width="75%">
			<el-button 
				type="warning" size="mini"
				icon="el-icon-delete" 
				:loading="delLoading"
				@click="cleanItfaceLog"
				plain>
				清空日志
			</el-button>
			<!-- 接口执行日志列表 -->
			<el-table 
				:data="list" 
				v-loading="loading" 
				style="width: 100%">
				<el-table-column 
					prop="runDate" 
					label="执行日期">
				</el-table-column>
				<el-table-column 
					prop="beginTime" label="开始时间">
				</el-table-column>
				<el-table-column 
					prop="endTime" label="结束时间">
				</el-table-column>
				<el-table-column
					prop="runType" label="执行方式">
				</el-table-column>
				<el-table-column
					prop="selectNum" label="查询数">
				</el-table-column>
				<el-table-column
					prop="insertNum" label="插入数">
				</el-table-column>
				<el-table-column
					prop="updateNum" label="更新数">
				</el-table-column>
				<el-table-column
					prop="runResult" label="结果">
					<template slot-scope="scope">
						<el-tag :type="scope.row.runResult == '成功' ? 'success' : 'danger'">
							{{ scope.row.runResult }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column
					prop="paramRange" label="入参">
					<template slot-scope="scope">
						<el-tooltip 
							effect="dark" 
							:content="scope.row.paramRange == '' ? '无' : scope.row.paramRange" 
							placement="bottom">
							<i class="el-icon-s-flag" />
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column
					prop="errMessage" label="错误日志">
					<template slot-scope="scope">
						<el-tooltip 
							effect="light" 
							:content="scope.row.errMessage == null ? '无' : scope.row.errMessage" 
							placement="left">
							<i class="el-icon-info" />
						</el-tooltip>
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
import { fetchItfaceLog,
				 deleteItfaceLog } from '@/api/itface'
export default {
	props: {
		logVisible: {
			type: Boolean
		},
		logDialogStatus: {
			type: String
		},
		itfaceItemData: {
			type: Object
		}
	},
	name: 'LogDialog',
	data() {
		return {
			showClose: true,
			visible: false,
			loading: false, //列表加载loading
			delLoading: false, //清空日志loading
			list: [], //目标的进度报告列表
			total: 0, //记录总数
			listQuery: {
				currentPage: 1,
				pagesize: 10,
				itfaceItem: null
			}
		}		
	},
	created() {
		this.visible = this.logVisible
		const data = this.itfaceItemData
		if (data.id !== null && data.id !== '') {
			this.listQuery.itfaceItem = data.id //itfaceItem.id
			this.getList()
		}
	},
	methods: {
		getList() {
			var self = this
			self.loading = true
			const query = self.listQuery
			fetchItfaceLog(query).then(response => {
				self.list = response.data.logs
				self.total = response.data.total
				self.loading = false
			})
		},
		/* 清空接口执行日志 */
		cleanItfaceLog() {
			const itfaceItemName = this.itfaceItemData.name
			const tip = '此操作会删除'+itfaceItemName+'的所有执行日志，是否继续？'
			this.$confirm(tip, '提示', {
				confirmButtonText: '确定',
			  cancelButtonText: '取消',
			  type: 'warning'
			}).then(() => {
				this.delItfaceLog()
			}).catch(() => {
			  this.$message({
			    type: 'info',
			    message: '取消自动绑定'
			  });
			});
		},
		/* 删除执行日志 */
		delItfaceLog() {
			this.delLoading = true
			const param = {
				itfaceItem: this.listQuery.itfaceItem
			}
			deleteItfaceLog(param).then(res => {
				this.$message({
				  type: 'success',
				  message: '日志已清除'
				});
				this.delLoading = false
				this.getList()
			})
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
		/* 关闭dialog */
		closeDialog() {
			this.$emit('getList')
			this.$emit('closeLogDialog')
		}
	}
}
</script>
