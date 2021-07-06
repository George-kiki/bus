<template>
<a-layout class="g-managerLayout">
    <a-layout-sider class="g-managerSider" width="212px">
        <a-menu class="menu" theme="dark" mode="inline" ref="menu"
        v-model="content.menu"
        :openKeys="sider.openKeys"
        @click="goUrl"
        @openChange="siderOpenChange">
            <a-sub-menu class="basis" key="basis">
                <span slot="title"><span>信息管理</span></span>
                <a-menu-item key="basisOrganization">组织机构</a-menu-item>
                <a-menu-item key="basisDriverList">司机管理</a-menu-item>
                <a-menu-item key="basisVehicleList">车辆管理</a-menu-item>
                <a-menu-item key="basisTeam">人车班组</a-menu-item>
                <a-menu-item key="basisSalesman">业务员管理</a-menu-item>
                <a-menu-item key="basisEquipment">设备管理</a-menu-item>
            </a-sub-menu>
            <a-sub-menu class="roster" key="roster">
                <span slot="title"><span>智能排班</span></span>
                <a-menu-item key="1">排班</a-menu-item>
                <a-menu-item key="2">调度</a-menu-item>
                <a-menu-item key="3">行车记录</a-menu-item>
                <a-menu-item key="4">补助管理</a-menu-item>
            </a-sub-menu>
            <a-sub-menu class="business" key="business">
                <span slot="title"><span>机务和请休假</span></span>
            </a-sub-menu>
            <a-sub-menu class="line" key="line">
                <span slot="title"><span>班线管理</span></span>
            </a-sub-menu>
            <a-sub-menu class="order" key="order">
                <span slot="title"><span>订单管理</span></span>
            </a-sub-menu>
            <a-sub-menu class="client" key="client">
                <span slot="title"><span>客户关系管理</span></span>
            </a-sub-menu>
            <a-sub-menu class="finance" key="finance">
                <span slot="title"><span>财务管理</span></span>
            </a-sub-menu>
            <a-sub-menu class="configuration" key="configuration">
                <span slot="title"><span>参数配置</span></span>
            </a-sub-menu>
            <a-sub-menu class="system" key="system">
                <span slot="title"><span>系统管理</span></span>
            </a-sub-menu>
        </a-menu>
    </a-layout-sider>
    <a-layout>
        <a-layout-header theme="light" class="g-managerHeader">
            <div class="userInfo">
                <div class="user-pht"></div>
                <div class="user-name">
                    <a-dropdown>
                        <span class="ant-dropdown-link" @click="e => e.preventDefault()">
                            <span>{{ $store.state.userInfo.name }}</span>
                            <a-icon type="down" />
                        </span>
                        <!-- <a-menu slot="overlay">
                            <a-menu-item key="0">
                                <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">1st menu item</a>
                            </a-menu-item>
                        </a-menu> -->
                    </a-dropdown>
                </div>
                <button class="btn-close" @click="exitSystem"></button>
            </div>
        </a-layout-header>
        <a-layout-content class="g-managerContent">
            <a-tabs class="m-tabs" type="editable-card" hideAdd
            v-model="content.current"
            :tabBarGutter="8"
            @tabClick="changeMenu">
                <a-tab-pane
                v-for="en in content.tabs"
                :key="en.sign"
                :tab="en.name">
                    <component :is="en.component" :ref="en.sign"></component>
                </a-tab-pane>
            </a-tabs>
        </a-layout-content>
    </a-layout>
</a-layout>
</template>

<script>
import Vue from 'vue';
import authority from '../config/authority';
import tabs from '../config/tabs';

