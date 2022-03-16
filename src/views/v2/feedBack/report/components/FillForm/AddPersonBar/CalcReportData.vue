<template>
	<span>
		
		<!-- 填报计算值 -->
		<!-- <count-to
		  :start-val="0"
		  :end-val="feedBackVal"
		  :duration="300"
		  :separator="','"
			:decimals="2"
			prefix="科室绩效1: "
		  :autoplay="true"
			class="ml-10"/>
		<count-to
		  :start-val="0"
		  :end-val="fillVal"
		  :duration="300"
		  :separator="','"
			:decimals="2"
			prefix="已填报: "
		  :autoplay="true"
			class="ml-10"/>
		<count-to
		  :start-val="0"
		  :end-val="restVal"
		  :duration="300"
		  :separator="','"
			:decimals="2"
			prefix="剩余: "
		  :autoplay="true"
			class="ml-10"/> -->
		
	</span>
</template>

<script>
import countTo from 'vue-count-to'
export default {
	name: 'calc-report-data',
	components: { countTo }, 
	props: {
		feedBackVal: Number,  // 下发分配总计
		fillVal: Number,  // 已填报
		restVal: Number  // 剩余
	},

}
</script>

<style>
</style>
