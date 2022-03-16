<template>
  <div class="app-container">
		<el-container>
			<el-aside width="380px">
				<el-input 
					v-model="filterText" 
					placeholder="输入目标名称(代码)" 
					style="margin-bottom:30px; width: 300px;" 
					clearable
					class="searchClass"/>
				<el-scrollbar>
					<el-tree
						ref="bigAimTree"
						:data="aimTree"
						:props="defaultProps"
						:filter-node-method="filterNode"
						node-key="id"
						default-expand-all
						highlight-current
						:expand-on-click-node="false"
						style="height: 680px;">
						<span class="custom-tree-node" slot-scope="{ node, data }">
							<span @click="searchAimInfo(data)">
								{{ node.label }}</span>
						</span>
					</el-tree>
				</el-scrollbar>
			</el-aside>
			<el-main>
				<!-- 默认显示区 -->
				<div v-show="!formVisible">
					<span>待定</span>
				</div>
				<!-- 目标基础信息 -->
				<transition name="rotateDownLeft">
					<aim-config-info
						ref="formInfo"
						v-if="formStatus"
						:formVisible="formVisible"
						:aimConfigData="aimConfigData"
						@closeform="closeform">
					</aim-config-info>
				</transition>
			</el-main>
			<!-- 创建科室 -->
			<department-add-dialog
				v-if="addStatus"
				:dialogFormVisible="dialogFormVisible"
				@closedialog="closedialog"
				@fetchaimTree="fetchaimTree">
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
import { getAimTree } from '@/api/aim'
import BackToTop from '@/components/BackToTop'
import waves from '@/directive/waves'
import waitGif from '@/assets/gif/mykita_11.gif'
import AimConfigInfo from './components/AimConfigInfo'
// import DepartmentInfoForm from './components/DepartmentInfoForm'
// import keyboard from './components/keyboard'
export default {
	components: { BackToTop, AimConfigInfo },
	directives: { waves },
  data() {
    return {
      filterText: '',
			filterType: '',
			waitGif: waitGif + '?' + +new Date(),
      aimTree: [],
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
			aimConfigData: {},
			formLabelWidth: '120px'
    }
  },
	created: function () {
    this.fetchAimTree()
  },
  watch: {
    filterText(val) {
      this.$refs.bigAimTree.filter(val)
		}
	},
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
		fetchAimTree() {
			getAimTree().then(response => {
				this.aimTree = response.data
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
			this.aimConfigData = {}
		},
		searchAimInfo(data) {
			this.formStatus = false
			this.formVisible = false
			//传递新数据
			this.aimConfigData = Object.assign({}, data)
			this.$nextTick(() => {
			 	this.formStatus = true
			 	this.formVisible = true
			})
		}
  }
}
</script>
<style>
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 15px;
    padding-right: 8px;
		margin-top: 0px;
}
</style>
