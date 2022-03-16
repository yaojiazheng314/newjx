import request from '@/utils/request'


/* 评分方法 */
export function getScoringMethods(query) {
	return request({
	  url: '/exam/getScoringMethods',
	  method: 'get',
		params: query
	})
}

/* 指标列表 */
export function getExamTargets(query) {
	return request({
	  url: '/exam/getExamTargets',
	  method: 'get',
		params: query
	})
}
/* 指标配置数据源 */
export function addTargetDataSource(data) {
	return request({
	  url: '/exam/addTargetDataSource',
	  method: 'post',
		data: data
	})
}
/* 查询指标的数据源 */
export function getExamTarget(query) {
	return request({
	  url: '/exam/getExamTarget',
	  method: 'get',
		params: query
	})
}
/* 删除指定指标 */
export function deleteExamTarget(data) {
	return request({
	  url: '/exam/deleteExamTarget',
	  method: 'post',
		data: data
	})
}


/* 依据配置数据源 */
export function addBasisDataSource(data) {
	return request({
	  url: '/exam/addBasisDataSource',
	  method: 'post',
		data: data
	})
}

/* 删除依据*/
export function deleteExamBasis(data) {
	return request({
	  url: '/exam/deleteExamBasis',
	  method: 'post',
		data: data
	})
}

/* 添加and修改 考核依据 */
export function saveExamBasis(data) {
	return request({
	  url: '/exam/saveExamBasis',
	  method: 'post',
		data: data
	})
}

/* 考核依据 */
export function getBasisList(query) {
	return request({
	  url: '/exam/getBasisList',
	  method: 'get',
		params: query
	})
}

/* 通过id获取考核依据详细 */
export function getBasis(query) {
	return request({
	  url: '/exam/getBasis',
	  method: 'get',
		params: query
	})
}
// 获取指标tree
export function getAllIndicator(query){
  return request({
	  url: '/exam/getAllIndicator',
	  method: 'get',
		params: query
	})
}
// 获取责任科室
export function getBaseDepartment(query){
  return request({
	  url: '/exam/getBaseDepartment',
	  method: 'get',
		params: query
	})
}

export function getExamBasisParam() {
	return request({
	  url: '/exam/getBasisParam',
	  method: 'get'
	})
}

export function getBasisSuggestion(query) {
	return request({
	  url: '/exam/getBasisSuggestion',
	  method: 'get',
		params: query
	})
}



/* 考核指标主界面 */
//考核指标内容模糊查询
export function getTargetSuggestion(query) {
	return request({
	  url: '/exam/getTargetSuggestion',
	  method: 'get',
		params: query
	})
}
//考核指标列表
export function fetchTarget(query) {
	return request({
	  url: '/exam/getExamTargets',
	  method: 'get',
		params: query
	})
}

/* 考核指标编辑界面 */
//保存考核指标
export function saveExamTarget(data) {
	return request({
	  url: '/exam/saveExamTarget',
	  method: 'post',
		data: data
	})
}
//获取用户科室考核指标参数列表 参数：用户ID
export function getExamTargetParam(query) {
	return request({
	  url: '/exam/getTargetParam',
	  method: 'get',
		params: query
	})
}

/* 考核指标的依据列表 */
export function getTargetBasises(query) {
	return request({
	  url: '/exam/getTargetBasises',
	  method: 'get',
		params: query
	})
}

/* 考核指标添加考核依据dialog =》
根据考核依据别名、考核依据内容模糊查询考核依据 */
export function fuzzyQueryBasisParam(query) {
	return request({
	  url: '/exam/fuzzyQueryBasisParam',
	  method: 'get',
		params: query
	})
}

/* 保存指标的依据 */
export function saveTargetBasis(data) {
	return request({
	  url: '/exam/saveExamTargetBasis',
	  method: 'post',
		data: data
	})
}
/* 获取被考核科室、被考核人员的列表树 */
export function getExamDeptPersonTree(query) {
	return request({
	  url: '/exam/getExamDeptPersonTree',
	  method: 'get',
		params: query
	})
}
/* 质控考核获取获取右侧时间列表 */
export function getTimeList(query) {
	return request({
	  url: '/exam/getTimeList',
	  method: 'get',
		params: query
	})
}

