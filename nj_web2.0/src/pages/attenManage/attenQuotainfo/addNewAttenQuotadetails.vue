<template>
    <div class="cover">
        <div class="box">
            <div class="title">
                <div class="title-text">
                    <Icon type="mouse"
                          size="16"
                          style="margin-right: 10px;"></Icon>
                    &nbsp;{{childLogType}}
                </div>
                <Button type="text"
                        @click="handleReset">
                    <Icon type="close-round"
                          size="16"></Icon>
                </Button>
            </div>
            <!-- form表单 :model="formValidate" model表单数据对象绑定了formValidate :rules="ruleValidate" 表单验证规则  :label-width="135" 表单域标签的宽度-->
            <Form ref="formValidate"
                  :model="formValidate"
                  :rules="ruleValidate"
                  :label-width="135">
                <Row>
                    <!--  prop 是Form对应表单域 model 里的字段 -->
                    <!--  员工姓名选择框  -->
                    <Col span="11">
                    <FormItem label="配额类型"
                              prop="quoType">
                        <Select v-model="formValidate.quoType"
                                class="width200"
                                :disabled="disabled"
                                placeholder="请选择配额类型">
                            <Option v-for="(item, index) in selectAttenType"
                                    :value="item.paramCode"
                                    :key="index">{{ item.paramInfoName }}</Option>
                        </Select>
                    </FormItem>
                    </Col>
                    <!--  操作时间输入框  -->
                    <Col span="11"
                         offset="1">
                    <FormItem label="配额日期"
                              prop="quoTime">
                        <DatePicker type="date"
                                    :disabled="disabled"
                                    :readonly="disabled"
                                    placeholder="请选择配额日期"
                                    :editable="false"
                                    v-model="formValidate.quoTime"
                                    style="width: 100%"></DatePicker>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="11">
                    <FormItem label="配额天数"
                              prop="quoDay">
                        <Input v-model="formValidate.quoDay"
                               :disabled="disabled"
                               placeholder="请输入配额天数"
                               style="width: 100%"></Input>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <!--  备注文本域  -->
                    <Col span="23">
                    <FormItem label="备注"
                              prop="note">
                        <Input v-model="formValidate.note"
                               type="textarea"
                               :autosize="{minRows: 2,maxRows: 5}"
                               :disabled="disabled"
                               placeholder="请输入备注"></Input>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <!--  保存 取消 按钮  -->
                    <Col span="21"
                         offset="1">
                    <Row type="flex"
                         justify="end">
                        <FormItem>
                            <Button type="ghost"
                                    @click="handleReset"
                                    style="margin-left: 8px">取消</Button>
                            <Button type="primary"
                                    @click="handleSubmit"
                                    v-show="!disabled">保存</Button>
                        </FormItem>
                    </Row>
                    </Col>
                </Row>
            </Form>
        </div>
    </div>
