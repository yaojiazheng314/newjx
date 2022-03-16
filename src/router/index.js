import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
	{
	  path: '/redirect',
	  component: Layout,
	  hidden: true,
	  children: [
	    {
	      path: '/redirect/:path*',
	      component: () => import('@/views/redirect/index')
	    }
	  ]
	},
  {
		path: '/login',
		component: () => import('@/views/login/index'),
		hidden: true,
	},
	{
	  path: '/',
	  component: Layout,
	  redirect: 'dashboard',
	  children: [{
			path: 'dashboard',
			component: () => import('@/views/dashboard/index'),
			name: 'dashboard',
			meta: { title: '首页', icon: 'dashboard' }
		}]
	},
	{
		path: '/401',
		component: () => import('@/views/errorPage/401'),
		hidden: true,
	},
	{ path: '/404',
		component: () => import('@/views/errorPage/404'),
		hidden: true,
	}
]

export default new Router({
  // mode: 'history', //后端支持
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap //实例化vue时只挂载constantRouter
})

// 需要根据权限动态加载的路由表
export const asyncRouterMap = [
  {
    path: '/exam',
    component: Layout,
    redirect: '/exam',
    name: 'Exam',
    meta: { title: '考核管理',
  					icon: 'exam',
  					permission: ['exam:query'] },
    children: [
			{
			  path: 'basis',
			  name: 'Basis',
			  component: () => import('@/views/examBasis/index'),
			  meta: { title: '指标依据',
								icon: 'basis',
								permission: ['examBasis:query'] }
      },
      {
			  path: 'basisExamMonth',
				name: 'BasisExamMonth',
			  component: () => import('@/views/examBasis/addBasis'),
			  meta: { title: '设置考核依据',
								noCache: true,
								activeMenu: '/exam/basisExamMonth' },
			  hidden: true
      },
      {
  		  path: 'temp',
  		  name: 'Temp',
  		  component: () => import('@/views/examTemp/index'),
  		  meta: { title: '模板配置',
  							icon: 'temp',
  							permission: ['examTemp:query'] }
      },
      {
			  path: 'addtemp',
				name: 'Addtemp',
			  component: () => import('@/views/examTemp/addtemp'),
			  meta: { title: '编辑模板',
								noCache: true,
								activeMenu: '/exam/addtemp' },
			  hidden: true
			},
      {
        path: 'target',
        name: 'Target',
        component: () => import('@/views/examTargetNew/index'),
        meta: { title: '质控考核',
  							icon: 'dataitem',
  							permission: ['examTarget:query'] }
			},
			{
  		  path: 'examMonthTemp',
  		  name: 'ExamMonthTemp',
  		  component: () => import('@/views/ExamMonthTemp/index'),
  		  meta: { title: '生成考核模板',
  							icon: 'month',
  							permission: ['examMonthTemp:query'] }
			},
			{
  		  path: 'examMonthAll',
  		  name: 'ExamMonthAll',
  		  component: () => import('@/views/examMonthAll/index'),
  		  meta: { title: '全科考核上报',
  							icon: 'month',
  							permission: ['examMonthAll:query'] }
  		},
      {
			  path: 'score',
				name: 'score',
			  component: () => import('@/views/examTarget/Score'),
			  meta: { title: '设置考核依据',
								noCache: true,
								activeMenu: '/exam/score' },
			  hidden: true
			},
  		{
  		  path: 'examMonth',
  		  name: 'ExamMonth',
  		  component: () => import('@/views/examMonth/index'),
  		  meta: { title: '考核上报',
  							icon: 'month',
  							permission: ['examMonth:query'] }
  		},
			{
			  path: 'execExamMonth',
				name: 'ExecExamMonth',
			  component: () => import('@/views/examMonth/exec'),
			  meta: { title: '执行月度考核',
								noCache: true,
								activeMenu: '/exam/examMonth' },
			  hidden: true
			},
			{
			  path: 'examTime',
			  name: 'ExamTime',
        component: () => import('@/views/formula/index'),
			  meta: { title: '上报审核',
								icon: 'imme',
								permission: ['bnsFormula:query'] }
			},
			{
			  path: 'examMonthTempAll',
			  name: 'ExamMonthTempAll',
        component: () => import('@/views/examMonthTempAll/index'),
			  meta: { title: '考核汇总',
								icon: 'imme',
								permission: ['examMonthTempAll:query'] }
			}
    ]
  },
	// {
	//   path: '/aim',
	//   component: Layout,
	//   redirect: '/aim',
	//   name: 'Aim',
	//   meta: { title: '目标管理',
	// 					icon: 'aim',
	// 					permission: ['aim:query'] },
	//   children: [
	// 		{
	// 		  path: 'aimLib',
	// 		  name: 'aimLib',
	// 		  component: () => import('@/views/aimLib/index'),
	// 		  meta: { title: '目标库',
	// 							icon: 'aimdeploy' }
  //     },
	//     {
	//       path: 'aimConfig',
	//       name: 'AimConfig',
	//       component: () => import('@/views/aimConfig/index'),
	//       meta: { title: '目标配置',
	// 							icon: 'aimdeploy',
	// 							permission: ['aimConfig:query'] }
	// 		},
	// 		{
	// 		  path: 'aimReport',
	// 		  name: 'AimReport',
	// 		  component: () => import('@/views/aimReport/index'),
	// 		  meta: { title: '目标执行',
	// 							icon: 'do',
	// 							permission: ['aimReport:query'] }
	// 		},
	// 		{
	// 		  path: 'aimBreak',
	// 		  name: 'AimBreak',
	// 		  component: () => import('@/views/aimBreak/index'),
	// 		  meta: { title: '目标分解',
	// 							icon: 'do'}
	// 		},
	// 		{
	// 		  path: 'aimMonitor',
	// 		  name: 'AimMonitor',
	// 		  component: () => import('@/views/aimMonitor/index'),
	// 		  meta: { title: '监控审核',
	// 							icon: 'monitor',
	// 							permission: ['aimMonitor:query'] }
	// 		},
	// 		{
	// 		  path: 'aimProgress',
	// 		  name: 'AimProgress',
	// 		  component: () => import('@/views/aimProgress/index'),
	// 		  meta: { title: '全局进度',
	// 							icon: 'progress',
	// 							permission: ['aimProgress:query'] }
	// 		}
	//   ]
	// },
	{
	  path: '/bns',
	  component: Layout,
	  redirect: '/bns',
	  name: 'Bns',
	  meta: { title: '核算配置',
						icon: 'bns',
						permission: ['bnsInfo:query'] },
	  children: [
	    {
	      path: 'dataItem',
	      name: 'DataItem',
	      component: () => import('@/views/dataItem/index'),
	      meta: { title: '核算因子',
								icon: 'dataitem',
								permission: ['bnsDataItem:query'] }
	    },
			{
			  path: 'coef',
			  name: 'Coef',
			  component: () => import('@/views/coef/index'),
			  meta: { title: '核算权重',
								icon: 'money',
								permission: ['bnsCoef:query'] }
			},
			{
			  path: 'formulas',
			  name: 'Formulas',
			  component: () => import('@/views/formulas/index'),
			  meta: { title: '核算公式',
								icon: 'formulaBig',
								permission: ['bnsFormula:query'] }
			}
	  ]
	},
	{
	  path: '/itemReport',
	  component: Layout,
	  redirect: '/itemReport',
	  name: 'report',
	  meta: { title: '因子数据',
						icon: 'datareport',
						permission: ['itemReport:query'] },
	  children: [
	    {
	      path: 'handleItemData',
	      name: 'HandleItem',
	      component: () => import('@/views/dataHandleItem/index'),
	      meta: { title: '手动填报',
								icon: 'handle',
								permission: ['handleItem:query'] }
	    },
			{
			  path: 'handleFill',
				name: 'HandleFill',
			  component: () => import('@/views/dataHandleItem/fill'),
			  meta: { title: '填报数据',
								noCache: true,
								activeMenu: '/itemReport/handleItemData' },
			  hidden: true
			},
			{
			  path: 'interFaceItemData',
			  name: 'InterFaceItem',
			  component: () => import('@/views/dataInterFaceItem/index'),
			  meta: { title: '接口导入',
								icon: 'interface',
								permission: ['interfaceItem:query'] }
			},
			{
			  path: 'interFaceData',
				name: 'InterFaceData',
			  component: () => import('@/views/dataInterFaceItem/fill'),
			  meta: { title: '提取明细',
								noCache: true,
								activeMenu: '/itemReport/dataInterFaceItem' },
			  hidden: true
			},
			{
			  path: 'examItemData',
			  name: 'ExamItemData',
			  component: () => import('@/views/dataExamItem/index'),
			  meta: { title: '考核导入',
								icon: 'examImport',
								permission: ['examImport:query'] }
			},
			{
			  path: 'examImportData',
				name: 'ExamImportData',
			  component: () => import('@/views/dataExamItem/fill'),
			  meta: { title: '考核结果',
								noCache: true,
								activeMenu: '/itemReport/examItemData' },
			  hidden: true
			}
	  ]
	},
	{
	  path: '/adjustment',
	  component: Layout,
	  redirect: '/adjustment',
	  name: 'Adjustment',
	  meta: { title: '数据调整',
						icon: 'list',
						permission: ['adjustment:query'] },
	  children: [
			{
				path: 'incomeadjust',
	      name: 'incomeadjust',
	      component: () => import('@/views/incomeadjust/index'),
	      meta: { title: '收入调整',
								icon: 'aimdeploy',
								permission: ['incomeadjust:query'] }
	    },
			{
				path: 'incomeadjustConfirm',
	      name: 'incomeadjustConfirm',
	      component: () => import('@/views/incomeadjustConfirm/index'),
	      meta: { title: '收入调整审核',
								icon: 'aimdeploy',
								permission: ['incomeadjustConfirm:query'] }
	    },
			{
				path: 'costAdjustment',
	      name: 'costAdjustment',
	      component: () => import('@/views/costAdjust/index'),
	      meta: { title: '成本调整',
								icon: 'aimdeploy',
								permission: ['costAdjust:query'] }
	    },
		
			{
				path: 'costAdjustConfirm',
	      name: 'costAdjustConfirm',
	      component: () => import('@/views/costAdjustConfirm/index'),
	      meta: { title: '成本调整审核',
								icon: 'aimdeploy',
								permission: ['costAdjustConfirm:query'] }
	    },
		
	  ]
	},
	{
	  path: '/formulaRunResult',
	  component: Layout,
	  redirect: '/formulaRunResult',
	  name: 'run',
	  meta: { title: '月度核算',
						icon: 'list',
						permission: ['run:query'] },
	  children: [
			// {
			// 	path: 'incomeAdjustment',
	    //   name: 'IncomeAdjustment',
	    //   component: () => import('@/views/incomeAdjustment/index'),
	    //   meta: { title: '收入调整',
			// 					icon: 'bnsForDept',
			// 					permission: ['bnsForDept:query'] }
	    // },
	    {
	      path: 'deptRun',
	      name: 'DeptRun',
	      component: () => import('@/views/bnsForDeptRun/index'),
	      meta: { title: '科室核算',
								icon: 'bnsForDept',
								permission: ['bnsForDept:query'] }
			},
			
			{
			  path: 'perRun',
				name: 'PerRun',
			  component: () => import('@/views/bnsForPerRun/index'),
			  meta: { title: '人员核算',
								icon: 'bnsForPer',
								permission: ['bnsForPer:query'] }
			},
			{
			  path: 'closeAccount',
			  name: 'CloseAccount',
			  component: () => import('@/views/accountStatus/index'),
			  meta: { title: '终审封账',
								icon: 'closeAccount',
								permission: ['closeAccount:query'] }
			}
	  ]
	},
	{
	  path: '/feedBack',
	  component: Layout,
	  redirect: '/feedBack',
	  name: 'Feedback',
	  meta: { title: '反馈分配',
						icon: 'feedBack',
						permission: ['feedBack:query'] },
	  children: [
			{
	      path: 'feedBackType',
	      name: 'FeedBackType',
	      component: () => import('@/views/feedBackType/index'),
	      meta: { title: '二次分配明细',
								icon: 'feedBackItem',
								permission: ['feedBackType:query'] }
	    },
	    {
	      path: 'feedBackItem',
	      name: 'FeedBackItem',
	      component: () => import('@/views/feedBackItem/index'),
	      meta: { title: '分配配置',
								icon: 'feedBackItem',
								permission: ['feedBackItem:query'] }
	    },
			{
			  path: 'verticalManagement',
				name: 'VerticalManagement',
			  component: () => import('@/views/feedBackVertical/index'),
			  meta: { title: '垂直管理',
								icon: 'vertical',
								permission: ['vertical:query'] }
			},
			{
			  path: 'releasePerformance',
			  name: 'ReleasePerformance',
			  component: () => import('@/views/releasePerformance/index'),
			  meta: { title: '绩效发放',
								icon: 'release',
								permission: ['releaseData:query']}
			},
			{
			  path: 'feedBackFill',
			  name: 'FeedBackFill',
			  component: () => import('@/views/v2/feedBack/report/index'),
			  meta: { title: '分配填报',
								icon: 'feedBackFill',
								permission: ['feedBackFill:query'] }
			},
			// {
			//   path: 'reportFill',
			// 	name: 'ReportFill',
			//   component: () => import('@/views/feedBackFill/fill'),
			//   meta: { title: '分配填报',
			// 					noCache: true,
			// 					activeMenu: '/feedBack/feedBackFill' },
			//   hidden: true
			// },
			// {
			// 	path: 'feedBackExamine',
			// 	name: 'FeedBackExamine',
			// 	component: () => import('@/views/feedBackExamine/index'),
			// 	meta: { title: '反馈审核',
			// 					icon: 'examine',
			// 					permission: ['examine:query']}
			// }
			{
				path: 'feedBackExamine',
				name: 'FeedBackExamine',
				component: () => import('@/views/v2/feedBack/examine/index'),
				meta: { title: '反馈审核',
								icon: 'examine',
								permission: ['examine:query']}
			}
	  ]
	},
	{
	  path: '/information',
	  component: Layout,
	  redirect: '/information',
	  name: 'Information',
	  meta: { title: '信息管理',
						icon: 'example',
						permission: ['appBaseInfo:query'] },
	  children: [
	    {
	      path: 'hospital',
	      name: 'Hospital',
	      component: () => import('@/views/hospital/index'),
	      meta: { title: '院属',
								icon: 'star',
								permission: ['hospital:query'] }
	    },
	    {
	      path: 'department',
	      name: 'Department',
	      component: () => import('@/views/department/index'),
	      meta: { title: '科室信息',
								icon: 'dept',
								permission: ['department:query'] }
	    },
			{
			  path: 'person',
			  name: 'Person',
			  component: () => import('@/views/person/index'),
			  meta: { title: '人员信息',
								icon: 'people',
								permission: ['person:query'] }
			},
			{
			  path: 'personAdjust',
			  name: 'personAdjust',
			  component: () => import('@/views/personadjust/index'),
			  meta: { title: '人员调整',
								icon: 'people',
								permission: ['person:query'] }
								,hidden: true
			},
			{
			  path: 'position',
			  name: 'Position',
			  component: () => import('@/views/position/index'),
			  meta: { title: '职位管理',
								icon: 'position',
								permission: ['position:query'] }
			},
			{
			  path: 'professTitle',
			  name: 'ProfessTitle',
			  component: () => import('@/views/professTitle/index'),
			  meta: { title: '职称管理',
								icon: 'profess',
								permission: ['profess:query'] }
			}
	  ]
	},
	{
	  path: '/userRole',
	  component: Layout,
	  redirect: '/userRole',
	  name: 'UserRole',
	  meta: { title: '用户权限',
						icon: 'userRole',
						permission: ['userRole:query'] },
	  children: [
	    {
	      path: 'userInfo',
	      name: 'UserInfo',
	      component: () => import('@/views/user/index'),
	      meta: { title: '用户信息',
								icon: 'useInfo',
								permission: ['userInfo:query']}
	    },
			{
			  path: 'roleInfo',
				name: 'RoleInfo',
			  component: () => import('@/views/role/index'),
			  meta: { title: '权限管理',
								icon: 'roleInfo',
								permission: ['roleInfo:query'] }
			}
	  ]
	},
	{
		path: '/externalLink',
		component: Layout,
		redirect: '/externalLink',
		name: 'ExternalLink',
		meta: { title: '报表平台',
						icon: 'reportmanage',
						permission: ['externalLink:query'] },
		children: [
		  {
		    path: 'linkManage',
		    name: 'LinkManage',
		    component: () => import('@/views/link/index'),
		    meta: { title: '链接配置',
								icon: 'linkmanage',
								permission: ['linkManage:query']}
		  },
			{
			  path: 'reportManage',
				name: 'ReportManage',
			  component: () => import('@/views/reportManage/index'),
			  meta: { title: '报表管理',
								icon: 'reportInfo',
								permission: ['reportManage:query'] }
			},
			{
			  path: 'datamining',
				name: 'Datamining',
			  component: () => import('@/views/reportDatamining/index'),
			  meta: { title: '绩效分析',
								icon: 'datamining',
								permission: ['datamining:query'] }
			},
			{
				path: 'analysis',
				name: 'Analysis',
				component: () => import('@/views/reportAnalysis/index'),
				meta: { title: '业务分析',
								icon: 'datamining',
								permission: ['analysis:query'] }
			},
      {
        path: 'controlCost',
        name: 'ControlCost',
        component: () => import('@/views/reportControlCost/index'),
        meta: { title: '医保管控',
        				icon: 'datamining',
        				permission: ['controlCost:query'] }
      },
			{
				path: 'clinical',
				name: 'Clinical',
				component: () => import('@/views/reportClinical/index'),
				meta: { title: '临床查询',
								icon: 'datamining',
								permission: ['clinical:query'] }
			},
			{
				path: 'office',
				name: 'Office',
				component: () => import('@/views/reportOffice/index'),
				meta: { title: '机关查询',
								icon: 'datamining',
								permission: ['office:query'] }
			},
			{
				path: 'finance',
				name: 'Finance',
				component: () => import('@/views/reportFinance/index'),
				meta: { title: '财务审核',
								icon: 'datamining',
								permission: ['finance:query'] }
			},
			{
				path: 'reportAnalysisOther',
				name: 'ReportAnalysisOther',
				component: () => import('@/views/reportAnalysisOther/index'),
				meta: { title: '科室报表',
								icon: 'datamining',
								permission: ['reportAnalysisOther:query'] }
			}
		]
	},
	{
	  path: '/itface',
	  component: Layout,
	  redirect: '/itface',
	  name: 'Itface',
	  meta: { title: '接口设置',
						icon: 'itface',
						permission: ['itface:query'] },
	  children: [
	    {
	      path: 'itfaceServer',
	      name: 'ItfaceServer',
	      component: () => import('@/views/itfaceServer/index'),
	      meta: { title: '服务连接',
								icon: 'serverLink',
								permission: ['itfaceServer:query']}
	    },
			{
			  path: 'itfaceItem',
				name: 'ItfaceItem',
			  component: () => import('@/views/itfaceItem/index'),
			  meta: { title: '接口配置',
								icon: 'itfaceItem',
								permission: ['itfaceItem:query'] }
			},
			{
				path: 'handleExec',
				name: 'IntfaceHandleExec',
				component: () => import('@/views/itfaceHandleExec/index'),
				meta: { title: '接口执行',
								icon: 'exec',
								permission: ['itfaceExec:query'] }
			},
      {
      	path: 'medicalInsurance',
      	name: 'MedicalInsurance',
      	component: () => import('@/views/medicalInsurance/index'),
      	meta: { title: '医保结算',
      					icon: 'insurance',
								permission: ['itfaceExec:query'] },
								hidden: true
      }
	  ]
	},
	{
	  path: '/binding',
	  component: Layout,
	  redirect: '/binding',
	  name: 'DataBinding',
	  meta: { title: '基础对照',
						icon: 'binding',
						permission: ['binding:query'] },
	  children: [
	    {
	      path: 'departmentLink',
	      name: 'DepartmentLink',
				// component: () => import('@/views/bindDepartmentLink/indexKpi'),
				component: () => import('@/views/bindDepartmentLink/index'),
	      meta: { title: '以接口科室对照',
								icon: 'departmentLink',
								permission: ['departmentLink:query']}
			},
			{
	      path: 'departmentLinkKPI',
	      name: 'DepartmentLinkKPI',
				component: () => import('@/views/bindDepartmentLink/indexKpi'),
				// component: () => import('@/views/bindDepartmentLink/index'),
	      meta: { title: '以绩效科室对照',
								icon: 'departmentLink',
								permission: ['departmentLink:query']}
	    },
			{
			  path: 'personLink',
				name: 'PersonLink',
			  component: () => import('@/views/bindPersonLink/index'),
			  meta: { title: '人员对照',
								icon: 'personBinding',
								permission: ['personLink:query'] }
			},
			{
				path: 'chargeType',
				name: 'ChargeType',
				component: () => import('@/views/v2/baseChargeType/index'),
				meta: { title: '收入类别',
								icon: 'type',
								permission: ['chargeType:query'] }
			},
			{
				path: 'costType',
				name: 'costType',
				component: () => import('@/views/v2/baseCostType/index'),
				meta: { title: '成本类别',
								icon: 'type',
								permission: ['chargeType:query'] }
			},
			{
				path: 'chargeItem',
				name: 'ChargeItem',
				component: () => import('@/views/bindChargeItem/index'),
				meta: { title: '收费项目',
								icon: 'item',
								permission: ['chargeItem:query'] }
			}
	  ]
	},
	{
	  path: '/dataMonitor',
	  component: Layout,
	  redirect: '/dataMonitor',
	  name: 'DataMonitor',
	  meta: { title: '运营监控',
						icon: 'datareport',
						permission: ['dataMonitor:query'] },
	  children: [
	    {
	      path: 'deptRevenue',
	      name: 'DeptRevenue',
	      component: () => import('@/views/deptRevenue/index'),
	      meta: { title: '科室收入',
								icon: 'departmentLink',
								permission: ['dataMonitor:query'] }
			},
			{
				  path: 'reportFormulaRun',
				  name: 'ReportFormulaRun',
				  component: () => import('@/views/reportFormulaRun/index'),
				  meta: { title: '核算分析',
				  				icon: 'personBinding',
									permission: ['dataMonitor:query'] }
				},
			{
        path: 'reportBusiness',
        name: 'ReportBusiness',
        component: () => import('@/views/reportBusiness/index'),
        meta: { title: '运营分析',
        				icon: 'datamining',
								permission: ['dataMonitor:query'] }
			}
			// ,
			// {
      //   path: 'dipInfo',
      //   name: 'dipInfo',
      //   component: () => import('@/views/dip/index'),
      //   meta: { title: 'DIP分析',
      //   				icon: 'datamining'}
      // }
	  ]
	  }
]
