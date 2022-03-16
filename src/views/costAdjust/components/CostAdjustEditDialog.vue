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
				style="height: 280px; width: 500px; margin-left:50px;">
				
				<el-form-item label="调整年月" prop="yearmonth" >
					<el-date-picker
				v-model="personForm.yearmonth"
				type="month"
				placeholder="选择年月"
				format="yyyy 年 M 月"
				value-format="yyyy-MM"
				:clearable="false"
				:editable="false"
			
				class="searchClass" :disabled="typeYM">
			</el-date-picker>
				</el-form-item>
				<el-form-item label="成本项目" prop="costTypeId">
					<el-select 
						v-model="personForm.costTypeId" 
						filterable clearable 
						placeholder="选择成本项目"
						style="width: 150px;"
						:disabled="type">
						<el-option 
							v-for="item in costTypeParams" 
							:key="item.id" 
							:label="item.name" 
							:value="item.id">
							<span style="float: left">{{ item.name }}</span>
						</el-option>
					</el-select>
				</el-form-item>	

				<el-form-item label="调整科室" prop="deptmentId">
					<el-select 
						v-model="personForm.deptmentId" 
						filterable clearable 
						placeholder="选择调整科室"
						style="width: 230px;"
						:disabled="type">
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
				
		
				<el-form-item label="调整金额" prop="adgustValue">
					<el-input type="number" 
						v-model.trim="personForm.adgustValue" 
						style="width: 200px;"
						:disabled="type">
					</el-input>
				</el-form-item>

				<el-form-item label="调整原因" prop="adgustReason">
					
					<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 3}" v-model.trim="personForm.adgustReason" style="width:400px;" :disabled="type">
          </el-input>
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
import { getCostTypeList,saveCostTypeData } from '@/api/costAdjust'
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
		}
	},
	name: 'PersonEditDialog',
	data() {
		return {
			showClose: false,
			costTypeParams: [],
			personForm: {
					id: null,
					costTypeId:null,
					deptmentId: null,
					yearmonth:null,					
					adgustValue: 0,
					adgustReason: ''
			},
			rules: {
			   yearmonth: [
			     { required: true, message: '请选择调整年月', trigger: 'blur' }
					
			   ],
			   costTypeId: [
			     { required: true, message: '请选择调整成本项', trigger: 'blur' }
			   ],
			   deptmentId: [
			     { required: true, message: '请选择科室', trigger: 'blur' }
			   ],
			   adgustValue: [
			     { required: true, message: '请输入调整金额', trigger: 'blur' }
			   ],
			   adgustReason: [
			     { required: true, message: '请选择调整原因', trigger: 'blur' }
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
		if(this.dialogStatus == '编辑调整成本信息'){
			this.typeYM = true //编辑
		}
		this.getCostTypeParams()
		const data = this.personData
		if (data.id !== null && data.id !== '') {
				this.personForm = Object.assign({}, data)
			}
	},
	methods: {
		getCostTypeParams() {
			var self = this
			getCostTypeList().then(response => {
			  self.costTypeParams = response.data
			})
		},
		saveDateInfo() {
			var self = this
			self.$refs['personForm'].validate((valid) => {
		    if (valid) {				
		      saveCostTypeData(self.personForm).then(response => {
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
					this.personForm.yearmonth = null,
					this.personForm.costTypeId=null,
					this.personForm.deptmentId= null,
					this.personForm.adgustValue= 0,
					this.personForm.adgustReason= ''
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
