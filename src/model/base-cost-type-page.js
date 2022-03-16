import { getPage } from '@/api/v2/baseCostType/index'

class BaseCostTypePage {

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
			item.description = `成本调整比例:${item.ratio}`
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
  BaseCostTypePage
}
