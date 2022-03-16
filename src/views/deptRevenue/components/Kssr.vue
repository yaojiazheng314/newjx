<template>
    <el-timeline>
      <el-timeline-item
        v-for="(v, index) in list"
        :key="index"
        :timestamp="queryTimeRange" placement="top">
        <h4 class="word-color">{{ v.revenueName }}</h4>
        <count-to
          :start-val="0"
          :end-val="v.sumVal"
          :duration="1500"
          :separator="','"
        	:decimals="2"
          :autoplay="true"
          class="word-color word-size"/>
      </el-timeline-item>
    </el-timeline>
</template>

<script>
import { getKssrList } from '@/api/dataMonitor'
import countTo from 'vue-count-to'
export default {
  props: {
  	department: {
  		type: Array
  	},
  	startDate: {
  		type: String
  	},
  	endDate: {
  		type: String
  	}
  },
  name: 'Kssr',
  components: { countTo },
  data() {
  	return {
      list: [], //收入列表
      queryTimeRange: ''
  	}
  },
  mounted() {
    this.queryTimeRange = this.startDate+'至'+this.endDate
    //获取住院收入 门诊收入 药品收入
    this.getList()
  },
  methods: {
    getList() {
      const query = {
        departments: this.department,
        startDate: this.startDate,
        endDate: this.endDate
      }
      getKssrList(query).then(res => {
        this.list = res.data
      })
    }
  }
}
</script>

<style scoped>
.word-color{
  color: #fff;
}
.word-size{
  font-size: large;
}
</style>
