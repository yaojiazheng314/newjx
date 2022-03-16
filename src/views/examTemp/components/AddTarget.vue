<template>
	<div id="addTarget">
		<el-dialog 
			:title="addTargetDialogStatus" 
			:show-close="showClose"
			:close-on-click-modal="false"
			:visible.sync="addTargetVisible">
			<!-- 输入 指标模糊查询 考核指标 -->
			<el-select
				v-model="targetParams"
				value-key="id"
				multiple
				filterable
				remote
				reserve-keyword
				placeholder="输入考核指标/指标责任科室名称或'全部'查询"
				:remote-method="remoteMethod"
				:loading="remoteLoading"
				size="small"
				class="fuzzyQuery">
				<el-option
					v-for="item in fuzzyQueryTargetParams"
					:key="item.id"
					:label="item.indicator"
					:value="item">
					<el-tooltip 
						:content="'由' + item.deptName + '编辑'" 
						effect="light"
						placement="right">
						<span style="float: left">{{ item.indicator }}</span>
					</el-tooltip>
				</el-option>
			</el-select>
			<!-- 添加选中 -->
			<el-tooltip 
				effect="light" 
				content="添加选中的考核指标" 
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
				content="添加查询的全部科室" 
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
					@click="cleantargetData"
					circle plain></el-button>
			</el-tooltip>
			<!-- 考核指标快速查询 -->
			<el-input
				v-model="searchTarget"
				size="mini"
				placeholder="输入考核指标搜索"
				style="width: 200px; float: right;"/>
			<!-- 指标的考核依据列表 -->
			<el-table
				:data="targetData.filter(data => !searchTarget || data.indicator.toLowerCase().includes(searchTarget.toLowerCase()))"
				style="width: 100%"
				stripe
				height="400">
				<el-table-column
					prop="indicator"
					label="指标"
					width="500">
				</el-table-column>
				<el-table-column
					prop="deptName"
					label="编辑科室">
				</el-table-column>
				<el-table-column
					fixed="right"
					label="操作"
					width="100">
					<template slot-scope="scope">
						<el-button 
							@click="deleteTarget(scope.row)" 
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
					@click="saveExamTempTarget"
					:loading="loading"
					class="guo-btn light-blue-btn">
					保 存
				</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { getTempTarget,
				 fuzzyQueryTargetParam,
				 saveTempTarget} from '@/api/exam'
export default{
	props: {
		addTargetVisible: {
			type: Boolean
		},
		addTargetDialogStatus: {
			type: String
		},
		examTempData: {
			type: Object
		}
	},
	name: 'AddTarget',
	data() {
		return {
			showClose: false,
			loading: false,
			remoteLoading: false,
			searchTarget: '',
			targetParams: [],
			fuzzyQueryTargetParams: [], //模糊查询列表
			targetData: [],
			examTempTarget: {
				temp: null,
				userID: null,
				targets: []
			}
		}
  },
	mounted() {
		this.getOperatorInfo()
		const id = this.examTempData.id
		if (id !== null && id !== '') {
			this.examTempTarget.temp = id
			this.getExamTempTargets(this.examTempTarget)
		}
	},
	methods: {
		//获取操作用户
		getOperatorInfo() {
			var self = this
			self.examTempTarget.userID = self.$store.getters.userID
		},
		saveExamTempTarget() {
			var self = this
			self.loading = true
			const length = self.targetData.length
			for (let i = 0; i < length; i++) {
				const target = self.targetData[i].id
				self.examTempTarget.targets.push(target)
			}
			const data = self.examTempTarget
			saveTempTarget(data).then(response => {
				self.$notify({
				  title: '成功',
				  message: response.msg,
				  type: 'success',
				  duration: 6000
				})
				/* 清空存储的依据重新拉取数据 */
				self.examTempTarget.targets = []
				let param = {
					temp: data.temp
				}
				self.getExamTempTargets(param)
				self.loading = false
				self.$emit('getList')
			})
		},
		getExamTempTargets(param) {
			var self = this
			getTempTarget(param).then(response => {
				self.targetData = response.data
			})
		},
		remoteMethod(query) {
			if (query !== '') {
		    this.remoteLoading = true;
				const search = {
					keyword: query
				}
		    fuzzyQueryTargetParam(search).then(res => {
					this.fuzzyQueryTargetParams = res.data
				})
				this.remoteLoading = false;
		  }else {
		    this.fuzzyQueryTargetParams = [];
		  }
		},
		addChoosenData() {
			var self = this
			let count = 0
			const choosenData = self.targetParams
			for (let i = 0; i < choosenData.length; i++) {
				const data = choosenData[i]
				var isContained = self.containsCode(data)
				if (!isContained) {
					self.targetData.push(data)
					count++
				}
			}
			self.$message({
			  message: "已添加"+count+"条考核指标",
			  type: 'success',
			  duration: 4000,
				showClose: true
			})
			//清空选择列表
			self.targetParams = []
		},
		addAllFuzzyQueryData() {
			var self = this
			let count = 0
			const choosenData = self.fuzzyQueryTargetParams
			for (let i = 0; i < choosenData.length; i++) {
				const data = choosenData[i]
				var isContained = self.containsCode(data)
				if (!isContained) {
					self.targetData.push(data)
					count++
				}
			}
			self.$message({
			  message: "已添加"+count+"条考核依据",
			  type: 'success',
			  duration: 4000,
				showClose: true
			})
		},
		containsCode(item) {
			const paramID = item.id
			const targetArr = this.targetData.map(v => {
				return v.id
			})
			const length = targetArr.length
			for (let i = 0; i < length; i++) {
				if (targetArr[i] === paramID) {
					return true
				} 
			}
			return false
		},
		cleantargetData() {
			this.targetData = []
		},
		deleteTarget(data) {
			const delId = data.id
			let length = this.targetData.length
			for (let i = 0; i < length; i++) {
				const target = this.targetData[i].id
				if (target === delId) {
					this.targetData.splice(i, 1)
					break
				}
			}
			let targetIndicator = data.indicator
			this.$message({
				message: "移除"+targetIndicator,
				type: 'warning',
				duration: 4000,
				showClose: true
			})	
		},
		closeDialog() {
			this.$emit('closeAddTargetDialog')
			this.$emit('getList')
		}
	}
}
</script>
