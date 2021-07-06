<template>
<!-- 编辑司机 -->
<a-spin :spinning="loading.page" class="m-editVehicle g-scroll">
    <div class="header">
        <a-button type="primary" class="pull-right">提交</a-button>
        <a-button icon="caret-left" class="btn-back" @click="goPage('back')"></a-button>
        <span class="title">{{ getTitle }}</span>
    </div>
    <div class="content">
        <a-form :form="detail.form" :colon="false">
            <div class="detail">
                <div class="caption">基础信息</div>
                <a-row :gutter="102">
                    <a-col :span="6">
                        <a-form-item label="姓名">
                            <a-input placeholder="请输入10个字以内" :maxLength="10" size="large"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="联系电话">
                            <a-input placeholder="请输入10个字以内" :maxLength="10" size="large"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="所属组织">
                            <a-input placeholder="请输入10个字以内" :maxLength="10" size="large"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="工号">
                            <a-input placeholder="请输入10个字以内" :maxLength="10" size="large"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="姓名">
                            <a-input placeholder="请输入10个字以内" :maxLength="10" size="large"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="姓名">
                            <a-input placeholder="请输入10个字以内" :maxLength="10" size="large"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="姓名">
                            <a-input placeholder="请输入10个字以内" :maxLength="10" size="large"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="姓名">
                            <a-input placeholder="请输入10个字以内" :maxLength="10" size="large"></a-input>
                        </a-form-item>
                    </a-col>
                </a-row>
            </div>
            <div class="detail">
                <div class="caption">身份证信息</div>
                <a-row :gutter="102">
                    <a-col :span="6">
                        <a-form-item label="身份证号">
                            <a-input placeholder="请输入10个字以内" :maxLength="10" size="large"></a-input>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-form-item label="身份证照片">
                    <a-row type="flex" justify="start">
                        <div class="m-file">
                            <div class="tip">身份证国徽页</div>
                            <input type="file" class="btn-upload">
                        </div>
                        <div class="m-file">
                            <div class="tip">身份证信息页</div>
                            <input type="file" class="btn-upload">
                        </div>
                    </a-row>
                </a-form-item>
            </div>
            <div class="detail">
                <div class="caption">驾驶证信息</div>
                <a-row :gutter="102">
                    <a-col :span="6">
                        <a-form-item label="身份证号">
                            <a-input placeholder="请输入10个字以内" :maxLength="10" size="large"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="驾驶证号">
                            <a-input placeholder="请输入10个字以内" :maxLength="10" size="large"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="驾驶证到期时间">
                            <a-input placeholder="请输入10个字以内" :maxLength="10" size="large"></a-input>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-form-item label="身份证照片">
                    <a-row type="flex" justify="start">
                        <div class="m-file">
                            <div class="tip">驾驶证照片</div>
                            <input type="file" class="btn-upload">
                        </div>
                    </a-row>
                </a-form-item>
            </div>
            <div class="detail">
                <div class="caption">从业资质证信息</div>
                <a-row :gutter="102">
                    <a-col :span="6">
                        <a-form-item label="从业资格证号">
                            <a-input placeholder="请输入10个字以内" :maxLength="10" size="large"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="从业资格证到期时间">
                            <a-input placeholder="请输入10个字以内" :maxLength="10" size="large"></a-input>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-form-item label="从业资格证照片">
                    <a-row type="flex" justify="start">
                        <div class="m-file">
                            <div class="tip">驾驶证照片</div>
                            <input type="file" class="btn-upload">
                        </div>
                    </a-row>
                </a-form-item>
            </div>
        </a-form>
    </div>
</a-spin>
</template>

<script>
export default {
    data() {
        return {
            page:{
                vid:'', // 车辆编号
                status:'0', // 页面状态(0:新增,1:编辑,2:查看)
                from:'' // 页面来自于
            },
            loading:{
                page:false
            },
            detail:{    // 详情
                form:this.$form.createForm(this)
            }
        }
    },
    created() {
        Object.assign(this.page,this.$route.params);
    },
    methods:{
        /**
         * 切换tab
         * @param {String} tab [标签]
         */
        changeTab(tab) {
            if(this.current.tab !== tab) {
                this.current.tab = tab;
                this.$refs[tab].getList();
            }
        },
        /**
         * 页面跳转
         * @param {String} type [跳转类型]
         */
        goPage(type) {
            switch(type) {
                case "back": // 回退
                    this.$router.back();
                break;
            }
        }
    },
    computed:{
        /**
         * 获取标题
         */
        getTitle() {
            switch(this.page.status) {
                case "0":
                    return "新增司机";
                case "1":
                    return "编辑司机";
                case "2":
                    return "查看司机";
            }
        },
        /**
         * 是否禁用页面
         */
        isDisabled() {
            return this.page.status === '2';
        }
    }
}
</script>

<style lang="less">
.m-editVehicle {
    height: 100%;

    .ant-spin-container {
        height: 100%;
    }

    .header {
        height:40px;

        .btn-back {
            float:left;
            height: 40px;
            line-height: 20px;
            width: 40px;
            font-size: 18px;
            border:none;
        }

        .title {
            margin-left:8px;
            color:#15121F;
            font-size: 32px;
            line-height: 38px;
            font-family: "ZiTiQuanXinYiGuanHeiTi3.0-2";
        }
    }

    .content {

        .detail {
            margin-top:16px;
            background-color: #fff;
            border-radius: 8px;
            padding:16px;
            overflow: hidden;

            .caption {
                padding-bottom: 32px;
                color:#15121F;
                font-size: 24px;
            }

            .ant-input {
                color:#84838E;
                font-size: 16px;
                background-color: #F6F6FC;
                border:none;
            }

            .ant-form-item-label {
                line-height: 30px;

                label {
                    color:#15121F;
                    font-size: 16px;
                }
            }
        }

        .m-file {
            float:left;
            position: relative;
            width:317px;
            height:192px;
            background-color: #F6F6FC;
            user-select: none;
            overflow: hidden;

            &:not(:first-child) {
                margin-left:102px;
            }

            .tip {
                padding-top:102px;
                position:absolute;
                left:0;
                top:0;
                width:100%;
                height:100%;
                line-height:20px;
                color:#84838E;
                font-size: 16px;
                text-align: center;
                background:url("../../assets/driver/add_pht.png") no-repeat center 70px;
                background-size:24px;
                cursor: pointer;
            }

            .btn-upload {
                position:absolute;
                left:-100%;
                top:0;
                width:200%;
                height:100%;
                opacity: 0;
                cursor: pointer;
            }
        }
    }
}
</style>
