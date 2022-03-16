<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
			<keep-alive :include="cachedViews">
			  <router-view :key="key"></router-view>
			</keep-alive>      
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
		cachedViews() {
		  return this.$store.getters.cachedViews
		},
		//在 router-view 上加上一个唯一的 key，来保证路由切换时都会重新渲染触发钩子
    key() {
      return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.fixed-header+.app-main {
  padding-top: 50px;
}
.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }
  .fixed-header+.app-main {
    padding-top: 84px;
  }
}
</style>
