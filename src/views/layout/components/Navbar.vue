<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger 
			:toggle-click="toggleSideBar" 
			:is-active="sidebar.opened" 
			class="hamburger-container"/>
    <breadcrumb />
		<div style="display:inline-block;height:100%;line-height:50px;margin-left:30%;">
			      <!-- <el-tag type="danger" style="float:left">当前核算年月：</el-tag> -->
      <!-- <el-tag type="danger" style="float:left">2021-12-01</el-tag> -->
			<span style="float:left;color:#409eff;font-weight:bold;">当前核算年月：</span>
			<span style="float:left;color:#409eff;font-weight:bold;">{{yearmonth}}</span>
		</div>
		<div class="right-menu">
			<search class="right-menu-item" />
			<el-dropdown 
				class="avatar-container right-menu-item hover-effect" 
				trigger="click">
				<div class="avatar-wrapper">
					<guo-thumb 
						width="40px" 
						height="40px"
						:image="avatar+'?imageView2/1/w/80/h/80'"
						class="user-avatar">
					</guo-thumb>
					<i class="el-icon-caret-bottom"/>
				</div>
				<el-dropdown-menu slot="dropdown" class="user-dropdown">
					<router-link class="inlineBlock" to="/">
						<el-dropdown-item>
							{{ name }}
						</el-dropdown-item>
					</router-link>
					<el-dropdown-item divided>
						<span 
							style="display:block;" 
							@click="logout">
							退出平台
						</span>
					</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</div>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Search from '@/components/HeaderSearch'
import GuoThumb from '@/components/GuoThumb'
import { getBaseCurrentYearmonth } from "@/api/department";
export default {
  components: {
    Breadcrumb,
    Hamburger,
		Search,
		GuoThumb
  },
	data() {
		
		return {
			yearmonth: ""
		}
	},
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
			'name'
    ])
  },
	mounted(){
		this.getBaseCurrentYearmonth();
	},
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
		},
		getBaseCurrentYearmonth() {
       getBaseCurrentYearmonth().then(response => {
        this.yearmonth = response.data;
         
      });
    },
		//退出平台
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }
	}
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
	.right-menu {
	  float: right;
	  height: 100%;
	  line-height: 50px;
	
	  &:focus {
	    outline: none;
	  }
	
	  .right-menu-item {
	    display: inline-block;
	    padding: 0 8px;
	    height: 100%;
	    font-size: 18px;
	    color: #5a5e66;
	    vertical-align: text-bottom;
	
	    &.hover-effect {
	      cursor: pointer;
	      transition: background .3s;
	
	      &:hover {
	        background: rgba(0, 0, 0, .025)
	      }
	    }
	  }
	
	  .avatar-container {
	    margin-right: 30px;
	
	    .avatar-wrapper {
	      margin-top: 5px;
	      position: relative;
	
	      .user-avatar {
	        cursor: pointer;
	        width: 40px;
	        height: 40px;
	        border-radius: 10px;
	      }
	
	      .el-icon-caret-bottom {
	        cursor: pointer;
	        position: absolute;
	        right: -20px;
	        top: 25px;
	        font-size: 12px;
	      }
	    }
	  }
	}
}
</style>

