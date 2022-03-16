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
			受检人员：
			<el-select 
			  v-if="isBlankTemp"
				v-model="examMonth.person" 
				multiple
				filterable 
				size="mini"
				style="width: 300px;"
				placeholder="选择受检的人员">
				<el-option-group
					v-for="group in sameDeptPersonParams"
					:key="group.label"
					:label="group.label">
					<el-option
						v-for="item in group.options"
						:key="item.id"
						:label="item.name"
						:value="item.id">
					</el-option>
				</el-option-group>
			</el-select>
			<span v-else>{{ personName }}</span>
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
				 submitExamPerScore,
				 getExamMonthPerInfo } from '@/api/examMonth'
import { getUserSameDeptPeople	} from '@/api/person'
export default {
	name: 'ExamMonthPer',
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
				person: [],
				yearmonth: '',
				score: 0
			},
			examTempName: '',
			personName: '',
			tempFullScore: 0,
			tempsTarget: [],
			/* 添加同科室人员 */
			sameDeptPersonParams: []
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
			this.fetchExamMonthPerInfo()
		} else {
			this.fetchExamTarget() //拉取考核指标
			this.getSameDeptPersonParams() //拉取同科室人员参数列表 用于受检人员
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
		/* 获取人员月度考核结果 */
		fetchExamMonthPerInfo() {
			var self = this
			self.personName = self.$route.query.personName
			const per = self.$route.query.person
			self.examMonth.person.push(per)
			const examMonthPerQuery = {
				yearmonth: self.examMonth.yearmonth,
				examTemp: self.examMonth.examTemp,
				person: self.$route.query.person,
				execUser: self.examMonth.execUser //用于拉取模板明细
			}
			getExamMonthPerInfo(examMonthPerQuery).then(res => {
				self.tempsTarget = res.data.tempsTargets
				self.tempFullScore = res.data.fullScore
				self.examMonth.score = res.data.score
				self.accountStatus = res.data.accountStatus
			})
		},
		/* 获取要考核的同科室人员 */
		getSameDeptPersonParams() {
			var self = this
			const query = {
				userId: self.examMonth.execUser
			}
			getUserSameDeptPeople(query).then(res => {
				self.sameDeptPersonParams = res.data
			})
		},
		/* 提交人员考核评分 */
		submitScore() {
			var self = this
			const examData = self.examMonth
			if (examData.person.length === 0) {
				this.$notify({
          title: '警告',
					message: '必须选择受检人员',
          type: 'warning'
        })
				return
			}
			submitExamPerScore(examData).then(res => {
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
