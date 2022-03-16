<template>
  <div class="app-container">
    <div class="filter-container">
      <el-upload
        style="display: inline-block;"
        ref="uploadExcel"
        action=""
        :limit="limitNum"
        :auto-upload="false"
        accept="xlsx"
        :before-upload="beforeUploadFile"
        :on-change="fileChange"
        :on-exceed="exceedFile"
        :on-success="uploadSuccess"
        :file-list="fileList">
        <el-button slot="trigger" size="mini" icon="el-icon-document-checked"
          type="primary" plain>选择excel</el-button>
        <el-button
          size="mini" icon="el-icon-upload" :loading="updateLoading"
          type="success" plain @click="submitUpload">上传</el-button>
      </el-upload>
      <div v-if="rangeStatus" style="display: inline-block;">
        <el-tag type="info">记录数：{{ insertNum }}</el-tag>
        <el-tag type="info">结算日期范围：{{ jsrq }}</el-tag>
        <el-tag type="info">审核日期范围：{{ shrq }}</el-tag>
      </div>
    </div>
    <el-table
      :data="excelData"
      stripe style="width: 100%"
      height="650" useVirtual>
      <!-- <el-table-column prop="hospNo" align="center" label="定点医疗机构编号" /> -->
      <el-table-column prop="ks" align="center" label="科室" />
      <!-- <el-table-column prop="ksdm" align="center" label="科室编码" /> -->
      <el-table-column prop="xz" align="center" label="医疗组" />
      <!-- <el-table-column prop="xzdm" align="center" label="医疗组编码" /> -->
      <!-- <el-table-column prop="jzlsh" align="center" label="就诊流水号" /> -->
      <!-- <el-table-column prop="djh" align="center" label="单据号" /> -->
      <!-- <el-table-column prop="grbh" align="center" label="个人编号" /> -->
      <!-- <el-table-column prop="yllb" align="center" label="医疗类别" /> -->
      <el-table-column prop="xm" align="center" label="姓名" />
      <el-table-column prop="jsrq" align="center" label="结算日期" />
      <!-- <el-table-column prop="jsrqstr" align="center" label="结算日期转译" /> -->
      <el-table-column prop="bzbm" align="center" label="病种编码" />
      <el-table-column prop="bzmc" align="center" label="病种名称" />
      <el-table-column prop="dsfz" align="center" label="点数法分值" />
      <el-table-column prop="shrq" align="center" label="审核日期" />
      <!-- <el-table-column prop="shrqstr" align="center" label="审核日期转译" /> -->
    </el-table>
  </div>
</template>

<script>
import { uploadMedicalInsurance } from '@/api/uploadExcel'
export default {
  name: "MedicalInsurance",
  data() {
    return {
      limitNum: 1, //限制文件数
      updateLoading: false,
      uploadUserId: null,
      form: {
        file: ''
      },
      fileList: [],
      excelData: [], //导入的数据
      rangeStatus: false,
      insertNum: 0, //插入行数
      jsrq: '', //解析医保结算日期范围
      shrq: '' //解析医保审核时间范围
    }
  },
  created() {
    this.uploadUserId = this.$store.getters.userID
  },
  methods: {
    // 文件超出个数限制时的钩子
    exceedFile(files, fileList) {
      this.$notify.warning({
        title: '警告',
        message: `只能选择 ${this.limitNum} 个文件，当前共选择文件数: ${files.length + fileList.length}`
      });
    },
    // 文件状态改变时的钩子
    fileChange(file, fileList) {
      this.form.file = file.raw
    },
    // 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
    beforeUploadFile(file) {
      let extension = file.name.substring(file.name.lastIndexOf('.')+1)
      let size = file.size / 1024 / 1024
      if (!(extension === 'xlsx' || extension === 'xls')) {
        this.$notify.warning({
          title: '警告',
          message: `只能上传excel（.xlsx）文件`
        });
      }
      if (size > 10) {
        this.$notify.warning({
          title: '警告',
          message: `文件大小不能超过10M`
        });
      }
    },
    //上传
    submitUpload() {
      let file = this.form.file
      //判断文件是否存在 是否是excel格式
      if (file == '' || this.testFileIsillegal(file)) {
        this.$notify.warning({
          title: '警告',
          message: '请选择excel文件上传'
        });
        return
      }
      this.updateLoading = true
      let formData = new FormData()
      formData.append('file', file)
      formData.append('userId', this.uploadUserId)
      uploadMedicalInsurance(formData).then(res => {
        this.uploadSuccess(res, file, this.fileList)
        this.updateLoading = false
      })
    },
    /* 上传成功*/
    uploadSuccess(response, file, fileList) {
      if (response.status === 200) {
        this.$notify.success({
          title: '成功',
          message: response.msg
        });
        debugger
        //清除已完成上传的文件
        this.fileList = []
        this.form.file = ''
        this.excelData = response.data.excelData
        this.rangeStatus = true
        this.insertNum = response.data.insertNum
        this.jsrq = response.data.jsrqRange
        this.shrq = response.data.shrqRange
      }
    },
    //校验文件是否合法
    testFileIsillegal(file) {
      let extension = file.name.substring(file.name.lastIndexOf('.')+1)
      if (!(extension === 'xlsx' || extension === 'xls')) {
        return true;
      }
      return false;
    }
  }
}
</script>

<style>
</style>
