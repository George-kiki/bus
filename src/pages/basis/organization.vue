<template>
<!-- 信息管理-组织机构 -->
<a-spin :spinning="loading.page" class="m-basisOrganization">
    <div class="title">组织机构</div>
    <div class="g-content">
        <div class="g-left">
            <div class="company">
                <a-tooltip placement="top" @click="getDetail(company.id)">
                    <template slot="title">{{ company.name }}</template>
                    <div class="name">{{ company.name }}</div>
                </a-tooltip>
                <div class="btn-add" @click="editOrganizationOperation('add',{id:company.id})"></div>
            </div>
            <a-tree showIcon blockNode selectable
            :selected-keys="tree"
            :tree-data="treeData"
            :expandedKeys="expandedKeys"
            :replaceFields="{
                title:'name',
                key:'id'
            }"
            @expand="openExpand"
            @select="selectTree">
                <div slot="switcherIcon"></div>
                <template slot="custom" slot-scope="record">
                    <div class="ant-title" @click="getDetail(record.id)">{{ record.name }}</div>
                    <div class="btn-group">
                        <div class="btn btn-add" v-if="record.level != 3" @click="editOrganizationOperation('add',record)"></div>
                        <div class="btn btn-edit" @click="editOrganizationOperation('edit',record)"></div>
                        <div class="btn btn-delete" @click="editOrganizationOperation('delete',record)"></div>
                    </div>
                </template>
            </a-tree>
        </div>
        <a-spin :spinning="loading.detail" class="g-right">
            <div class="header">
                <div class="driver">
                    <div class="name">司机数量</div>
                    <div class="count">{{ detail.driverCount }}</div>
                </div>
                <div class="vehicle">
                    <div class="name">车辆数量</div>
                    <div class="count">{{ detail.vehicleCount }}</div>
                </div>
                <!-- <div class="business">
                    <div class="name">业务员数量</div>
                    <div class="count">16</div>
                </div> -->
            </div>
            <div class="content">
                <a-row class="item" :gutter="10">
                    <a-col :span="6">
                        <div class="name">机构名称</div>
                        <div class="descript">{{ detail.name }}</div>
                    </a-col>
                    <a-col :span="6">
                        <div class="name">创建时间</div>
                        <div class="descript">{{ detail.createDate }}</div>
                    </a-col>
                    <a-col :span="6">
                        <div class="name">联系人</div>
                        <div class="descript">{{ detail.enterContactName }}</div>
                    </a-col>
                    <a-col :span="6">
                        <div class="name">联系电话</div>
                        <div class="descript">{{ detail.contact }}</div>
                    </a-col>
                </a-row>
            </div>
        </a-spin>
    </div>
    <!-- 编辑组织机构 -->
    <a-modal
    :title="editOrganization.title"
    class="m-basisEditVehicle"
    width="349px"
    :visible="editOrganization.show"
    :maskClosable="false"
    @cancel="editOrganizationOperation('cancel')">
        <a-form :form="editOrganization.form" class="g-basisForm" :colon="false">
            <a-form-item label="机构名称">
                <a-input placeholder="请输入" autocomplete="off" 
                :maxLength="10"
                v-decorator="[
                    'name',
                    {
                        rules:[
                            {required:true}
                        ]
                    }
                ]"></a-input>
            </a-form-item>
            <a-form-item label="联系人">
                <a-input placeholder="请输入" autocomplete="off"
                :maxLength="10"
                v-decorator="[
                    'enterContactName',
                    {
                        rules:[
                            {required:true}
                        ]
                    }
                ]"></a-input>
            </a-form-item>
            <a-form-item label="联系电话">
                <a-input placeholder="请输入11位电话" autocomplete="off"
                :maxLength="11"
                v-decorator="[
                    'contact',
                    {
                        validateTrigger:'blur',
                        rules:[
                            {required:true},
                            {pattern:/^\d{11}$/},
                        ]
                    }
                ]"></a-input>
            </a-form-item>
        </a-form>
        <template slot="footer">
            <a-button type="default" class="btn btn-cancel" @click="editOrganizationOperation('cancel')">取消</a-button>
            <a-button type="primary" class="btn btn-submit" @click="editOrganizationOperation('submit')" :loading="editOrganization.submitLoading">确定</a-button>
        </template>
    </a-modal>
</a-spin>
</template>

