<template>
<div class="disposable">
  <el-form ref="disposableForm" :model="disposableForm" label-position="right" label-width="100px">
    <el-form-item label="总分值" prop="totalScore">
      <el-input v-model.trim="disposableForm.totalScore" style="width:100%;" disabled>
      </el-input>
    </el-form-item>
    <el-form-item label="评分类型" prop="scoringType">
      <el-radio v-model="disposableForm.scoringType" label="1" disabled>加分制</el-radio>
      <el-radio v-model="disposableForm.scoringType" label="2" disabled>减分制</el-radio>
    </el-form-item>
    <el-form-item label="增减分值" prop="changeScore">
      <el-input v-model.trim="disposableForm.changeScore" style="width:100%;" disabled>
      </el-input>
    </el-form-item>
    <el-form-item label="增减上限" prop="deductionLimit">
      <el-input v-model.trim="disposableForm.deductionLimit" style="width:100%;" disabled>
      </el-input>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
import {
  saveExamBasis
} from '@/api/exam'
export default {
  props: ['addBasisForm'],
  name: 'Disposable',
  data() {
    return {
      disposableForm: {
        totalScore: "",
        scoringType: "1",
        changeScore: "",
        deductionLimit: ""
      },

    }
  },
  mounted() {
        let scoringRule = JSON.parse(this.addBasisForm.scoringRule);
        this.disposableForm = scoringRule;
  },
  methods: {

  },

}
</script>

<style lang="scss">

</style>
