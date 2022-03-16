<template>
	<el-carousel 
		height="40px" 
		indicator-position="none"
		:interval="10000"
		style="width: 250px;">
		<el-carousel-item :key="feedBackData.feedBackItem">
			<h3 class="small">
				{{ feedBackData.feedBackItemName }}</h3>
		</el-carousel-item>
		<el-carousel-item :key="feedBackData.yearmonth">
			<h3 class="small">填报年月: {{ feedBackData.yearmonth }}</h3>
		</el-carousel-item>
	</el-carousel>
</template>

<script>
export default {
	name: 'FeedBackInfoTip',
	props: {
	  feedBackData: {
	    type: Object,
	    default: null
	  }
	}
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
