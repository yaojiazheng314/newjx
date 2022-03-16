<template>
	<div id="editDialog">
		<el-dialog
			:title="dialogStatus"
			:show-close="showClose"
			:close-on-click-modal="false"
			:visible.sync="dialogFormVisible">
			<el-form
				ref="reportForm"
				:rules="rules"
				:model="reportForm"
				label-position="right"
				label-width="80px"
				style="width: 200px; margin-left:50px;">
				<el-form-item label="报表名称" prop="name">
					<el-input
						placeholder="输入报表名称"
						v-model.trim="reportForm.name"
						style="width: 200px;"></el-input>
				</el-form-item>
				<el-form-item label="报表类型" prop="reportType">
					<el-select
						v-model="reportForm.reportType"
						filterable placeholder="选择报表类型"
						style="width: 200px;">
						<el-option
							v-for="item in reportTypeParam"
							:key="item.value"
							:label="item.value"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="文件名" prop="fileName">
					<el-input
						placeholder="请输入文件名"
						v-model="reportForm.fileName"
						style="width: 300px;">
						<template slot="append">.cpt</template>
					</el-input>
				</el-form-item>
				<el-form-item label="报表属性" prop="rwType">
      				<el-radio v-model="reportForm.rwType" :label="1" >浏览</el-radio>
      				<el-radio v-model="reportForm.rwType" :label="2" >填报</el-radio>
    			</el-form-item>
				<el-form-item label="参数">
					<el-checkbox-group v-model="reportParams">
						<el-checkbox label="DEPARTMENT_ID" name="DEPARTMENT_ID"></el-checkbox>
						<el-checkbox label="PERSON_ID" name="PERSON_ID"></el-checkbox>
						<el-checkbox label="POSITION_ID" name="POSITION_ID"></el-checkbox>
						<el-checkbox label="USER_ID" name="USER_ID"></el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item label="链接" prop="exterLink">
					<el-select
						v-model="reportForm.exterLink"
						filterable placeholder="链接"
						style="width: 200px;">
						<el-option
							v-for="item in linkParam"
							:key="item.id"
							:label="item.name"
							:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="排列顺序" prop="seq">
					<el-input 
						maxlength="4" 
						type="number"
						v-model="reportForm.seq" 
						style="width: 150px;">
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
import { getExternalLinkParam,
				 saveExterReport } from '@/api/externalLink'
export default {
	props: {
		//dialog是否可见
		dialogFormVisible: {
			type: Boolean
		},
		//父组件传递对象：
		//reportData：id, name, reportType, fileName, params, exterLink
		reportData: {
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
			linkParam: [],
			reportTypeParam: [{value: '数据挖掘'},	{value: '业务分析'},
                        {value: '医保管控'}, {value: '临床查询'},
												{value: '机关查询'},	{value: '财务审核'},
                        {value: '核算分析'}, {value: '运营分析'}, {value: '科室报表'}],
			reportParams: [], //报表js传参
			//报表配置实体对象
			reportForm: {
				id: null,
				name: '', //链接名称
				reportType: '', //报表类型
				fileName: '', //文件名称
				params: '', //参数 用户报表平台js传参
				exterLink: null, //链接地址
				seq:0,
				rwType:1
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
				reportType: [
				  { required: true,
				 	  message: '选择报表类型',
				 		trigger: 'blur' }
				],
				seq: [
				  {  required: true, message: '请输入排序顺序', 
					 trigger: 'blur'  }
				],
				fileName: [
				  { required: true,
				 	  message: '输入文件名',
				 		trigger: 'blur' },
					{ max: 100,
						message: '长度在100字符以内',
						trigger: 'blur' }
				],
				exterLink: [
				  { required: true,
				 	  message: '选择报表外链接',
				 		trigger: 'blur' }
				],
			}
		}
	},
	mounted() {
		this.getLinkParams()
		const data = this.reportData
		if (data.id !== null) {
			this.reportForm = Object.assign({}, data)
			if (data.params !== '') {
				const params = data.params.split(",")
				for (var i = 0; i < params.length; i++) {
					let param = params[i]
					this.reportParams.push(param)
				}
			}
		}
	},
	methods: {
		getLinkParams() {
			var self = this
			getExternalLinkParam().then(res => {
				self.linkParam = res.data
			})
		},
		save() {
			var self = this
			self.$refs['reportForm'].validate((valid) => {
		    if (valid) {
					self.loading = true
					//设置报表参数
					self.setReportParams()
					var exterReportManage = self.reportForm
					debugger
		      saveExterReport(exterReportManage).then(response => {
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
							if (self.reportForm.id === null) {
								//连续创建
								self.resetForm();
								self.$refs['reportForm'].clearValidate();
							}
							self.$emit('getList')
						}
					})
		    } else {
		      return false;
		    }
		  });
		},
		setReportParams() {
			const length = this.reportParams.length
			if (length === 0) {
				return
			} else {
				var params = ''
				for (let i = 0; i < length; i++) {
					params += this.reportParams[i]
					if (i === length - 1) {
						break
					} else{
						params += ','
					}
				}
				//重置reportForm.params
				this.reportForm.params = ''
				this.reportForm.params = params
			}
		},
		resetForm() {
			this.reportForm.id = null
			this.reportForm.name = ''
			this.reportForm.reportType = ''
			this.reportForm.fileName = ''
			this.reportForm.params = ''
			this.reportForm.exterLink = null
			this.reportForm.rwType = 1
		},
		closeDialog() {
			this.$refs['reportForm'].clearValidate()
			this.resetForm()
			this.$emit('getList')
			this.$emit('getReportParams')
			this.$emit('closedialog')
		}
	},
}
</script>

<style>
</style>
