<template>
<div class="targetMethod">
  <el-table :data="dataList" style="width: 100%">
    <el-table-column align="center" prop="minRatio" label="系数">
      <template slot-scope="scope">
        <el-input v-model="scope.row.minRatio" type="number" size="small"  disabled></el-input>
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
        {{scope.row.minRelation}}
        <!-- <el-select v-model="scope.row.minRelation" disabled size="small">
          <el-option v-for="item in computationList" :key="item.value" :label="item.value" :value="item.value">
            <span style="float: left">{{ item.value }}</span>
          </el-option>
        </el-select> -->
      </template>
    </el-table-column>
    <el-table-column align="center" prop="actualValue" label="实际值" width="70">
    </el-table-column>
    <el-table-column align="center" prop="maxRelation" label="关系运算">
      <template slot-scope="scope">
        {{scope.row.maxRelation}}
        <!-- <el-select v-model="scope.row.maxRelation" disabled size="small">
          <el-option v-for="item in computationList" :key="item.value" :label="item.value" :value="item.value">
            <span style="float: left">{{ item.value }}</span>
          </el-option>
        </el-select> -->
      </template>
    </el-table-column>
    <el-table-column align="center" prop="maxRatio" label="系数">
      <template slot-scope="scope" v-if="scope.row.maxRelation != ''">
        <el-input v-model="scope.row.maxRatio" type="number" size="small" disabled></el-input>
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
        <el-select v-model="scope.row.scoreType" @change="scoreTypeHandleChange(scope.$index,scope.row)" size="small" disabled>
          <el-option v-for="item in scoreTypeList" :key="item.id" :label="item.name" :value="item.id">
            <span style="float: left">{{ item.name }}</span>
          </el-option>
        </el-select>
      </template>
    </el-table-column>
    <el-table-column align="center" prop="secondMethodScore" label="得分">
      <template slot-scope="scope">
        <el-input disabled v-if="scope.row.scoreType == 1 || scope.row.scoreType == 2" v-model="scope.row.secondMethodScore" type="number" size="small" @change="handleChange(scope.$index,scope.row)"></el-input>
      </template>
    </el-table-column>
    <el-table-column align="center" prop="wavyLine" label="" width="20">
      <template slot-scope="scope">
        <span v-if="scope.row.scoreType == 2">{{scope.row.wavyLine}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" prop="secondMethodScoreEnd" label="得分">
      <template slot-scope="scope">
        <el-input disabled v-if="scope.row.scoreType == 2" v-model="scope.row.secondMethodScoreEnd" type="number" size="small" @change="handleChange(scope.$index,scope.row)"></el-input>
      </template>
    </el-table-column>
  </el-table>
</div>
</template>

<script>
import {
  saveExamBasis
} from '@/api/exam'
export default {
  props: ['addBasisForm'],
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
        secondMethodScore: ""
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
        let scoringRule = JSON.parse(this.addBasisForm.scoringRule);
        this.dataList = scoringRule;
        this.targetValue = scoringRule[0].targetValue;
  },
  methods: {
  },

}
</script>

<style lang="scss">
.targetMethod {
  padding:10px;
  .addButton {
    text-align: center;
    margin-top: 20px;
  }
}
</style>
