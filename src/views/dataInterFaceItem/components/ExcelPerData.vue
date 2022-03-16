<template>
	<div class="app-container">
		<el-button
			:disabled="accountStatus"
			type="primary"
			size="mini"
			@click="saveFillPerReport"> 提 交</el-button>
		<el-button
			type="info"
			size="mini" :disabled="accountStatus"
			@click="calcReasonableData" plain>
				提取总值：{{ fillDataSumVal }}</el-button>
		<!-- 临时添加 -->
		<el-select
			v-model="tempPersonParams"
			:disabled="accountStatus"
			value-key="id"
			multiple
			filterable
			remote
			reserve-keyword
			placeholder="输入姓名/编码/状态/职位/科室或'全部'查询"
			:remote-method="remoteMethod"
			:loading="remoteLoading"
			size="mini"
			class="fuzzyQuery">
			<el-option
				v-for="item in fuzzyQueryPerParams"
				:key="item.id"
				:label="item.name"
				:value="item">
				<span style="float: left">{{ item.code }}{{ item.name }}</span>
				<span style="float: right; color: #8492a6; font-size: 13px">
					{{ item.departmentName }}
				</span>
			</el-option>
		</el-select>
		<!-- 添加选中 -->
		<el-tooltip
			effect="light"
			content="添加选中的人员"
			placement="top-start">
			<el-button
				:disabled="accountStatus"
				size="mini" type="primary"
				style="margin-left: 5px;"
				icon="el-icon-plus"
				@click="addChoosenData"
				circle plain></el-button>
		</el-tooltip>
		<!-- 添加全部 -->
		<el-tooltip
			effect="light"
			content="添加查询的全部人员"
			placement="bottom">
			<el-button
				:disabled="accountStatus"
				size="mini" type="info"
				style="margin-left: 5px;"
				icon="el-icon-caret-bottom"
				@click="addAllFuzzyQueryData"
				circle plain></el-button>
		</el-tooltip>
    <el-button
    	type="primary" plain icon="el-icon-download"
    	size="mini"
    	@click="exportExcel"> 导出excel</el-button>
		<el-divider content-position="left">
			<ItemInfoTip :handleItem="handleFillItem" />
		</el-divider>
		<HotTable
			:root="root"
			ref="fillHot"
			:settings="hotSettings"
			:language="language"></HotTable>
		<!--  -->
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
import { getInterfaceItemPerData,
				 batchSavePerReport } from '@/api/bnsDataItemReport'
