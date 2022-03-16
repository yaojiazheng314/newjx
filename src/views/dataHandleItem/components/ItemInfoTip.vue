<template>
	<el-carousel 
		height="40px" 
		indicator-position="none"
		:interval="10000"
		style="width: 250px;">
		<el-carousel-item :key="handleItem.itemID">
			<h3 class="small">
				{{ handleItem.itemName }}</h3>
		</el-carousel-item>
		<el-carousel-item :key="handleItem.yearmonth">
			<h3 class="small">填报年月: {{ handleItem.yearmonth }}</h3>
		</el-carousel-item>
		<el-carousel-item :key="handleItem.type">
			<h3 class="small">因子类型: {{ handleItem.type === 'excelDept' ? '科室' : handleItem.type === 'excelPer' ? '人员' : handleItem.type }}</h3>
		</el-carousel-item>
	</el-carousel>
</template>

<script>
export default {
	name: 'HandleFill',
	props: {
	  handleItem: {
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
