<template>
    <div class="cover">
        <div class="box">
            <Spin size="large"
                  fix
                  v-if="spinShow"></Spin>
            <div class="title">
                <div class="title-text">
                    <Icon type="mouse"
                          size="16"
                          style="margin-right: 10px;"></Icon>
                    &nbsp;{{childLogType}}
                </div>
                <Button type="text"
                        @click="close">
                    <Icon type="close-round"
                          size="16"></Icon>
                </Button>
            </div>
            <Row>
                <Form :model="form"
                      label-position="right"
                      :rules="ruleValidate"
                      ref="form"
                      :label-width="110">
                    <i-col span="11">
                        <FormItem label="家庭成员关系"
                                  prop="fmRelation">
                            <Select v-model="form.fmRelation"
                                    :disabled="disabled">
                                <Option :value="item.paramCode"
                                        v-for="(item,index) in selectFmRelation"
                                        :key="index">{{item.paramInfoCn}}</Option>
                            </Select>
                        </FormItem>
                    </i-col>
                    <i-col span="11"
                           offset="1">
                        <FormItem label="是否紧急联系人"
                                  prop="fmIsurgent">
                            <RadioGroup v-model="form.fmIsurgent">
                                <Radio :label="item.paramCode"
                                       v-for="(item,index) in yesOrNo"
                                       :disabled="disabled"
                                       :key="index">{{item.paramInfoCn}}</Radio>
                            </RadioGroup>
                        </FormItem>
                    </i-col>
                    <i-col span="11">
                        <FormItem label="姓名"
                                  prop="fmCname">
                            <Input v-model="form.fmCname"
                                   :disabled="disabled"
                                   placeholder="请输入姓名"></Input>
                        </FormItem>
                    </i-col>

                    <i-col span="11"
                           offset="1">
                        <FormItem label="工作单位"
                                  prop="fmCompany">
                            <Input v-model="form.fmCompany"
                                   :disabled="disabled"
                                   placeholder="请输入工作单位"></Input>
                        </FormItem>
                    </i-col>
                    <i-col span="11">
                        <FormItem label="职务"
                                  prop="fmPost">
                            <Input v-model="form.fmPost"
                                   :disabled="disabled"
                                   placeholder="请输入职务"></Input>
                        </FormItem>
                    </i-col>
                    <i-col span="11"
                           offset="1">
                        <FormItem label="联系方式"
                                  prop="fmPhone">
                            <Input v-model="form.fmPhone"
                                   :disabled="disabled"
                                   placeholder="请输入联系方式"></Input>
                        </FormItem>
                    </i-col>

                    <i-col span="23">
                        <FormItem label="备注"
                                  prop="note">
                            <Input v-model="form.note"
                                   :disabled="disabled"
                                   type="textarea"
                                   :autosize="{minRows: 2,maxRows: 5}"
                                   placeholder="请输入备注"></Input>
                        </FormItem>
                    </i-col>
                    <i-col span="23">
                        <row type="flex"
                             justify="end">
                            <FormItem label
                                      prop="comment">
                                <Button type="ghost"
                                        @click="close"
                                        style="margin-left: 8px">取消</Button>
                                <Button type="primary"
                                        v-show="!disabled"
                                        @click="save">保存</Button>
                            </FormItem>
                        </row>
                    </i-col>
                </Form>
            </Row>
        </div>
    </div>