import { fuzzyQueryPerParam } from '@/api/person'
import { HotTable } from '@handsontable/vue'
// import Handsontable from 'handsontable'
import 'handsontable/dist/handsontable.full.css'
import 'handsontable/languages/zh-CN'
import waves from '@/directive/waves'
import BackToTop from '@/components/BackToTop'
import { handleDownloadExcel } from '@/vendor/exportReportExcel'
export default {
	name: 'ExeclPerData',
	directives: { waves },
	components: { HotTable, ItemInfoTip, BackToTop },
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
			accountStatus: false, //封账
			fillData: [],
			fillDataSumVal: 0, //填报总数
			tempPersonParams: [], //临时添加人员
			fuzzyQueryPerParams: [], //模糊查询人员结果集
			remoteLoading: false,
			root: 'fill-hot',
			language: 'zh-CN', //汉化
			hotSettings: {
				data: [],
				colWidths: 200,
				width: '100%',
				height: 650,
				rowHeights: 23,
        rowHeaders: true,//行表头，可以使布尔值（行序号），可以使字符串（左侧行表头相同显示内容，可以解析html），也可以是数组（左侧行表头单独显示内容）。
        colHeaders:   [ '编码', '姓名', '所属科室', '职位', '年月', '填报值'],//自定义列表头or 布尔值
				fixedColumnsLeft: 1,
				manualColumnFreeze: true,
				filters: true,
				dropdownMenu: true,
				// dropdownMenu: ['filter_by_condition', 'filter_action_bar'],
        // minSpareCols: 2, //列留白
        // minSpareRows: 4,//行留白
        currentRowClassName: 'currentRow', //为选中行添加类名，可以更改样式
        currentColClassName: 'currentCol',//为选中列添加类名
        autoWrapRow: true, //自动换行
				licenseKey: 'non-commercial-and-evaluation',
				 contextMenu: {   //自定义右键菜单，可汉化，默认布尔值
          items: {
            "row_above": {
              name:'上方插入一行'
            },
            "row_below": {
              name:'下方插入一行'
            },
            "hsep1": "---------", //提供分隔线
            "remove_row": {
              name: '删除行',
            },
            "hsep2": "---------",
          }
        },//右键效果
				fillHandle: true, //选中拖拽复制 possible values: true, false, "horizontal", "vertical"
				fixedColumnsLeft: 0,//固定左边列数
        fixedRowsTop: 0,//固定上边列数
				manualColumnMove: true, //手动移动列
        manualRowMove: true,   //手动移动行
				manualColumnResize: true,//行列可拉缩
				columnSorting: true, //排序
				columns: [     //添加每一列的数据类型和一些配置
          {
            data: 'perCode' //人员编码
          },
					{
					  data: 'perName' //人员姓名
					},
          {
						data: 'deptName'
//             type: 'dropdown', //下拉选择
//             source: ['呼吸一组'],
//             strict: true //是否严格匹配
          },
          {
						data: 'perPosName'
					},
					{
						data: 'yearmonth',
						type: 'date',   //时间格式
            dateFormat: 'YYYY-MM',
            correctFormat: true,
            defaultDate: ''
					},
          {
						data: 'val',
						type: 'numeric',
						editor: 'numeric',
            format: '$ 0,0.00' //指定的数据格式
					}
        ]
// 				afterChange: function (changes, source) { //数据改变时触发此方法
//
//         }
				// stretchH: 'all'//根据宽度横向扩展，last:只扩展最后一列，none：默认不扩展
			}
		}
	},
	created() {
	  if (this.isFill) {
	    this.handleFillItem.itemID = this.$route.query.itemID
			this.handleFillItem.itemName = this.$route.query.itemName
			this.handleFillItem.yearmonth = this.$route.query.ym
			this.handleFillItem.type = this.$route.query.type
			this.accountStatus = this.$route.query.accountStatus
			this.getResUserInfo()
	    this.fetchData()
	  }
	},
	methods: {
		getResUserInfo() {
			var self = this
			self.handleFillItem.userID = self.$store.getters.userID
		},
		fetchData() {
		  var self = this
			var query = self.handleFillItem
			getInterfaceItemPerData(query).then(response => {
				self.hotSettings.data = response.data
				self.calcSumVal(self.hotSettings.data)
			})
		},
		saveFillPerReport() {
			var self = this
			let errFlg = false
			const data = self.$refs.fillHot.hotInstance.getSourceData()
			let perReports = []
			const itemID = self.handleFillItem.itemID
			const ym = self.handleFillItem.yearmonth
			const operator = self.handleFillItem.userID
			data.map(v => {
				if (v.perCode === null || v.perCode === '') {
					self.$message({
					  message: "存在编码为空的记录，不能提交",
					  type: 'error',
					  duration: 6000,
						showClose: true
					})
					errFlg = true
					return
				}else {
					const report = {
						bnsDataItem: itemID,
						perCode: v.perCode,
						yearmonth: ym,
						val: parseFloat(v.val) === NaN ? null : parseFloat(v.val),
						operator: operator
					}
					perReports.push(report)
				}
			})
			if (!errFlg) {
				self.batchSubmit(perReports, ym)
			}
		},
		batchSubmit(data, ym) {
			var self = this
			batchSavePerReport(data).then(res => {
				const loading = self.$loading({
				  lock: true,
				  text: '数据拼命提交中',
				  spinner: 'el-icon-loading',
				  background: 'rgba(0, 0, 0, 0.7)'
				})
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
					const itemName = self.handleFillItem.itemName
					self.$notify({
					  title: ym + ' ' + itemName + '已提交完成',
					  type: 'success',
					  duration: 6000
					})
					self.hotSettings.data = []
					self.fetchData()
					loading.close()
				}
			})
		},
		//统计当前填报总数
		calcReasonableData() {
			var self = this
			const data = self.$refs.fillHot.hotInstance.getSourceData()
			self.calcSumVal(data)
		},
		//填报值求和
		calcSumVal(data) {
			var self = this
			self.fillDataSumVal = 0
			const length = data.length
			for (let i = 0; i < length; i++) {
				let fillVal = data[i].val
				let calcVal = self.formateNum(fillVal)
				self.fillDataSumVal += calcVal
			}
		},
		//校正number格式
		formateNum(numStr) {
			const num = numStr == null || numStr == '' ? 0 : parseFloat(numStr)
			return num
		},
		/* 模糊查询 */
		remoteMethod(query) {
			if (query !== '') {
		    this.remoteLoading = true;
				const search = {
					keyword: query
				}
		    fuzzyQueryPerParam(search).then(res => {
					this.fuzzyQueryPerParams = res.data
				})
				this.remoteLoading = false;
		  }else {
		    this.fuzzyQueryPerParams = [];
		  }
		},
		/* 添加选中的人员 */
		addChoosenData() {
			var self = this
			let count = 0
			const choosenData = self.tempPersonParams
			let length = choosenData.length
			for (let i = 0; i < length; i++) {
				const data = choosenData[i]
				var isContained = self.contains(data)
				if (!isContained) {
					self.addPerson(data)
					count++
				}
			}
			self.$message({
			  message: "已添加"+count+"名人员",
			  type: 'success',
			  duration: 4000,
				showClose: true
			})
		},
		addPerson(data) {
			let newPerData = {
				bnsDataItem: this.handleFillItem.bnsDataItem,
				perCode: data.code,
				perName: data.name,
				deptName: data.departmentName,
				perPosName: data.positionName,
				yearmonth: this.handleFillItem.yearmonth,
				val: null
			}
			this.hotSettings.data.push(newPerData)
		},
		addAllFuzzyQueryData() {
			var self = this
			let count = 0
			const choosenData = self.fuzzyQueryPerParams
			let length = choosenData.length
			for (let i = 0; i < length; i++) {
				const data = choosenData[i]
				var isContained = self.contains(data)
				if (!isContained) {
					self.addPerson(data)
					count++
				}
			}
			self.$message({
			  message: "已添加"+count+"名人员",
			  type: 'success',
			  duration: 4000,
				showClose: true
			})
		},
		contains(item) {
			const paramCode = item.code
			const perData = this.$refs.fillHot.hotInstance.getSourceData()
			const perArr = perData.map(v => {
				return v.perCode
			})
			const length = perArr.length
			for (let i = 0; i < length; i++) {
				if (perArr[i] === paramCode) {
					return true
				}
			}
			return false
		},
    /* 导出excel */
    exportExcel() {
      var self = this
      const reportItem = self.reportItem
      var list = self.$refs.fillHot.hotInstance.getSourceData()
      const filename = self.handleFillItem.yearmonth + '_' + self.handleFillItem.itemName
      var headers = ['编码', '姓名', '所属科室', '职位', '年月', '填报值']
      var filterVals = ['perCode', 'perName', 'deptName', 'perPosName',
                        'yearmonth', 'val']
      handleDownloadExcel(list, filename, headers, filterVals)
    }
	}
}
</script>

<style>
.currentRow {
	color: #409EFF;
}
</style>
