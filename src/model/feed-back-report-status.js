import { saveReportStatusList,
				 passAllReportExamine } from '@/api/v2/feedBack/examine/index'

class FeedBackReportStatus {
	
	/**
	 * @param {Array} saveData: [ { department, user, yearmonth, status } ]
	 */
	static async saveList(saveData) {
		const res = await saveReportStatusList(saveData)
		return res
	}
	
	static async passAllReport(yearmonth, status) {
		const data = {
			yearmonth: yearmonth,
			status: status 
		}
		const res = await passAllReportExamine(data)
		return res
	}
	
}

export {
	FeedBackReportStatus
}