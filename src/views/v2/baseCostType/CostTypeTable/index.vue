<template>
  <div>
    <link-page-title :title="title" :tip="tip" />
    <operate-bar
      :page="CostTypePage.page"
      :totalPage="CostTypePage.totalPage"
      @handlePage="handlePage" />

    <link-table
      ref="linkTable"
      :typePage="CostTypePage"
			:tableEmptyTip="emptyTip"
			:typeStr="'成本类别'"
      @handleSelection="handleSelection"
      @rowClick="rowClick" />

    <operate-bar
      :page="CostTypePage.page"
      :totalPage="CostTypePage.totalPage"
      @handlePage="handlePage" />

  </div>
</template>

<script>
import LinkPageTitle from '@/components/LinkPageTitle'
import LinkTable from '@/components/LinkTable'
import { BaseCostTypePage } from '@/model/base-Cost-type-page'
import { BaseCostType } from '@/model/base-Cost-type'

import OperateBar from './OperateBar'
export default {
  name: 'Cost-type-table',
  components: { LinkPageTitle, LinkTable, OperateBar },
  data() {
    return {
      // attr
      curUserId: this.$store.getters.userID,
      title: "成本类别",
      // page attr
      pageLimit: 20,
			fuzzyQueryName: "",
      // table attr
      tableLoading: false,
			emptyTip: "没有成本类别",
      selectedItems: [],  // 选中的收费类别项
      // data
      CostTypePage: null
    }
  },
  computed: {
    tip() {
			let total = this.CostTypePage.total === undefined ? 0 : this.CostTypePage.total
			let unbindingNum = this.CostTypePage.unbindingNum === undefined ? 0 :
 this.CostTypePage.unbindingNum
      return `(共 ${total} 项成本类别，${unbindingNum} 项未绑定)`
    }
  },
  created() {
    this.CostTypePage = new BaseCostTypePage(this.pageLimit, this.flag, this.curUserId)
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData() {
      this.$refs.linkTable.showLoading(true)
      this.CostTypePage = new BaseCostTypePage(this.pageLimit, this.fuzzyQueryName)
      await this.CostTypePage.doQuery()
      this.$refs.linkTable.showLoading(false)
    },

    /**
     * @description 处理分页查询操作
     * @param {String} flag: "next"/"last"/"jump"
     * @param {Number} pageNum: 跳转到的页面
     */
    handlePage(flag, pageNum) {
      switch (flag) {
        case "next":
          this.CostTypePage.getNextPage();
          break;
        case "last":
          this.CostTypePage.getLastPage();
          break;
        case "jump":
          this.CostTypePage.jumpTo(pageNum);
          break;
      }
    },

    /* ---- mail-table methods ---- */
    handleSelection(val) {
      this.selectedItems = val
    },

    /**
     * @param {Object} row: {id, code, name...}
     */
    rowClick(row) {
      this.$emit('toEditForm', row)
    },

    /* ---- operate-bar methods ---- */

    /* ---- loading ---- */
    showLoading(msg) {
      this.alertMsg = this.$message({
          duration: 0,
          center: true,
          iconClass: 'el-icon-loading',
          customClass: 'alert-msg-success',
          message: msg
        })
    },
    finishLoading(msg, type) {
      this.alertMsg.close()
      this.$message({
        message: msg,
        center: true,
        type: type,
        duration: 6000
      })
    }

  }
}
</script>

<style>
</style>
