<template>
  <div class="table">
    <Row>
      <Col span="24">
        <card>
          <p slot="title">
            <Icon type="mouse"></Icon>
            &nbsp;{{$t('lang_payroll.paySalItem.title')}}
          </p>
          <Row>
            <Input
              :placeholder="$t('lang_payroll.paySalItem.paysiCodeDis')"
              @on-enter="getData(1)"
              style="width: 200px"
              v-model="paysiCode"
            />
            <Input
              :placeholder="$t('lang_payroll.paySalItem.paysiSearchDis')"
              @on-enter="getData(1)"
              style="width: 200px"
              v-model="paysiCN"
            />
            <span style="margin: 0;">
              <Button type="primary" icon="search" @click="getData(1)">{{$t('button.ser')}}</Button>
            </span>
            <Button type="primary" @click="openUp(NaN,$t('button.add'))">{{$t('button.add')}}</Button>
            <!--<Button type="primary" @click="importExcel">{{$t('button.imp')}}</Button>-->
            <Button type="error" @click="deletemsg">{{$t('button.del')}}</Button>
          </Row>
          <row class="table-form" ref="table-form">
            <Table
              @on-select="selectedtable"
              @on-select-cancel="selectedtable"
              @on-select-all="selectedtable"
              @on-sort-change="sortable"
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
              size="small"
              show-elevator
              show-sizer
              placement="top"
              :current="page"
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
              @click="getData(1)"
            ></Button>
          </Row>
        </card>
      </Col>
    </Row>
    <transition name="fade">
      <update
        v-show="openUpdate"
        :id="updateId"
        :logType="logType"
        :index="index"
        @closeUp="closeUp"
        @getData="addNewArray"
        @update="updateArray"
        ref="update"
      ></update>
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
import update from "./paySalItemEdit";
import importExcel from "../../../components/importModel/importParam";
import { isSuccess } from "../../../lib/util";
import {
  getDataLevelUserLoginNew,
  getDataLevelUserLogin
} from "../../../axios/axios";

