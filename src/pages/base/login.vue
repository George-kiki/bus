<template>
<div class="m-login">
    <div class="pht-content">
        <img src="../../assets/login/bg.png" class="pht">
    </div>
    <div class="content">
        <div class="title">登录</div>
        <a-form :form="loginForm.form" class="detail">
            <input type="text" class="special">
            <input type="password" class="special">
            <a-form-item>
                <a-input autocomplete="off" placeholder="请输入账号"
                class="user"
                v-decorator="[
                    'name',
                    {
                        rules:[
                            {required:true,message:'请输入账号'}
                        ]
                    }
                ]"></a-input>
            </a-form-item>
            <a-form-item>
                <a-input autocomplete="off" placeholder="请输入密码"
                class="pwd"
                type="password"
                v-decorator="[
                    'pwd',
                    {
                        rules:[
                            {required:true,message:'请输入密码'}
                        ]
                    }
                ]"></a-input>
            </a-form-item>
            <a-form-item>
                <a-input autocomplete="off" placeholder="请输入验证码"
                @keyup.enter="submitForm"
                class="code"
                v-decorator="[
                    'check',
                    {
                        rules:[
                            {required:true,message:'请输入验证码'}
                        ]
                    }
                ]"></a-input>
                <a-spin :spinning="loading.authCode" class="authCode">
                    <img class="checkPht" :src="checkPht" @click="getAuthCode">
                </a-spin>
            </a-form-item>
        </a-form>
        <a-button class="btn-login" type='primary' @click="submitForm" :loading="loginForm.loading">登录</a-button>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            loading:{
                authCode:false  // 验证码
            },
            loginForm:{
                form:this.$form.createForm(this),
                loading:false,  // 提交loading图标
                name:'',    // 用户名
                pwd:'', // 密码
                check:''  // 验证码
            },
            checkPht:'',    // 验证码图片
            codeId:''   // 验证码id
        }
    },
    created() {
        // 直接刷新页面，可用于跳转到登录页同时刷新已经存储的仓库数据防止共享数据
        if(this.$route.params.isReload) {
            window.location.reload();
        }

        this.getAuthCode();
    },
    methods:{
        /**
         * 表单提交
         */
        submitForm() {
            this.loginForm.form.validateFields((err,values) => {
                if(err) {
                    return false;
                } else {
                    this.loginForm.loading = true;
                    this.$api.post(this.$face.BASE.login.doLogin,{
                        loginName:values.name,
                        password:values.pwd,
                        authCode:values.check,
                        codeId:this.codeId
                    },data => {
                        this.$message.success("登录成功");
                        // 保存用户信息
                        window.localStorage["userInfo"] = JSON.stringify(data);
                        // 跳转界面
                        this.$router.push({name:'managerFrame'});
                    },err => {
                        this.loginForm.form.setFieldsValue({check:''});
                        this.getAuthCode();
                        this.loginForm.loading = false;
                    });
                }
            });
        },
        /**
         * 获取校验码
         */
        getAuthCode() {
            let date = new Date();

            this.loading.authCode = true;
            this.codeId = `${date.getFullYear()}${date.getMonth()+1}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}${date.getMilliseconds()}${parseInt(Math.random()*9000+1000)}`;
            this.$api.post(this.$face.BASE.login.getAuthCode,{
                codeId:this.codeId
            },data => {
                this.loading.authCode = false;
                this.checkPht = `data:image/jpg;base64,${data.imgBase64}`;
            },err => {
                this.loading.authCode = false;
            });
        }
    }
}
</script>

<style lang="less">
.m-login {
    position:absolute;
    top:50%;
    left:50%;
    height:460px;
    width: 1121px;
    transform: translate(-50%,-50%);
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;

    .pht-content {
        float:left;
        width:708px;
        height: 100%;

        .pht {
            float:left;
            width:100%;
            border-radius: 8px 0 0 8px;
        }
    }

    .content {
        float:left;
        padding:55px 48px 0 48px;
        width:413px;
        height:100%;
        background:url("../../assets/login/logo.png") no-repeat 55px 48px;
        background-size: 53px;
        border-radius: 0 8px 8px 0;

        .title {
            padding-left:69px;
            color:#15121F;
            font-size: 32px;
            font-weight: 500;
            line-height: 42px;
        }

        .detail {
            margin-top:30px;
        }

        .ant-input {
            padding-left:44px;
            height:48px;
            line-height: 48px;
            border:none;
            box-shadow: none;

            &.user {
                background:#F6F6FC url("../../assets/login/login_icon.png") no-repeat 16px 14px;
                background-size: 20px;
            }

            &.pwd {
                background:#F6F6FC url("../../assets/login/login_icon.png") no-repeat 16px -31px;
                background-size: 20px;
            }

            &.code {
                background:#F6F6FC url("../../assets/login/login_icon.png") no-repeat 16px -73px;
                background-size: 20px;
            }
        }

        .ant-form-item {
            position: relative;
        }

        .checkPht {
            width:100px;
            height:40px;
            border-radius: 8px;
        }

        .authCode {
            position: absolute;
            right:4px;
            top:-11px;
        }

        .btn-login {
            width:100%;
            height:48px;
            line-height:48px;
            font-size: 16px;
            border-radius: 8px;
        }

        .special {
            position:absolute;
            opacity: 0;
            top:-100%;
            left:-100%;
        }
    }
}
</style>