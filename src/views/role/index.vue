<template>
  <div class="app-container">
    <div class="filter-container">
			<el-button v-waves 
				type="primary" size="mini"
				@click="handleCreate" round>
			创建角色
			</el-button>
    </div>
	  <el-row :gutter="32">
			<el-col :xs="24" :sm="24" :lg="13">
				<el-table
					:data="list"
					v-loading="listLoading"
					stripe
					style="width: 100%">
					<el-table-column
						prop="role"
						label="角色编码"
						width="160">
					</el-table-column>
					<el-table-column
						prop="name"
						label="名称"
						width="160">
					</el-table-column>
					<el-table-column
						prop="userNum"
						label="人数"
						width="180">
					</el-table-column>
					<el-table-column
						prop="information"
						label="描述"
						width="180">
					</el-table-column>
					<el-table-column
						label="操作"
						width="100">
						<template slot-scope="scope">
							<el-button 
								@click="handleEdit(scope.row)" 
								type="text" size="small">
								编辑
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-col>
			<el-col :xs="24" :sm="24" :lg="8">
				<div class="chart-wrapper">
<!-- 					<pie-chart 
						v-if="deliverFlag"
						:pieData="professTitleSeriesData">
					</pie-chart> -->
				</div>
			</el-col>
		</el-row>		
		
		<el-dialog 
			:title="dialogStatus" 
			:show-close="showClose"
			:close-on-click-modal="false"
			:visible.sync="dialogFormVisible">
			<el-form 
				ref="roleForm"
				:rules="rules"
				:model="roleForm"
				:inline="true"
				label-width="80px"
				style="width: 600px; margin-left:50px;">
				<el-form-item label="角色名称" prop="name">
					<el-input v-model.trim="roleForm.name"></el-input>
				</el-form-item>
				<el-form-item label="角色编码" prop="role">
					<el-input v-model.trim="roleForm.role"></el-input>
				</el-form-item>
				<el-form-item label="描述" prop="information" width="200">
					<el-input 
						type="textarea"
						:rows="3"
						placeholder="请输入角色描述"
						v-model.trim="roleForm.information"
						style="width: 468px;">
					</el-input>
				</el-form-item>
				<el-form-item label="权限">
					<el-tree
            ref="routeTree"
						:data="routeTreeData"
						:props="defaultProps"
						show-checkbox
						node-key="permissionId"
						accordion
						highlight-current
          />
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeDialog">返 回</el-button>
				<el-button 
					type="primary" 
					@click="saveRole()">
					确 定
				</el-button>
			</div>
		</el-dialog>
  </div>
</template>

<script>
import { getRoleList, 
				 getRoutesTree, 
				 getRolesPerms,
				 saveRolesPerms } from '@/api/role'
import waves from '@/directive/waves'
// import PieChart from './components/PieChart'
export default {
  name: 'RoleInfo',
  directives: { waves },
  data() {
    return {
      list: null,
      listLoading: false,
			roleForm: {
				roleId: null,
				name: '',
				role: '',
				information: '',
				perms: []
			},
			routeTreeData: [],
			defaultProps: {
			  children: 'children',
			  label: 'name'
			},
			dialogFormVisible: false,
			dialogStatus: '',
			showClose: false,
			rules: {
				name: [
            { required: true, message: '请输入角色名称', trigger: 'blur' },
						{ max: 20, message: '长度在20字符以内', trigger: 'blur' }
          ],
        role: [
            { required: true, message: '请输入职位编码', trigger: 'blur' },
						{ max: 20, message: '长度在20字符以内', trigger: 'blur' }
          ],
				information: [
						{ max: 100, message: '长度在100字符以内', trigger: 'blur' }
					]
			},
			deliverFlag: false,
			roleUserSeriesData: {
				title: '人数统计',
				legend: [],
				seriesData: []
			}
    }
  },
  created() {
    this.getList(),
		this.getRoutes()
  },
  methods: {
    getList() {
			var self = this
      self.listLoading = true
      getRoleList().then(response => {
        self.list = response.data
				self.listLoading = false
// 				response.data.map(((item, index)=> {
// 					self.professTitleSeriesData.seriesData.push({name:item.name, 
// 						value:item.peopleNum})
// 					self.professTitleSeriesData.legend.push(item.name)	
// 				}))
				// self.deliverFlag = true
      })
    },
		getRoutes() {
			var self = this
			getRoutesTree().then(response => {
				self.routeTreeData = response.data
			})
		},
		handleCreate() {
			this.dialogStatus = '创建角色'
			this.dialogFormVisible = true
			this.clearForm()
			// this.flushPie()
		},
		handleEdit(row) {
			var self = this
			self.roleForm = Object.assign({}, row)
			const query = self.roleForm
			self.$nextTick(function() {
				getRolesPerms(query).then(response => {
					const arr = response.data
					self.$refs.routeTree.setCheckedKeys(arr)
				})
			})
			self.dialogStatus = '编辑角色'
			self.dialogFormVisible = true
		},
		saveRole() {
			var self = this
			self.$refs['roleForm'].validate((valid) => {
        if (valid) {
					self.roleForm.perms = self.$refs.routeTree.getCheckedKeys()
					const roleParam = self.roleForm
          saveRolesPerms(roleParam).then(response => {
						self.$notify({
						  title: '成功',
						  message: response.msg,
						  type: 'success',
						  duration: 6000
						})
						if (self.roleForm.roleId === null) {
							//连续创建
							self.clearForm();
							self.$refs['roleForm'].clearValidate();
							self.$refs.routeTree.getCheckedKeys([])
						}
						self.getList()
					})
        } else {
          return false
        }
      })
		},
		closeDialog() {
			this.dialogFormVisible = false
			this.clearForm()
			this.$refs['roleForm'].clearValidate()
			this.getList()
		},
		clearForm() {		
			this.roleForm.name = ''
			this.roleForm.role = ''
			this.roleForm.information = null
			//清空roleForm.roleId
			this.roleForm.roleId = null
			this.roleForm.perms = []
		}
		//刷新图表
// 		flushPie() {
// 			this.deliverFlag = false
// 			this.professTitleSeriesData.legend = []
// 			this.professTitleSeriesData.seriesData = []
// 		}
  },
  
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.chart-wrapper {
  background: #fff;
  padding: 50px 16px 0;
  margin-bottom: 36px;
}

</style>