export default {
    data() {
        return {
            sider:{ // 侧边栏
                show:true,  // 是否显示菜单，默认为true
                openKeys:[],   // 当前展开的菜单
                belong:[]   // 菜单栏的归属
            },
            content:{   // 右侧内容
                menu:[],    // 左侧处于激活的菜单
                current:'', // 当前处于激活状态的tab
                currentObj:{},    // 当前处于激活状态的tab对象
                tabs:[] // tabs列表
            }
        }
    },
    created() {
        this.rewriteTabsPush();
    },
    mounted() {
        // 获取菜单栏的归属，用于切换菜单的时候展开菜单
        this.sider.belong = this.$refs.menu.$slots.default.filter(val => val.tag).map(val => {
            let child = {};
            val.componentOptions.children.filter(item => item.tag).map(item => item.data.key).filter(val => {
                if(val) {
                    child[val] = true;
                    return true;
                }
            });
            return {
                key:val.data.key,
                child
            }
        });
    },
    methods: {
        /**
         * 页面跳转
         * @param {Object} prop [跳转参数]
         */
        goUrl({key}) {
            this.$tabs.push({
                name:(() => {
                    switch(key) {
                        case "basisOrganization":
                            return "组织机构";
                        case "basisDriverList":
                            return "司机管理";
                        case "basisVehicleList":
                            return "车辆管理";
                        case "basisTeam":
                            return "人车班组";
                        case "basisSalesman":
                            return "业务员管理";
                        case "basisEquipment":
                            return "设备管理";
                    }
                })(),
                model:key,
                sign:key,
                belong:key,
                params: {}
            });
        },
        /**
         * 菜单展开变更
         * @param {Array} openSider [展开的菜单]
         */
        siderOpenChange(openSider) {
            if(openSider.length) {
                this.sider.openKeys = [openSider[openSider.length - 1]];
            } else {
                this.sider.openKeys = [];
            }
        },
        /**
         * 重写tabs的跳转功能
         */
        rewriteTabsPush() {
            let self = this,
            content = this.content,
            $message = this.$message;

            /**
             * 跳转页面
             * @param {Object||String} obj [跳转参数对象，Object:{name:'tab名称',model:'模块名称',belong:'隶属左侧哪个菜单',sign:'唯一标识',params:'传递的参数‘}]
             */
            this.$tabs.push = function(obj) {
                // 如果存在备份的params则传递过去
                obj.params && (tabs.params = obj.params);
                if(obj == void 0) { $message.error("请传入参数对象"); }
                let objType = Object.prototype.toString.call(obj);

                if(~objType.indexOf("Object")) {    // 参数对象为Object类型
                    if(obj.sign && obj.name && obj.model && obj.belong) {
                        // 寻找相应的sign的tab，然后切换
                        let current = content.tabs.find(val => {
                            return val.sign == obj.sign
                        });

                        if(current) {   // 如果tabs存在传入的sign，则切换
                            // 如果存在旧的激活tab，则调用其lostActive函数
                            content.current && self.$refs[content.current][0].lostActive && self.$refs[content.current][0].lostActive();
                            content.current = current.sign;
                            content.currentObj = current;
                            // 调用当前的激活的tab的getActive函数
                            self.$refs[content.current][0].getActive && self.$refs[content.current][0].getActive();
                            // 刷新组件
                            content.currentObj.component = null;
                            self.$nextTick(() => {
                                content.currentObj.component = this.TABS[obj.model];
                            });
                            // 变更相应数据
                            Object.assign(content.currentObj,{
                                name:obj.name,
                                belong:obj.belong
                            });
                            content.menu = current.belong;
                        } else if(this.TABS[obj.model]) {
                            current = {
                                sign:obj.sign,
                                name:obj.name,
                                component:this.TABS[obj.model],
                                belong:obj.belong
                            };
                            // 增加tab并设为激活状态
                            content.tabs.push(current);
                            // 如果存在旧的激活tab，则调用其lostActive函数
                            content.current && self.$refs[content.current][0].lostActive && self.$refs[content.current][0].lostActive();
                            content.current = obj.sign;
                            content.currentObj = current;
                            content.menu = obj.belong;
                        } else {
                            $message.error("传入的model不存在");
                        }
                    } else if(obj.sign) {
                        this.push(obj.sign);
                    } else {
                        $message.error("请传入正确的参数对象");
                    }
                } else if(~objType.indexOf("String")) { // 参数对象为String类型
                    // 如果不存在model，则寻找相应的name的tab，然后切换
                    let current = content.tabs.find(val => {
                        return val.sign == obj
                    });

                    if(current) {
                        // 如果存在旧的激活tab，则调用其lostActive函数
                        content.current && self.$refs[content.current][0].lostActive && self.$refs[content.current][0].lostActive();
                        content.current = current.sign;
                        content.currentObj = current;
                        content.menu = current.belong;
                        // 调用当前的激活的tab的getActive函数
                        self.$refs[content.current][0].getActive && self.$refs[content.current][0].getActive();
                    } else {
                        $message.error(`当前不存在${obj}`);
                    }
                } else {
                    $message.error("请传入正确的参数对象");
                }
            }

            /**
             * 关闭页面
             * @param {Object || String} prop [可以不传{closeModel:需要关闭的模块名称,goProps:跳转页面属性}]
             */
            this.$tabs.close = function(prop) {
                if(prop) {
                    if(typeof prop == "string") {
                        self.removeMenu(prop);
                    } else {
                        let {closeModel,goProps} = prop;

                        self.removeMenu(closeModel || content.current);
                        // 同时具备需要跳转的参数和在现有的tabs内找到模块，才能跳转
                        goProps && this.push(goProps);
                    }
                } else {
                    self.removeMenu(content.current);
                }
            }
        },
        /**
         * 切换tab
         * @param {String} sign [标签]
         */
        changeMenu(sign) {
            let comp = this.content.tabs.find(val => val.sign == sign);
            // 调用失去焦点函数
            this.$refs[this.content.currentObj.sign][0].lostActive && this.$refs[this.content.currentObj.sign][0].lostActive();
            // 变更当前的焦点
            this.content.currentObj = this.content.tabs.find(val => val.sign == sign);
            // 调用获得焦点函数
            this.$refs[sign][0].getActive && this.$refs[sign][0].getActive();
            // 切换左侧菜单激活状态
            this.content.menu = [comp.belong];
            this.sider.openKeys = [this.sider.belong.find(val => val.child[comp.belong]).key];
        },
        /**
         * 移除tab
         * @param {String} sign [模块名称]
         */
        removeMenu(sign) {
            let {content} = this;
            // 删除相应的tab
            content.tabs.find((val,index) => {
                if(val.sign == sign) {
                    content.tabs.splice(index,1);
                    return true;
                }
            });
            // 如果删除后tabs还有值且删除的tab为当前激活的tab，则选取数组的第一位为激活状态
            if(content.tabs.length) {
                if(sign == content.current) {
                    content.current = content.tabs[0].sign;
                    content.currentObj = content.tabs[0];
                    this.$refs[content.current][0].getActive && this.$refs[content.current][0].getActive();
                    // 切换左侧菜单激活状态
                    this.content.menu = content.currentObj.belong;
                } else {
                    this.$refs[sign][0].lostActive && this.$refs[sign][0].lostActive();
                }
            } else {
                content.current = '';
                // 切换左侧菜单激活状态
                this.content.menu = '';
            }
        },
        /**
         * 退出系统
         */
        exitSystem() {
            this.$confirm({
                title: "注销",
                content: '提示:是否确定退出系统？',
                okType: 'danger',
                okButtonProps:{
                    style:'float:left;margin-right:10px;'
                },
                onOk:() => {
                    window.localStorage.clear();
                    this.$router.push({
                        name:"login",
                        params:{
                            isReload:true
                        }
                    });
                },
                onCancel:() => {}
            });
        }
    }
}
</script>

