<template>
  <el-form
    :model="fastPerForm"
    ref="fastPerForm">
    <el-form-item label="适用公式" prop="selectedPerFormulas">
      <el-select
        v-model="fastPerForm.selectedPerFormulas"
        placeholder="请选择适用的人员公式,不选择默认全部"
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
        placeholder="输入人员编码,匹配多个编码使用','分割(如: 1,2,3,0)"
        v-model.trim="fastPerForm.code"
        style="width: 600px;">
        <el-select
          v-model="fastPerForm.codeFlag"
          slot="prepend" placeholder="匹配方式"
          style="width: 130px;">
          <el-option label="包含" value="contains"></el-option>
          <el-option label="开头匹配" value="containStart"></el-option>
          <el-option label="结尾匹配" value="containEnd"></el-option>
          <el-option label="等于" value="equal"></el-option>
        </el-select>
      </el-input>
    </el-form-item>
    <el-form-item label="人员状态">
      <el-checkbox-group v-model="fastPerForm.status">
        <el-checkbox label="在职"></el-checkbox>
        <el-checkbox label="编外"></el-checkbox>
        <el-checkbox label="离职"></el-checkbox>
        <el-checkbox label="长期病休"></el-checkbox>
        <el-checkbox label="返聘"></el-checkbox>        
        <el-checkbox label="其他"></el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item>
      <el-button type="danger" size="small"
        @click="execDelFormulaPer" plain>去除</el-button>
      <el-button type="success" size="small"
        @click="execAddFormulaDept" plain>添加</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { fastDeleteFormulaPer,
         fastAddFormulaPer } from '@/api/bnsFormula'
export default {
  props: {
  	perFormulas: {
  		type: Array
  	}
  },
  name: 'FastForPer',
  data() {
  	return {
      formulas: [], //人员公式参数
      fastPerForm: {
        selectedPerFormulas: [], //选中的人员公式
        codeFlag: '', //筛选编码 包含 开头匹配 结尾匹配 等于
        code: '', //人员编码
        status: [] //人员状态
      }
  	}
  },
  created() {
  	this.formulas = this.perFormulas
  },
  methods: {
    execDelFormulaPer() {
      const isDelAll = this.testFastPerForm()
      if (isDelAll) {
        this.$confirm('此操作将删除所有适用人员及其当前核算结果, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteFormulaPer()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消去除全部适用人员'
          });
        });
      } else{
        this.deleteFormulaPer()
      }
    },
    /* 判断筛选条件是否为空 */
    testFastPerForm() {
      if (this.fastPerForm.selectedPerFormulas.length == 0 &&
        (this.fastPerForm.codeFlag == '' || this.fastPerForm.code == '') &&
        this.fastPerForm.status.length == 0) {
        return true;
      }
      return false;
    },
    deleteFormulaPer() {
      const loading = this.$loading({
        lock: true, text: '正在去除符合筛选条件的适用人员',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      const fastDelPer = this.fastPerForm
      fastDeleteFormulaPer(fastDelPer).then(res => {
        let resStatus = res.status
        if (resStatus == 520) {
          loading.close();
          let msg = res.msg
          this.globalStatusTip(msg)
        }else {
          loading.close();
          this.$notify({
            title: '适用人员删除完成',
            type: 'success',
            duration: 3000
          })
        }
      })
    },
    /* 执行添加人员 */
    execAddFormulaDept() {
      const isAddAll = this.testFastPerForm()
      if (isAddAll) {
        this.$confirm('此操作将为所有公式添加全部人员, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.addFormulaPer()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消添加全部人员'
          });
        });
      } else{
        this.addFormulaPer()
      }
    },
    addFormulaPer() {
      const loading = this.$loading({
        lock: true, text: '正在添加符合筛选条件的适用人员',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      const fastAddPer = this.fastPerForm
      fastAddFormulaPer(fastAddPer).then(res => {
        let resStatus = res.status
        if (resStatus == 520) {
          loading.close();
          let msg = res.msg
          this.globalStatusTip(msg)
        }else {
          loading.close();
          this.$notify({
            title: '适用人员添加完成',
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
