<template>
	<div id="fastLink">
		<el-dialog
			title="快速适用科室或人员"
			:show-close="showClose"
			:close-on-click-modal="false"
			:visible.sync="visible"
			width="60%"
			@close="closeDialog">
      <el-tabs type="border-card">
        <el-tab-pane label="适用科室">
          <fast-for-dept
            :deptFormulas="deptFormulas"/>
        </el-tab-pane>
        <el-tab-pane label="适用人员">
          <fast-for-per 
            :perFormulas="perFormulas" />
        </el-tab-pane>
      </el-tabs>
		</el-dialog>
	</div>
</template>

<script>
import { getFormulaParam } from '@/api/bnsFormula'
import FastForDept from './FastForDept'
import FastForPer from './FastForPer'
export default {
	props: {
		fastVisible: {
			type: Boolean
		}
	},
	name: 'FastLink',
  components: { FastForDept, FastForPer },
	data() {
		return {
			showClose: true,
			visible: false,
      deptFormulas: [], //科室公式
      fastDeptForm: {
        selectedDeptFormulas: [], //选中的科室公式
        codeFlag: '', //筛选编码 包含 开头匹配 结尾匹配 等于
        code: '', //科室编码
        type: [], //科室类型
        category: [] //科室类别
      },
			perFormulas: [], //人员公式
      selectedPerFormulas: [] //选中的人员公式
		}
	},
	created() {
		this.visible = this.fastVisible
	},
	mounted() {
    this.getFormulas() //获取公式 并区分科室公式和人员公式
	},
	methods: {
    /* 获取公式并区分公式类型(科室/人员)*/
		getFormulas() {
			var self = this
			getFormulaParam().then(res => {
        let formulas = res.data
        if (formulas != null) {
          let len = formulas.length
          for (let i = 0; i < len; i++) {
            let type = formulas[i].type
            if (type == '科室') {
              self.deptFormulas.push(formulas[i])
            } else if (type == '人员') {
              self.perFormulas.push(formulas[i])
            }
          }
        }
      })
		},
    /* 关闭dialog */
		closeDialog() {
			this.$emit('getList')
			this.$emit('closeFastLinkDialog')
		}
	}
}
</script>

<style>
</style>
