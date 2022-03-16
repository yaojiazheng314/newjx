<template>
  <div class="app-container">
		<div class="filter-container">
			<el-input
				v-model="searchDR"
				size="small"
				placeholder="输入科室名称搜索"
				style="width: 200px;"/>
			<el-divider direction="vertical"></el-divider>
			<el-popover
				placement="right"
				width="400"
				trigger="click">
				<el-date-picker
					v-model="copyYearmonth"
					type="month"
					placeholder="选择月"
					format="yyyy 年 M 月"
					value-format="yyyy-MM"
					:clearable="false"
					:editable="false">
				</el-date-picker>
				<el-button 
					v-waves
					type="primary" 
					size="mini"
					style="margin-left: 10px;"
					icon="el-icon-connection"
					@click="copyData"> 拷贝</el-button>
				<el-button 
					slot="reference"
					v-waves
					type="primary" 
					size="mini"
					plain> 数据拷贝</el-button>
			</el-popover>
			<el-tag
				type="info"> 
					填报总值：{{ fillDataSumVal }}</el-tag>
			<ItemInfoTip :handleItem="handleFillItem" />
		</div>
		<el-table 
			:data="list.filter(data => !searchDR || data.deptName.toLowerCase().includes(searchDR.toLowerCase()))" 
			v-loading="listLoading" stripe style="width: 100%"
      height="650" useVirtual>
			<el-table-column prop="deptCode" align="center" label="编码" />
			<el-table-column prop="deptName" align="center" label="科室" />
			<el-table-column 
				prop="deptType" align="center" label="类型" 
				:filters="[{ text: '项目', value: '项目' },
									 { text: '科室', value: '科室' },
									 { text: '主任组', value: '主任组' },
									 { text: '治疗组', value: '治疗组' },
									 { text: '护理组', value: '护理组' }]"
			  :filter-method="filterType" filter-placement="bottom-end">
				<template slot-scope="scope">
					<el-tag 
						:hit="true" 
						disable-transitions>{{ scope.row.deptType }}</el-tag>
				</template>
			</el-table-column>
			<el-table-column 
				prop="deptCategory" align="center" label="类别" 
				:filters="[{ text: '门诊', value: '门诊' },
									 { text: '住院', value: '住院' },
									 { text: '医技', value: '医技' },
									 { text: '行政', value: '行政' },
									 { text: '门诊住院', value: '门诊住院' },
									 { text: '其他', value: '其他' }]"
			  :filter-method="filterCategory" filter-placement="bottom-end">
				<template slot-scope="scope">
					<el-tag 
						:type="'warning'" 
						disable-transitions>{{ scope.row.deptCategory }}</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="val" align="center" label="填报值">
				<template slot-scope="scope">
					<el-input-number 
						v-if="scope.row.edit"
						v-loading="scope.row.subLoading"
						v-model="scope.row.val"
						controls-position="right"
						placeholder="未填报"
						size="mini"
						style="width: 200px;"
						></el-input-number>
					<span v-else>{{ scope.row.val }}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="操作" width="240">
				<template slot-scope="scope">
					<div v-if="scope.row.edit">
						<el-tooltip
							effect="dark" 
							content="提交" placement="left">
							<el-button 
								type="success" 
								icon="el-icon-check"
								size="mini"
								:loading="scope.row.subLoading"
								@click="submitItemDeptValue(scope.row)"
								plain
								circle></el-button>
						</el-tooltip>
						<el-tooltip
							effect="dark" 
							content="删除" placement="right">
							<el-button 
								type="danger" 
								icon="el-icon-delete" 
								size="mini"
								@click="delItemDeptValue(scope.row)"
								plain
								circle></el-button>
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
		
		<el-tooltip placement="top" content="重返巅峰">
			<back-to-top 
				:visibility-height="50" 
				:back-position="0" 
				transition-name="fade"/>
		</el-tooltip>
	</div>
</template>

<script>
import ItemInfoTip from './ItemInfoTip'
import { getHandleItemDeptData,
				 saveDeptItemReport,
				 copyDeptReportData,
				 delDeptItemReport } from '@/api/bnsDataItemReport'
