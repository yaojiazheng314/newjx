<template>
<div class="disposable">
  <el-form ref="disposableForm" :rules="disposableRules" :model="disposableForm" label-position="right" label-width="100px">
    <el-form-item label="总分值" prop="totalScore">
      <el-input v-model.trim="disposableForm.totalScore" style="width:100%;">
      </el-input>
    </el-form-item>
    <el-form-item label="评分类型" prop="scoringType">
      <el-radio v-model="disposableForm.scoringType" label="1">加分制</el-radio>
      <el-radio v-model="disposableForm.scoringType" label="2">减分制</el-radio>
    </el-form-item>
    <el-form-item label="增减分值" prop="changeScore">
      <el-input v-model.trim="disposableForm.changeScore" style="width:100%;">
      </el-input>
    </el-form-item>
    <el-form-item label="增减上限" prop="deductionLimit">
      <el-input v-model.trim="disposableForm.deductionLimit" style="width:100%;">
      </el-input>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
import {
  saveAimBasis
} from '@/api/aimLib'
export default {
  props: ['addBasisForm', 'isChange',"basisId"],
  name: 'Disposable',
  data() {
    return {
      disposableRules: {
        // //树形验证
        // name: [
        //   {
        //     required: true,
        //     message: "输入考核依据别名",
        //     trigger: "blur"
        //   },
        //   {
        //     max: 20,
        //     message: "名称长度在20字符以内",
        //     trigger: "blur"
        //   }
        // ],
        // basis: [
        //   {
        //     required: true,
        //     message: "编辑考核依据",
        //     trigger: "blur"
        //   },
        //   {
        //     max: 500,
        //     message: "考核依据内容长度在500字符以内",
        //     trigger: "blur"
        //   }
        // ]
      },
      disposableForm: {
        totalScore: "",
        scoringType: "1",
        changeScore: "",
        deductionLimit: ""
      },

    }
  },
  mounted() {
    //  this.$route.query.basisId  ==>  this.basisId
    if (this.basisId) {
      if (this.isChange) {
        this.disposableForm = {
          totalScore: "",
          scoringType: "1",
          changeScore: "",
          deductionLimit: ""
        }
      } else {
        let scoringRule = JSON.parse(this.addBasisForm.scoringRule);
        this.disposableForm = scoringRule;
        this.$emit('getDataList', JSON.stringify(this.dataList))
      }
    }

  },
  watch: {
    disposableForm: { //监听的对象
      deep: true, //深度监听设置为 true
      handler: function (newV, oldV) {
        // console.log('watch中：', newV)
        // console.log(newV)
        this.$emit('getDataList', JSON.stringify(newV))
      }
    }
  },
  methods: {

  },

}
</script>

<style lang="scss">

</style>
