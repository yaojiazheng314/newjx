<template>
	<div id="editDialog">
		<el-dialog 
			:title="dialogStatus" 
			:show-close="showClose"
			:close-on-click-modal="false"
			:visible.sync="dialogFormVisible">
			<el-form 
				ref="examBasisForm"
				:rules="rules"
				:model="examBasisForm" 
				label-position="right" 
				label-width="80px" 
				style="height: 200px; width: 200px; margin-left:50px;">
				<el-form-item label="别名" prop="name">
					<el-input 
						v-model.trim="examBasisForm.name" 
						placeholder="输入考核依据别名"
						style="width: 200px;">
					</el-input>
				</el-form-item>
				<el-form-item label="依据" prop="basis">
					<el-input 
						type="textarea"
						:rows="8"
						placeholder="输入考核依据内容(不超过500字)"
						v-model.trim="examBasisForm.basis" 
						style="width: 500px;">
					</el-input>
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
import { saveAimBasis } from '@/api/aimLib'
export default {
	props: {
		dialogFormVisible: {
			type: Boolean
		},
		examBasisData: {
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
			examBasisForm: {
				id: null,
				name: '',
				basis: '',
				operator: ''
			},
			rules: {
			  name: [
			    { required: true, 
					  message: '输入考核依据别名',
					  trigger: 'blur' },
					{ max: 20, 
					  message: '名称长度在20字符以内',
						trigger: 'blur' }
			   ],
			  basis: [
			    { required: true, 
			   	  message: '编辑考核依据',
			   		trigger: 'blur' },
			   	{ max: 500, 
			   		message: '考核依据内容长度在500字符以内',
			   		trigger: 'blur' }
			  ]
			}
		}		
	},
	mounted() {
		this.getOperatorInfo() //获取编辑用户
		const data = this.examBasisData
		if (data.id !== null) {
				this.examBasisForm = Object.assign({}, data)
			}
	},
	methods: {
		getOperatorInfo() {
			var self = this
			self.examBasisForm.operator = self.$store.getters.userID
		},
		save() {
			var self = this
			self.$refs['examBasisForm'].validate((valid) => {
		    if (valid) {
					self.loading = true
					const examBasis = self.examBasisForm
		      saveExamBasis(examBasis).then(response => {
						const resCode = response.status
						self.$notify({
						  title: '成功',
						  message: response.msg,
						  type: 'success',
						  duration: 6000
						})
						self.loading = false
						if (self.examBasisForm.id === null || 
						self.examBasisForm.id === '') {
							//连续创建
							self.resetForm();
							self.$refs['examBasisForm'].clearValidate();
						}
						self.$emit('getList')
					})
		    } else {
		      return false;
		    }
		  });
		},
		resetForm() {	
			this.examBasisForm.id = null
			this.examBasisForm.name = ''
			this.examBasisForm.basis = ''
			this.examBasisForm.operator = null
		},
		closeDialog() {
			this.$refs['examBasisForm'].clearValidate()
			this.resetForm()
			this.$emit('getList')
			this.$emit('closedialog')
		}
	},
}
</script>

<style>
</style>
