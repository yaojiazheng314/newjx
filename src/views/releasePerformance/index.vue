<template>
  <div class="components-container">
		<el-date-picker
			v-model="resultQuery.yearmonth"
			type="month"
			placeholder="选择月"
			format="yyyy 年 M 月"
			value-format="yyyy-MM"
			:clearable="false"
			:editable="false"
			@change="getReleaseList">
		</el-date-picker>
		<el-button 
			type="primary" 
			@click="releaseFeedBack">保 存</el-button>
		<el-button 
			type="warning" 
			@click="moveToRelease">全部下发
			<i class="el-icon-s-promotion"></i>
		</el-button>
		<el-progress 
			:percentage="releasePercentage"
			:show-text="false"
			style="margin-top: 10px;"
			color="lightblue"></el-progress>
    <div class="editor-container">
      <dnd-list 
				:list1="waitToRelease" 
				:list2="releaseList" 
				list1-title="待发放" 
				list2-title="发放"
				/>
    </div>
  </div>
</template>

<script>
import DndList from './components/DragRelease'
import { formatDate } from '@/utils/date'
import { fetchReleaseList, release } from '@/api/feedBack'

export default {
  name: 'ReleasePerformance',
  components: { DndList },
  data() {
    return {
			resultQuery: {
				yearmonth: ''
			},
      waitToRelease: [],
      releaseList: [],
			releasePercentage: 0
    }
  },
  created() {
		this.setDefaultYearmonth()
    this.getReleaseList()
  },
	watch: {
		'releaseList.length': {
			handler(newValue, oldValue) {
				if (newValue != oldValue) {
					this.calcReleasePercentage()
				}
			}
		}
	},
  methods: {
		setDefaultYearmonth() {
			var self = this
			const month = new Date().getMonth() - 1
			var defYearmonth = new Date(new Date().setMonth(month, 1))
			const ymStr = formatDate(defYearmonth, 'yyyy-MM')
			self.resultQuery.yearmonth = ymStr
		},
    getReleaseList() {
			var self = this
      self.listLoading = true
			let query = {
				yearmonth: self.resultQuery.yearmonth
			}
      fetchReleaseList(query).then(response => {
        self.waitToRelease = response.data.waitList
        self.releaseList = response.data.releaseList
      })
			self.listLoading = false
    },
		calcReleasePercentage() {
			var self = this
			let waitNum = 0
			for (var i in self.waitToRelease) {
				waitNum++
			}
			let releaseNum = 0
			for (var i in self.releaseList) {
				releaseNum++
			}
			let sumVal = waitNum + releaseNum === 0 ? 1 : waitNum + releaseNum
			self.releasePercentage = (releaseNum / sumVal) * 100
		},
		releaseFeedBack() {
			var self = this
			let data = self.releaseList
			if (data.length === 0) {
				const f = {
					feedBackItem: null,
					feedBackItemName: '',
					yearmonth: self.resultQuery.yearmonth,
					deptNum: 0,
					sumVal: 0
				}
				data.push(f)
			}
			release(data).then(res => {
				self.$notify({
				  title: '成功',
				  message: '下发更新完成',
				  type: 'success',
				  duration: 6000
				})
				self.getReleaseList()
			})
		},
		moveToRelease() {
			var self = this
			self.waitToRelease.map(v => {
				self.releaseList.push(v)
			})
			self.releaseFeedBack()
		}
  }
}
</script>


