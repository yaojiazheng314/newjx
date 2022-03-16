<template>
<div class="app-container addexamBasis">
  <div class="left">
    <el-card class="box-card">
      <el-form ref="addBasisForm" :rules="addBasisRules" :model="addBasisForm" label-position="right" label-width="100px">
        <el-form-item label="依据名称" prop="name">
          <el-input v-model.trim="addBasisForm.name" style="width:100%;">
          </el-input>
        </el-form-item>
        <el-form-item label="依据描述" prop="basis">
          <el-input type="textarea" :autosize="{ minRows: 6, maxRows: 8}" v-model.trim="addBasisForm.basis" style="width:100%;">
          </el-input>
        </el-form-item>
        <el-form-item label="评分方法" prop="scoringMethod">
          <el-select v-model="addBasisForm.scoringMethod" clearable @change="basisMethodChange" placeholder="选择评分方法">
            <el-option v-for="item in basisMethodList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
  <div class="right" v-if="(addBasisForm.scoringMethod ==  '' || addBasisForm.scoringMethod == 3 || addBasisForm.scoringMethod == 4 || addBasisForm.scoringMethod == 7) ? false : true">
    <el-card class="box-card">
      <IntervalMethod :basisId="basisId" @getDataList="getDataList" :isChange="isChange" :addBasisForm="addBasisForm" v-if="addBasisForm.scoringMethod == 1" />
      <TargetMethod :basisId="basisId" @getDataList="getDataList" :isChange="isChange" :addBasisForm="addBasisForm" v-if="addBasisForm.scoringMethod == 2" />
      <Disposable :basisId="basisId" @getDataList="getDataList" :isChange="isChange" :addBasisForm="addBasisForm" v-if="addBasisForm.scoringMethod == 5" />
      <CustomMethod :basisId="basisId" @getDataList="getDataList" :isChange="isChange" :addBasisForm="addBasisForm" v-if="addBasisForm.scoringMethod == 6" />
    </el-card>
  </div>
  <div class="bottom">
    <el-button @click="cancel" class="guo-btn yellow-btn">取 消</el-button>
    <el-button type="primary" @click="save" class="guo-btn light-blue-btn">保 存</el-button>
  </div>
</div>
</template>

<script>
import waves from "@/directive/waves";
import IntervalMethod from "./components/IntervalMethod";
import TargetMethod from "./components/TargetMethod";
import Disposable from "./components/Disposable";
import CustomMethod from "./components/CustomMethod";
import { getScoringMethods} from "@/api/exam";
import {
  getAimBasis,
  saveAimBasis
} from "@/api/aimLib";
export default {
  name: "AddBasis",
  directives: {
    waves
  },
  components: {
    IntervalMethod,
    TargetMethod,
    Disposable,
    CustomMethod
  },
  props:['basisId','targetId'],
  data() {
    return {
      addBasisRules: {},
      addBasisForm: {
        name: "",
        basis: "",
        scoringMethod: "",      //1:区间法  2：目标值法  3：一票否决  4：单项否决  5：按项数评分  6：自定义  7：一次性评分
      },
      basisMethodList: [],
      scoringRule: "",
      isChange: false

    };
  },
  created() {

  },
  mounted() {
    this.getScoringMethods();
  },
  methods: {
    getScoringMethods() {
      getScoringMethods().then(res => {
        this.basisMethodList = res.data;
      }).then(() => {
        this.getBasis();
      })
    },
    getBasis() {
      // console.log(this.basisId)
      if(this.basisId){
        getAimBasis({
          basisId: this.basisId
        }).then(res => {
          // console.log(res)
          this.addBasisForm = res.data;
        })
      }
    },
    basisMethodChange(val) {
      // console.log(val)
      this.addBasisForm.scoringRule = '';
      this.isChange = true;
    },
    // 保存
    save() {
      let data = {
        id: this.basisId ? this.basisId : null,
        name: this.addBasisForm.name, // 考核依据别名
        basis: this.addBasisForm.basis, // 考核依据介绍
        scoringMethod: this.addBasisForm.scoringMethod, // 评分方法（1.区间法，2.目标值法，3.一票否决，4.单项否决，5.一次性评分，6.自定义）
        scoringRule: this.scoringRule, //打分细则
        operator: this.$store.getters.userID, // 登录帐号的ID
        targetId:this.targetId //指标id
      }
      console.log(data)
      saveAimBasis(data).then(res => {
        this.$message({
          showClose: true,
          message: '操作成功',
          type: 'success'
        });
        this.$emit('getList');
        this.$emit('closeDialog');
      })
    },
    // 取消
    cancel() {
      this.$emit('closeDialog')
    },
    // 获取区间法dalalist
    getDataList(list) {
      console.log(list)
      this.scoringRule = list;
    }

  }
};
</script>

<style lang="scss">
.addexamBasis {
  display: flex;
  display: -webkit-flex;
  flex-wrap: wrap;

  .left {
    width: 30%;
  }

  .right {
    width: 70%;
    max-height: 460px;
    overflow-y: auto;
  }

  .bottom {
    padding-top: 20px;
    padding-right: 20px;
    text-align: right;
    width: 100%;
  }

  .el-select>.el-input,
  .el-select {
    width: 100%;
  }

}
</style>
