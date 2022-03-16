<template>
	<div id="AddChildDialog">
		<el-dialog 
			:title="addChildStatus" 
			:show-close="showClose"
			:close-on-click-modal="false"
			:visible.sync="addChildVisible"
			width="60%">
			<el-form 
				ref="aimConfigForm"
				:rules="rules"
				:model="aimConfigForm" 
				:inline="true"
				label-position="right" 
				label-width="100px">
				<!-- 1.目标名称 2.责任科室 3.责任人 -->
				<el-form-item label="名称(代码)" prop="name">
					<el-input 
						v-model.trim="aimConfigForm.name" 
						style="width: 200px;">
					</el-input>
				</el-form-item>
				<el-form-item label="责任科室" prop="respDepartment">
					<el-select 
						v-model="aimConfigForm.respDepartment" 
						filterable clearable 
						placeholder="选择或输入科室">
						<el-option 
							v-for="d in departmentParams" 
							:key="d.id" 
							:label="d.name + '_' + d.type" 
							:value="d.id">
							<span style="float: left">{{ d.name }}</span>
							<span style="float: right; color: #8492a6; font-size: 13px">
								{{ d.type }}
							</span>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="责任人" prop="respPerson">
					<!-- 远程搜索personParam -->
					<el-select
						v-model="aimConfigForm.respPerson"
						filterable clearable
						remote
						reserve-keyword
						placeholder="输入人员相关信息查询"
						:remote-method="remoteMethod"
						:loading="remoteLoading">
						<el-option
							v-for="item in personParams"
							:key="item.id"
							:label="item.name"
							:value="item.id">
							<span style="float: left">{{ item.name }}</span>
							<span 
								style="float: right; color: #8492a6; font-size: 13px">
								{{ item.departmentName }}</span>
						</el-option>
					</el-select>
				</el-form-item>
				<!-- 目标类型 年度 月度 -->
				<el-form-item label="目标类型" 
					prop="yearmonthType">
					<el-radio-group 
						v-model="aimConfigForm.yearmonthType">
						<el-radio disabled label="year">年度目标</el-radio>
						<el-radio label="month">月度目标</el-radio>
					</el-radio-group>
				</el-form-item>
				<!-- 目标执行说明 -->
				<el-form-item label="执行说明" prop="requirement">
					<el-input
						type="textarea"
						placeholder="输入目标执行说明"
						v-model.trim="aimConfigForm.requirement"
						:rows="5"
						maxlength="300"
						show-word-limit
						style="width: 780px;">
					</el-input>
				</el-form-item>
				<!-- 汇报类型：自主汇报/客观数据 -->
				<el-form-item label="汇报类型" prop="reportType">
					<el-radio-group 
						v-model="aimConfigForm.reportType">
						<el-radio label="自主汇报" value="自主汇报" />
						<el-radio label="客观数据" value="客观数据" />
					</el-radio-group>
				</el-form-item>
				<!-- 汇报类型为自主汇报 显示预期结果 -->
				<el-form-item 
					v-if="aimConfigForm.reportType == '自主汇报'"
					label="预期结果" 
					prop="expectedResult">
					<el-input
						type="textarea"
						placeholder="输入目标预期结果"
						v-model.trim="aimConfigForm.expectedResult"
						:rows="4"
						maxlength="200"
						show-word-limit
						style="width: 780px;">
					</el-input>
				</el-form-item>
				<!-- 汇报类型为客观数据 -->
				<el-form-item 
					v-if="aimConfigForm.reportType == '客观数据'"
					label="预期值" 
					prop="expectedValue">
					<el-input-number 
						v-model.trim="aimConfigForm.expectedValue" 
						style="width: 200px;">
					</el-input-number>
				</el-form-item>
				<!-- 汇报类型为客观数据时 因子和公式参数 -->
				<div v-if="aimConfigForm.reportType == '客观数据'">
					<el-form-item 
						label="客观因子" prop="objectiveDataItem">
						<!-- 手动填报 或接口导入因子参数 -->
						<el-select 
							v-model="aimConfigForm.objectiveDataItem" 
							filterable clearable 
							placeholder="选择或输入因子"
							@change="cleanAnotherObjective('i')">
							<el-option 
								v-for="item in dataItemParams" 
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
					<el-form-item 
						label="客观公式" prop="objectiveDataFormula">
						<!-- 手动填报 或接口导入因子参数 -->
						<el-select 
							v-model="aimConfigForm.objectiveDataFormula" 
							filterable clearable 
							placeholder="选择或输入公式"
							@change="cleanAnotherObjective('f')">
							<el-option 
								v-for="item in dataFormulaParams" 
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
				</div>
				<!-- 目标导入关联因子 -->
				<el-form-item label="关联因子" prop="bnsDataItem">
					<!-- 将目标进度结果导入的关联因子 -->
					<el-select 
						v-model="aimConfigForm.bnsDataItem" 
						filterable clearable 
						placeholder="选择目标导入因子">
						<el-option 
							v-for="item in aimItemParams" 
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
				<!-- 上级目标 -->
				<el-form-item 
					label="上级目标" prop="parent">
					<span>{{ parentAimName }}</span>
					<el-popover
						placement="top-start"
						width="630"
						trigger="click">
						<aim-child-weight
							v-if="waterfallStatus"
							:aimConfigParent="aimConfigForm.parent" />
						<el-button 
							style="margin-left: 10px;"
							slot="reference"
							type="text" size="small"
							@click="loadParentWeightWaterfall">
							权重分配 <i class="el-icon-s-help"></i>
						</el-button>
					</el-popover>
				</el-form-item>
				<!-- 当前目标占上级目标的权重 -->
				<el-form-item
					label="权重">
					<el-slider
						v-model="aimConfigForm.weight"
						:max="restWeight"
						show-input
						style="width: 600px;">
					</el-slider>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeDialog">返 回</el-button>
				<el-button 
					type="primary"
					:loading="loading"
					@click="save">
					保 存
				</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { getDepartmentParam	} from '@/api/department'
