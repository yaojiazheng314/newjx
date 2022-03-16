<template>
  <div>
    <el-table
      style="width: 100%;"
      v-loading="loading"
      :data="typePage.pageData"
      :empty-text="tableEmptyTip"
      :header-cell-style="tableHeaderStyle"
      @selection-change="handleSelectionChange"
      @row-click="rowClick">
     <el-table-column
        align="center"
        type="selection"
        width="55" />

      <el-table-column
        width="55">
        <template slot="header" slot-scope="scope">
          <svg-icon
            style="width: 1.3em; height: 1.3em; padding-top: 5px;"
            iconClass="icon_status" />
        </template>
        <template slot-scope="scope">
          <el-tooltip
            placement="bottom-start" effect="light"
            :content="colIconTip(scope.row.countContrast)">
            <svg-icon
              :iconClass="colStatusIcon(scope.row.countContrast)" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        width="250"
        :label="typeStr"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="pointer">
            {{ colItemName(scope.row) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="描述"
				prop="description"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        width="200"
        label="最近修改">
				<template slot="header" slot-scope="scope">
					<span>最近修改</span>
				  <svg-icon
				    style="width: 1.2em; height: 1.2em;"
				    iconClass="icon_time" />
				</template>
        <template slot-scope="scope">
          <span>{{ colTimeValue(scope.row) }}</span>
        </template>
      </el-table-column>
    </el-table>

    <filter-bar
      :selectNum="selectedNumber"
      :showReadFilter="showReadFilter" />
  </div>
</template>

<script>
import { formatDate, daysDiffer, timeFromNow } from '@/utils/date'
import FilterBar from './FilterBar'
export default {
  name: "link-table",
  components: { FilterBar },
  props: {
    typePage: Object,  
    showReadFilter: {
      required: false,
      type: Boolean,  // 显示已配置/未配置按钮
      default: false
    },
		typeStr: String,
		tableEmptyTip: String
  },
  data() {
    return {
      // attr
      loading: false,
      selectedNumber: 0  // 选中记录数
    }
  },
  methods: {
    // table status
    /**
     * @param {Boolean} status
     */
    showLoading(status) {
      this.loading = status
    },
    // table style
    tableHeaderStyle({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        if (columnIndex === 0) {
          return `width: 100%;
                  background-color: #F5F5F5;
                  border-top: 1px solid #d3e1f0;
                  border-bottom: 1px solid #d3e1f0;
                  color: #606266;
                  font-weight: normal;`
        }
        return `width: 100%;
                background-color: #F5F5F5;
                border-left: 1px solid #f0f0f0;
                border-top: 1px solid #d3e1f0;
                border-bottom: 1px solid #d3e1f0;
                color: #606266;
                font-weight: normal;`
      }
    },
    tableRowStyle({row, rowIndex}) {
      return `background: #F5F5F5;`
    },

    // table row data
		colIconTip(countContrast) {
			if (countContrast === 0) {
				return "未绑定"
			}
			return `已绑定${countContrast}项`
		},
		
		colStatusIcon(countContrast) {
			if (countContrast === 0) {
				return 'icon_unbinding'
			}
			return 'icon_binding'
		},
		
		colItemName(row) {
			return `${row.code} ${row.name}`;
		},
		
		colTimeValue(row) {
      console.log(row.operateTime);
			var datetime, days_differ, datestr, timestr
			datetime = new Date(row.operateTime)
			datestr = formatDate(datetime, 'yyyy-MM-dd')
			timestr = formatDate(datetime, 'hh:mm')
			days_differ = daysDiffer(datestr, formatDate(new Date(), 'yyyy-MM-dd'))
			return timeFromNow(days_differ, datestr, timestr)
		},

    // handle table data
    /**
     * @description 处理选中table row
     * @param {Array} val: [{id, code, name...}]
     */
    handleSelectionChange(val) {
      this.$emit('handleSelection', val);
      this.selectedNumber = val.length
    },

    /**
     * @description 处理table点击行
     * @param {Object} row: {applyItemId, theme, status, sender, sendWay, recipients, copys, timing}
     */
    rowClick(row) {
      this.$emit('rowClick', row);
    }

  }
}
</script>

<style>
</style>
