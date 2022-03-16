<template>
	<div class="app-container">
    <!-- 背景 -->
    <vue-particles
      v-if="particlesStatus"
      color="#dedede"
      class="particles-js">
    </vue-particles>
    <div class="filter-container">
      <!-- 科室模糊查询 -->
      <el-select
      	v-model="dataQuery.department"
      	multiple
      	filterable
      	remote
      	reserve-keyword
      	placeholder="输入科室名称/类别/编码查询"
      	:remote-method="remoteMethod"
      	:loading="remoteLoading"
      	size="small" class="fuzzyQuery">
      	<el-option
      		v-for="item in fuzzyQueryDeptParams"
      		:key="item.id"
      		:label="item.name"
      		:value="item.id">
      		<span style="float: left">{{ item.name }}</span>
      		<span style="margin-left: 15px; color: #8492a6; font-size: 13px">
      			{{ item.code }}
      		</span>
      		<span style="float: right; color: #8492a6; font-size: 13px">
      			{{ item.type }}
      		</span>
      	</el-option>
      </el-select>
      <!-- 日期范围 -->
      <el-date-picker
      	size="small"
      	value-format="yyyy-MM-dd"
      	v-model="paramRange"
      	type="daterange"
      	range-separator="至"
      	start-placeholder="开始日期"
      	end-placeholder="结束日期">
      </el-date-picker>
      <!-- 查询按钮 -->
      <el-button
        size="mini" class="ele"
        type="primary" icon="el-icon-search"
        round @click="deptRevenueAnalysis">
        查询
      </el-button>
    </div>
    <!-- 数据分析图表 -->
    <!-- 第一行 -->
    <el-row>
      <!-- 收入人员组成列表 -->
      <el-col :span="10">
        <kdys
          v-if="loadStatus"
          :department="dataQuery.department"
          :startDate="dataQuery.startDate"
          :endDate="dataQuery.endDate"
          class="chart-wrapper"></kdys>
      </el-col>
      <el-col :span="4">
        <!-- 科室收入 住院收入 门诊收入 药品收入 -->
        <kssr
          v-if="loadStatus"
          :department="dataQuery.department"
          :startDate="dataQuery.startDate"
          :endDate="dataQuery.endDate"
          class="chart-wrapper"></kssr>
      </el-col>
      <!-- 收费类别词云 -->
      <el-col :span="8">
        <srlb
          v-if="loadStatus"
          :department="dataQuery.department"
          :startDate="dataQuery.startDate"
          :endDate="dataQuery.endDate"
          class="chart-wrapper"></srlb>
      </el-col>
    </el-row>
    <!-- 第二行 -->
    <el-row>
      <!-- 科室收入对照组成条形图 -->
      <el-col :span="8">
        <kssrzc
          v-if="loadStatus"
          :department="dataQuery.department"
          :startDate="dataQuery.startDate"
          :endDate="dataQuery.endDate"></kssrzc>
      </el-col>
      <el-col :span="8">
      <!-- 科室收入分类 -->
        <kssrfl
          v-if="loadStatus"
          :department="dataQuery.department"
          :startDate="dataQuery.startDate"
          :endDate="dataQuery.endDate"></kssrfl>
      </el-col>
      <!-- 收费类别汇总 -->
      <el-col :span="8">
        <srlbzc
          v-if="loadStatus"
          :department="dataQuery.department"
          :startDate="dataQuery.startDate"
          :endDate="dataQuery.endDate"></srlbzc>
      </el-col>
    </el-row>
    <!-- 第三行 -->
    <el-row>
      <el-col :span="24">
        <!-- 科室日收入表 -->
        <kssrrq
          v-if="loadStatus"
          :department="dataQuery.department"
          :startDate="dataQuery.startDate"
          :endDate="dataQuery.endDate"></kssrrq>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { fuzzyQueryDeptParam	} from '@/api/department'
import Kdys from './components/Kdys'
import Kssr from './components/Kssr'
import Srlb from './components/Srlb'
import Kssrzc from './components/Kssrzc'
import Kssrfl from './components/Kssrfl'
import Srlbzc from './components/Srlbzc'
import Kssrrq from './components/Kssrrq'
export default {
	name: 'DeptRevenue',
  components: { Kdys, Kssr, Srlb,
                Kssrzc, Kssrfl, Srlbzc, Kssrrq },
	data() {
		return {
      remoteLoading: false,
      particlesStatus: false, //加载粒子效果
      fuzzyQueryDeptParams: [], //模糊查询结果
      dataQuery: {
      	department: [],
      	startDate: '',
        endDate: ''
      },
      paramRange: '', //日期参数范围
      loadStatus: false, //图标加载状态
		}
	},
	methods: {
    /* 重新加载子组件 */
    reload() {
    	this.loadStatus = false
    	this.$nextTick(function() {
    		this.loadStatus = true
    	})
    },
    /* 模糊查询要添加的科室 */
    remoteMethod(query) {
    	if (query !== '') {
        this.remoteLoading = true;
    		const search = {
    			keyword: query
    		}
        fuzzyQueryDeptParam(search).then(res => {
    			this.fuzzyQueryDeptParams = res.data
    		})
    		this.remoteLoading = false;
      }else {
        this.fuzzyQueryDeptParams = [];
      }
    },
    /* 校验查询条件是否为空 */
    testDataQueryCondition() {
      if (this.dataQuery.department.length != 0
        && (this.paramRange != '' || this.paramRange.length != 0)) {
        return false
      }
      return true
    },
    /* 查询科室收入数据分析 */
    deptRevenueAnalysis() {
      //加载背景效果
      this.particlesStatus = true
      //未完成 空条件校验
      let emptyCondition = this.testDataQueryCondition()
      if (emptyCondition) {
        this.$message({
          message: '查询条件不能为空',
          type: 'warning'
        });
      }else {
        this.dataQuery.startDate = this.paramRange[0]
        this.dataQuery.endDate = this.paramRange[1]
        this.reload()
      }
    }
	}
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.bg-container {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #000;
  background-size: cover;
  background-repeat: no-repeat;
}
.particles-js {
  position: absolute;
  background-color: #000;
  background-size: cover;
  background-repeat: no-repeat;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.ele{
  position: relative;
}
.chart-wrapper {
  margin-bottom: 6px;
}
</style>
