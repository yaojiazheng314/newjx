<template>
	<div>
		<span class="fbrd-card-title">
			{{ title }}
		</span>
		
		<el-card 
			class="fbrd-card"
			:body-style="{ padding: '20px' }">
			
			<div 
				style="padding: 20px; margin-top: 35px;">
				<!-- 渲染分配信息列表 -->
				<div v-if="hasData">
					<el-row :gutter="15">
						<!-- 单行加载3个科室信息卡片 -->
						<el-col 
							style="margin-bottom: 10px;"
							:span="8" 
							v-for="(item, index) in items" 
							:key="index">
							<dept-info-card 
								:item="item"
								@clickFillBtn="clickFillBtn"/>
						</el-col>
					</el-row>
				</div>
				
				<div 
					v-else
					style="text-align: center;">
					<svg-icon 
						style="width: 5em; height: 5em; padding-top: 5px;"
						iconClass="icon_nothing"></svg-icon>
					<div class="mt-10" style="font-size: 14px;">
						{{ emtpyText }}
					</div>
				</div>
			
			</div>
			
		</el-card>
	</div>
</template>

<script>
import DeptInfoCard from './DeptInfoCard'
export default {
	name: 'fbr-dashboard-unreported-card',
	components: { DeptInfoCard },
	props: {
		unReportedList: Array  // 未上报科室分配项列表
	},
	data() {
		return {
			// attr
			title: "待分配",
			hasData: false,  // 是否有数据
			btnLable1: "填报全部",
			emtpyText: "暂无分配内容",
			// data
			items: []  // 未上报分配项列表
		}
	},
	created() {
		this.items = this.unReportedList
		if (this.items.length > 0) {
			this.hasData = true
		} else {
			this.hasData = false
		}
	},
	methods: {
		/* ---- dept-info-card event ---- */
		/**
		 * @description 点击dept-info-card中的分配填报按钮事件
		 * @param {Object} query: { feedBackDept, feedBackDeptName, yearmonth }
		 */
		clickFillBtn(query) {
			this.$emit('fillDeptFeedBackReport', query)
		}
	}
}
</script>

<style scoped>
.fbrd-card {
	margin-left: 20px;
  min-height: 250px;
}
.fbrd-card-title {
	font-size: 14px;
	font-weight: 400;
	color: #1f2f3d;
	padding: 10px 25px;
	background: #ff6b6f;
	color: #fff;
	border-radius: 5px;
	position: relative;
	top: 45px;
}
</style>
