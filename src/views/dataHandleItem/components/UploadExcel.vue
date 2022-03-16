<template>
  <el-upload
    class="upload-file"
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
</template>

<script>
import { uploadDeptData } from '@/api/uploadExcel'
export default {
  props: {
    itemId: {
      type: Number
    },
    yearmonth: {
      type: String
    },
    userId: {
      type: Number
    }
  },
  name: 'UploadDeptDataExcel',
  data() {
    return {
      limitNum: 1, //限制文件数
      updateLoading: false,
      itemParam: {
        itemId: null,
        yearmonth: '',
        userId: null
      },
      form: {
        file: ''
      },
      fileList: []
    }
  },
  created() {
    this.itemParam.itemId = this.itemId
    this.itemParam.yearmonth = this.yearmonth
    this.itemParam.userId = this.userId
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
      formData.append('itemId', this.itemId)
      formData.append('yearmonth', this.yearmonth)
      formData.append('userId', this.userId)
      uploadDeptData(formData).then(res => {
        let status = res.status
        if (status == 520) {
          this.globalStatusTip(res.msg)
        }else if (status == 200) {
          this.uploadSuccess(res, file, this.fileList)
        }
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
        //清除已完成上传的文件
        this.fileList = []
        this.form.file = ''
        this.$emit('fetchData')
      }
    },
    //校验文件是否合法
    testFileIsillegal(file) {
      let extension = file.name.substring(file.name.lastIndexOf('.')+1)
      if (!(extension === 'xlsx' || extension === 'xls')) {
        return true;
      }
      return false;
    },
    globalStatusTip(msg) {
      this.$confirm(msg, '提示', {
      	type: 'warning',
      	center: true
      }).then(() => {
      	this.$message({
      		type: 'warning',
      		message: '稍候重试'
      	})
      }).catch(() => {
      	this.$message({
      		type: 'warning',
      		message: '稍候重试'
      	})
      })
    }
  }
}
</script>

<style>
.upload-file {
  display: inline-block;
}
</style>
