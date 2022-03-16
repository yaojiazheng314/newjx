<template>
	<div id="itfaceItemEditDialog">
		<el-dialog 
			:title="dialogStatus" 
			:show-close="showClose"
			:close-on-click-modal="false"
			:visible.sync="dialogVisible"
			width="40%">
			<el-form 
				ref="itfaceItemForm"
				:rules="rules"
				:model="itfaceItemForm" 
				label-position="right" 
				label-width="100px">
				<el-form-item label="名称" prop="name">
					<el-input 
						v-model.trim="itfaceItemForm.name" 
						style="width: 180px;">
					</el-input>
				</el-form-item>
				<!-- 接口类型 基础数据 业务数据 -->
				<el-form-item label="类型" prop="type">
					<el-radio-group 
						v-model="itfaceItemForm.type">
						<el-radio label="基础数据" value="基础数据" />
						<el-radio label="业务数据" value="业务数据" />
					</el-radio-group>
				</el-form-item>
				<!-- 访问接口配置 视图 存储过程 名称编码 -->
				<el-form-item label="访问接口" prop="itfaceSource">
					<el-input 
						placeholder="请输入视图或存储过程名称" 
						v-model.trim="itfaceItemForm.itfaceName"
						style="width: 400px;">
						<el-select 
							v-model="itfaceItemForm.itfaceSource" 
							style="width: 130px;"
							slot="prepend" placeholder="选择接口类型">
							<el-option label="视图" value="view">视图</el-option>
							<el-option label="存储过程" value="proc">存储过程</el-option>
						</el-select>
					</el-input>
				</el-form-item>
				<!-- 存储表名 -->
				<el-form-item label="存储表名" prop="storageTableName">
					<el-input 
						v-model.trim="itfaceItemForm.storageTableName" 
						style="width: 200px;">
					</el-input>
				</el-form-item>
				<!-- 服务连接 -->
				<el-form-item label="服务" prop="itfaceServer">
					<el-select 
						v-model="itfaceItemForm.itfaceServer" 
						filterable clearable 
						placeholder="选择连接服务"
						style="width: 200px;">
						<el-option 
							v-for="item in serverParams" 
							:key="item.id" 
							:label="item.name" 
							:value="item.id">
							<span style="float: left">{{ item.name }}</span>
						</el-option>
					</el-select>
				</el-form-item>
				<!-- 自动执行配置 -->
				<el-form-item label="自动执行" prop="autoStatus">
					<el-tooltip 
							:content="'当前状态: ' + itfaceItemForm.autoStatus" 
							placement="top">
						<el-switch
							v-model="itfaceItemForm.autoStatus"
							active-value="启动"
							inactive-value="关闭">
						</el-switch>
					</el-tooltip>
				</el-form-item>
				<div v-if="itfaceItemForm.autoStatus == '启动'">
					<el-form-item label="执行频率" prop="cycle">
						<el-input
							type="number"
							v-model.number="itfaceItemForm.cycleDay"
							:max="31"
							:min="1"
							style="width: 230px;">
							<el-select 
								v-model="itfaceItemForm.cycle" 
								style="width: 90px;"
								slot="prepend" placeholder="选择频率">
								<el-option label="每月" value="month"></el-option>
								<el-option label="每" value="day"></el-option>
							</el-select>
							<template slot="append">
								{{ itfaceItemForm.cycle === 'month' ? '号' : '天' }}
							</template>
						</el-input>
					</el-form-item>
					<!-- 执行时间 -->
					<el-form-item label="启动时间" prop="runTime">
						<el-time-select
							v-model="itfaceItemForm.runTime"
							:picker-options="{
								start: '00:00',
								step: '00:15',
								end: '23:45'
							}"
							placeholder="选择时间">
						</el-time-select>
					</el-form-item>
				</div>
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
import { saveItfaceItem, getItfaceServerParam } from '@/api/itface'
export default {
	props: {
		dialogVisible: {
			type: Boolean
		},
		dialogStatus: {
			type: String
		},
		itfaceItemData: {
			type: Object
		}
	},
	name: 'ItfaceItemEditDialog',
	data() {
		return {
			showClose: false,
			loading: false, //用于保存
			itfaceItemForm: {
				id: null,
				name: '', //接口名称
				type: '', //接口类型 视图 存储过程
				itfaceName: '', //视图或存储过程名称
				itfaceSource: '', //接口来源 自定义
				storageTableName: '', //存储表名
				itfaceServer: null, //使用的服务连接
				autoStatus: '启动', //接口自动执行状态
				cycle: 'month', //自动执行方式(每月 month/每 day)
				cycleDay: 1, //自动执行日期 每月几号或每隔几天
				runTime: '00:00' //执行时间 格式00:00
			},
			rules: {
			  name: [
			    { required: true, message: '请输入名称', trigger: 'blur' },
				  { max: 20, message: '名称长度在20字符以内', trigger: 'blur' }
			  ],
				type: [
					{ required: true, message: '请选择接口类型', trigger: 'blur' },
				],
				itfaceName: [
					{ required: true, message: '请输入接口名称', trigger: 'blur' },
					{ max: 50, message: '名称长度在50字符以内', trigger: 'blur' }
				],
			  itfaceSource: [
			    { required: true, message: '请选择接口类型', trigger: 'blur' }
			  ],
				storageTableName: [
					{ required: true, message: '请输入存储表名', trigger: 'blur' },
					{ max: 50, message: '名称长度在50字符以内', trigger: 'blur' }
				],
				itfaceServer: [
					{ required: true, message: '选择连接服务', trigger: 'blur' }
				],
				autoStatus: [
					{ required: true, message: '请选择自动执行状态', trigger: 'blur' }
				],
				cycle: [
					{ required: true, message: '请配置执行频率', trigger: 'blur' }
				],
				runTime: [
					{ required: true, message: '请选择启动时间', trigger: 'blur' }
				]
			},
			/* 可选的服务连接参数 */
			serverParams: []
		}		
	},
	created() {
		this.getServerParam()
	},
	mounted() {
		const data = this.itfaceItemData
		if (data.id !== null && data.id !== '') {
				this.itfaceItemForm = Object.assign({}, data)
			}
	},
	methods: {
		/* 获取服务连接参数列表 */
		getServerParam() {
			getItfaceServerParam().then(res => {
				this.serverParams = res.data
			})
		},
		save() {
			var self = this
			let checkResult = self.checkForm()
			if (checkResult) {
				return
			}
			self.$refs['itfaceItemForm'].validate((valid) => {
		    if (valid) {
					self.loading = true
					const data = self.itfaceItemForm
		      saveItfaceItem(data).then(res => {
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
							  message: '保存成功',
							  type: 'success',
							  duration: 6000
							})
						}
						if (data.id === '' || 
						data.id === null) {
							//连续创建
							self.resetForm();
							self.$refs['itfaceItemForm'].clearValidate();
							self.$emit('getList')
						}
						self.loading = false
					})
		    } else {
		      return false;
		    }
		  });
		},
		/* 检查接口表名是否为空 */
		checkForm() {
			const itfaceName = this.itfaceItemForm.itfaceName
			if (itfaceName == '') {
				this.$message({
					message: '请输入访问接口中的名称',
					type: 'error'
				});
				return true;
			}
			const autoStatus = this.itfaceItemForm.autoStatus
			if (autoStatus == '启动') {
				let cycleDay = this.itfaceItemForm.cycleDay
				if (cycleDay == null || cycleDay == '') {
					this.$message({
						message: '请输入执行频率中的天数或日期',
						type: 'error'
					});
					return true;
				}
			}
			return false
		},
		resetForm() {	
			this.itfaceItemForm.id = null
			this.itfaceItemForm.name = ''
			this.itfaceItemForm.type = '基础数据'
			this.itfaceItemForm.itfaceName = ''
			this.itfaceItemForm.itfaceSource = ''
			this.itfaceItemForm.storageTableName = ''
			this.itfaceItemForm.itfaceServer = null
			this.itfaceItemForm.autoStatus = '启动'
			this.itfaceItemForm.cycle = 'month'
			this.itfaceItemForm.cycleDay = 1
			this.itfaceItemForm.runTime = '00:00'
		},
		closeDialog() {
			this.$refs['itfaceItemForm'].clearValidate()
			this.resetForm()
			this.$emit('getList')
			this.$emit('closeDialog')
		}
	},
}
</script>