</template>
<script>
import {
    getDataLevelUserLoginNew,
    getDataLevelUserLogin,
    uploadFile
} from "../../../../axios/axios";
import { isSuccess, deepCopy } from "../../../../lib/util";
import valid from '../../../../lib/pub_valid'
export default {
    data () {
        const phonecheck = (rule, value, calphonecheck) => {
            if (valid.val_mobile(value)) {
                return calphonecheck()
            }
            return calphonecheck(new Error(rule.message))
        }
        const numberCheck = (rule, value, numberValCheck) => {
            if (value !== '' && value !== undefined) {
                if (valid.val_number103(value)) {
                    return numberValCheck()
                }
                return numberValCheck(new Error(rule.message))
            }
        }
		const namecheck = (rule, value, nameValCheck) =>{
			if (value !== '' && value !== undefined) {
			    if (valid.val_chinese(value)) {
			        return nameValCheck()
			    }
			    return nameValCheck(new Error(rule.message))
			}
		}
        return {
            disabled: false,
            selectFmRelation: [],
            yesOrNo: [
                {
                    paramCode: "1",
                    paramInfoCn: "是"
                },
                {
                    paramCode: "0",
                    paramInfoCn: "否"
                }
            ],
            form: {
                _mt: "empFamily.addOrUpd",
                fmCname: "", // 姓名
                fmCompany: "", // 工作单位
                fmPost: "", // 职务
                fmPhone: "", // 联系方式
                fmRelation: "", // 成员关系显示字段
                fmIsurgent: "1",// 是否紧急联系人显示字段
                note: ""//备注
            },
            rowId: "",
            ruleValidate: {
                fmRelation: [
                    { required: true, message: "请输入成员关系", trigger: "blur" }
                ],
                fmCname: [
                    { required: true, message: "请输入姓名", trigger: "blur" },{
						validator:namecheck,
						message: '请填写中文',
						trigger: 'blur'
					}
                ],
                fmCompany: [
                    { required: true, message: "请输入工作单位", trigger: "blur" }
                ],
                fmPhone: [
                    {
                        required: true,
                        message: "请输入手机号码",
                        trigger: "blur"
                    },
                    {
                        validator: phonecheck,
                        message: '请填写正确的手机号',
                        trigger: 'blur'
                    },
                    {
                        validator: numberCheck,
                        message: '请输入正确的数字格式',
                        trigger: 'blur'
                    },
                ],
                fmIsurgent: [
                    { required: true, message: "请选择是否", trigger: "change" }
                ]
            },
            spinShow: ''
        };
    },
    //    主表id
    props: {
        id: Number,
        index: Number,
    },
    computed: {
        mainId () {
            return this.$store.state.empMaster.mainId;
        },
        childLogType () {
            return this.$store.state.empMaster.childLogType;
        }
    },
    mounted () {
        this.getSelect();
    },
    methods: {
        // 新增页面
        setRowId (id, logType) {
            const t = this;
            if (logType !== "新增") {
                t.getData(id);
            }
        },
        // 查询
        getData (id) {
            const t = this;
            t.spinShow = true
            const params = {
                _mt: "empFamily.getById",
                id: id,
                funId: "1",
                logType: "根据id查询信息"
            };
            getDataLevelUserLogin(params)
                .then(res => {
                    if (isSuccess(res, t)) {
                        t.form.fmRelation = res.data.content[0].fmRelation;
                        t.form.fmIsurgent = res.data.content[0].fmIsurgent ? res.data.content[0].fmIsurgent : 0;
                        t.form.fmCname = res.data.content[0].fmCname;
                        t.form.fmCompany = res.data.content[0].fmCompany;
                        t.form.fmPost = res.data.content[0].fmPost;
                        t.form.fmPhone = res.data.content[0].fmPhone;
                        t.form.note = res.data.content[0].note;
                    }
                })
                .catch(() => {
                    this.$Message.error('网络错误');
                })
                .finally(() => {
                    t.spinShow = false
                });
        },
        save () {
            const t = this;
            const data = deepCopy(t.form);
            data._mt = "empFamily.addOrUpd";
            data.logType = t.childLogType;
            if (t.childLogType === "新增") {
                data.pkId = t.mainId; // 放入主表id
            } else {
                data.id = t.id
            }
            this.$refs.form.validate(valid => {
                if (valid) {
                    getDataLevelUserLoginNew(data)
                        .then(res => {
                            if (isSuccess(res, t)) {
                                if (t.childLogType === '修改') {
                                    this.$Message.success('修改成功');
                                    t.$emit("update", res.data.content[0]);
                                } else {
                                    this.$Message.success('新增成功');
                                    t.$emit("getData", res.data.content[0]);
                                }
                                t.close();
                            }
                        })
                        .catch(() => {
                            this.$Message.error('网络错误');
                        });
                }
            });
        },
        getSelect () {
            const t = this;
            getDataLevelUserLogin({
                _mt: "baseParmInfo.getSelectValue",
                typeCode: "relationship"
            })
                .then(res => {
                    if (isSuccess(res, t)) {
                        t.selectFmRelation = res.data.content[0].value[0].paramList;
                    }
                })
                .catch(() => {
                    this.$Message.error('网络错误');
                });
        },
        clear () {
            const t = this;
            t.form = {};
            t.fmCname = "";
            t.form.fmIsurgent = "1"
            t.$refs.form.resetFields();
        },
        close () {
            this.clear();
            this.$emit("hideMsg");

        }
    }
};
</script>
<style lang="scss" scoped>
@import "../../../../sass/updateAndAdd";
.btn {
    position: absolute;
    bottom: 20px;
    right: 36px;
}
</style>
