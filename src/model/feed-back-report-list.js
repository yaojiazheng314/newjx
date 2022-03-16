import { getFeedBackItemsV2, 
				 saveReportListAndReason,
				 submitDeptFeedBackReport } from '@/api/v2/feedBack/report/index'

class FeedBackReportList {
	
	yearmonth  // 当前分配年月
	department
	userId  // 当前分配用户
	
	// data
	isAccountClosed = false  // 是否封账
	items = []
	unReportedItems = []
	reportedItems = []
	
	// 按科室汇总的未上报分配项: 
	// [{ feedBackDept, feedBackDeptName, status, feedBackVal, reportSumVal, [ items[0] ] }]
	unReportItemsGroupbyDept = []
	// 按科室汇总的已上报分配项
	// [{ feedBackDept, feedBackDeptName, status, feedBackVal, reportSumVal, [ items[0] ] }]
	reportItemsGroupbyDept = []
	
	constructor(yearmonth, userId,department) {
		this.yearmonth = yearmonth
		this.userId = userId
		this.department = department
	}
	
	// 获取当前用户填报分配项信息列表
	async doQuery() {
		const query = this.queryBody
		const res = await getFeedBackItemsV2(query)
		this.isAccountClosed = res.data.isAccountClosed
		this.items = res.data.items
		const itemsArr = this.items
		this.unReportedItems = itemsArr.filter(t => t.status === 0)
		this.reportedItems = itemsArr.filter(t => t.status !== 0)
		
		this.itemsGroupbyDept("unreported")
		this.itemsGroupbyDept("reported")
	}
	
	// 安照未上报科室汇总分配信息
	/**
	 * @param {String} flag: unreported/reported
	 */
	itemsGroupbyDept(flag) {
		var gdList = []
		const items = flag === "unreported" ? 
			this.unReportedItems : this.reportedItems
		for (let i = 0, l = items.length; i < l; i++) {
			let item = items[i]
			let gdItem = gdList.find(t => (
				t.feedBackDept === item.feedBackDept && t.status === item.status
			))
			if (gdItem === undefined) {
				gdItem = {
					feedBackDept: item.feedBackDept,
					feedBackDeptName: item.feedBackDeptName,
					yearmonth: item.yearmonth,
					status: item.status,
					reportItems: []
				}
				gdItem.reportItems.push(item)
				gdList.push(gdItem)
			} else {
				gdItem.reportItems.push(item)
			}
		}
		if (flag === "unreported") {
			this.unReportItemsGroupbyDept = gdList
		} else {
			this.reportItemsGroupbyDept = gdList
		}
		
	}
	
	get queryBody() {
		return {
			yearmonth: this.yearmonth,
			userId: this.userId,
			department:this.department
		}
	}
	
	static async doSave(reportList, reportDeptReason) {
		const data = {
			reportList: reportList,
			reportDeptReason: reportDeptReason
		}
		const res = await saveReportListAndReason(data)
		return res
	}
	
	static async doSubmitReport(reportList, reportDeptReason) {
		const data = {
			reportList: reportList,
			reportDeptReason: reportDeptReason
		}
		const res = await submitDeptFeedBackReport(data)
		return res
	}
	
}

export {
	FeedBackReportList
}