<script>
export default {
    data() {
        return {
            loading:{
                page:false,
                detail:false
            },
            company:{   // 公司
                name:'',    // 名称
                id:''   // 编号
            },
            expandedKeys:[],    // 默认展开的节点
            tree:[],    // 选中的树节点
            treeData:[],
            editOrganization:{  // 编辑组织机构
                show:false,
                title:'',
                submitLoading:false,
                oid:null,    // 机构id
                parentId:null,    // 父级id
                form:this.$form.createForm(this)
            },
            detail:{
                contact:'', // 联系方式
                name:'',    // 机构名称
                createDate:'',  // 创建日期
                enterContactName:'', // 联系人名称
                vehicleCount:0, // 车辆总数
                driverCount:0  // 司机总数
            }
        }
    },
    created() {
        this.getList();
    },
    methods:{
        /**
         * 获取树列表
         * @param {String} oid [组织id]
         */
        getList(oid) {
            this.loading.page = true;
            this.$api.post(this.$face.ORGANIZATION.list.getTenantOfficeTree,{
            },data => {
                let expandedKeys = [];
                Object.assign(this.company,{
                    name:data[0].name,
                    id:data[0].id
                });
                this.formatTreeData(data[0].children,1,expandedKeys);
                this.treeData = data[0].children;
                this.expandedKeys = expandedKeys;

                this.getDetail(oid || data[0].id);
            },err => {
            },() => {
                this.loading.page = false;
            });
        },
        /**
         * 获取详情
         * @param {String} oid 
         */
        getDetail(oid) {
            // 如果选中的最高级组织，则去掉树选中
            if(oid == this.company.id) {
                this.tree = []
            };

            this.loading.detail = true;
            this.$api.post(this.$face.ORGANIZATION.list.detailOfficeCountList,{
                id:oid
            },data => {
                Object.assign(this.detail,{
                    contact:data.contact, // 联系方式
                    name:data.name,    // 机构名称
                    createDate:data.createDate,  // 创建日期
                    enterContactName:data.enterContactName, // 联系人名称
                    vehicleCount:data.vehicleCount,
                    driverCount:data.driverCount
                });
            },err => {
            },() => {
                this.loading.detail = false;
            });
        },
        /**
         * 树展开
         * @param {Array} expand [树]
         */
        openExpand(expand) {
            this.expandedKeys = expand;
        },
        /**
         * 选中树节点
         * @param {Array} selectedKeys [选中的树节点]
         */
        selectTree(selectedKeys) {
            selectedKeys.length && (this.tree = [selectedKeys[selectedKeys.length - 1]]);
        },
        /**
         * 格式化树结构
         * @param {Array} list [树]
         * @param {Number} level [级别]
         * @param {Array} expandedKeys [展开的树]
         */
        formatTreeData(list,level,expandedKeys) {
            list.forEach(val => {
                Object.assign(val,{
                    scopedSlots:{title:'custom'},
                    level
                });
                if(val.children && val.children.length) {
                    this.formatTreeData(val.children,level + 1,expandedKeys);
                    expandedKeys.push(val.id);
                }
            });
        },
        /**
         * 编辑组织机构操作
         * @param {String} type [操作类型]
         * @param {Object} record [数据]
         */
        editOrganizationOperation(type,record) {
            let {editOrganization} = this;

            switch(type) {
                case "add":    // 新增
                    Object.assign(editOrganization,{
                        show:true,
                        title:"新增组织机构",
                        parentId:record.id
                    });
                break;
                case "edit":    // 编辑
                    Object.assign(editOrganization,{
                        show:true,
                        title:"编辑组织机构",
                        oid:record.id
                    });
                    this.$nextTick(() => {
                        editOrganization.form.setFieldsValue({
                            name:record.name,
                            enterContactName:record.enterContactName,
                            contact:record.contact
                        });
                    })
                break;
                case "delete":  // 删除
                    this.$confirm({
                        title: '删除组织架构',
                        content: `是否删除'${record.name}'`,
                        okType: 'danger',
                        okButtonProps:{
                            style:'float:left;margin-right:10px;'
                        },
                        onOk:() => new Promise((resolve, reject) => {
                            this.$api.post(`${this.$face.ORGANIZATION.list.delete}?id=${record.id}`,{
                            },data => {
                                this.$message.success("删除成功");
                                this.getList();
                                // 关闭弹窗
                                resolve();
                            },err => {
                                reject();
                            });
                        }),
                        onCancel:() => {
                        }
                    });
                break;
                case "cancel":  // 取消
                    Object.assign(editOrganization,{
                        show:false,
                        submitLoading:false,
                        parentId:null,
                        oid:null
                    });
                    editOrganization.form.resetFields();
                break;
                case "submit":  // 提交
                    editOrganization.form.validateFields((err,values) => {
                        if(!err) {
                            editOrganization.submitLoading = true;
                            this.$api.post(this.$face.ORGANIZATION.list[editOrganization.oid?'update':'save'],{
                                id:editOrganization.oid,
                                parentId:editOrganization.parentId,
                                name:values.name,
                                contact:values.contact,
                                enterContactName:values.enterContactName
                            },data => {
                                this.$message.success("提交成功");
                                this.getList(editOrganization.oid);
                                this.editOrganizationOperation('cancel');
                            },err => {
                            },() => {
                                editOrganization.submitLoading = false;
                            });
                        }
                    });
                break;
            }
        }
    }
}
</script>

<style lang="less">
.m-basisOrganization {
    height:100%;

    .ant-spin-container {
        padding:0 16px;
        display: flex;
        flex-direction: column;
        height:100%;
    }

    .title {
        padding-left:8px;
        color:#15121F;
        font-size: 46px;
        height:58px;
        line-height:58px;
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
                position:absolute;
                top:0;
                left:0;
                width:100%;
                height:45px;
                color:#fff;
                background-color: #15121F;
                font-size: 16px;
                border-radius: 8px 8px 0 0;
                letter-spacing: 1px;
                cursor: pointer;

                &:hover {

                    .name {
                        padding:12px 35px 12px 18px;
                    }

                    .btn-add {
                        display: block;
                    }
                }

                .name {
                    padding:12px 18px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
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
                        background-color: #282437;
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

                    &.ant-tree-node-selected {
                        background-color: transparent !important;
                    }

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

                    &.ant-tree-node-selected,
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
            flex-grow: 1;
            width: 10px;

            .ant-spin-container {
                padding-left:16px;
                height:100%;
            }

            .header {
                position:relative;
                height:134px;

                .driver,
                .vehicle,
                .business {
                    position:relative;
                    left:-26px;
                    top:-22px;
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