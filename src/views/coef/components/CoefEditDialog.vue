<template>
	<div id="coefEditDialog">
		<el-dialog 
			:title="dialogStatus" 
			:show-close="showClose"
			:close-on-click-modal="false"
			:visible.sync="dialogFormVisible">
			<el-form 
				ref="coefForm"
				:rules="rules"
				:model="coefForm" 
				:inline="true"
				label-position="right" 
				label-width="80px">
				<el-form-item label="名称" prop="name">
					<el-input 
						v-model.trim="coefForm.name" 
						style="width: 250px;">
					</el-input>
				</el-form-item>
				<el-form-item label="默认值" prop="defaultValue">
					<el-input-number
					  v-model.number="coefForm.defaultValue"
						:precision="2"
					  style="width: 200px;">
					</el-input-number>
				</el-form-item>
				<el-tooltip 
						:content="'当前状态: ' + coefForm.status" 
						placement="top">
					<el-form-item label="状态" prop="status">
						<el-switch
							v-model="coefForm.status"
							active-value="启用"
							inactive-value="禁用">
						</el-switch>
					</el-form-item>
				</el-tooltip>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeDialog">返 回</el-button>
				<el-button 
					type="primary"
					:loading="loading"
					@click="saveCoefInfo">
					保 存
				</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { saveCoef } from '@/api/bnsCoef'
export default {
	props: {
		dialogFormVisible: {
			type: Boolean
		},
		coefData: {
			type: Object
		},
		dialogStatus: {
			type: String
		},
		departmentParams: {
			type: Array
		}
	},
	name: 'CoefEditDialog',
	data() {
		return {
			showClose: false,
			loading: false,
			coefForm: {
				id: null,
				name: '',
				defaultValue: 0.0,
				status: '启用'
			},
			rules: {
			   name: [
			     { required: true, message: '请输入名称', trigger: 'blur' },
					 { max: 20, message: '名称长度在20字符以内', trigger: 'blur' },
					 { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不要输入符号' }
			   ],
			   defaultValue: [
			     { required: true, message: '请正确输入默认值', trigger: 'blur' }
			   ]
			}
		}		
	},
	mounted() {
		const data = this.coefData
		if (data.id !== null && data.id !== '') {
				this.coefForm = Object.assign({}, data)
			}
	},
	methods: {
		saveCoefInfo() {
			var self = this
			self.$refs['coefForm'].validate((valid) => {
		    if (valid) {
					self.loading = true
					const data = self.coefForm
		      saveCoef(data).then(response => {
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
								self.$refs['coefForm'].clearValidate();
							}
							self.loading = false
							self.$emit('getList')
							self.$emit('getCoefParams')
						}
					})
		    } else {
		      return false;
		    }
		  });
		},
		resetForm() {	
			this.coefForm.id = null
			this.coefForm.name = ''
			this.coefForm.defaultValue = 0.0
			this.coefForm.status = '启用'
		},
		closeDialog() {
			this.$refs['coefForm'].clearValidate()
			this.resetForm()
			this.$emit('closedialog')
		}
	},
}
</script>

<style>
</style>