<style lang="less">
.g-managerLayout {
    height: 100%;
    min-height: 710px;
    width: 100%;

    .g-managerSider {
        padding:171px 0 0 0;
        background: #15121F url("../assets/logo.png") no-repeat center 65px;
        background-size: 40px;
        border-radius: 0 8px 8px 0;
        box-shadow: 0px 0px 15px 5px rgba(0,0,0,0.25);

        .menu {
            color:#757F95;
            font-size: 16px;
            background-color: transparent;

            .ant-menu {
                background-color: #2A292C;
                
                .ant-menu-item {
                    padding-left:0 !important;
                    margin:0;
                    height:50px;
                    line-height:50px;
                    text-align: center;

                    &:not(.ant-menu-item-selected):hover {
                        color:#84838E;
                        background-color: #3A393C;
                    }
                }
            }

            .ant-menu-submenu {

                &:not(.ant-menu-submenu-open).ant-menu-submenu-selected {

                    .ant-menu-submenu-title {
                        border-color:#0051FE;
                    }
                }

                .ant-menu-submenu-title {
                    color:#fff;
                    padding-left:56px !important;
                    border-left:5px solid transparent;
                }
            }

            .ant-menu-submenu-arrow {
                display: none;
            }

            .basis {

                .ant-menu-submenu-title {
                    background:url("../assets/layouts/basis.png") no-repeat 16px center;
                    background-size: 24px;
                }
            }

            .roster  {

                .ant-menu-submenu-title {
                    background:url("../assets/layouts/roster.png") no-repeat 16px center;
                    background-size: 24px;
                }
            }

            .business  {

                .ant-menu-submenu-title {
                    background:url("../assets/layouts/business.png") no-repeat 16px center;
                    background-size: 24px;
                }
            }

            .line  {

                .ant-menu-submenu-title {
                    background:url("../assets/layouts/line.png") no-repeat 16px center;
                    background-size: 24px;
                }
            }

            .order  {

                .ant-menu-submenu-title {
                    background:url("../assets/layouts/order.png") no-repeat 16px center;
                    background-size: 24px;
                }
            }

            .client  {

                .ant-menu-submenu-title {
                    background:url("../assets/layouts/client.png") no-repeat 16px center;
                    background-size: 24px;
                }
            }

            .finance  {

                .ant-menu-submenu-title {
                    background:url("../assets/layouts/finance.png") no-repeat 16px center;
                    background-size: 24px;
                }
            }

            .configuration  {

                .ant-menu-submenu-title {
                    background:url("../assets/layouts/configuration.png") no-repeat 16px center;
                    background-size: 24px;
                }
            }

            .system  {

                .ant-menu-submenu-title {
                    background:url("../assets/layouts/system.png") no-repeat 16px center;
                    background-size: 24px;
                }
            }

        }
    }

    .g-managerHeader {
        padding:16px;
        height:80px;
        background-color: #F5F5FD;

        .userInfo {
            float:right;

            .user-pht {
                float:left;
                position: relative;
                width:48px;
                height:48px;
                background:#fff url("../assets/user.png") no-repeat center;
                background-size: 20px;
                border-radius: 100%;
                z-index: 3;
            }

            .user-name {
                float:left;
                padding:0 10px 0 22px;
                position: relative;
                color:#15121F;
                font-size: 16px;
                background-color: #fff;
                height:48px;
                line-height:48px;
                border-radius: 0 8px 8px 0;
                z-index: 2;
                cursor: pointer;

                &::before {
                    content:"";
                    position: absolute;
                    top: -10px;
                    left: -60px;
                    width: 70px;
                    height: 70px;
                    background-color:#F5F5FD;
                    border-radius: 100%;
                }
            }

            .btn-close {
                float:left;
                margin-left:8px;
                width:48px;
                height: 48px;
                border:none;
                background:#fff url("../assets/exit.png") no-repeat center;
                background-size: 18px;
                border-radius: 8px;
                cursor: pointer;

                &:hover {
                    opacity: 0.8;
                }
            }
        }
    }

    .g-managerContent {
        width:100%;
        background-color: #F5F5FD;

        .m-tabs {
            flex-grow: 1;
            height:100%;
            width:100%;
            display: flex;
            flex-direction: column;
            overflow: initial;

            .ant-tabs-nav-container,
            .ant-tabs-nav-scroll,
            .ant-tabs-nav-wrap {
                overflow: initial !important;
            }
            
            .ant-tabs-bar {
                padding:0 16px;
                border: none;

                .ant-tabs-tab {
                    position: relative;
                    padding:0 18px;
                    font-size: 16px;
                    color:#84838E;
                    background-color: #F5F5FD;
                    border-radius: 8px;
                    border:none;
                    box-shadow:6px 6px 10px 0 #CCCCE0;
                    z-index: 2;

                    &.ant-tabs-tab-active {
                        color:#0051FE;
                    }

                    &:not(.ant-tabs-tab-active):hover {
                        background-color: #E8E8F0;
                    }

                    &:not(.ant-tabs-tab-active):active {
                        background-color: #DEDEE6;
                    }

                    &::before {
                        content:"";
                        display: block;
                        width: 100%;
                        height:100%;
                        box-shadow:-4px -4px 10px 0 #FFFFFF;
                    }
                }
            }

            .ant-tabs-content {
                flex-grow: 1;
                height:10px;

                .ant-tabs-tabpane {
                    padding-bottom: 20px;

                    &>div {
                        padding:0 16px;
                    }
                }

                .ant-tabs-tabpane-active {
                    height:100%;
                }
            }
        }
    }
}
</style>
