<template>
	<div class="app-container">
		<div class="filter-container">
			<!-- 报表查询 -->
			<el-select 
				v-model="listQuery.report" 
				style="width: 280px;"
				filterable clearable 
				placeholder="选择或输入报表名称">
				<el-option 
					v-for="item in reportParams" 
					:key="item.id" 
					:label="item.name" 
					:value="item.id">
					<span style="float: left">{{ item.name }}</span>
				</el-option>
			</el-select>
			<!-- 查询按钮 -->
			<el-button
			 v-waves
			 size="mini"
			 type="primary"
			 icon="el-icon-search"
			 @click="handleFilter">
				查询
			</el-button>
			<!-- 创建报表按钮 -->
			<el-button
			 v-waves
			 size="mini"
			 type="primary"
			 icon="el-icon-edit"
			 @click="handleCreate">
				新建
			</el-button>
		</div>
		<!-- 报表配置列表 报表名称 报表类型 文件名 外链接名称 编辑 -->
		<el-table 
			:data="list" 
			v-loading="loading" 
			style="width: 100%">
			<el-table-column prop="name" label="报表">
			</el-table-column>
			<el-table-column prop="reportType" label="报表类型">
			</el-table-column>
			<el-table-column prop="fileName" label="文件">
			</el-table-column>
			<el-table-column prop="exterLinkName" label="链接">
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button 
						@click="handleEdit(scope.row)"
						type="text" size="small">
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
		<!-- 添加外部链接编辑框 -->
		<edit-dialog
			v-if="editStatus"
			:dialogStatus="dialogStatus" 
			:dialogFormVisible="dialogFormVisible"
			:reportData="reportData"
			@closedialog="closedialog"
			@getList="getList"
			@getReportParams="getReportParams"></edit-dialog>
	</div>
</template>

<script>
import waves from '@/directive/waves'
import { getReportParam,
				 getReportList } from '@/api/externalLink'
import EditDialog from './components/EditDialog'
export default {
	name: 'ReportManage',
	components: { EditDialog },
	directives: { waves },
	data() {
		return {
			list: [],
			total: 8,
			loading: false,
			listQuery: {
				currentPage: 1,
				pagesize: 10,
				report: null
			},
			reportParams: [], //模板参数
			/* 创建 编辑 考核模板 */
			reportData: {}, //考核模板实体
			editStatus: false,
			dialogStatus: '',
			dialogFormVisible: false
		}
	},
	created() {
		this.getList()
	},
	mounted() {
		this.getReportParams()
	},
	methods: {
		getList() {
			var self = this
			self.loading = true
			const query = self.listQuery
			self.loading = false
			getReportList(query).then(response => {			
				self.list = response.data.reports
				self.total = response.data.total
				self.loading = false
			})
		},
		/* 获取报表参数 */
		getReportParams() {
			var self = this
			getReportParam().then(res => {
				self.reportParams = res.data
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
		/* 创建 编辑 链接 */
		handleCreate() {
			this.editStatus = true
			this.dialogStatus = '创建链接'
			this.dialogFormVisible = true
			this.reportData = {
				id: null,
				name: '', //链接名称
				reportType: '', //报表类型
				fileName: '', //文件名称
				params: '', //报表js传参
				exterLink: null, //链接地址
				seq:0,
				rwType:1
			}
		},
		handleEdit(data) {
			this.editStatus = true
			this.dialogStatus = '编辑'+data.name
			this.dialogFormVisible = true
			this.reportData = {
				id: data.id,
				name: data.name, //链接名称
				reportType: data.reportType, //报表类型
				fileName: data.fileName, //文件名称
				params: data.params, //报表参数
				exterLink: data.exterLink, //
				seq:data.seq,
				rwType:data.rwType
			}
		},
		closedialog() {
			this.editStatus = false
			this.dialogStatus = ''
			this.dialogFormVisible = false
			this.reportData = {}
		}
	}
}
</script>

<style>
</style>
