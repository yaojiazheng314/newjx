import { getReportData } from '@/api/v2/feedBack/report/index'

class FeedBackReportVOList {
	
	// query
	feedBackItem
	feedBackDeptId
	userId
	yearmonth
	flag  // 'unreported'/'reported'
	
	// 分配项人员填报列表: [ reportVO: { feedBackItem, feedBackItemName, feedBackDept, feedBackDeptName, yearmonth, person, perCode, perName, perDeptName, perStatus, perPos, perPosName, val, user, remarks } ]
	items = []  
	// 人员填报分配项汇总列表: [ { feedBackItem, feedBackItemName, feedBackDept, feedBackDeptName, yearmonth, person, personInfo: `perCode_perName perDeptName`, `feedBackItem`: val, user, remarks } ]
	items2 = []
	// 用于保存的 feedBackReport 列表
	reportList = []
	
	constructor(feedBackItem,feedBackDeptId, userId, yearmonth, flag) {
		this.feedBackItem =feedBackItem
		this.feedBackDeptId = feedBackDeptId
		this.userId = userId
		this.yearmonth = yearmonth
		this.flag = flag
	}
	
	get queryBody() {
		return {
			feedBackItem:this.feedBackItem,
			feedBackDeptId: this.feedBackDeptId,
			userId: this.userId,
			yearmonth: this.yearmonth,
			flag: this.flag
		}
	}
	
	get itemslen() {
		return this.items.length
	}
	
	get items2len() {
		return this.items2.length
	}
	
	async doQuery() {
		const query = this.queryBody
		// console.log(this.queryBody)
		const res = await getReportData(query)
		// console.log
		this.items = res.data
		// trans items to items2
		if (this.itemslen > 0) {
			this.transItemsToItems2()
		}
	}
	
	transItemsToItems2() {
		var items2 = []
		const items = this.items
		for (let i = 0, l = this.itemslen; i < l; i++) {
			let item = items[i]
			let item2 = items2.find(t => (item.person === t.person))
			// console.log(items)
			// 人员不存在
			if (item2 === undefined) {
				item2 = {
					person: item.person,
					personInfo: `${item.perCode}_${item.perName} ${item.perDeptName}`,
					remarks: item.remarks,
					idCard:item.idCard,
					coefficient:item.coefficient,
					perPosName:item.perPosName,					
					val:item.val,
					id:item.id,
					feedBackDeptId:item.feedBackDept,
					perDeptName:item.perDeptName,
       				perName:item.perName,
        		    perDept:item.perDept
					// id:item.id

				}
				item2[item.feedBackItemName] = item.val
				items2.push(item2)
			}
			// 人员已存在
			else {
				// console.log(items)
				item2[item.feedBackItemName] = item.val
			}
		}
		this.items2 = items2
	}
	
	/**
	 * @param {Array} feedBackItems: [ { prop, label, feedBackItem } ]
	 */
	transItems2ToReportList(feedBackItems) {
		var reports = []
		const items2 = this.items2
		for (let i = 0; i < this.items2.length; i++) {
			let item2 = items2[i]
			let reportArr = this.generateFeedBackReports(item2, feedBackItems)
			reports = reports.concat(reportArr)
		}
		this.reportList = reports
	}
	
	/**
	 * @description 筛选去除属性为0的
	 * @param {Array} feedBackItems: [ { prop, label, feedBackItem } ]
	 */
	generateFeedBackReports(item2, feedBackItems) {
		var reports = []
		for (let i = 0, l = feedBackItems.length; i < l; i++) {
			let fbItem = feedBackItems[i]
			if (item2[fbItem.prop] !== null) {
				let report = {
					feedBackItem: fbItem.feedBackItem,
					yearmonth: this.yearmonth,
					feedBackDept: this.feedBackDeptId,
					person: item2.person,
					val: item2[fbItem.prop],
					user: this.userId,
					remarks: item2.remarks,
					coefficient:item2.coefficient					
					// id:item2.id
				}
				reports.push(report)
			}
		}
		return reports
	}
	
}

export {
	FeedBackReportVOList
}