/* 分页查询模板列表 */
export function getPagedTemps(query) {
	return request({
	  url: '/exam/getPagedTemps',
	  method: 'get',
		params: query
	})
}

/* 多选一键考核 */
export function oneKeyBatch(data) {
	return request({
	  url: '/exam/oneKeyBatch',
	  method: 'post',
		data: data
	})
}

/* 根据模板ID查询单个模板信息 */
export function getTemp(query) {
	return request({
	  url: '/exam/getTemp',
	  method: 'get',
		params: query
	})
}

/* 根据模板ID查询某月生成的模板tree信息 */
export function getMonthTemp(query) {
	return request({
	  url: '/exam/getMonthTempInfo',
	  method: 'get',
		params: query
	})
}
/* 通过选择是个人模板还是科室模板生成树形接口 */
export function getDeptUserTree(query) {
	return request({
	  url: '/exam/getDeptUserTree',
	  method: 'get',
		params: query
	})
}
/* 获取考核模板参数列表 */
export function getExamTempParam(query) {
	return request({
	  url: '/exam/getExamTempParam',
	  method: 'get',
		params: query
	})
}

/* 删除模板 */
export function deleteTemp(data) {
	return request({
	  url: '/exam/deleteTemp',
	  method: 'post',
		data: data
	})
}

/* 获取全部指标 不受用户所属科室限制 */
export function getExamAllTargetParam() {
	return request({
		url: '/exam/getAllTargetParam',
		method: 'get'
	})
}

/* 查询一级指标列表 */
export function getFirstLevelTargets(query) {
	return request({
		url: '/exam/getFirstLevelTargets',
    method: 'get',
    params: query
	})
}
/* 根据指标ID查询依据 */
export function getBasisByTargetId(query) {
	return request({
		url: '/exam/getBasisByTargetId',
    method: 'get',
    params: query
	})
}

/* 指定的一级指标ID, 查询此节点的树 */
export function getFirstLevelTargetTree(query) {
	return request({
		url: '/exam/getFirstLevelTargetTree',
    method: 'get',
    params: query
	})
}

/* 保存模板 */
export function saveExamTemp(data) {
	return request({
	  url: '/exam/saveExamTemp',
	  method: 'post',
		data: data
	})
}

/* 获取考核模板列表 */
export function fetchTemp(query) {
	return request({
	  url: '/exam/getExamTempList',
	  method: 'get',
		params: query
	})
}
/* 考核上报查询已打分的模板 */
export function getScoredAppliedTargets(query) {
	return request({
	  url: '/exam/getScoredAppliedTargets',
	  method: 'get',
		params: query
	})
}

/* 提交整改方案文本 */
export function submitRectificationText(data) {
	return request({
	  url: '/exam/submitRectificationText',
	  method: 'post',
		data: data
	})
}
/* 被考核的科室/员工对考核结果提出异议 */
export function raiseObjection(data) {
	return request({
	  url: '/exam/raiseObjection',
	  method: 'post',
		data: data
	})
}
/* 提交上报（整改方案） */
export function reportRectification(data) {
	return request({
	  url: '/exam/reportRectification',
	  method: 'post',
		data: data
	})
}

/* 考核模板添加指标dialog */
/* 获取获取考核模板指标 */
export function getTempTarget(query) {
	return request({
	  url: '/exam/getExamTempTargets',
	  method: 'get',
		params: query
	})
}

/* 模糊查询全部考核指标 */
export function fuzzyQueryTargetParam(query) {
	return request({
	  url: '/exam/fuzzyQueryTargetParam',
	  method: 'get',
		params: query
	})
}

/* 保存考核模板的考核指标 */
export function saveTempTarget(data) {
	return request({
	  url: '/exam/saveExamTempTarget',
	  method: 'post',
		data: data
	})
}

/* 保存考核模板的考核执行用户 */
export function saveTempExecUser(data) {
	return request({
	  url: '/exam/saveExamTempExecUser',
	  method: 'post',
		data: data
	})
}

/* 获取考核模板的执行用户列表 */
export function getTempExecUser(query) {
	return request({
	  url: '/exam/getTempExecUser',
	  method: 'get',
		params: query
	})
}

/* 考核执行人获取考核模板参数 */
export function getExamTempParamByExec(query) {
	return request({
	  url: '/exam/getExamTempParamByExec',
	  method: 'get',
		params: query
	})
}

