<template>
	<div id="userEditDialog">
		<el-dialog 
			:title="dialogStatus" 
			:show-close="showClose"
			:close-on-click-modal="false"
			:visible.sync="dialogFormVisible">
			<el-form 
				ref="userForm"
				:rules="rules"
				:model="userForm" 
				label-position="right" 
				label-width="80px" 
				style="height: 225px; width: 300px; margin-left:50px;">
				<el-form-item label="用户名" prop="username">
					<el-input 
						v-model.trim="userForm.username" 
						style="width: 200px;">
					</el-input>
				</el-form-item>
				<el-form-item v-if="passwordStatus" label="密码" prop="password">
					<el-input 
					 v-model.trim="userForm.password" 
					 style="width: 200px;">
					</el-input>
				</el-form-item>
				<el-form-item label="别名" prop="name">
					<el-input 
					 v-model.trim="userForm.name" 
					 style="width: 200px;">
					</el-input>
				</el-form-item>
				<el-form-item label="系统人员" prop="person">
					<el-select 
						v-model="userForm.person" 
						filterable clearable 
						placeholder="系统对应人员"
						style="width: 250px;"
						@change="setUserInfoByPerson">
						<el-option 
							v-for="item in personParams" 
							:key="item.id" 
							:label="item.name + '_' + item.departmentName" 
							:value="item.id">
							<span style="float: left">{{ item.name }}</span>
							<span style="float: right; color: #8492a6; font-size: 13px">
								{{ item.departmentName }}
							</span>
						</el-option>
					</el-select>
				</el-form-item>	
				<el-form-item label="角色权限" prop="roles">
					<el-select 
						v-model="userForm.roles" 
						filterable clearable multiple
						placeholder="用户角色"
						style="width: 250px;">
						<el-option 
							v-for="item in roleParams" 
							:key="item.roleId" 
							:label="item.name" 
							:value="item.roleId">
							<span style="float: left">{{ item.name }}</span>
						</el-option>
					</el-select>
				</el-form-item>	
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeDialog">返 回</el-button>
				<el-button 
					type="primary"
					@click="saveUserInfo">
					确 定
					</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { getPersonParam } from '@/api/person'
import { getRoleList } from '@/api/role'
import { saveUser } from '@/api/user'
export default {
	props: {
		dialogFormVisible: {
			type: Boolean
		},
		userData: {
			type: Object
		},
		dialogStatus: {
			type: String
		}
	},
	name: 'UserEditDialog',
	data() {
		return {
			showClose: false,
			roleParams: [],
			personParams: [],
			passwordStatus: true,
			userForm: {
				id: null,
				username: '',
				password: '',
				name: '', //用户别名
				person: null,
				roles: []
			},
			rules: {
			   username: [
			     { required: true, 
						 message: '请输入用户名或选择系统人员',
						 trigger: 'blur' },
					 { max: 20, 
						 message: '名称长度在20字符以内',
						 trigger: 'blur' }
			   ],
			   password: [
			     { required: true, message: '请输入用户密码', trigger: 'blur' }
			   ],
			   person: [
			     { required: true, message: '请选择系统对应人员', trigger: 'blur' }
			   ],
			   roles: [
			     { required: true, message: '请选择用户角色', trigger: 'blur' }
			   ]
			}
		}		
	},
	mounted() {
		this.getPersonParams()
		this.getRoleParams()
		const data = this.userData
		if (data.id !== null && data.id !== '') {
				this.userForm = Object.assign({}, data)
				this.passwordStatus = false
			}
	},
	methods: {
		getPersonParams() {
			var self = this
			getPersonParam().then(response => {
				self.personParams = response.data
			})
		},
		getRoleParams() {
			getRoleList().then(res => {
				this.roleParams = res.data
			})
		},
		saveUserInfo() {
			var self = this
			self.$refs['userForm'].validate((valid) => {
		    if (valid) {
		      saveUser(self.userForm).then(response => {
						self.$notify({
						  title: '成功',
						  message: response.msg,
						  type: 'success',
						  duration: 6000
						})
						if (self.userForm.id === null || 
						self.userForm.id === '') {
							//连续创建
							self.resetForm();
							self.$refs['userForm'].clearValidate();
						}
						self.$emit('getList')
						self.$emit('getUserParams')
					})
		    } else {
		      return false;
		    }
		  });
		},
		setUserInfoByPerson(perID) {
			if (perID !== null || perID !== '') {
				let person = {}
				person = this.personParams.find(p => {
					return p.id === perID
				})
				if (this.userForm.username === '') {
					this.userForm.username = person.code
				}
				if (this.userForm.name === '') {
					this.userForm.name = person.name
				}
			}
		},
		resetForm() {	
			this.userForm.id = null
			this.userForm.username = ''
			this.userForm.password = '123456'
			this.userForm.person = null
			this.userForm.roles = []
		},
		closeDialog() {
			this.$refs['userForm'].clearValidate()
			this.resetForm()
			this.$emit('closedialog')
		}
	},
}
</script>

<style>
</style>
