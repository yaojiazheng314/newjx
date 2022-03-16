<template>
	<el-card>
		<div slot="header" class="clearfix">
			<el-button 
				style="padding: 3px 0" 
				icon="el-icon-refresh"
				type="text" 
				@click="reloadMessage">
			</el-button>
			<el-button 
				style="float: right; padding: 3px 0" 
				type="text" @click="leaveMessage">留言
				<i class="el-icon-edit"></i></el-button>
		</div>
		<el-timeline>
			<el-timeline-item 
				:key="item.messageId"
				v-for="item in messages"
				:timestamp="item.submitTime" placement="top">
				<el-card>
					<h4>{{ item.usesDeptName }}  {{ item.usersName }}</h4>
					<p>{{ item.message }}</p>
				</el-card>
			</el-timeline-item>
		</el-timeline>
		<!-- 编辑留言 -->
		<el-dialog
		  v-if="messageStatus"
			title="留言"
			:visible.sync="dialogVisible"
			:close-on-click-modal="false"
			@close="closeMessage"
			width="36%">
			<el-form 
				ref="messageForm" 
				:rules="rules"
				:model="messageForm">
				<el-form-item prop="message">
					<el-input 
						placeholder="写下你的想法..."
						type="textarea" 
						:rows="8"
						v-model.trim="messageForm.message"></el-input>
				</el-form-item>
				 <el-form-item label="全院发送:" prop="isAll" label-width="180">
              <el-radio-group v-model="messageForm.isAll" size="small">
                <el-radio :label="0" border >否</el-radio>
                <el-radio :label="1" border>是</el-radio>
              </el-radio-group>
            </el-form-item>
				<el-form-item label="消息接受科室" prop="deptmentId"  v-if="messageForm.isAll == 0">
					<el-select 
						v-model="messageForm.deptmentId" 
						filterable clearable 
						placeholder="选择科室"
						style="width: 230px;"
						>
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
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button 
					type="primary" 
					size="mini"
					@click="sendMessage">
					发送
					<i class="el-icon-s-promotion"></i>
				</el-button>
			</span>
		</el-dialog>
	</el-card>
</template>

<script>
import { saveMessage, getAllHospMessage } from "@/api/message";
import { getDepartmentParam } from "@/api/department";
export default {
  name: "LeaveMessage",
  inject: ["reload"],
  data() {
    return {
      messageStatus: false,
      dialogVisible: false,
      //留言板
      messageForm: {
        user: null,
        message: "",
		deptmentId: null,
		isAll:0
      },
      departmentParams: [],
      messages: [],
      //留言校验规则
      rules: {
        message: [
          {
            required: true,
            message: "编辑后才能发送留言",
            trigger: "blur"
          },
          {
            max: 1000,
            message: "留言内容在1000字以内",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {
    this.getMessages();
    this.getDepartmentParams();
    this.getUserInfo();
  },
  methods: {
    /* 获取登录用户id */
    getUserInfo() {
      this.messageForm.user = this.$store.getters.userID;
    },
    /* 获取全院的最近5条留言 */
    getMessages() {
      const query = {
        userId: this.$store.getters.userID
      };
      getAllHospMessage(query).then(res => {
        this.messages = res.data;
      });
    },
    /* 打开留言界面 */
    leaveMessage() {
      this.messageStatus = true;
	  this.dialogVisible = true;
	  this.messageForm.isAll = 0;
    },
    /* 关闭留言界面 */
    closeMessage() {
      this.messageStatus = false;
      this.dialogVisible = false;
	  this.messageForm.message = "";
	  this.deptmentId= null;
	  this.isAll=0;
    },
    getDepartmentParams() {
      getDepartmentParam().then(response => {
        this.departmentParams = response.data;
      });
    },
    /* 保存留言 */
    sendMessage() {
	  var self = this;
	  console.log(self.messageForm);
	   if (self.messageForm.isAll === 0 &&  self.messageForm.deptmentId === null) {
		   self.$message({
          message: "未选择科室",
          type: "warning"
		});
		return;
	   }
      self.$refs["messageForm"].validate(valid => {
        if (valid) {
          const data = {
            user: self.messageForm.user,
            message: self.messageForm.message,
			toDepartment: self.messageForm.deptmentId,
			isAll:self.messageForm.isAll
          };
          saveMessage(data).then(res => {
            self.$notify({
              title: "成功",
              message: "留言已发送",
              type: "success",
              duration: 6000
            });
          });
          //清空留言板
          self.cleanMessage();
          //获取最新的留言消息
          self.reload();
        } else {
          return false;
        }
      });
    },
    /* 刷新留言板 */
    reloadMessage() {
      this.reload();
    },
    /* 清空留言板 */
    cleanMessage() {
      this.$refs["messageForm"].clearValidate();
      this.messageForm.message = "";
    }
  }
};
</script>
<style lang="scss" scoped>
</style>