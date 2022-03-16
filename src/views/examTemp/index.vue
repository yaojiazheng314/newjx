<template>
	<div class="app-container">
		<div class="filter-container">
			<!-- 考核模板查询 -->
      <el-input
      size="small" 
      v-model.trim="listQuery.fuzzy"
      @keyup.enter.native="handleFilter" 
      placeholder="请填写您所需要的模板"
      style="width: 200px;" clearable>
    </el-input>
			<!-- 查询按钮 -->
			<el-button
			 v-waves
			 size="mini"
			 type="primary"
			 icon="el-icon-search"
			 @click="handleFilter">
				查询
			</el-button>
			<!-- 创建考核模板按钮 -->
			<el-button
			 v-waves
			 size="mini"
			 type="primary"
			 icon="el-icon-edit"
			 @click="handleCreate">
				添加模板
			</el-button>
		</div>
		<!-- 考核模板列表 名称 模板类型 考核方向 指标数 责任用户 编辑 -->
		<el-table 
			:data="list" 
			v-loading="loading" 
			style="width: 100%">
			<el-table-column prop="name" label="模板名称">
			</el-table-column>
      	<el-table-column prop="assessedText" label="科室/医生">
        <template slot-scope="scope">
          <span>当前{{scope.row.number}}个{{scope.row.assessedText}}</span>
        </template>
			</el-table-column>
      <el-table-column 
				prop="frequencyText" label="时限">
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button 
						@click="handleEdit(scope.row)"
						type="text" size="small">
						修改
					</el-button>
          <el-button 
						@click="handleRemove(scope.row)"
						type="text" size="small">
						删除
					</el-button>
          <!-- <el-button 
						@click="handleApplication(scope.row)"
						type="text" size="small">
						应用为本年模板
					</el-button>
           <el-button 
						@click="handleApplication(scope.row)"
						type="text" size="small">
						应用为下一年模板
					</el-button> -->
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
		<!-- 添加考核模板编辑框 -->
		<edit-dialog
			v-if="editStatus"
			:dialogStatus="dialogStatus" 
			:dialogFormVisible="dialogFormVisible"
			:examTempData="examTempData"
			@closedialog="closedialog"
			@getList="getList"></edit-dialog>
			
		<!-- 模板添加考核指标 -->
		<add-target
			v-if="addTargetStatus"
			:addTargetDialogStatus="addTargetDialogStatus" 
			:addTargetVisible="addTargetVisible"
			:examTempData="examTempData"
			@closeAddTargetDialog="closeAddTargetDialog"
			@getList="getList"
			@getTempParam="getTempParam"></add-target>
			
		<!-- 考核模板添加模板执行用户 -->
		<add-exec-user
			v-if="addExecStatus"
			:addExecDialogStatus="addExecDialogStatus" 
			:addExecVisible="addExecVisible"
			:examTempData="examTempData"
			@closeAddExecDialog="closeAddExecDialog"
			@getList="getList">
		</add-exec-user>
	</div>
</template>

<script>
import waves from '@/directive/waves'
import { getPagedTemps, 
				 getExamTempParam,
         getExamAllTargetParam,
         deleteTemp } from '@/api/exam'
import EditDialog from './components/EditDialog'
import AddTarget from './components/AddTarget'
import AddExecUser from './components/AddExecUser'
export default {
	name: 'Temp',
	components: { EditDialog, AddTarget, AddExecUser },
	directives: { waves },
	data() {
		return {
			list: [],
			total: 0,
			loading: false,
			listQuery: {
				currentPage: 1,
				pagesize: 10,
				fuzzy: '', //查询模板id
			},
			tempParams: [], //模板参数
			targetParams: [], //指标参数
			/* 创建 编辑 考核模板 */
			examTempData: {}, //考核模板实体
			editStatus: false,
			dialogStatus: '',
			dialogFormVisible: false,
			/* 添加考核指标 */
			addTargetStatus: false,
			addTargetDialogStatus: '',
			addTargetVisible: false,
			/* 添加考核模板执行用户 */
			addExecStatus: false,
			addExecDialogStatus: '',
			addExecVisible: false
		}
	},
	created() {
		this.getList()
	},
	mounted() {
		this.getTempParam()
		this.getTargetParam()
	},
	methods: {
		getList() {
			var self = this
			self.loading = true
			const query = self.listQuery
      self.loading = false;
      console.log(query)
			getPagedTemps(query).then(response => {
        console.log(response)
				self.list = response.data.list;
				self.total = response.data.total;
				self.loading = false;
			})
		},
		/* 获取考核模板参数 */
		getTempParam() {
			var self = this
			getExamTempParam().then(res => {
				self.tempParams = res.data
			}) 
		},
		/* 获取考核指标参数 */
		getTargetParam() {
			var self = this
			getExamAllTargetParam().then(res => {
				self.targetParams = res.data
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
		},
		/* 创建 编辑 考核依据 */
		handleCreate() {
      this.$router.push({
      path: '/exam/addTemp'
      })
		},
		handleEdit(data) {
      this.$router.push({
      path: '/exam/addTemp',
        query:{
          id:data.id
        }
      })
    },
    handleRemove(data){
        this.$confirm('此操作将永久删除此项, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 删除
          deleteTemp({
            tempId:data.id
          }).then(res=>{
              this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getList();
          })
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });          
        });
    },
    handleApplication(data){
        this.$confirm('请确认是否应用为本年模板?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 删除
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getList()
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });          
        });

    },
		closedialog() {
			this.editStatus = false
			this.dialogStatus = ''
			this.dialogFormVisible = false
			this.examTempData = {}
		},
		/* 添加考核指标 */
		handleAddTarget(row) {
			this.addTargetStatus = true
			this.addTargetDialogStatus = row.name + '的考核指标'
			this.addTargetVisible = true
			this.examTempData = {
				id: row.id
			}
		},
		closeAddTargetDialog() {
			this.addTargetStatus = false
			this.addTargetDialogStatus = ''
			this.addTargetVisible = false
			this.examTempData = {}
		},
		/* 添加考核模板执行用户 */
		handleAddExec(row) {
			this.addExecStatus = true
			this.addExecDialogStatus = row.name + '的考核执行用户'
			this.addExecVisible = true
			this.examTempData = {
				id: row.id
			}
		},
		closeAddExecDialog() {
			this.addExecStatus = false
			this.addExecDialogStatus = ''
			this.addExecVisible = false
			this.examTempData = {}
		},
	}
}
</script>

<style>
</style>
