<template>
	<div class="app-container">
		<div class="filter-container">
			<!-- 考核依据查询 -->
			<el-select 
				v-model="listQuery.basis" 
				filterable clearable 
				placeholder="选择或输入别名" 
				class="searchClass">
				<el-option 
					v-for="item in basisParams" 
					:key="item.id" 
					:label="item.name" 
					:value="item.id">
					<span style="float: left">{{ item.name }}</span>
				</el-option>
			</el-select>
			<!-- 考核依据模糊查询 -->
			<el-autocomplete
				v-model="listQuery.fuzzyQueryStr"
				:fetch-suggestions="querySearch"
				placeholder="自定义核算对象内容"
				style="width: 180px;">
			</el-autocomplete>
		</div>
		<!-- 考核依据列表 别名 依据 创建用户 编辑 -->
	</div>
</template>

<script>
import waves from '@/directive/waves'
import { fetchBasis, 
				 getExamBasisParam,
				 getBasisSuggestion } from '@/api/exam'
export default {
	name: 'Basis',
	directives: { waves },
	data() {
		return {
			list: null,
			total: 0,
			loading: false,
			listQuery: {
				currentPage: 1,
				pagesize: 10,
				basis: null,
				fuzzyQueryStr: '' //模糊查询依据basis字段
			},
			basisParams: [],
			examBasisData: {}
		}
	},
	created() {
		// this.getList()
	},
	mounted() {
		this.getBasisParam()
	},
	methods: {
		getList() {
			var self = this
			self.loading = true
			const query = self.listQuery
			fetchBasis(query).then(response => {
				self.list = response.data.basises
				self.total = response.data.total
				self.listLoading = false
			})
		},
		/* 获取考核依据参数 */
		getBasisParam() {
			var self = this
			getExamBasisParam().then(res => {
				self.basisParams = res.data
			}) 
		},
		/* 获取模糊查询建议输入内容 */
		querySearch(queryString, cb) {
			let sugParam = {
				queryStr: queryString
			}
			getBasisSuggestion(sugParam).then(res => {
				const suggestions = res.data
				cb(suggestions)
			})
		}
	}
}
</script>

<style>
</style>
