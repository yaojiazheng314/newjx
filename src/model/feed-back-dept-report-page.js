import { getDeptReportPage } from '@/api/v2/feedBack/examine/index'

class DeptReportPage {
	
	// page attr
	total = 0 // 总记录数
	page = 1 // 当前页
	limit  // 每页记录数
	yearmonth  // 查询年月
	fuzzyQueryDeptName  // 模糊查询科室名称
	unExamineNum
	
	// data
	pageData = []  // 每页数据
	
	constructor(limit, yearmonth, fuzzyQueryDeptName) {
	  this.limit = limit
		this.yearmonth = yearmonth
		this.fuzzyQueryDeptName = fuzzyQueryDeptName
	}
	
	get totalPage() {
	  return Math.ceil(this.total / this.limit)
	}
	
	get queryBody() {
	  return {
	    currentPage: this.page,
	    pagesize: this.limit,
			yearmonth: this.yearmonth,
			fuzzyQueryDeptName: this.fuzzyQueryDeptName
	  }
	}
	
	// page query
	async doQuery() {
	  const res = await getDeptReportPage(this.queryBody)
	  const resData = res.data
		var pageData = resData.pageData.map(item => {
			item.description = `分配填报总计:${item.reportSumVal}, 点击本行查看[${item.feedBackDeptName}]绩效分配反馈明细`
			return item
		})
		const data = {
			total: resData.total,
			unExamineNum: resData.unExamineNum,
			pageData: pageData
		}
	  this.setData(data)
	}
	
	setData(data) {
	  this.total = data.total
		this.unExamineNum = data.unExamineNum
	  this.pageData = data.pageData
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
	DeptReportPage
}