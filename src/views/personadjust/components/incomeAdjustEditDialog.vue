<template>
	<div id="incomeAdjustEditDialog">
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
				style="height: 400px; width: 150px; margin-left:50px;">

				<el-form-item label="选择人员" prop="personId">
					<el-select
						v-model="personForm.personId"
						filterable clearable 
						placeholder="选择或输入人员"
						style="width: 230px;"
						class="searchClass">
						<el-option
							v-for="item in personParams"
							:key="item.id"
							:label="item.name"
							:value="item.id">
							<span style="float: left">{{ item.name }}</span>
							<span style="float: right; color: #8492a6; font-size: 13px">
								{{ item.departmentName }}
							</span>
						</el-option>
			</el-select>
				</el-form-item>	

				<el-form-item label="调整科室" prop="departmentId">
					<el-select 
						v-model="personForm.departmentId" 
						filterable clearable 
						placeholder="选择或输入科室"
						style="width: 230px;"
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
				<el-form-item label="开始时间" prop="startTime">
					<el-date-picker
						v-model="personForm.startTime"
						type="date"
						placeholder="选择年月日"
						format="yyyy 年 MM 月 dd 日"
						value-format="yyyy-MM-dd"
						:clearable="true"
						:editable="true"
					
						class="searchClass" >
					</el-date-picker>
				</el-form-item>
				<el-form-item label="结束时间" prop="endTime">
					<el-date-picker
						v-model="personForm.endTime"
						type="date"
						placeholder="选择年月日"
						format="yyyy 年 MM 月 dd 日" 
						value-format="yyyy-MM-dd"
						:clearable="true"
						:editable="true"
					
						class="searchClass" >
					</el-date-picker>
				</el-form-item>
				
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeDialog">返 回</el-button>
				<el-button 
					type="primary"
					@click="saveDataInfo">
					确 定
					</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { savePersonAdjust} from '@/api/person'

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
		sflbParams: {
			type: Array
		},
		personParams: {
			type: Array
		}
	},
	name: 'PersonEditDialog',
	data() {
		return {
			showClose: false,
			
			personForm: {
				id: null,
				departmentId:null,
				personId:null,
				startTime:null,
				endTime:null
			},
			rules: {
			   personId: [
			     { required: true, message: '请选择调整人员', trigger: 'blur' }
			   ],
			   departmentId: [
			     { required: true, message: '请选择调整科室', trigger: 'blur' }
			   ],
			   startTime: [
			     { required: true, message: '请选择开始时间', trigger: 'blur' }
			   ]
			},
			type:true		//查看
		}		
	},
	mounted() {
		
		// this.getProfessTitleParams()
		const data = this.personData
		if (data.id !== null && data.id !== '') {
				this.personForm = Object.assign({}, data)
			}
	},
	

	methods: {
		/* 获取收费类别参数列表 */
		getSflbParams() {
			getChargeTypeParam().then(res => {
				this.sflbParams = res.data
			})
		},
		// getCostTypeParams() {
		// 	var self = this
		// 	getCostTypeList().then(response => {
		// 	  self.costTypeParams = response.data
		// 	})
		// },
		saveDataInfo() {
			var self = this
			// console.log(self.personForm);
			self.$refs['personForm'].validate((valid) => {
		    if (valid) {
		      savePersonAdjust(self.personForm).then(response => {
						self.$notify({
						  title: '成功',
						  message: response.msg,
						  type: 'success',
						  duration: 6000
						})
					
							//连续创建
							self.resetForm();
							self.$refs['personForm'].clearValidate();
					
						self.$emit('getList')
						self.$emit('getDepartmentParams')
						// self.$emit('getPersonParams')
						// self.$emit('getPositionParams')
					})
		    } else {
		      return false;
		    }
		  });
		},
		resetForm() {	
			
				this.personForm.id= null,			
				this.personForm.departmentId=null,
				this.personForm.personId=null,
				this.personForm.startTime=null,
				this.personForm.endTime=null
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
