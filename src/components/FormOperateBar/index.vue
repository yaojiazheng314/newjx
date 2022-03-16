<template>
  <div 
    style="border-bottom: 1px solid #aac1de;"
    class="operate-bar">

    <!-- 返回 -->
    <el-button
      class="handle-button"
      size="small"
      icon="el-icon-back"
      @click="clickBtn('clickReturnBtn')">
      {{ returnBtn }}
    </el-button>

    <el-divider direction="vertical" />

    <el-button
      v-for="(item, index) in buttons" :key="index"
      :class="btnClass(item)"
      size="small"
      @click="clickBtn(item.clickMethod)">
      {{ item.label }}
    </el-button>
		
		<!-- last next buttons -->
		<div 
			class="operate-bar-pagiantion">
			
			<span class="mr-10">{{ lastOrNextTip }}</span>
			
			<div
			  v-if="showLast"
			  class="text-btn pointer mr-5"
			  @click="clickBtn('clickLast')">
			  {{ labelLast }}
			</div>
			<div
			  v-if="showNext"
			  class="text-btn pointer mr-5"
			  @click="clickBtn('clickNext')">
			  {{ labelNext }}
			</div>
			
		</div>
		
  </div>
</template>

<script>
export default {
  name: "form-operate-bar",
  props: {
    parentBtns: Array,
		// 总项数
		totalNum: {
		  type: Number,
		  default: 0
		},
		// 当前项数
		currentNum: {
			type: Number,
			default: 0
		}
  },
  data() {
    return {
      buttons: [],  // Button{label, clickMethod}
      returnBtn: "返回",
			
			labelLast: "上一个",
			labelNext: "下一个"
    }
  },
	computed: {
		lastOrNextTip() {
			return `当前：${this.currentNum} / ${this.totalNum}`
		},
		showLast() {
			if (this.totalNum === 1) {
			  return false
			}
			return this.currentNum > 1
		},
		showNext () {
			if (this.totalNum === 1 || this.currentNum === this.totalNum) {
			  return false
			}
			return true
		}
	},
  created() {
    this.buttons = this.parentBtns
  },
  methods: {
    clickBtn(clickMethod) {
      this.$emit(clickMethod)
    },
		
		btnClass(button) {
			if (button.btnClass !== undefined && button.btnClass !== '') {
				return button.btnClass
			}
			return 'handle-button'
		}

  }
}
</script>

<style>
</style>
