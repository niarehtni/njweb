﻿<template>
  <div class="table">
    <Row>
      <Col span="24">
        <card>
          <p slot="title">
            <Icon type="mouse"></Icon>&nbsp;离职员工名单
          </p>
          <Row>
            <Col span="18" style="width: 100% !important">
              <Row>
                 <Input placeholder="请输入员工姓名"
                               style="width: 160px"
                               @on-enter="enterEvent"
                               v-model="empnhName" />
                <DatePicker
                  type="date"
                  placeholder="请选择离职日期区间"
                  :editable="false"
                  v-model="empnhLevday"
                  style="width: 200px"
                ></DatePicker>
                <DatePicker
                  type="date"
                  placeholder="请选择离职日期区间"
                  :editable="false"
                  v-model="dimLevsqday"
                  style="width: 200px"
                ></DatePicker>
                <btnList
                  @buttonExport="expData"
                  @buttonImport="importExcel"
                  @buttonAdd="openUp(NaN,$t('button.add'))"
                  @buttonDel="deletemsg"
                  @buttonSearch="search"
                  @buttonConfirm="modifystatus('02ok')"
                  @moditySelect="modityChange"
                  :btnData="btnData"
                  :FlowNode="FlowNode"
                ></btnList>
              </Row>
              <!--布置分页列表 变量通用 无需变更-->
              <row class="table-form" ref="table-form">
                <Table
                  @on-selection-change="selectedtable"
                  @on-sort-change="sortable"
                  :current="page"
                  :height="tableheight"
                  size="small"
                  border
                  ref="selection"
                  :columns="columns"
                  :data="data"
                ></Table>
              </row>
              <Row style="display: flex">
                <Page
                  :total="total"
                  showTotal
                  :current="page"
                  size="small"
                  show-elevator
                  show-sizer
                  placement="top"
                  @on-page-size-change="sizeChange"
                  @on-change="pageChange"
                  :page-size="rows"
                  :page-size-opts="[10, 20, 50, 100]"
                ></Page>
                <Button
                  type="ghost"
                  size="small"
                  shape="circle"
                  icon="refresh"
                  style="margin-left: 20px;display: inline-block;"
                  @click="search()"
                ></Button>
              </Row>
            </Col>
          </Row>
        </card>
      </Col>
    </Row>
    <!--布置子页面 v-show控制是否显示 :**是传递到子页面的值  @**是传递到子页面的方法 无需变更-->
    <!--导入导出子页面 若没有导入导出可以去掉-->
    <transition>
      <expwindow
        v-show="openExp"
        :id="tableselected"
        @setFileKey="setFileKey"
        :logType="logType"
        :index="index"
        @closeExp="closeExp"
        ref="expwindow"
      ></expwindow>
    </transition>
    <transition>
      <expdow
        v-show="openExpDow"
        :filekey="filekey"
        :filename="filename"
        @closeExpDowMain="closeExpDowMain"
        ref="expdow"
      ></expdow>
    </transition>
    <transition name="fade">
      <importExcel
        v-show="openImport"
        :impid="updateId"
        :imp_mt="imp_mt"
        @getData="getData"
        @closeImport="closeImport"
        ref="importExcel"
      ></importExcel>
    </transition>
  </div>
