<template>
  <div class="app-container">
		<el-select 
			v-if="status === '未上报'"
			v-model="sameDeptPeople" 
			value-key="person"
			multiple
			filterable 
			placeholder="选择要分配的同科室人员">
			<el-option-group
				v-for="group in sameDeptPersonParams"
				:key="group.label"
				:label="group.label">
				<el-option
					v-for="item in group.options"
					:key="item.person"
					:label="item.perName"
					:value="item">
				</el-option>
			</el-option-group>
		</el-select>
		<el-select
			v-if="status === '未上报'"
			v-model="allHospPeople"
			value-key="person"
			multiple
			filterable
			remote
			reserve-keyword
			placeholder="输入人员编码/姓名或科室名称查询"
			style="width: 280px;"
			:remote-method="remoteMethod"
			:loading="remoteLoading">
			<el-option
				v-for="item in allHospPersonOptions"
				:key="item.person"
				:value="item">
				<span style="float: left">{{ item.perName }}</span>
				<span style="color: #8492a6; font-size: 13px">
					{{ item.perCode }}
				</span>
				<span style="float: right; color: #8492a6; font-size: 13px">
					{{ item.perDeptName }}
				</span>
			</el-option>
		</el-select>
		<el-button 
			v-if="status === '未上报'"
			type="info" 
			size="mini"
			style="margin-right: 10px;" 
			@click="addPersonTolist"
			plain>
			添加人员
			<i style="color: #0086B3" 
				class="el-icon-circle-plus" />
		</el-button>
		<el-button 
			v-if="status === '未上报'"
			type="info" 
			size="mini"
			style="margin-right: 10px;" 
			@click="copyReportPerson"
			plain>
			人员模板
			<i style="color: #0086B3" 
				class="el-icon-document-copy" />
		</el-button>
		<el-input
			v-if="status !== '未上报'"
			v-model="searchDR"
			size="mini"
			placeholder="输入科室名称筛选"
			style="width: 150px;"/>
		<el-input
			v-if="status !== '未上报'"
			v-model="searchPR"
			size="mini"
			placeholder="输入人员姓名筛选"
			style="width: 150px;"/>
		<count-to
		  :start-val="0"
		  :end-val="feedBackVal"
		  :duration="1000"
		  :separator="','"
			:decimals="2"
			prefix="分配值: "
		  :autoplay="true"
			class="calcVal feedBackVal"/>
		<count-to
		  :start-val="0"
		  :end-val="fillVal"
		  :duration="1000"
		  :separator="','"
			:decimals="2"
			prefix="已填报: "
		  :autoplay="true"
			class="calcVal fillVal"/>
		<count-to
		  :start-val="0"
		  :end-val="restVal"
		  :duration="1000"
		  :separator="','"
			:decimals="2"
			prefix="剩余: "
		  :autoplay="true"
			class="calcVal restVal"/>
		<el-tag 
			style="margin-left: 10px;"
			:type="status === '未上报' ? 
			'warning' : status === '已上报' ? 'success' : 'info'" 
			disable-transitions>{{ status }}
			<i style="color: #20B2AA" 
				:class="status === '未上报' ? 
			'el-icon-edit' : status === '已上报' ? 'el-icon-upload' : 'el-icon-success'" />
			</el-tag>
		<el-button 
			v-if="status === '未上报'"
			type="primary" 
			size="mini"
			style="margin-left: 10px;"
			@click="reportFeedBack"
			plain>上报</el-button>
		<div 
			v-if="status !== '未上报'" 
			style="display:inline-block;">
		  <label class="radio-label" 
				style="margin-left: 10px; padding-left:0; font-size: 15px;">
				导出文件名: </label>
		  <el-input 
				v-model="filename" 
				size="small"
				placeholder="输入文件名(默认:年月_分配项_分配科室)" 
				style="width:300px;" prefix-icon="el-icon-document" />
			<el-button 
				type="primary" 
				size="mini"
				style="margin-left: 10px;"
				:loading="downloadLoading"
				@click="handleDownload"
				plain>导出execl</el-button>
		</div>
		<el-progress 
			:percentage="fillPercentage"
			:show-text="false"
			style="margin-top: 10px;"
			color="lightblue"></el-progress>
		<el-divider content-position="left">
			<ItemInfoTip :reportItem="reportItem" />
		</el-divider>
		<!-- 表格区 -->
		<el-table 
			:data="list.filter(data => !searchDR || data.perDeptName.toLowerCase().includes(searchDR.toLowerCase())).filter(data => !searchPR || data.perName.toLowerCase().includes(searchPR.toLowerCase()))" 
			v-loading="listLoading" 
			stripe
			style="width: 100%">
			<el-table-column prop="perCode" align="center" label="编码" />
			<el-table-column prop="perName" align="center" label="姓名" />
			<el-table-column prop="perDeptName" align="center" label="所属科室" />
			<el-table-column 
				prop="perStatus" align="center" label="状态" 
				:filters="[{ text: '在职', value: '在职' },
									 { text: '离职', value: '离职' },
									 { text: '返聘', value: '返聘' },
									 { text: '编外', value: '编外' }]"
			  :filter-method="filterPerStatus" filter-placement="bottom-end">
				<template slot-scope="scope">
					<el-tag 
						:type="scope.row.perStatus === '在职' ? 
						'primary' : scope.row.perStatus === '编外' ? 'success' : 'danger'" 
						disable-transitions>{{ scope.row.perStatus }}</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="perPosName" align="center" label="职位" />
			<el-table-column 
				prop="val" 
				align="center"
				width="240"
				label="填报值">
				<template slot-scope="scope">
					<el-input-number 
						v-if="status === '未上报'"
						v-loading="scope.row.subLoading"
						v-model="scope.row.val"
						:precision="2"
						placeholder="未填报"
						controls-position="right"
						size="mini"
						style="width: 200px;">
					</el-input-number>
					<span v-else>{{ scope.row.val }}</span>
				</template>
			</el-table-column>
			<el-table-column v-if="status === '未上报'" align="center" label="操作">
				<template slot-scope="scope">
					<el-tooltip
						effect="dark" 
						content="暂存" placement="left">
						<el-button 
							type="success" 
							icon="el-icon-check"
							size="mini"
							:loading="scope.row.subLoading"
							@click="submitPerReport(scope.row)"
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
							@click="delReport(scope.row)"
							plain
							circle></el-button>
					</el-tooltip>
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
import { getReportData,
				 saveFeedBackReport,
				 delReportData,
				 getSameDeptPerParam,
				 getAllHospPersonParam,
				 reportFeedBackResult, copyReportPersonTemp } from '@/api/feedBackReport'
