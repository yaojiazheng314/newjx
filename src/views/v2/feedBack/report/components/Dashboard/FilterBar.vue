<template>
	<div class="filter-container">
		
		<!-- select yearmonth -->
		<el-date-picker
			v-model="yearmonth"
			type="month"
			placeholder="选择填报年月"
			format="yyyy 年 M 月"
			value-format="yyyy-MM"
			:clearable="false"
			:editable="false"
			@change="changeYearmonthSelected">
		</el-date-picker>
		<el-select 
				v-model="department" 
				filterable clearable 
				placeholder="选择或输入科室" 
				class="searchClass" @change="changeDepartmentSelected">
				<el-option 
					v-for="item in departmentParams" 
					:key="item.id" 
					:label="item.name + '_' + item.type" 
					:value="item.id">
					<span style="float: left">{{ item.name }}</span>
					<span style="float: right; color: #8492a6; font-size: 13px">
						{{ item.type }}
					</span>
				</el-option>
			</el-select>
		<!-- do search button -->
		<el-button
			class="handle-button-blue"
			v-waves 
			type="primary"
			size="small"
			@click="clickBtn" >
			{{ labelBtn }}
		</el-button>
		
	</div>
</template>

<script>
import waves from '@/directive/waves'
import { getDepartmentParam} from '@/api/department'
export default {
	name: 'fbr-dashboard-filter-bar',
	directives: { waves },
	props: {
		parentYearmonth: String,
		parentDepartment:Number
	},
	data() {
		return {
			// attr,
			labelBtn: "查 询",
			// data
			yearmonth: "",
			department:null,
			departmentParams: [],
		}
	},
	created() {
		this.yearmonth = this.parentYearmonth
		this.department = this.parentDepartment
	},
	mounted() {
		this.getDepartmentParams()
	},
	methods: {

		// change parentYearmonth
		changeYearmonthSelected() {
			this.$emit('changeYearmonth', this.yearmonth)
		},
		changeDepartmentSelected(){
			this.$emit('changeDepartment', this.department)
		},
		clickBtn() {
			this.$emit('reloadData')
		},
		getDepartmentParams() {
				getDepartmentParam().then(response => {
					this.departmentParams = response.data
				})
			},
	}
}
</script>

<style>
</style>
