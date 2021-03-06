/**
 * Created by Aaron on 2018/04/08.
 */

import paySalItemManage from  '@/pages/payroll/paySalItem/paySalItemManage'
import paySalSetManage from '@/pages/payroll/paySalSet/paySalSetManage'
import paySalplanManage from '@/pages/payroll/paySalplan/paySalplanManage'
import paySalplanConfirmManage from '@/pages/payroll/PaySalplanConfirm/paySalplanManage'
import paySalplanPostManage from '@/pages/payroll/paySalplanPost/paySalplanManage'
import payPlantemplateList from '@/pages/payroll/PayPlantemplate/payPlantemplateList'
import paySalplanCheckManage from '@/pages/payroll/paySalplanCheck/paySalplanManage'
import payCompList from '@/pages/payroll/payCompConfig/payCompList'
//薪资流程配置
import payProcess from '@/pages/payroll/PayProcessconfig/payProcess'
//入职薪资处理
import payAddCheck from '@/pages/payroll/payAddManage/payAddCheck/payAddList'
import payAddConfirm from '@/pages/payroll/payAddManage/payAddConfirm/payAddList'
import payAddSysUpd from '@/pages/payroll/payAddManage/payAddSysUpd/payAddList'
//离职薪资处理
import payEndCheck from '@/pages/payroll/payEndManage/payEndCheck/payEndList'
import payEndConfirm from '@/pages/payroll/payEndManage/payEndConfirm/payEndList'
import payEndSysUpd from '@/pages/payroll/payEndManage/payEndSysUpd/payEndList'
//薪资调整处理
import payAdjustApplication from '@/pages/payroll/payAdjustManage/payAdjustApplication/payAdjustList'
import payAdjustConfirm from '@/pages/payroll/payAdjustManage/payAdjustConfirm/payAdjustList'
import payAdjustSysUpd from '@/pages/payroll/payAdjustManage/payAdjustSysUpd/payAdjustList'
import empPayrollSalary from '@/pages/payroll/empPayrollSalary/salaryBaseManage'
//月度非周期性薪资收集
import payMonPeriodSubmit from '@/pages/payroll/PayMonPeriodManage/payMonSubmit/payMonPeriodManage'
import payMonPeriodConfirm from '@/pages/payroll/PayMonPeriodManage/payMonConfirm/payMonPeriodManage'
import payMonPeriodSysUpd from '@/pages/payroll/PayMonPeriodManage/payMonSysUpd/payMonPeriodManage'
// 月薪资核算处理
import payAccountList from '@/pages/payroll/payAccount/payAccountList'

import payrollReportManage from '@/pages/payroll/payrollReport/payrollReportManage'
// 专项附加税
import SpecialSurtax from '@/pages/payroll/SpecialSurtax/SpecialSurtax'
// 员工薪资查询
import empPayrollList from '@/pages/payroll/emPayrollSearch/empPayrollList'
//项目提拔提成
import payPromotedList from '@/pages/payroll/payPromotedManage/payPromotedList'
//项目异动提成
import payProjchangeList from '@/pages/payroll/payProjchangeManage/payProjchangeList'
//项目提成配置
import payPercentageManage from '@/pages/payroll/payPercentage/payPercentageList'
//项目成本管理
import payCostManage from '@/pages/payroll/payCost/payCostList'
//项目分摊管理
import payShareManage from '@/pages/payroll/payShare/payShareList'
//项目业绩基础信息
import payProjbaseManage from '@/pages/payroll/payProjbase/payProjbaseList'

//日薪资核算处理
import payDayAccountList from '@/pages/payroll/payDayAccount/payDayAccountList'

//项目收益管理
import payProfitList from '@/pages/payroll/payProfit/payProfitList'

//外包员工薪资
import payEmpoutSalaryList from '@/pages/payroll/payEmpoutSalary/payEmpoutSalaryList'

//员工薪资发放
import payEmpgrantList from '@/pages/payroll/payEmpgrant/payEmpgrantList'
//项目离职率
import payLeavepropList from '@/pages/payroll/payLeavepropManage/payLeavepropList'
//项目入职管理
import payEntrybaseList from '@/pages/payroll/payEntrybaseManage/payEntrybaseList'

