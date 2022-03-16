<template>
	<div id="EditDialog">
		<el-dialog 
			:title="dialogStatus" 
			:show-close="showClose"
			:close-on-click-modal="false"
			:visible.sync="dialogFormVisible">
			<el-form 
				ref="personForm"
				:rules="rules"
				:model="personForm" 
				:inline="true"
				label-position="right" 
				label-width="80px" 
				style="height: 150px; width: 200px; margin-left:50px;">
			
				<el-form-item label="明细名称" prop="feedBackTypeName">
					<el-input type="text" 
						v-model.trim="personForm.feedBackTypeName" 
						style="width: 300px;"
						:disabled="type">
					</el-input>
				</el-form-item>

				<el-form-item label="在用停用" prop="status">
					
				<el-radio-group 
						v-model="personForm.status"
						size="small"
						style="width: 200px;">
						 <el-radio :label=1>在用</el-radio>
						 <el-radio :label=0>停用</el-radio>
						<!-- <el-radio-button label="停用" value=0></el-radio-button> -->
					</el-radio-group>
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeDialog">返 回</el-button>
				<el-button 
					type="primary"
					@click="saveDateInfo" v-if="!type">
					确 定
					</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { saveFeedBackType } from '@/api/feedBack'
export default {
	props: {
		dialogFormVisible: {
			type: Boolean
		},
		personData: {
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
			costTypeParams: [],
			personForm: {
					id: null,
					feedBackTypeName:null,
					status: 1,
			},
			rules: {
			   feedBackTypeName: [
			     { required: true, message: '请输入二次分配明细项名称', trigger: 'blur' }
					
			   ],
			   status: [
			     { required: true, message: '请选择在用停用状态', trigger: 'blur' }
			   ]
			},
			type:false,		//查看
			typeYM:false		//查看
		}		
	},
	mounted() {
		if(this.dialogStatus == '查看调整成本信息'){
			this.type = true //查看
			this.typeYM = true
		}
		if(this.dialogStatus == '编辑'){
			this.typeYM = true //编辑
		}
		// this.getCostTypeParams()
		// console.log(this.personData);
		const data = this.personData
		if (data.id !== null && data.id !== '') {
				this.personForm = Object.assign({}, data)
			}
	},
	methods: {

		saveDateInfo() {
			var self = this
			self.$refs['personForm'].validate((valid) => {
		    if (valid) {				
		      saveFeedBackType(self.personForm).then(response => {
						self.$notify({
						  title: '成功',
						  message: response.msg,
						  type: 'success',
						  duration: 6000
						})
						if (self.personForm.id === null || 
						self.personForm.id === '') {
							//连续创建
							self.resetForm();
							// self.$refs['personForm'].clearValidate();
						}else{
							self.closeDialog();
						}
						self.$emit('getList')

					})
		    } else {
		      return false;
		    }
		  });
		},
		resetForm() {	
					this.personForm.id= null,
					this.personForm.feedBackTypeName = null,
					this.personForm.status=1
		},
		closeDialog() {
			// this.$refs['personForm'].clearValidate()
			this.resetForm()
			this.$emit('closedialog')
		}
	},
}
</script>

<style>
</style>
