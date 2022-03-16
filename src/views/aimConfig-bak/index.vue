<template>
	<div class="app-container">
		<div class="filter-container">
			<!-- 用户相关的目标查询 -->
			<el-select 
				v-model="listQuery.item" 
				filterable clearable 
				placeholder="选择或输入目标">
				<el-option 
					v-for="item in aimConfigParams" 
					:key="item.id" 
					:label="item.name" 
					:value="item.id">
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
				发起年度目标
			</el-button>
		</div>
		<!-- 接口列表 -->
		<el-table 
			:data="list" 
			v-loading="loading" 
			style="width: 100%">
			<el-table-column type="expand">
				<template slot-scope="props">
					<el-form label-position="left" inline class="demo-table-expand">
						<el-form-item label="执行说明">
							<span>{{ props.row.requirement }}</span>
						</el-form-item>
						<el-form-item 
							v-if="props.row.reportType == '客观数据'"
							label="预期值">
							<span>{{ props.row.expectedValue }}</span>
						</el-form-item>
						<el-form-item 
							v-if="props.row.reportType == '自主汇报'"
							label="预期结果">
							<span>{{ props.row.expectedResult }}</span>
						</el-form-item>
					</el-form>
				</template>
			</el-table-column>
			<el-table-column prop="name" label="目标">
			</el-table-column>
			<!-- 责任科室 责任人 -->
			<el-table-column 
				prop="respDeptName" label="责任科室">
			</el-table-column>
			<el-table-column 
				prop="respPerName" label="责任人">
			</el-table-column>
			<!-- 目标类型：年度目标/月度目标 -->
			<el-table-column 
				prop="yearmonthType" label="目标类型">
				<template slot-scope="scope">
					<el-tag
						:type="scope.row.yearmonthType == 'year' ? 'primary' : 'success'">
						{{ scope.row.yearmonthType == 'year' ? '年度目标' : '月度目标' }}
					</el-tag>
				</template>
			</el-table-column>
			<!-- 汇报方式 自主汇报 客观数据 -->
			<el-table-column 
				prop="reportType" label="汇报方式">
				<template slot-scope="scope">
					<el-tag
						:type="scope.row.reportType == '自主汇报' ? 'info' : 'warning'">
						{{ scope.row.reportType }}</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center">
				<template slot-scope="scope">
					<el-button 
						@click="addChildAim(scope.row)"
						type="text" size="small" icon="el-icon-document-add">
						添加子目标
					</el-button>
					<!-- 创建者身份可编辑 -->
					<el-button 
						v-if="scope.row.operator == listQuery.userID"
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
		<!-- 目标编辑框 -->
		<edit-dialog
			v-if="editStatus"
			:dialogStatus="dialogStatus" 
			:dialogVisible="dialogVisible"
			:aimConfigData="aimConfigData"
			:respPerNameQuery="respPerNameQuery"
			@closeDialog="closeDialog"
			@getList="getList"></edit-dialog>
		<!-- 添加子目标 -->
		<add-child-dialog
			v-if="addChild"
			:addChildStatus="addChildStatus" 
			:addChildVisible="addChildVisible"
			:aimConfigData="aimConfigData"
			@closeAddChildAim="closeAddChildAim"
			@getList="getList"></add-child-dialog>
	</div>
</template>

<script>
import waves from '@/directive/waves'
import { getAimConfigParamByUser,
				 fetchAimConfigByUser } from '@/api/aim'
import { formatDate } from '@/utils/date'
import EditDialog from './components/EditDialog'
import AddChildDialog from './components/AddChildDialog'
export default {
	name: 'AimConfig',
	components: { EditDialog, AddChildDialog },
	directives: { waves },
	data() {
		return {
			list: [],
			total: 0,
			loading: false,
			listQuery: {
				currentPage: 1,
				pagesize: 10,
				aimConfig: null , //目标id aimConfig.id,
				userID: null //当前用户ID 
			},
			aimConfigParams: [], //用户相关的目标参数
			aimConfigData: {}, //目标配置实体
			/* 创建 编辑目标 */
			editStatus: false,
			dialogStatus: '',
			dialogVisible: false,
			respPerNameQuery: '' ,//编辑目标传责任人姓名进行模糊查询
			/* 添加子目标 */
			addChild: false,
			addChildStatus: false, //创建子目标标题
			addChildVisible: false
		}
	},
	created() {
		this.getUserInfo() //获取用户id
		this.getList() //获取用户创建或负责的目标列表
	},
	mounted() {
		this.getAimConfigParam() //获取用户目标参数
	},
	methods: {
		getUserInfo() {
			var self = this
			self.listQuery.userID = self.$store.getters.userID
		},
		getList() {
			var self = this
			self.loading = true
			const query = self.listQuery
			fetchAimConfigByUser(query).then(response => {
				self.list = response.data.aimConfigs
				self.total = response.data.total
				self.loading = false
			})
		},
		/* 获取用户目标参数 */
		getAimConfigParam() {
			var self = this
			const query = {
				userID: self.listQuery.userID
			}
			getAimConfigParamByUser(query).then(res => {
				self.aimConfigParams = res.data
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
		/* 发起年度目标  */
		handleCreate() {
			this.editStatus = true
			this.dialogStatus = '发起年度目标'
			this.dialogVisible = true
			this.aimConfigData = {
				id: null,
				name: '', //目标名称 目标代码
				respDepartment: null, //责任科室
				respPerson: null, //责任人
				yearmonthType: 'year', //目标类型为年度目标
				requirement: '', //目标执行要求
				reportType: '', //汇报类型：自主汇报/客观数据
				objectiveDataItem: null, //客观数据关联因子
				objectiveDataFormula: null, //客观数据关联公式
				expectedResult: '', //期待到达的结果
				expectedValue: 0.0, //预期值
				bnsDataItem: null, //目标结果导入
				parent: null, //用户可用目标参数
				weight: 0.0
			}
		},
		/* 编辑目标 */
		handleEdit(data) {
			this.editStatus = true
			this.dialogStatus = '编辑' + data.name
			this.dialogVisible = true
			this.aimConfigData = {
				id: data.id,
				name: data.name, //目标名称 目标代码
				respDepartment: data.respDepartment, //责任科室
				respPerson: data.respPerson, //责任人
				yearmonthType: data.yearmonthType, //目标类型  
				requirement: data.requirement, //目标执行要求
				reportType: data.reportType, //汇报类型：自主汇报/客观数据
				objectiveDataItem: data.objectiveDataItem, //客观数据关联因子
				objectiveDataFormula: data.objectiveDataFormula, //客观数据关联公式
				expectedResult: data.expectedResult, //期待到达的结果
				expectedValue: data.expectedValue, //预期值
				bnsDataItem: data.bnsDataItem, //目标结果导入
				parent: data.parent, //用户可用上级目标
				weight: data.weight //占上级目标的权重
			}
			this.respPerNameQuery = data.respPerName //责任人名称
		},
		/* 关闭目标编辑框 */
		closeDialog() {
			this.editStatus = false
			this.dialogStatus = ''
			this.dialogVisible = false
			this.aimConfigData = {}
		},
		/* 添加子目标 */
		addChildAim(data) {
			this.addChild = true
			this.addChildStatus = '创建' + data.name + '的子目标'
			this.addChildVisible = true
			this.aimConfigData = {
				id: data.id, 
				name: data.name
			}
		},
		/* 关闭添加子目标窗口 */
		closeAddChildAim() {
			this.addChild = false
			this.addChildStatus = ''
			this.addChildVisible = false
			this.aimConfigData = {}
		}
	}
}
</script>
<style>
.demo-table-expand {
	  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
