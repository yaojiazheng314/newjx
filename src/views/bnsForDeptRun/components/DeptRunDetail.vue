<template>
	<div id="deptRunDetail">
		<el-dialog 
			:title="dialogStatus" 
			:show-close="showClose"
			:close-on-click-modal="false"
			:visible.sync="visible"
			@close="closeDialog">
			<el-form 
				ref="detailForm"
				:model="detailForm" 
				style="height: 450px; margin: auto; width: 700px;">
				<el-form-item prop="calcStr">
					<el-input 
						type="textarea" 
						placeholder="公式运算明细"
						:rows="4"
						v-model.trim="detailForm.calcStr">
					</el-input>
				</el-form-item>
				<el-tabs type="border-card">
					<el-tab-pane>
						<span slot="label">
							<svg-icon icon-class="use" /> 使用</span>
						<el-table
							:data="useList"
							v-loading="loading"
							element-loading-text="拼命加载中"
							element-loading-spinner="el-icon-loading"
							element-loading-background="rgba(0, 0, 0, 0.8)"
							style="width: 100%"
							height="250">
							<el-table-column prop="termName" label="元素">
								<template slot-scope="scope">
									<el-tooltip 
										:content="scope.row.termType"
										placement="right" effect="light">
										<span>
											{{ scope.row.termName }}</span>
									</el-tooltip>
								</template>
							</el-table-column>
							<el-table-column
								prop="val"
								label="值">
							</el-table-column>
							<el-table-column prop="calcType" label="转换">
								<template slot-scope="scope">
									<el-tag 
										v-if="scope.row.calcType === 'dtd'"
										type="info"
										size="mini">
										科室
									</el-tag>
									<el-tag 
										v-else-if="scope.row.calcType === 'ptd'"
										type="warning"
										size="mini">
										人员转科室
									</el-tag>								
								</template>
							</el-table-column>
							<el-table-column prop="func" label="函数">
								<template slot-scope="scope">
									<span v-if="scope.row.func === '0'">
										未使用函数
									</span>
									<el-tag 
										v-else
										size="mini">
										{{ scope.row.func }}
									</el-tag>								
								</template>
							</el-table-column>
							<el-table-column prop="funcType" label="函数参数">
								<template slot-scope="scope">
									<span v-if="scope.row.funcType === '0'">
										未使用函数参数
									</span>
									<el-tag 
										v-else
										size="mini">
										{{ scope.row.funcType }}
									</el-tag>								
								</template>
							</el-table-column>
						</el-table>
					</el-tab-pane>
					<el-tab-pane>
						<span slot="label">
							<svg-icon icon-class="unuse" /> 未使用</span>
						<el-table
							:data="unuseList"
							style="width: 100%"
							height="250">
							<el-table-column prop="termName" label="元素">
								<template slot-scope="scope">
									<el-tooltip 
										:content="scope.row.termType"
										placement="right" effect="light">
										<span>
											{{ scope.row.termName }}</span>
									</el-tooltip>
								</template>
							</el-table-column>
							<el-table-column
								prop="val"
								label="值">
							</el-table-column>
							<el-table-column prop="calcType" label="转换">
								<template slot-scope="scope">
									<el-tag 
										v-if="scope.row.calcType === 'dtd'"
										type="info"
										size="mini">
										科室
									</el-tag>
									<el-tag 
										v-else-if="scope.row.calcType === 'ptd'"
										type="warning"
										size="mini">
										人员转科室
									</el-tag>								
								</template>
							</el-table-column>
							<el-table-column prop="func" label="函数">
								<template slot-scope="scope">
									<span v-if="scope.row.func === '0'">
										未使用函数
									</span>
									<el-tag 
										v-else
										size="mini">
										{{ scope.row.func }}
									</el-tag>								
								</template>
							</el-table-column>
							<el-table-column prop="funcType" label="函数参数">
								<template slot-scope="scope">
									<span v-if="scope.row.funcType === '0'">
										未使用函数参数
									</span>
									<el-tag 
										v-else
										size="mini">
										{{ scope.row.funcType }}
									</el-tag>								
								</template>
							</el-table-column>
						</el-table>
					</el-tab-pane>
				</el-tabs>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
	import { getDeptRunDetails } from '@/api/bnsForDeptRun'
	export default {
		props: {
			dialogFormVisible: {
				type: Boolean
			},
			runData: {
				type: Object
			},
			accountStatus: {
				type: Boolean
			},
			dialogStatus: {
				type: String
			}
		},
		name: 'DeptRunDetail',
		data() {
			return {
				showClose: true,
				loading: false,
				visible: false,
// 				searchUse: '',
// 				searchUnUse: '',
				detailForm: {
					calcStr: ''
				},
				useList: [],
				unuseList: [],
				detailQuery: {
					runID: null,
					accountStatus: false
				}
			}
		},
		created() {
			this.visible = this.dialogFormVisible
		},
		mounted() {
			const data = this.runData
			if (data.id !== null && data.id !== '') {
					this.detailQuery.runID = data.id
					this.detailQuery.accountStatus = this.accountStatus
					this.getRunDetail()
				}
		},
		methods: {
			getRunDetail() {
				var self = this
				self.loading = true
				const query = self.detailQuery
				getDeptRunDetails(query).then(response => {
					self.detailForm.calcStr = response.data.runStr
					const details = response.data.details
					details.map(v => {
						if (v.isUse === 1) {
							self.useList.push(v)
						}else if (v.isUse === 0) {
							self.unuseList.push(v)
						}
					})
					self.loading = false
				})
			},
			closeDialog() {
				var self = this
				self.detailForm.calcStr = ''
				self.useList = []
				self.unuseList = []
				self.$emit('closeDeptRunDetail')
			}
		}
	}
</script>

<style>
</style>
