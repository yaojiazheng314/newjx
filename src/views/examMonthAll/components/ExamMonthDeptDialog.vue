<template>
	<div id="examMonthDeptDialog">
		<el-dialog 
			:title="deptDialogStatus" 
			:show-close="showClose"
			:close-on-click-modal="false"
			:visible.sync="deptVisible">
			<!-- 科室名称快速查询 -->
			<el-input
				v-model="searchDR"
				size="mini"
				placeholder="输入科室名称搜索"
				style="width: 200px;"/>
			<!-- 科室评分表 -->
			<el-table
				:data="deptData.filter(data => !searchDR || data.deptName.toLowerCase().includes(searchDR.toLowerCase()))"
				style="width: 100%"
				stripe
				height="400">
				<el-table-column
					prop="deptName"
					label="名称">
				</el-table-column>
				<el-table-column
					prop="deptType"
					label="类型"
					:filters="[{ text: '项目', value: '项目' },
										 { text: '科室', value: '科室' },
										 { text: '主任组', value: '主任组' },
										 { text: '治疗组', value: '治疗组' },
										 { text: '护理组', value: '护理组' }]"
					:filter-method="filterType" filter-placement="bottom-end">
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
							@click="examDept(scope.row)" 
							type="text" size="small"
							style="color: #009926;"
							icon="el-icon-finished">评分</el-button>
						<el-button 
							@click="deleteDept(scope.row)" 
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
import { getExamMonthDeptList,
				 deleteDeptExamInfo } from '@/api/examMonth'
export default{
	props: {
		deptVisible: {
			type: Boolean
		},
		deptDialogStatus: {
			type: String
		},
		examMonthData: {
			type: Object
		}
	},
	name: 'ExamMonthDeptDialog',
	data() {
		return {
			showClose: false,
			loading: false,
			searchDR: '',
			deptData: [],
			examMonthDeptQuery: {
				temp: null, //考核模板
				yearmonth: '' //考核年月
			}
		}
  },
	mounted() {
		const temp = this.examMonthData.examTempId
		const yearmonth = this.examMonthData.yearmonth
		if (temp !== null && yearmonth !== '') {
			this.examMonthDeptQuery.temp = temp
			this.examMonthDeptQuery.yearmonth = yearmonth
			this.getExamMonthDepts(this.examMonthDeptQuery)
		}
	},
	methods: {
		getExamMonthDepts(query) {
			var self = this
			getExamMonthDeptList(query).then(response => {
				self.deptData = response.data
			})
		},
		cleanDeptData() {
			this.deptData = []
		},
		deleteDept(data) {
			var self = this
			//确认是否要删除科室评分
			const delMsg = '确认删除'+data.deptName+'考核结果?'
			self.$confirm(delMsg, '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
       	const delData = data
       	self.deleteExamMonthDept(delData)
      }).catch(() => {
        self.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
		},
		//确认删除科室考核信息
		deleteExamMonthDept(delData) {
			const delId = delData.department //移除的科室id
			const examMonthDept = {
				yearmonth: this.examMonthDeptQuery.yearmonth,
				examTemp: this.examMonthDeptQuery.temp,
				department: delId
			}
			deleteDeptExamInfo(examMonthDept).then(res => {
				let length = this.deptData.length
				for (let i = 0; i < length; i++) {
					const dept = this.deptData[i].department
					if (dept === delId) {
						this.deptData.splice(i, 1)
						break
					}
				}
				let deptName = delData.deptName //要被移除的科室名称
				this.$message({
					message: "已经删除"+deptName+"的考核结果",
					type: 'warning',
					duration: 4000,
					showClose: true
				})
			})
		},
		/* 科室考核 */
		examDept(data) {
			var self = this
			self.$router.push({
			path: '/exam/execExamMonth',
			query: {
					examTempId: data.examTempId,
					examTempName: data.examTempName,
					examTempAssessed: data.examTempAssessed,
					yearmonth: data.yearmonth,
					isReExam: true,
					departmentName: data.deptName,
					department: data.department
				}				
			})
			self.closeDialog()
		},
		filterType(value, row) {
			return row.type === value
		},
		closeDialog() {
			this.$emit('getList')
			this.$emit('closeExamMonthDeptDialog')
		}
	}
}
</script>