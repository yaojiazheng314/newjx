<template>
	<div id="bodyReplaceDialog">
		<el-dialog 
			:title="replaceDialogStatus" 
			:show-close="showClose"
			:close-on-click-modal="false"
			:visible.sync="replaceFormVisible">
			<el-tooltip 
				class="item" effect="dark" 
				content="新建替换内容" placement="right">
				<el-button 
					v-waves 
					type="primary" 
					icon="el-icon-edit" size="mini" 
					@click="handleCreate" 
					circle>
				</el-button>
			</el-tooltip>	
			<el-table
				:data="repList"
				v-loading="listLoading"
				style="width: 100%"
				row-key="id" highlight-current-row>
				<el-table-column
					label="替换内容"
					prop="originalStr">
				</el-table-column>
				<el-table-column
					label="触发条件"
					prop="conditionNum">
					<template slot-scope="scope">
						<el-button 
							type="text" size="small"
							@click="openRcs(scope.row)">
							<span>共{{ scope.row.conditionNum }}项</span>
						</el-button>
					</template>
				</el-table-column>
				<el-table-column>
					<template slot-scope="scope">
						<el-button
							type="primary"
							size="mini"
							@click="handleEdit(scope.row)"
							round plain>编辑</el-button>
							<el-button
								type="danger"
								size="mini"
								@click="handleDeleteRep(scope.row)"
								round plain>删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination-container">
				<el-pagination 
					@size-change="handleSizeChange" 
					@current-change="handleCurrentChange" 
					:current-page="listQuery.currentPage"
					:page-sizes="[5]" 
					:page-size="listQuery.pagesize" 
					layout="total, sizes, prev, pager, next, jumper"
					background
					:total="total">
				</el-pagination>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button 
					@click="closeDialog"
					class="guo-btn yellow-btn">
					返 回
				</el-button>
			</div>
			<!-- 编辑替换内容 -->
			<el-dialog 
				:title="brDialogStatus" 
				:show-close="showClose"
				:close-on-click-modal="false"
				:visible.sync="brFormVisible"
				append-to-body>
				<el-form 
					ref="brForm"
					:rules="rules"
					:model="brForm" 
					style="height: 260px; width: 600px; margin-left:50px;">
					<el-form-item prop="body">
						<span slot="label">公式内容    </span>
						<el-input 
							type="textarea" 
							placeholder="复制要替换的公式部分粘贴到替换内容中"
							:rows="4"
							v-model.trim="formulaBody"
							readonly="readonly">
						</el-input>
					</el-form-item>
					<el-form-item prop="originalStr">
						<span slot="label">被替换内容    </span>
						<el-input 
							type="textarea" 
							placeholder="从上方完整公式中截取要替换的内容"
							:rows="4"
							v-model.trim="brForm.originalStr">
						</el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button 
						@click="closeBrForm"
						class="guo-btn yellow-btn">
						返 回
					</el-button>
					<el-button 
						type="primary"
						@click="saveBodyReplace"
						:loading="loading"
						class="guo-btn light-blue-btn">
						保 存
					</el-button>
				</div>
			</el-dialog>
			<!-- 编辑触发条件 -->
			<el-dialog 
				:title="rcDialogStatus" 
				:show-close="showClose"
				:close-on-click-modal="false"
				:visible.sync="rcFormVisible"
				append-to-body>
				<el-tooltip 
					class="item" effect="dark" 
					content="添加触发条件" placement="right">
					<el-button 
						v-waves 
						type="primary" 
						icon="el-icon-plus" size="mini" 
						@click="addNewRcToRcs" 
						circle>
					</el-button>
				</el-tooltip>	
				<el-table 
					v-loading="rcLoading" 
					:data="rcs" 
					fit 
					highlight-current-row 
					style="width: 100%">
					<el-table-column label="触发条件">
						<template slot-scope="scope">
							<template v-if="scope.row.edit">
								<el-input 
									autofocus
									v-model.trim="scope.row.conditionStr" 
									class="edit-input" size="small"
									placeholder="直接输入触发条件或使用编辑框"
									style="width: 330px"/>
								<el-popover
									placement="bottom"
									width="500"
									trigger="click">
									<span class="edit-btn" slot="reference">
										<el-tooltip content="使用编辑框" placement="right">
											<svg-icon icon-class="edit" />
										</el-tooltip>
									</span>
									<el-input
										type="textarea"
										:rows="2"
										placeholder="请输入触发条件"
										v-model.trim="scope.row.conditionStr">
									</el-input>
									<el-autocomplete
										v-model="condStrTerm"
										:fetch-suggestions="termQuerySearch"
										placeholder="输入选择合理项或函数"
										prefix-icon="el-icon-search"
										style="width: 230px; margin-top: 10px;"
										clearable
										@select="handleSelectCondStr(scope.row)">
									</el-autocomplete>
								</el-popover>
							</template>
							<span v-else>{{ scope.row.conditionStr }}</span>
						</template>
					</el-table-column>
				  <el-table-column label="替换内容">
				    <template slot-scope="scope">
				      <template v-if="scope.row.edit">
								<el-input 
									v-model.trim="scope.row.replaceStr" 
									class="edit-input" size="small"
									placeholder="直接输入替换内容或使用编辑框"
									style="width: 330px" />	
									<el-popover
										placement="bottom"
										width="500"
										trigger="click">
										<span class="edit-btn" slot="reference">
											<el-tooltip content="使用编辑框" placement="right">
												<svg-icon icon-class="edit" />
											</el-tooltip>
										</span>
										<el-input
											type="textarea"
											:rows="2"
											placeholder="请输入替换内容"
											v-model.trim="scope.row.replaceStr">
										</el-input>
										<el-autocomplete
											v-model="repStrTerm"
											:fetch-suggestions="termQuerySearch"
											placeholder="输入选择合理项或函数"
											prefix-icon="el-icon-search"
											style="width: 230px; margin-top: 10px;"
											clearable
											@select="handleSelectRepStr(scope.row)">
										</el-autocomplete>
									</el-popover>
								</template>
				      <span v-else>{{ scope.row.replaceStr }}</span>
				    </template>
				  </el-table-column>
				  <el-table-column align="center" label="操作" with="100">
				    <template slot-scope="scope">
							<div v-if="scope.row.edit">
								<el-button
									v-waves
									type="success" size="mini" 
									icon="el-icon-circle-check-outline" 
									@click="confirmRcEdit(scope.$index, scope.row)"
									:loading="scope.row.condiLoading"
									round>
									提交</el-button>	
								<el-tooltip 
									class="item" effect="dark" 
									content="取消" placement="right">
									<el-button
										v-waves
										type="warning" icon="el-icon-refresh"
										size="mini" 
										@click="cancelRcEdit(scope.$index, scope.row)"
										circle></el-button>
								</el-tooltip>
							</div>
							<div v-else>
								<el-button 
									type="primary" size="mini" 
									icon="el-icon-edit" 
									@click="scope.row.edit=!scope.row.edit"
									round>
									编辑</el-button>
								<el-tooltip 
									class="item" effect="dark" 
									content="删除" placement="right">
									<el-button
										v-waves
										type="danger" icon="el-icon-delete"
										size="mini" 
										@click="deleteRcEdit(scope.$index, scope.row)"
										circle></el-button>
								</el-tooltip>
							</div>
				    </template>
				  </el-table-column>
				</el-table>
				<div class="pagination-container">
					<el-pagination 
						@size-change="handleRcListSizeChange" 
						@current-change="handleRcListCurrentChange" 
						:current-page="rcListQuery.currentPage"
						:page-sizes="[5]" 
						:page-size="rcListQuery.pagesize" 
						layout="total, sizes, prev, pager, next, jumper"
						background
						:total="rcTotal">
					</el-pagination>
				</div>
				<div slot="footer" class="dialog-footer">
					<el-button 
						@click="closeRcList"
						class="guo-btn yellow-btn">
						返 回
					</el-button>
				</div>
			</el-dialog>
		</el-dialog>
	</div>
