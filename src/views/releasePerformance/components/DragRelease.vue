<template>
  <div class="dndList">
    <div :style="{width:width1}" class="dndList-list">
      <h3>{{ list1Title }}</h3>
      <draggable 
				:set-data="setData" 
				:list="list1" 
				group="feedBackItemName" 
				class="dragArea">
        <div 
					v-for="element in list1" 
					:key="element.feedBackItem" 
					class="list-complete-item">
          <div class="list-complete-item-handle">
						<el-tag>
							{{ element.feedBackItemName }}
						</el-tag>
						<el-tag
							type="info"
							>
							待分配科室:{{ element.deptNum }}
						</el-tag>
						<el-tag
							type="danger"
							>
							绩效总计:{{ element.sumVal }}
						</el-tag>
          </div>
        </div>
      </draggable>
    </div>
    <div :style="{width:width2}" class="dndList-list">
      <h3>{{ list2Title }}</h3>
      <draggable 
				:list="list2" 
				group="feedBackItemName" 
				class="dragArea">
        <div 
					v-for="element in list2" 
					:key="element.feedBackItem" 
					class="list-complete-item">
          <div 
						class="list-complete-item-handle2" 
						@click="pushEle(element)">
            <el-tag
            	closable>
            	{{ element.feedBackItemName }}
            </el-tag>
            <el-tag
            	type="info"
            	closable>
            	待分配科室:{{ element.deptNum }}
            </el-tag>
            <el-tag
            	type="danger"
            	closable>
            	绩效总计:{{ element.sumVal }}
            </el-tag>
						<div style="position:absolute;right:0px;">
						<span 
							v-if="element.status === 1"
							style="float: right ;margin-top: -20px;margin-right:5px;">
							已发放
						  <i style="color: #20B2AA" class="el-icon-success" />
						</span>
						</div>
          </div>
        </div>
      </draggable>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'DragRelease',
  components: { draggable },
  props: {
    list1: {
      type: Array,
      default() {
        return []
      }
    },
    list2: {
      type: Array,
      default() {
        return []
      }
    },
    list1Title: {
      type: String,
      default: 'list1'
    },
    list2Title: {
      type: String,
      default: 'list2'
    },
    width1: {
      type: String,
      default: '48%'
    },
    width2: {
      type: String,
      default: '48%'
    }
  },
  methods: {
    isNotInList1(v) {
      return this.list1.every(k => v.feedBackItem !== k.feedBackItem)
    },
    isNotInList2(v) {
      return this.list2.every(k => v.feedBackItem !== k.feedBackItem)
    },
    pushEle(ele) {
      for (const item of this.list2) {
        if (item.feedBackItem === ele.feedBackItem) {
          const index = this.list2.indexOf(item)
          this.list2.splice(index, 1)
          break
        }
      }
      if (this.isNotInList1(ele)) {
        this.list1.push(ele)
      }
    },
    setData(dataTransfer) {
      // to avoid Firefox bug
      // Detail see : https://github.com/RubaXa/Sortable/issues/1012
      dataTransfer.setData('Text', '')
    }
  }
}
</script>

<style lang="scss" scoped>
.dndList {
  background: #fff;
  padding-bottom: 40px;
  &:after {
    content: "";
    display: table;
    clear: both;
  }
  .dndList-list {
    float: left;
    padding-bottom: 30px;
    &:first-of-type {
      margin-right: 2%;
    }
    .dragArea {
      margin-top: 15px;
      min-height: 50px;
      padding-bottom: 30px;
    }
  }
}

.list-complete-item {
  cursor: pointer;
  position: relative;
  font-size: 14px;
  padding: 5px 12px;
  margin-top: 4px;
  border: 1px solid #bfcbd9;
  transition: all 1s;
}

.list-complete-item-handle {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 50px;
}

.list-complete-item-handle2 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 20px;
}

.list-complete-item.sortable-chosen {
  background: #4AB7BD;
}

.list-complete-item.sortable-ghost {
  background: #30B08F;
}

.list-complete-enter,
.list-complete-leave-active {
  opacity: 0;
}
</style>
