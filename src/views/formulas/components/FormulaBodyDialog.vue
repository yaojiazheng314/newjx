<template>
	<div id="formulaBodyDialog">
		<el-dialog
			:title="bodyDialogStatus"
			:show-close="showClose"
			:close-on-click-modal="false"
			:visible.sync="bodyFormVisible">
			<el-form
				ref="bodyForm"
				:rules="rules"
				:model="bodyForm"
				style="height: 450px; width: 580px; margin-left:50px;">
				<el-form-item prop="body">
					<span slot="label">公式内容    </span>
					<el-popover
						placement="right"
						title="核算规则"
						width="400"
						trigger="hover">
						<template slot-scope="content">
							<el-collapse accordion>
								<el-collapse-item
									title="数据类型转换" name="1">
									<span style="color: #8492a6; font-size: 15px">
										{{ tip1 }}
									</span>
								</el-collapse-item>
								<el-collapse-item
									title="关于'负负得正'的问题" name="2">
									<span style="color: #8492a6; font-size: 15px">
										{{ tip2 }}
									</span>
								</el-collapse-item>
								<el-collapse-item
									title="函数支持" name="3">
									<el-table
										:data="tip3"
										style="width: 100%"
										height="350px">
										<el-table-column
											prop="tip"
											label="函数说明"
											width="350"
											style="color: #8492a6; font-size: 12px">
										</el-table-column>
									</el-table>
								</el-collapse-item>
								<el-collapse-item>
									<template slot="title">
										关于编辑公式
										<i class="header-icon el-icon-info"></i>
									</template>
									<span style="color: #8492a6; font-size: 15px">
										{{ tip4 }}
									</span>
								</el-collapse-item>
							</el-collapse>
						</template>
						<el-button
							type="info"
							size="mini"
							icon="el-icon-message"
							slot="reference" circle>
						</el-button>
					</el-popover>
					<el-input
						type="textarea"
						placeholder="编辑一个简短有意义的公式"
						:rows="4"
						v-model.trim="bodyForm.body">
					</el-input>
				</el-form-item>
				<el-tabs type="border-card">
					<el-tab-pane>
						<span slot="label">
							<svg-icon icon-class="dataitem" /> 因子</span>
						<el-input
							v-model="searchItem"
							size="mini"
							placeholder="输入因子关键字搜索"
							style="width: 200px;"/>
						<el-table
							:data="itemParams.filter(item => !searchItem || item.name.toLowerCase().includes(searchItem.toLowerCase()))"
							v-loading="itemLoading"
							element-loading-text="拼命加载中"
							element-loading-spinner="el-icon-loading"
							element-loading-background="rgba(0, 0, 0, 0.8)"
							style="width: 100%"
							height="250" useVirtual
							:default-sort = "this.bodyForm.type === '科室' ?
							{prop: 'type', order: 'descending'} :
							{prop: 'type', order: 'ascending'}">
							<el-table-column
								prop="name"
								label="因子"
								width="180">
								<template slot-scope="scope">
									<span @click="addItemToBody(scope.row.name)">
										<mallki
											:text="scope.row.name">
										</mallki>
									</span>
								</template>
							</el-table-column>
							<el-table-column
								prop="type" label="适用类别"
								:filters="[{ text: '科室', value: '科室' },
													 { text: '人员', value: '人员' }]"
							  :filter-method="filterItemType" filter-placement="bottom-end">
								<template slot-scope="scope">
                  <el-tag
                  	:type="scope.row.type === '科室' ?
                  	'info' : 'warning'"
                  	disable-transitions>{{ scope.row.type }}</el-tag>
								</template>
							</el-table-column>
							<el-table-column
								prop="defaultValue"
								label="默认值">
							</el-table-column>
						</el-table>
					</el-tab-pane>
					<el-tab-pane>
						<span slot="label">
							<svg-icon icon-class="money" /> 权重</span>
						<el-input
							v-model="searchCoef"
							size="mini"
							placeholder="输入权重关键字搜索"
							style="width: 200px;"/>
						<el-table
							:data="coefParams.filter(coef => !searchCoef || coef.name.toLowerCase().includes(searchCoef.toLowerCase()))"
							style="width: 100%"
							height="250" useVirtual>
							<el-table-column
								prop="name"
								label="权重">
								<template slot-scope="scope">
									<span @click="addCoefToBody(scope.row.name)">
										<mallki
											:text="scope.row.name">
										</mallki>
									</span>
								</template>
							</el-table-column>
							<el-table-column
								prop="defaultValue"
								label="默认值">
							</el-table-column>
						</el-table>
					</el-tab-pane>
					<el-tab-pane>
						<span slot="label">
							<svg-icon icon-class="formulaBig" /> 公式</span>
						<el-input
							v-model="searchFormula"
							size="mini"
							placeholder="输入公式关键字搜索"
							style="width: 200px;"/>
						<el-table
							:data="formulas.filter(f => !searchFormula || f.name.toLowerCase().includes(searchFormula.toLowerCase()))"
							style="width: 100%"
							height="250" useVirtual
							:default-sort = "this.bodyForm.type === '科室' ?
							{prop: 'type', order: 'descending'} :
							{prop: 'type', order: 'ascending'}">
							<el-table-column
								prop="name"
								label="公式">
								<template slot-scope="scope">
									<span @click="addFormulaToBody(scope.row.name)">
										<mallki
											:text="scope.row.name">
										</mallki>
									</span>
								</template>
							</el-table-column>
							<el-table-column
								prop="type" label="适用类别"
								:filters="[{ text: '科室', value: '科室' },
													 { text: '人员', value: '人员' }]"
								:filter-method="filterFormulaType" filter-placement="bottom-end">
								<template slot-scope="scope">
									<el-tag
										slot="reference"
										:type="scope.row.type === '科室' ?
										'info' : 'warning'"
										disable-transitions>{{ scope.row.type }}</el-tag>
								</template>
							</el-table-column>
						</el-table>
					</el-tab-pane>
					<el-tab-pane>
						<span slot="label">
							<svg-icon icon-class="func" /> 函数</span>
						<el-table
							:data="funcData"
							style="width: 100%"
							height="250">
							<el-table-column
								prop="expression"
								label="函数">
								<template slot-scope="scope">
									<el-tooltip
										v-if="scope.row.expression === 'fcs[x, type]'
										 || scope.row.expression === 'fca[x, type]'"
										content="type: 项目/科室/主任组/治疗组/护理组"
										placement="right">
										<span @click="addFuncExpresToBody(scope.row.expression)">
											<mallki
												:text="scope.row.expression">
											</mallki>
										</span>
									</el-tooltip>
									<span v-else @click="addFuncExpresToBody(scope.row.expression)">
										<mallki
											:text="scope.row.expression">
										</mallki>
									</span>
								</template>
							</el-table-column>
							<el-table-column
								prop="description"
								label="描述">
							</el-table-column>
						</el-table>
					</el-tab-pane>
				</el-tabs>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button
					@click="closeDialog"
					class="guo-btn yellow-btn">
					返 回
				</el-button>
				<el-button
					type="primary"
					@click="saveBody"
					:loading="loading"
					class="guo-btn light-blue-btn">
					保 存
				</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import Mallki from '@/components/TextHoverEffect/Mallki'