</template>
<script>
// 默认引用 无需变更
import { isSuccess } from "../../lib/util";
import {
  getDataLevelUserLoginNew,
  getDataLevelUserLogin
} from "../../axios/axios";
import expwindow from "../../components/fileOperations/expSms";
import expdow from "../../components/fileOperations/expdow";
import importExcel from "../../components/importModel/importParam";
import btnList from "../../components/btnAuth/btnAuth";
export default {
  data() {
    return {
      tableOperate: false,
      // 导入的mt名称
      imp_mt: "protocolManage.importData",
      // 导出字段设置, code字段名 name列名
      expDataTital: [
        { code: "deptOneName", name: "一级部门及分公司" },
        { code: "deptTwoName", name: "二级部门" },
        { code: "deptThreeName", name: "项目" },
        { code: "empnhName", name: "姓名" },
        { code: "postFname", name: "岗位" },
        { code: "postTypeDis", name: "职级" },
        { code: "empnhPmpDis", name: "直接领导" },
        { code: "empnhWklocatDis", name: "工作属地" },
        { code: "empnhGenderDis", name: "性别" },
        { code: "empnhEntrydate", name: "入职日期" },
        { code: "empAge", name: "司龄" },
        { code: "empAgeRange", name: "司龄分段" },
        { code: "stateDis", name: "离职情况" },
        { code: "dimAttday", name: "考勤截止时间" },
        { code: "dimLastsalday", name: "工资发放时间" },
        { code: "empnhLevday", name: "自离离职日期" },
        { code: "dimActlevday", name: "办理离职日期" },
        { code: "empnhIdno", name: "身份证号码" },
        { code: "empnhBirthdate", name: "出生日期" },
        { code: "ageNum", name: "年龄" },
        { code: "ageSlice", name: "年龄分层" },
        { code: "empnhMobile", name: "联系电话" },
        { code: "empnhResiaddr", name: "现居地址" },
        { code: "empnhRegaddr", name: "身份证地址" },
        { code: "edSchool", name: "毕业院校" },
        { code: "edSpecialty", name: "专业" },
        { code: "edEducationlevelDis", name: "学历" },
        { code: "educationType", name: "学历类型" },
        { code: "edEdate", name: "毕业时间" },
        { code: "contValiddate", name: "合同生效日期" },
        { code: "contEdate", name: "合同截至日期" },
        { code: "contTypeDis", name: "用工方式" },
        { code: "fmPhone", name: "紧急联系电话" },
        { code: "fmCname", name: "紧急联系人" },
        { code: "empnhSalbankDis", name: "银行" },
        { code: "empnhSalaccount", name: "卡号" },
      ],
      // 导入导出默认参数 无需变更
      openImport: false,
      openExpDow: false,
      openExp: false,
      filekey: "",
      filename: "",
      // 子页面所需参数 无需变更
      tableheight: document.body.offsetHeight - 280,
      logType: "",
      openUpdate: false,
      updateId: NaN,
      loading: false,
      dataTree: [],
      //treeheight: document.body.offsetHeight - 200,
      logType: "",
      openUpdate: false,
      updateId: NaN,
      tableselected: [],
      //页面初始化默认状态
      state: "01ok",
      columns: [
        {
          type: "selection",
          width: 54,
          fixed: "left",
          align: "center"
        },
        {
          title: "一级部门及分公司",
          key: "deptOneName",
          width: 200
        },
        {
          title: "二级部门",
          key: "deptTwoName",
          width: 200
        },
        {
          title: "项目",
          key: "deptThreeName",
          width: 200
        },
        {
          title: "小组",
          key: "groupName",
          width: 200
        },
        {
          title: "姓名",
          key: "empnhName",
          width: 200,
          fixed: "left"
        },
        {
          title: "岗位",
          key: "postFname",
          width: 200
        },
        {
          title: "职级",
          key: "postTypeDis",
          width: 200
        },
        {
          title: "直接领导",
          key: "empnhPmpDis",
          width: 200
        },
        {
          title: "工作属地",
          key: "empnhWklocatDis",
          width: 200
        },
        {
          title: "性别",
          key: "empnhGenderDis",
          width: 200
        },
        {
          title: "入职日期",
          key: "empnhEntrydate",
          width: 200
        },
        {
          title: "司龄",
          key: "empAge",
          width: 200
        },
        {
          title: "司龄分段",
          key: "empAgeRange",
          width: 200
        },
        {
          title: "离职情况",
          key: "stateDis",
          width: 200
        },
        {
          title: "考勤截止时间",
          key: "dimAttday",
          width: 200
        },
        {
          title: "工资发放时间",
          key: "dimLastsalday",
          width: 200
        },
        {
          title: "自离离职日期",
          key: "empnhLevday",
          width: 200
        },
        {
          title: "办理离职日期",
          key: "dimActlevday",
          width: 200
        },
        {
                    title: "身份证号码",
                    key: "empnhIdno",
                    width: 220
                },
                {
                    title: "出生日期",
                    key: "empnhBirthdate",
                    width: 220
                },
                {
                    title: "年龄",
                    key: "ageNum",
                    width: 220
                },
                {
                    title: "年龄分层",
                    key: "ageSlice",
                    width: 220
                },
                {
                    title: "联系电话",
                    key: "empnhMobile",
                    width: 220
                },
                {
                    title: "现居地址",
                    key: "empnhResiaddr",
                    width: 220
                },
                {
                    title: "身份证地址",
                    key: "empnhRegaddr",
                    width: 220
                },
                {
                    title: "毕业院校",
                    key: "edSchool",
                    width: 220
                },
                {
                    title: "专业",
                    key: "edSpecialty",
                    width: 220
                },
                {
                    title: "学历",
                    key: "edEducationlevelDis",
                    width: 220
                },
                {
                    title: "学历类型",
                    key: "educationType",
                    width: 220
                },
                {
                    title: "毕业时间",
                    key: "edEdate",
                    width: 220
                },
                {
                    title: "合同生效日期",
                    key: "contValiddate",
                    width: 220
                },
                {
                    title: "合同截止日期",
                    key: "contEdate",
                    width: 220
                },
                {
                    title: "用工方式",
                    key: "contTypeDis",
                    width: 220
                },
                {
                    title: "紧急联系电话",
                    key: "fmPhone",
                    width: 220
                },
                {
                    title: "紧急联系人",
                    key: "fmCname",
                    width: 220
                },
                {
                    title: "银行",
                    key: "empnhSalbankDis",
                    width: 220
                },
                {
                    title: "卡号",
                    key: "empnhSalaccount",
                    width: 220
                },
      ],
      tableBtn: {
        title: "操作",
        key: "action",
        width: 100,
        fixed: "right",
        align: "center",
        render: (h, params) => {
          let child = [];
          for (let v of this.tableButton) {
            child.push(
              h(
                "Button",
                {
                  props: {
                    type: v.type,
                    size: "small"
                  },
                  style: {
                    marginRight: "5px",
                    display:
                      this.pageShow.indexOf(v.btnName) != -1 ? "inline" : "none"
                  },
                  on: {
                    click: () => {
                      this.openUp(params.row.id, v.name, params.index);
                    }
                  }
                },
                v.name
              )
            );
          }
          return h("div", [child]);
        }
      },
      data: [],
      total: 0,
      index: 0,
      sort: "id",
      order: "asc",
      rows: 20,
      page: 1,
      funId: "1000",
      state: this.modity,
      loading: "",
      empnhLevday: "",
      dimLevsqday: "",
      empnhName:""
    };
  },
  computed: {
    pageShow() {
      return this.$store.state.btnOperate.pageShow;
    },
    tableButton() {
      return this.$store.state.btnOperate.tableButton;
    },
    modity() {
      //  初始默认下拉选择状态（页面没有下拉状态选择，则无需添加）
      return this.$store.state.btnOperate.modity;
    },
    btnData() {
      return this.$store.state.btnOperate.btnData;
    },
    FlowNode() {
      return this.$store.state.btnOperate.isFlowNode;
    }
  },
  components: {
    // 初始化子页面
    btnList,
    expwindow,
    expdow,
    importExcel
  },
  //按钮权限控制
  pickData() {
    const t = this;
    t.$refs.searchOrgframe.getData(this.params);
    t.openPick = true;
  },
  created() {
    if (this.pageShow !== "") {
      this.columns.push(this.tableBtn);
      this.tableOperate = true;
    }
  },
  watch: {
    pageShow(val) {
      if (val === "" && this.tableOperate === true) {
        this.columns.pop();
        this.tableOperate = false;
      } else if (this.tableOperate === false) {
        this.columns.push(this.tableBtn);
        this.tableOperate = true;
      }
    }
  },
  //初始化自动调用方法
  mounted() {},
  methods: {
    //状态
    modityChange(res) {
      this.tableselected = [];
      this.getData();
    },
    enterEvent(e){
      this.search()
    }, 
    getData(page) {
      const t = this;
      this.loading = true;
      if (page == undefined) {
        this.page = 1;
      }
      const data = {
        //_mt: "empReport.getEmpdimPage",
        _mt: "empEmpnh.getReportPage",
        rows: t.rows,
        page: t.page,
        sort: t.sort,
        order: t.order,
        logType: "离职统计查询",
        funId: "1000",
        empnhLevday: t.empnhLevday,
        dimLevsqday: t.dimLevsqday,
        empnhName:t.empnhName,
        state: "04empstate"
      };
      if (data.empnhLevday !== undefined && data.empnhLevday !== "") {
        data.empnhLevday = new Date(data.empnhLevday).format("yyyy-MM-dd");
      } else {
        data.empnhLevday = "";
      }
      if (data.dimLevsqday !== undefined && data.dimLevsqday !== "") {
        data.dimLevsqday = new Date(data.dimLevsqday).format("yyyy-MM-dd");
      } else {
        data.dimLevsqday = "";
      }
      for (const dat in data) {
        if (data[dat] === "") {
          delete data[dat];
        }
      }
      getDataLevelUserLoginNew(data)
        .then(res => {
          if (isSuccess(res, t)) {
            t.data = res.data.content[0].rows;
            t.total = res.data.content[0].records;
          }
        })
        .catch(() => {
          // t.$Modal.error({
          //   title: this.$t("reminder.err"),
          //   content: this.$t("reminder.errormessage")
          // });
          this.$Message.error(this.$t("reminder.errormessage"));
        })
        .finally(() => {
          this.loading = false;
          this.$store.commit("btnOperate/setSearchLoading", false);
        });
    },

    // 点击列表表头 调用排序方法 无需更改
    sortable(column) {
      this.sort = column.key;
      this.order = column.order;
      if (this.order !== "normal") {
        this.getData();
      } else {
        this.order = "desc";
      }
    },
    sizeChange(size) {
      const t = this;
      t.rows = size;
      t.getData();
    },
    pageChange(page) {
      const t = this;
      t.page = page;
      t.getData(t.page);
    },
    selectedtable(selection) {
      const newArr = [];
      for (let i = 0; i < selection.length; i++) {
        newArr.push(selection[i].id);
      }
      this.tableselected = newArr;
    },
    deletemsg() {
      const t = this;
      if (t.tableselected.length === 0) {
        // t.$Modal.warning({
        //   title: this.$t("reminder.remind"),
        //   content: this.$t("reminder.leastone")
        // });
        this.$Message.warning("请至少选择一条数据");
      } else {
        t.$Modal.confirm({
          title: this.$t("reminder.remind"),
          content: this.$t("reminder.confirmdelete"),
          onOk: () => {
            getDataLevelUserLogin({
              _mt: "protocolManage.delByIds",
              funId: "1",
              logType: this.$t("button.del"),
              ids: t.tableselected.toString()
            })
              .then(res => {
                if (isSuccess(res, t)) {
                  t.tableselected = [];
                  // t.getTree()
                  t.getData();
                  this.$Message.success(this.$t("reminder.deletesuccess"));
                }
              })
              .catch(() => {
                this.$Message.error(this.$t("reminder.errormessage"));
              });
          },
          onCancel: () => {}
        });
      }
    },
    openUp(id, logType, index) {
      const t = this;
      t.updateId = parseInt(id, 10);
      t.logType = logType;
      t.openUpdate = true;
      t.index = index;
      // t.$refs.update.getSelect()
      t.$refs.update.disabled = false;
      if (logType === this.$t("button.upd") || logType === "查看") {
        t.$refs.update.getData(id);
      }
      if (logType === "查看") {
        t.$refs.update.disabled = true;
      }
    },
    search() {
      this.page = 1;
      this.getData();
      this.$store.commit("btnOperate/setSearchLoading", true);
      this.tableselected = [];
    },
    // 导入导出默认方法 无需更改
    closeImport() {
      const t = this;
      t.openImport = false;
    },
    // 导入导出默认方法 无需更改
    importExcel() {
      const t = this;
      t.openImport = true;
      t.$refs.importExcel.getDowModelFile();
    },
    // 导入导出默认方法
    expData() {
      const t = this;
      // 填装查询条件
      const data = {
        empnhLevday: t.empnhLevday,
        dimLevsqday: t.dimLevsqday,
        empnhName:t.empnhName,
        state: t.modity
      };
      if (data.empnhLevday !== undefined && data.empnhLevday !== "") {
        data.empnhLevday = new Date(data.empnhLevday).format("yyyy-MM-dd");
      } else {
        data.empnhLevday = "";
      }
      if (data.dimLevsqday !== undefined && data.dimLevsqday !== "") {
        data.dimLevsqday = new Date(data.dimLevsqday).format("yyyy-MM-dd");
      } else {
        data.dimLevsqday = "";
      }
      // 设置导出mt参数
      this.$refs.expwindow.getData(
        this.expDataTital,
        "empEmpnh.exportEmpdim",
        data
      );
      this.openExp = true;
    },
    // 导入导出默认方法 无需更改
    closeExp() {
      const t = this;
      t.openExp = false;
    },
    // 导入导出默认方法 无需更改
    closeExpDowMain() {
      const t = this;
      t.openExpDow = false;
    },
    // 导入导出默认方法 无需更改
    setFileKey(filekey, filename, openExpDow) {
      const t = this;
      t.filekey = filekey;
      t.filename = filename;
      t.openExpDow = openExpDow;
      t.$refs.expdow.getPriToken(t.filekey);
    },
    // 子页面新增数据后添加到本页面分页第一行  无需更改
    addNewArray(res) {
      const t = this;
      t.data.unshift(res);
    },
    // 子页面修改数据后 本页面修改对应行数的数据 无需更改
    updateArray(res) {
      const t = this;
      t.data.splice(t.index, 1, res);
    }
  }
};
</script>
<style lang="scss" scoped>
.table-form {
  margin: 10px 0;
}
.margin-right-10 {
  margin-right: 10px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.colTree {
  /*min-height: 600px;*/
  max-height: 100%;
  overflow-y: auto;
  position: relative;
  padding: 0 20px 0 0;
}
.divtree {
  padding-left: 10px;
  /*height: 750px;*/
  overflow: auto;
  border: 1px #efefef solid;
}
</style>
