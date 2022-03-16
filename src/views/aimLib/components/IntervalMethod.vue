<template>
<div class="intervalMethod">
  <el-table :data="dataList" style="width: 100%">
    <el-table-column align="center" prop="name" label="开始目标区间">
      <template slot-scope="scope">
        <el-input v-model="scope.row.start" type="number" size="small" @change="handleChange(scope.$index,scope.row)"></el-input>
        <!-- <el-input-number v-model="scope.row.start" :min="1" :max="1000" size="small" @change="handleChange(scope.$index,scope.row)"></el-input-number> -->
      </template>
    </el-table-column>
    <el-table-column align="center" prop="operatorName" label="结束目标区间">
      <template slot-scope="scope">
        <el-input v-model="scope.row.end" type="number" size="small" @change="handleChange(scope.$index,scope.row)"></el-input>
        <!-- <el-input-number v-model="scope.row.end" :min="1" :max="1000" size="small" @change="handleChange(scope.$index,scope.row)"></el-input-number> -->
      </template>
    </el-table-column>
    <el-table-column align="center" prop="operatorName" label="得分">
      <template slot-scope="scope">
        <el-input v-model="scope.row.score" type="number" size="small" @change="handleChange(scope.$index,scope.row)"></el-input>
        <!-- <el-input-number v-model="scope.row.score" :min="1" :max="1000" size="small" @change="handleChange(scope.$index,scope.row)"></el-input-number> -->
      </template>
    </el-table-column>
    <el-table-column label="操作" prop="operator" align="center">
      <template slot-scope="scope">
        <el-button @click="handleDel(scope.$index)" type="text" size="small">
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="addButton">
    <el-button @click="addEvent">添加区间</el-button>
  </div>

</div>
</template>

<script>
import {
  saveAimBasis
} from '@/api/aimLib'
export default {
  props: ["addBasisForm", 'isChange','basisId'],
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
    //  console.log(this.basisId)
    //  this.$route.query.basisId  ==>  this.basisId
    if (this.basisId) {
      if (this.isChange) {
        this.dataList = [{
          start: "",
          end: "",
          score: ""
        }]
      } else {
        // console.log(this.addBasisForm.scoringRule)
        let scoringRule = JSON.parse(this.addBasisForm.scoringRule);
        this.dataList = scoringRule;
        this.$emit('getDataList', JSON.stringify(this.dataList))
      }
    }
  },

  methods: {
    handleChange(index, value) {
      this.dataList.splice(index, 1, value) //替换
      this.$emit('getDataList', JSON.stringify(this.dataList))
    },
    addEvent() {
      if (this.dataList.length == 0) {
        this.dataList.push({
          start: "",
          end: "",
          score: ""
        })
      } else {
        if (this.dataList[this.dataList.length - 1].start != '' && this.dataList[this.dataList.length - 1].end != '' && this.dataList[this.dataList.length - 1].score != '') {
          this.dataList.push({
            start: "",
            end: "",
            score: ""
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
.intervalMethod {
  .addButton {
    text-align: center;
    margin-top: 20px;
  }
}
</style>
