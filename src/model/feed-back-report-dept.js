import { getDeptReportInfo,
				 getDeptReportItemList,
				 getLastOtNextDataInfo } from '@/api/v2/feedBack/report/index'
import { getDeptReportExamineInfo, 
				 getLastOrNextExamineDataInfo } from '@/api/v2/feedBack/examine/index'

// 未上报反馈科室的分配信息
class DeptReportInfo {
	
	feedBackDept
	feedBackDeptName
	user
	usersName
	yearmonth
	status
	flag  // 0:未上报, 1:已上报/已审核
	
	constructor(feedBackDept, user, yearmonth, flag) {
		this.feedBackDept = feedBackDept
		this.user = user
		this.yearmonth = yearmonth
		this.flag = flag
	}
	
	/**
	 * @param {Object} query: {feedBackDeptId, userId, yearmonth, flag} 
	 * @return { data: FeedBackReportDept, totalNum, currentNum }
	 */
	static async getData(query) {
		const res = await getDeptReportInfo(query)
		return res.data
	}
	
	/**
	 * 获取已上报科室分配信息
	 * @return { data, totalNum, currentNum(全部已上报科室位置) }
	 */
	static async getDeptReportExamineData(feedBackItem,feedBackDeptId, userId, yearmonth, status) {
		const query = {
			feedBackItem:feedBackItem,
			feedBackDeptId: feedBackDeptId, 
			userId: userId, 
			yearmonth: yearmonth, 
			status: status
		}
		const res = await getDeptReportExamineInfo(query)
		return res.data
	}
	
	/**
	 * @param {Object} direction: 'last'/'next'
	 * @return { data: FeedBackReportDept, totalNum, currentNum }
	 */
	static async getLastOrNextData(feedBackDeptId, userId, yearmonth, flag, currentPosition, direction) {
		const query = {
			feedBackDeptId: feedBackDeptId,
			userId: userId,
			yearmonth: yearmonth,
			flag: flag,
			currentPosition: currentPosition,
			direction: direction
		}
		const res = await getLastOtNextDataInfo(query)
		return res.data
	}
	
	static async getLastOrNextExamineData(feedBackItem,feedBackDeptId, userId, yearmonth, direction) {
		const query = {
			feedBackItem:feedBackItem,
			feedBackDeptId: feedBackDeptId,
			userId: userId,
			yearmonth: yearmonth,
			direction: direction
		}
		const res = await getLastOrNextExamineDataInfo(query)
		return res.data
	}
	
	/**
	 * @param {Object} query: { feedBackDept, user, yearmonth, flag }
	 * @return {Array} data: [{feedBackItem, feedBackItemName, feedBackVal, reportPerNum, sumReportVal}]
	 */
	static async getDeptReportItems(query) {
		const res = await getDeptReportItemList(query)
		return res.data
	} 
	
}

export {
	DeptReportInfo
}