<template>
	<div class="app-container">
		<div class="filter-container">
			<!-- 收费类别名称模糊查询 -->
			<el-autocomplete
				v-model="listQuery.name"
				:fetch-suggestions="querySearchName"
				:trigger-on-focus="false"
				placeholder="输入收费类别名称查询"
				style="width: 230px;">
			</el-autocomplete>	
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
		<!-- 收费类别列表 -->
		<el-table 
			:data="list" 
			v-loading="loading" 
			style="width: 100%">
			<el-table-column 
				fixed
				prop="code" 
				label="收费类别编码"
				width="200">
			</el-table-column>
			<el-table-column 
				fixed
				prop="name" 
				label="收费类别名称"
				width="200">
			</el-table-column>
			<!-- 系数start -->
			<el-table-column 
				prop="cjcb" 
				label="次均成本"
				width="200">
				<template slot-scope="scope">
					<el-input-number
						v-if="scope.row.edit"
						v-model="scope.row.cjcb" 
						size="mini"/>
					<span v-else>{{ scope.row.cjcb }}</span>
				</template>
			</el-table-column>
			<el-table-column 
				prop="fxxs" 
				label="风险系数"
				width="200">
				<template slot-scope="scope">
					<el-input-number
						v-if="scope.row.edit"
						v-model="scope.row.fxxs" 
						size="mini"/>
					<span v-else>{{ scope.row.fxxs }}</span>
				</template>
			</el-table-column>
			<el-table-column 
				prop="hzks" 
				label="患者所在科室系数"
				width="200">
				<template slot-scope="scope">
					<el-input-number
						v-if="scope.row.edit"
						v-model="scope.row.hzks" 
						size="mini"/>
					<span v-else>{{ scope.row.hzks }}</span>
				</template>
			</el-table-column>
			<el-table-column 
				prop="kdtcxs" 
				label="开单提成系数"
				width="200">
				<template slot-scope="scope">
					<el-input-number
						v-if="scope.row.edit"
						v-model="scope.row.kdtcxs" 
						size="mini"/>
					<span v-else>{{ scope.row.kdtcxs }}</span>
				</template>
			</el-table-column>
			<el-table-column 
				prop="kdxs" 
				label="开单系数"
				width="200">
				<template slot-scope="scope">
					<el-input-number
						v-if="scope.row.edit"
						v-model="scope.row.kdxs" 
						size="mini"/>
					<span v-else>{{ scope.row.kdxs }}</span>
				</template>
			</el-table-column>
			<el-table-column 
				prop="lbType" 
				label="lbType"
				width="200">
				<template slot-scope="scope">
					<el-input
						v-if="scope.row.edit"
						v-model="scope.row.lbType" 
						size="mini"/>
					<span v-else>{{ scope.row.lbType }}</span>
				</template>
			</el-table-column>
			<el-table-column 
				prop="xmds" 
				label="项目点数"
				width="200">
				<template slot-scope="scope">
					<el-input-number
						v-if="scope.row.edit"
						v-model="scope.row.xmds" 
						size="mini"/>
					<span v-else>{{ scope.row.xmds }}</span>
				</template>
			</el-table-column>
			<el-table-column 
				prop="zxtcxs" 
				label="执行提成系数"
				width="200">
				<template slot-scope="scope">
					<el-input-number
						v-if="scope.row.edit"
						v-model="scope.row.zxtcxs" 
						size="mini"/>
					<span v-else>{{ scope.row.zxtcxs }}</span>
				</template>
			</el-table-column>
			<el-table-column 
				prop="zxxs" 
				label="执行系数"
				width="200">
				<template slot-scope="scope">
					<el-input-number
						v-if="scope.row.edit"
						v-model="scope.row.zxxs" 
						size="mini"/>
					<span v-else>{{ scope.row.zxxs }}</span>
				</template>
			</el-table-column>
			<!-- 系数end -->
			<el-table-column 
				prop="select1" 
				label="特殊标识"
				width="200">
				<template slot-scope="scope">
					<el-input
						v-if="scope.row.edit"
						v-model="scope.row.select1" 
						size="mini"/>
					<span v-else>{{ scope.row.select1 }}</span>
				</template>
			</el-table-column>
			<el-table-column fixed="right"
				label="操作" width="100">
				<template slot-scope="scope">
					<el-button
						v-if="scope.row.edit"
						type="success" size="mini"
						:loading="scope.row.subLoading"
						@click="saveChargeType(scope.row)">
						保存
					</el-button>
					<el-button 
						v-else
						@click="scope.row.edit = !scope.row.edit"
						type="text" size="small">
						编辑
					</el-button>
					 <el-button 
						
						@click="editAssignee(scope.row)"
						type="text" size="small">
						绑定
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

		<assignee-dialog
			v-if="assigneeStatus"
			:assDialogStatus="assDialogStatus" 
			:assDialogVisible="assDialogVisible"
			:feedBackData="feedBackData"
			@closeAssigneeDialog="closeAssigneeDialog"
			@getList="getList">
		</assignee-dialog>
	</div>

	
