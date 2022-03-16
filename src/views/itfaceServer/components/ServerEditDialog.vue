<template>
	<div id="serverEditDialog">
		<el-dialog 
			:title="dialogStatus" 
			:show-close="showClose"
			:close-on-click-modal="false"
			:visible.sync="dialogVisible">
			<el-form 
				ref="serverForm"
				:rules="rules"
				:model="serverForm" 
				label-position="right" 
				label-width="100px">
				<el-form-item label="名称" prop="name">
					<el-input 
						v-model.trim="serverForm.name" 
						style="width: 180px;">
					</el-input>
				</el-form-item>
				<el-form-item label="状态" prop="status">
					<el-tooltip 
							:content="'当前状态: ' + serverForm.status" 
							placement="top">
						<el-switch
							v-model="serverForm.status"
							active-value="运行"
							inactive-value="停止">
						</el-switch>
					</el-tooltip>
				</el-form-item>
				<!-- 数据库类型 -->
				<el-form-item label="数据库类型" prop="dbType">
					<el-radio-group 
						v-model="serverForm.dbType"
						@change="changeUrl">
						<el-radio label="oracle" value="oracle" />
						<el-radio label="SQLServer" value="SQLServer" />
						<el-radio label="mySQL" value="mySQL" />
					</el-radio-group>
				</el-form-item>
				<!-- 数据库用户名密码 -->
				<el-form-item label="用户名" prop="dbUser">
					<el-input 
						v-model.trim="serverForm.dbUser" 
						style="width: 200px;">
					</el-input>
				</el-form-item>
				<el-form-item label="密码" prop="dbPassword">
					<el-input 
						v-model.trim="serverForm.dbPassword" 
						style="width: 200px;">
					</el-input>
				</el-form-item>
				<!-- 数据库地址 -->
				<el-form-item label="地址" prop="url">
					<el-input 
						v-model.trim="serverForm.url" 
						style="width: 550px;">
					</el-input>
				</el-form-item>
				<!-- 地址说明 -->
				<el-form-item>
					<span v-if="serverForm.dbType == 'SQLServer'">
						{{ sqlserverUrlTip }}
					</span>
					<span v-else-if="serverForm.dbType == 'mySQL'">
						{{ mysqlUrlTip }}
					</span>
					<span v-else-if="serverForm.dbType == 'oracle'">
						{{ oracleUrlTip }}
					</span>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button 
					type="warning"
					:loading="testLoading"
					@click="testConnect"
					style="float: left;">连接测试</el-button>
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
import { saveServer, serverConnectTest } from '@/api/itface'
export default {
	props: {
		dialogVisible: {
			type: Boolean
		},
		dialogStatus: {
			type: String
		},
		serverData: {
			type: Object
		}
	},
	name: 'ServerEditDialog',
	data() {
		return {
			showClose: false,
			loading: false, //用于保存
			testLoading: false, //用于测试连接
			serverForm: {
				id: null,
				name: '',
				status: '运行',
				dbType: '',
				dbUser: '',
				dbPassword: '',
				url: ''
			},
			rules: {
			  name: [
			    { required: true, message: '请输入名称', trigger: 'blur' },
				  { max: 20, message: '名称长度在20字符以内', trigger: 'blur' }
			  ],
			  status: [
			    { required: true, message: '请选择状态', trigger: 'blur' }
			  ],
				dbType: [
				  { required: true, message: '请选择数据库类型', trigger: 'blur' }
				],
				dbUser: [
				  { required: true, message: '请输入数据库用户名', trigger: 'blur' },
					{ max: 20, message: '长度在20字符以内', trigger: 'blur' }
				],
				dbPassword: [
				  { required: true, message: '请输入数据库密码', trigger: 'blur' },
					{ max: 30, message: '长度在30字符以内', trigger: 'blur' }
				],
				url: [
				   { required: true, message: '请输入数据库连接地址', trigger: 'blur' },
					 { max: 100, message: '长度在100字符以内', trigger: 'blur' }
				]
			},
			/* 数据库url */
			mysqlUrl: 'jdbc:mysql://127.0.0.1/<database_name>?useUnicode=true&characterEncoding=utf-8&useSSL=false',
			mysqlUrlTip: 'mySQL数据库URL说明：默认端口3306，如果服务器使用默认端口则port可以省略，允许在URL中添加额外的连接属性jdbc:mysql://<host>:<port>/<database_name>?property1=value1&property2=value2',
			oracleUrl: 'jdbc:oracle:thin:@127.0.0.1:<port>/<database_name>',
			oracleUrlTip: 'oracle数据库Url：1.jdbc:oracle:thin:@//<host>:<port>/ServiceName    2.jdbc:oracle:thin:@<host>:<port>:<SID>',
			sqlserverUrl: 'jdbc:sqlserver://127.0.0.1:<port>;databaseName=<database_name>',
			sqlserverUrlTip: 'SQLServer数据库URL说明：<port> 默认端口1433，如果目标数据库使用默认端口则port可以省略'
		}		
	},
	mounted() {
		const data = this.serverData
		if (data.id !== null && data.id !== '') {
				this.serverForm = Object.assign({}, data)
			}
	},
	methods: {
		save() {
			var self = this
			self.$refs['serverForm'].validate((valid) => {
		    if (valid) {
					self.loading = true
					const data = self.serverForm
		      saveServer(data).then(res => {
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
							  message: res.msg,
							  type: 'success',
							  duration: 6000
							})
						}
						if (data.id === '' || 
						data.id === null) {
							//连续创建
							self.resetForm();
							self.$refs['serverForm'].clearValidate();
							self.$emit('getList')
						}
						self.loading = false
					})
		    } else {
		      return false;
		    }
		  });
		},
		/* 根据数据库类型更新url */
		changeUrl(value) {
			if (value == 'oracle') {
				this.serverForm.url = this.oracleUrl
			} else if (value == 'SQLServer') {
				this.serverForm.url = this.sqlserverUrl
			} else if (value == 'mySQL') {
				this.serverForm.url = this.mysqlUrl
			}
		},
		/* 测试连接 */
		testConnect() {
			if (this.serverForm.dbType == '') {
				this.$message({
			    message: '连接测试: 请选择数据库类型!',
			    type: 'warning'
			  });
				return
			} else if (this.serverForm.dbUser == '') {
				this.$message({
          message: '连接测试: 数据库用户名不能为空!',
          type: 'warning'
        });
				return
			} else if (this.serverForm.dbPassword == '') {
				this.$message({
				  message: '连接测试: 数据库密码不能为空!',
				  type: 'warning'
				});
				return
			} else if (this.serverForm.url == '') {
				this.$message({
				  message: '连接测试: 数据库地址不能为空!',
				  type: 'warning'
				});
				return
			}
			const server = {
				dbType: this.serverForm.dbType,
				dbUser: this.serverForm.dbUser,
				dbPassword: this.serverForm.dbPassword,
				url: this.serverForm.url
			}
			this.testServerConnect(server)
		},
		testServerConnect(server) {
			this.testLoading = true
			serverConnectTest(server).then(res => {
				let status = res.status
				this.testLoading = false
				if (status == 520) {
					this.$message({
						message: res.msg,
						type: 'error'
					});
				} else if (status == 200) {
					this.$message({
						message: '连接成功',
						type: 'success'
					});
				}
			})
		},
		resetForm() {	
			this.serverForm.id = null
			this.serverForm.name = ''
			this.serverForm.status = '运行'
			this.serverForm.dbType = ''
			this.serverForm.dbUser = ''
			this.serverForm.dbPassword = ''
			this.serverForm.url = ''
		},
		closeDialog() {
			this.$refs['serverForm'].clearValidate()
			this.resetForm()
			this.$emit('getList')
			this.$emit('closeDialog')
		}
	},
}
</script>
