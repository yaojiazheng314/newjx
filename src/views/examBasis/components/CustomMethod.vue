<template>
<div class="customMethod">
  <div class="total">
    <div class="left">
      <el-button type="success" plain v-for="(item,index) in numList" :key="index" class="num" @click="clickEvent(item)">
        {{item}}
      </el-button>
      <div>目标值 <el-input v-model="targetValue" style="width:132px;" @input="valChange"></el-input></div>
    </div>
    <div class="right">
      <el-button type="warning" plain v-for="(item,index) in otherList" :key="index" class="num" @click="clickEvent(item)">
        {{item}}
      </el-button>
    </div>
  </div>
  <div class="handle">
    <el-button @click="delEvent" type="danger" plain>回删键</el-button>
    <el-button @click="resetEvent" type="danger" plain>重置</el-button>
    <!-- <el-button @click="finalResult">最终结果</el-button> -->
  </div>
  <div class="resultVal">
    <el-input type="textarea" v-model="resultString" disabled>
    </el-input>
  </div>
</div>
</template>

<script>
export default {
  props: ['addBasisForm', 'isChange',"basisId"],
  name: 'CustomMethod',
  data() {
    return {
      numList: [ '1', '2', '3', '4', '5', '6', '7', '8', '9','0','.'],
      otherList: ['+', '-', '*', '/', '(', ')', '=', '目标值', '实际值'],
      // otherList: ['+', '-', '*', '/', '(', ')', '=', '目标值', '实际值','floor'],
      resultVal: [],
      resultString: "",
      targetValue:'',
      dataObj:{
        targetValue: "", //目标值
        expression: "", //表达式
      }
    }
  },
  mounted() {
    //  this.$route.query.basisId  ==>  this.basisId
    if (this.basisId) {
      if (this.isChange) {
        this.resultString = '';
      } else {
        // this.resultVal = [this.addBasisForm.scoringRule];  //数组法
        let scoringRule = JSON.parse(this.addBasisForm.scoringRule)
        this.resultString = scoringRule.expression;
        this.targetValue = scoringRule.targetValue;
        this.changeString();
        this.$emit('getDataList', JSON.stringify(scoringRule))
      }
    }
  },
  methods: {
    changeString() {
      // this.resultString = this.resultVal.join(''); //数组法
      this.dataObj = {...this.dataObj,expression:this.resultString,targetValue:this.targetValue}
      this.$emit('getDataList', JSON.stringify(this.dataObj));
    },
    valChange(){
      this.dataObj = {...this.dataObj,targetValue:this.targetValue};
      this.$emit('getDataList', JSON.stringify(this.dataObj));
    },
    clickEvent(item) {
      // this.resultVal.push(item); //数组法
      this.resultString += item; 
      this.changeString();
    },
    delEvent() {
      this.resultString = this.resultString.substring(0,this.resultString.length-1);
      // this.resultVal.pop(this.resultVal[this.resultVal.length], 1); //数组法
      this.changeString();
    },
    resetEvent() {
      this.resultVal = [];
      this.resultString = "";
      this.targetValue = '';
      this.changeString();
    },
    finalResult() {

    }

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
    padding: 20px 0;
  }

  .el-textarea.is-disabled .el-textarea__inner {
    color: #000;
  }
}
</style>
