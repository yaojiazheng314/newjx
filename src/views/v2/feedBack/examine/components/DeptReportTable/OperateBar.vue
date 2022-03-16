<template>
  <div class="operate-bar">

		<el-button
		  class="handle-button"
		  size="small"
		  @click="clickBtn2">
		  {{ labelBtn2 }}
		</el-button>

    <el-button
      class="handle-button"
      size="small"
      @click="clickBtn1">
      {{ labelBtn1 }}
    </el-button>
		
    <div
      v-if="!loadPageInfo"
      class="operate-bar-pagiantion">
      <span class="mr-10">{{ pageInfo }}</span>
      <div
        v-if="showLast"
        class="text-btn pointer mr-5"
        @click="clickLastPage">
        {{ labelLastPage }}
      </div>
      <div
        v-if="showNext"
        class="text-btn pointer mr-5"
        @click="clickNextPage">
        {{ labelNextPage }}
      </div>

      <el-popover
        v-if="showJump"
        placement="bottom-end"
        width="400"
        trigger="click">
        <div style="align-items: center;">
          <span>跳转至第</span>
          <el-input-number
            size="mini"
            v-model="jumpNum"
            step-strictly
            :min="1" :max="this.totalPage" />
          <span>页</span>
          <el-button
            style="float: right;"
            size="mini"
            @click="clickDoJump">
            {{ btnLabelConfirm }}
          </el-button>
        </div>
        <div
          v-if="showJump"
          slot="reference"
          class="text-btn pointer">
          {{ labelJump }}
        </div>
      </el-popover>
    </div>

  </div>
</template>

<script>
export default {
  name: 'dept-report-table-operate-bar',
  props: {
    page: {
      type: Number,
      default: 1
    },
    // 总页数
    totalPage: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      // button
      labelBtn1: "全部通过审核",
			labelBtn2: "取消上报",
      btnLabelConfirm: "确定",
      // page
      labelLastPage: "上一页",
      labelNextPage: "下一页",
      labelJump: "跳转",
      // data
      jumpNum: 1
    }
  },
  computed: {
    loadPageInfo() {
      return this.totalPage === 0
    },
    pageInfo () {
      return `${this.page}/${this.totalPage} 页`
    },
    showLast () {
      if (this.totalPage === 1) {
        return false
      }
      return this.page > 1
    },
    showNext () {
      if (this.totalPage === 1 || this.page === this.totalPage) {
        return false
      }
      return true
    },
    showJump () {
      return this.totalPage > 1
    }
  },
  methods: {
    // button
		// 全部通过
    clickBtn1() {
			this.$emit('passAll')
    },
		
		// 取消上报
		clickBtn2() {
			this.$emit('cancelReport')
		},
		
    // page
    clickLastPage() {
      this.$emit('handlePage', 'last', this.totalPage)
    },

    clickNextPage() {
      this.$emit('handlePage', 'next', this.totalPage)
    },

    clickDoJump() {
      this.$emit('handlePage', 'jump', this.jumpNum)
    }
  }
}
</script>

<style>
</style>
