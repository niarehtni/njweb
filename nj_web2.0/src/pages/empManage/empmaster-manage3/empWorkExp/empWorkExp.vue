<template>
    <div class="content-main">
        <row>
            <Input v-model="weComp"
                   style="width: 200px;"
                   placeholder="请输入工作单位名称"></Input>
            <Button type="primary"
                    icon="search"
                    :loading="searchLoading"
                    @click="search()">查询</Button>
            <Button type="primary"
                    icon="primary"
                    @click="showMsgBtn('', '新增')"
                    v-show="logType=='修改'">新增</Button>
            <Button type="primary"
                    icon="primary"
                    @click="expData">导出</Button>
            <Button type="primary"
                    icon="primary"
                    @click="importExcel"
                    v-show="logType=='修改'">导入</Button>
            <Button type="error"
                    icon="primary"
                    @click="deletemsg"
                    v-show="logType=='修改'">删除</Button>
        </row>
        <row class="table-form"
             ref="table-form">
            <Table @on-selection-change="selectedtable"
                   @on-sort-change="sortable"
                   :height="410"
                   size="small"
                   border
                   ref="selection"
                   :columns="columns"
                   :data="data"
                   :loading="loading"></Table>
        </row>
        <Row style="display: flex">
            <Page :total="total"
                  size="small"
                  showTotal
                  show-elevator
                  show-sizer
                  placement="top"
                  :current="params.page"
                  @on-page-size-change="sizeChange"
                  @on-change="pageChange"
                  :page-size=params.rows
                  :page-size-opts="[10, 20, 50, 100]"></Page>
            <Button type="ghost"
                    size="small"
                    shape="circle"
                    icon="refresh"
                    style="margin-left: 20px;display: inline-block;"
                    @click="search"></Button>
        </Row>
        <!--mainid为主表id-->
        <transition>
            <contentMsg v-show="showMsg"
                        @hideMsg="hideMsg"
                        :id="updateId"
                        :index="index"
                        ref="contentMsg"
                        @newdata="addNewArray"
                        @update="updateArray"></contentMsg>
        </transition>
        <!--导入导出子页面 若没有导入导出可以去掉-->
        <transition>
            <expwindow v-show="openExp"
                       :id="tableselected"
                       @setFileKey="setFileKey"
                       :logType="logType"
                       :index="index"
                       @closeExp="closeExp"
                       ref="expwindow"></expwindow>
        </transition>
        <transition>
            <expdow v-show="openExpDow"
                    :filekey="filekey"
                    :filename="filename"
                    @closeExpDowMain="closeExpDowMain"
                    ref="expdow"></expdow>
        </transition>
        <transition name="fade">
            <importExcel v-show="openImport"
                         :impid="updateId"
                         :imp_mt="imp_mt"
                         @getData="getData"
                         @closeImport="closeImport"
                         ref="importExcel"></importExcel>
        </transition>
    </div>
</template>
<script>
import contentMsg from "./addEmpWorkExp";
import expwindow from "../../../../components/fileOperations/expSms";
import expdow from "../../../../components/fileOperations/expdow";
import importExcel from "../../../../components/importModel/importParam";
import {
    getDataLevelUserLogin,
    getDataLevelUserLoginNew
} from "../../../../axios/axios";
import { isSuccess, deepCopy } from "../../../../lib/util";

