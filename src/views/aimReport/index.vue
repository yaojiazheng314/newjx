<template>
	<div class="app-container">
		<!-- 目标结果检验年月 -->
		<el-date-picker
			v-model="listQuery.yearmonth"
			type="month"
			placeholder="选择验收年月"
			format="yyyy 年 M 月"
			value-format="yyyy-MM"
			:clearable="false"
			:editable="false">
		</el-date-picker>
		<!-- 查询按钮 -->
		<el-button
		 v-waves
		 size="mini"
		 type="primary"
		 icon="el-icon-search"
		 @click="getList">
			查询
		</el-button>
		<!-- 创建接口按钮 -->
		<el-button
		 v-waves
		 size="mini"
		 type="primary"
		 icon="el-icon-document-checked"
		 @click="saveAimProgressStatus">
			保存
		</el-button>
		<el-divider></el-divider>
		<div class="components-container board">
			<AimBoard 
				:key="1" 
				:list="toDoList" 
				:group="group" 
				class="kanban todo" 
				header-text="待执行" />
			<AimBoard 
				:key="2" 
				:list="workingList" 
				:group="group" 
				class="kanban working" 
				header-text="进行中"/>
			<AimBoard 
				:key="3" 
				:list="doneList" 
				:group="group" 
				class="kanban done" 
				header-text="已完成" />
		</div>
	</div>
</template>
<script>
import { getAimProgressByRespPerson, 
				 keepAimProgressStatus } from '@/api/aim'
import AimBoard from './components/AimBoard'
import { formatDate } from '@/utils/date'
import waves from '@/directive/waves'
export default {
  name: 'AimReport',
  components: {
    AimBoard
  },
	directives: { waves },
  data() {
    return {
			listQuery: {
				yearmonth: '', //目标执行年月
				userID: null //用户id
			},
			list: [], //目标配置列表包含toDo，working、done
			group: 'aimConfig', //列表分组
      toDoList: [],
      workingList: [],
      doneList: []
    }
  },
	mounted() {
		this.setDefaultYearmonth()
		this.getUserInfo()
		this.getList()
	},
	methods: {
		/* 默认年月 */
		setDefaultYearmonth() {
			var self = this
			const month = new Date().getMonth() - 1
			var defYearmonth = new Date(new Date().setMonth(month, 1))
			const ymStr = formatDate(defYearmonth, 'yyyy-MM')
			self.listQuery.yearmonth = ymStr
		},
		/* 获取用户id */
		getUserInfo() {
			this.listQuery.userID = this.$store.getters.userID
		},
		/* 获取目标列表 */
		getList() {
			const query = this.listQuery
			getAimProgressByRespPerson(query).then(res => {
				let resultStatus = res.status
				if (resultStatus == 520) {
					this.$message({
						message: res.msg,
						type: 'error'
					});
				} else if (resultStatus == 200) {
					this.cleanList()
					this.list = res.data
					this.classifyAimProgress()
				}
			})
		},
		/* 清空列表 */
		cleanList() {
			this.list = []
			this.toDoList = []
			this.workingList = []
			this.doneList = []
		},
		/* 将目标进度分类 */
		classifyAimProgress() {
			const aimProgressList = this.list;
			var length = aimProgressList.length;
			for (let i = 0; i < length; i++) {
				let aimProgress = aimProgressList[i];
				let progressStatus = aimProgress.progressStatus;
				if (progressStatus == '待执行') {
					this.toDoList.push(aimProgress)
				} else if (progressStatus == '进行中') {
					this.workingList.push(aimProgress)
				} else if (progressStatus == '已完成') {
					this.doneList.push(aimProgress)
				}
			}
		},
		/* 保存目标进度状态 */
		saveAimProgressStatus() {
			const aimProgressList = []
			const toDoList = this.toDoList
			let todoLength = toDoList.length
			for (let i = 0; i < todoLength; i++) {
				let aimProgress = toDoList[i]
				aimProgress.progressStatus = '待执行'
				aimProgressList.push(aimProgress)
			}
			const workingList = this.workingList
			let workingLength = workingList.length
			for (let i = 0; i < workingLength; i++) {
				let aimProgress = workingList[i]
				aimProgress.progressStatus = '进行中'
				aimProgressList.push(aimProgress)
			}
			const doneList = this.doneList
			let doneLength = doneList.length
			for (let i = 0; i < doneLength; i++) {
				let aimProgress = doneList[i]
				aimProgress.progressStatus = '已完成'
				aimProgressList.push(aimProgress)
			}
			keepAimProgressStatus(aimProgressList).then(res => {
				let resStatus = res.status
				if (resStatus == 200) {
					this.$notify({
					  title: '成功',
					  message: '保存成功',
					  type: 'success',
					  duration: 6000
					})
					this.getList()
				}
			})
		}
	}
}
</script>
<style lang="scss">
.board {
  width: 1450px;
  margin-left: -15px;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: flex-start;
}
.kanban {
  &.todo {
    .board-column-header {
      background: skyblue;
    }
  }
  &.working {
    .board-column-header {
      background: coral;
    }
  }
  &.done {
    .board-column-header {
      background: seagreen;
    }
  }
}
</style>

