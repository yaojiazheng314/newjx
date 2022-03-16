<template>
	<div id="editDialog">
		<el-dialog 
			:title="dialogStatus" 
			:show-close="showClose"
			:close-on-click-modal="false"
			:visible.sync="dialogFormVisible">
			<el-form 
				ref="feedBackItemForm"
				:rules="rules"
				:model="feedBackItemForm" 
				label-position="right" 
				label-width="80px" 
				style="height: 275px; width: 200px; margin-left:50px;">
				<el-form-item label="分配项" prop="name">
					<el-input 
						v-model.trim="feedBackItemForm.name" 
						style="width: 200px;">
					</el-input>
				</el-form-item>
				<el-form-item label="状态" prop="status">
					<el-tooltip 
							:content="'当前状态: ' + feedBackItemForm.status" 
							placement="top">
						<el-switch
							v-model="feedBackItemForm.status"
							active-value="启用"
							inactive-value="禁用">
						</el-switch>
					</el-tooltip>
				</el-form-item>
				<el-form-item label="关联类型" prop="termType">
					<el-radio-group 
						v-model="feedBackItemForm.termType"
						@change="changeTermParam"
						style="width: 450px;">
						<el-radio label="因子" value="因子"></el-radio>
						<el-radio label="公式" value="公式"></el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item 
					label="关联数据" 
					prop="term">
					<el-select 
						v-model="feedBackItemForm.term" 
						filterable clearable 
						placeholder="选择关联数据"
						style="width: 200px;">
						<el-option 
							v-for="item in termParams" 
							:key="item.id" 
							:label="item.name" 
							:value="item.id">
							<span style="float: left">{{ item.name }}</span>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="垂直分配" prop="vertical">
					<el-radio-group 
						v-model="feedBackItemForm.vertical"
						size="small"
						style="width: 500px;">
						<el-radio-button label="是" value="是"></el-radio-button>
						<el-radio-button label="否" value="否"></el-radio-button>
					</el-radio-group>
				</el-form-item>
				<el-form-item 
					v-if="feedBackItemForm.vertical === '是'"
					label="责任科室" 
					prop="verticalDept">
					<el-select 
						v-model="feedBackItemForm.verticalDept" 
						filterable clearable
						placeholder="选择或输入科室"
						style="width: 250px;">
						<el-option 
							v-for="item in departmentParams" 
							:key="item.id" 
							:label="item.name + '_' + item.type" 
							:value="item.id">
							<span style="float: left">{{ item.name }}</span>
							<span style="float: right; color: #8492a6; font-size: 13px">
								{{ item.type }}
							</span>
						</el-option>
					</el-select>
				</el-form-item>	
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button 
					@click="closeDialog"
					class="guo-btn yellow-btn">
					返 回
				</el-button>
				<el-button 
					type="primary"
					@click="save"
					:loading="loading"
					class="guo-btn light-blue-btn">
					保 存
					</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { getDataItemParam } from '@/api/bnsDataItem'
import { getCoefParam } from '@/api/bnsCoef'
import { getFormulaParam } from '@/api/bnsFormula'
import { getDepartmentParam	} from '@/api/department'
import { saveFeedBackItem } from '@/api/feedBack'
export default {
	props: {
		dialogFormVisible: {
			type: Boolean
		},
		feedBackData: {
			type: Object
		},
		dialogStatus: {
			type: String
		}
	},
	name: 'EditDialog',
	data() {
		return {
			showClose: false,
			loading: false,
			termParams: [],
			itemParams: [],
			coefParams: [],
			formulaParams: [],
			departmentParams: [],
			feedBackItemForm: {
				id: null,
				name: '',
				status: '启用',
				termType: '公式',
				term: null,
				vertical: '否',
				verticalDept: null
			},
			rules: {
			   name: [
			     { required: true, 
						 message: '输入分配项名称',
						 trigger: 'blur' },
					 { max: 20, 
						 message: '名称长度在20字符以内',
						 trigger: 'blur' }
			   ],
			   status: [
			     { required: true, message: '请选择分配项状态', trigger: 'blur' }
			   ],
			   termType: [
			     { required: true, message: '请选择关联数据类型', trigger: 'blur' }
			   ],
			   term: [
			     { required: true, message: '请选择关联数据', trigger: 'blur' }
			   ],
				 vertical: [
					 { required: true, message: '是否垂直分配', trigger: 'blur' }
				 ],
				 verticalDept: [
				 	 { required: true, message: '选择垂直分配责任科室', trigger: 'blur' }
				 ]
			}
		}		
	},
	mounted() {
		this.getItemParams()
		this.getFormulaParams()
		this.getDepartmentParams()
		const data = this.feedBackData
		if (data.id !== null) {
				this.feedBackItemForm = Object.assign({}, data)
			}
		this.changeTermParam()
	},
	methods: {
		getItemParams() {
			var self = this
			getDataItemParam().then(response => {
				let data = response.data
				const length = data.length
				for (let i = 0; i < length; i++) {
					const type = data[i].type
					if (type === '科室') {
						self.itemParams.push(data[i])
					}
				}
			})
		},
		getFormulaParams() {
			var self = this
			getFormulaParam().then(res => {
				let data = res.data
				data.map(v => {
					if (v.type === '科室') {
						self.formulaParams.push(v)
					}
				})
			})
		},
		getDepartmentParams() {
			var self = this
			getDepartmentParam().then(res => {
				self.departmentParams = res.data
			})
		},
		changeTermParam() {
			var self = this
			let termType = self.feedBackItemForm.termType
			if (termType === '因子') {
				self.termParams = self.itemParams
			}else if (termType === '公式') {
				self.termParams = self.formulaParams
			}
		},
		save() {
			var self = this
			self.$refs['feedBackItemForm'].validate((valid) => {
		    if (valid) {
					self.loading = true
					let dataParam = self.feedBackItemForm
					const feedBackItem = {
						id: dataParam.id,
						name: dataParam.name,
						status: dataParam.status,
						termType: dataParam.termType === '公式' ? 'formula' : 'item',
						term: dataParam.term,
						vertical: dataParam.vertical === '是' ? 1 : 0,
						verticalDept: dataParam.vertical === '是' ? dataParam.verticalDept : 0
					}
		      saveFeedBackItem(feedBackItem).then(response => {
						const resCode = response.status
						if (resCode === 520) {
							self.$message({
							  message: response.msg,
							  type: 'error',
							  duration: 6000
							})
							self.loading = false
						}else if (resCode === 200) {
							self.$notify({
							  title: '成功',
							  message: response.msg,
							  type: 'success',
							  duration: 6000
							})
							self.loading = false
							if (self.feedBackItemForm.id === null || 
							self.feedBackItemForm.id === '') {
								//连续创建
								self.resetForm();
								self.$refs['feedBackItemForm'].clearValidate();
							}
							self.$emit('getList')
						}
					})
		    } else {
		      return false;
		    }
		  });
		},
		resetForm() {	
			this.feedBackItemForm.id = null
			this.feedBackItemForm.username = ''
			this.feedBackItemForm.password = '123456'
			this.feedBackItemForm.person = null
			this.feedBackItemForm.roles = []
		},
		closeDialog() {
			this.$refs['feedBackItemForm'].clearValidate()
			this.resetForm()
			this.$emit('getFeedBackParams')
			this.$emit('getList')
			this.$emit('closedialog')
		}
	},
}
</script>

<style>
</style>
