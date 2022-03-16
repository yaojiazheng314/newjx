<template>
  <div class="mt-filter-bar">
    <span style="font-size: 14px; color: #798699;">{{ label1 }}</span>
    <span
      style="font-size: 14px; color: #798699;">
      {{ selectionTip }}
    </span>

    <!-- 已读 未读 -->
    <div v-if="showReadFilter">
      <span
        style="margin-left: 20px; font-size: 14px;"
        class="text-btn pointer"
        @click="clickReadBtn">{{ labelRead }}</span>
      <span style="margin-left: 7px; margin-right: 7px;"> - </span>
      <span
        style="font-size: 14px;"
        class="text-btn pointer"
        @click="clickUnReadBtn">{{ labelUnRead }}</span>
    </div>
    
  </div>
</template>

<script>
export default {
  name: "mail-table-filter-bar",
  props: {
    selectNum: Number,  // 选中数
    showReadFilter: {
      required: false,
      type: Boolean,  // 显示已读/未读筛选按钮
      default: false
    }
  },
  data() {
    return {
      label1: "选择：",
      labelBinding: "已绑定",
      labelUnBinding: "未绑定"
    }
  },
  computed: {
    selectionTip: function() {
      return `当前选中${this.selectNum}项`
    }
  },
  methods: {
    clickReadBtn() {

    },

    clickUnReadBtn() {

    }
  }
}
</script>

<style>
.mt-filter-bar {
  display: flex;
  padding: 8px 12px;
  background: #f2f4f6;
  border-top: 1px solid #fff;
  border-bottom: 1px solid #fff;
}
</style>
