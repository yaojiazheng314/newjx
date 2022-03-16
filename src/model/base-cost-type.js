import { save, 
				 getDataInfo, 
				 getLastOtNextDataInfo } from '@/api/v2/baseCostType/index'

class BaseCostType {
	
	id
	code
	name
	ratio

	constructor(id, code, name) {
		this.id = id
		this.name = name
		this.code = code
	}
	
	static async doSave(baseCostType, links) {
		const data = {
			baseCostType: baseCostType,
			links: links
		}
		const res = await save(data)
		return res
	}
	
	/**
	 * @return { currentNum, totalNum, data }
	 */
	static async getData(baseCostTypeId) {
		const query = {
			baseCostTypeId: baseCostTypeId
		}
		const res = await getDataInfo(query)
		return res.data
	}
	
	static async getLastOrNextData(baseCostTypeId, direction) {
		const query = {
			baseCostTypeId: baseCostTypeId,
			direction: direction
		}
		const res = await getLastOtNextDataInfo(query)
		return res.data
	}

}

export {
	BaseCostType
}