import { fuzzyQueryPerParam } from '@/api/person'
import { getHandleAndInterfaceParams,
				 getAimDataItemParam } from '@/api/bnsDataItem'
import { saveAimConfig } from '@/api/aim'
import { getFormulaParam} from '@/api/bnsFormula'
import AimChildWeight from './AimChildWeight'
export default {
	props: {
		addChildVisible: {
			type: Boolean
		},
		addChildStatus: {
			type: String
		},
		aimConfigData: {
			type: Object
		}
	},
	name: 'AddChildDialog',
	components: { AimChildWeight }, 
	data() {
		return {
			showClose: false,
			loading: false, //用于保存
			parentAimName: '', //上级目标名称
			aimConfigForm: {
				id: null,
				name: '', //目标名称 目标代码
				respDepartment: null, //责任科室
				respPerson: null, //责任人
				yearmonthType: 'month', //目标类型：month
				requirement: '', //目标执行说明
				reportType: '', //汇报类型：自主汇报/客观数据
				objectiveDataItem: null, //客观数据关联因子
				objectiveDataFormula: null, //客观数据关联公式
				expectedResult: '', //期待到达的结果
				expectedValue: 0.0, //预期值
				bnsDataItem: null, //目标结果导入
				parent: null, //用户可用目标参数
				weight: 0.0, //占上级目标的权重
				operator: null //操作用户
			},
			rules: {
			  name: [
			    { required: true, 
						message: '请输入目标名称，或目标代码', trigger: 'blur' },
				  { max: 20, message: '长度在20字符以内', trigger: 'blur' }
			  ],
				respDepartment: [
					{ required: true, message: '请选择责任科室', trigger: 'blur' }
				],
				respPerson: [
					{ required: true, message: '请选择责任人', trigger: 'blur' }
				],
				yearmonthType: [
					{ required: true, message: '请选择目标类型', trigger: 'blur' }
				],
				requirement: [
					{ required: true, message: '请编辑执行说明', trigger: 'blur' }
				],
				reportType: [
					{ required: true, message: '请选择汇报类型', trigger: 'blur' }
				],
				expectedResult: [
					{ required: true, message: '请编辑预期结果', trigger: 'blur' }
				],
				expectedValue: [
					{ required: true, message: '请输入预期值', trigger: 'blur' }
				]
			},
			/* 可选的参数 */
			departmentParams: [], //科室参数
			personParams: [], //模糊查询的人员列表
			remoteLoading: false, //用于模糊查询loading
			dataItemParams: [], //手动填报和接口导入因子
			dataFormulaParams: [], //公式
			aimItemParams: [] ,//关联目标因子
			/* 上级目标权重分配明细 */
			waterfallStatus: false, //加载瀑布图
			popoverPlace: 'top-start' //弹出框位置
		}		
	},
	created() {
		this.getDepartmentParam()
		//获取手动填报和接口导入因子参数
		this.getDataItemParam()
		//获取公式参数
		this.getDataFormulaParam()
		//获取目标因子参数
		this.getAimItemParam()
		this.getUserInfo()
		//获取父级目标的权重明细以及剩余权重值
		this.getParentAimWeightInfo()
	},
	methods: {
		/* 获取上级目标剩余权重明细 */
		getParentAimWeightInfo() {
			const data = this.aimConfigData
			this.aimConfigForm.parent = data.id
			this.parentAimName = data.name 
			const query = {
				aimConfig: data.id
			}
			getAimConfigWeightInfo(query).then(res => {
				this.ringStatus = true
				this.weightList = res.data.weightList
				this.restWeight = res.data.restWeight
				// this.loadChildWeightRing() //加载环形图
			})
		},
		loadChildWeightRing() {
			this.ringStatus = true
		},
		/* 获取用户id */
		getUserInfo() {
			this.aimConfigForm.operator = this.$store.getters.userID
		},
		/* 获取参数列表 */
		getDepartmentParam() {
			getDepartmentParam().then(response => {
				this.departmentParams = response.data
			})
		},
		/* 模糊查询人员信息参数 */
		remoteMethod(query) {
			if (query !== undefined && query != '') {
		    this.remoteLoading = true;
				const search = {
					keyword: query
				}
		    fuzzyQueryPerParam(search).then(res => {
					this.personParams = res.data
				})
				this.remoteLoading = false;
		  }else {
		    this.personParams = [];
		  }
		},
		/* 获取手动填报和接口导入因子参数 */
		getDataItemParam() {
			getHandleAndInterfaceParams().then(res => {
				this.dataItemParams = res.data
			})
		},
		/* 获取公式参数 */
		getDataFormulaParam() {
			getFormulaParam().then(res => {
				this.dataFormulaParams = res.data
			})
		},
		/* 获取目标因子参数 */
		getAimItemParam() {
			getAimDataItemParam().then(res => {
				this.aimItemParams = res.data
			})
		},
		/* 获取父级目标的权重分配明细 */
		loadParentWeightWaterfall() {
			this.waterfallStatus = false
			const parentAim = this.aimConfigForm.parent
			if (parentAim != null) {
				this.$nextTick(() => {
		     	this.waterfallStatus = true
					this.popoverPlace = 'top-start'
		    })
			}
		},
		/* 清空另一个客观数据id */
		cleanAnotherObjective(flg) {
			if (flg == 'i') {
				this.aimConfigForm.objectiveDataFormula = null
			} else if (flg == 'f') {
				this.aimConfigForm.objectiveDataItem = null
			}
		},
		/* 保存目标配置 */
		save() {
			var self = this
			self.$refs['aimConfigForm'].validate((valid) => {
		    if (valid) {
					self.loading = true
					const data = self.aimConfigForm
		      saveAimConfig(data).then(res => {
						let status = res.status
						self.loading = false
						if (status == 520) {
							this.$message({
								message: res.msg,
								type: 'error'
							});
							return
						} else if (status == 200) {
							self.$notify({
							  title: '成功',
							  message: data.name+'保存成功',
							  type: 'success',
							  duration: 6000
							})
						}
						if (data.id === undefined || 
						data.id === null) {
							//连续创建
							self.resetForm();
							self.$refs['aimConfigForm'].clearValidate();
							self.$emit('getList')
						}
						self.loading = false
					})
		    } else {
		      return false;
		    }
		  });
		},
		/* 重置form页面 startTime、endTime、operator不重置 */
		resetForm() {	
			this.aimConfigForm.id = null
			this.aimConfigForm.name = ''
			this.aimConfigForm.respDepartment = null //责任科室
			this.aimConfigForm.respPerson = null //责任人
			this.aimConfigForm.yearmonthType = '' //责任人
			this.aimConfigForm.requirement = '' //目标执行说明
			this.aimConfigForm.reportType = '' //汇报类型：自主汇报/客观数据
			this.aimConfigForm.objectiveDataItem = null //客观数据关联因子
			this.aimConfigForm.objectiveDataFormula = null //客观数据关联公式
			this.aimConfigForm.expectedResult = '' //期待到达的结果
			this.aimConfigForm.expectedValue = 0.0 //预期值
			this.aimConfigForm.bnsDataItem = null //目标结果导入
			this.aimConfigForm.weigth = 0.0
		},
		closeDialog() {
			this.$refs['aimConfigForm'].clearValidate()
			this.resetForm()
			this.$emit('getList')
			this.$emit('closeAddChildAim')
		}
	},
}
</script>
