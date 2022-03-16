<template>
  <el-card class="box-card-component" style="margin-left:8px;">
    <div slot="header" class="box-card-header">
      <img :src="fszx">
    </div>
    <div style="position:relative;">
      <guo-thumb :image="avatar" class="guoThumb" />
      <mallki class-name="mallki-text" text="反馈审核" />
      <div style="padding-top:45px;" class="progress-item">
				<el-progress
				 v-if="fbackProgress === 100"
				 status="success"
				 :percentage="100" />
        <el-progress
					v-else
				 :text-inside="true" 
				 :stroke-width="16"
				 :percentage="fbackProgress" />
      </div>
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'
import GuoThumb from '@/components/GuoThumb'
import Mallki from '@/components/TextHoverEffect/Mallki'
import FSZX from '@/assets/img/fszxs.jpg'

export default {
  components: { GuoThumb, Mallki },

  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
			fszx: FSZX,
			fbackProgress: 68,
      statisticsData: {
        article_count: 1024,
        pageviews_count: 1024
      }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
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
