<template>
	<div id="departmentAddDialog">
		<el-dialog 
			:title="dialogTitle" 
			:show-close="showClose"
			:close-on-click-modal="false"
			:visible.sync="dialogFormVisible">
			<el-form 
				ref="departmentForm"
				:rules="rules"
				:model="departmentForm" 
				:inline="true"
				label-position="right" 
				label-width="80px" 
				style="height: 350px; width: 600px; margin-left:50px;">
				<el-form-item label="名称" prop="name">
					<el-input 
						v-model.trim="departmentForm.name" 
						style="width: 150px;">
					</el-input>
				</el-form-item>
				<el-form-item label="编码" prop="code">
					<el-input 
					 v-model.trim="departmentForm.code" 
					 style="width: 150px;">
					</el-input>
				</el-form-item>
				<el-form-item label="上级科室" prop="parent">
					<el-select 
						v-model="departmentForm.parent" 
						filterable clearable 
						placeholder="上级科室"
						style="width: 150px;">
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
				<el-form-item label="院属" prop="hosp">
					<el-select 
						v-model="departmentForm.hosp" 
						filterable clearable 
						placeholder="选择院属"
						style="width: 150px;">
						<el-option 
							v-for="item in hospitalParams" 
							:key="item.id" 
							:label="item.name" 
							:value="item.id">
							<span style="float: left">{{ item.name }}</span>
						</el-option>
					</el-select>
				</el-form-item>	
					<el-tooltip 
						:content="'当前状态: ' + departmentForm.status" 
						placement="top">
					<el-form-item label="状态" prop="status">
						<el-switch
							v-model="departmentForm.status"
							active-value="启用"
							inactive-value="禁用" style="width: 150px;">
						</el-switch>
					</el-form-item>
				</el-tooltip>
				<el-form-item label="打印序号" prop="xh">
							<el-input 
							 v-model.trim="departmentForm.xh" 
							 style="width: 150px;">
							</el-input>
						</el-form-item>
				<el-form-item label="类型" prop="type">
					<el-radio-group v-model="departmentForm.type" style="width: 450px;">
						<el-radio label="项目" value="项目"></el-radio>
						<el-radio label="科室" value="科室"></el-radio>
						<el-radio label="主任组" value="主任组"></el-radio>
						<el-radio label="治疗组" value="治疗组"></el-radio>
						<el-radio label="护理组" value="护理组"></el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="类别" prop="category">
					<el-radio-group 
						v-model="departmentForm.category"
						size="small"
						style="width: 500px;">
						<el-radio-button label="门诊" value="门诊"></el-radio-button>
						<el-radio-button label="住院" value="住院"></el-radio-button>
						<el-radio-button label="医技" value="医技"></el-radio-button>
						<el-radio-button label="行政" value="行政"></el-radio-button>
						<el-radio-button label="门诊住院" value="门诊住院"></el-radio-button>
						<el-radio-button label="其他" value="其他"></el-radio-button>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="备注" prop="information">
					<el-input
						type="textarea"
						:rows="2"
						placeholder="请输入科室备注信息"
						v-model.trim="departmentForm.information"
						style="width: 400px;">
					</el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeDialog">返 回</el-button>
				<el-button 
					type="primary"
					@click="saveDepartmentInfo">
					确 定
				</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { getHospitalInfo } from '@/api/hospital'
import { getDepartmentParamAll, saveDepartment } from '@/api/department'
export default {
	props: {
		dialogFormVisible: {
			type: Boolean
		}
	},
	name: 'DepartmentAddDialog',
	data() {
		return {
			dialogTitle: '新建科室',
			showClose: false,
			personStatus: ['在职', '编外', '离职'],
			departmentParams: [],
			hospitalParams: [],
			departmentForm: {
				id: null,
				code: '',
				name: '',
				parent: null,
				status: '启用',
				type: '',
				category: '',
				information: '',
				hosp: null,
				xh:''
			},
			rules: {
			   name: [
			     { required: true, message: '请输入科室名称', trigger: 'blur' },
					 { max: 20, message: '名称长度在20字符以内', trigger: 'blur' }
			   ],
			   code: [
			     { required: true, message: '请输入科室编码', trigger: 'blur' }
			   ],
			   type: [
			     { required: true, message: '请选择科室类型', trigger: 'blur' }
			   ],
			   category: [
			     { required: true, message: '请选择科室类别', trigger: 'blur' }
			   ],
			   hosp: [
			     { required: true, message: '请选择院属', trigger: 'blur' }
			   ]
			}
		}		
	},
	mounted() {
		this.getDepartmentParams()
		this.getHospitalParams()
	},
	methods: {
		getDepartmentParams() {
			var self = this
			getDepartmentParamAll().then(response => {
			  self.departmentParams = response.data
			})
		},
		getHospitalParams() {
			var self = this
			getHospitalInfo().then(response => {
			  self.hospitalParams = response.data
			})
		},
		saveDepartmentInfo() {
			var self = this
			self.$refs['departmentForm'].validate((valid) => {
		    if (valid) {
		      saveDepartment(self.departmentForm).then(response => {
						self.$notify({
						  title: '成功',
						  message: response.msg,
						  type: 'success',
						  duration: 6000
						})
						//连续新建科室
						self.resetForm();
						self.$refs['departmentForm'].clearValidate();
						//重取科室列表
						self.$emit('fetchDepartmentTree')
						self.getDepartmentParams()
					})
		    } else {
		      return false;
		    }
		  });
		},
		resetForm() {	
			this.departmentForm.id = null;
			this.departmentForm.name = '';
			this.departmentForm.code = '';
			this.departmentForm.status = '启用';
			this.departmentForm.parent = null;
			this.departmentForm.type = '';
			this.departmentForm.category = '';
			this.departmentForm.hosp = null;
			this.departmentForm.information = '';
			this.departmentForm.xh = '';
		},
		closeDialog() {
			this.$refs['departmentForm'].clearValidate()
			this.resetForm()
			this.$emit('closedialog')
		}
	},
}
</script>

<style>
</style>
