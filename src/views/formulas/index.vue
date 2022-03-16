<template>
<div class="app-container">
    <div class="filter-container">
        <el-select v-model="listQuery.formula" filterable clearable placeholder="选择或输入核算公式" class="searchClass">
            <el-option v-for="item in formulaParams" :key="item.id" :label="item.name" :value="item.id">
                <span style="float: left">{{ item.name }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">
                    {{ item.type }}
                </span>
            </el-option>
        </el-select>
         <el-select v-model="listQuery.person" filterable clearable placeholder="选择或输入姓名" class="searchClass">
            <el-option v-for="item in personParams" :key="item.id" :label="item.name + '_' + item.departmentName" :value="item.id">
                <span style="float: left">{{ item.name }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">
                    {{ item.departmentName }}
                </span>
            </el-option>
        </el-select>
        <el-select v-model="listQuery.department" filterable clearable placeholder="选择或输入科室" class="searchClass">
            <el-option v-for="item in departmentParams" :key="item.id" :label="item.name + '_' + item.type" :value="item.id">
                <span style="float: left">{{ item.name }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">
                    {{ item.type }}
                </span>
            </el-option>
        </el-select>
        <el-button v-waves type="primary" size="mini" @click="handleFilter" round>
            查 询
        </el-button>
         <el-tooltip class="item" effect="dark" content="新建核算公式" placement="right">
            <el-button v-waves type="primary" icon="el-icon-edit" size="mini" @click="handleCreate" circle>
            </el-button>
        </el-tooltip>
        <!-- 快速关联 -->
         <el-button v-waves type="info" size="mini" @click="openFastLinkDialog" plain round>
            快速适用
            <i style="color: #20B2AA" class="el-icon-link" />
        </el-button>
    </div>
    <!-- 公式列表 -->
<!-- row-key="id" -->
    <el-table :data="list" v-loading="listLoading" style="width: 100%"  highlight-current-row>
        <el-table-column type="expand">
            <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                    <el-form-item label="公式名称">
                        <span>{{ props.row.name }}</span>
                    </el-form-item>
                    <el-form-item label="状态">
                        <span>{{ props.row.status }}</span>
                    </el-form-item>
                    <el-form-item label="适用类别">
                        <span>{{ props.row.type }}</span>
                    </el-form-item>
                    <el-form-item label="公式类型">
                        <span>{{ props.row.category }}</span>
                    </el-form-item>
                    <el-form-item label="核算精度">
                        <span>{{ props.row.prec }}</span>
                    </el-form-item>
                    <el-form-item label="负值处理">
                        <span>{{ props.row.neg }}</span>
                    </el-form-item>
                    <el-form-item label="公式内容">
                        <span>{{ props.row.body }}</span>
                    </el-form-item>
                </el-form>
            </template>
        </el-table-column>
        <el-table-column prop="name" label="名称">
        </el-table-column>
        <el-table-column prop="status" label="状态" :filters="[{ text: '启用', value: '启用' },

 { text: '禁用', value: '禁用' }]" :filter-method="filterStatus" filter-placement="bottom-end">
            <template slot-scope="scope">
                <el-tag :type="scope.row.status === '启用' ?

'primary' : 'danger'" disable-transitions>{{ scope.row.status }}</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="type" label="适用类别" :filters="[{ text: '科室', value: '科室' },

 { text: '人员', value: '人员' }]" :filter-method="filterType" filter-placement="bottom-end">
            <template slot-scope="scope">
                <el-tag :type="scope.row.type === '科室' ?

'info' : 'warning'" disable-transitions>{{ scope.row.type }}</el-tag>
            </template>
        </el-table-column> 
         <el-table-column prop="body" label="公式内容">
            <template slot-scope="scope">
                <el-button type="text" size="small" @click="handleEditBody(scope.row)">
                    <span v-if="scope.row.body === null ||

scope.row.body === ''">未编辑</span>
                    <span v-else>已编辑</span>
                </el-button>
            </template>
        </el-table-column>
        <el-table-column prop="replaceNum" label="内容替换">
            <template slot-scope="scope">
                <el-button type="text" size="small" @click="handleAddBodyReplace(scope.row)" :disabled="scope.row.body === null || scope.row.body === '' ">
                    <span v-if="scope.row.body === null ||

scope.row.body === ''">公式内容未编辑</span>
                    <span v-else>共{{ scope.row.replaceNum }}项</span>
                </el-button>
            </template>
        </el-table-column>
        <el-table-column prop="departmentNum" label="适用科室">
            <template slot-scope="scope">
                <el-button type="text" size="small" @click="handleAddDepartments(scope.row)" :disabled="scope.row.type !== '科室' ||

scope.row.body === null || scope.row.body === '' ">
                    <span v-if="scope.row.body === null ||

scope.row.body === ''">公式内容未编辑</span>
                    <span v-else>共{{ scope.row.departmentNum }}科室</span>
                </el-button>
            </template>
        </el-table-column>
        <el-table-column prop="personNum" label="适用人员">
            <template slot-scope="scope">
                <el-button type="text" size="small" @click="handleAddPeople(scope.row)" :disabled="scope.row.type !== '人员' ||

scope.row.body === null || scope.row.body === ''">
                    <span v-if="scope.row.body === null ||

scope.row.body === ''">公式内容未编辑</span>
                    <span v-else>共{{ scope.row.personNum }}人员</span>
                </el-button>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
            <template slot-scope="scope">
                <el-button @click="handleEdit(scope.row)" type="text" size="small">
                    编辑
                </el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.currentPage" :page-sizes="[10, 15, 20, 30, 50]" :page-size="listQuery.pagesize" layout="total, sizes, prev, pager, next, jumper" background :total="total">
        </el-pagination>
    </div>
    <!-- 编辑框 -->
    <formula-edit-dialog v-if="editStatus" :dialogStatus="dialogStatus" :dialogFormVisible="dialogFormVisible" :departmentParams="departmentParams" :formulaData="formulaData" @closedialog="closedialog" @getList="getList" @getFormulaParams="getFormulaParams">
    </formula-edit-dialog>
    <!-- 公式内容编辑框 -->
    <formula-body-dialog v-if="bodyStatus" :bodyDialogStatus="bodyDialogStatus" :bodyFormVisible="bodyFormVisible" :formulaParams="formulaParams" :bodyData="formulaData" @closeBodyDialog="closeBodyDialog" @getList="getList" @getFormulaParams="getFormulaParams">
    </formula-body-dialog>
    <!-- 添加替换内容 -->
    <formula-body-replace v-if="replaceStatus" :replaceDialogStatus="replaceDialogStatus" :replaceFormVisible="replaceFormVisible" :replaceData="formulaData" @closeReplaceDialog="closeReplaceDialog" @getList="getList" @getFormulaParams="getFormulaParams">
    </formula-body-replace>
    <!-- 添加手动填报科室 -->
    <add-departments v-if="addDeptStatus" :addDeptDialogStatus="addDeptDialogStatus" :addDeptVisible="addDeptVisible" :formulaData="formulaData" @closeAddDeptDialog="closeAddDeptDialog" @getList="getList">
    </add-departments>
    <!-- 添加手动填报人员 -->
    <add-people v-if="addPerStatus" :addPerDialogStatus="addPerDialogStatus" :addPerVisible="addPerVisible" :formulaData="formulaData" @closeAddPerDialog="closeAddPerDialog" @getList="getList">
    </add-people>
    <!-- 快速适用 -->
    <fast-link v-if="fastStatus" :fastVisible="fastVisible" @closeFastLinkDialog="closeFastLinkDialog" @getList="getList">
    </fast-link>
</div>
</template>

<script>
import {
    getFormulaList,
    getFormulaParam,
    saveNewFormulaSeq
} from '@/api/bnsFormula'
import { getPersonParam } from '@/api/person'
import { getDepartmentParam } from '@/api/department'
import waves from '@/directive/waves'
import Sortable from 'sortablejs'
import FormulaEditDialog from './components/FormulaEditDialog'
import FormulaBodyDialog from './components/FormulaBodyDialog'
import FormulaBodyReplace from './components/FormulaBodyReplace'
import AddDepartments from './components/AddDepartments'
import AddPeople from './components/AddPeople'
import FastLink from './components/FastLink'
export default {
    name: 'DataItem',
    components: {
        FormulaEditDialog,
        FormulaBodyDialog,
        FormulaBodyReplace,
        AddDepartments,
        AddPeople,
        FastLink
    },
    directives: { waves },
    data() {
        return {
            list: null,
            total: 0,
            listLoading: false,
            listQuery: {
                currentPage: 1,
                pagesize: 10,
                formula: null,
                person: null,
                department: null
            },
            formulaParams: [],
            personParams: [],
            departmentParams: [],
            editStatus: false,
            dialogStatus: '',
            dialogFormVisible: false,
            formulaData: {},
            bodyStatus: false,
            bodyDialogStatus: '',
            bodyFormVisible: false,
            replaceStatus: false,
            replaceDialogStatus: '',
            replaceFormVisible: false,
            addDeptStatus: false,
            addDeptDialogStatus: '',
            addDeptVisible: false,
            addPerStatus: false,
            addPerDialogStatus: '',
            addPerVisible: false,
            sortable: null,
            oldSeq: [],
            newSeq: [],
            /* 快速适用 */
            fastStatus: false,
            fastVisible: false
        }
    },
    created() {
        this.getList()
    },
    mounted() {
        this.getFormulaParams()
        this.getPersonParams()
        this.getDepartmentParams()
    },
    methods: {
        getList() {
            var self = this
            self.listLoading = true
            const query = self.listQuery
            getFormulaList(query).then(response => {
                self.list = response.data.formulas
                self.total = response.data.total
                self.listLoading = false
                this.oldSeq = this.list.map(v => v.id)
                this.newSeq = this.oldSeq.slice()
                this.$nextTick(() => {
                    this.setSort()
                })
            })
        },
        handleFilter() {
            this.listQuery.currentPage = 1
            this.getList()
        },
        handleSizeChange(size) {
            this.listQuery.pagesize = size
            this.getList()
        },
        handleCreate() {
            this.editStatus = true
            this.dialogStatus = '新建核算公式'
            this.dialogFormVisible = true
            this.formulaData = {
                id: null,
                name: '',
                type: '科室',
                category: '结果核算',
                bnsObject: '',
                hosp: null,
                execDepartment: null,
                status: '启用',
                prec: '四舍五入',
                decd: 0,
                neg: '原值',
                body: ''
            }
        },
        handleEdit(data) {
            this.editStatus = true
            this.dialogStatus = '编辑核算公式基础信息'
            this.dialogFormVisible = true
            this.formulaData = data
        },
        closedialog() {
            this.editStatus = false
            this.dialogStatus = ''
            this.dialogFormVisible = false
            this.formulaData = {}
        },
        handleEditBody(data) {
            this.bodyStatus = true
            this.bodyDialogStatus = '编辑[' + data.name + ']的公式内容'
            this.bodyFormVisible = true
            this.formulaData = data
        },
        closeBodyDialog() {
            this.bodyStatus = false
            this.bodyDialogStatus = ''
            this.bodyFormVisible = false
            this.formulaData = {}
        },
        handleAddBodyReplace(data) {
            this.replaceStatus = true
            this.replaceDialogStatus = '编辑[' + data.name + ']的替换内容'
            this.replaceFormVisible = true
            this.formulaData = data
        },
        closeReplaceDialog() {
            this.replaceStatus = false
            this.replaceDialogStatus = ''
            this.replaceFormVisible = false
            this.formulaData = {}
        },
        handleAddDepartments(data) {
            this.addDeptStatus = true
            this.addDeptDialogStatus = '[' + data.name + ']' + '的适用科室'
            this.addDeptVisible = true
            this.formulaData = data
        },
        closeAddDeptDialog() {
            this.addDeptStatus = false
            this.addDeptDialogStatus = ''
            this.addDeptVisible = false
            this.formulaData = {}
        },
        handleAddPeople(data) {
            this.addPerStatus = true
            this.addPerDialogStatus = '[' + data.name + ']' + '的适用人员'
            this.addPerVisible = true
            this.formulaData = data
        },
        closeAddPerDialog() {
            this.addPerStatus = false
            this.addPerDialogStatus = ''
            this.addPerVisible = false
            this.formulaData = {}
        },
        handleCurrentChange(currentPage) {
            this.listQuery.currentPage = currentPage
            this.getList()
        },
        getFormulaParams() {
            getFormulaParam().then(response => {
                this.formulaParams = response.data
            })
        },
        getPersonParams() {
            getPersonParam().then(response => {
                this.personParams = response.data
            })
        },
        getDepartmentParams() {
            getDepartmentParam().then(response => {
                this.departmentParams = response.data
            })
        },
        filterStatus(value, row) {
            return row.status === value
        },
        filterType(value, row) {
            return row.type === value
        },
        setSort() {
            const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0] || null;
            if (el) {
                this.sortable = Sortable.create(el, {
                    ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
                    setData: function (dataTransfer) {
                        dataTransfer.setData('Text', '')
                    },
                    onEnd: evt => {
                        const targetRow = this.list.splice(evt.oldIndex, 1)[0]
                        this.list.splice(evt.newIndex, 0, targetRow)
                        const tempIndex = this.newSeq.splice(evt.oldIndex, 1)[0]
                        this.newSeq.splice(evt.newIndex, 0, tempIndex)
                        this.saveNewSeq()
                    }
                })
            }

        },
        saveNewSeq() {
            var self = this
            self.listLoading = true
            const data = self.newSeq
            saveNewFormulaSeq(data).then(response => {
                self.$notify({
                    title: '成功',
                    message: response.msg,
                    type: 'success',
                    duration: 6000
                })
                self.getList()
            })
        },
        /* 快速适用 */
        openFastLinkDialog() {
            this.fastStatus = true
            this.fastVisible = true
        },
        closeFastLinkDialog() {
            this.fastStatus = false
            this.fastVisible = true
        }
    }
}
</script>

<style>
.demo-table-expand {
    font-size: 0;
}

.demo-table-expand label {
    width: 90px;
    color: #99a9bf;
}

.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
}

.sortable-ghost {
    opacity: .8;
    color: #fff !important;
    background: #42b983 !important;
}
</style><style scoped>
.icon-star {
    margin-right: 2px;
}

.drag-handler {
    width: 20px;
    height: 20px;
    cursor: pointer;
}

.show-d {
    margin-top: 15px;
}
</style>