</template>

<script>
import waves from '@/directive/waves'
import countTo from 'vue-count-to'
import { fuzzyQueryChargeTypeName, 
				 fetchChargeTypeList,
				 saveBaseChargeType } from '@/api/binding'
import AssigneeDialog from './components/BindHISTypeDialog'
export default {
	name: 'Basis',
	directives: { waves },
	components: { countTo,AssigneeDialog },
	data() {
		return {
			list: null,
			total: 0,
			loading: false,
			listQuery: {
				currentPage: 1,
				pagesize: 10,
				name: '' //收费类别名称模糊查询
			},
				assigneeStatus: false,
				assDialogStatus: '',
				assDialogVisible: false,
				feedBackData: {}
		}
	},
	created() {
		this.getList()
	},
	methods: {
		getList() {
			var self = this
			self.loading = true
			const query = self.listQuery
			fetchChargeTypeList(query).then(response => {
				const chargeTypes = response.data.chargeTypes
				self.list = chargeTypes.map(v => {
					self.$set(v, 'edit', false)
					self.$set(v, 'subLoading', false)
					return v
				})
				self.total = response.data.total
				self.loading = false
			})
		},
		/* 获取模糊查询收费类别名称内容 */
		querySearchName(queryString, cb) {
			let sugParam = {
				keyword: queryString
			}
			fuzzyQueryChargeTypeName(sugParam).then(res => {
				var suggestions = res.data
				cb(suggestions)
			})
		},
		/* 保存收费类别 */
		saveChargeType(data) {
			data.subLoading = true
			const chargeType = {
				id: data.id,
				code: data.code,
				name: data.name,
				cjcb: data.cjcb,
				fxxs: data.fxxs,
				hzks: data.hzks,
				kdtcxs: data.kdtcxs,
				kdxs: data.kdxs,
				lbType: data.lbType,
				xmds: data.xmds,
				zxtcxs: data.zxtcxs,
				zxxs: data.zxxs,
				select1: data.select1
			}
			saveBaseChargeType(data).then(res => {
				this.$notify({
				  title: '成功',
				  message: data.name+'更新成功',
				  type: 'success',
				  duration: 6000
				})
				data.subLoading = true
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
		editBindHISType(data) {
				this.bindHISTypeStatus = true
				this.bindHISTypeDialogStatus = data.name + '绑定HIS收费分类'
				this.bindHISTypeDialogVisible = true
				this.bindHISTypeData = data				
			},
		closedialog() {
				this.editStatus = false
				this.dialogStatus = ''
				this.dialogFormVisible = false
				this.feedBackData = {}
			},
			editAssignee(data) {
				this.assigneeStatus = true
				this.assDialogStatus = data.name + '绑定HIS收费分类'
				this.assDialogVisible = true
				this.feedBackData = data
			},
			closeAssigneeDialog() {
				this.assigneeStatus = false
				this.assDialogStatus = ''
				this.assDialogVisible = false
				this.feedBackData = {}
			}

	}
}
</script>
<style>
</style>
