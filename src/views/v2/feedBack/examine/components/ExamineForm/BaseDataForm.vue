<template>
	<div class="base-data-container">
		
		<!-- 主题 -->
		<div class="base-data-name">
			<span>{{ parentData.feedBackDeptName }}</span>
			<span 
				style="font-size: 14px; font-weight: normal;">
				{{ yearmonthInfo }}
			</span>
			
			<span
				style="font-size: 14px; margin-left: 10px;"
				:class="parentData.status === 2 ? 'bdf-status-color1' : ''">
				{{ statusInfo }}
			</span>
		</div>
		
		<!-- 分配内容 -->
		<div class="mt-20" style="color: #999;">{{ label1 }}</div>
		<div style="padding: 5px;">
			<div v-html="parentData.reasonContent"></div>
		</div>
		
	</div>
</template>

<script>
export default {
	name: 'fbe-ef-base-data-form',
	props: {
		// {feedBackDeptName, usersName, yearmonth, status, reasonContent}
		parentData: Object  
	},
	data() {
		return {
			label1: "分配方案:"
		}
	},
	computed: {
		yearmonthInfo: function () {
			return `(${this.parentData.yearmonth}绩效分配填报表)`
		},
		statusInfo: function () {
			return this.parentData.status === 2 ? "已审核" : "待审核"
		}
	}
	
}
</script>

<style>
.base-data-container {
	background-color: #F5F2F0;
	padding: 15px 15px 5px;
	font: normal 14px "lucida Grande",Verdana,"Microsoft YaHei";
}

.base-data-name {
	margin-bottom: 8px;
	font: bold 16px "lucida Grande",Verdana,"Microsoft YaHei";
}
.bdf-status-color1 {
	color: #080;
}
</style>
