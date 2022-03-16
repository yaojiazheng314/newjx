<template>
	<div class="app-container">
		<div class="filter-container">
			<!-- 链接查询 -->
			<el-select 
				v-model="listQuery.exterLink" 
				style="width: 280px;"
				filterable clearable 
				placeholder="选择或输入链接名称">
				<el-option 
					v-for="item in linkParams" 
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
			<!-- 创建链接按钮 -->
			<el-button
			 v-waves
			 size="mini"
			 type="primary"
			 icon="el-icon-edit"
			 @click="handleCreate">
				新建
			</el-button>
		</div>
		<!-- 外链接列表 链接别名 链接地址 编辑 -->
		<el-table 
			:data="list" 
			v-loading="loading" 
			style="width: 100%">
			<el-table-column prop="name" label="链接名称" width="500">
			</el-table-column>
			<el-table-column 
				prop="linkUrl" 
				label="链接地址"
				width="850">
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
			:linkData="linkData"
			@closedialog="closedialog"
			@getList="getList"
			@getLinkParams="getLinkParams"></edit-dialog>
	</div>
</template>

<script>
import waves from '@/directive/waves'
import { getExternalLinkParam,
				 getExterLinkList } from '@/api/externalLink'
import EditDialog from './components/EditDialog'
export default {
	name: 'LinkManage',
	components: { EditDialog },
	directives: { waves },
	data() {
		return {
			list: [],
			total: 0,
			loading: false,
			listQuery: {
				currentPage: 1,
				pagesize: 10,
				exterLink: null
			},
			linkParams: [], //模板参数
			/* 创建 编辑 考核模板 */
			linkData: {}, //考核模板实体
			editStatus: false,
			dialogStatus: '',
			dialogFormVisible: false
		}
	},
	created() {
		this.getList()
	},
	mounted() {
		this.getLinkParams()
	},
	methods: {
		getList() {
			var self = this
			self.loading = true
			const query = self.listQuery
			self.loading = false
			getExterLinkList(query).then(response => {
				self.list = response.data.links
				self.total = response.data.total
				self.loading = false
			})
		},
		/* 获取链接参数 */
		getLinkParams() {
			var self = this
			getExternalLinkParam().then(res => {
				self.linkParams = res.data
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
			this.linkData = {
				id: null,
				name: '', //链接名称
				linkUrl: '' //链接地址
			}
		},
		handleEdit(data) {
			this.editStatus = true
			this.dialogStatus = '编辑'+data.name
			this.dialogFormVisible = true
			this.linkData = {
				id: data.id,
				name: data.name, //链接名称
				linkUrl: data.linkUrl //链接地址
			}
		},
		closedialog() {
			this.editStatus = false
			this.dialogStatus = ''
			this.dialogFormVisible = false
			this.linkData = {}
		}
	}
}
</script>

<style>
</style>

