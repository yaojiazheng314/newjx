import { fuzzyQueryItfCostType,
				 getLinkList } from '@/api/v2/baseItfCostTypeLink/index'
class BaseItfCostTypeLink {
	
	itfCostCode
	itfCostName
	syslb
	baseCostType
	select1
	operator
	
	constructor(itfCostCode, itfCostName, syslb, baseCostType, select1, operator) {
		this.itfCostCode = itfCostCode
		this.itfCostName = itfCostName
		this.syslb = syslb
		this.baseCostType = baseCostType
		this.select1 = select1
		this.operator = this.operator
	}
	
	// 模糊查询itfCostType
	static async remoteQueryItfCostType(fuzzyQueryStr) {
		const query = {
			fuzzyQueryStr: fuzzyQueryStr 
		}
		const res = await fuzzyQueryItfCostType(query)
		return res.data
	}
	
	static async getList(baseCostTypeId) {
		const query = {
			baseCostTypeId: baseCostTypeId
		}
		const res = await getLinkList(query)
		return res.data
	}
}

export {
	BaseItfCostTypeLink
}