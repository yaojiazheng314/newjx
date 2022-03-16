<template>
	<div id="addExecUser">
		<el-dialog 
			:title="addExecDialogStatus" 
			:show-close="showClose"
			:close-on-click-modal="false"
			:visible.sync="addExecVisible">
			<!-- 输入 用户 科室 模糊查询 考核执行用户-->
			<el-select
				v-model="userParams"
				value-key="id"
				multiple
				filterable
				remote
				reserve-keyword
				placeholder="输入用户名/用户别名/所属科室或'全部'查询"
				:remote-method="remoteMethod"
				:loading="remoteLoading"
				size="small"
				class="fuzzyQuery">
				<el-option
					v-for="item in fuzzyQueryUserParams"
					:key="item.id"
					:label="item.name"
					:value="item">
					<span style="float: left">{{ item.name }}</span>
					<span 
						style="float: right; color: #8492a6; font-size: 13px">
						{{ item.departmentName }}</span>
				</el-option>
			</el-select>
			<!-- 添加选中 -->
			<el-tooltip 
				effect="light" 
				content="添加选中的用户" 
				placement="top-start">
				<el-button 
					size="mini" type="primary"
					style="margin-left: 5px;"
					icon="el-icon-plus"
					@click="addChoosenData"
					circle plain></el-button>
			</el-tooltip>
			<!-- 添加全部 -->
			<el-tooltip 
				effect="light" 
				content="添加查询的全部用户" 
				placement="bottom">
				<el-button 
					size="mini" type="info"
					style="margin-left: 5px;"
					icon="el-icon-caret-bottom"
					@click="addAllFuzzyQueryData"
					circle plain></el-button>
			</el-tooltip>
			<!-- 清空考核指标列表 -->
			<el-tooltip 
				effect="light" 
				content="清空" 
				placement="right-start">
				<el-button 
					size="mini" type="warning"
					style="margin-left: 5px;"
					icon="el-icon-delete-solid"
					@click="cleanExecUserData"
					circle plain></el-button>
			</el-tooltip>
			<!-- 考核指标快速查询 -->
			<el-input
				v-model="searchUser"
				size="mini"
				placeholder="输入用户所属科室搜索"
				style="width: 200px; float: right;"/>
			<!-- 指标的考核依据列表 -->
			<el-table
				:data="execUserData.filter(data => !searchUser || data.departmentName.toLowerCase().includes(searchUser.toLowerCase()))"
				style="width: 100%"
				stripe
				height="400">
				<el-table-column
					prop="username"
					label="用户名">
				</el-table-column>
				<el-table-column
					prop="name"
					label="用户">
				</el-table-column>
				<el-table-column
					prop="departmentName"
					label="所属科室">
				</el-table-column>
				<el-table-column
					fixed="right"
					label="操作"
					width="100">
					<template slot-scope="scope">
						<el-button 
							@click="deleteExecUser(scope.row)" 
							type="text" size="small"
							style="color: #F56C6C;"
							icon="el-icon-delete">移除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div slot="footer" class="dialog-footer">
				<el-button 
					@click="closeDialog"
					class="guo-btn yellow-btn">
					返 回
				</el-button>
				<el-button 
					type="primary"
					@click="saveExamTempUser"
					:loading="loading"
					class="guo-btn light-blue-btn">
					保 存
				</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { getTempExecUser,
				 saveTempExecUser } from '@/api/exam'
import { fuzzyQueryUserParam } from '@/api/user'
export default{
	props: {
		addExecVisible: {
			type: Boolean
		},
		addExecDialogStatus: {
			type: String
		},
		examTempData: {
			type: Object
		}
	},
	name: 'AddExecUser',
	data() {
		return {
			showClose: false,
			loading: false,
			remoteLoading: false,
			searchUser: '',
			userParams: [],
			fuzzyQueryUserParams: [], //模糊查询列表
			execUserData: [],
			examTempUser: {
				temp: null,
				userID: null,
				execUsers: []
			}
		}
  },
	mounted() {
		this.getOperatorInfo()
		const id = this.examTempData.id
		if (id !== null && id !== '') {
			this.examTempUser.temp = id
			this.getExamTempUsers(this.examTempUser)
		}
	},
	methods: {
		//获取操作用户
		getOperatorInfo() {
			var self = this
			self.examTempUser.userID = self.$store.getters.userID
		},
		saveExamTempUser() {
			var self = this
			self.loading = true
			const length = self.execUserData.length
			for (let i = 0; i < length; i++) {
				const exec = self.execUserData[i].id
				self.examTempUser.execUsers.push(exec)
			}
			const data = self.examTempUser
			saveTempExecUser(data).then(response => {
				self.$notify({
				  title: '成功',
				  message: response.msg,
				  type: 'success',
				  duration: 6000
				})
				/* 清空存储的依据重新拉取数据 */
				self.examTempUser.execUsers = []
				let param = {
					temp: data.temp
				}
				self.getExamTempUsers(param)
				self.loading = false
				self.$emit('getList')
			})
		},
		getExamTempUsers(param) {
			var self = this
			getTempExecUser(param).then(response => {
				self.execUserData = response.data
			})
		},
		remoteMethod(query) {
			if (query !== '') {
		    this.remoteLoading = true;
				const search = {
					keyword: query
				}
		    fuzzyQueryUserParam(search).then(res => {
					this.fuzzyQueryUserParams = res.data
				})
				this.remoteLoading = false;
		  }else {
		    this.fuzzyQueryUserParams = [];
		  }
		},
		addChoosenData() {
			var self = this
			let count = 0
			const choosenData = self.userParams
			for (let i = 0; i < choosenData.length; i++) {
				const data = choosenData[i]
				var isContained = self.containsCode(data)
				if (!isContained) {
					self.execUserData.push(data)
					count++
				}
			}
			self.$message({
			  message: "已添加"+count+"名用户",
			  type: 'success',
			  duration: 4000,
				showClose: true
			})
			//清空选择列表
			self.userParams = []
		},
		addAllFuzzyQueryData() {
			var self = this
			let count = 0
			const choosenData = self.fuzzyQueryUserParams
			for (let i = 0; i < choosenData.length; i++) {
				const data = choosenData[i]
				var isContained = self.containsCode(data)
				if (!isContained) {
					self.execUserData.push(data)
					count++
				}
			}
			self.$message({
			  message: "已添加"+count+"名用户",
			  type: 'success',
			  duration: 4000,
				showClose: true
			})
		},
		containsCode(item) {
			const paramID = item.id
			const execUserArr = this.execUserData.map(v => {
				return v.id
			})
			const length = execUserArr.length
			for (let i = 0; i < length; i++) {
				if (execUserArr[i] === paramID) {
					return true
				} 
			}
			return false
		},
		cleanExecUserData() {
			this.execUserData = []
		},
		deleteExecUser(data) {
			const delId = data.id
			let length = this.execUserData.length
			for (let i = 0; i < length; i++) {
				const execUser = this.execUserData[i].id
				if (execUser === delId) {
					this.execUserData.splice(i, 1)
					break
				}
			}
			let delUserInfo = data.departmentName + data.name
			this.$message({
				message: "移除"+delUserInfo,
				type: 'warning',
				duration: 4000,
				showClose: true
			})	
		},
		closeDialog() {
			this.$emit('closeAddExecDialog')
			this.$emit('getList')
		}
	}
}
</script>

