import { getPage } from '@/api/v2/baseChargeType/index'

class BaseChargeTypePage {

  // page attr
  total = 0 // 总记录数
  page = 1 // 当前页
  limit  // 每页记录数
	fuzzyQueryName  // 模糊查询收入类别名称
	unbindingNum
	

  // data
  pageData = []  // 每页数据

  constructor(limit, fuzzyQueryName) {
    this.limit = limit
		this.fuzzyQueryName = fuzzyQueryName
  }

  // get total() {
  //   return this.total
  // }

  // get page() {
  //   return this.page
  // }

  get totalPage() {
    return Math.ceil(this.total / this.limit)
  }

  get queryBody() {
    return {
      currentPage: this.page,
      pagesize: this.limit,
			fuzzyQueryName: this.fuzzyQueryName
    }
  }

  setData(data) {
    this.total = data.total
		this.unbindingNum = data.unbindingNum
    this.pageData = data.pageData
  }

  // page query
  async doQuery() {
    const res = await getPage(this.queryBody)
    const resData = res.data
		var pageData = resData.pageData.map(item => {
			item.description = `次均成本:${item.cjcb}; 风险系数:${item.fxxs}; 患者所在科室系数:${item.hzks}; 开单提成系数:${item.kdtcxs}; 开单系数:${item.kdxs}; 执行提成系数:${item.zxtcxs}; 执行系数:${item.zxxs}`
			return item
		})
		const data = {
			total: resData.total,
			unbindingNum: resData.unbindingNum,
			pageData: pageData
		}
    this.setData(data)
  }

  getLastPage() {
    const currPage = this.page
    this.page = currPage > 1 ? currPage - 1 : currPage
    this.doQuery()
  }

  getNextPage() {
    const currPage = this.page
    this.page = currPage === this.totalPage ? currPage : currPage + 1
    this.doQuery()
  }

  jumpTo(pageNum) {
    this.page = pageNum
    this.doQuery()
  }

}

export {
  BaseChargeTypePage
}
