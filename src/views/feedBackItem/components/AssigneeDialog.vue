<template>
	<div id="assigneeDialog">
		<el-dialog 
			:title="assDialogStatus" 
			:show-close="showClose"
			:close-on-click-modal="false"
			:visible.sync="visible"
			@close="closeDialog">
			<el-input
				v-model="searchDept"
				size="mini"
				placeholder="输入科室名称搜索"
				style="width: 180px;"/>
			<el-input
				v-model="searchUser"
				size="mini"
				placeholder="输入用户搜索"
				style="width: 180px;"/>
			<el-tooltip 
				class="item" effect="dark" 
				content="添加分配科室" placement="top">
				<el-button 
					type="primary" 
					icon="el-icon-plus" size="mini" 
					@click="addNewAssignee" 
					plain circle>
				</el-button>
			</el-tooltip>
			<el-tooltip 
				class="item" effect="dark" 
				content="按照关联项补充分配科室" placement="right">
				<el-button 
					type="warning" 
					icon="el-icon-document-add" size="mini" 
					@click="supplyAssignees" 
					plain>
				</el-button>
			</el-tooltip>	
			<el-table 
				:loading="loading" 
				:data="assigneeList.filter(data => !searchDept || data.deptName.toLowerCase().includes(searchDept.toLowerCase())).filter(data => !searchUser || data.userName.toLowerCase().includes(searchUser.toLowerCase()))" 
				fit stripe highlight-current-row style="width: 100%"
        height="450" useVirtual>
				<el-table-column label="分配科室">
					<template slot-scope="scope">
						<el-select 
							v-if="scope.row.edit"
							v-model="scope.row.department" 
							filterable 
							placeholder="请选择分配科室">
							<el-option
								v-for="item in departmentParams"
								:key="item.id"
								:label="item.name"
								:value="item.id">
							</el-option>
						</el-select>
						<span v-else>{{ scope.row.deptName }}</span>
					</template>
				</el-table-column>
			  <el-table-column label="分配用户">
			    <template slot-scope="scope">
			      <el-select 
							v-if="scope.row.edit"
			      	v-model="scope.row.user" 
							filterable 
			      	placeholder="请选择分配责任用户">
			      	<el-option
			      		v-for="item in userParams"
			      		:key="item.id"
			      		:label="item.name"
			      		:value="item.id">
								<span style="float: left">{{ item.name }}</span>
								<span 
									style="float: right; color: #8492a6; font-size: 13px">
									{{ item.deptName }}</span>
			      	</el-option>
			      </el-select>
						<span v-else>{{ scope.row.userName }}</span>
			    </template>
			  </el-table-column>
				<el-table-column label="职位限制">
				  <template slot-scope="scope">
				    <el-select 
							v-if="scope.row.edit"
				    	v-model="scope.row.forbidPos" 
							clearable multiple
				    	placeholder="选择禁分配职位">
				    	<el-option
				    		v-for="item in posParams"
				    		:key="item.id"
				    		:label="item.name"
				    		:value="item.id">
				    	</el-option>
				    </el-select>
						<span v-else>{{ scope.row.forbidPosName }}</span>
				  </template>
				</el-table-column>
			  <el-table-column align="center" label="操作" with="100">
			    <template slot-scope="scope">
						<div v-if="scope.row.edit">
							<el-tooltip 
								class="item" effect="dark" 
								content="确认" placement="left">
								<el-button
									type="success" size="mini" 
									icon="el-icon-check"
									:loading="scope.row.subLoading"
									@click="confirmAssignee(scope.row)"
									plain circle>
								</el-button>	
							</el-tooltip>
							<el-tooltip 
								class="item" effect="dark" 
								content="删除" placement="right">
								<el-button
									type="danger" icon="el-icon-delete-solid"
									size="mini" 
									@click="deleteAssignee(scope.$index, scope.row)"
									plain circle></el-button>
							</el-tooltip>
						</div>
						<el-button 
							v-else
							type="text" 
							icon="el-icon-edit"
							size="mini"
							@click="scope.row.edit=!scope.row.edit">编辑
						</el-button>
			    </template>
			  </el-table-column>
			</el-table>
		</el-dialog>
	</div>
</template>

<script>
import { getUserParam } from '@/api/user'
import { getDepartmentParam	} from '@/api/department'
import { fetchAssignee, 
				 saveAssignee, 
				 delAssignee, supplyAssignee } from '@/api/feedBack'
import { getPositionList } from '@/api/position'
export default {
	props: {
		assDialogVisible: {
			type: Boolean
		},
		feedBackData: {
			type: Object
		},
		assDialogStatus: {
			type: String
		}
	},
	name: 'AssigneeDialog',
	data() {
		return {
			showClose: true,
			loading: false,
			visible: false,
			searchDept: '',
			searchUser: '',
			assigneeList: [],
			userParams: [],
			departmentParams: [],
			posParams: []
		}		
	},
	created() {
		this.visible = this.assDialogVisible
	},
	mounted() {
		this.getUserParam()
		this.getDepartmentParams()
		this.getPositionParams()
		const data = this.feedBackData
		if (data.id !== null) {
				this.getList()
			}
	},
	methods: {
		getUserParam() {
			var self = this
			getUserParam().then(res => {
				self.userParams = res.data
			})
		},
		getDepartmentParams() {
			var self = this
			getDepartmentParam().then(res => {
				self.departmentParams = res.data
			})
		},
		getPositionParams() {
			getPositionList().then(response => {
				this.posParams = response.data
			})
		},
		getList() {
			var self = this
			self.loading = true
			let query = {
				feedBackItem: self.feedBackData.id
			}
			fetchAssignee(query).then(res => {
				const items = res.data
				self.assigneeList = items.map(v => {
						self.$set(v, 'subLoading', false)
						self.$set(v, 'edit', false)
						return v
					})
				self.loading = false
			})
		},
		addNewAssignee() {
			var self = this
			let newAssignee = {
				id: null,
				feedBackItem: self.feedBackData.id,
				department: null,
				user: null,
				forbidPos: [],
				edit: true,
				subLoading: false
			}
			self.assigneeList.push(newAssignee)
		},
		supplyAssignees() {
			var self = this
			let data = self.feedBackData
			supplyAssignee(data).then(res => {
				self.$notify({
				  title: '成功',
				  message: res.msg,
				  type: 'success',
				  duration: 6000
				})
				self.getList()
				self.$emit('getList')
			})
		},
		confirmAssignee(data) {
			var self = this
			if (data.department === null) {
				self.$message({
				  message: '未选择分配科室',
				  type: 'warning'
				})
			}else {
				saveAssignee(data).then(res => {
					self.$notify({
					  title: '成功',
					  message: res.msg,
					  type: 'success',
					  duration: 6000
					})
					self.getList()
					self.$emit('getList')
				})
			}
		},
		deleteAssignee(index, data) {
			var self = this
			if (data.id === null || data.id === '') {
				self.assigneeList.splice(index, 1)
			}else {
				let assignee = {
					id: data.id,
					feedBackItem: data.feedBackItem,
					department: data.department,
					user: data.user
				}
				delAssignee(assignee).then(res => {
					self.$notify({
					  title: '删除成功',
					  message: data.deptName,
					  type: 'success',
					  duration: 6000
					})
					self.getList()
					self.$emit('getList')
				})
			}
		},
		closeDialog() {
			this.$emit('getList')
			this.$emit('closeAssigneeDialog')
		}
	}
}
</script>

<style>
</style>
