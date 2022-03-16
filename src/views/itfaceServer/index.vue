<template>
	<div class="app-container">
		<div class="filter-container">
			<el-button 
				v-waves 
				type="primary" 
				icon="el-icon-link" size="mini" 
				@click="handleCreate">
				创建服务
			</el-button>
		</div>

		<el-table 
			:data="list" 
			v-loading="listLoading" 
			style="width: 100%">
			<el-table-column prop="name" label="服务名称">
			</el-table-column>
			<el-table-column prop="dbType" label="数据库类型">
			</el-table-column>
			<el-table-column prop="url" label="地址">
			</el-table-column>
			<el-table-column prop="status" label="状态">
				<template slot-scope="scope">
					<el-tag 
						:type="scope.row.status === '运行' ? 
						'success' : 'danger'" 
						disable-transitions>{{ scope.row.status }}</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="100">
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
		<!-- 编辑框 -->
		<server-edit-dialog 
			v-if="editStatus"
			:dialogStatus="dialogStatus" 
			:dialogVisible="dialogVisible"
			:serverData="serverData"
			@closeDialog="closeDialog"
			@getList="getList">
		</server-edit-dialog>
	</div>
</template>

<script>
	import { getServerList } from '@/api/itface'
	import waves from '@/directive/waves'
	import ServerEditDialog from './components/ServerEditDialog'
	export default {
		name: 'ItfaceServer',
		components: { ServerEditDialog },
		directives: { waves },
		data() {
			return {
				list: null,
				total: 0,
				listLoading: false,
				listQuery: {
					currentPage: 1,
					pagesize: 10
				},
				editStatus: false,
				dialogStatus: '',
				dialogVisible: false,
				serverData: {}
			}
		},
		created() {
			this.getList()
		},
		methods: {
			getList() {
				var self = this
				self.listLoading = true
				const query = self.listQuery
				getServerList(query).then(response => {
					self.list = response.data.servers
					self.total = response.data.total
					self.listLoading = false
				})
			},
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
			handleCreate() {
				this.editStatus = true
				this.dialogStatus = '创建服务连接'
				this.dialogVisible = true
				this.serverData = {
					id: null,
					name: '',
					status: '运行',
					dbType: '',
					dbUser: '',
					dbPassword: '',
					url: ''
				}
			},
			handleEdit(data) {
				this.editStatus = true
				this.dialogStatus = '编辑' + data.name
				this.dialogVisible = true
				this.serverData = data
			},
			closeDialog() {
				this.editStatus = false
				this.dialogStatus = ''
				this.dialogVisible = false
				this.serverData = {}
			}
		}
	}
</script>
