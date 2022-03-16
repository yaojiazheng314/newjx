<template>
	<el-carousel 
		height="40px" 
		indicator-position="none"
		:interval="10000"
		style="width: 250px;">
		<el-carousel-item :key="reportItem.feedBackItem">
			<h3 class="small">
				{{ reportItem.feedBackItemName }}</h3>
		</el-carousel-item>
		<el-carousel-item :key="reportItem.yearmonth">
			<h3 class="small">填报年月: {{ reportItem.yearmonth }}</h3>
		</el-carousel-item>
		<el-carousel-item :key="reportItem.feedBackDeptName">
			<h3 class="small">分配科室: {{ reportItem.feedBackDeptName }}</h3>
		</el-carousel-item>
	</el-carousel>
</template>

<script>
export default {
	name: 'ItemInfoTip',
	props: {
	  reportItem: {
	    type: Object,
	    default: null
	  }
	},
}
</script>

<style lang="scss" scoped>
	.el-carousel {
		float: right;
	}
	.el-carousel__item h3 {
	  color: #475669;
	  font-size: 13px;
	  opacity: 0.75;
	  line-height: 40px;
		text-align: center;
	  margin: 0px;
	}
//   .el-carousel__item:nth-child(2n) {
//      background-color: lightgrey;
//   }
// 	.el-carousel__item:nth-child(2n+1) {
//      background-color: lightgrey;
//   }
</style>
