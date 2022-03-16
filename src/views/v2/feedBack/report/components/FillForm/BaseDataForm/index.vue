<template>
	<div class="base-data-container">
		<!-- 主题 -->
		<div class="base-data-name">
			<span>{{ parentData.feedBackDeptName }}</span>
			<span 
				style="font-size: 14px; font-weight: normal;">
				{{ yearmonthInfo }}
			</span>
		</div>
		
		<!-- 分配原因说明富文本 -->
		<edit-reason-form 
			ref="reasonForm"
			:parentFulltext="parentData.reasonContent" />
		
	</div>
</template>

<script>
import EditReasonForm from './EditReasonForm'
export default {
	name: 'fbr-ff-base-data-form',
	components: { EditReasonForm },
	props: {
		parentData: Object  // { feedBackDept, feedBackDeptName, user, yearmonth, reason }
	},
	computed: {
		yearmonthInfo: function () {
			return `(${this.parentData.yearmonth}绩效分配填报表)`
		}
	},
	methods: {
		// 获取用于保存的数据
		getSaveData() {
			const reasonContent = this.$refs.reasonForm.getContent()
			const reportDeptReason = {
				yearmonth: this.parentData.yearmonth,
				department: this.parentData.feedBackDept,
				user: this.parentData.user,
				reasonContent: reasonContent
			}
			return reportDeptReason
		}
	}
	
}
</script>

<style>
.base-data-container {
	background-color: #eff5fb;
	padding: 15px 15px 5px;
	font: normal 14px "lucida Grande",Verdana,"Microsoft YaHei";
}

.base-data-name {
	margin-bottom: 8px;
	font: bold 16px "lucida Grande",Verdana,"Microsoft YaHei";
}

</style>
