﻿<template>
  <div class="table">
    <Row>
      <Col span="24">
      <card>
        <p slot="title">
          <Icon type="mouse"></Icon>
          &nbsp;{{$t('lang_baseManage.baseTaxexemption.title')}}       </p>
        <Row>
          <Dropdown>
            <Button type="primary">
              {{select}}
              <Icon type="arrow-down-b"></Icon>
            </Button>
            <DropdownMenu slot="list" >
                <span key="index" @click="selected('',$t('button.all'))">
                  <DropdownItem name="">{{$t('button.all')}}</DropdownItem>
                </span>
              <span v-for="(item,index) in selectEmpType" :key="index" @click="selected(item.paramCode,item.paramInfoCn)">
                  <DropdownItem>{{item.paramInfoCn}}</DropdownItem>
                </span>
            </DropdownMenu>
          </Dropdown>
          <Button type="primary" @click="openUp(NaN,$t('button.add'))">{{$t('button.add')}}</Button>
          <Button type="error" @click="deletemsg">{{$t('button.del')}}</Button>
          <Button type="primary"  @click="expData">{{$t('button.exp')}}</Button>
          <Button type="primary" @click="importExcel">{{$t('button.imp')}}</Button>
        </Row>
        <row class="table-form" ref="table-form">
          <Table :loading="loading" @on-select="selectedtable" @on-selection-change="selectedtable" @on-sort-change="sortable" :height="tableheight" size="small" border ref="selection" :columns="columns" :data="data"></Table>
        </row>
                <Row style="display: flex">          <Page :total="total" :showTotal="showTotal" size="small" show-elevator show-sizer placement="top"  :current="page" @on-page-size-change="sizeChange" @on-change="pageChange" :page-size=rows :page-size-opts = "[10, 20, 50, 100]" ></Page><Button type="ghost" size="small" shape="circle" icon="refresh" style="margin-left: 20px;display: inline-block;" @click="search()"></Button></Row>
      </card>
      </Col>
    </Row>
    <transition name="fade">
      <update v-show="openUpdate" :id="updateId" :logType="logType" :index="index" @closeUp="closeUp" @getData="addNewArray" @update="updateArray" ref="update"></update>
    </transition>
    <transition >
      <expwindow v-show="openExp" :id="tableselected" @setFileKey="setFileKey" :logType="logType"  :index="index" @closeExp="closeExp" ref="expwindow"></expwindow>
    </transition>
    <transition >
      <expdow v-show="openExpDow" :filekey="filekey" :filename="filename"  @closeExpDowMain="closeExpDowMain" ref="expdow"></expdow>
    </transition>
    <transition name="fade">
      <importExcel v-show="openImport" :impid="updateId" @getData="getData" :imp_mt="imp_mt"  @closeImport="closeImport"ref="importExcel"></importExcel>
    </transition>
  </div>
