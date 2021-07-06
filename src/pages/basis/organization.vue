<template>
<!-- 信息管理-组织机构 -->
<div class="m-basisOrganization">
    <div class="title">组织机构</div>
    <div class="g-content">
        <div class="g-left">
            <div class="company">
                <a-tooltip placement="top">
                    <template slot="title">深圳市蚂蚁智行科技有限公司</template>
                    <span>深圳市蚂蚁智行科技有限公司</span>
                </a-tooltip>
                <div class="btn-add"></div>
            </div>
            <a-tree showIcon blockNode default-expand-all
            :tree-data="treeData"
            :selectable="false">
                <div slot="switcherIcon"></div>
                <template slot="custom" slot-scope="record">
                    <div class="ant-title">{{ record.title }}</div>
                    <div class="btn-group">
                        <div class="btn btn-add"></div>
                        <div class="btn btn-edit"></div>
                        <div class="btn btn-delete"></div>
                    </div>
                </template>
            </a-tree>
        </div>
        <div class="g-right">
            <div class="header">
                <div class="driver">
                    <div class="name">司机数量</div>
                    <div class="count">16</div>
                </div>
                <div class="vehicle">
                    <div class="name">车辆数量</div>
                    <div class="count">16</div>
                </div>
                <div class="business">
                    <div class="name">业务员数量</div>
                    <div class="count">16</div>
                </div>
            </div>
            <div class="content">
                <a-row class="item" :gutter="10">
                    <a-col :span="6">
                        <div class="name">机构名称</div>
                        <div class="descript">深圳市蚂蚁智行科技深圳市蚂蚁智行科技深圳市蚂蚁智行科技深圳市蚂蚁智行科技</div>
                    </a-col>
                    <a-col :span="6">
                        <div class="name">创建时间</div>
                        <div class="descript">2020.02.06</div>
                    </a-col>
                    <a-col :span="6">
                        <div class="name">联系人</div>
                        <div class="descript">李小龙</div>
                    </a-col>
                    <a-col :span="6">
                        <div class="name">联系电话</div>
                        <div class="descript">15762837283</div>
                    </a-col>
                </a-row>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            treeData:[
                {
                    title: 'leaf',
                    key: '0-0',
                    scopedSlots: { title: 'custom'},
                    children: [
                        { 
                            title: 'leafleafleafleafleafleafleaf', 
                            key: '0-0-0',
                            scopedSlots: { title: 'custom'},
                            children:[
                                {
                                    title: 'leaf', 
                                    key: '0-0-0-0',
                                    scopedSlots: { title: 'custom'}
                                }
                            ]
                        },
                        { 
                            title: 'leaf', 
                            key: '0-0-1',
                            scopedSlots: { title: 'custom'}
                        }
                    ]
                }
            ]
        }
    }
}
</script>

