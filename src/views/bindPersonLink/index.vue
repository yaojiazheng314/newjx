<template>
	<div class="app-container">
		<div class="filter-container">
			<!-- 接口人员姓名模糊查询 -->
			<el-autocomplete
				v-model="listQuery.itfPerName"
				:fetch-suggestions="querySearchItfPerName"
				:trigger-on-focus="false"
				placeholder="输入接口人员姓名查询"
				style="width: 230px;">
			</el-autocomplete>	
			<!-- 人员姓名模糊查询 -->
			<el-autocomplete
				v-model="listQuery.perName"
				:fetch-suggestions="querySearchPerName"
				:trigger-on-focus="false"
				placeholder="输入本系统人员姓名查询"
				style="width: 230px;">
			</el-autocomplete>
			<!-- 接口分类 -->
			<el-select 
				v-model="listQuery.syslb" 
				clearable
				placeholder="请选择接口人员来源">
				<el-option
					v-for="item in syslbParams"
					:key="item.value"
					:label="item.value"
					:value="item.value">
				</el-option>
			</el-select>
			<!-- 查询按钮 -->
			<el-button
			 v-waves
			 size="mini"
			 type="primary"
			 icon="el-icon-search"
			 @click="handleFilter">
				查询
			</el-button>
			<!-- 未绑定科室数量 -->
			<el-tag
				type="warning">
				<count-to
					:start-val="0"
					:end-val="unbindingNum"
					:duration="1500"
					:separator="','"
					:decimals="0"
					prefix="剩余: "
					suffix="人员未绑定"
					:autoplay="true"/>
			</el-tag>
			<!-- 推测人员绑定 -->
			<el-button
				v-waves
				size="mini"
				type="primary"
				icon="el-icon-discover"
				@click="perLinkAutoBinding"
				plain round>
				自动绑定
			</el-button>
			<!-- 人员科室轮转 -->
			<el-popover
				placement="bottom"
				width="400"
				trigger="click">
				<el-select 
					v-model="rotateSyslb" 
					placeholder="请选择接口人员来源">
					<el-option
						v-for="item in syslbParams"
						:key="item.value"
						:label="item.value"
						:value="item.value">
					</el-option>
				</el-select>
				<el-button 
					v-waves
					:disabled="rotateSyslb.length == 0"
					type="primary" 
					size="mini"
					style="margin-left: 10px;"
					@click="rotatePersDept"> 执行</el-button>
				<el-button
					slot="reference"
					v-waves
					size="mini"
					type="primary"
					icon="el-icon-bicycle"
					plain round>
					科室轮转
				</el-button>
			</el-popover>
		</div>
		<!-- 科室绑定列表 -->
		<!-- itfPersonCode itfPersonName ksdm ksmc syslb basePerson basePersonName basePersonDeptName select1 -->
		<el-table 
			:data="list" 
			v-loading="loading" 
			style="width: 100%">
			<el-table-column 
				prop="itfPersonCode" 
				label="接口人员编码">
			</el-table-column>
			<el-table-column 
				prop="itfPersonName" 
				label="接口人员姓名">
			</el-table-column>
			<el-table-column
				prop="ksmc"
				label="所属接口科室">
			</el-table-column>
			<el-table-column 
				prop="syslb" 
				label="接口人员来源">
			</el-table-column>
			<el-table-column 
				prop="basePerson" 
				label="绑定本系统人员">
				<template slot-scope="scope">
					<!-- 远程查询本地科室 -->
					<el-select
						v-if="scope.row.edit"
						v-model="scope.row.basePerson"
						filterable clearable
						remote
						reserve-keyword
						placeholder="编码/名称/职位/科室"
						:remote-method="remoteMethod"
						:loading="remoteLoading"
						size="mini">
						<el-option
							v-for="item in fuzzyQueryPerParams"
							:key="item.id"
							:label="item.name"
							:value="item.id">
							<span style="float: left">{{ item.name }}</span>
							<span style="float: right; color: #8492a6; font-size: 13px">
								{{ item.departmentName }}
							</span>
						</el-option>
					</el-select>
					<span v-else>
						{{ scope.row.basePersonName }}
					</span>
				</template>
			</el-table-column>
			<el-table-column
				prop="basePersonDeptName"
				label="本系统科室">
			</el-table-column>
			
			<el-table-column 
				prop="select1" 
				label="接口特殊标识">
				<template slot-scope="scope">
					<el-input
						v-if="scope.row.edit"
						v-model="scope.row.select1" 
						size="mini" />
					<span v-else>{{ scope.row.select1 }}</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="100">
				<template slot-scope="scope">
					<el-button
						v-if="scope.row.edit"
						type="success" size="mini"
						:loading="scope.row.subLoading"
						@click="bindingPerLink(scope.row)">
						绑定
					</el-button>
					<el-button 
						v-else
						@click="editPerLink(scope.row)"
						type="text" size="small">
						编辑
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="pagination-container">
			<el-pagination 
				@size-change="handleSizeChange" 
				@current-change="handleCurrentChange" 
				:current-page="listQuery.currentPage"
				:page-sizes="[10, 15, 20, 25, 30]" 
				:page-size="listQuery.pagesize" 
				layout="total, sizes, prev, pager, next, jumper"
				background
				:total="total">
			</el-pagination>
		</div>
	</div>
