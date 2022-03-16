import { save, 
				 getDataInfo, 
				 getLastOtNextDataInfo } from '@/api/v2/baseChargeType/index'

class BaseChargeType {
	
	id
	code
	name
	cjcb
	fxxs
	hisId
	hzks
	kdtcxs
	kdxs
	lbType
	xmds
	zxtcxs
	zxxs
	select1

	constructor(id, code, name) {
		this.id = id
		this.name = name
		this.code = code
	}
	
	static async doSave(baseChargeType, links) {
		const data = {
			baseChargeType: baseChargeType,
			links: links
		}
		const res = await save(data)
		return res
	}
	
	/**
	 * @return { currentNum, unbindingNum,total, data }
	 */
	static async getData(baseChargeTypeId) {
		const query = {
			baseChargeTypeId: baseChargeTypeId
		}
		const res = await getDataInfo(query)
		return res.data
	}
	
	static async getLastOrNextData(baseChargeTypeId, direction) {
		const query = {
			baseChargeTypeId: baseChargeTypeId,
			direction: direction
		}
		const res = await getLastOtNextDataInfo(query)
		return res.data
	}

}

export {
	BaseChargeType
}