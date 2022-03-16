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
			<!-- 服务器查询 -->
			<el-select 
				v-model="listQuery.server" 
				filterable clearable 
				placeholder="选择或输入服务连接">
				<el-option 
					v-for="item in itfaceServerParams" 
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
		</div>
		<!-- 可执行的接口列表 -->
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
				prop="itfaceServerName" label="服务连接">
			</el-table-column>
			<el-table-column 
				prop="logNum" label="日志">
				<template slot-scope="scope">
					<el-button
						type="text"
						size="mini"
						icon="el-icon-log"
						@click="openLogDialog(scope.row)">
						共{{ scope.row.logNum }}日志</el-button>
				</template>
			</el-table-column>
			<el-table-column 
				prop="recentExecTime" label="最近执行日期">
				<template slot-scope="scope">
					<span v-if="scope.row.recentExecTime">
						{{ scope.row.recentExecTime }}
					</span>
					<span v-else>暂无</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" width="500">
				<template slot-scope="scope">
					<!-- 接口类型存储过程使用日期入参 -->
					<el-date-picker
						v-if="scope.row.itfaceSource == 'proc'"
						size="mini"
						value-format="yyyy-MM-dd HH:mm:ss"
						v-model="paramRange"
						type="datetimerange"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						:default-time="['00:00:00', '23:59:59']">
					</el-date-picker>
					<el-button 
						:disabled="scope.row.itfaceSource == 'proc' && !paramRange"
						@click="execItface(scope.row)"
						type="primary" size="mini">
						执行
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
		<!-- 接口执行日志 -->
		<log-dialog
			v-if="logStatus"
			:logDialogStatus="logDialogStatus" 
			:logVisible="logVisible"
			:itfaceItemData="itfaceItemData"
			@closeLogDialog="closeLogDialog"
			@getList="getList"></log-dialog>
	</div>
</template>

<script>
import waves from '@/directive/waves'
import { getItfaceItemParam,
				 getItfaceServerParam, 
				 fetchExecItfaceItem,
				 executeItface } from '@/api/itface'
import LogDialog from './components/LogDialog'
export default {
	name: 'ItfaceItem',
	components: { LogDialog },
	directives: { waves },
	data() {
		return {
			list: [],
			total: 0,
			loading: false,
			listQuery: {
				currentPage: 1,
				pagesize: 10,
				item: null, //查询接口id
				server: null //查询服务id
			},
			itfaceItemParams: [], //接口参数
			itfaceServerParams: [], //服务连接参数
			/* 执行 接口 */
			paramRange: '', //日期参数范围
			/* 日志查询 */
			logStatus: false,
			logDialogStatus: '',
			logVisible: false
		}
	},
	created() {
		this.getList()
	},
	mounted() {
		this.getItemParam()
		this.getServerParam()
	},
	methods: {
		getList() {
			var self = this
			self.loading = true
			const query = self.listQuery
			self.loading = false
			fetchExecItfaceItem(query).then(response => {
				self.list = response.data.execItfaceItems
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
		/* 获取服务连接参数 */
		getServerParam() {
			var self = this
			getItfaceServerParam().then(res => {
				self.itfaceServerParams = res.data
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
		/* 接口执行 */
		execItface(data) {
			var self = this
			const paramRange = self.paramRange[0]+'~'+self.paramRange[1]
			const itfaceLog = {
				itfaceItem: data.id,
				paramRange: data.itfaceSource == 'proc' ? paramRange : ''
			}
			const loading = self.$loading({
				lock: true,
        text: '接口'+data.name+'数据提取中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
			executeItface(itfaceLog).then(res => {
				loading.close(); //关闭loading
				let status = res.status
				if (status == 520) {
					this.$message({
						message: res.msg,
						type: 'error',
						duration: 6000
					});
				} else if (status == 200) {
					self.$notify({
					  title: '成功',
					  message: '接口'+data.name+'执行完成',
					  type: 'success',
					  duration: 6000
					})
				}
				//重新加载列表
				self.getList()
			})
		},
		/* 打开接口执行日志dialog */
		openLogDialog(row) {
			this.logStatus = true
			this.logDialogStatus = row.name + '的执行日志'
			this.logVisible = true
			this.itfaceItemData = {
				id: row.id,
				name: row.name
			}
		},
		closeLogDialog() {
			this.logStatus = false
			this.logDialogStatus = ''
			this.logVisible = false
			this.itfaceItemData = {}
		}
	}
}
</script>

<style>
</style>

