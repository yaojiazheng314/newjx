<template>
	<div id="formulaEditDialog">
		<el-dialog 
			:title="dialogStatus" 
			:show-close="showClose"
			:close-on-click-modal="false"
			:visible.sync="dialogFormVisible">
			<el-form 
				ref="formulaForm"
				:rules="rules"
				:model="formulaForm" 
				:inline="true"
				label-position="right" 
				label-width="80px" 
				style="height: 355px; width: 600px; margin-left:50px;">
				<el-form-item label="名称" prop="name">
					<el-input 
						v-model.trim="formulaForm.name" 
						style="width: 230px;">
					</el-input>
				</el-form-item>
				<el-tooltip 
						:content="'当前状态: ' + formulaForm.status" 
						placement="top">
					<el-form-item label="状态" prop="status">
						<el-switch
							v-model="formulaForm.status"
							active-value="启用"
							inactive-value="禁用">
						</el-switch>
					</el-form-item>
				</el-tooltip>
				<el-form-item label="适用分类" prop="type">
					<el-radio-group 
						v-model="formulaForm.type"
						size="small"
						style="width: 150px;">
						<el-radio-button label="科室" value="科室"></el-radio-button>
						<el-radio-button label="人员" value="人员"></el-radio-button>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="公式类型" prop="category">
					<el-radio-group v-model="formulaForm.category" style="width: 350px;">
						<el-radio label="辅助" value="辅助"></el-radio>
						<el-radio label="结果" value="结果"></el-radio>
						<el-radio label="分配" value="分配"></el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="院属" prop="hosp">
					<el-select 
						v-model="formulaForm.hosp" 
						filterable clearable 
						placeholder="选择院属"
						style="width: 200px;">
						<el-option 
							v-for="item in hospitalParams" 
							:key="item.id" 
							:label="item.name" 
							:value="item.id">
							<span style="float: left">{{ item.name }}</span>
						</el-option>
					</el-select>
				</el-form-item>	
				<el-form-item label="执行科室" prop="execDepartment">
					<el-select 
						v-model="formulaForm.execDepartment" 
						filterable clearable 
						placeholder="选择或输入科室"
						style="width: 230px;">
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
				<el-form-item 
					label="核算对象" 
					prop="bnsObject">
					<el-autocomplete
						v-model="formulaForm.bnsObject"
						:fetch-suggestions="boQuerySearch"
						placeholder="自定义核算对象内容"
						style="width: 180px;">
					</el-autocomplete>
				</el-form-item>
				<el-form-item label="核算精度" prop="prec">
					<el-select 
						v-model="formulaForm.prec" 
						filterable clearable 
						placeholder="选择核算精度"
						style="width: 140px;">
						<el-option 
							v-for="item in precParams" 
							:key="item" 
							:label="item" 
							:value="item">
							<span style="float: left">{{ item }}</span>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="小数位数" prop="decd">
					<el-input-number 
						v-model.number="formulaForm.decd" 
						controls-position="right" 
						:min="0" :max="2" 
						:precision="0"
						:step="1" 
						style="width: 120px;">
					</el-input-number>
				</el-form-item>
				<el-form-item label="负值处理" prop="neg">
					<el-radio-group v-model="formulaForm.neg" style="width: 200px;">
						<el-radio label="原值" value="原值"></el-radio>
						<el-radio label="转零" value="转零"></el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeDialog">返 回</el-button>
				<el-button 
					type="primary"
					:loading="loading"
					@click="saveFormulaInfo">
					保 存
				</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { saveFormulaBaseInfo, getBOSuggestion } from '@/api/bnsFormula'
import { getHospitalInfo } from '@/api/hospital'
export default {
	props: {
		dialogFormVisible: {
			type: Boolean
		},
		formulaData: {
			type: Object
		},
		dialogStatus: {
			type: String
		},
		departmentParams: {
			type: Array
		}
	},
	name: 'FormulaEditDialog',
	data() {
		return {
			showClose: false,
			loading: false,
			precParams: ['四舍五入', '向上取整', '向下取整'],
			hospitalParams: [],
			boSuggestions: [],
			formulaForm: {
				id: null,
				name: '',
				type: '科室',
				category: '结果',
				bnsObject: '',
				hosp: null,
				execDepartment: null,
				status: '启用',
				prec: '四舍五入',
				decd: 0,
				neg: '原值'
			},
			rules: {
			   name: [
			     { required: true, message: '请输入公式名称', trigger: 'blur' },
					 { max: 20, message: '名称长度在20字符以内', trigger: 'blur' },
					 { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不要输入符号' }
			   ],
				 type: [
				   { required: true, message: '请选择适用分类', trigger: 'blur' }
				 ],
				 category: [
				   { required: true, message: '请选择公式类型', trigger: 'blur' }
				 ],
				 hosp: [
					 { required: true, message: '请选择院属', trigger: 'blur' }
				 ],
			   execDepartment: [
			     { required: true, message: '请选择填报科室', trigger: 'blur' }
			   ],
				 bnsObject: [
					 { max: 20, message: '内容长度在20字符以内', trigger: 'blur' }
				 ],
				 prec: [
					 { required: true, message: '选择核算精度', trigger: 'blur' }
				 ]
			}
		}		
	},
	mounted() {
		const data = this.formulaData
		if (data.id !== null && data.id !== '') {
				this.formulaForm = Object.assign({}, data)
			}
		this.getHospitalParams()
		this.getGetBOSuggestions()
	},
	methods: {
		saveFormulaInfo() {
			var self = this
			self.$refs['formulaForm'].validate((valid) => {
		    if (valid) {
					self.loading = true
					const data = self.formulaForm
		      saveFormulaBaseInfo(data).then(response => {
						let resultStatus = response.status
						if (resultStatus === 520) {
							self.loading = false
							self.$confirm(response.msg, '提示', {
								type: 'warning',
								center: true
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
						}else {
							self.$notify({
							  title: '成功',
							  message: response.msg,
							  type: 'success',
							  duration: 6000
							})
							if (data.id === '' || 
							data.id === null) {
								//连续创建
								self.resetForm();
								self.$refs['formulaForm'].clearValidate();
							}
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
		getHospitalParams() {
			getHospitalInfo().then(response => {
				this.hospitalParams = response.data
			})
		},
		getGetBOSuggestions() {
			getBOSuggestion().then(response => {
				this.boSuggestions = response.data
			})
		},
		boQuerySearch(queryString, cb) {
			var suggestions = this.boSuggestions;
      var results = queryString ? 
				suggestions.filter(this.createFilter(queryString)) : suggestions;
        // 调用 callback 返回建议列表的数据
      cb(results);
		},
		createFilter(queryString) {
        return (suggestion) => {
					return (suggestion.value.indexOf(queryString) === 0);
      };
    },
		resetForm() {	
			this.formulaForm.id = null
			this.formulaForm.name = ''
			this.formulaForm.type = '科室'
			this.formulaForm.category = '结果'
			this.formulaForm.bnsObject = ''
			this.formulaForm.hosp = null
			this.formulaForm.execDepartment = null
			this.formulaForm.status = '启用'
			this.formulaForm.prec = '四舍五入'
			this.formulaForm.decd = 0
			this.formulaForm.neg = '原值'
		},
		closeDialog() {
			this.$refs['formulaForm'].clearValidate()
			this.resetForm()
			this.$emit('closedialog')
		}
	}
}
</script>

<style>
</style>
