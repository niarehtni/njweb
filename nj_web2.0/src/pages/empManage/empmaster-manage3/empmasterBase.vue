﻿<template>
    <div class="cover">
        <div class="box">
            <row>
                <i-col class="meau-left"
                       span="5">
                    <Menu :active-name="active"
                          width="auto"
                          @on-select="pageTo">
                        <!--主子表左侧页面布局-->
                        <MenuItem name="empBaseInfo">员工基础信息</MenuItem>
                        <MenuItem name="empEducation"
                                  :disabled="logType==='新增'"
                                  @click.native="logType==='新增'?tips():''">学历信息管理</MenuItem>
                        <MenuItem name="empContractInfo"
                                  :disabled="logType==='新增'"
                                  @click.native="logType==='新增'?tips():''">合同信息管理</MenuItem>
                        <MenuItem name="empWorkExp"
                                  :disabled="logType==='新增'"
                                  @click.native="logType==='新增'?tips():''">工作经历管理</MenuItem>
                        <MenuItem name="empFamily"
                                  :disabled="logType==='新增'"
                                  @click.native="logType==='新增'?tips():''">家庭成员管理</MenuItem>
                    </Menu>
                </i-col>
                <i-col class="meau-right"
                       span="19">
                    <div class="title">
                        <div class="title-text">
                            <Icon type="mouse"
                                  size="16"
                                  style="margin-right: 10px;"></Icon>
                            {{logType}}
                        </div>
                        <Button type="text"
                                @click="handleReset">
                            <Icon type="close-round"
                                  size="16"></Icon>
                        </Button>
                    </div>
                    <div style="margin-top: 40px;padding: 10px;">
                        <!--主表详细信息页面 visaare为特殊参数一般不传 其余无需变更-->
                        <empBaseInfo v-show="empBaseInfo"
                                     ref="empBaseInfo"
                                     :index="index"
                                     :modity="modity"
                                     @update="update"
                                     @newdata="newdata"></empBaseInfo>
                        <!--子表分页页面 mainid为主表id-->
                        <empEducation v-show="empEducation"
                                      ref="empEducation"></empEducation>
                        <empContractInfo v-show="empContractInfo"
                                         ref="empContractInfo"></empContractInfo>
                        <empWorkExp v-show="empWorkExp"
                                    ref="empWorkExp"></empWorkExp>
                        <empFamily v-show="empFamily"
                                   ref="empFamily"></empFamily>
                    </div>
                </i-col>
            </row>
        </div>
    </div>
</template>
<script>
import {
    getDataLevelUserLoginNew,
    getDataLevelUserLogin,
} from "../../../axios/axios";
import { isSuccess, deepCopy, getUrlKey, GetQueryString } from "../../../lib/util";
import empBaseInfo from "./empBaseInfo/empBaseInfo";
import empEducation from "./empEducation/empEducation";
import empContractInfo from "./empContractInfo/empContractInfo";
import empWorkExp from "./empWorkExp/empWorkExp";
import empFamily from "./empFamily/empFamily";