</template>

<script>
	import { getBodyRepList, 
					 getCleanBody, 
					 saveRepBody, 
					 deleteRepBody,
					 getRepConditionList,
					 getExistedTFs,
					 saveCondition,
					 deleteRepCondition } from '@/api/bnsFormula'
	import waves from '@/directive/waves'
	export default {
		directives: { waves },
		props: {
			replaceFormVisible: {
				type: Boolean
			},
			replaceData: {
				type: Object
			},
			replaceDialogStatus: {
				type: String
			}
		},
		name: 'BodyReplaceDialog',
		data() {
			return {
				showClose: false,
				listLoading: false,
				loading: false,
				rcLoading: false,
				condiLoading: false,
				listQuery: {
					currentPage: 1,
					pagesize: 5,
					formula: null
				},
				total: 0,
				rcListQuery: {
					currentPage: 1,
					pagesize: 5,
					rep: null
				},
				rcTotal: 0,
				search: '',
				repList: [],
				formulaBody: '',
				brForm: {
					id: null,
					formula: null,
					originalStr: ''
				},
				brDialogStatus: '',
				brFormVisible: false,
				rcs: [],
				rc: {
					id: null,
					rep: null,
					conditionStr: '',
					replaceStr: ''
				},
				termSuggestions: [],
				condStrTerm: '',
				repStrTerm: '',
				rcDialogStatus: '',
				rcFormVisible: false,
				rules: {
				   originalStr: [
				     { required: true, message: '请输入或粘贴替换内容', trigger: 'blur' },
						 { max: 500, message: '替换内容长度在500字符以内', trigger: 'blur' }
				   ]
				}
			}
		},
		mounted() {
			const data = this.replaceData
			if (data.id !== null && data.id !== '') {
					this.listQuery.formula = data.id
					this.getList()
					this.getFormulaCleanBody()
					this.getTFSuggestions()
				}else {
					alter('公式获取失败，刷新重试！')
				}
		},
		methods: {
			getList() {
				var self = this
				self.listLoading = true
				const query = self.listQuery
				getBodyRepList(query).then(response => {
					self.repList = response.data.reps
					self.total = response.data.total
					self.listLoading = false
				})
			},
			getFormulaCleanBody() {
				var self = this
				const query = self.listQuery
				getCleanBody(query).then(response => {
					self.formulaBody = response.data
				})
			},
			saveBodyReplace() {
				var self = this
				self.$refs['brForm'].validate((valid) => {
					if (valid) {
						const body = self.formulaBody
						const repBody = self.brForm.originalStr
						if (body.indexOf(repBody) >= 0) {
							self.loading = true
							const data = self.brForm
							saveRepBody(data).then(response => {
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
								}else if (resultStatus === 200){
									self.$notify({
									  title: '成功',
									  message: self.replaceData.name + response.msg,
									  type: 'success',
									  duration: 6000
									})
									self.brForm.originalStr = response.data.originalStr
									self.loading = false
									self.getList()
								}
							})
						}else{
								self.$message({
									message: '替换体必须从公式内容中截取，并应满足公式运算格式！',
									type: 'error',
									duration: 6000
								})
							}
					} else{
						return false;
					}
				})
			},
			handleSizeChange(size) {
				this.listQuery.pagesize = size
				this.getList()
			},
			handleCurrentChange(currentPage) {
				this.listQuery.currentPage = currentPage
				this.getList()
			},
			handleCreate() {
				const data = this.replaceData
				this.brDialogStatus = '创建[' + data.name +']的替换内容'
				this.brFormVisible =  true
				this.brForm = {
					id: null,
					formula: data.id,
					originalStr: ''
				}
			},
			handleEdit(data) {
				this.brDialogStatus = '编辑[' + this.replaceData.name +']的替换内容'
				this.brFormVisible =  true
				this.brForm = data
			},
			closeBrForm() {
				this.$refs['brForm'].clearValidate()
				this.brForm = {}
				this.brDialogStatus = ''
				this.brFormVisible = false
				this.loading = false;
			},
			handleDeleteRep(data) {
				var self = this
				deleteRepBody(data).then(response => {
					let resultStatus = response.status
					if (resultStatus === 520) {
						self.$confirm(response.msg, '提示', {
							type: 'warning',
							center: true
						})
					}else {
						self.$notify({
						  title: '删除成功',
						  type: 'success'
						})
						self.getList()
					}
				})
			},
			openRcs(data) {
				this.rcDialogStatus = '编辑替换[' + data.originalStr + ']的触发条件'
				this.rcFormVisible = true
				this.rcListQuery.rep = data.id
				this.rc.rep = data.id
				this.getRcList()
			},
			getRcList() {
				var self = this
				self.rcLoading = true
				const query = self.rcListQuery
				getRepConditionList(query).then(response => {
					const rcItems = response.data.rcs
					self.rcTotal = response.data.rcTotal
					self.rcs = rcItems.map(v => {
						self.$set(v, 'edit', false)
						self.$set(v, 'condiLoading', false)
						v.originalCondition = v.conditionStr
						v.originalRepStr = v.replaceStr
						return v
					})
					self.rcLoading = false
				})
			},
			getTFSuggestions() {
				var self = this
				const query = self.listQuery
				getExistedTFs(query).then(response => {
					self.termSuggestions = response.data
				})
			},
			handleSelectCondStr(row) {
				row.conditionStr += this.condStrTerm
			},
			handleSelectRepStr(row) {
				row.replaceStr += this.repStrTerm
			},
			addNewRcToRcs() {
				const newRc = {
					id: null,
					rep: this.rc.rep,
					conditionStr: '',
					replaceStr: '',
					edit: true,
					loading: false,
					originalCondition: '',
					originalRepStr: ''
				}
				this.rcs.push(newRc)
			},
			termQuerySearch(queryString, cb) {
				var terms = this.termSuggestions;
			  var results = queryString ? 
					terms.filter(this.createFilter(queryString)) : terms;
			    // 调用 callback 返回建议列表的数据
			  cb(results);
			},
			createFilter(queryString) {
			  return (term) => {
				  return (term.value.indexOf(queryString) === 0);
			  };
			},
			confirmRcEdit(index, data) {
				var self = this;
				let tableIndex = index + 1;
				if (data.conditionStr === "" || data.replaceStr === "") {
					self.checkCondAndRepStr(tableIndex, data);
					return
				}
				data.condiLoading = true;
				const condData = {
					id: data.id,
					rep: data.rep,
					conditionStr: data.conditionStr,
					replaceStr: data.replaceStr
				}
				saveCondition(condData).then(response => {
					let resultStatus = response.status
					if (resultStatus === 520) {
						self.$message({
						  message: '第' + tableIndex + '条:' + response.msg,
						  type: 'error',
						  duration: 6000
						})
						data.condiLoading = false;
					}else if (resultStatus === 200) {
						self.$notify({
						  title: '保存成功',
						  message: '第' + tableIndex + '条:' + response.msg,
						  type: 'success',
						  duration: 6000
						})
						data.edit = false
						data.condiLoading = false
						self.getRcList()
						return data
					}
				})
			},
			checkCondAndRepStr(index, data) {
				if(data.conditionStr === '') {
					this.$message({
					  message: '第' + index + '条触发条件未编辑',
					  type: 'warning'
					})
				}else if (data.replaceStr === '') {
					this.$message({
					  message: '第' + index + '条替换内容未编辑',
					  type: 'warning'
					})
				}
			},
			cancelRcEdit(index, row) {
				if (row.id === null || row.id === '') {
					this.rcs.splice(index, 1)
				}else {
					row.conditionStr = row.originalCondition
					row.replaceStr = row.originalRepStr
					row.edit = false
					row.condiLoading = false
					let indexTip = index + 1
					this.$message({
					  message: '第' + indexTip + '条: 触发条件和替换内容未被修改',
					  type: 'warning'
					})
				}
			},
			deleteRcEdit(index, row) {
				if (row.id === null || row.id === '') {
					this.rcs.splice(index, 1)
				}else {
					deleteRepCondition(row).then(response => {
						let resultStatus = response.status
						if (resultStatus === 520) {
							this.$confirm(response.msg, '提示', {
								type: 'warning',
								center: true
							})
						}else {
							this.$notify({
							  title: '删除成功',
							  type: 'success'
							})
							this.getRcList()
						}
					})
				}
			},
			handleRcListSizeChange(size) {
				this.rcListQuery.pagesize = size
				this.getRcList()
			},
			handleRcListCurrentChange(currentPage) {
				this.rcListQuery.currentPage = currentPage
				this.getRcList()
			},
			closeRcList() {
				this.rcs = []
				this.rc.id = null
				this.rc.rep = null
				this.rc.conditionStr = ''
				this.rc.replaceStr = ''
				this.rcFormVisible = false
				this.rcDialogStatus = ''
				this.condStrTerm = ''
				this.repStrTerm = ''
				this.getList()
			},
			closeDialog() {
				this.$emit('closeReplaceDialog')
				this.$emit('getList')
			},
		}
	}
</script>
<style scoped>
.edit-input {
  padding-right: 100px;
}
.edit-btn {
  position: absolute;
  right: 10px;
  top: 15px;
}
</style>