import { formatDate } from '@/utils/date'
import waves from '@/directive/waves'
import BackToTop from '@/components/BackToTop'
export default {
  name: 'HandleFill',
	directives: { waves },
  components: { ItemInfoTip, BackToTop },
  props: {
    isFill: {
      type: Boolean,
      default: false
    }
  },
	data() {
		return {
			handleFillItem: {
				itemID: null,
				itemName: '',
				yearmonth: '',
				type: '',
				userID: null
			},
			searchDR: '',
			list: [],
			listLoading: false,
			copyYearmonth: '',
			fillDataSumVal: 0 //填报总计
		}
	},
  created() {
    if (this.isFill) {
      this.handleFillItem.itemID = this.$route.query.itemID
			this.handleFillItem.itemName = this.$route.query.itemName
			this.handleFillItem.yearmonth = this.$route.query.ym
			this.handleFillItem.type = this.$route.query.type
			this.getResUserInfo()
      this.fetchData()
			this.setDefaultCopyYearmonth()
    }
  },
  methods: {
		setDefaultCopyYearmonth() {
			var self = this
			const month = new Date().getMonth() - 2 //核算月的上一月
			var defYearmonth = new Date(new Date().setMonth(month, 1))
			const ymStr = formatDate(defYearmonth, 'yyyy-MM')
			self.copyYearmonth = ymStr
		},
		getResUserInfo() {
			var self = this
			self.handleFillItem.userID = self.$store.getters.userID
		},
    fetchData() {
      var self = this
			self.listLoading = true
			var query = self.handleFillItem
			getHandleItemDeptData(query).then(response => {
				const items = response.data
				self.list = items.map(v => {
					self.$set(v, 'subLoading', false)
					self.$set(v, 'edit', false)
					return v
				})
				self.calcSumVal(items)
				self.listLoading = false
			})
    },
		//填报值求和
		calcSumVal(data) {
			var self = this
			self.fillDataSumVal = 0
			var sumVal = 0
			const length = data.length
			for (let i = 0; i < length; i++) {
				let fillVal = data[i].val
				let calcVal = self.formateNum(fillVal)
				sumVal += calcVal
			}
			self.fillDataSumVal = sumVal.toFixed(2)
		},
		//校正number格式
		formateNum(numStr) {
			const num = numStr == null || numStr == '' ? 0: parseFloat(numStr)
			return num
		},
		filterType(value, row) {
			return row.deptType === value
		},
		filterCategory(value, row) {
			return row.deptCategory === value
		},
		submitItemDeptValue(data) {
			var self = this
			if (data.val === null || data.val === '') {
				self.$message({
				  message: data.deptName + "提交的填报值不能为空或非数字格式",
				  type: 'error',
				  duration: 6000,
					showClose: true
				})
				return
			}else {
				const bnsDataItemReport = {
					id: data.reportID,
					yearmonth: data.yearmonth,
					bnsDataItem: data.bnsDataItem,
					department: data.department,
					value: data.val,
					operator: self.handleFillItem.userID
				}
				data.subLoading = true
				saveDeptItemReport(bnsDataItemReport).then(response => {
					let resultStatus = response.status
					if (resultStatus === 520) {
						data.subLoading = false
						self.$confirm(response.msg, '提示', {
							type: 'warning',
							center: true
						}).then(() => {
							self.$message({
								type: 'info',
								message: '稍候重试'
							})
						}).catch(() => {
							this.$message({
								self: 'info',
								message: '稍候重试'
							})
						})
					}else {
						self.$notify({
						  title: '成功',
						  message: '保存成功',
						  type: 'success',
						  duration: 6000
						})
						data.subLoading = true
						self.fetchData()
					}
				})
			}
		},
		delItemDeptValue(data) {
			var self = this
			if (data.val === null || data.val === '') {
				self.$message({
				  message: "没有填报值不必删除，如果你不想看见"+data.deptName+"可以在因子关联科室中把它去除。",
				  type: 'error',
				  duration: 6000,
					showClose: true
				})
				return
			}else {
				const bnsDataItemReport = {
					id: data.reportID,
					yearmonth: data.yearmonth,
					bnsDataItem: data.bnsDataItem,
					department: data.department,
					value: data.val,
					operator: self.handleFillItem.userID
				}
				data.subLoading = true
				delDeptItemReport(bnsDataItemReport).then(response => {
					let resultStatus = response.status
					if (resultStatus === 520) {
						data.subLoading = false
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
						  title: '删除成功',
						  type: 'success',
						  duration: 6000
						})
						data.subLoading = false
						self.fetchData()
					}
				})
			}
		},
		copyData() {
			var self = this
			const text = '正在拷贝'+self.handleFillItem.itemName+self.copyYearmonth+'的数据，请稍候'
			const loading = self.$loading({
			  lock: true,
			  text: text,
			  spinner: 'el-icon-loading',
			  background: 'rgba(0, 0, 0, 0.7)'
			})
			const copyParam = {
				bnsDataItem: self.handleFillItem.itemID,
				copyYearmonth: self.copyYearmonth,
				yearmonth: self.handleFillItem.yearmonth,
				type: 'department',
				operator: self.handleFillItem.userID
			}
			copyDeptReportData(copyParam).then(res => {
				let resultStatus = res.status
				if (resultStatus === 520) {
					loading.close()
					self.$confirm(res.msg, '提示', {
						type: 'warning',
						center: true
					}).then(() => {
						self.$message({
							type: 'warning',
							message: '稍候重试'
						})
					}).catch(() => {
						self.$message({
							type: 'warning',
							message: '稍候重试'
						})
					})
				}else {
					const ym = self.handleFillItem.yearmonth
					const itemName = self.handleFillItem.itemName
					self.$notify({
					  title: ym + ' ' + itemName + '已拷贝完成',
					  type: 'success',
					  duration: 6000
					})
					self.fetchData()
					loading.close()
				}
			})
		}
  }
}
</script>