import waves from '@/directive/waves'
import BackToTop from '@/components/BackToTop'
import countTo from 'vue-count-to'
import { handleDownloadExcel } from '@/vendor/exportReportExcel'
export default {
  name: 'ReportFill',
	directives: { waves },
  components: { ItemInfoTip, BackToTop, countTo },
  props: {
    isFill: {
      type: Boolean,
      default: false
    }
  },
	data() {
		return {
			reportItem: {
				feedBackItem: null,
				feedBackItemName: '',
				feedBackDept: null,
				feedBackDeptName: '',
				yearmonth: '',
				userID: null
			},
			status: '',
			searchDR: '',
			searchPR: '',
			sameDeptPersonParams: [],
			sameDeptPeople: [],
			allHospPersonOptions: [],
			allHospPeople: [],
			list: [],
			listLoading: false,
			remoteLoading: false,
			feedBackVal: 0,
			fillVal: 0,
			restVal: 0,
			fillPercentage: 0,
			/* 导出execl */
			downloadLoading: false,
			filename: ''
		}
	},
  created() {
    if (this.isFill) {
      this.reportItem.feedBackItem = this.$route.query.feedBackItem
			this.reportItem.feedBackItemName = this.$route.query.feedBackItemName
			this.reportItem.feedBackDept = this.$route.query.feedBackDept
			this.reportItem.feedBackDeptName = this.$route.query.feedBackDeptName
			this.reportItem.yearmonth = this.$route.query.yearmonth
			this.reportItem.userID = this.$route.query.userID
      this.fetchData()
			this.getSameDeptPersonParam()
    }
  },
  methods: {
    fetchData() {
      var self = this
			self.listLoading = true
			var query = self.reportItem
			getReportData(query).then(response => {
				self.status = response.data.reportStatus
				self.feedBackVal = response.data.feedBackVal
				const items = response.data.reports
				self.list = items.map(v => {
						self.$set(v, 'subLoading', false)
						return v
					})
				self.updateFillVal()
				self.listLoading = false
			})
    },
		getSameDeptPersonParam() {
			var self = this
			var query = self.reportItem
			console.log('111');
			console.log(query);
			getSameDeptPerParam(query).then(res => {
				self.sameDeptPersonParams = res.data
			})
		},
		remoteMethod(query) {
			if (query !== '') {
        this.remoteLoading = true;
				const search = {
					keyWord: query,
					feedBackItem: this.reportItem.feedBackItem,
					feedBackDept: this.reportItem.feedBackDept,
					userID: this.reportItem.userID
				}
        getAllHospPersonParam(search).then(res => {
					this.allHospPersonOptions = res.data
				})
				this.remoteLoading = false;
      }else {
        this.allHospPersonOptions = [];
      }
		},
		addPersonTolist() {
			this.listLoading = true
			let count = 0
			const sameDPeople = this.sameDeptPeople
			sameDPeople.map(v => {
				let existed = this.list.find((p) => p.person == v.person);
				if (!existed) {
					this.$set(v, 'subLoading', false)
					this.list.push(v)
					count++
				}
			})
			const allDPeople = this.allHospPeople
			allDPeople.map(v => {
				let existed = this.list.find((p) => p.person == v.person);
				if (!existed) {
					this.$set(v, 'subLoading', false)
					this.list.push(v)
					count++
				}
			})
			this.sameDeptPeople = []
			this.allHospPeople = []
			this.updateFillVal()
			this.$message({
			  message: "已添加"+count+"名人员",
			  type: 'success',
			  duration: 4000,
				showClose: true
			})
			this.listLoading = false
		},
		/* 复制最近一月的该科室、分配项人员 不包含离职人员 */
		copyReportPerson() {
			const query = this.reportItem
			copyReportPersonTemp(query).then(res => {
				let resStatus = res.status
				if (resStatus == 520) {
					this.$message({
					  message: res.msg,
					  duration: 4000,
						showClose: true
					})
					this.listLoading = false
				} else if (resStatus == 200) {
					const reportPersonTemp = res.data
					let count = 0
					reportPersonTemp.map(v => {
						let existed = this.list.find((p) => p.person == v.person);
						if (!existed) {
							this.$set(v, 'subLoading', false)
							this.list.push(v)
							count++
						}
					})
					this.updateFillVal()
					this.$message({
					  message: "已添加"+count+"名人员",
					  type: 'success',
					  duration: 4000,
						showClose: true
					})
					this.listLoading = false
				}
			})
		},
		filterPerStatus(value, row) {
			return row.perStatus === value
		},
		updateFillVal() {
			var self = this
			self.fillVal = 0
			let list = self.list
			list.map(v => {
				if (v.val === null) {
					self.fillVal += 0
				} else{
					self.fillVal += v.val
				}
			})
			self.restVal = self.feedBackVal - self.fillVal
			if (self.fillVal > self.feedBackVal) {
				self.$message({
				  message: "填报值大于分配值",
				  type: 'error',
				  duration: 6000,
					showClose: true
				})
			}
			self.calcFillPercentage()
		},
		calcFillPercentage() {
			var self = this
			let fillNum = self.fillVal
			let sumNum = self.feedBackVal
			sumNum = sumNum === 0 ? 1 : sumNum
			let percent = (fillNum / sumNum) * 100
			self.fillPercentage = percent > 100 ? 100 : percent
		},
		submitPerReport(data) {
			var self = this
			if (!data.val) {
				self.$message({
				  message: data.perName + "提交暂存的填报值不能为空、零或非数字格式",
				  type: 'error',
				  duration: 6000,
					showClose: true
				})
				return
			}else {
				data.subLoading = true
				const feedBackReport = {
					feedBackItem: self.reportItem.feedBackItem,
					yearmonth: self.reportItem.yearmonth,
					feedBackDept: self.reportItem.feedBackDept,
					person: data.person,
					val: data.val,
					user: self.reportItem.userID
				}
				saveFeedBackReport(feedBackReport).then(response => {
					let resultStatus = response.status
					if (resultStatus === 520) {
						data.subLoading = false
						self.$confirm(response.msg, '提示', {
							type: 'warning',
							center: true
						})
					}else {
						self.$notify({
						  title: '成功',
						  message: data.perName + '的填报值已暂存',
						  type: 'success',
						  duration: 6000
						})
						data.subLoading = false
						self.updateFillVal()
					}
				})
			}
		},
		delReport(data) {
			var self = this
			const feedBackReport = {
				feedBackItem: self.reportItem.feedBackItem,
				yearmonth: self.reportItem.yearmonth,
				feedBackDept: self.reportItem.feedBackDept,
				person: data.person,
				val: data.val,
				user: self.reportItem.userID
			}
			data.subLoading = true
			delReportData(feedBackReport).then(response => {
				self.$notify({
				  title: '删除成功',
					message: data.perName + '的填报值已删除',
				  type: 'success',
				  duration: 6000
				})
				self.removePerson(data)
				data.subLoading = false
				self.updateFillVal()
			})
		},
		
		/* 从列表中移除人员 */
		removePerson(data) {
			const delPer = data.person
			const length = this.list.length
			for (let i = 0; i < length; i++) {
				const per = this.list[i].person
				if (per === delPer) {
					this.list.splice(i, 1)
					break
				}
			}
		},
		
		/* 上报分配项结果 */
		reportFeedBack() {
			//重新加载页面 去除未暂存的数据 拉取保存的结果
			this.fetchData()
			if (this.restVal !== 0 || this.feedBackVal !== this.fillVal) {
				this.$message({
				  message: "已填报的数值:" + this.fillVal +  " 不等于分配值:" + this.feedBackVal + "，无法上报，请仔细检查",
				  type: 'error',
				  duration: 6000,
					showClose: true
				})
			} else{
				var self = this
				const reportStatus = {
					feedBackItem: self.reportItem.feedBackItem,
					yearmonth: self.reportItem.yearmonth,
					department: self.reportItem.feedBackDept,
					user: self.reportItem.userID
				}
				reportFeedBackResult(reportStatus).then(res => {
					self.$notify({
					  title: '上报成功',
						message: '分配项:'+self.reportItem.feedBackItemName+' 上报科室:' + self.reportItem.feedBackDeptName+' 上报年月:'+self.reportItem.yearmonth,
					  type: 'success',
					  duration: 6000
					})
					this.fetchData() //更新页面
				})
			}
		},
		/* 导出execl */
		handleDownload() {
			var self = this
		  self.downloadLoading = true
			const reportItem = self.reportItem
			var list = self.list
			const filename = self.filename === '' ? reportItem.yearmonth + '_' + reportItem.feedBackItemName + '_' + reportItem.feedBackDeptName : self.filename
			var headers = ['人员编码', '姓名', '所属科室', '状态', '职位', '填报值']
			var filterVals = ['perCode', 'perName', 'perDeptName', 'perStatus', 'perPosName', 'val']
		  handleDownloadExcel(list, filename, headers, filterVals)
			self.downloadLoading = false
		}
  }
}
</script>

