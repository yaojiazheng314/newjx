<template>
	<div class="app-container">
		<div class="filter-container">
			<!-- 接口查询 -->
			<el-select 
				v-model="listQuery.item" 
				filterable clearable 
				placeholder="选择或输入接口">
				<el-option 
					v-for="item in itfaceItemParams" 
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
			<!-- 创建接口按钮 -->
			<el-button
			 v-waves
			 size="mini"
			 type="primary"
			 icon="el-icon-edit"
			 @click="handleCreate">
				新建
			</el-button>
		</div>
		<!-- 接口列表 -->
		<el-table 
			:data="list" 
			v-loading="loading" 
			style="width: 100%">
			<el-table-column prop="name" label="接口">
			</el-table-column>
			<el-table-column 
				prop="type" label="类型">
				<template slot-scope="scope">
					<el-tag
						:type="scope.row.type === '基础数据' ? 'primary' : 'success'"
						disable-transitions>
						{{ scope.row.type }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column 
				prop="filedNum" label="字段">
				<template slot-scope="scope">
					<el-button
						type="text"
						size="mini"
						@click="handleAddField(scope.row)"
						icon="el-icon-connection">
						共{{ scope.row.fieldNum }}字段</el-button>
				</template>
			</el-table-column>
			<el-table-column 
				prop="autoStatus" label="自动执行">
				<template slot-scope="scope">
					<el-tag
						:type="scope.row.autoStatus === '启动' ? 'warning' : 'info'"
						disable-transitions>
						{{ scope.row.autoStatus }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column 
				prop="itfaceServerName" label="服务连接">
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
		<!-- 接口编辑框 -->
		<edit-dialog
			v-if="editStatus"
			:dialogStatus="dialogStatus" 
			:dialogVisible="dialogVisible"
			:itfaceItemData="itfaceItemData"
			@closeDialog="closeDialog"
			@getList="getList"></edit-dialog>
		<!-- 接口字段配置 -->
		<add-field
			v-if="addFieldStatus"
			:addFieldDialogStatus="addFieldDialogStatus" 
			:addFieldVisible="addFieldVisible"
			:itfaceItemData="itfaceItemData"
			@closeAddFieldDialog="closeAddFieldDialog"
			@getList="getList"></add-field>
	</div>
</template>

<script>
import waves from '@/directive/waves'
import { getItfaceItemParam, fetchItfaceItem } from '@/api/itface'
import EditDialog from './components/EditDialog'
import AddField from './components/AddField'
export default {
	name: 'ItfaceItem',
	components: { EditDialog, AddField },
	directives: { waves },
	data() {
		return {
			list: [],
			total: 0,
			loading: false,
			listQuery: {
				currentPage: 1,
				pagesize: 10,
				item: null //查询接口id
			},
			itfaceItemParams: [], //接口参数
			/* 创建 编辑接口 */
			itfaceItemData: {}, //接口配置实体
			editStatus: false,
			dialogStatus: '',
			dialogVisible: false,
			/* 添加接口字段 */
			addFieldStatus: false,
			addFieldDialogStatus: '',
			addFieldVisible: false
		}
	},
	created() {
		this.getList()
	},
	mounted() {
		this.getItemParam()
	},
	methods: {
		getList() {
			var self = this
			self.loading = true
			const query = self.listQuery
			self.loading = false
			fetchItfaceItem(query).then(response => {
				self.list = response.data.itfaceItems
				self.total = response.data.total
				self.loading = false
			})
		},
		/* 获取接口参数 */
		getItemParam() {
			var self = this
			getItfaceItemParam().then(res => {
				self.itfaceItemParams = res.data
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
		/* 创建 编辑 */
		handleCreate() {
			this.editStatus = true
			this.dialogStatus = '创建接口'
			this.dialogVisible = true
			this.itfaceItemData = {
				id: null,
				name: '', //接口名称
				type: '', //接口类型 视图 存储过程
				itfaceName: '', //视图或存储过程名称
				itfaceSource: '', //接口来源 自定义
				storageTableName: '', //存储表名
				itfaceServer: null,//使用的服务连接
				autoStatus: '启动', //接口自动执行状态
				cycle: '每月', //自动执行方式(每月/每)
				cycleDay: 1, //自动执行日期 每月几号
				runTime: '00:00' //自动执行时间
			}
		},
		handleEdit(data) {
			this.editStatus = true
			this.dialogStatus = '编辑' + data.name
			this.dialogVisible = true
			this.itfaceItemData = {
				id: data.id,
				name: data.name, //接口名称
				type: data.type, //接口类型 视图 存储过程
				itfaceName: data.itfaceName, //视图或存储过程名称
				itfaceSource: data.itfaceSource, //接口来源 自定义
				storageTableName: data.storageTableName, //存储表名
				itfaceServer: data.itfaceServer, //使用的服务连接
				autoStatus: data.autoStatus, //接口自动执行状态
				cycle: data.cycle, //自动执行方式(每月:month/每:day)
				cycleDay: data.cycleDay, //自动执行日期 每月几号 或 每几天
				runTime: data.runTime //自动执行时间
			}
		},
		closeDialog() {
			this.editStatus = false
			this.dialogStatus = ''
			this.dialogVisible = false
			this.itfaceItemData = {}
		},
		/* 添加接口字段 */
		handleAddField(row) {
			this.addFieldStatus = true
			this.addFieldDialogStatus = row.name + '的字段配置'
			this.addFieldVisible = true
			this.itfaceItemData = {
				id: row.id,
				itfaceSource: row.itfaceSource
			}
		},
		closeAddFieldDialog() {
			this.addFieldStatus = false
			this.addFieldDialogStatus = ''
			this.addFieldVisible = false
			this.itfaceItemData = {}
		}
	}
}
</script>

<style>
</style>

