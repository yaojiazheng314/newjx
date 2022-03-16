<template>
	<div class="app-container">
		<div class="filter-container">
			<!-- 收费项目名称模糊查询 -->
			<el-autocomplete
				v-model="listQuery.name"
				:fetch-suggestions="querySearchName"
				:trigger-on-focus="false"
				placeholder="输入收费项目名称查询"
				style="width: 230px;">
			</el-autocomplete>	
			<!-- 查询收费类别 -->
			<el-select 
				v-model="listQuery.sflb" 
				filterable clearable 
				placeholder="选择或输入收费类别">
				<el-option 
					v-for="f in sflbParams" 
					:key="f.id" 
					:label="f.name" 
					:value="f.id">
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
			<!-- 收费项目拉取收费类别系数 -->
			<el-button
				v-waves
				size="mini"
				type="primary"
				icon="el-icon-share"
				@click="drawChargeTypeCoef"
				plain round>
				系数调整
			</el-button>
		</div>
		<!-- 收费项目列表 -->
		<el-table 
			:data="list" 
			v-loading="loading" 
			style="width: 100%">
			<el-table-column 
				fixed
				prop="code" 
				label="收费项目编码"
				width="200">
			</el-table-column>
			<el-table-column 
				fixed
				prop="name" 
				label="收费项目名称"
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
				prop="gg" 
				label="规格"
				width="200">
				<template slot-scope="scope">
					<el-input
						v-if="scope.row.edit"
						v-model="scope.row.gg" 
						size="mini"/>
					<span v-else>{{ scope.row.gg }}</span>
				</template>
			</el-table-column>
			<el-table-column 
				prop="hzks" 
				label="所在科室系数"
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
				prop="lsdj" 
				label="单价"
				width="200">
				<template slot-scope="scope">
					<el-input-number
						v-if="scope.row.edit"
						v-model="scope.row.lsdj" 
						size="mini"/>
					<span v-else>{{ scope.row.lsdj }}</span>
				</template>
			</el-table-column>
			<el-table-column 
				prop="lsdw" 
				label="单位"
				width="200">
				<template slot-scope="scope">
					<el-input
						v-if="scope.row.edit"
						v-model="scope.row.lsdw" 
						size="mini"/>
					<span v-else>{{ scope.row.lsdw }}</span>
				</template>
			</el-table-column>
			<el-table-column 
				prop="zjm" 
				label="助记码"
				width="200">
				<template slot-scope="scope">
					<el-input
						v-if="scope.row.edit"
						v-model="scope.row.zjm" 
						size="mini"/>
					<span v-else>{{ scope.row.zjm }}</span>
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
			<el-table-column 
				fixed="right"
				prop="sflb" 
				label="收费类别"
				width="200">
				<template slot-scope="scope">
					<el-select 
						v-if="scope.row.edit"
						v-model="scope.row.sflb" 
						filterable size="mini"
						placeholder="选择或输入收费类别">
						<el-option 
							v-for="f in sflbParams" 
							:key="f.id" 
							:label="f.name" 
							:value="f.id">
						</el-option>
					</el-select>
					<span v-else>{{ scope.row.sflbName }}</span>
				</template>
			</el-table-column>
			<el-table-column fixed="right"
				label="操作" width="100">
				<template slot-scope="scope">
					<el-button
						v-if="scope.row.edit"
						type="success" size="mini"
						:loading="scope.row.subLoading"
						@click="saveChargeItem(scope.row)">
						保存
					</el-button>
					<el-button 
						v-else
						@click="scope.row.edit = !scope.row.edit"
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
	</div>
</template>

<script>
import waves from '@/directive/waves'
import countTo from 'vue-count-to'
import { getChargeTypeParam,
				 fuzzyQueryChargeItemName, 
				 fetchChargeItemList,
				 saveBaseChargeItem,
				 adjustChargeItemCoef } from '@/api/binding'
export default {
	name: 'Basis',
	directives: { waves },
	components: { countTo },
	data() {
		return {
			list: null,
			total: 0,
			loading: false,
			listQuery: {
				currentPage: 1,
				pagesize: 10,
				name: '', //收费类别名称模糊查询
				sflb: null
			},
			sflbParams: [] //收费类别参数
		}
	},
	created() {
		this.getList()
	},
	mounted() {
		this.getSflbParams()
	},
	methods: {
		getList() {
			var self = this
			self.loading = true
			const query = self.listQuery
			fetchChargeItemList(query).then(response => {
				const chargeItems = response.data.chargeItems
				self.list = chargeItems.map(v => {
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
		/* 保存收费类别 */
		saveChargeItem(data) {
			data.subLoading = true
			const chargeItem = {
				id: data.id,
				code: data.code,
				name: data.name,
				cjcb: data.cjcb,
				fxxs: data.fxxs,
				gg: data.gg,
				hzks: data.hzks,
				kdtcxs: data.kdtcxs,
				kdxs: data.kdxs,
				lsdj: data.lsdj,
				lsdw: data.lsdw,
				zjm: data.zjm,
				xmds: data.xmds,
				zxtcxs: data.zxtcxs,
				zxxs: data.zxxs,
				sflb: data.sflb,
				select1: data.select1
			}
			saveBaseChargeItem(data).then(res => {
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
		/* 拉取收费类别系数 */
		drawChargeTypeCoef() {
			const tip = '此操作前请确认好收费类别相关系数，是否继续？'
			this.$confirm(tip, '提示', {
				confirmButtonText: '确定',
			  cancelButtonText: '取消',
			  type: 'warning'
			}).then(() => {
				this.saveBaseChargeTypeCoef()
			}).catch(() => {
			  this.$message({
			    type: 'info',
			    message: '取消自动绑定'
			  });
			});
		},
		saveBaseChargeTypeCoef() {
			const loading = this.$loading({
				lock: true,
			  text: '正在根据收费类别调整收费项目系数，请稍候',
			  spinner: 'el-icon-loading',
			  background: 'rgba(0, 0, 0, 0.7)'
			});
			adjustChargeItemCoef().then(res => {
				let resStatus = res.status
				if (resStatus == 200) {
					this.$message({
					  type: 'success',
					  message: '收费项目系数调整完成，请检查'
					});
					loading.close()
					this.getList()
				}
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
		}
	}
}
</script>
<style>
</style>
