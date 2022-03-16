<template>
	<div id="addPositions">
		<el-dialog 
			:title="addPosDialogStatus" 
			:show-close="showClose"
			:close-on-click-modal="false"
			:visible.sync="addPosVisible"
			width="850px">
			<guo-transfer 
				style="margin: auto; width: 810px;"
				v-model="checkedKeys"
				:data="positionParams"
				:props="defaultProps"
				filterable
				filter-placeholder="输入职位名称"
				:titles="['备选', '特定职位']"
				:button-texts="['移除', '添加']"
				:format="checkedNum"
        :isShowRightInput="true">
			</guo-transfer>
			<div slot="footer" class="dialog-footer">
				<el-select v-model="runYearMonth" placeholder="请选择">
					<el-option
					v-for="item in runYearMonthList"
					:key="item"
					:label="item"
					:value="item">
					</el-option>
				</el-select>
				<el-button 
					@click="closeDialog"
					class="guo-btn yellow-btn">
					返 回
				</el-button>
				<el-button 
					type="primary"
					@click="saveCoefPosition"
					:loading="loading"
					class="guo-btn light-blue-btn">
					保 存
				</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { savePositions, getPositions, getCoefPositionParam } from '@/api/bnsCoef'
import GuoTransfer from '@/components/GuoTransfer/main'
export default{
	components: { GuoTransfer },
	props: {
		addPosVisible: {
			type: Boolean
		},
		addPosDialogStatus: {
			type: String
		},
		coefData: {
			type: Object
		},
		runYearMonthList: {
			type: Array
		}
	},
	name: 'AddPositions',
	data() {
		return {
			showClose: false,
			loading: false,
			positionParams: [],
			defaultProps: {
				key: 'position',
				label: 'positionName',
				label2: 'peopleNumTip',
				value: 'value'
			},
			checkedNum: {
				noChecked: '${total}',
				hasChecked: '${checked}/${total}'
			},
			checkedKeys: [],
			coefPosition: {
				coef: null,
				position: []
			},
			runYearMonth: ''

		}
  },
	mounted() {
		const id = this.coefData.id
		if (id !== null && id !== '') {
			this.coefPosition.coef = id
			this.getCoefPositions(this.coefPosition)
		}
		this.getPositionParams(this.coefPosition)
	},
	methods: {
		saveCoefPosition() {
			var self = this
			const runYearMonth = self.runYearMonth
			if(!runYearMonth)
			{
				self.$notify({
					  title: '缺少必填',
					  message: '请选择核算年度',
					  type: 'error',
					  duration: 2000
					})
				return false
			}
			self.loading = true
			self.addToCoefPositions()
			let data = self.coefPosition
			data.runYearMonth = runYearMonth
			savePositions(data).then(response => {
				let resultStatus = response.status
				if (resultStatus === 520) {
					self.loading = false
					self.$confirm(response.msg, '提示', {
						type: 'warning',
						center: true
					}).then(() => {
						self.$message({
							type: 'info',
							message: '稍候重试'
						})
					}).catch(() => {
						self.$message({
							type: 'info',
							message: '稍候重试'
						})
					})
				}else {
					self.$notify({
					  title: '成功',
					  message: response.msg,
					  type: 'success',
					  duration: 6000
					})
					self.loading = false
					self.$emit('getList')
				}
			})
		},
		addToCoefPositions() {
			const key = this.defaultProps.key;
			//清空缓存position
			this.coefPosition.position = [];
			this.positionParams.forEach(item => {
			  const itemKey = item[key];
			  if (
			    this.checkedKeys.indexOf(itemKey) > -1 
			  ) {
			    this.coefPosition.position.push(item);
			  }
			});
		},
		getCoefPositions(data) {
			var self = this
			getPositions(data).then(response => {
				self.checkedKeys = response.data
			})
		},
		getPositionParams(data) {
			var self = this
			getCoefPositionParam(data).then(response => {
				self.positionParams = response.data
			})
		},
		closeDialog() {
			this.$emit('closeAddPosDialog')
			this.$emit('getList')
			this.$emit('getCoefParams')
		}
	}
}
</script>