export default {
    data () {
        return {
            // 默认参数 无需变更
            active: "empBaseInfo",
            empBaseInfo: true,
            empEducation: false,
            empContractInfo: false,
            empWorkExp: false,
            empFamily: false,
        };
    },
    components: {
        empBaseInfo,
        empEducation,
        empContractInfo,
        empWorkExp,
        empFamily
    },
    props: {
        index: Number,
        modity: String
    },
    computed: {
        id () {
            return this.$store.state.empMaster.mainId;
        },
        logType () {
            return this.$store.state.empMaster.logType;
        }
    },
    methods: {
        //      关闭方法 分别调用本页面 父页面 主表详细信息页面 子表分页的清除方法  无需变更
        handleReset () {
            this.$emit("closeUp");
            this.clear();
        },
        //      默认方法
        changeMenu () {
            this.active = "empBaseInfo";
        },
        // 主表信息查询方法 无需变更
        getOption (id, logType) {
            this.$refs.empBaseInfo.disabled = false
            if (logType == "修改" || logType == "查看") {
                this.$refs.empBaseInfo.getdata(id);
            }
            if (logType == "查看") {
                this.$refs.empBaseInfo.disabled = true
            }
        },
        tips () {
            this.active = "empBaseInfo";
            this.$Message.warning('请先保存数据!');
        },
        //       根据name分别调用 主表或子表的查询方法 无需变更
        pageTo (name) {
            if (this.logType === "新增") {
                return;
            }
            this.empBaseInfo = false;
            this.empEducation = false;
            this.empContractInfo = false;
            this.empWorkExp = false;
            this.empFamily = false;
            this.$refs.empBaseInfo.clear();
            this.$refs.empEducation.clear();
            this.$refs.empContractInfo.clear();
            this.$refs.empWorkExp.clear();
            this.$refs.empFamily.clear();
            this.active = name;
            this[name] = true;
            console.log(this.logType, "this.logType");
            console.log(name, "name");
            if (name !== "empBaseInfo") {
                this.getChildFunId(name)
                this.$refs[name].search('获取');
            } else {
                this.$store.commit('setChildFunId', "");
                this.getOption(this.id, this.logType);
            }
        },
        //获取子表funId
        getChildFunId (name) {
            const t = this;
            let code = "";
            if (name == "empEducation") {
                code = '310100145'
            } else if (name == "empContractInfo") {
                code = '310100115'
            } else if (name == "empWorkExp") {
                code = '310100150'
            } else if (name == "empFamily") {
                code = '310100165'
            }
            this.$store.commit('setFunCode', code);
            const data = {
                _mt: 'sysFunctions.getIdByCode',
                funCode: code
            }
            getDataLevelUserLoginNew(data)
                .then(res => {
                    if (isSuccess(res, t)) {
                        let childCode = res.data.content[0].value;
                        this.$store.commit('setChildFunId', childCode);
                    }
                })
                .catch(() => {
                    this.$Message.error('网络错误');
                });
        },
        //      清空方法 初始化本页面参数 无需变更
        clear () {
            this.empBaseInfo = true;
            this.empEducation = false;
            this.empContractInfo = false;
            this.empWorkExp = false;
            this.empFamily = false;
            this.active = "empBaseInfo";
            this.$refs.empBaseInfo.clear();
            this.$refs.empEducation.clear();
            this.$refs.empContractInfo.clear();
            this.$refs.empWorkExp.clear();
            this.$refs.empFamily.clear();
            this.$store.commit('setChildFunId', "");
            let funcode = getUrlKey('code');
            this.$store.commit('setFunCode', funcode);
            this.$store.commit('empMaster/setMainId', "")
            this.$store.commit('empMaster/setLogType', "");
            this.$store.commit('empMaster/setDeptId', "");
        },
        //      更新父页面列表 无需变更
        update (data) {
            this.$emit('update', data)
        },
        //      更新父页面列表 无需变更
        newdata (data) {
            this.$emit('newdata', data)
        },
    }
};
</script>
<style>
.ivu-menu-vertical.ivu-menu-light:after {
    background-color: transparent;
}
</style>
<style lang="scss" scoped>
@import "../../../sass/updateAndAdd";
.header-box {
    display: flex;
    position: relative;
    justify-content: flex-end;
}
.cover .box {
    padding: 0;
}
.cover .box .form {
    margin-top: 60px;
}
.meau-left {
    margin-top: 30px;
}
.meau-right {
    position: relative;
    border-left: 2px solid #efefef;
}
.header-cover {
    display: none;
    top: 0;
    right: 0;
    color: #fff;
    border-radius: 50%;
    position: absolute;
    width: 150px;
    height: 150px;
    background-color: rgba(0, 0, 0, 0.3);
}
.header-box:hover .header-cover {
    display: flex;
    justify-content: center;
    align-items: center;
}
.header-box:hover {
    cursor: pointer;
}
.header {
    height: 150px;
    width: 150px;
    border-radius: 50%;
    overflow: hidden;
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

