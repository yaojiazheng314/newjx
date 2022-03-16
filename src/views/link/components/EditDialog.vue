<template>
	<div id="editDialog">
		<el-dialog 
			:title="dialogStatus" 
			:show-close="showClose"
			:close-on-click-modal="false"
			:visible.sync="dialogFormVisible">
			<el-form 
				ref="linkForm"
				:rules="rules"
				:model="linkForm" 
				label-position="right" 
				label-width="80px" 
				style="width: 200px; margin-left:50px;">
				<el-form-item label="链接名称" prop="name">
					<el-input 
						placeholder="输入链接名称"
						v-model.trim="linkForm.name" 
						style="width: 200px;"></el-input>
				</el-form-item>
				<el-form-item label="链接地址" prop="linkUrl">
					<el-input 
						placeholder="请输入链接地址" 
						v-model="linkForm.linkUrl"
						style="width: 500px;">
						<template slot="prepend">Http://</template>
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
import { saveExterLink } from '@/api/externalLink'
export default {
	props: {
		//dialog是否可见
		dialogFormVisible: {
			type: Boolean
		},
		//父组件传递对象：linkData： id, name, linkUrl
		linkData: {
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
			//链接实体对象
			linkForm: {
				id: null,
				name: '', //链接名称
				linkUrl: '' //链接地址
			},
			rules: {
			  name: [
			    { required: true, 
			   	  message: '输入链接别名',
			   		trigger: 'blur' },
			   	{ max: 20, 
			   		message: '长度在20字符以内',
			   		trigger: 'blur' }
			  ],
				linkUrl: [
				  { required: true, 
				 	  message: '输入链接地址',
				 		trigger: 'blur' },
					{ max: 200, 
						message: '长度在200字符以内',
						trigger: 'blur' }
				]
			}
		}		
	},
	mounted() {
		const data = this.linkData
		if (data.id !== null) {
				this.linkForm = Object.assign({}, data)
			}
	},
	methods: {
		save() {
			var self = this
			self.$refs['linkForm'].validate((valid) => {
		    if (valid) {
					self.loading = true
					var exterLinkManage = self.linkForm
		      saveExterLink(exterLinkManage).then(response => {
						const resCode = response.status
						if (resCode === 520) {
							self.loading = false
							self.$message({
								type: 'warning',
								message: response.msg,
								duration: 4000
							})
						}else {
							self.$notify({
							  title: '成功',
							  message: response.msg,
							  type: 'success',
							  duration: 6000
							})
							self.loading = false
							if (self.linkForm.id === null) {
								//连续创建
								self.resetForm();
								self.$refs['linkForm'].clearValidate();
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
			this.linkForm.id = null
			this.linkForm.name = ''
			this.linkForm.linkUrl = ''
		},
		closeDialog() {
			this.$refs['linkForm'].clearValidate()
			this.resetForm()
			this.$emit('getList')
			this.$emit('getLinkParams')
			this.$emit('closedialog')
		}
	},
}
</script>

<style>
</style>
