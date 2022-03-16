<template>
	<div class="app-container">
		<div class="filter-container">
			<el-date-picker
				type="month"
				placeholder="选择验收年月"
				format="yyyy 年 M 月"
				value-format="yyyy-MM"
				:clearable="false"
				:editable="false">
			</el-date-picker>
		</div>
		<div ref="gantt" class="gantt-container"></div>
	</div>
</template>

<script>
import gantt from 'dhtmlx-gantt'  // 引入模块
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css'
import 'dhtmlx-gantt/codebase/locale/locale_cn'
export default {
	name: 'AimMonitor',
	data() {
		return {
			tasks: {
        data: [
          { id: 1, text: 'Task #1', start_date: '15-04-2017', personName: '张总', duration: 3, progress: 0.6 },
          { id: 2, text: 'Task #2', start_date: '18-04-2017', personName: '李总', duration: 3, progress: 0.4 },
          { id: 3, text: 'Task #2-1', start_date: '20-04-2017', personName: '赵总', duration: 3, progress: 0.4, parent: 2 }
        ],
        links: [
          { id: 1, source: 1, target: 2, type: '0' }
        ]
      }
		}
	},
	mounted() {
    // 初始化
    gantt.init(this.$refs.gantt)
    // 数据解析
    gantt.parse(this.$props.tasks)
  }
}
</script>

<style>
.gantt-container {
    height: 650px;
  }
</style>
