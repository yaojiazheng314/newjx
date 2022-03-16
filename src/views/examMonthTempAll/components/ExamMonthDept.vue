<template>
	<div class="app-container">
		<h2
			style="margin-left: 500px;">
			{{ examTempName }} {{ examMonth.yearmonth }}
		</h2>
		<el-button 
			v-waves
			size="small"
			type="success" 
			@click="submitScore"
			plain>提交评分</el-button>
		<el-divider content-position="right">
			总分：{{ tempFullScore }}
			<el-divider direction="vertical"></el-divider>
			得分：
			<el-input-number
				size="mini"
				v-model="examMonth.score"
				:step="0.1"
				:max="tempFullScore"
				:min="0">
				{{ examMonth.score }}
			</el-input-number>
			<el-divider direction="vertical"></el-divider>
			受检科室：
			<el-select
				v-if="isBlankTemp"
				v-model="examMonth.department"
				multiple
				filterable
				remote
				reserve-keyword
				placeholder="输入科室名称/类别/编码或'全部'查询"
				:remote-method="remoteMethod"
				:loading="remoteLoading"
				size="mini"
				class="fuzzyQuery">
				<el-option
					v-for="item in fuzzyQueryDeptParams"
					:key="item.id"
					:label="item.name"
					:value="item.id">
					<span style="float: left">{{ item.name }}</span>
					<span style="margin-left: 15px; color: #8492a6; font-size: 13px">
						{{ item.type }}
					</span>
				</el-option>
			</el-select>
			<span v-else>{{ departmentName }}</span>
			<!-- 得分：{{ examMonth.score }} -->
		</el-divider>
		<el-collapse>
			<el-collapse-item 
				v-for="tt in tempsTarget" :key="tt.examTarget"
				:title="tt.indicator">
				<div v-for="tb in tt.basis" :key="tb.id">{{ tb.basis }}</div>
			</el-collapse-item>
		</el-collapse>
	</div>
</template>

<script>
import waves from '@/directive/waves'
import BackToTop from '@/components/BackToTop'
import countTo from 'vue-count-to'
//拉取数据
import { fetchTemp, 
				 submitExamDeptScore,
				 getExamMonthDeptInfo } from '@/api/examMonth'
import { fuzzyQueryDeptParam	} from '@/api/department'
export default {
	name: 'ExamMonthDept',
	directives: { waves },
	components: { BackToTop, countTo },
	props: {
	  isFill: {
	    type: Boolean,
	    default: false
	  }
	},
	data() {
		return {
			accountStatus: false, //是否已封账
			isBlankTemp: false, //是否是空白模板
			examMonth: {
				examTemp: null,
				execUser: null,
				department: [],
				yearmonth: '',
				score: 0
			},
			examTempName: '', //模板名称
			departmentName: '', //受检科室名称
			tempFullScore: 0,
			tempsTarget: [],
			/* 模糊查询添加科室 */
			remoteLoading: false,
			fuzzyQueryDeptParams: []
		}
	},
	created() {
	  if (this.isFill) {
	    this.examMonth.examTemp = this.$route.query.examTempId
			this.examTempName = this.$route.query.examTempName
			this.examMonth.yearmonth = this.$route.query.yearmonth
			this.getExecUserInfo() //获取考核执行人
	  }
	},
	mounted() {
		//判断是否是重新评分
		const isReExam = this.$route.query.isReExam
		this.isBlankTemp = !isReExam
		if (isReExam) {
			this.fetchExamMonthDeptInfo()
		} else {
			this.fetchExamTarget() //拉取考核指标
		}
	},
	methods: {
		getExecUserInfo() {
			var self = this
			self.examMonth.execUser = self.$store.getters.userID
		},
		/* 获取月度考核模板指标依据明细 */
		fetchExamTarget() {
			var self = this
			var query = self.examMonth
			fetchTemp(query).then(res => {
				self.tempsTarget = res.data.tempsTargets
				self.tempFullScore = res.data.fullScore
				self.examMonth.score = res.data.fullScore
				self.accountStatus = res.data.accountStatus
			})
		},
		/* 获取科室月度考核结果 */
		fetchExamMonthDeptInfo() {
			var self = this
			self.departmentName = self.$route.query.departmentName
			const dept = self.$route.query.department
			self.examMonth.department.push(dept)
			const examMonthDeptQuery = {
				yearmonth: self.examMonth.yearmonth,
				examTemp: self.examMonth.examTemp,
				department: self.$route.query.department,
				execUser: self.examMonth.execUser //用于拉取模板明细
			}
			getExamMonthDeptInfo(examMonthDeptQuery).then(res => {
				self.tempsTarget = res.data.tempsTargets
				self.tempFullScore = res.data.fullScore
				self.examMonth.score = res.data.score
				self.accountStatus = res.data.accountStatus
			})
		},
		/* 模糊查询要添加的科室 */
		remoteMethod(query) {
			if (query !== '') {
		    this.remoteLoading = true;
				const search = {
					keyword: query
				}
		    fuzzyQueryDeptParam(search).then(res => {
					this.fuzzyQueryDeptParams = res.data
				})
				this.remoteLoading = false;
		  }else {
		    this.fuzzyQueryDeptParams = [];
		  }
		},
		/* 提交科室考核评分 */
		submitScore() {
			var self = this
			const examData = self.examMonth
			if (examData.department.length === 0) {
				this.$notify({
          title: '警告',
					message: '必须选择受检科室',
          type: 'warning'
        })
				return
			}
			submitExamDeptScore(examData).then(res => {
				self.$notify({
				  title: '成功',
				  message: self.examTempName + examData.yearmonth + '考核评分已提交',
				  type: 'success',
				  duration: 6000
				})
			})
		}
	}
}
</script>