<style lang="less">
.m-basisOrganization {
    display: flex;
    flex-direction: column;
    height:100%;

    .title {
        color:#15121F;
        font-size: 48px;
        font-family: "ZiTiQuanXinYiGuanHeiTi3.0-2";
    }

    .g-content {
        display: flex;
        padding-top:16px;
        height:10px;
        flex-grow: 1;

        .g-left {
            padding-top:45px;
            position: relative;
            width:236px;
            height:100%;
            border-radius: 8px;
            background-color: #EFEFFB;

            .company {
                padding:12px 18px;
                position:absolute;
                top:0;
                left:0;
                width:100%;
                height:45px;
                color:#fff;
                background-color: #15121F;
                font-size: 16px;
                border-radius: 8px 8px 0 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                letter-spacing: 1px;

                &:hover {
                    padding:12px 35px 12px 18px;

                    .btn-add {
                        display: block;
                    }
                }

                .btn-add {
                    display: none;
                    margin-top:-12px;
                    width:24px;
                    height:24px;
                    position:absolute;
                    right:8px;
                    top:50%;
                    background:url("../../assets/organization/white_add.png") no-repeat center;
                    background-size: 24px;
                    cursor: pointer;

                    &:hover {
                        background-color: #CFCFE0;
                    }
                }
            }

            .ant-tree {
                padding-left:8px;

                li {
                    padding:0;
                }

                .ant-tree-node-content-wrapper {
                    height:46px;
                    line-height:46px;

                    &::before {
                        content:"";
                        display: block;
                        position:absolute;
                        left:0;
                        height:46px;
                        width:100%;
                    }

                    &:hover {
                        background-color: transparent;

                        &::before {
                            background-color: #E5E5F3;
                        }

                        .ant-title {
                            padding-right: 110px;
                        }

                        .btn-group {
                            display: block;
                        }
                    }

                    &:active {

                        &::before {
                            background-color: #CFCFE0;
                        }
                    }

                    .ant-tree-title {
                        position: relative;
                        margin-left:8px;
                        z-index: 2;
                    }

                    .ant-tree-iconEle {
                        position: relative;
                        display: inline-block !important;
                        margin-top:10px;
                        z-index: 2;

                        &.ant-tree-icon__open {
                            width:24px;
                            height:24px;
                            background:url("../../assets/organization/open_package.png") no-repeat center;
                            background-size: 24px;

                            svg {
                                display: none;
                            }
                        }

                        &.ant-tree-icon__close {
                            width:24px;
                            height:24px;
                            background:url("../../assets/organization/package.png") no-repeat center;
                            background-size: 24px;
                        }

                        &.ant-tree-icon__docu {
                            width:24px;
                            height:24px;
                            background:url("../../assets/organization/point.png") no-repeat center;
                            background-size: 24px;
                        }
                    }

                    .btn-group {
                        display: none;
                        position:absolute;
                        right:30px;
                        top:-20px;

                        .btn {
                            float:left;

                            &:hover {
                                background-color: #CFCFE0;
                            }
                        }

                        .btn-add {
                            width:24px;
                            height:24px;
                            background:url("../../assets/organization/add.png") no-repeat center;
                            background-size: 24px;
                        }

                        .btn-edit {
                            width:24px;
                            height:24px;
                            background:url("../../assets/organization/edit.png") no-repeat center;
                            background-size: 24px;
                        }

                        .btn-delete {
                            width:24px;
                            height:24px;
                            background:url("../../assets/organization/delete.png") no-repeat center;
                            background-size: 24px;
                        }
                    }
                }

                .ant-tree-switcher {
                    position: relative;
                    margin:10px 0 0 0;
                    z-index: 2;

                    &.ant-tree-switcher_close {

                        .ant-tree-switcher-icon {
                            transform: rotateZ(-90deg);
                        }
                    }

                    .ant-tree-switcher-icon {
                        height:100%;
                        width:100%;
                        background:url("../../assets/organization/down.png") no-repeat center;
                        background-size: 10px;
                        transition: all 0.3s;
                        transform: rotateZ(0);
                    }
                }

                .ant-title {
                    padding-right: 40px;
                    display: inline-block;
                    color:#15121F;
                    font-size: 14px;
                    width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .btn-group {
                    position:absolute;
                }
            }
        }

        .g-right {
            padding-left:16px;
            flex-grow: 1;
            width: 10px;

            .header {
                overflow: hidden;

                .driver,
                .vehicle,
                .business {
                    padding:40px 0 0 40px;
                    float:left;
                    width:250px;
                    height:156px;

                    .name {
                        color:#84838E;
                        font-size: 14px;
                    }

                    .count {
                        margin-top:10px;
                        color:#15121F;
                        font-size: 26px;
                        font-family: "ZiTiQuanXinYiGuanHeiTi3.0-2";
                    }
                }

                .driver {
                    background:url("../../assets/organization/driver.png") no-repeat center;
                    background-size: 250px;
                }

                .vehicle {
                    background:url("../../assets/organization/vehicle.png") no-repeat center;
                    background-size: 250px;
                }

                .business {
                    background:url("../../assets/organization/business.png") no-repeat center;
                    background-size: 250px;
                }
            }

            .content {
                width: 100%;

                .item {
                    padding:32px 24px;
                    background-color: #EFEFFB;
                }

                .name {
                    color:#84838E;
                    font-size: 14px;
                }

                .descript {
                    margin-top:13px;
                    color:#15121F;
                    font-size: 26px;
                }
            }
        }
    }
}
</style>