/* 获取考核执行模板 */
export function getExecExamTempList(query) {
	return request({
	  url: '/exam/getExecExamTempList',
	  method: 'get',
		params: query
	})
}

/* 上报审核分页查询可审核的考核年月 */
export function queryExamedTemps(query) {
	return request({
	  url: '/exam/queryExamedTemps',
	  method: 'get',
		params: query
	})
}

/* 上报审核分页查询可审核的考核年月 */
export function getScoredExamMonth(query) {
	return request({
	  url: '/exam/getScoredExamMonth',
	  method: 'get',
		params: query
	})
}

/* 审核（整改方案） */
export function audit(data) {
	return request({
	  url: '/exam/audit',
	  method: 'post',
		data: data
	})
}
/* 质控考核——查看评分项 */
export function getMonthTargetBasises(query) {
	return request({
	  url: '/exam/getMonthTargetBasises',
	  method: 'get',
		params: query
	})
}

/* 提交评分 */
export function grade(data) {
	return request({
	  url: '/exam/grade',
	  method: 'post',
		data: data
	})
}
/* 根据部门ID查询人员列表 */
export function searchPersons(query) {
	return request({
	  url: '/exam/searchPersons',
	  method: 'get',
		params: query
	})
}

/* 实时计算依据得分并自动合计出指标得分 */
export function realtimeComputing(data) {
	return request({
	  url: '/exam/realtimeComputing',
	  method: 'post',
		data: data
	})
}

/* 暂存评分 */
export function saveScore(data) {
	return request({
	  url: '/exam/saveScore',
	  method: 'post',
		data: data
	})
}

/* 考核上报查询已打分的模板列表 */
export function searchExamedMonthes(query) {
	return request({
	  url: '/exam/searchExamedMonthes',
	  method: 'get',
		params: query
	})
}

/* 查询考核依据Tree */
export function getExamMonthExeList(query) {
	return request({
	  url: '/examMonthExe/getExamMonthExeList',
	  method: 'get',
		params: query
	})
}

/* 查询考核依据科室*/
export function getExamTempDeptData(query) {
	return request({
	  url: '/examMonthExe/getExamTempDeptData',
	  method: 'get',
		params: query
	})
}
/*一键考核 按照指标 进行考核exam/oneKeyBatchDept*/ 
// export function oneKeyBatchDept(data) {
// 	return request({
// 	  url: '/exam/oneKeyBatchDept',
// 	  method: 'post',
// 		data: data
// 	})
// }
/*一键考核 按照指标 进行考核exam/oneKeyBatchDept*/ 
export function oneKeyBatchDeptNew(data) {
	return request({
	  url: '/exam/oneKeyBatchDeptNew',
	  method: 'post',
		data: data
	})
}
/*modifyState*/
export function modifyState(data) {
	return request({
	  url: '/exam/modifyState',
	  method: 'post',
		data: data
	})
}

export function getExamMonthTempList(query) {
	return request({
	  url: '/exam/getExamMonthTempList',
	  method: 'get',
		params: query
	})
}
export function getExamMonthTempOfDept(query) {
	return request({
	  url: '/exam/getExamMonthTempOfDept',
	  method: 'get',
		params: query
	})
}

export function GenerateExamMonthByDept(query) {
	return request({
	  url: '/exam/generateExamMonthByYearMonth',
	  method: 'get',
		params: query
	})
}

export function checkGenarateInfo(query) {
	return request({
	  url: '/exam/checkGenarateInfo',
	  method: 'get',
		params: query
	})
}

export function selectTempMonthAll(query) {
	return request({
	  url: '/exam/selectTempMonthAll',
	  method: 'get',
		params: query
	})
}

export function getOneYearExamTempData(query) {
	return request({
	  url: '/exam/getOneYearExamTempData',
	  method: 'get',
		params: query
	})
}

 	/* 科室上报·-多选 */
	 export function reportMore(data) {
		return request({
			url: '/exam/reportMore',
			method: 'post',
			data: data
		})
	}

	/* 科室上报审核·-多选 */
	export function checkConfirmMore(data) {
		return request({
			url: '/exam/checkConfirmMore',
			method: 'post',
			data: data
		})
	}