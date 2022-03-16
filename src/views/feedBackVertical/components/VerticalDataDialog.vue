<template>
	<div id="verticalDataDialog">
		<el-dialog
			:title="dialogStatus"
			:show-close="showClose"
			:close-on-click-modal="false"
			:visible.sync="visible"
			@close="closeDialog">
			<el-input
				v-model="searchDept"
				size="mini"
				placeholder="输入科室名称搜索"
				style="width: 180px;"/>
			<count-to
			  :start-val="0"
			  :end-val="feedBackVal"
			  :duration="2000"
			  :separator="','"
				prefix="分配值: "
			  :autoplay="true"
				class="calcVal feedBackVal"/>
			<count-to
			  :start-val="0"
			  :end-val="fillVal"
			  :duration="2000"
			  :separator="','"
				prefix="已填报: "
			  :autoplay="true"
				class="calcVal fillVal"/>
			<count-to
			  :start-val="0"
			  :end-val="restVal"
			  :duration="2000"
			  :separator="','"
				prefix="剩余: "
			  :autoplay="true"
				class="calcVal restVal"/>
			<feed-back-info-tip
				:feedBackData="feedBackData" />
			<el-table
				v-loading="loading"
				:data="verticalDataList.filter(data => !searchDept || data.departmentName.toLowerCase().includes(searchDept.toLowerCase()))"
				fit highlight-current-row style="width: 100%"
				height="450" useVirtual>
				<el-table-column prop="departmentName" label="分配科室">
				</el-table-column>
			  <el-table-column label="分配值">
			    <template slot-scope="scope">
			      <el-input
			      	v-loading="scope.row.subLoading"
			      	v-model.number="scope.row.val"
			      	placeholder="未填报"
			      	:max="999999999"
			      	size="mini"
			      	style="width: 200px;"
			      	type="number"
			      	clearable
			      	@change="checkNum(scope.row)">
			      </el-input>
			    </template>
			  </el-table-column>
			  <el-table-column align="center" label="操作" with="100">
			    <template slot-scope="scope">
						<el-tooltip
							class="item" effect="dark"
							content="确认" placement="left">
							<el-button
								type="success" size="mini"
								icon="el-icon-check"
								@click="submitVerticalData(scope.row)"
								plain circle>
							</el-button>
						</el-tooltip>
						<el-tooltip
							class="item" effect="dark"
							content="删除" placement="right">
							<el-button
								type="danger" icon="el-icon-delete-solid"
								size="mini"
								@click="deleteVerticalData(scope.$index, scope.row)"
								plain circle></el-button>
						</el-tooltip>
			    </template>
			  </el-table-column>
			</el-table>
		</el-dialog>
	</div>
</template>

<script>
import { getUserParam } from '@/api/user'
import { getDepartmentParam	} from '@/api/department'
import { getVerticalData,
				 saveVerticalData,
				 deleteVD } from '@/api/feedBack'
import { getPositionList } from '@/api/position'
import FeedBackInfoTip from './FeedBackInfoTip'
import countTo from 'vue-count-to'
export default {
	props: {
		dialogVisible: {
			type: Boolean
		},
		feedBackData: {
			type: Object
		},
		dialogStatus: {
			type: String
		}
	},
	name: 'VerticalDataDialog',
	components: { countTo, FeedBackInfoTip },
	data() {
		return {
			showClose: true,
			feedBackVal: 0,
			fillVal: 0,
			restVal: 0,
			yearmonth: '',
			loading: false,
			visible: false,
			searchDept: '',
			verticalDataList: [],
			feedBackItemForm: {
				id: null,
				name: '',
				status: '启用',
				termType: '公式',
				term: null,
				vertical: '否',
				verticalDept: null
			}
		}
	},
	created() {
		this.visible = this.dialogVisible
		this.feedBackVal = this.feedBackData.sumVal
	},
	mounted() {
		const data = this.feedBackData
		if (data.id !== null) {
				this.getList()
			}
	},
	methods: {
		getList() {
			var self = this
			self.loading = true
			let query = {
				feedBackItem: self.feedBackData.feedBackItem,
				yearmonth: self.feedBackData.yearmonth
			}
			getVerticalData(query).then(res => {
				self.verticalDataList = res.data
				self.updateFillVal()
				self.loading = false
			})
		},
		submitVerticalData(data) {
			var self = this
			if (data.val === null) {
				self.$message({
				  message: '未填报分配值',
				  type: 'warning'
				})
			}else {
				let verticalData = {
					id: data.id,
					feedBackItem: data.feedBackItem,
					yearmonth: data.yearmonth,
					department: data.department,
					val: data.val,
					operator: self.$store.getters.userID
				}
				saveVerticalData(verticalData).then(res => {
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
		deleteVerticalData(index, data) {
			var self = this
			if (data.val === null || data.val === '') {
				self.$message({
				  message: "没有填报值不必删除，如果你不想看见"+data.departmentName+"可以联络分配项负责人把它去除。",
				  type: 'error',
				  duration: 6000,
					showClose: true
				})
				return
			}else if (data.id === null || data.id === '') {
				self.$message({
				  message: "填报值未确认无法删除",
				  type: 'error',
				  duration: 6000,
					showClose: true
				})
				return
			}else {
				let verticalData = {
					id: data.id,
					feedBackItem: data.feedBackItem,
					yearmonth: data.yearmonth,
					department: data.department,
					val: data.val,
					operator: data.user
				}
				deleteVD(verticalData).then(res => {
					self.$notify({
					  title: '删除成功',
					  message: res.msg,
					  type: 'success',
					  duration: 6000
					})
					self.getList()
					self.$emit('getList')
				})
			}
		},
		checkNum(o) {
			if (o.val === null || o.val === '') {
				this.updateFillVal()
				return o.val = null
			}
			this.updateFillVal()
		},
		updateFillVal() {
			var self = this
			self.fillVal = 0
			let list = self.verticalDataList
			list.map(v => {
				if (v.val === null) {
					self.fillVal += 0
				} else{
					self.fillVal += v.val
				}
				self.restVal = self.feedBackVal - self.fillVal
			})
			if (self.fillVal > self.feedBackVal) {
				self.$message({
				  message: "填报值大于分配值",
				  type: 'error',
				  duration: 6000,
					showClose: true
				})
			}
		},
		closeDialog() {
			this.$emit('getList')
			this.$emit('closeDialog')
		}
	},
}
</script>
