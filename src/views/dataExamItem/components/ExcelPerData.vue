<template>
	<div class="app-container">
		<span class="itemTip">{{ interfaceItem.itemName }}</span>
		<el-divider direction="vertical"></el-divider>
		<span class="itemTip">{{ interfaceItem.type }}</span>
		<el-divider direction="vertical"></el-divider>
		<span class="itemTip">{{ interfaceItem.yearmonth }}</span>
		<el-divider></el-divider>
		<HotTable 
			:root="root"
			ref="fillHot" 
			:settings="hotSettings"
			:language="language"></HotTable>
		<!--  -->
		<el-tooltip placement="top" content="重返巅峰">
			<back-to-top 
				:visibility-height="50" 
				:back-position="0" 
				transition-name="fade"/>
		</el-tooltip>
	</div>
</template>

<script>
import { getInterfaceItemPerData } from '@/api/bnsDataItemReport'

import { HotTable } from '@handsontable/vue'
// import Handsontable from 'handsontable'
import 'handsontable/dist/handsontable.full.css'
import 'handsontable/languages/zh-CN'

import BackToTop from '@/components/BackToTop'
export default {
	name: 'ExeclPerData',
	components: { HotTable, BackToTop },
	props: {
	  isFill: {
	    type: Boolean,
	    default: false
	  }
	},
	data() {
		return {
			interfaceItem: {
				itemID: null,
				itemName: '',
				yearmonth: '',
				type: '',
				userID: null
			},
			root: 'fill-hot',
			language: 'zh-CN', //汉化
			hotSettings: {
				data: [],
				colWidths: 200,
				width: '100%',
				// height: 650,
				rowHeights: 23,
        rowHeaders: true,//行表头，可以使布尔值（行序号），可以使字符串（左侧行表头相同显示内容，可以解析html），也可以是数组（左侧行表头单独显示内容）。
        colHeaders:   [ '编码', '姓名', '所属科室', '职位', '年月', '填报值'],//自定义列表头or 布尔值
				fixedColumnsLeft: 1,
				manualColumnFreeze: true,
				filters: true,
				dropdownMenu: true,
				// dropdownMenu: ['filter_by_condition', 'filter_action_bar'],
        // minSpareCols: 2, //列留白
        // minSpareRows: 4,//行留白
        currentRowClassName: 'currentRow', //为选中行添加类名，可以更改样式
        currentColClassName: 'currentCol',//为选中列添加类名
        autoWrapRow: true, //自动换行
				licenseKey: 'non-commercial-and-evaluation',
				 contextMenu: {   //自定义右键菜单，可汉化，默认布尔值
          items: {
            "row_above": {
              name:'上方插入一行'
            },
            "row_below": {
              name:'下方插入一行'
            },
            "hsep1": "---------", //提供分隔线
            "remove_row": {
              name: '删除行',
            },
            "hsep2": "---------",
          }
        },//右键效果
				fillHandle: true, //选中拖拽复制 possible values: true, false, "horizontal", "vertical"
				fixedColumnsLeft: 0,//固定左边列数
        fixedRowsTop: 0,//固定上边列数
				manualColumnMove: true, //手动移动列
        manualRowMove: true,   //手动移动行
				manualColumnResize: true,//行列可拉缩
				columnSorting: true, //排序
				columns: [     //添加每一列的数据类型和一些配置
          {
            data: 'perCode' //人员编码
          },
					{
					  data: 'perName' //人员姓名
					},
          {
						data: 'deptName'
//             type: 'dropdown', //下拉选择
//             source: ['呼吸一组'],
//             strict: true //是否严格匹配
          },
          { 
						data: 'perPosName'
					},
					{
						data: 'yearmonth',
						type: 'date',   //时间格式
            dateFormat: 'YYYY-MM',
            correctFormat: true,
            defaultDate: '2019-01'
					},
          { 
						data: 'val',
						type: 'numeric',
						editor: 'numeric',
            format: '$ 0,0.00' //指定的数据格式
					}  
        ]
// 				afterChange: function (changes, source) { //数据改变时触发此方法
// 					
//         }
				// stretchH: 'all'//根据宽度横向扩展，last:只扩展最后一列，none：默认不扩展
			}
		}
	},
	created() {
	  if (this.isFill) {
	    this.interfaceItem.itemID = this.$route.query.itemID
			this.interfaceItem.itemName = this.$route.query.itemName
			this.interfaceItem.yearmonth = this.$route.query.ym
			this.interfaceItem.type = this.$route.query.type
	    this.fetchData()
	  }
	},
	methods: {
		fetchData() {
		  var self = this
			var query = self.interfaceItem
			getInterfaceItemPerData(query).then(response => {
				self.hotSettings.data = response.data
			})
		}
	}
}
</script>

<style>
.currentRow {
	color: #409EFF;
}
</style>