export default {
    data () {
        return {
            // 导入的mt名称
            imp_mt: "empWorkExp.importData",
            // 导出字段设置, code字段名 name列名
            expDataTital: [
                { code: "weSdate", name: "开始时间" },
                { code: "weEdate", name: "结束时间" },
                { code: "weComp", name: "工作单位" },
                { code: "weDept", name: "工作部门" },
                { code: "wePost", name: "工作职务" },
                { code: "wePerforman", name: "主要业绩" },
                { code: "weContact", name: "证明人" },
                { code: "wePhone", name: "联系电话" },
                { code: "weSalary", name: "薪资" },
                { code: "weLevrason", name: "离职原因" },
                { code: "note", name: "备注" }
            ],
            // 导入导出默认参数 无需变更
            openImport: false,
            openExpDow: false,
            openExp: false,
            filekey: "",
            filename: "",
            updateId: NaN,
            total: NaN,
            showMsg: false,
            weComp: '',
            columns: [
                {
                    type: "selection",
                    width: 60,
                    align: "center"
                },
                {
                    title: "开始时间",
                    key: "weSdate",
                    width: 150,
                    sortable: "custom",
                    align: "center"
                },
                {
                    title: "结束时间",
                    key: "weEdate",
                    width: 150,
                    sortable: "custom",
                    align: "center"
                },
                {
                    title: "工作单位",
                    key: "weComp",
                    width: 150,
                    align: "center"
                },
                {
                    title: "工作部门",
                    key: "weDept",
                    width: 150,
                    align: "center"
                },
                {
                    title: "工作职务",
                    key: "wePost",
                    width: 150,
                    align: "center"
                },
                {
                    title: "主要业绩",
                    key: "wePerforman",
                    width: 150,
                    align: "center"
                },
                {
                    title: "证明人",
                    key: "weContact",
                    width: 150,
                    align: "center"
                },
                {
                    title: "联系电话",
                    key: "wePhone",
                    width: 150,
                    align: "center"
                },
                {
                    title: "薪资",
                    key: "weSalary",
                    width: 150,
                    align: "center"
                },
                {
                    title: "离职原因",
                    key: "weLevrason",
                    width: 150,
                    align: "center"
                },
                {
                    title: "操作",
                    key: "action",
                    fixed: "right",
                    align: "center",
                    width: 64,
                    render: (h, params) => {
                        return h("div", [
                            h(
                                "Button",
                                {
                                    props: {
                                        type: "success",
                                        size: "small"
                                    },
                                    style: {
                                        display: this.logType == '修改' ? "inline-block" : "none",
                                    },
                                    on: {
                                        click: () => {
                                            this.showMsgBtn(
                                                params.row.id,
                                                '修改',
                                                params.index
                                            );
                                        }
                                    }
                                },
                                '修改'
                            ),
                            h(
                                "Button",
                                {
                                    props: {
                                        type: "primary",
                                        size: "small"
                                    },
                                    style: {
                                        display: this.logType == '查看' ? "inline-block" : "none",
                                    },
                                    on: {
                                        click: () => {
                                            this.showMsgBtn(
                                                params.row.id,
                                                '查看',
                                                params.index
                                            );
                                        }
                                    }
                                },
                                '查看'
                            )
                        ]);
                    }
                }
            ],
            data: [],
            docsName: "",
            params: {
                _mt: "empWorkExp.getPage",
                funId: "1",
                rows: 20,
                page: 1,
                sort: "id",
                order: "asc",
                logType: "",
                pkId: "",
                weComp: ""
            },
            index: 0,
            tableselected: [],
            loading: "",
            searchLoading: false
        };
    },
    components: {
        contentMsg,
        expwindow,
        expdow,
        importExcel
    },
    computed: {
        mainId () {
            return this.$store.state.empMaster.mainId;
        },
        logType () {
            return this.$store.state.empMaster.logType;
        }
    },
    methods: {
        search (operate) {
            this.params.pkId = this.mainId + "";
            this.params.page = 1;
            if (!operate) {
                this.searchLoading = true;
            }
            this.getData();
            this.tableselected = [];
        },
        getData () {
            const t = this;
            const data = deepCopy(t.params);
            data.weComp = t.weComp;
            for (const dat in data) {
                if (data[dat] === "") {
                    delete data[dat];
                }
            }
            this.loading = true;
            getDataLevelUserLoginNew(data)
                .then(res => {
                    if (isSuccess(res, t)) {
                        t.total = res.data.content[0].records;
                        t.data = res.data.content[0].rows;
                    }
                })
                .catch(() => {
                    this.$Message.error('网络错误');
                })
                .finally(() => {
                    this.loading = false;
                    this.searchLoading = false;
                });;
        },
        pageChange (page) {
            const t = this;
            t.params.page = page;
            t.getData();
        },
        sortable (column) {
            this.params.sort = column.key;
            this.params.order = column.order;
            if (this.params.order !== "normal") {
                this.getData();
            } else {
                this.params.order = "desc";
            }
        },
        selectedtable (selection) {
            const newArr = [];
            for (let i = 0; i < selection.length; i++) {
                newArr.push(selection[i].id);
            }
            this.tableselected = newArr;
        },
        deletemsg () {
            const t = this;
            if (t.tableselected.length === 0) {
                this.$Message.warning('请至少选择一条数据');
            } else {
                t.$Modal.confirm({
                    title: this.$t("reminder.remind"),
                    content: this.$t("reminder.confirmdelete"),
                    onOk: () => {
                        getDataLevelUserLogin({
                            _mt: "empWorkExp.delByIds",
                            funId: "1",
                            logType: "删除",
                            ids: t.tableselected.toString()
                        })
                            .then(res => {
                                if (isSuccess(res, t)) {
                                    this.$Message.success('删除成功');
                                    t.getData();
                                    t.tableselected = [];
                                }
                            })
                            .catch(() => {
                                this.$Message.error('删除失败');
                            });
                    },
                    onCancel: () => { }
                });
            }
        },
        sizeChange (size) {
            const t = this;
            t.params.rows = size;
            t.getData();
        },
        //      打开子表详细信息页面 无需变更
        showMsgBtn (id, logType, index) {
            const t = this;
            this.$store.commit('empMaster/setChildLogType', logType);
            t.updateId = parseInt(id, 10);
            t.showMsg = true;
            t.index = index;
            t.$refs.contentMsg.setRowId(id, logType);
            if (logType === '查看') {
                t.$refs.contentMsg.disabled = true
            } else {
                t.$refs.contentMsg.disabled = false
            }
        },
        addNewArray (res) {
            const t = this;
            t.data.unshift(res);
        },
        updateArray (res) {
            const t = this;
            t.data.splice(t.index, 1, res);
        },
        clear () {
            const t = this;
            t.weComp = "";
            t.params.page = 1;
            t.params.rows = 20;
        },
        hideMsg () {
            this.showMsg = false;
        },
        // 导入导出默认方法 无需更改
        closeImport () {
            const t = this;
            t.openImport = false;
        },

        // 导入导出默认方法 无需更改
        importExcel () {
            const t = this;
            t.openImport = true;
            t.$refs.importExcel.getDowModelFile();
        },
        // 导入导出默认方法
        expData () {
            const t = this;
            // 填装查询条件
            const data = {
                pkId: this.mainId,
                weComp: this.weComp
            };
            // 设置导出mt参数
            this.$refs.expwindow.getData(this.expDataTital, "empWorkExp.export", data);
            this.openExp = true;
        },
        // 导入导出默认方法 无需更改
        closeExp () {
            const t = this;
            t.$refs.expwindow.checkAll = false;
            t.$refs.expwindow.indeterminate = false;
            t.$refs.expwindow.expDisFields = [];
            t.openExp = false;

        },
        // 导入导出默认方法 无需更改
        closeExpDowMain () {
            const t = this;
            t.openExpDow = false;
        },
        // 导入导出默认方法 无需更改
        setFileKey (filekey, filename, openExpDow) {
            const t = this;
            t.filekey = filekey;
            t.filename = filename;
            t.openExpDow = openExpDow;
            t.$refs.expdow.getPriToken(t.filekey);
        }
    }
};
</script>
<style lang="scss" scoped>
.content-main {
    height: 500px;
    .table-form {
        margin: 10px 0;
        overflow: hidden;
    }
}
</style>
