<template>
<div class="targetMethod">
  <span>目标值 </span>
  <el-input v-model="targetValue" type="number" size="small" style="width:200px" @change="inputChange"></el-input>
  <el-table :data="dataList" style="width: 100%">
    <el-table-column align="center" prop="minRatio" label="系数">
      <template slot-scope="scope">
        <el-input v-model="scope.row.minRatio" type="number" size="small" @change="handleChange(scope.$index,scope.row)"></el-input>
      </template>
    </el-table-column>
    <el-table-column align="center" prop="symbol" label="" width="20">
    </el-table-column>
    <el-table-column align="center" label="目标值">
      <template slot-scope="scope">
        <el-input v-model="targetValue" type="number" size="small" disabled></el-input>
      </template>
    </el-table-column>
    <el-table-column align="center" prop="minRelation" label="关系运算">
      <template slot-scope="scope">
        <el-select v-model="scope.row.minRelation" @change="handleChange(scope.$index,scope.row)" size="small">
          <el-option v-for="item in computationList" :key="item.value" :label="item.value" :value="item.value">
            <span style="float: left">{{ item.value }}</span>
          </el-option>
        </el-select>
      </template>
    </el-table-column>
    <el-table-column align="center" prop="actualValue" label="实际值" width="70">
    </el-table-column>
    <el-table-column align="center" prop="maxRelation" label="关系运算">
      <template slot-scope="scope">
        <el-select v-model="scope.row.maxRelation" @change="handleChange(scope.$index,scope.row)" size="small">
          <el-option v-for="item in computationList" :key="item.value" :label="item.value" :value="item.value">
            <span style="float: left">{{ item.value }}</span>
          </el-option>
        </el-select>
      </template>
    </el-table-column>
    <el-table-column align="center" prop="maxRatio" label="系数">
      <template slot-scope="scope" v-if="scope.row.maxRelation != ''">
        <el-input v-model="scope.row.maxRatio" type="number" size="small" @change="handleChange(scope.$index,scope.row)"></el-input>
      </template>
    </el-table-column>
    <el-table-column align="center" prop="symbol" label="" width="20">
      <template slot-scope="scope">
        <span v-if="scope.row.maxRelation != ''">{{scope.row.symbol}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" label="目标值">
      <template slot-scope="scope">
        <el-input v-if="scope.row.maxRelation != ''" v-model="targetValue" type="number" size="small" disabled></el-input>
      </template>
    </el-table-column>
    <el-table-column align="center" label="选择得分类型">
      <template slot-scope="scope">
        <el-select v-model="scope.row.scoreType" @change="scoreTypeHandleChange(scope.$index,scope.row)" size="small">
          <el-option v-for="item in scoreTypeList" :key="item.id" :label="item.name" :value="item.id">
            <span style="float: left">{{ item.name }}</span>
          </el-option>
        </el-select>
      </template>
    </el-table-column>
    <el-table-column align="center" prop="secondMethodScore" label="得分">
      <template slot-scope="scope">
        <el-input v-if="scope.row.scoreType == 1 || scope.row.scoreType == 2" v-model="scope.row.secondMethodScore" type="number" size="small" @change="handleChange(scope.$index,scope.row)"></el-input>
      </template>
    </el-table-column>
    <el-table-column align="center" prop="wavyLine" label="" width="20">
      <template slot-scope="scope">
        <span v-if="scope.row.scoreType == 2">{{scope.row.wavyLine}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" prop="secondMethodScoreEnd" label="得分">
      <template slot-scope="scope">
        <el-input v-if="scope.row.scoreType == 2" v-model="scope.row.secondMethodScoreEnd" type="number" size="small" @change="handleChange(scope.$index,scope.row)"></el-input>
      </template>
    </el-table-column>
    <el-table-column label="操作" prop="operator" align="center" width="50">
      <template slot-scope="scope">
        <el-button @click="handleDel(scope.$index)" type="text" size="small">
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="addButton">
    <el-button @click="addEvent">添加</el-button>
  </div>

</div>
</template>

<script>
import {
  saveExamBasis
} from '@/api/exam'
export default {
  props: ['addBasisForm', 'isChange','basisId'],
  name: 'TargetMethod',
  data() {
    return {
      targetValue: '',
      dataList: [{
        minRatio: "",
        symbol: "*",
        targetValue: '',
        minRelation: '',
        actualValue: "实际值",
        maxRelation: '',
        maxRatio: "",
        scoreType: '', //分数类型（1：固定值，2：区间）
        secondMethodScore: "",
        wavyLine:"~",
        secondMethodScoreEnd:""
      }],
      scoreTypeList:[{
        id:1,
        name:'固定值'
      },{
        id:2,
        name:'区间'
      }],
      computationList: [{
        value: '>'
      }, {
        value: '<'
      }, {
        value: '='
      }, {
        value: '≥'
      }, {
        value: '≤'
      }],

    }
  },
  mounted() {
    //  this.$route.query.basisId  ==>  this.basisId
    if (this.basisId) {
      if (this.isChange) {
        this.dataList = [{
          minRatio: "",
          symbol: "*",
          targetValue: '',
          minRelation: '',
          actualValue: "实际值",
          maxRelation: '',
          maxRatio: "",
          scoreType: '', //分数类型（1：固定值，2：区间）
          secondMethodScore: "",
          wavyLine:"~",
          secondMethodScoreEnd:""
        }]
      } else {
        let scoringRule = JSON.parse(this.addBasisForm.scoringRule);
        this.dataList = scoringRule;
        this.targetValue = scoringRule[0].targetValue;
        this.$emit('getDataList', JSON.stringify(this.dataList))
      }
    }
  },
  methods: {
    inputChange() {
      for (let item in this.dataList) {
        this.dataList[item].targetValue = this.targetValue;
      }
      this.$emit('getDataList', JSON.stringify(this.dataList))
    },
    handleChange(index, value) {
      this.dataList.splice(index, 1, value) //替换
      this.$emit('getDataList', JSON.stringify(this.dataList));
    },
    // 类型选择需要单独处理
    scoreTypeHandleChange(index, value){
     this.dataList[index].secondMethodScore = "";
     this.dataList[index].secondMethodScoreEnd = "";
     this.handleChange(index, value);
    },
    addEvent() {
      if (this.dataList.length == 0) {
        this.dataList.push({
          minRatio: "",
          symbol: "*",
          targetValue: this.targetValue,
          minRelation: '',
          actualValue: "实际值",
          maxRelation: '',
          maxRatio: "",
          scoreType: '', //分数类型（1：固定值，2：区间）
          secondMethodScore: "",
          wavyLine:"~",
          secondMethodScoreEnd:""
        })
      } else {
        let dataIndex = this.dataList[this.dataList.length - 1];
        if (dataIndex.minRatio != '' && this.targetValue != '' && dataIndex.minRelation != '' && dataIndex.secondMethodScore != '') {
          this.dataList.push({
            minRatio: "",
            symbol: "*",
            targetValue: this.targetValue,
            minRelation: '',
            actualValue: "实际值",
            maxRelation: '',
            maxRatio: "",
            scoreType: '', //分数类型（1：固定值，2：区间）
            secondMethodScore: "",
            wavyLine:"~",
            secondMethodScoreEnd:""
          })
        } else {
          this.$message({
            type: "warning",
            message: "请先填写当前项"
          });
        }
      }
    },
    handleDel(index) {
      this.$confirm("此操作将永久删除此项, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          this.dataList.splice(index, 1);
          this.$emit('getDataList', JSON.stringify(this.dataList));
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {

        });

    }
  },

}
</script>

<style lang="scss">
.targetMethod {
  .addButton {
    text-align: center;
    margin-top: 20px;
  }
}
</style>
