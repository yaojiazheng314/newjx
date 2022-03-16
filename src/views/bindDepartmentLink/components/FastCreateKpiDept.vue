<template>
	<div id="assigneeDialog">
		<el-dialog 
			:title="assDialogStatus" 
			:show-close="showClose"
			:close-on-click-modal="false"
			:visible.sync="visible"
			@close="closeDialog">
			
			
			<el-tooltip 
				class="item" effect="dark" 
				content="添加绑定接口科室" placement="top">
				<el-button 
					type="primary" 
					icon="el-icon-plus" size="mini" 
					@click="addNewAssignee" 
					plain circle>
				</el-button>
			</el-tooltip>
				
			<el-table 
				:loading="loading" 
				:data="assigneeList" 
				fit stripe highlight-current-row style="width: 100%"
        height="450" useVirtual>
				<el-table-column label="分配院属">

				<template slot-scope="scope">
						<el-select 
							v-if="scope.row.edit"
							v-model="scope.row.hospno" 
							filterable 
							placeholder="请选择分配院属">
							<el-option
								v-for="item in hospParams"
								:key="item.hospNo"
								:label="item.name"
								:value="item.hospNo">
							</el-option>
						</el-select>
						<span v-else>{{ scope.row.hospName }}</span>
					</template>

				</el-table-column>
				<el-table-column label="门诊住院分类">
					<template slot-scope="scope">
						<el-select 
							v-if="scope.row.edit"
							v-model="scope.row.mzbs" 
							filterable 
							placeholder="请选择门诊住院分类">
							<el-option
								v-for="item in mzList"
								:key="item.name"
								:label="item.name"
								:value="item.name">
							</el-option>
						</el-select>
						<span v-else>{{ scope.row.mzbs }}</span>
					</template>
				</el-table-column>
				<el-table-column label="接口科室来源"					
					>
					 <template slot-scope="scope">
			      <el-select 
							v-if="scope.row.edit"
							 @change="selectLocalSelectConfig(scope.row)"
			      	v-model="scope.row.syslb" 
							clearable 
			      	placeholder="请选择接口科室来源">
			      	<el-option 
							v-for="item in syslbParams" 
							:key="item.value" 
							:label="item.value" 
							:value="item.value">
							
					</el-option>
			      </el-select>
				  <span v-else>{{ scope.row.syslb }}</span>
			    </template>
				</el-table-column>
			   <el-table-column label="接口科室">
			    <template slot-scope="scope">
			      <el-select 
							v-if="scope.row.edit"
			      	v-model="scope.row.itfdeptId" 
					 
							filterable 
			      	placeholder="请选择接口科室">
			      	<el-option 
							v-for="item in departmentParams" 
							:key="item.id" 
							:label="item.name + '_' + item.syslb" 
							:value="item.id">
							<span style="float: left">{{ item.name }}</span>
							<span style="float: right; color: #8492a6; font-size: 13px">
								{{ item.syslb }}
							</span>
						</el-option>
			      </el-select>
				  <span v-else>{{ scope.row.itfDepartmentName }}</span>
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
									@click="delData(scope.$index, scope.row)"
									plain circle></el-button>
							</el-tooltip>
						</div>
						<el-button 
							v-else
							type="text" 
							icon="el-icon-edit"
							size="mini"
							@click="scope.row.edit=!scope.row.edit,selectLocalSelectConfig(scope.row)">编辑
						</el-button>
			    </template>
			  </el-table-column>
			</el-table>
		</el-dialog>
	</div>
</template>

<script>

import { getHospitalInfo } from '@/api/hospital'
import { fetchDeptLinkListById,saveBaseItfDept,delSelectedBaseItfDeptData } from '@/api/binding'
import { getHisDepartmentParamAll	} from '@/api/hisDepartment'
export default {
	props: {
		assDialogVisible: {
			type: Boolean
		},
		feedBackData: {
			type: Object
        },
        // departmentParams: {
		// 	type: Array
		// },
		syslbParams:{
			type: Array
		},
		hospParams:{
			type: Array
		},
		mzList:{
			type: Array
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
			departmentParams:[],
			assigneeList: [],
			hisDeptParams: []
		}
		
	},
	created() {
		this.visible = this.assDialogVisible
	},
	mounted() {
		// this.getHisTypeParam()
		// this.getHospNoParams()
		//this.getPositionParams()
		this.getDepartmentParams()
		const data = this.feedBackData

		if (data.id !== null) {
				this.getList()
			}
	},
	methods: {

		selectLocalSelectConfig(data){
			// if(!data.edit){
			// 	data.itfdeptId = null
			// }
			// data.itfdeptId = null
			let query = {
				syslb: data.syslb
			}
			getHisDepartmentParamAll(query).then(response => {
					this.departmentParams = response.data
				})
		},
		getHisTypeParam() {
			var self = this
			fetchItfCostList().then(res => {
				self.hisTypeParams = res.data
			})
		},
		getHospNoParams() {
			var self = this
			getHospitalInfo().then(res => {
				self.hospNoParams = res.data
			})
		},
		
		getList() {
            
			var self = this
			self.loading = true
			let query = {
				id: self.feedBackData.id
			}
			fetchDeptLinkListById(query).then(res => {
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
				baseDepartment: self.feedBackData.id,
				itfdeptId: null,
				edit: true,
				hospno:null,
				subLoading: false
			}
			self.assigneeList.push(newAssignee)
		},
		
		confirmAssignee(data) {
			var self = this
			// console.log(data)
			if (data.itfdeptId === null) {
				self.$message({
				  message: '未选择科室',
				  type: 'warning'
				})
			}else {
				saveBaseItfDept(data).then(res => {
					
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
		delData(index, data) {
			// console.log(data)
			var self = this
			if (data.id === null || data.id === '') {
				self.assigneeList.splice(index, 1)
			}else {
				let assignee = {
					id: data.id
				}
				delSelectedBaseItfDeptData(data).then(res => {
					self.$notify({
					  title: '删除成功',
					  message: data.itfName,
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
		},
		getDepartmentParams() {
			let query = {
				syslb: null
			}
				getHisDepartmentParamAll(query).then(response => {
					this.departmentParams = response.data
				})
			}
	}
}
</script>

<style>
</style>
