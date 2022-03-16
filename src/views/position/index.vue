<template>
  <div class="app-container">
    <div class="filter-container">
			<el-button v-waves 
				type="primary" size="mini"
				@click="handleCreate" round>
			添加职位
			</el-button>
    </div>
	
	  <el-table
			:data="list"
			v-loading="listLoading"
			height="560"
			border
			style="width: 100%">
			<el-table-column
				prop="code"
				align="center"
				label="职位编码"
				width="180">
			</el-table-column>
			<el-table-column
				prop="name"
				align="center"
				label="名称"
				width="180">
			</el-table-column>
			<el-table-column
				prop="peopleNum"
				align="center"
				label="人数"
				width="180">
			</el-table-column>
			<el-table-column
				prop="information"
				label="描述">
			</el-table-column>
			<el-table-column
				label="操作"
				align="center"
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
		
		<el-dialog 
			:title="dialogStatus" 
			:show-close="showClose"
			:close-on-click-modal="false"
			:visible.sync="dialogFormVisible">
			<el-form 
				ref="positionForm"
				:rules="rules"
				:model="positionForm" 
				label-position="left" 
				label-width="70px" 
				style="width: 400px; margin-left:50px;">
				<el-form-item label="职位" prop="name">
					<el-input v-model.trim="positionForm.name"></el-input>
				</el-form-item>
				<el-form-item label="编码" prop="code">
					<el-input v-model.trim="positionForm.code"></el-input>
				</el-form-item>
				<el-form-item label="备注" prop="information">
					<el-input
						type="textarea"
						:rows="3"
						placeholder="请输入职位备注信息"
						v-model.trim="positionForm.information">
					</el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeDialog">返 回</el-button>
				<el-button 
					type="primary" 
					@click="savePosition()">
					确 定
					</el-button>
			</div>
		</el-dialog>
  </div>
</template>

<script>
import { getPositionList, savePosition } from '@/api/position'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
export default {
  name: 'Position',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: null,
      listLoading: false,
			positionForm: {
				id: '',
				code: '',
				name: '',
				information: ''
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
          ],
				information: [
					{ max: 100, message: '长度在100字符以内', trigger: 'blur' }
				]
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
      getPositionList().then(response => {
        self.list = response.data
				self.listLoading = false
      })
    },
		handleCreate() {
			this.dialogStatus = '新建职位'
			this.dialogFormVisible = true
			this.clearForm()
		},
		handleEdit(row) {
			this.positionForm = Object.assign({}, row)
			this.dialogStatus = '编辑职位'
			this.dialogFormVisible = true
		},
		savePosition() {
			var self = this
			self.$refs['positionForm'].validate((valid) => {
        if (valid) {
          savePosition(self.positionForm).then(response => {
						self.$notify({
						  title: '成功',
						  message: response.msg,
						  type: 'success',
						  duration: 6000
						})
						if (self.positionForm.id === '' || 
						self.positionForm.id === null) {
							//连续创建
							debugger
							self.clearForm();
							self.$refs['positionForm'].clearValidate();
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
			this.$refs['positionForm'].clearValidate();
			this.getList();
		},
		clearForm() {		
			this.positionForm.name = '';
			this.positionForm.code = '';
			this.positionForm.information = '';
			//清空positionForm.id
			this.positionForm.id = ''
		}
  },
  
}
</script>
