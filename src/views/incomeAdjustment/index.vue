<template>
	<div class="app-container">
		<div class="filter-container">
			<el-select 
				v-model="listQuery.department" 
				filterable clearable 
				placeholder="选择或输入科室" 
				class="searchClass">
				<el-option 
					v-for="d in departmentParams" 
					:key="d.id" 
					:label="d.name + '_' + d.type" 
					:value="d.code">
					<span style="float: left">{{ d.name }}</span>
					<span style="float: right; color: #8492a6; font-size: 13px">
						{{ d.type }}
					</span>
				</el-option>
			</el-select>
			<!-- 查询收费类别 -->
			<el-select 
				v-model="listQuery.bnsDataItem" 
				filterable clearable 
				placeholder="选择或输入收费类别">
				<el-option 
					v-for="f in sflbParams" 
					:key="f.id" 
					:label="f.name" 
					:value="f.id">
				</el-option>
			</el-select>
			<el-date-picker
				v-model="listQuery.yearmonth"
				type="month"
				placeholder="选择月"
				format="yyyy 年 M 月"
				value-format="yyyy-MM"
				:clearable="false"
				:editable="false"
				@change="handleFilter"
				class="searchClass">
			</el-date-picker>
			<!-- 查询按钮 -->
			<el-button
			 v-waves
			 size="mini"
			 type="primary"
			 icon="el-icon-search"
			 @click="handleFilter">
				查询
			</el-button>
		<el-button
			 v-waves
			 size="mini"
			 type="primary"
			 icon="el-icon-search"
			 @click="createIncomeData">
				生成收入数据
			</el-button>
			<el-button
			 v-waves
			 size="mini"
			 type="primary"
			 icon="el-icon-circle-check"
			 @click="createIncomeData">
				审核
			</el-button>
			<el-button
			 v-waves
			 size="mini"
			 type="primary"
			 icon="el-icon-circle-close"
			 @click="createIncomeData">
				取消审核
			</el-button>

		</div>
		<!-- 收入列表 -->
		<el-table 
			:data="list" 
			v-loading="loading" 
			style="width: 100%">

			<el-table-column 
				
				prop="deptName" 
				label="科室名称"
				width="150">
			</el-table-column>
			<!-- 年月 -->
			<el-table-column 
				prop="yearmonth" 
				label="年月"
				width="100">
			</el-table-column>
			<!-- 收费类别 -->
			<el-table-column 
				
				prop="bdiName" 
				label="收费类别"
				width="100">
				<!-- <template slot-scope="scope">
					
					{{ scope.row.category }}
				</template> -->
			</el-table-column>
			<!-- 院属 -->
			<el-table-column 
				
				prop="hospName" 
				label="院属"
				width="100">
				<!-- <template slot-scope="scope">
					
					{{ scope.row.category }}
				</template> -->
			</el-table-column>
			
			<!-- 实际金额 -->
			<el-table-column 
				prop="realValue" 
				label="实际金额"
				width="200">
				<!-- <template slot-scope="scope">
					{{ scope.row.realValue }}
				</template> -->
			</el-table-column>
			<!-- 分成金额 -->
			<el-table-column 
				prop="value" 
				label="分成金额"
				width="200">
				<!-- <template slot-scope="scope">
					{{ scope.row.value }}
				</template> -->
			</el-table-column>
			<!-- 修改金额 -->
			<el-table-column 
				prop="modifyValue" 
				label="修改金额"
				width="200">
				<template slot-scope="scope">
					<el-input-number
						v-if="scope.row.edit"
						v-model="scope.row.modifyValue" 
						size="mini"/>
					<span v-else>{{ scope.row.modifyValue }}</span>
				</template>
			</el-table-column>
			<!-- 修改人员 -->
			<el-table-column 
				prop="modifyName" 
				label="修改人员"
				width="200">
				
			</el-table-column>

			<!-- 最新修改时间 -->
			<el-table-column 
				prop="operateTime" 
				label="最新修改时间"
				width="200">
				
			</el-table-column>
			
			
			<el-table-column fixed="right"
				label="操作" width="200">
				<template slot-scope="scope">
					<!-- 如果有修改的记录 此按钮显示 -->
					<el-button
						v-if="scope.row.modifyFlag === 1 && !scope.row.edit "
						type="text" size="mini"
						:loading="scope.row.subLoading"
						@click="saveChargeItem(scope.row)">
						查看
					</el-button>
					<el-button
						v-if="scope.row.modifyFlag === 1  && !scope.row.edit"
						type="text" size="mini"
						:loading="scope.row.subLoading"
						@click="saveChargeItem(scope.row)">
						重置
					</el-button>
					<el-button
						v-if="scope.row.edit"
						type="success" size="mini"
						:loading="scope.row.subLoading"
						@click="saveChangeItem(scope.row)">
						保存
					</el-button>
					<el-button 
						v-else
						@click="scope.row.edit = !scope.row.edit"
						type="text" size="small">
						编辑
					</el-button>
					<el-button
						v-if="scope.row.modifyFlag === 1  && !scope.row.edit"
						type="text" size="mini"
						:loading="scope.row.subLoading"
						@click="saveChargeItem(scope.row)">
						删除
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
	</div>
