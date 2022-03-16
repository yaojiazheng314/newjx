<template>
	<div id="examMonthDeptDialog">
		<el-dialog 
			:title="perDialogStatus" 
			:show-close="showClose"
			:close-on-click-modal="false"
			:visible.sync="perVisible">
			<!-- 科室名称快速查询 -->
			<el-input
				v-model="searchDR"
				size="mini"
				placeholder="输入科室名称搜索"
				style="width: 200px;"/>
			<!-- 姓名快速查询 -->
			<el-input 
				v-model="searchPR"
				size="mini"
				placeholder="输入人员姓名搜索"
				style="width: 200px;"/>
			<!-- 科室评分表 -->
			<el-table
				:data="perData.filter(data => !searchDR || data.deptName.toLowerCase().includes(searchDR.toLowerCase())).filter(data => !searchPR || data.perName.toLowerCase().includes(searchPR.toLowerCase()))"
				style="width: 100%"
				stripe
				height="400">
				<el-table-column
					prop="perName"
					label="姓名">
				</el-table-column>
				<el-table-column
					prop="deptName"
					label="所属科室">
				</el-table-column>
				<el-table-column
					prop="score"
					label="分值">
				</el-table-column>
				<el-table-column
					fixed="right"
					label="操作"
					width="200">
					<template slot-scope="scope">
						<el-button 
							@click="examPer(scope.row)" 
							type="text" size="small"
							style="color: #009926;"
							icon="el-icon-finished">评分</el-button>
						<el-button 
							@click="deletePer(scope.row)" 
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
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { getExamMonthPerList,
				 deletePerExamInfo } from '@/api/examMonth'
export default{
	props: {
		perVisible: {
			type: Boolean
		},
		perDialogStatus: {
			type: String
		},
		examMonthData: {
			type: Object
		}
	},
	name: 'ExamMonthPerDialog',
	data() {
		return {
			showClose: false,
			loading: false,
			searchDR: '', //科室名称关键字
			searchPR: '', //人员名称关键字
			perData: [],
			examMonthPerQuery: {
				temp: null, //考核模板
				yearmonth: '' //考核年月
			}
		}
  },
	mounted() {
		const temp = this.examMonthData.examTempId
		const yearmonth = this.examMonthData.yearmonth
		if (temp !== null && yearmonth !== '') {
			this.examMonthPerQuery.temp = temp
			this.examMonthPerQuery.yearmonth = yearmonth
			this.getExamMonthPers(this.examMonthPerQuery)
		}
	},
	methods: {
		getExamMonthPers(query) {
			var self = this
			getExamMonthPerList(query).then(response => {
				self.perData = response.data
			})
		},
		cleanperData() {
			this.perData = []
		},
		deletePer(data) {
			var self = this
			//确认是否要删除人员考核结果
			const delMsg = '确认删除'+data.perName+'考核结果?'
			self.$confirm(delMsg, '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
       	const delData = data
       	self.deleteExamMonthPer(delData)
      }).catch(() => {
        self.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
		},
		//确认删除科室考核信息
		deleteExamMonthPer(delData) {
			const delId = delData.person //移除的科室id
			const examMonthPer = {
				yearmonth: this.examMonthPerQuery.yearmonth,
				examTemp: this.examMonthPerQuery.temp,
				person: delId
			}
			deletePerExamInfo(examMonthPer).then(res => {
				let length = this.perData.length
				for (let i = 0; i < length; i++) {
					const dept = this.perData[i].person
					if (dept === delId) {
						this.perData.splice(i, 1)
						break
					}
				}
				let perName = delData.perName //要被移除的科室名称
				this.$message({
					message: "已经删除"+perName+"的考核结果",
					type: 'warning',
					duration: 4000,
					showClose: true
				})
			})
		},
		/* 人员考核 */
		examPer(data) {
			var self = this
			self.$router.push({
			path: '/exam/execExamMonth',
			query: {
					examTempId: data.examTempId,
					examTempName: data.examTempName,
					examTempAssessed: data.examTempAssessed,
					yearmonth: data.yearmonth,
					isReExam: true,
					personName: data.perName,
					person: data.person
				}				
			})
			self.closeDialog()
		},
		filterType(value, row) {
			return row.type === value
		},
		closeDialog() {
			this.$emit('getList')
			this.$emit('closeExamMonthPerDialog')
		}
	}
}
</script>