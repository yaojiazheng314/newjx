<template>
<div class="customMethod">
  <div class="resultVal">
    <div class="targetValue"><h5>目标值 : </h5> {{targetValue}}</div>
    <el-input type="textarea" v-model="resultString" disabled>
    </el-input>
  </div>
</div>
</template>

<script>
export default {
  props: ['addBasisForm'],
  name: 'CustomMethod',
  data() {
    return {
      numList: [ '1', '2', '3', '4', '5', '6', '7', '8', '9','0','.'],
      otherList: ['+', '-', '*', '/', '(', ')', '<', '>', '=', '目标值', '实际值'],
      resultVal: [],
      resultString: "",
      targetValue:''
    }
  },
  mounted() {
        let scoringRule = JSON.parse(this.addBasisForm.scoringRule)
        this.resultString = scoringRule.expression;
        this.targetValue = scoringRule.targetValue;
  },
  methods: {

  },

}
</script>

<style lang="scss">
.customMethod {
  .el-button+.el-button {
    margin: 0;
  }

  .total {
    display: -webkit-flex;
    display: flex;
    justify-content: space-between;

    .left {
      width: 200px;
      display: -webkit-flex;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
    }

    .right {
      padding: 0 50px;
    }

    .num {
      margin: 5px;
    }
  }

  .handle {
    text-align: right;
  }

  .resultVal {
    width: 100%;
    box-sizing: border-box;
  }
  .targetValue{
    font-size: 16px;
    h5{
      display: inline-block;
    }
  }

  .el-textarea.is-disabled .el-textarea__inner {
    color: #000;
  }
}
</style>