export default {
  data() {
    return {
      imp_mt: "paySalItem.importData",
      openImport: false,
      tableheight: document.body.offsetHeight - 280,
      value: "",
      logType: "",
      openUpdate: false,
      updateId: NaN,
      tableselected: [],
      columns: [
        {
          type: "selection",
          width: 54,
          align: "center",
          fixed: "left"
        },
        {
          title: this.$t("lang_payroll.paySalItem.paysiOrder"),
          key: "paysiOrder",
          sortable: "custom"
        },
        {
          title: this.$t("lang_payroll.paySalItem.paysiCode"),
          key: "paysiCode",
          sortable: "custom"
        },
        {
          title: this.$t("lang_payroll.paySalItem.paysiCN"),
          key: "paysiCN"
        },
        {
          title: this.$t("lang_payroll.paySalItem.paysiEN"),
          key: "paysiEN"
        },
        {
          title: this.$t("lang_payroll.paySalItem.paysiIsdefaultssiName"),
          key: "paysiIsdefaultssiName"
        },
        {
          title: this.$t("lang_payroll.paySalItem.paysiDefaulttypeName"),
          key: "paysiDefaulttypeName"
        },
        {
          title: this.$t("lang_payroll.paySalItem.paysiDefaultdtsourceName"),
          key: "paysiDefaultdtsourceName"
        },
        {
          title: this.$t("button.opr"),
          key: "action",
          fixed: "right",
          width: 64,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "success",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.openUp(
                        params.row.id,
                        this.$t("button.upd"),
                        params.index
                      );
                    }
                  }
                },
                this.$t("button.upd")
              )
            ]);
          }
        }
      ],
      data: [],
      total: 0,
      index: 0,
      sort: "paysiOrder",
      order: "asc",
      rows: 20,
      page: 1,
      funId: "1000",
      paysiCode: "",
      paysiCN: ""
    };
  },
  computed: {},
  components: {
    update,
    importExcel
  },
  mounted() {
    this.getData(1);
  },
  methods: {
    getData(page) {
      const t = this;
      if (page) {
        t.page = page;
      }
      const data = {
        _mt: "paySalItem.getPage",
        rows: t.rows,
        page: t.page,
        sort: t.sort,
        order: t.order,
        logType: this.$t("button.ser"),
        paysiCode: t.paysiCode,
        paysiCN: t.paysiCN
      };
      for (const dat in data) {
        if (data[dat] === "") {
          delete data[dat];
        }
      }
      getDataLevelUserLoginNew(data)
        .then(res => {
          //if (isSuccess(res, t)) {
          res = {
            stat: {
              code: 0,
              stateList: [
                { msg: "SUCCESS", code: 0, length: 520, desc: "成功" }
              ],
              systime: 1561621696951,
              desc: "成功",
              cid: "a:18bb9c|t:153602|s:1561621696896"
            },
            content: [
              {
                total: 1,
                records: 1,
                page: 1,
                rows: [
                  {
                    paysiComment: "",
                    deleteFlag: "0",
                    paysiDefaultdtsource: "01system",
                    updateBy: "1006",
                    paysiOrder: "1001",
                    id: "36",
                    paysi: "Last Name",
                    updateTime: "2018-11-07 17:50:58",
                    paysiIsdefaultssiName: "否",
                    companyId: "1000",
                    createBy: "1009",
                    paysiCode: "FX01",
                    paysiIsdefaultssi: "0",
                    paysiDefaulttype: "00fixedproject",
                    createTime: "2018-07-24 15:54:06",
                    paysiCN: "Last Name",
                    paysiEN: "Last Name",
                    paysiDefaulttypeName: "固定项目",
                    paysiDefaultdtsourceName: "系统默认"
                  }
                ]
              }
            ]
          };
          t.data = res.content[0].rows;
          t.total = res.content[0].records;
          //}
        })
        .catch(() => {
          t.$Modal.error({
            title: this.$t("reminder.err"),
            content: this.$t("reminder.errormessage")
          });
        });
    },
    closeImport() {
      const t = this;
      t.openImport = false;
    },
    importExcel() {
      const t = this;
      t.openImport = true;
      t.$refs.importExcel.getDowModelFile();
    },
    addNewArray(res) {
      const t = this;
      t.data.unshift(res);
    },
    updateArray(res) {
      const t = this;
      t.data.splice(t.index, 1, res);
    },
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
      //        t.sort = 'paysiOrder'
      t.page = page;
      t.getData();
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
      let isDelete = false;
      if (t.tableselected.length === 0) {
        t.$Modal.warning({
          title: this.$t("reminder.remind"),
          content: this.$t("reminder.leastone")
        });
      } else {
        t.$Modal.confirm({
          title: this.$t("reminder.remind"),
          content: this.$t("reminder.confirmdelete"),
          onOk: () => {
            getDataLevelUserLogin({
              _mt: "paySalItem.delByIds",
              funId: "1",
              logType: this.$t("button.del"),
              delIds: t.tableselected.toString()
            })
              .then(res => {
                if (isSuccess(res, t)) {
                  t.tableselected = [];
                  t.getData();
                }
              })
              .catch(() => {
                t.$Modal.error({
                  title: this.$t("reminder.err"),
                  content: this.$t("reminder.errormessage")
                });
              });
          },
          onCancel: () => {}
        });
      }
    },
    open() {
      const t = this;
      t.opendialog = true;
    },
    openUp(id, logType, index) {
      const t = this;
      t.updateId = parseInt(id, 10);
      t.logType = logType;
      t.openUpdate = true;
      t.index = index;
      if (logType === this.$t("button.upd")) {
        t.$refs.update.getData(id);
      }
    },
    close() {
      const t = this;
      t.opendialog = false;
    },
    closeUp() {
      const t = this;
      t.openUpdate = false;
      t.$refs.update.formValidate.paysiCode = "";
      t.$refs.update.formValidate.paysiDefaulttype = "";
      t.$refs.update.formValidate.paysiCN = "";
      t.$refs.update.formValidate.paysiEN = "";
      t.$refs.update.formValidate.paysiIsdefaultssi = "0";
      t.$refs.update.formValidate.paysiComment = "";
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
</style>
