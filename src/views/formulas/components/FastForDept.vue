<template>
  <el-form
    :model="fastDeptForm"
    ref="fastDeptForm">
    <el-form-item label="适用公式" prop="selectedDeptFormulas">
      <el-select
        v-model="fastDeptForm.selectedDeptFormulas"
        placeholder="请选择适用的科室公式,不选择默认全部"
        filterable clearable multiple
        style="width: 350px;">
        <el-option
        	v-for="item in formulas"
        	:key="item.id"
        	:label="item.name"
        	:value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="匹配编码" prop="code">
      <el-input
        placeholder="输入科室编码,匹配多个编码使用','分割(如: 1,2,3,0)"
        v-model.trim="fastDeptForm.code"
        style="width: 600px;">
        <el-select
          v-model="fastDeptForm.codeFlag"
          slot="prepend" placeholder="匹配方式"
          style="width: 130px;">
          <el-option label="包含" value="contains"></el-option>
          <el-option label="开头匹配" value="containStart"></el-option>
          <el-option label="结尾匹配" value="containEnd"></el-option>
          <el-option label="等于" value="equal"></el-option>
        </el-select>
      </el-input>
    </el-form-item>
    <el-form-item label="类型">
      <el-checkbox-group v-model="fastDeptForm.type">
        <el-checkbox label="项目"></el-checkbox>
        <el-checkbox label="科室"></el-checkbox>
        <el-checkbox label="主任组"></el-checkbox>
        <el-checkbox label="治疗组"></el-checkbox>
        <el-checkbox label="护理组"></el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="类别">
      <el-checkbox-group v-model="fastDeptForm.category">
        <el-checkbox label="门诊"></el-checkbox>
        <el-checkbox label="住院"></el-checkbox>
        <el-checkbox label="医技"></el-checkbox>
        <el-checkbox label="行政"></el-checkbox>
        <el-checkbox label="门诊住院"></el-checkbox>
        <el-checkbox label="其他"></el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item>
      <el-button type="danger" size="small"
        @click="execDelFormulaDept" plain>去除</el-button>
      <el-button type="success" size="small"
        @click="execAddFormulaDept" plain>添加</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { fastDeleteFormulaDept,
         fastAddFormulaDept } from '@/api/bnsFormula'
export default {
  props: {
  	deptFormulas: {
  		type: Array
  	}
  },
  name: 'FastForDept',
  data() {
  	return {
      formulas: [], //科室公式
      fastDeptForm: {
        selectedDeptFormulas: [], //选中的科室公式
        codeFlag: '', //筛选编码 包含 开头匹配 结尾匹配 等于
        code: '', //科室编码
        type: [], //科室类型
        category: [] //科室类别
      }
  	}
  },
  created() {
  	this.formulas = this.deptFormulas
  },
  methods: {
    execDelFormulaDept() {
      const isDelAll = this.testFastDeptForm()
      if (isDelAll) {
        this.$confirm('此操作将删除所有适用科室及其当前核算结果, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteFormulaDept()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消去除全部适用科室'
          });
        });
      } else{
        this.deleteFormulaDept()
      }
    },
    /* 判断筛选条件是否为空 */
    testFastDeptForm() {
      if (this.fastDeptForm.selectedDeptFormulas.length == 0 &&
        (this.fastDeptForm.codeFlag == '' || this.fastDeptForm.code == '') &&
        this.fastDeptForm.type.length == 0 &&
        this.fastDeptForm.category.length == 0) {
        return true;
      }
      return false;
    },
    deleteFormulaDept() {
      const loading = this.$loading({
        lock: true, text: '正在去除符合筛选条件的适用科室',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      const fastDelDept = this.fastDeptForm
      fastDeleteFormulaDept(fastDelDept).then(res => {
        let resStatus = res.status
        if (resStatus == 520) {
          loading.close();
          let msg = res.msg
          this.globalStatusTip(msg)
        }else {
          loading.close();
          this.$notify({
            title: '适用科室删除完成',
            type: 'success',
            duration: 3000
          })
        }
      })
    },
    /* 执行添加科室 */
    execAddFormulaDept() {
      const isAddAll = this.testFastDeptForm()
      if (isAddAll) {
        this.$confirm('此操作将为所有公式添加全部科室, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.addFormulaDept()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消添加全部科室'
          });
        });
      } else{
        this.addFormulaDept()
      }
    },
    addFormulaDept() {
      const loading = this.$loading({
        lock: true, text: '正在添加符合筛选条件的适用科室',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      const fastAddDept = this.fastDeptForm
      fastAddFormulaDept(fastAddDept).then(res => {
        let resStatus = res.status
        if (resStatus == 520) {
          loading.close();
          let msg = res.msg
          this.globalStatusTip(msg)
        }else {
          loading.close();
          this.$notify({
            title: '适用科室添加完成',
            type: 'success',
            duration: 3000
          })
        }
      })
    },
    /* 全局数据占用状态提示 */
    globalStatusTip(msg) {
      this.$confirm(msg, '提示', {
      	type: 'warning',
      	center: true
      }).then(() => {
      	this.$message({
      		type: 'info',
      		message: '稍候重试'
      	})
      }).catch(() => {
      	this.$message({
      		type: 'info',
      		message: '稍候重试'
      	})
      })
    }
  }
}
</script>

<style>
</style>
