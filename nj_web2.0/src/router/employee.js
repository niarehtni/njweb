/**
 * Created by Aaron on 2018/3/2.
 */

//用户普通角色组管理
import empRefund from '@/pages/empManage/empRefund/empRefund.vue'
import empBorrow from '@/pages/empManage/empBorrow/empBorrow.vue'
import empOfficial from '@/pages/empManage/empofficial/empOfficial.vue'
import empMaster from '@/pages/empManage/empmaster-manage3/empmasterList.vue'
import empContractList from '@/pages/empManage/empcontract-manage/empContractList'
import empContractRenewalList from '@/pages/empManage/empcontractRenewal-manage/empContractRenewalList'
import visaAreaList from '@/pages/empManage/visaArea-manage/visaAreaList'
import empDepminManage from '@/pages/empManage/empDepmin/empDepminRule'

// 出国统计看板
const abordeCountShow = resolve => require(['@/pages/empManage/aborde-count-show/abordeCountShow'], resolve)
// 逾期未回国查询
const laterreturnRecord = resolve => require(['@/pages/empManage/laterreturn-manage/laterreturnRecord'], resolve)

const goaborddetail = resolve => require(['@/pages/empManage/goaborddetail-manage/goaborddetail'], resolve)

const resumeNumMange = resolve => require(['@/pages/RmResumeMange/resumeNumMange'], resolve)

const depManage = resolve => require(['@/pages/empManage/depManage/depManage'], resolve)

const attenManage = resolve => require(['@/pages/attenManage/attenQuotainfo/attenQuotainfoList'], resolve)

const attenMonthManage = resolve => require(['@/pages/attenManage/attenMonthorigi/attenMonthorigiList'], resolve)

const protocolManage = resolve => require(['@/pages/protocolManage/protocolManage'], resolve)

const recruitResumeManage = resolve => require(['@/pages/empManage/RecruitResume-manage/recruitResumeManage'], resolve)

const salaryRule = resolve => require(['@/pages/empManage/salaryRule/salaryRule'], resolve)

const depCeilRule = resolve => require(['@/pages/empManage/depCeilRule/depCeilRule'], resolve)

const empEmpupd = resolve => require(['@/pages/empManage/empEmpupd/empEmpupdList'], resolve)
//坐席状态信息
const empSeat = resolve => require(['@/pages/empManage/empSeat/empSeatList'], resolve)
export default [
    {
        path: 'empSeat',
        name: 'empSeat',
        component: empSeat,
      },
    {
    path: 'goaborddetail',
    name: 'goaborddetail',
    component: goaborddetail,
  },
  {
    path: 'laterreturnRecord',
    name: 'laterreturnRecord',
    component: laterreturnRecord,
  },
  {
    path: 'visaAreaList',
    name: 'visaAreaList',
    component: visaAreaList,
  },
  {
    path: 'empMaster',
    name: 'empMaster',
    component: empMaster,
  },
  {
    path: 'empContractList',
    name: 'empContractList',
    component: empContractList,
  },
  {
    path: 'empContractRenewalList',
    name: 'empContractRenewalList',
    component: empContractRenewalList,
  },
  {
    path: 'abordeCountShow',
    name: 'abordeCountShow',
    component: abordeCountShow,
  },
  {
    path: 'empOfficial',
    name: 'empOfficial',
    component: empOfficial,
  },
  {
    path: 'rmResume',
    name: 'rmResume',
    component: resumeNumMange,
  },
  {
    path: 'depManage',
    name: 'depManage',
    component: depManage,
  },
  {
    path: 'empDepminManage',
    name: 'empDepminManage',
    component: empDepminManage,
  },
  {
    path: 'protocolManage',
    name: 'protocolManage',
    component: protocolManage,
  },
  {
    path: 'recruitResumeManage',
    name: 'recruitResumeManage',
    component: recruitResumeManage,
  },
  {
    path: 'empBorrow',
    name: 'empBorrow',
    component: empBorrow,
  },
  {
    path: 'salaryRule',
    name: 'salaryRule',
    component: salaryRule,
  },
  {
    path: 'empRefund',
    name: 'empRefund',
    component: empRefund,
  },
  {
    path: 'depCeilRule',
    name: 'depCeilRule',
    component: depCeilRule,
  },
  {
    path: 'empEmpupd',
    name: 'empEmpupd',
    component: empEmpupd,
  },
  {
    path: 'attenManage',
    name: 'attenManage',
    component: attenManage,
  },
  {
    path: 'attenMonthManage',
    name: 'attenMonthManage',
    component: attenMonthManage,
  },
]
