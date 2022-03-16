<template>
  <div class="app-container">
		<el-container>
			<el-aside width="280px">
				<el-input 
					v-model="filterText" 
					placeholder="输入科室名称" 
					style="margin-bottom:30px; width: 200px;" 
					clearable
					class="searchClass"/>
				<el-tooltip 
					class="item" 
					effect="dark" 
					content="新建科室" 
					placement="bottom">
					<el-button 
						v-waves
						type="primary" 
						size="mini" 
						icon="el-icon-edit"
						@click="handleCreate"
						circle>
					</el-button>
				</el-tooltip>
				<el-tooltip 
					class="item" 
					effect="dark" 
					content="拖拽调整科室树后,点击此处保存" 
					placement="bottom">
					<el-button 
						v-waves
						type="info" 
						size="mini" 
						icon="el-icon-sort"
						@click="handleRestructure"
						circle>
					</el-button>
				</el-tooltip>
				<el-scrollbar>
					<el-tree
						ref="tree2"
						:data="departmentTree"
						:props="defaultProps"
						:filter-node-method="filterNode"
						node-key="id"
						default-expand-all
						highlight-current
						draggable
						:expand-on-click-node="false"
						style="height: 680px;">
						<span class="custom-tree-node" slot-scope="{ node, data }">
							<span @click="editDepartmentInfo(data)">{{ node.label }}</span>
						</span>
					</el-tree>
				</el-scrollbar>
			</el-aside>
			<el-main>
				<div v-show="!formVisible">
					<keyboard></keyboard>
				</div>
				<!-- 科室明细 -->
				<transition name="rotateDownLeft">
					<department-info-form
						ref="formInfo"
						v-if="formStatus"
						:formVisible="formVisible"
						:dataForm="dataForm"
						@fetchDepartmentTree="fetchDepartmentTree"
						@closeform="closeform">
					</department-info-form>
				</transition>
			</el-main>
			<!-- 创建科室 -->
			<department-add-dialog
				v-if="addStatus"
				:dialogFormVisible="dialogFormVisible"
				@closedialog="closedialog"
				@fetchDepartmentTree="fetchDepartmentTree">
			</department-add-dialog>
			
			<el-tooltip placement="top" content="重返巅峰">
				<back-to-top 
					:visibility-height="50" 
					:back-position="0" 
					transition-name="fade"/>
			</el-tooltip>
		</el-container>
  </div>
</template>

<script>
import { getDepartmentTree, adjustDepartmentStructure } from '@/api/department'
import BackToTop from '@/components/BackToTop'
import waves from '@/directive/waves'
import waitGif from '@/assets/gif/mykita_11.gif'
import DepartmentAddDialog from './components/DepartmentAddDialog'
import DepartmentInfoForm from './components/DepartmentInfoForm'
import keyboard from './components/keyboard'
export default {
	components: { BackToTop, 
								DepartmentAddDialog, 
								DepartmentInfoForm,
								keyboard },
	directives: { waves },
  data() {
    return {
      filterText: '',
			filterType: '',
			waitGif: waitGif + '?' + +new Date(),
      departmentTree: [],
			department: {
				name: '',
				type: ''
			},
      defaultProps: {
        children: 'children',
        label: 'name',
				status: 'status'
      },
			addStatus: false,
			dialogFormVisible: false,
			formStatus: false,
			formVisible: false,
			dataForm: {},
			formLabelWidth: '120px'
    }
  },
	created: function () {
    this.fetchDepartmentTree()
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
		}
	},

  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
		fetchDepartmentTree() {
			getDepartmentTree().then(response => {
				this.departmentTree = response.data
			})
		},
		handleRestructure() {
			var self = this
			let data = self.departmentTree
			adjustDepartmentStructure(data).then(response => {
				self.$notify({
				  title: '成功',
				  message: response.msg,
				  type: 'success',
					position: 'top-left',
				  duration: 3000
				})
				self.fetchDepartmentTree()
				if (self.formStatus === true) {
					self.closeform()
				}
			})
		},
		handleCreate() {
			this.addStatus = true
			this.dialogFormVisible = true
		},
		closedialog() {
			this.addStatus = false
			this.dialogFormVisible = false
		},
		closeform() {
			this.formStatus = false
			this.formVisible = false
			this.dataForm = {}
		},
		editDepartmentInfo(data) {
			//传递新数据
			this.dataForm = Object.assign({}, data)
			this.formStatus = true
			this.formVisible = true
		}
  }
}
</script>
<style>
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content:  flex-start;
    font-size: 15px;
    padding-right: 8px;
		margin-top: 0px;
}
</style>