</template>

<script>
import waves from '@/directive/waves'
import countTo from 'vue-count-to'
import AdjustmentViewDialog from './components/AdjustmentViewDialog'
import NewAdjustDialog from './components/NewAdjustDialog'

import { getDepartmentParam	} from '@/api/department'
import { getItemIncomehModifyDataList,saveItemIncomehModifyData,createIncomData } from '@/api/bnsDataItemReportModify'
import { getChargeTypeParam} from '@/api/binding'
export default {
	name: 'Basis',
	directives: { waves },
	components: { countTo,AdjustmentViewDialog,NewAdjustDialog},
	data() {
		return {
			list: null,
			total: 0,
			loading: false,
			listQuery: {
				currentPage: 1,
				pagesize: 10,
				deptName: '', //收费类别名称模糊查询
				bnsDataItem: '',
				yearmonth:'',
			},
			sflbParams: [], //收费类别参数

			departmentParams: [],
		}
	},
	created() {
		this.getList()
	},
	mounted() {
		this.getSflbParams();
		this.getDepartmentParams();
	},
	methods: {
		getDepartmentParams() {
				getDepartmentParam().then(response => {
					this.departmentParams = response.data
				})
			},
		getList() {
			var self = this
			self.loading = true
			const query = self.listQuery
			getItemIncomehModifyDataList(query).then(response => {
				const handleItemData = response.data.reportModifyItem;
				//console.log(response.data.reportModifyItem);

				self.list = handleItemData.map(v => {
					self.$set(v, 'edit', false)
					self.$set(v, 'subLoading', false)
					return v
				})
				self.total = response.data.total
				self.loading = false
			})
		},
		/* 获取收费类别参数列表 */
		getSflbParams() {
			getChargeTypeParam().then(res => {
				this.sflbParams = res.data
			})
		},
		/* 获取模糊查询收费项目名称内容 */
		querySearchName(queryString, cb) {
			let sugParam = {
				keyword: queryString
			}
			fuzzyQueryChargeItemName(sugParam).then(res => {
				var suggestions = res.data
				cb(suggestions)
			})
		},
		/* 保存调整内容 */
		saveChangeItem(data) {
			alert(11);
			data.subLoading = true
			const imcomeModify = {
				id: data.id,
				deptName: data.deptName,
				bdiName: data.bdiName,				
				yearmonth: data.yearmonth,
				value: data.value,
				realValue: data.realValue,
				modifyName: data.modifyName,
				modifyValue: data.modifyValue,
				modifyFlag: data.modifyFlag,
				operateTime: data.operateTime
			}
			console.log(data);
			saveItemIncomehModifyData(data).then(res => {
				this.$notify({
				  title: '成功',
				  message: data.bdiName+'更新成功',
				  type: 'success',
				  duration: 6000
				})
				data.subLoading = true
				this.getList()
			})
		},
		getPersonDataInfo(data) {
				this.editStatus = true
				this.dialogStatus = '查看修改记录'
				this.dialogFormVisible = true
				this.personData = data
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
		createIncomeData(query){
			this.loading = true
			var queryC = this.listQuery
			if(queryC.yearmonth === ''){
				alert("请选择年月");
				return
			}
			createIncomData(queryC).then(res => {
				this.$notify({
				  title: '成功',
				  message: queryC.yearmont+'收入生成成功',
				  type: 'success',
				  duration: 6000
				})
				this.getList()
			})
			
		},
		handleCurrentChange(currentPage) {
			this.listQuery.currentPage = currentPage
			this.getList()
		}
	}
}
</script>
<style>
</style>
