<template>
  <div class="login-container">
    <el-form 
			ref="loginForm" 
			:model="loginForm" 
			:rules="loginRules" 
			class="login-form" auto-complete="on" label-position="left">
      <h3 class="title"  >综合医院绩效管理系统</h3>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input 
					v-model="loginForm.username" 
					name="username" 
					type="text" 
					auto-complete="on" 
					placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :type="pwdType"
          v-model="loginForm.password"
          name="password"
          auto-complete="off"
          placeholder="请输入密码"
          @keyup.enter.native="handleLogin" />
				<el-tooltip content="查看密码" placement="top">
					<span class="show-pwd" @click="showPwd">
						<svg-icon icon-class="eye" />
					</span>
				</el-tooltip>
      </el-form-item>
			<!-- <el-checkbox 
				v-model="checked">
				记住密码
			</el-checkbox> -->
        <el-button 
					:loading="loading" 
					type="primary" 
					style="width:25%; float: right;" 
					class="guo-btn yellow-btn"
					@click.native.prevent="handleLogin" 
					>
          登 录
        </el-button>
      <!-- <div class="tips">
        <span style="margin-right:20px;">author: GuoChongyuan</span>
      </div> -->
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
        	{ required: true, message: '请输入用户名', trigger: 'blur' },
        	{ min: 4, message: '用户名至少 4 个字符', trigger: 'blur' }
          ],
          password: [
        	{ required: true, message: '请输入密码', trigger: 'change' },
        	{ min: 3, message: '密码至少 3 个字符', trigger: 'blur' }
          ],
      },
      loading: false,
      pwdType: 'password',
      redirect: undefined,
			checked: false
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
		handleLogin() {
			this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('Login', this.loginForm).then(( response ) => {
            this.loading = false
            this.$router.push({path: '/'});
    				this.$message.success(response.msg);
          }).catch(() => {
            this.loading = false
          })
        }else {
    			console.log('error submit!!')
    			this.$message.error("别淘气，请正确填写用户名和密码");
    		}
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$light_gray:#eee;
/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #fff;//$light_gray;
      height: 47px;
      &:-webkit-autofill {
				transition: background-color 5000s ease-in-out 0s;
        -webkit-box-shadow: 0 0 0px 1000px rgba(255,255,255,0) inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
	.el-checkbox {
	// padding: 0px 0px 0px 15px;
	margin: 0px 0px 10px;
	}
}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#FFFFFF;
$dark_gray:#889aa4;
$light_gray:#eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
	background-image: url(../../assets/img/backgroundsuper.png);
	background-repeat: no-repeat;
	background-size: cover;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 420px;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
// 		margin-top: 200px;
// 		margin-right: 280px;
  }
//   .tips {
//     font-size: 14px;
//     color: #fff;
//     margin-bottom: 10px;
//     span {
//       &:first-of-type {
//         margin-right: 16px;
//       }
//     }
//   }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
