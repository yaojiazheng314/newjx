import { fuzzyQueryItfChargeType,
				 getLinkList } from '@/api/v2/baseItfChargeTypeLink/index'
class BaseItfChargeTypeLink {
	
	itfChargeCode
	itfChargeName
	syslb
	baseChargeType
	select1
	operator
	
	constructor(itfChargeCode, itfChargeName, syslb, baseChargeType, select1, operator) {
		this.itfChargeCode = itfChargeCode
		this.itfChargeName = itfChargeName
		this.syslb = syslb
		this.baseChargeType = baseChargeType
		this.select1 = select1
		this.operator = this.operator
	}
	
	// 模糊查询itfChargeType
	static async remoteQueryItfChargeType(fuzzyQueryStr) {
		const query = {
			fuzzyQueryStr: fuzzyQueryStr 
		}
		const res = await fuzzyQueryItfChargeType(query)
		return res.data
	}
	
	static async getList(baseChargeTypeId) {
		const query = {
			baseChargeTypeId: baseChargeTypeId
		}
		const res = await getLinkList(query)
		return res.data
	}
}

export {
	BaseItfChargeTypeLink
}