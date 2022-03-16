<template>
	
		<div class="filter-container">
			<span class="ml-5 spanShow" >
		
		<span  display:inline-block
			v-if="!showLoading"
			class="text-btn pointer spanShow"
			@click="copyReportPerson">
			{{ clickTip }}
		</span>
		
		<span  class="spanShow" v-else>
			{{ loadingTip }}
		</span>
		
		<span display:inline-block
			class="text-btn pointer ml-5 spanShow"
			@click="addTempPerson">
			{{ label1 }}
		</span>
		
	</span>
		<!--添加临时人员 -->
		<el-dialog :title="dialogTitle" :show-close="showClose" :close-on-click-modal="false" :visible.sync="dialogShow">
      
			<el-input placeholder="姓名" style="width: 200px;" v-model="temp_name">
			</el-input>
			<el-input placeholder="身份证" style="width: 300px;" v-model="temp_id">
			</el-input>
			<el-input  placeholder="卡号" style="width: 300px;" v-model="temp_card">
			</el-input>
			<div slot="footer" class="dialog-footer">
			<el-button @click="addTempPersonRemark" class="guo-btn yellow-btn">
				添加
			</el-button>
			<el-button @click="closeDialog" class="guo-btn green-btn">
				取消
			</el-button>
			</div>
		</el-dialog>
		</div>
</template>

<script>
import { copyReportPersonTemp } from "@/api/feedBackReport";
export default {
  name: "copy-person-temp",
  props: {
    queryData: Object // { feedBackDept, user, yearmonth }
  },
  data() {
    return {
      // attr
      showLoading: false,
      clickTip: "点击此处获取最近一次分配人员",
      loadingTip: "正在获取人员名单, 请稍候...",
      label1: "【添加临时人员】",
      // data
	  options: [],
	  dialogShow:false,
      dialogTitle: "",
      showClose: false,
      temp_name: null,
      temp_id: null,
      temp_card: null
    };
  },
  methods: {
    /* 复制最近一月的该科室、分配项人员 不包含离职人员 */
    copyReportPerson() {
      this.showLoading = true;
      const query = {
        feedBackItem: null,
        feedBackDept: this.queryData.feedBackDept,
        yearmonth: this.queryData.yearmonth,
        userID: this.queryData.user
      };
      copyReportPersonTemp(query).then(res => {
        let status = res.status;
        if (status === 200) {
          this.options = res.data;
          this.$emit("addPerson", this.options);
        } else {
          this.$message({
            message: res.msg,
            duration: 4000,
            showClose: true
          });
        }
        this.showLoading = false;
      });
    },

    addTempPerson() {
      this.dialogShow = true;
      this.dialogTitle = "请输入临时人员的信息";
      // const tempReportVO = {
      // 	person: -1, // 临时人员
      // 	perCode: '000',
      // 	perName: "临时人员",
      // 	perDeptName: "请备注明临时人员的相关信息",
      // 	remark:""
      // }
      // this.$emit('addPerson', [ tempReportVO ])
	},
	
    addTempPersonRemark() {
      if (
        this.temp_name === null || this.temp_name === "" ||
        this.temp_id === null || this.temp_id === "" ||
        this.temp_card === null ||this.temp_card === ""
      ) {
        this.$message({
          message: "姓名、身份证、卡号不能为空，请输入！",
          type: "warning"
        });
      } else {
        const tempReportVO = {
          person: -1, // 临时人员
          perCode: "000",
          perName: "临时人员:"+this.temp_name,
          perDeptName: "",
          remarks:
            "姓名：" +
            this.temp_name +
            "身份证:" +
            this.temp_id +
            "卡号:" +
            this.temp_card
        };
		this.closeDialog();
        this.$emit("addPerson", [tempReportVO]);
      }
      // this.dialogShow = false;
	},
	closeDialog(){
		 this.dialogShow = false;
		  this.temp_name = "";
		  this.temp_id = "";
		  this.temp_card = "";

	}
  }
};
</script>

<style>
.spanShow {
  display: inline-block;
}
</style>
