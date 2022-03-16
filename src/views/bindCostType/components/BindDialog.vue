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
				content="添加绑定HIS收费分类" placement="top">
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
							v-model="scope.row.hospId" 
							filterable 
							placeholder="请选择分配院属">
							<el-option
								v-for="item in hospNoParams"
								:key="item.id"
								:label="item.name"
								:value="item.id">
							</el-option>
						</el-select>
						<span v-else>{{ scope.row.hospName }}</span>
					</template>
				</el-table-column>
			   <el-table-column label="接口成本分类">
			    <template slot-scope="scope">
			      <el-select 
							v-if="scope.row.edit"
			      	v-model="scope.row.itfId" 
							filterable 
			      	placeholder="请选择成本分类">
			      	<el-option
			      		v-for="item in hisTypeParams"
			      		:key="item.id"
			      		:label="item.name"
			      		:value="item.id">
								<span style="float: left">{{ item.name }}</span>
								<span 
									style="float: right; color: #8492a6; font-size: 13px">
									{{ item.hospName }}</span>
			      	</el-option>
			      </el-select>
						<span v-else>{{ scope.row.itfName }}</span>
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
							@click="scope.row.edit=!scope.row.edit">编辑
						</el-button>
			    </template>
			  </el-table-column>
			</el-table>
		</el-dialog>
	</div>
</template>

<script>

import { getHospitalInfo } from '@/api/hospital'
import { fetchBindCostList,fetchItfCostList,saveBaseItfCostype,delSelectedCostData } from '@/api/binding'

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
			
			assigneeList: [],
			hisTypeParams: [],
			hospNoParams: []
		}		
	},
	created() {
		this.visible = this.assDialogVisible
	},
	mounted() {
		this.getHisTypeParam()
		this.getHospNoParams()
		//this.getPositionParams()
		const data = this.feedBackData

		if (data.id !== null) {
				this.getList()
			}
	},
	methods: {
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
				chargeTypeId: self.feedBackData.id
			}
			fetchBindCostList(query).then(res => {
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
				baseId: self.feedBackData.id,
				hospId: null,
				itfId:null,
				edit: true,
				subLoading: false
			}
			self.assigneeList.push(newAssignee)
		},
		
		confirmAssignee(data) {
			var self = this
		
			if(data.id != data.baseId){
				data.baseId = self.feedBackData.id;
			}
			console.log(data);
			if (data.hospId === null) {
				self.$message({
				  message: '未选择分配院属',
				  type: 'warning'
				})
			}else if(data.itfId === null){
				self.$message({
				  message: '请选成本分类',
				  type: 'warning'
				})
			} else {
				saveBaseItfCostype(data).then(res => {
					
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
			
			var self = this
			if (data.id === null || data.id === '') {
				self.assigneeList.splice(index, 1)
			}else {
				let assignee = {
					id: data.id,
					baseChargeId: data.baseCostId,
					itfChargeId: data.itfCostId
				}
				delSelectedCostData(assignee).then(res => {
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
		}
	}
}
</script>

<style>
</style>
