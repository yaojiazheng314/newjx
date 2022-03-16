<template>
<div class="intervalMethod">
  <el-table :data="dataList" style="width: 100%">
    <el-table-column align="center" prop="name" label="开始目标区间">
      <template slot-scope="scope">
        <el-input v-model="scope.row.start" type="number" size="small" disabled></el-input>
      </template>
    </el-table-column>
    <el-table-column align="center" prop="operatorName" label="结束目标区间">
      <template slot-scope="scope">
        <el-input v-model="scope.row.end" type="number" size="small" disabled></el-input>
      </template>
    </el-table-column>
    <el-table-column align="center" prop="operatorName" label="得分">
      <template slot-scope="scope">
        <el-input v-model="scope.row.score" type="number" size="small" disabled></el-input>
      </template>
    </el-table-column>
  </el-table>
</div>
</template>

<script>
export default {
  props: ["addBasisForm"],
  name: 'IntervalMethod',
  data() {
    return {
      dataList: [{
        start: "",
        end: "",
        score: ""
      }],
    }
  },
  mounted() {
        let scoringRule = JSON.parse(this.addBasisForm.scoringRule);
        this.dataList = scoringRule;
  },

  methods: {
  
  },

}
</script>

<style lang="scss">

</style>
