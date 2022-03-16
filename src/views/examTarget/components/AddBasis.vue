<template>
	<div id="addBasis">
		<el-dialog 
			:title="addBasisDialogStatus" 
			:show-close="showClose"
			:close-on-click-modal="false"
			:visible.sync="addBasisVisible">
			<!-- 输入 依据别名或依据内容 模糊查询 考核依据 -->
			<el-select
				v-model="basisParams"
				value-key="id"
				multiple
				filterable
				remote
				reserve-keyword
				placeholder="输入考核依据别名/内容或'全部'查询"
				:remote-method="remoteMethod"
				:loading="remoteLoading"
				size="small"
				class="fuzzyQuery">
				<el-option
					v-for="item in fuzzyQueryBasisParams"
					:key="item.id"
					:label="item.name"
					:value="item">
					<el-tooltip 
						:content="item.basis" 
						effect="light"
						placement="right">
						<span style="float: left">{{ item.name }}</span>
					</el-tooltip>
				</el-option>
			</el-select>
			<!-- 添加选中 -->
			<el-tooltip 
				effect="light" 
				content="添加选中的考核依据" 
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
			<!-- 清空考核依据列表 -->
			<el-tooltip 
				effect="light" 
				content="清空" 
				placement="right-start">
				<el-button 
					size="mini" type="warning"
					style="margin-left: 5px;"
					icon="el-icon-delete-solid"
					@click="cleanbasisData"
					circle plain></el-button>
			</el-tooltip>
			<!-- 考核依据别名快速查询 -->
			<el-input
				v-model="searchBasis"
				size="mini"
				placeholder="输入考核依据别名搜索"
				style="width: 200px; float: right;"/>
			<!-- 指标的考核依据列表 -->
			<el-table
				:data="basisData.filter(data => !searchBasis || data.name.toLowerCase().includes(searchBasis.toLowerCase()))"
				style="width: 100%"
				stripe
				height="400">
				<el-table-column
					prop="name"
					label="依据别名"
					width="200">
				</el-table-column>
				<el-table-column
					prop="basis"
					label="依据内容">
				</el-table-column>
				<el-table-column
					fixed="right"
					label="操作"
					width="100">
					<template slot-scope="scope">
						<el-button 
							@click="deleteBasis(scope.row)" 
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
					@click="saveExamTargetBasis"
					:loading="loading"
					class="guo-btn light-blue-btn">
					保 存
				</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { getTargetBasises,
				 fuzzyQueryBasisParam,
				 saveTargetBasis} from '@/api/exam'
export default{
	props: {
		addBasisVisible: {
			type: Boolean
		},
		addBasisDialogStatus: {
			type: String
		},
		examTargetData: {
			type: Object
		}
	},
	name: 'AddBasis',
	data() {
		return {
			showClose: false,
			loading: false,
			remoteLoading: false,
			searchBasis: '',
			basisParams: [],
			fuzzyQueryBasisParams: [], //模糊查询列表
			basisData: [],
			examTargetBasis: {
				target: null,
				userID: null,
				basises: []
			}
		}
  },
	mounted() {
		this.getOperatorInfo()
		const id = this.examTargetData.id
		if (id !== null && id !== '') {
			this.examTargetBasis.target = id
			this.getExamTargetBasises(this.examTargetBasis)
		}
	},
	methods: {
		//获取操作用户
		getOperatorInfo() {
			var self = this
			self.examTargetBasis.userID = self.$store.getters.userID
		},
		saveExamTargetBasis() {
			var self = this
			self.loading = true
			const length = self.basisData.length
			for (let i = 0; i < length; i++) {
				const basis = self.basisData[i].id
				self.examTargetBasis.basises.push(basis)
			}
			const data = self.examTargetBasis
			saveTargetBasis(data).then(response => {
				self.$notify({
				  title: '成功',
				  message: response.msg,
				  type: 'success',
				  duration: 6000
				})
				/* 清空存储的依据重新拉取数据 */
				self.examTargetBasis.basises = []
				let param = {
					target: data.target
				}
				self.getExamTargetBasises(param)
				self.loading = false
				self.$emit('getList')
			})
		},
		getExamTargetBasises(param) {
			var self = this
			getTargetBasises(param).then(response => {
				self.basisData = response.data
			})
		},
		remoteMethod(query) {
			if (query !== '') {
		    this.remoteLoading = true;
				const search = {
					keyword: query
				}
		    fuzzyQueryBasisParam(search).then(res => {
					this.fuzzyQueryBasisParams = res.data
				})
				this.remoteLoading = false;
		  }else {
		    this.fuzzyQueryBasisParams = [];
		  }
		},
		addChoosenData() {
			var self = this
			let count = 0
			const choosenData = self.basisParams
			for (let i = 0; i < choosenData.length; i++) {
				const data = choosenData[i]
				var isContained = self.containsCode(data)
				if (!isContained) {
					self.basisData.push(data)
					count++
				}
			}
			self.$message({
			  message: "已添加"+count+"条考核依据",
			  type: 'success',
			  duration: 4000,
				showClose: true
			})
			//清空选择列表
			self.basisParams = []
		},
		addAllFuzzyQueryData() {
			var self = this
			let count = 0
			const choosenData = self.fuzzyQueryBasisParams
			for (let i = 0; i < choosenData.length; i++) {
				const data = choosenData[i]
				var isContained = self.containsCode(data)
				if (!isContained) {
					self.basisData.push(data)
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
			const basisArr = this.basisData.map(v => {
				return v.id
			})
			const length = basisArr.length
			for (let i = 0; i < length; i++) {
				if (basisArr[i] === paramID) {
					return true
				} 
			}
			return false
		},
		cleanbasisData() {
			this.basisData = []
		},
		deleteBasis(data) {
			const delId = data.id
			let length = this.basisData.length
			for (let i = 0; i < length; i++) {
				const basis = this.basisData[i].id
				if (basis === delId) {
					this.basisData.splice(i, 1)
					break
				}
			}
			let basisName = data.name
			this.$message({
				message: "移除"+basisName,
				type: 'warning',
				duration: 4000,
				showClose: true
			})	
		},
		closeDialog() {
			this.$emit('closeAddBasisDialog')
			this.$emit('getList')
		}
	}
}
</script>
