<template>
	<div>
		<span class="fbrd-card-title">
			{{ title }}
		</span>
		
		<el-card 
			class="fbrd-card"
			:body-style="{ padding: '20px' }">
			
			<span 
				style="float: right;"
				class="text-btn pointer mr-10 mt-10"
				@click="clickCollectReport">
				{{ btnLable1 }}
			</span>
			
			<div 
				style="padding: 20px; margin-top: 35px;">
				<!-- 渲染分配信息列表 -->
				<div v-if="hasData">
					<el-row :gutter="15">
						<!-- 单行加载3个信息卡片 -->
						<el-col 
							style="margin-bottom: 10px;"
							:span="8"
							v-for="(item, index) in items" 
							:key="index">
							<dept-info-card :item="item" />
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
		
		<!-- 汇总表 -->
		<collect-report
			v-if="dialogVisible"
			:dialogVisible="dialogVisible"
			:yearmonth="yearmonth"
			:userID="userId"
			@closeCRDialog="closeCRDialog">
		</collect-report>
	</div>
</template>

<script>
import DeptInfoCard from './DeptInfoCard'
import CollectReport from './CollectReport'
export default {
	name: 'fbr-dashboard-reported-card',
	components: { DeptInfoCard, CollectReport },
	props: {
		reportedList: Array,  // 已上报科室分配项列表
		yearmonth: String,
		userId: Number
	},
	data() {
		return {
			// attr
			title: "已上报",
			hasData: false,  // 是否有数据
			 btnLable1: "",
			emtpyText: "暂无分配上报内容",
			dialogVisible: false,
			// data
			items: []  // 未上报分配项列表
		}
	},
	created() {
		this.items = this.reportedList
		if (this.items.length > 0) {
			this.hasData = true
		} else {
			this.hasData = false
		}
	},
	methods: {
		// 查看汇总表
		clickCollectReport() {
			this.dialogVisible = true
		},
		closeCRDialog() {
			this.dialogVisible = false
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
	background: #008489;
	color: #fff;
	border-radius: 5px;
	position: relative;
	top: 45px;
}
</style>