export default [
    {
        path: 'payLeavepropList',
        name: 'payLeavepropList',
        component: payLeavepropList,
      },
	  {
        path: 'payEntrybaseList',
        name: 'payEntrybaseList',
        component: payEntrybaseList,
      },
    {
      path: 'payProjchangeList',
      name: 'payProjchangeList',
      component: payProjchangeList,
    },
    {
      path: 'payPromotedList',
      name: 'payPromotedList',
      component: payPromotedList,
    },
    {
      path: 'empPayrollList',
      name: 'empPayrollList',
      component: empPayrollList,
    },
    {
      path: 'paySalItemManage',
      name: 'paySalItemManage',
      component: paySalItemManage,
    },
    {
      path: 'paySalSetManage',
      name: 'paySalSetManage',
      component: paySalSetManage,
    },
    {
      path: 'paySalplanManage',
      name: 'paySalplanManage',
      component: paySalplanManage,
    },
    {
      path: 'paySalplanConfirmManage',
      name: 'paySalplanConfirmManage',
      component: paySalplanConfirmManage,
    },
    {
      path: 'paySalplanCheckManage',
      name: 'paySalplanCheckManage',
      component: paySalplanCheckManage,
    },
    {
      path: 'paySalplanPostManage',
      name: 'paySalplanPostManage',
      component: paySalplanPostManage,
    },
    {
      path: 'payPlantemplateList',
      name: 'payPlantemplateList',
      component: payPlantemplateList,
    },
    {
      path: 'payCompList',
      name: 'payCompList',
      component: payCompList,
    },
    {
      path: 'payProcess',
      name: 'payProcess',
      component: payProcess,
    },
    {
      path: 'payAddCheck',
      name: 'payAddCheck',
      component: payAddCheck,
    },
    {
      path: 'payAddConfirm',
      name: 'payAddConfirm',
      component: payAddConfirm,
    },
    {
      path: 'payAddSysUpd',
      name: 'payAddSysUpd',
      component: payAddSysUpd,
    },
    {
      path: 'payEndCheck',
      name: 'payEndCheck',
      component: payEndCheck,
    },
    {
      path: 'payEndConfirm',
      name: 'payEndConfirm',
      component: payEndConfirm,
    },
    {
      path: 'payEndSysUpd',
      name: 'payEndSysUpd',
      component: payEndSysUpd,
    },
    {
      path: 'payAdjustApplication',
      name: 'payAdjustApplication',
      component: payAdjustApplication,
    },
    {
      path: 'payAdjustConfirm',
      name: 'payAdjustConfirm',
      component: payAdjustConfirm,
    },
    {
      path: 'payAdjustSysUpd',
      name: 'payAdjustSysUpd',
      component: payAdjustSysUpd,
    },
    {
      path: 'empPayrollSalary',
      name: 'empPayrollSalary',
      component: empPayrollSalary,
    },
    {
      path: 'payMonPeriodSubmit',
      name: 'payMonPeriodSubmit',
      component: payMonPeriodSubmit,
    },
    {
      path: 'payMonPeriodConfirm',
      name: 'payMonPeriodConfirm',
      component: payMonPeriodConfirm,
    },
    {
      path: 'payMonPeriodSysUpd',
      name: 'payMonPeriodSysUpd',
      component: payMonPeriodSysUpd,
    },
    {
      path: 'payAccountList',
      name: 'payAccountList',
      component: payAccountList,
    },
    {
      path: 'payrollReportManage',
      name: 'payrollReportManage',
      component: payrollReportManage,
    },
    {
      path: 'SpecialSurtax',
      name: 'SpecialSurtax',
      component: SpecialSurtax,
    },
    {
      path: 'payPercentageManage',
      name: 'payPercentageManage',
      component: payPercentageManage,
    },
    {
      path: 'payCostManage',
      name: 'payCostManage',
      component: payCostManage,
    },
    {
      path: 'payShareManage',
      name: 'payShareManage',
      component: payShareManage,
    },
    {
      path: 'payDayAccountList',
      name: 'payDayAccountList',
      component: payDayAccountList,
    },
    {
      path: 'payProfitList',
      name: 'payProfitList',
      component: payProfitList,
    },
    {
      path: 'payEmpoutSalaryList',
      name: 'payEmpoutSalaryList',
      component: payEmpoutSalaryList,
    },
    {
      path: 'payEmpgrantList',
      name: 'payEmpgrantList',
      component: payEmpgrantList,
    },
  {
    path: 'payProjbaseManage',
    name: 'payProjbaseManage',
    component: payProjbaseManage,
  },
]
