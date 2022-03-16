<template>
  <div>
    <link-page-title :title="title" :tip="tip" />
    <operate-bar
      :page="chargeTypePage.page"
      :totalPage="chargeTypePage.totalPage"
      @handlePage="handlePage" />

    <link-table
      ref="linkTable"
      :typePage="chargeTypePage"
			:tableEmptyTip="emptyTip"
			:typeStr="'收入类别'"
      @handleSelection="handleSelection"
      @rowClick="rowClick" />

    <operate-bar
      :page="chargeTypePage.page"
      :totalPage="chargeTypePage.totalPage"
      @handlePage="handlePage" />

  </div>
</template>

<script>
import LinkPageTitle from '@/components/LinkPageTitle'
import LinkTable from '@/components/LinkTable'
import { BaseChargeTypePage } from '@/model/base-charge-type-page'
import { BaseChargeType } from '@/model/base-charge-type'

import OperateBar from './OperateBar'
export default {
  name: 'charge-type-table',
  components: { LinkPageTitle, LinkTable, OperateBar },
  data() {
    return {
      // attr
      curUserId: this.$store.getters.userID,
      title: "收入类别",
      // page attr
      pageLimit: 20,
			fuzzyQueryName: "",
      // table attr
      tableLoading: false,
			emptyTip: "没有收入类别",
      selectedItems: [],  // 选中的收费类别项
      // data
      chargeTypePage: null
    }
  },
  computed: {
    tip() {
			let total = this.chargeTypePage.total === undefined ? 0 : this.chargeTypePage.total
			let unbindingNum = this.chargeTypePage.unbindingNum === undefined ? 0 :
 this.chargeTypePage.unbindingNum
      return `(共 ${total} 项收入类别，${unbindingNum} 项未绑定)`
    }
  },
  created(){
  this.chargeTypePage = new BaseChargeTypePage(this.pageLimit, this.fuzzyQueryName)
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData() {
      this.$refs.linkTable.showLoading(true)
      this.chargeTypePage = new BaseChargeTypePage(this.pageLimit, this.fuzzyQueryName)
      await this.chargeTypePage.doQuery()
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
          this.chargeTypePage.getNextPage();
          break;
        case "last":
          this.chargeTypePage.getLastPage();
          break;
        case "jump":
          this.chargeTypePage.jumpTo(pageNum);
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
