<template>
  <el-card class="box-card-component" style="margin-left:8px;">
    <div slot="header" class="box-card-header">
      <img :src="img">
    </div>
    <div style="position:relative;">
      <guo-thumb :image="avatar" class="guoThumb" />
      <mallki class-name="mallki-text" text="用户信息" />
      <div style="padding-top:45px;" class="progress-item">
				<el-tag type="warning">{{ userInfo.name }}</el-tag>
				<el-tag type="info">{{ userInfo.departmentName }}</el-tag>
				<el-tag>{{ userInfo.positionName }}</el-tag>
				<!-- 修改密码按钮 -->
				<el-button 
					type="text" 
					style="float: right;"
					@click="changePassword">
					修改密码</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'
import GuoThumb from '@/components/GuoThumb'
import Mallki from '@/components/TextHoverEffect/Mallki'
import lifeWork from '@/assets/img/img_merry_christmas.png'
import heart from '@/assets/img/img_christmas_hat.png'
import { getUserInfomation, saveNewPassword } from '@/api/user'
export default {
	name: 'UserInfo',
  components: { GuoThumb, Mallki },
  data() {
    return {
			img: lifeWork,
			avatar: heart,
			userInfo: {
				name: '',
				departmentName: '',
				positionName: '',
				userId: null
			}
    }
  },
// 	computed: {
// 	  ...mapGetters([
// 	    'name',
// 	    'avatar',
// 	    'roles'
// 	  ])
// 	},
  mounted() {
		this.getUserInfo()
	},
	methods: {
		getUserInfo() {
			var self = this
			self.userInfo.userId = self.$store.getters.userID
			const query = self.userInfo
			getUserInfomation(query).then(res => {
				self.userInfo.name = res.data.name
				self.userInfo.departmentName = res.data.departmentName
				self.userInfo.positionName = res.data.positionName
			})
		},
		changePassword() {
			this.$prompt('请输入新密码', '提示', {
				confirmButtonText: '确定',
			  cancelButtonText: '取消',
			  inputPattern: /^\S{6,}$/,
			  inputErrorMessage: '密码不能包含空格，至少6位'
			}).then(({ value }) => {
				this.saveUsersPassword(value)
			}).catch(() => {
			  this.$message({
			    type: 'info',
			    message: '取消修改密码'
			  });       
			});
		},
		saveUsersPassword(value) {
			const appUserRegister = {
				id: this.userInfo.userId,
				password: value
			}
			saveNewPassword(appUserRegister).then(res => {
				let resStatus = res.status
				if (resStatus === 200) {
					this.$message({
						showClose: true,
					  type: 'success',
					  message: '你的新密码是: ' + value
					});
				} else{
					this.$message({
					  type: 'error',
					  message: '未知错误'
					});
				}
			})
		}
	}
}
</script>

<style lang="scss" >
.box-card-component{
  .el-card__header {
    padding: 0px!important;
  }
}
</style>
<style lang="scss" scoped>
.box-card-component {
  .box-card-header {
    position: relative;
    height: 220px;
    img {
      width: 100%;
      height: 100%;
      transition: all 0.2s linear;
      &:hover {
        transform: scale(1.1, 1.1);
        filter: contrast(130%);
      }
    }
  }
  .mallki-text {
    position: absolute;
    top: 0px;
    right: 0px;
    font-size: 20px;
    font-weight: bold;
  }
  .guoThumb {
    z-index: 100;
    height: 70px!important;
    width: 70px!important;
    position: absolute!important;
    top: -45px;
    left: 0px;
    border: 4px solid #fff;
    background-color: #fff;
    margin: auto;
   /* box-shadow: none!important; */
   /* /deep/ .pan-info {
      box-shadow: none!important;
    } */
  }
  .progress-item {
    margin-bottom: 10px;
    font-size: 14px;
  }
  @media only screen and (max-width: 1510px){
    .mallki-text{
      display: none;
    }
  }
}
</style>