import { saveFormulaBody } from '@/api/bnsFormula'
import { getCoefParam } from '@/api/bnsCoef'
import { getItemApplyTip } from '@/api/bnsDataItem'
export default {
	components: { Mallki },
	props: {
		bodyFormVisible: {
			type: Boolean
		},
		bodyData: {
			type: Object
		},
		bodyDialogStatus: {
			type: String
		},
		formulaParams: {
			type: Array
		}
	},
	name: 'FormulaBodyDialog',
	data() {
		return {
			showClose: false,
			loading: false,
			itemLoading: true,
			searchItem: '',
			searchCoef: '',
			searchFormula: '',
			itemParams: [],
			coefParams: [],
			formulas: [],
			bodyForm: {
				id: null,
				body: ''
			},
			rules: {
			   body: [
			     { required: true, message: '请编辑公式内容', trigger: 'blur' },
					 { max: 500, message: '公式内容长度在500字符以内', trigger: 'blur' }
			   ]
			},
			funcData: [
				{ expression: 'fcs[x]', description: '下级求和' },
				{ expression: 'fcs[x, type]', description: '指定下级类型求和' },
				{ expression: 'fca[x]', description: '下级求平均数' },
				{ expression: 'fca[x, type]', description: '指定下级类型求平均' },
				{ expression: 'fp[x]', description: '从上级获取' },
				{ expression: 'fpa[x]', description: '从上级获取与同级平均' },
				{ expression: 'fpat[x]', description: '从上级获取与同级同类型平均' },
				{ expression: 'fw[x]', description: '求和指定因子或公式' },
				{ expression: 'favgr[x]', description: '求report中以bns_data_item为组的平均值' },
				{ expression: 'fcount[x]', description: '求report中以bns_data_item为组的记录数' },
				{ expression: 'p[x]', description: '求同级占比' },
				{ expression: 'pt[x]', description: '同级同类型占比' }
			],
			formulaRulesTip1: '1.核算权重优先级：科室 > 人员 > 职位；2.科室公式选择人员类型数据（因子/公式）则获取该科室所有人员该数据和；3.人员公式选择科室类型数据则获取该人员所属科室数据（因子/公式）；4.对需要“负负得正”的数据（因子/权重/公式）使用小括号: 10-(-5)=15；5.函数支持（目前仅支持科室类型的数据（因子/公式））：（1）fcs[x]:下级求和 （2）fcs[x, type]:指定下级类型求和 （3）fca[x]:下级求平均 （4）fca[x, type]:指定下级类型求平均 （5）fp[x]:从上级获取 （6）fpa[x]:从上级获取与同级求平均 （7）fpat[x]:从上级获取与同类型求平均 （8）p[x]:求同级占比 （9）pt[x]:求同级同类型占比 （10）表达式:1.fp[x + y + 3] = fp[x] + fp[y] + 3 2.fcs[x + y + 3, type] = fsc[x, type] + fcs[y, type] + 3；6.每个公式的意义应简洁明确，公式本身应简短；',
			tip1: '科室公式选择人员类型数据（因子/公式）则获取该科室所有人员该数据和；人员公式选择科室类型数据则获取该人员所属科室数据（因子/公式）',
			tip2: '对需要“负负得正”的数据（因子/权重/公式）要使用小括号: 10-(-5)=15',
			tip3: [
							{ tip: '（1）fcs[x]:获取下级科室的数据和'},
							{ tip: '（2）fcs[x, type]:获取指定科室类型的下级科室的数据和'},
							{ tip: '（3）fca[x]:获取下级科室的平均值'},
							{ tip: '（4）fca[x, type]:获取指定科室类型的下级科室的平均值'},
							{ tip: '（5）fp[x]:获取上级科室数据'},
							{ tip: '（6）fpa[x]:获取上级科室数据与同级科室平均得到的值'},
							{ tip: '（7）fpat[x]:获取上级科室数据与同级同类型科室平均得到的值'},
							{ tip: '（8）fw[x]:求和指定因子或公式'},
							{ tip: '（9）favgr[x]:求report中以bns_data_item为组的平均值'},
							{ tip: '（10）fcount[x]:求report中以bns_data_item为组的记录数'},
							{ tip: '（11）p[x]:求在同级科室中的占比'},
							{ tip: '（12）pt[x]:求在同级同类型科室中的占比'},
							{ tip: '（13）表达式:1.fp[x + y + 3] = fp[x] + fp[y] + 3 ; 2.fcs[x + y + 3, type] = fsc[x, type] + fcs[y, type] + 3;'},
							{ tip: ' 函数支持科室类型的因子数据与公式数据，不支持人员类型数据，不支持权重数据'},
							{ tip: ' 函数运算优先级规则：函数运算>填报数据(函数失效时)>默认值(因子默认值/公式默认0)'}
						],
			tip4: '每个公式的意义应简洁明确，公式本身应简短；公式之间不能互相包含：公式A包含公式B，公式B包含公式C，则公式C不能包含公式A'
		}
	},
	mounted() {
		const data = this.bodyData
		if (data.id !== null && data.id !== '') {
				this.bodyForm = Object.assign({}, data)
				this.getItemParams()
				this.getCoefParams()
				//公式不能应用于自身公式内容
				this.getFormulas()
			}
	},
	methods: {
		saveBody() {
			var self = this
			self.$refs['bodyForm'].validate((valid) => {
		    if (valid) {
					const data = self.bodyForm
					self.loading = true
		      saveFormulaBody(data).then(response => {
						let resultStatus = response.status
						if (resultStatus === 520) {
							self.$message({
							  message: response.msg,
							  type: 'error',
							  duration: 6000
							}).then(() => {
								self.$message({
									type: 'info',
									message: '稍候重试'
								})
							}).catch(() => {
								self.$message({
									type: 'info',
									message: '稍候重试'
								})
							})
							self.loading = false
						}else {
							self.$notify({
							  title: '成功',
							  message: response.msg,
							  type: 'success',
							  duration: 6000
							})
							self.bodyForm.body = response.data.body
							self.loading = false
							self.$emit('getList')
							self.$emit('getFormulaParams')
						}
					})
		    } else {
		      return false;
		    }
		  });
		},
		getItemParams() {
			getItemApplyTip().then(response => {
				this.itemParams = response.data
				this.itemLoading = false
			})
		},
		getCoefParams() {
			getCoefParam().then(response => {
				this.coefParams = response.data
			})
		},
		getFormulas() {
			this.formulas = this.formulaParams.filter(t => t.id !== this.bodyForm.id)
		},
		resetForm() {
			this.bodyForm.id = null
			this.bodyForm.body = ''
		},
		closeDialog() {
			// this.$refs['bodyForm'].clearValidate()
			this.resetForm()
			this.$emit('closeBodyDialog')
		},
		filterItemType(value, row) {
			return row.type === value
		},
		filterFormulaType(value, row) {
			return row.type === value
		},
		addItemToBody(str) {
			this.bodyForm.body += "@" + str
		},
		addCoefToBody(str) {
			this.bodyForm.body += "#" + str
		},
		addFormulaToBody(str) {
			this.bodyForm.body += "$" + str
		},
		addFuncExpresToBody(str) {
			this.bodyForm.body += str
		}
	}
}
</script>