</template>

<script>
import waves from '@/directive/waves'
import countTo from 'vue-count-to'
import { fuzzyQueryPerParam,
				 fuzzyQueryPerName } from '@/api/person'
import { fuzzyQueryItfPerName,
				 getItfPerSyslbParam,
				 fetchItfPerLinkList,
				 saveItfPerLink,
				 personLinkautoBinding,
				 rotatePersonsDept } from '@/api/binding'
export default {
	name: 'Basis',
	directives: { waves },
	components: { countTo },
	data() {
		return {
			list: [],
			total: 0,
			loading: false,
			listQuery: {
				currentPage: 1,
				pagesize: 10,
				itfPerName: '', //模糊查询接口人员姓名
				perName: '', //模糊查询本系统人员姓名
				syslb: '' //接口来源分类
			},
			syslbParams: [], //接口来源分类参数
			unbindingNum: 0, //未绑定数量
			//模糊查询科室
			remoteLoading: false,
			fuzzyQueryPerParams: [],
			//科室轮转
			rotateSyslb: '' //人员轮转依据的系统来源
		}
	},
	created() {
		this.getList()
	},
	mounted() {
		this.getSyslbParams()
	},
	methods: {
		getList() {
			var self = this
			self.loading = true
			const query = self.listQuery
			fetchItfPerLinkList(query).then(response => {
				const perLinks = response.data.perLinks
				self.list = perLinks.map(v => {
					self.$set(v, 'edit', false)
					self.$set(v, 'subLoading', false)
					return v
				})
				self.total = response.data.total
				self.unbindingNum = response.data.unbindingNumber
				self.loading = false
			})
		},
		/* 获取接口来源分类参数列表 */
		getSyslbParams() {
			getItfPerSyslbParam().then(res => {
				this.syslbParams = res.data
			})
		},
		/* 获取模糊查询接口科室名称内容 */
		querySearchItfPerName(queryString, cb) {
			let sugParam = {
				keyword: queryString
			}
			fuzzyQueryItfPerName(sugParam).then(res => {
				var suggestions = res.data
				cb(suggestions)
			})
		},
		/* 获取模糊查询本地科室名称内容 */
		querySearchPerName(queryString, cb) {
			let sugParam = {
				keyword: queryString
			}
			fuzzyQueryPerName(sugParam).then(res => {
				var suggestions = res.data
				cb(suggestions)
			})
		},
		/* 模糊查询全院的科室 */
		remoteMethod(query) {
			if (query !== '') {
		    this.remoteLoading = true;
				const search = {
					keyword: query
				}
		    fuzzyQueryPerParam(search).then(res => {
					this.fuzzyQueryPerParams = res.data
				})
				this.remoteLoading = false;
		  }else {
		    this.fuzzyQueryPerParams = [];
		  }
		},
		/* 编辑科室绑定信息 */
		editPerLink(data) {
			data.edit = !data.edit
			const basePersonName = data.basePersonName
			if (basePersonName != undefined &&
				basePersonName != '') {
				this.remoteMethod(basePersonName)
			}
		},
		/* 绑定科室 */
		bindingPerLink(data) {
			data.subLoading = true
			const perLink = {
				id: data.id,
				itfPersonCode: data.itfPersonCode,
				itfPersonName: data.itfPersonName,
				ksdm: data.ksdm,
				syslb: data.syslb,
				basePerson: data.basePerson,
				select1: data.select1
			}
			saveItfPerLink(perLink).then(res => {
				this.$notify({
				  title: '成功',
				  message: data.syslb+data.itfPersonName+'绑定成功',
				  type: 'success',
				  duration: 6000
				})
				data.subLoading = true
				this.getList()
			})
		},
		/* 自动推测绑定人员信息 */
		perLinkAutoBinding() {
			const tip = '此操作需要确认已配置好接口科室绑定信息，推断绑定的结果存在一定不准确性，是否继续？'
			this.$confirm(tip, '提示', {
				confirmButtonText: '确定',
			  cancelButtonText: '取消',
			  type: 'warning'
			}).then(() => {
				this.autoBinding()
			}).catch(() => {
			  this.$message({
			    type: 'info',
			    message: '取消自动绑定'
			  });
			});
		},
		/* 进行自动绑定 */
		autoBinding() {
			const loading = this.$loading({
				lock: true,
			  text: '正在绑定本系统人员信息，请稍候',
			  spinner: 'el-icon-loading',
			  background: 'rgba(0, 0, 0, 0.7)'
			});
			personLinkautoBinding().then(res => {
				let resStatus = res.status
				if (resStatus == 200) {
					this.$message({
					  type: 'success',
					  message: '自动绑定完成，请检查'
					});
					loading.close()
					this.getList()
				}
			})
		},
		/* 人员科室轮转 */
		rotatePersDept() {
			const rotateSyslb = this.rotateSyslb
			const tip = '此操作前请确保'+rotateSyslb+'当前接口人员已所属科室信息准确，是否继续？'
			this.$confirm(tip, '提示', {
				confirmButtonText: '确定',
			  cancelButtonText: '取消',
			  type: 'warning'
			}).then(() => {
				this.execRotation()
			}).catch(() => {
			  this.$message({
			    type: 'info',
			    message: '取消自动绑定'
			  });          
			});
		},
		/* 执行轮转 */
		execRotation() {
			const loading = this.$loading({
				lock: true,
			  text: '正在根据'+this.rotateSyslb+'轮转本系统人员所属科室，请稍候',
			  spinner: 'el-icon-loading',
			  background: 'rgba(0, 0, 0, 0.7)'
			});
			const param = {
				syslb: this.rotateSyslb
			}
			rotatePersonsDept(param).then(res => {
				let resStatus = res.status
				if (resStatus == 520) {
					this.$message({
					  type: 'danger',
					  message: res.msg
					});
					loading.close()
				} else if (resStatus == 200) {
					this.$message({
					  type: 'success',
					  message: '人员科室轮转完成'
					});
					loading.close()
				}
			})
		},
		/* 分页查询 */
		handleFilter() {
			this.listQuery.currentPage = 1
			this.getList()
		},
		handleSizeChange(size) {
			this.listQuery.pagesize = size
			this.getList()
		},
		handleCurrentChange(currentPage) {
			this.listQuery.currentPage = currentPage
			this.getList()
		}
	}
}
</script>
<style>
</style>
