<template>
  <div class="app-container">
    <div class="filter-container">
			<el-button v-waves 
				type="primary" size="mini"
				@click="handleCreate" round>
			添加职称
			</el-button>
    </div>
	  <el-row :gutter="32">
			<el-col :xs="24" :sm="24" :lg="13">
				<el-table
					:data="list"
					v-loading="listLoading"
					stripe
					style="width: 100%">
					<el-table-column
						prop="code"
						label="职称编码"
						width="160">
					</el-table-column>
					<el-table-column
						prop="name"
						label="名称"
						width="160">
					</el-table-column>
					<el-table-column
						prop="peopleNum"
						label="人数"
						width="180">
					</el-table-column>
					<el-table-column
						prop="level"
						label="等级"
						width="180">
						<template slot-scope="scope">
							<svg-icon 
								v-for="n in +scope.row.level" :key="n" 
								icon-class="star" 
								class="meta-item__icon"/>
						</template>
					</el-table-column>
					<el-table-column
						label="操作"
						width="100">
						<template slot-scope="scope">
							<el-button 
								@click="handleEdit(scope.row)" 
								type="text" size="small">
								编辑
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-col>
			<el-col :xs="24" :sm="24" :lg="8">
				<div class="chart-wrapper">
					<pie-chart 
						v-if="deliverFlag"
						:pieData="professTitleSeriesData">
					</pie-chart>
				</div>
			</el-col>
		</el-row>		
		
		<el-dialog 
			:title="dialogStatus" 
			:show-close="showClose"
			:close-on-click-modal="false"
			:visible.sync="dialogFormVisible">
			<el-form 
				ref="professTitleForm"
				:rules="rules"
				:model="professTitleForm" 
				label-position="left" 
				label-width="70px" 
				style="width: 400px; margin-left:50px;">
				<el-form-item label="职称" prop="name">
					<el-input v-model.trim="professTitleForm.name"></el-input>
				</el-form-item>
				<el-form-item label="编码" prop="code">
					<el-input v-model.trim="professTitleForm.code"></el-input>
				</el-form-item>
				<el-form-item label="等级">
				  <el-rate 
						v-model="professTitleForm.level" 
						:colors="['#99A9BF', '#F7BA2A', '#FF9900']" 
						style="margin-top:8px;"/>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeDialog">返 回</el-button>
				<el-button 
					type="primary" 
					@click="saveProfessTitle()">
					确 定
				</el-button>
			</div>
		</el-dialog>
  </div>
</template>

<script>
import { getProfessTitleList, saveProfessTitle } from '@/api/professTitle'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import PieChart from './components/PieChart'
export default {
  name: 'ProfessTitle',
  components: { Pagination, PieChart },
  directives: { waves },
  data() {
    return {
      list: null,
      listLoading: false,
			professTitleForm: {
				id: '',
				code: '',
				name: '',
				level: null
			},
			dialogFormVisible: false,
			dialogStatus: '',
			showClose: false,
			rules: {
				name: [
            { required: true, message: '请输入职位名称', trigger: 'blur' },
						{ max: 20, message: '长度在20字符以内', trigger: 'blur' }
          ],
        code: [
            { required: true, message: '请输入职位编码', trigger: 'blur' },
						{ max: 20, message: '长度在20字符以内', trigger: 'blur' }
          ]
			},
			deliverFlag: false,
			professTitleSeriesData: {
				title: '人数统计',
				legend: [],
				seriesData: []
			}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
			var self = this
      self.listLoading = true
      getProfessTitleList().then(response => {
        self.list = response.data
				self.listLoading = false
				response.data.map(((item, index)=> {
					self.professTitleSeriesData.seriesData.push({name:item.name, 
						value:item.peopleNum})
					self.professTitleSeriesData.legend.push(item.name)	
				}))
				self.deliverFlag = true
      })
    },
		handleCreate() {
			this.dialogStatus = '新建职位'
			this.dialogFormVisible = true
			this.clearForm()
			this.flushPie()
		},
		handleEdit(row) {
			this.professTitleForm = Object.assign({}, row)
			this.dialogStatus = '编辑职位'
			this.dialogFormVisible = true
			this.flushPie()
		},
		saveProfessTitle() {
			var self = this
			self.$refs['professTitleForm'].validate((valid) => {
        if (valid) {
          saveProfessTitle(self.professTitleForm).then(response => {
						self.$notify({
						  title: '成功',
						  message: response.msg,
						  type: 'success',
						  duration: 6000
						})
						if (self.professTitleForm.id === '' || 
						self.professTitleForm.id === null) {
							//连续创建
							self.clearForm();
							self.$refs['professTitleForm'].clearValidate();
						}
						self.getList()
					})
        } else {
          console.log('error submit!!');
          return false;
        }
      });
		},
		closeDialog() {
			this.dialogFormVisible = false
			this.clearForm();
			this.$refs['professTitleForm'].clearValidate();
			this.getList();
		},
		clearForm() {		
			this.professTitleForm.name = '';
			this.professTitleForm.code = '';
			this.professTitleForm.level = null;
			//清空professTitleForm.id
			this.professTitleForm.id = ''
		},
		//刷新图表
		flushPie() {
			this.deliverFlag = false
			this.professTitleSeriesData.legend = []
			this.professTitleSeriesData.seriesData = []
		}
  },
  
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.chart-wrapper {
  background: #fff;
  padding: 50px 16px 0;
  margin-bottom: 36px;
}

</style>