</template>
<script>
import {
    getDataLevelUserLoginSenior,
    getDataLevelUserLogin
} from "../../../axios/axios"; //调用请求接口封装的公共方法
import { isSuccess, deepCopy } from "../../../lib/util"; //调用请求判断成功的公共方法和深拷贝方法
import valid from "../../../lib/pub_valid.js";
export default {
    data () {
        const numberCheck = (rule, value, numberValCheck) => {
            if (value !== "" && value !== undefined) {
                if (valid.val_number103(value)) {
                    return numberValCheck();
                }
                return numberValCheck(new Error(rule.message));
            }
            numberValCheck();
        };
        return {
            disabled: false,
            selectAttenType: [],
            formValidate: {
                funId: "1", //功能ID
                logType: this.logType, //操作类型
                quoType: "", //配额类型
                quoTime: "", //配额日期
                quoDay: "", //配额天数
                note: "" //备注
            },
            ruleValidate: {
                //表单验证规则
                //押金类型
                quoType: [
                    { required: true, message: "请选择配额类型", trigger: "change" }
                ],
                //操作时间
                quoTime: [
                    {
                        required: true,
                        type: "date",
                        message: "请选择配额日期",
                        trigger: "change"
                    }
                ],
                //金额
                quoDay: [
                    {
                        required: true,
                        message: "请输入配额天数",
                        trigger: "blur"
                    },
                    {
                        validator: numberCheck,
                        message: "请输入正确的数字格式",
                        trigger: "blur"
                    }
                ]
            },
            id: "",
        };
    },
    components: {
        valid
    },
    computed: {
        mainId () {
            return this.$store.state.attenQuotainfo.mainId;
        },
        childLogType () {
            return this.$store.state.attenQuotainfo.childLogType;
        }
    },
    // 定义子组件获取父组件传入的值
    props: {
        logType: String,
        index: Number
    },
    mounted () {
        this.getSelect();
    },
    methods: {
        //根据id查询信息回显数据
        setRowId (id, logType) {
            const t = this;
            if (logType == "新增") {
                return;
            }
            t.id = id;
            //根据id获取数据请求接口
            getDataLevelUserLogin({
                _mt: "attenQuotadetails.getById",
                id: id,
                logType: "根据id获取数据"
            })
                .then(res => {
                    if (isSuccess(res, t)) {
                        //回显数据绑定
                        t.formValidate.quoType = res.data.content[0].quoType;
                        t.formValidate.quoDay = res.data.content[0].quoDay;
                        t.formValidate.quoTime = new Date(res.data.content[0].quoTime);
                        t.formValidate.note = res.data.content[0].note;
                        if (id === res.data.content[0].companyId) {
                            t.forbidden = "disabled";
                            t.distype = true;
                        } else {
                            t.forbidden = null;
                            t.distype = false;
                        }
                    }
                })
                .catch(() => {
                    this.$Modal.error({
                        title: this.$t("reminder.err"),
                        content: this.$t("reminder.errormessage")
                    });
                });
        },
        getSelect () {
            const t = this;
            getDataLevelUserLogin({
                _mt: "baseParmInfo.getSelectValue",
                typeCode: "quoType"
            })
                .then(res => {
                    if (isSuccess(res, t)) {
                        t.selectAttenType = res.data.content[0].value[0].paramList;
                    }
                })
                .catch(() => {
                    // this.$Modal.error({
                    //     title: this.$t("reminder.err"),
                    //     content: this.$t("reminder.errormessage")
                    // });
                    this.$Message.error(this.$t("reminder.errormessage"));
                });
        },
        //点击提交事件
        handleSubmit () {
            const t = this;
            //修改请求的参数
            const data = deepCopy(t.formValidate);
            data.logType = t.childLogType;
            data._mt = 'attenQuotadetails.addOrUpd'
            if (t.childLogType === "修改") {
                data.id = t.id;
            } else {
                data.quoPid = t.mainId;
            }

            if (data.quoTime !== undefined && data.quoTime !== "") {
                data.quoTime = new Date(data.quoTime).format("yyyy-MM-dd");
            } else {
                data.quoTime = "";
            }
            console.log(data.quoTime, "data.quoTime")
            // //form表单校验事件
            this.$refs.formValidate.validate(valid => {
                //校验成功
                if (valid) {
                    //调取新增修改请求接口
                    getDataLevelUserLoginSenior(data)
                        .then(res => {
                            if (isSuccess(res, t)) {
                                t.handleReset();
                                if (t.childLogType === "新增") {
                                    t.$Message.success("新增成功");
                                    t.$emit("newData", res.data.content[0]);
                                } else {
                                    t.$Message.success("修改成功");
                                    t.$emit("update", res.data.content[0]);
                                }
                            }
                        })
                        .catch(() => {
                            //请求失败
                            this.$Modal.error({
                                title: this.$t("reminder.err"),
                                content: this.$t("reminder.errormessage")
                            });
                        });
                }
            });
        },
        //关闭新增或修改弹出框事件
        handleReset () {
            this.$emit("closeUp");
            //对整个表单进行重置，将所有字段值重置为空并移除校验结果
            this.$refs.formValidate.resetFields();
        }
    }
};
</script>
<style lang="scss" scoped>
@import "../../../sass/updateAndAdd";
</style>
