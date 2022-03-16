<template>
<div class="app-container examTarget">
  <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
    <el-tab-pane label="科室考核" name="1">
      <Assessment :activeName="activeName" v-if="activeName == 1" />
    </el-tab-pane>
    <el-tab-pane label="个人考核" name="2">
      <Assessment :activeName="activeName" v-if="activeName == 2" />
    </el-tab-pane>
  </el-tabs>
</div>
</template>

<script>
import Assessment from './components/Assessment';
export default {
  name: 'Target',
  components: {
    Assessment
  },
  data() {
    return {
      activeName: '1'

    }
  },

  mounted() {

  },

  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
    }
  }
}
</script>

<style lang="scss">
.examTarget {
  .el-tabs__nav.is-top{
    display: flex;
    display: -webkit-flex;
    text-align: center;
    width: 100%;
  }
  .el-tabs__item{
    flex:1;
    border:0;
  }
  .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
    // border-bottom:1px solid #E4E7ED;
    border:1px solid #409EFF;
    background: #409EFF;
    color: #fff;
  }
}
</style>