</template>
<script>
  import update from './addNewTaxexemption'
  import { getDataLevelUserLoginNew, getDataLevelUserLogin } from '../../../axios/axios'
  import { isSuccess } from '../../../lib/util'
  import expwindow from '../../../components/fileOperations/expSms'
  import expdow from '../../../components/fileOperations/expdow'
  import importExcel from '../../../components/importModel/importParam'

  export default{
    data() {
      return {
        loading: "",
        imp_mt: 'baseTaxexemption.importData',
        openImport: false,
        expDataTital: [{ code: 'taxexeEmptypeName', name: this.$t('lang_baseManage.baseTaxexemption.taxexeEmptypeName') }, { code: 'taxexeThreshold', name: this.$t('lang_baseManage.baseTaxexemption.taxexeThreshold') },
          { code: 'taxexeSdate', name: this.$t('lang_baseManage.baseTaxexemption.taxexeSdate') }, { code: 'taxexeEdate', name: this.$t('lang_baseManage.baseTaxexemption.taxexeEdate') },
          { code: 'comment', name: this.$t('lang_baseManage.baseTaxexemption.comment') }],
        openExpDow: false,
        openExp: false,
        filekey: '',
        filename: '',
        selectEmpType: [],
        tableheight: document.body.offsetHeight - 280,
        value: '',
        select: this.$t('button.all'),
        logType: '',
        openUpdate: false,
        updateId: NaN,
        tableselected: [],
        columns: [
          {
            type: 'selection',
            width: 54,
            align: 'center',
            fixed: 'left'
          },
          {
            title: this.$t('lang_baseManage.baseTaxexemption.taxexeEmptypeName'),
            key: 'taxexeEmptypeName',
            sortable: 'custom',
//          width: 130,
          },
          {
            title: this.$t('lang_baseManage.baseTaxexemption.taxexeThreshold'),
            key: 'taxexeThreshold',
            sortable: 'custom',
//          width: 130,
          },
          {
            title: this.$t('lang_baseManage.baseTaxexemption.taxexeSdate'),
            key: 'taxexeSdate',
            sortable: 'custom',
//          width: 130,
          },
          {
            title: this.$t('lang_baseManage.baseTaxexemption.taxexeEdate'),
            key: 'taxexeEdate',
            sortable: 'custom',
//          width: 130,
          },
          {
            title: this.$t('button.opr'),
            key: 'action',
            width: 64,
            fixed: 'right',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                  },
                  on: {
                    click: () => {
                      this.openUp(params.row.id, this.$t('button.upd'), params.index)
                    },
                  },
                }, this.$t('button.upd')),
              ])
            },
          },
        ],
        data: [],
        total: 0,
         showTotal: true,
        index: 0,
        sort: 'id',
        order: 'desc',
        rows: 20,
        page: 1,
        funId: '1000',
        taxexeEmptypeName: '',
      }
    },
    computed: {

    },
    components: {
      update,
      expwindow,
      expdow,
      importExcel,
    },
    mounted() {
      this.getSelect()
      this.getData(1)
    },
    methods: {
      getData(page) {
        const t = this
        if (page) {
          t.page = page
        }
        if (typeof (page) == "undefined") {
          this.page = 1;
        }
        const data = {
          _mt: 'baseTaxexemption.getPage',
          rows: t.rows,
          page: t.page,
          sort: t.sort,
          order: t.order,
          logType: this.$t('button.ser'),
          taxexeEmptype: t.taxexeEmptypeName,
        }
        for (const dat in data) {
          if (data[dat] === '') {
            delete data[dat]
          }
        }
        t.loading = true; //请求之前重置状态
        getDataLevelUserLoginNew(data).then((res) => {
          if (isSuccess(res, t)) {
            t.loading = false; //在成功之后改状态
            t.data = res.data.content[0].rows
            t.total = res.data.content[0].records
          }
        }).catch(() => {
          t.loading = false; //在成功之后改状态
          t.$Message.error(this.$t('reminder.errormessage'))
        })
      },
      closeImport() {
        const t = this
        t.openImport = false
      },
      importExcel() {
        const t = this
        t.openImport = true
        t.$refs.importExcel.getDowModelFile()
      },
      expData() {
        const t = this
        const data = {
          taxexeEmptype: t.taxexeEmptypeName,
        }
        this.$refs.expwindow.getData(this.expDataTital, 'baseTaxexemption.export', data)
        this.openExp = true
      },
      closeExp() {
        const t = this
        t.openExp = false
      },
      closeExpDowMain() {
        const t = this
        t.openExpDow = false
      },
      setFileKey(filekey, filename, openExpDow) {
        const t = this
        t.filekey = filekey
        t.filename = filename
        t.openExpDow = openExpDow
        t.$refs.expdow.getPriToken(t.filekey)
      },
      addNewArray(res) {
        const t = this
        t.data.unshift(res)
      },
      updateArray(res) {
        const t = this
        t.data.splice(t.index, 1, res)
      },
      search(){
        this.getData(1);
        this.tableselected = [];
      },
      sortable(column) {
        this.sort = column.key
        this.order = column.order
        if (this.order !== 'normal') {
          this.getData()
        } else {
          this.order = 'desc'
        }
      },
      sizeChange(size) {
        const t = this
        t.rows = size
        t.getData()
      },
      pageChange(page) {
        const t = this
        t.page = page
        t.getData(t.page)
      },
      selectedtable(selection) {
        const newArr = []
        for (let i = 0; i < selection.length; i++) {
          newArr.push(selection[i].id)
        }
        this.tableselected = newArr
      },
      deletemsg() {
        const t = this
        if (t.tableselected.length === 0) {
          this.$Message.warning(this.$t('reminder.leastone'))
        } else {
        	t.$Modal.confirm({
        		title: this.$t('reminder.remind'),
        		content: this.$t('reminder.confirmdelete'),
        		onOk: () => {
        			getDataLevelUserLogin({
          _mt: 'baseTaxexemption.delByIds',
          funId: '1',
          logType: this.$t('button.del'),
          ids: t.tableselected.toString(),
        }).then((res) => {
          if (isSuccess(res, t)) {
            t.$Message.success(this.$t('reminder.deletesuccess'))
            t.tableselected = []
            t.getData()
          }
        }).catch(() => {
            t.$Message.error(this.$t('reminder.errormessage'))
        })
        		},
        		onCancel: () => {},
        	})
        }
      },
      selected(key, name) {
        this.select = name
        this.taxexeEmptypeName = key
        this.getData(1)
      },
      open() {
        const t = this
        t.opendialog = true
      },
      getSelect() {
        const t = this
        getDataLevelUserLogin({
          _mt: 'baseParmInfo.getSelectValue',
          typeCode: 'emptype',
        }).then((res) => {
          if (isSuccess(res, t)) {
            t.selectEmpType = (res.data.content[0].value[0].paramList)
          }
        }).catch(() => {
          t.$Message.error(this.$t('reminder.errormessage'))
        })
      },
      openUp(id, logType, index) {
        const t = this
        t.updateId = parseInt(id, 10)
        t.logType = logType
        t.openUpdate = true
        t.index = index
//        t.$refs.update.getSelect()
        if (logType === this.$t('button.upd')) {
          t.$refs.update.getData(id)
        }
      },
      close() {
        const t = this
        t.opendialog = false
      },
      closeUp() {
        const t = this
        t.openUpdate = false
        t.$refs.update.formValidate.taxexeEmptype = ''
        t.$refs.update.formValidate.taxexeEmptypeName = ''
        t.$refs.update.formValidate.taxexeThreshold = ''
        t.$refs.update.formValidate.taxexeSdate = ''
        t.$refs.update.formValidate.taxexeEdate = ''
        t.$refs.update.formValidate.comment = ''
      },
    },
  }
</script>
<style lang="scss" scoped>
  .table-form{
    margin: 10px 0;
  }
  .margin-right-10{
    margin-right: 10px;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .2s
  }
  .fade-enter, .fade-leave-to {
    opacity: 0
  }
</style>
