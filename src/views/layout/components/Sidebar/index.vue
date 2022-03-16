<template>
	<el-scrollbar wrap-class="scrollbar-wrapper">
	<!-- <div :class="{'has-logo':showLogo}"> -->
		<logo v-if="showLogo" :collapse="isCollapse" />
			<el-menu
				:show-timeout="200"
				:default-active="$route.path"
				:collapse="isCollapse"
				mode="vertical"
				background-color="#FFFFF0" 
				text-color="#000"
				active-text-color="#3CB371">
				<sidebar-item 
					v-for="route in routes" 
					:key="route.path" 
					:item="route" :base-path="route.path"/>
			</el-menu>
		<!-- </div> -->
	</el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import Logo from './Logo'
export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      return this.$store.getters.routers
    },
		showLogo() {
		  return this.$store.state.settings.sidebarLogo
		},
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
