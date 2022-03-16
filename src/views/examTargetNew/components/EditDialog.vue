<template>
	<div id="editDialog">
		<el-dialog 
			:title="dialogStatus" 
			:show-close="showClose"
			:close-on-click-modal="false"
			:visible.sync="dialogFormVisible">
			<el-form 
				ref="examTargetForm"
				:rules="rules"
				:model="examTargetForm" 
				label-position="right" 
				label-width="80px" 
				style="height: 200px; width: 200px; margin-left:50px;">
				<el-form-item label="上级指标" prop="parent">
					<el-select 
						v-model="examTargetForm.parent" 
						filterable clearable
						placeholder="请选择上级指标"
						style="width: 350px;">
						<el-option
							v-for="item in examTargetParams"
							:key="item.id"
							:label="item.indicator"
							:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="指标内容" prop="indicator">
					<el-input 
						type="textarea"
						:rows="3"
						placeholder="输入考核指标(不超过100字)"
						v-model.trim="examTargetForm.indicator" 
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
import { saveExamTarget,
				 getExamTargetParam } from '@/api/exam'
export default {
	props: {
		//dialog是否可见
		dialogFormVisible: {
			type: Boolean
		},
		//父组件传递对象：examTarget： id, indicator, parent
		examTargetData: {
			type: Object
		},
		//dialog标题
		dialogStatus: {
			type: String
		}
	},
	name: 'EditDialog',
	data() {
		return {
			showClose: false,
			loading: false,
			//考核指标实体对象
			examTargetForm: {
				id: null,
				indicator: '', //指标内容
				parent: null, //上级指标
				operator: null //操作者 userID
			},
			//上级指标参数列表
			examTargetParams: [],
			rules: {
			  indicator: [
			    { required: true, 
			   	  message: '输入考核指标',
			   		trigger: 'blur' },
			   	{ max: 100, 
			   		message: '考核指标内容长度在100字符以内',
			   		trigger: 'blur' }
			  ]
			}
		}		
	},
	mounted() {
		this.getOperatorInfo() //获取操作用户
		this.getExamTargetParams() //获取用于选择上级指标的参数列表
		const data = this.examTargetData
		if (data.id !== null) {
				data.parent === 0 ? data.parent = null : data.parent = data.parent
				this.examTargetForm = Object.assign({}, data)
			}
	},
	methods: {
		//获取操作用户
		getOperatorInfo() {
			var self = this
			self.examTargetForm.operator = self.$store.getters.userID
		},
		//获取指标参数列表
		getExamTargetParams() {
			var self = this
			const query = self.examTargetForm
			getExamTargetParam(query).then(res => {
				self.examTargetParams = res.data
			})
		},
		save() {
			var self = this
			self.$refs['examTargetForm'].validate((valid) => {
		    if (valid) {
					self.loading = true
					const examTarget = self.examTargetForm
		      saveExamTarget(examTarget).then(response => {
						const resCode = response.status
						if (resCode === 520) {
							self.loading = false
							self.$message({
								type: 'danger',
								message: response.msg
							})
						}else {
							self.$notify({
							  title: '成功',
							  message: response.msg,
							  type: 'success',
							  duration: 6000
							})
							self.loading = false
							if (self.examTargetForm.id === null || 
							self.examTargetForm.id === '') {
								//连续创建
								self.resetForm();
								self.$refs['examTargetForm'].clearValidate();
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
			this.examTargetForm.id = null
			this.examTargetForm.indicator = ''
			this.examTargetForm.parent = null
			this.examTargetForm.operator = null
		},
		closeDialog() {
			this.$refs['examTargetForm'].clearValidate()
			this.resetForm()
			this.$emit('getList')
			this.$emit('closedialog')
		}
	},
}
</script>

<style>
</style>
