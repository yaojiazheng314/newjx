<template>
	<div id="personEditDialog">
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
				style="height: 350px; width: 600px; margin-left:50px;">
				<el-form-item label="姓名" prop="name">
					<el-input 
						v-model.trim="personForm.name" 
						style="width: 150px;"
						:disabled="type"
						>
					</el-input>
				</el-form-item>
				<el-form-item label="编码" prop="code">
					<el-input 
					 v-model.trim="personForm.code" 
					 style="width: 200px;"
					 :disabled="type">
					</el-input>
				</el-form-item>
				<el-form-item label="职位" prop="position">
					<el-select 
						v-model="personForm.position" 
						filterable clearable 
						placeholder="人员职位"
						style="width: 150px;"
						:disabled="type">
						<el-option 
							v-for="item in positionParams" 
							:key="item.id" 
							:label="item.name" 
							:value="item.id">
							<span style="float: left">{{ item.name }}</span>
						</el-option>
					</el-select>
				</el-form-item>	
				<el-form-item label="职称" prop="professTitle">
					<el-select 
						v-model="personForm.professTitle" 
						filterable clearable 
						placeholder="职称"
						style="width: 200px;"
						:disabled="type">
						<el-option 
							v-for="item in professTitleParams" 
							:key="item.id" 
							:label="item.name" 
							:value="item.id">
							<span style="float: left">{{ item.name }}</span>
						</el-option>
					</el-select>
				</el-form-item>	
				<el-form-item label="科室" prop="department">
					<el-select 
						v-model="personForm.department" 
						filterable clearable 
						placeholder="选择或输入科室"
						style="width: 150px;"
						>
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
				<el-form-item label="统计科室" prop="departmentRs">
					<el-select 
						v-model="personForm.departmentRs" 
						filterable clearable 
						placeholder="选择或输入人均统计科室"
						style="width: 200px;"
						>
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
				<!-- <el-form-item label="入职日期" prop="startTime">
					<el-date-picker
				v-model="personForm.startTime"
				type="date"
				placeholder="选择入职年月日"
				format="yyyy 年 M 月 d日"
				value-format="yyyy-MM-dd"
				:clearable="false"
				:editable="false"
			
				class="searchClass" :disabled="specletype">
				</el-date-picker>
				</el-form-item> -->
				<el-form-item label="状态" prop="status">
					<el-radio-group v-model="personForm.status" style="width: 450px;">
						<el-radio-button label="在职" value="在职"></el-radio-button>
						<el-radio-button label="编外" value="编外"></el-radio-button>
						<el-radio-button label="离职" value="离职"></el-radio-button>
						<el-radio-button label="长期病休" value="长期病休"></el-radio-button>
						<el-radio-button label="返聘" value="返聘"></el-radio-button>
						<el-radio-button label="其他" value="其他"></el-radio-button>						
					</el-radio-group>
				</el-form-item>
				<el-form-item label="性别" prop="sex">
					<el-radio-group v-model="personForm.sex" style="width: 200px;" :disabled="type">
						<el-radio label="男" value="男"></el-radio>
						<el-radio label="女" value="女"></el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="身份证" prop="idCard">
					<el-input 
						v-model.trim="personForm.idCard" 
						style="width: 200px;"
						:disabled="type">
					</el-input>
				</el-form-item>
				<el-form-item label="联系方式" prop="phone">
					<el-input 
						v-model.trim="personForm.phone" 
						style="width: 200px;"
						:disabled="type">
					</el-input>
				</el-form-item>
				<el-form-item label="银行卡号" prop="email">
					<el-input 
						v-model.trim="personForm.email" 
						style="width: 200px;"
						:disabled="type">
					</el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeDialog">返 回</el-button>
				<el-button 
					type="primary"
					@click="savePersonInfo" v-if="!type">
					确 定
					</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { getProfessTitleList } from '@/api/professTitle'
import { savePerson } from '@/api/person'
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
		},
		departmentParams: {
			type: Array
		},
		positionParams: {
			type: Array
		}
	},
	name: 'PersonEditDialog',
	data() {
		return {
			showClose: false,
			personStatus: ['在职', '编外', '离职','返聘'],
			professTitleParams: [],
			personForm: {
				id: null,
				code: '',
				name: '',
				sex: '男',
				status: '在职',
				email: '',
				phone: '',
				idCard: '',
				position: null,
				professTitle: null,
				department: null,
				departmentRs:null
			},
			rules: {
			   name: [
			     { required: true, message: '请输入人员姓名', trigger: 'blur' },
					 { max: 20, message: '名称长度在20字符以内', trigger: 'blur' }
			   ],
			   code: [
			     { required: true, message: '请输入人员编码', trigger: 'blur' }
			   ],
			   position: [
			     { required: true, message: '请选择职位', trigger: 'blur' }
			   ],
			   professTitle: [
			     { required: true, message: '请选择职称', trigger: 'blur' }
			   ],
			   department: [
			     { required: true, message: '请选择科室', trigger: 'blur' }
			   ],
			   startTime:[
				   { required: true, message: '请选择入职有效日期', trigger: 'blur' }
			   ],
			   status: [
			     { required: true, message: '请选择人员状态', trigger: 'blur' }
			   ],
			   sex: [
			     { required: true, message: '请选择人员性别', trigger: 'blur' }
			   ],
			   idCard: [
			     { required: true, message: '请输入身份证号', trigger: 'blur' }
			   ]
			},
			type:false,		//查看
			specletype:false		//查看
		}		
	},
	mounted() {
		if(this.dialogStatus == '查看人员信息'){
			this.type = true //查看
			this.specletype = true
		}
		if(this.dialogStatus == '编辑人员信息'){
			this.specletype= true
		}
		
		this.getProfessTitleParams()
		const data = this.personData
		if (data.id !== null && data.id !== '') {
				this.personForm = Object.assign({}, data)
			}
	},
	methods: {
		getProfessTitleParams() {
			var self = this
			getProfessTitleList().then(response => {
			  self.professTitleParams = response.data
			})
		},
		savePersonInfo() {
			var self = this
			self.$refs['personForm'].validate((valid) => {
		    if (valid) {
		      savePerson(self.personForm).then(response => {
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
							self.$refs['personForm'].clearValidate();
						}
						self.$emit('getList')
						self.$emit('getPersonParams')
						self.$emit('getPositionParams')
					})
		    } else {
		      return false;
		    }
		  });
		},
		resetForm() {	
			this.personForm.id = null;
			this.personForm.name = '';
			this.personForm.code = '';
			this.personForm.position = null;
			this.personForm.professTitle = null;
			this.personForm.department = null;
			this.personForm.status = '在职';
			this.personForm.sex = '男';
			this.personForm.phone = '';
			this.personForm.email = '';
			this.personForm.idCard = '';
			this.personForm.departmentRs = null
		},
		closeDialog() {
			this.$refs['personForm'].clearValidate()
			this.resetForm()
			this.$emit('closedialog')
		}
	},
}
</script>

<style>
</style>
