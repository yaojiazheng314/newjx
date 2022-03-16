<template>
	<div id="collectReport">
		<el-dialog 
			width="80%"
			:title="dialogStatus" 
			:show-close="showClose"
			:close-on-click-modal="false"
			:visible.sync="visible"
			@close="closeDialog">
			<label class="radio-label" 
				style="margin-left: 10px; padding-left:0; font-size: 15px;">
				导出文件名: </label>
			<el-input 
				v-model="filename" 
				size="small"
				placeholder="输入文件名(默认:分配明细汇总_年月)" 
				style="width:300px;" prefix-icon="el-icon-document" />
			<el-button 
				type="primary" 
				size="mini"
				style="margin-left: 10px;"
				:loading="downloadLoading"
				@click="handleDownload"
				plain>导出execl</el-button>
			<el-divider content-position="left">
				{{ reportTip }}
			</el-divider>
			<el-table
				id="report-table"
				:data="reportData"
				:span-method="mergeCell"
				:row-class-name="tableRowClassName"
				style="width: 100%"
				:loading="loading">
				<el-table-column
					align="center"
					:label="dialogStatus">
					<el-table-column
						prop="perCode"
						label="编码">
					</el-table-column>
					<el-table-column
						prop="perName"
						label="姓名">
					</el-table-column>
					<el-table-column
						prop="perDeptName"
						label="所属科室">
					</el-table-column>
					<el-table-column
						prop="feedBackDeptName"
						label="分配科室">
					</el-table-column>
					<!-- 动态渲染明细 -->
					<el-table-column
						align="center"
						label="分配明细"
						width="150">
						<el-table-column
							align="center"
              v-for="(val,i) in configHeader"
								:key="i"
								:prop="val.prop"
								:label="val.label">
            </el-table-column>
					</el-table-column>
					<!-- 动态渲染明细 -->
					<el-table-column
						align="center"
						prop="sumVal"
						label="总计"
						width="150">
					</el-table-column>
				</el-table-column>
			</el-table>
		</el-dialog>
	</div>
</template>

<script>
import { getCollectReport } from '@/api/feedBackReport'
// 引入导出Excel表格依赖
import FileSaver from "file-saver";
import XLSX from "xlsx";
export default {
	name: 'fbr-collect-report',
	props: {
		dialogVisible: {
			type: Boolean
		},
	  yearmonth: {
	    type: String
	  },
		userID: {
			type: Number
		}
	},
	data() {
		return {
			showClose: true,
			loading: false,
			visible: false,
			dialogStatus: '',
			collectQuery: {
				yearmonth: '',
				userID: null
			},
			/* 动态分配项 */
			configHeader: [],
			/* 汇总数据 */
			reportData: [],
			/* 要合并的人员编码，姓名，所属科室单元格 */
			perSpanArr: [],
			perArrPos: 0,
			/* 要合并的分配科室 */
			fbDeptSpanArr: [],
			fbDeptPos: 0,
			/* 行高亮bug */
			rowIndex: '-1',
			hoverOrderArr: [],
			/* 导出excel */
			reportTip: '分配汇总明细',
			downloadLoading: false,
			filename: ''
		}
	},
	created() {
		this.visible = this.dialogVisible
	},
	mounted() {
		const ym = this.yearmonth
		const user = this.userID
		if (ym !== '' && user !== null) {
			this.dialogStatus = ym + "分配填报汇总"
			this.collectQuery.yearmonth = ym
			this.collectQuery.userID = user
			this.fetchData()
		}
	},
	methods: {
		fetchData() {
			var self = this
			self.loading = true
			const query = self.collectQuery
			getCollectReport(query).then(res => {
				self.configHeader = res.data.headers
				self.reportData = res.data.reportData
				self.getPerSpanArr(self.reportData)
				self.getFbDeptArr(self.reportData)
				self.loading = false
			})
		},
		getPerSpanArr(data) {
			for (let i = 0; i < data.length; i++) {
				if (i === 0) {
					this.perSpanArr.push(1)
					this.perArrPos = 0
				}else {
					//判断当前元素与上一元素是否相同
					if (data[i].person === data[i-1].person) {
						this.perSpanArr[this.perArrPos] += 1
						this.perSpanArr.push(0)
					}else {
						this.perSpanArr.push(1)
						this.perArrPos = i
					}
				}
			}
		},
		getFbDeptArr(data) {
			for (let i = 0; i < data.length; i++) {
				if (i === 0) {
					this.fbDeptSpanArr.push(1)
					this.fbDeptPos = 0
				}else {
					//判断当前元素与上一元素是否相同
					if (data[i].feedBackDept === data[i-1].feedBackDept 
						&& data[i].person === data[i-1].person) {
						this.fbDeptSpanArr[this.fbDeptPos] += 1
						this.fbDeptSpanArr.push(0)
					}else {
						this.fbDeptSpanArr.push(1)
						this.fbDeptPos = i
					}
				}
			}
		},
		mergeCell({ row, column, rowIndex, columnIndex }) {
			//动态列最后一位索引
			const lastIndex = this.configHeader.length + 4
			if (columnIndex < 3 || columnIndex === lastIndex) {
				const _row = this.perSpanArr[rowIndex];
				const _col = _row > 0 ? 1 : 0;
				return {
					rowspan: _row,
					colspan: _col
				}
			}
			//索引3位 是分配科室 
			else if (columnIndex >= 3 && columnIndex < lastIndex) {
				const _fbrow = this.fbDeptSpanArr[rowIndex];
				const _fbcol = _fbrow > 0 ? 1 : 0;
				return {
					rowspan: _fbrow,
					colspan: _fbcol
				}
			}
		},
		tableRowClassName({row, rowIndex}) {
		if (row.feedBackDeptName === '总计') {
				return 'sum-row';
      }
		},
		/* 导出execl */
		handleDownload() {
			var self = this
		  self.downloadLoading = true
			/* 从表生成工作簿对象 */
      var wb = XLSX.utils.table_to_book(document.querySelector("#report-table"));
      /* 获取二进制字符串作为输出 */
      var wbout = XLSX.write(wb, {
          bookType: "xlsx",
          bookSST: true,
          type: "array"
      });
      try {
          FileSaver.saveAs(
          //Blob 对象表示一个不可变、原始数据的类文件对象。
          //Blob 表示的不一定是JavaScript原生格式的数据。
          //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
          //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
          new Blob([wbout], { type: "application/octet-stream" }),
          //设置导出文件名称
          self.filename === '' ? '分配明细汇总_' + self.collectQuery.yearmonth + '.xlsx' : self.filename + '.xlsx'
					);
					self.downloadLoading = false
      } catch (e) {
          if (typeof console !== "undefined") console.log(e, wbout);
					self.downloadLoading = false
      }
			self.downloadLoading = false
      return wbout;
		},
		closeDialog() {
			this.$emit('closeCRDialog')
		}
	}
}
</script>

<style>
	.el-table .sum-row {
	  background: lightblue;
	}
</style>
