<template>
	<div id="editDialog">
		<el-dialog 
			:title="dialogStatus" 
			:show-close="showClose"
			:close-on-click-modal="false"
			:visible.sync="dialogFormVisible">
			<el-form 
				ref="examTempForm"
				:rules="rules"
				:model="examTempForm" 
				label-position="right" 
				label-width="80px" 
				style="height: 200px; width: 200px; margin-left:50px;">
				<el-form-item label="模板名称" prop="name">
					<el-input 
						placeholder="输入考核模板名称"
						v-model.trim="examTempForm.name" 
						style="width: 200px;"></el-input>
				</el-form-item>
				<el-form-item label="模板类型" prop="type">
					<el-radio-group 
						v-model="examTempForm.type"
						style="width: 450px;">
						<el-radio :label="0">{{ tempTypeStr }}</el-radio>
						<el-radio :label="1">{{ targetTypeStr }}</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="考核方向" prop="assessed">
					<el-radio-group 
						v-model="examTempForm.assessed"
						size="small"
						@change="changeItemParam"
						style="width: 500px;">
						<el-radio-button label="科室" value="科室"></el-radio-button>
						<el-radio-button label="人员" value="人员"></el-radio-button>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="模板总分" prop="fullScore">
					<el-input-number 
						v-model="examTempForm.fullScore" 
						:min="0" 
						:max="999">
					</el-input-number>
				</el-form-item>
				<el-form-item label="关联因子" prop="bnsDataItem">
					<el-select 
						v-model="examTempForm.bnsDataItem" 
						filterable clearable 
						placeholder="选择关联因子"
						style="width: 200px;">
						<el-option 
							v-for="item in itemParams" 
							:key="item.id" 
							:label="item.name" 
							:value="item.id">
							<span style="float: left">{{ item.name }}</span>
							<span style="float: right; color: #8492a6; font-size: 13px">
								{{ item.type }}
							</span>
						</el-option>
					</el-select>
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
import { saveExamTemp } from '@/api/exam'
import { getDataItemParam } from '@/api/bnsDataItem'
export default {
	props: {
		//dialog是否可见
		dialogFormVisible: {
			type: Boolean
		},
		//父组件传递对象：examTempData： id, name, type, assessed, bnsDataItem
		examTempData: {
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
			itemParams: [], //关联因子
			itemDeptParams: [], //科室类型关联因子
			itemPerParams: [], //人员类型关联因子
			//模板类型可选值
			tempTypeStr: '模板责任制', 
			targetTypeStr: '指标责任制',
			//考核指标实体对象
			examTempForm: {
				id: null,
				name: '', //模板名称
				type: 0, //模板类型 0:模板责任制  1:指标责任制
				assessed: '',
				fullScore: 0,
				bnsDataItem: null, //关联因子
				operator: null //操作者 userID
			},
			rules: {
			  name: [
			    { required: true, 
			   	  message: '输入考核模板名称',
			   		trigger: 'blur' },
			   	{ max: 30, 
			   		message: '考核模板名称长度在30字符以内',
			   		trigger: 'blur' }
			  ],
				type: [
				  { required: true, 
				 	  message: '选择考核模板类型',
				 		trigger: 'blur' }
				],
				assessed: [
				  { required: true, 
				 	  message: '选择考核方向',
				 		trigger: 'blur' }
				],
				fullScore: [
					{ required: true, 
					  message: '设置模板总分',
						trigger: 'blur' }
				]
			}
		}		
	},
	mounted() {
		this.getOperatorInfo() //获取操作用户
		this.getItemParams() //获取用于选择上级指标的参数列表
		const data = this.examTempData
		if (data.id !== null) {
				this.examTempForm = Object.assign({}, data)
			}
		this.changeItemParam() //挂载关联因子参数
	},
	methods: {
		//获取操作用户
		getOperatorInfo() {
			var self = this
			self.examTempForm.operator = self.$store.getters.userID
		},
		//关联因子数据
		getItemParams() {
			var self = this
			getDataItemParam().then(response => {
				const items = response.data
				let length = items.length
				for (let i = 0; i < length; i++) {
					const dataSource = items[i].dataSource
					if (dataSource === '考核导入') {
						const type = items[i].type
						if (type === '科室') {
							self.itemDeptParams.push(items[i])
						} else if (type === '人员') {
							self.itemPerParams.push(items[i])
						}
					}
				}
			})
		},
		//转换因子参数类型（科室/人员）
		changeItemParam() {
			var self = this
			let itemType = self.examTempForm.assessed
			if (itemType === '科室') {
				self.itemParams = self.itemDeptParams
			}else if (itemType === '人员') {
				self.itemParams = self.itemPerParams
			}
		},
		save() {
			var self = this
			self.$refs['examTempForm'].validate((valid) => {
		    if (valid) {
					self.loading = true
					var examTemp = self.examTempForm
		      saveExamTemp(examTemp).then(response => {
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
							if (self.examTempForm.id === null) {
								//连续创建
								self.resetForm();
								self.$refs['examTempForm'].clearValidate();
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
			this.examTempForm.id = null
			this.examTempForm.name = ''
			this.examTempForm.type = this.tempTypeStr
			this.examTempForm.assessed = ''
			this.examTempForm.bnsDataItem = null
		},
		closeDialog() {
			this.$refs['examTempForm'].clearValidate()
			this.resetForm()
			this.$emit('getList')
			this.$emit('getTempParam')
			this.$emit('closedialog')
		}
	},
}
</script>

<style>
</style>
