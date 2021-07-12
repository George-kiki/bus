<template>
<!-- 编辑司机 -->
<a-spin :spinning="loading.page" class="g-layoutEdit">
    <div class="header">
        <a-button type="primary" class="pull-right" @click="submitInfo" :loading="loading.submit" v-if="!isDisabled">提交</a-button>
        <a-button icon="caret-left" class="btn-back" @click="goPage('back')"></a-button>
        <span class="title">{{ getTitle }}</span>
    </div>
    <div class="content g-scroll">
        <a-form :form="detail.form" :colon="false" selfUpdate>
            <div class="detail">
                <div class="caption">基础信息</div>
                <a-row :gutter="102">
                    <a-col :span="6">
                        <a-form-item label="姓名">
                            <a-input placeholder="请输入" size="large" autocomplete="off"
                            :maxLength="10" 
                            :disabled="isDisabled"
                            v-decorator="[
                                'name',
                                {
                                    rules:[
                                        {required:true,message:'请输入姓名'}
                                    ]
                                }
                            ]"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="联系电话">
                            <a-input placeholder="请输入11位手机号" size="large" autocomplete="off"
                            :maxLength="11" 
                            :disabled="isDisabled"
                            v-decorator="[
                                'phone',
                                {
                                    validateTrigger:'blur',
                                    rules:[
                                        {required:true,message:'请输入联系电话'},
                                        {pattern:/^\d{11}$/,message:'请输入11位手机号'}
                                    ]
                                }
                            ]"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="短号">
                            <a-input placeholder="请输入" size="large" autocomplete="off"
                            :maxLength="10" 
                            :disabled="isDisabled"
                            v-decorator="[
                                'cornet',
                                {
                                    validateTrigger:'blur',
                                    rules:[
                                        {required:true,message:'请输入短号'},
                                        {pattern:/^\d{1,10}$/,message:'请输入数字'}
                                    ]
                                }
                            ]"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="所属组织">
                            <a-tree-select size="large" 
                            :disabled="isDisabled"
                            v-decorator="[
                                'officeId',
                                {
                                    rules:[
                                        {required:true,message:'请选择所属组织'}
                                    ]
                                }
                            ]"
                            :replaceFields="{
                                title:'name',
                                key:'id',
                                value:'id'
                            }"
                            :tree-data="list.organization"
                            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                            placeholder="请选择"
                            allow-clear
                            tree-default-expand-all>
                            </a-tree-select>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="102">
                    <a-col :span="6">
                        <a-form-item label="工号">
                            <a-input placeholder="请输入" size="large" autocomplete="off"
                            :maxLength="10"
                            :disabled="isDisabled"
                            v-decorator="[
                                'cardNo',
                                {
                                    validateTrigger:'blur',
                                    rules:[
                                        {required:true,message:'请输入工号'},
                                        {pattern:/^\d{1,10}$/,message:'请输入短号'}
                                    ]
                                }
                            ]"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="入职时间">
                            <a-date-picker placeholder="请选择" size="large" :disabled="isDisabled"
                            v-decorator="[
                                'hireDate'
                            ]"/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="紧急联系人">
                            <a-input placeholder="请输入" size="large" autocomplete="off"
                            :maxLength="10" 
                            :disabled="isDisabled"
                            v-decorator="[
                                'emergencyContact',
                                {
                                    rules:[
                                        {required:true,message:'请输入紧急联系人'}
                                    ]
                                }
                            ]"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="紧急联系电话">
                            <a-input placeholder="请输入11位手机号" size="large" autocomplete="off" 
                            :maxLength="11"
                            :disabled="isDisabled"
                            v-decorator="[
                                'emergencyContactPhone',
                                {
                                    validateTrigger:'blur',
                                    rules:[
                                        {required:true,message:'请输入紧急联系电话'},
                                        {pattern:/^\d{11}$/,message:'请输入11位手机号'}
                                    ]
                                }
                            ]"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="常住地址">
                            <a-input placeholder="请输入" size="large" autocomplete="off"
                            :maxLength="50"
                            :readOnly="isDisabled"
                            v-decorator="[
                                'address',
                                {
                                    rules:[
                                        {required:true,message:'请输入常住地址'}
                                    ]
                                }
                            ]"></a-input>
                        </a-form-item>
                    </a-col>
                </a-row>
            </div>
            <!-- <div class="detail">
                <div class="caption">新冠疫苗接种情况</div>
                <a-row :gutter="102">
                    <a-col :span="6">
                        <a-form-item label="新冠疫苗针次">
                            <a-select placeholder="请选择" mode="multiple" size="large"
                            :getPopupContainer="triggerNode => triggerNode.parentNode"
                            :disabled="isDisabled"
                            :options="$store.state.list.inoculationSeries"
                            v-decorator="[
                                'isCovidVaccine'
                            ]">
                            </a-select>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="102">
                    <a-col :span="6">
                        <a-form-item label="第一针接种时间">
                            <a-date-picker placeholder="请选择" size="large" :disabled="isDisabled"
                            v-decorator="[
                                'hireDate'
                            ]"/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="第二针接种时间">
                            <a-date-picker placeholder="请选择" size="large" :disabled="isDisabled"
                            v-decorator="[
                                'hireDate'
                            ]"/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="第三针接种时间">
                            <a-date-picker placeholder="请选择" size="large" :disabled="isDisabled"
                            v-decorator="[
                                'hireDate'
                            ]"/>
                        </a-form-item>
                    </a-col>
                </a-row>
            </div> -->
            <div class="detail">
                <div class="caption">身份证信息</div>
                <a-row :gutter="102">
                    <a-col :span="6">
                        <a-form-item label="身份证号">
                            <a-input placeholder="请输入" size="large" autocomplete="off" 
                            :maxLength="18" 
                            :disabled="isDisabled"
                            v-decorator="[
                                'idNumber',
                                {
                                    validateTrigger:'blur',
                                    rules:[
                                        {required:true,message:'请输入身份证号'},
                                        {pattern:/^\d{18}$/,message:'请输入18位身份证号'}
                                    ]
                                }
                            ]"></a-input>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-form-item label="身份证照片" required>
                    <a-row :gutter="102">
                        <a-col :span="6" v-for="(en,index) in detail.idImg" :key="index">
                            <div class="m-file" :class="{check:isDisabled,hasPht:en.url}">
                                <div class="tip">{{ en.tip }}</div>
                                <div class="g-pht">
                                    <input type="file" class="btn-upload" ref="idImg" @change="fileOperation('change','idImg',{type:'img',index})">
                                    <img :src="en.url" class="pht" @click="fileOperation('download','idImg',{index})">
                                </div>
                                <div class="btn-delete" @click="fileOperation('delete','idImg',{index})"></div>
                            </div>
                        </a-col>
                    </a-row>
                </a-form-item>
            </div>
            <div class="detail">
                <div class="caption">驾驶证信息</div>
                <a-row :gutter="102">
                    <a-col :span="6">
                        <a-form-item label="驾驶证类型">
                            <a-select placeholder="请选择" mode="multiple" size="large"
                            :getPopupContainer="triggerNode => triggerNode.parentNode"
                            :disabled="isDisabled"
                            :options="$store.state.list.driverLicenseType"
                            v-decorator="[
                                'driverLicenseType',
                                {
                                    rules:[
                                        {required:true,message:'请选择驾驶证类型'}
                                    ]
                                }
                            ]">
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="驾驶证号">
                            <a-input placeholder="请输入20位数字" autocomplete="off" size="large"
                            :maxLength="20" 
                            :disabled="isDisabled"
                            v-decorator="[
                                'driverLicenseNumber',
                                {
                                    validateTrigger:'blur',
                                    rules:[
                                        {required:true,message:'请输入驾驶证号'},
                                        {pattern:/^\d{1,20}$/,message:'请输入20位数字'}
                                    ]
                                }
                            ]"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="驾驶证到期时间">
                            <a-date-picker placeholder="请选择" size="large"
                            :allowClear="false"
                            :disabled="isDisabled"
                            v-decorator="[
                                'driverLicenseEffectDate',
                                {
                                    rules:[
                                        {required:true,message:'请选择驾驶证到期时间'}
                                    ]
                                }
                            ]"/>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-form-item label="驾驶证照片" required>
                    <a-row :gutter="102">
                        <a-col :span="6" v-for="(en,index) in detail.driverLicenseImg" :key="index">
                            <div class="m-file" :class="{check:isDisabled,hasPht:en.url}">
                                <div class="tip">{{ en.tip }}</div>
                                <div class="g-pht">
                                    <input type="file" class="btn-upload" ref="driverLicenseImg" @change="fileOperation('change','driverLicenseImg',{type:'img',index})">
                                    <img :src="en.url" class="pht" @click="fileOperation('download','driverLicenseImg',{index})">
                                </div>
                                <div class="btn-delete" @click="fileOperation('delete','driverLicenseImg',{index})"></div>
                            </div>
                        </a-col>
                    </a-row>
                </a-form-item>
            </div>
            <div class="detail">
                <div class="caption">从业资质证信息</div>
                <a-row :gutter="102">
                    <a-col :span="6">
                        <a-form-item label="从业资格证号">
                            <a-input placeholder="请输入20位数字" autocomplete="off" size="large"
                            :maxLength="20" 
                            :disabled="isDisabled"
                            v-decorator="[
                                'driverCertificationNumber',
                                {
                                    validateTrigger:'blur',
                                    rules:[
                                        {required:true,message:'请选择从业资格证号'},
                                        {pattern:/^\d{1,20}$/,message:'请输入20位数字'}
                                    ]
                                }
                            ]"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="从业资格证到期时间">
                            <a-date-picker placeholder="请选择" size="large" 
                            :allowClear="false"
                            :disabled="isDisabled"
                            v-decorator="[
                                'driverCertificationEffectDate',
                                {
                                    rules:[
                                        {required:true,message:'请选择驾驶证到期时间'}
                                    ]
                                }
                            ]"/>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-form-item label="从业资格证照片" required>
                    <a-row :gutter="102">
                        <a-col :span="6" v-for="(en,index) in detail.driverCertificationImg" :key="index">
                            <div class="m-file" :class="{check:isDisabled,hasPht:en.url}">
                                <div class="tip">{{ en.tip }}</div>
                                <div class="g-pht">
                                    <input type="file" class="btn-upload" ref="driverCertificationImg" @change="fileOperation('change','driverCertificationImg',{type:'img',index})">
                                    <img :src="en.url" class="pht" @click="fileOperation('download','driverCertificationImg',{index})">
                                </div>
                                <div class="btn-delete" @click="fileOperation('delete','driverCertificationImg',{index})"></div>
                            </div>
                        </a-col>
                    </a-row>
                </a-form-item>
            </div>
        </a-form>
    </div>
</a-spin>
</template>

<script>
import moment from 'moment';

export default {
    data() {
        return {
            page:{
                did:'', // 车辆编号
                status:'0', // 页面状态(0:新增,1:编辑,2:查看)
                from:'' // 页面来自于
            },
            loading:{
                page:false,
                submit:false,
                upload:false
            },
            detail:{    // 详情
                form:this.$form.createForm(this,{
                    disabled:true
                }),
                idImg:[{name:'',tip:'身份证国徽页',url:''},{name:'',tip:'身份证信息页',url:''}],   // 身份证正反面照片
                driverLicenseImg:[{name:'',tip:'驾驶证正面',url:''},{name:'',tip:'驾驶证反面',url:''}], // 驾驶证正反面照片
                driverCertificationImg:[{name:'',tip:'资格证正面',url:''},{name:'',tip:'资格证反面',url:''}]   // 从业资格证正反面照片
            },
            list:{
                organization:[],    // 组织树
                vehicleType:[]  // 车型
            }
        }
    },
    created() {
        Object.assign(this.page,this.$tabs.params);
    },
    mounted() {
        this.getDetail();
    },
    methods:{
        /**
         * 获取详情
         */
        getDetail() {
            this.loading.page = true;
            this.$api.batchAxios([
                {
                    method:"post",
                    url:this.$face.ORGANIZATION.list.getTenantOfficeTree,
                    params:{}
                },this.page.did?{
                    method:"post",
                    url:`${this.$face.DRIVER.edit.detailById}?id=${this.page.did}`,
                    params:{}
                }:null
            ].filter(val => val),data => {
                Object.assign(this.list,{
                    organization:data[0]
                });
                // 详情
                if(data[1]) {
                    let detail = data[1];
                    Object.assign(this.detail,{
                        idImg:this.$api.initAnnex(detail.idImg),
                        driverLicenseImg:this.$api.initAnnex(detail.driverLicenseImg),
                        driverCertificationImg:this.$api.initAnnex(detail.driverCertificationImg),
                    });
                    
                    this.detail.form.setFieldsValue({
                        name:detail.name, // 姓名
                        phone:detail.phone,   // 联系电话
                        cornet:detail.cornet, // 短号
                        officeId:detail.officeId, // 所属组织
                        cardNo:detail.cardNo, // 工号
                        hireDate:moment(detail.hireDate,"YYYY-MM-DD"), // 入职时间
                        emergencyContact:detail.emergencyContact, // 紧急联系人
                        emergencyContactPhone:detail.emergencyContactPhone,   // 紧急联系电话
                        address:detail.address,   // 常住地址
                        idNumber:detail.idNumber, // 身份证号
                        driverLicenseType:detail.driverLicenseType.split(","),   // 驾驶证类型
                        driverLicenseNumber:detail.driverLicenseNumber,   // 驾驶证号
                        driverLicenseEffectDate:moment(detail.driverLicenseEffectDate,"YYYY-MM-DD"),   // 驾驶证到期时间
                        driverCertificationNumber:detail.driverCertificationNumber,   // 从业资格证号
                        driverCertificationEffectDate:moment(detail.driverCertificationEffectDate,"YYYY-MM-DD"),   // 从业资格证到期时间
                    });
                }
            },err => {
            },() => {
                this.loading.page = false;
            });
        },
        /**
         * 文件操作
         * @param {String} type [操作类型]
         * @param {String} name [操作对象名称]
         * @param {Object} record [数据]
         */
        fileOperation(type,name,record = {}) {
            let {index,type:fileType} = record;
            switch(type) {
                case "change":  // 文件变更
                    let file;
                    if(record.index != void 0) {
                        file = this.$refs[name][record.index].files[0];    
                        this.$refs[name][record.index].value = '';    // 重置input[type=file]
                    } else {
                        file = this.$refs[name].files[0];
                        this.$refs[name].value = '';    // 重置input[type=file]
                    }
                    
                    if(!file) {
                        return;
                    }

                    switch(fileType) {
                        case "img": // 图片
                            if(!/jpeg|png|jpg|bmp/.test(file.type.toLowerCase())) {
                                this.$message.error("仅支持png、jpg、bmp");
                                return;
                            }
                        break;
                    }

                    if(file.size > 5242880) {
                        this.$message.error("正反面照片，不超过5M");
                        return;
                    }

                    let formData = new FormData();
                    formData.append("file",file);
                    this.loading.upload = true;
                    this.$api.post(this.$face.BASE.basis.oneUpload,formData
                    ,data => {
                        if(record.index != void 0) {
                            Object.assign(this.detail[name][record.index],{
                                url:`${data.uploadUrl}/${data.fileName}`,
                                name:file.name
                            });
                        } else {
                            this.detail[name].push({
                                url:`${data.uploadUrl}/${data.fileName}`,
                                name:file.name
                            });
                        }
                    },err => {
                    },() => {
                        this.loading.upload = false;
                    });
                break;
                case "delete":  // 删除
                    if(record.index != void 0) {
                        Object.assign(this.detail[name][record.index],{
                            url:'',
                            name:''
                        });
                    } else {
                        this.detail[name].splice(index,1);
                    }
                break;
                case "download":    // 下载
                    if(/jpeg|png|jpg|bmp$/.test(this.detail[name][index].name)) {
                        this.$preview.showPreview(this.detail[name][index].url);
                    } else {
                        this.$api.downLoadFile(this.detail[name][index].url);
                    }
                break;
            }
        },
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
         * 提交信息
         */
        submitInfo() {
            let {detail} = this;

            detail.form.validateFields((error,values) => {
                if(!error) {
                    let message;

                    if(detail.idImg.find(val => !val.url)) {
                        message = "请完善身份证照片";
                    } else if(detail.driverLicenseImg.find(val => !val.url)) {
                        message = "请完善驾驶证照片";
                    } else if(detail.driverCertificationImg.find(val => !val.url)) {
                        message = "请完善从业资格证照片";
                    }

                    if(message) {
                        this.$message.error(message)
                        return;
                    }

                    this.loading.submit = true;
                    this.$api.post(this.$face.DRIVER.edit.saveOrUpdateMsTenantDriver,Object.assign(values,{
                        id:this.page.did,
                        idImg:detail.idImg.map(val => `${val.url}*${val.name}`).join("|"), // 身份证正反面照片
                        driverLicenseImg:detail.idImg.map(val => `${val.url}*${val.name}`).join("|"), // 驾驶证正反面照片
                        driverCertificationImg:detail.idImg.map(val => `${val.url}*${val.name}`).join("|"), // 从业资格证正反面照片
                        hireDate:values.hireDate?values.hireDate.format("YYYY-MM-DD"):'',  // 入职时间
                        driverLicenseEffectDate:values.driverLicenseEffectDate?values.driverLicenseEffectDate.format("YYYY-MM-DD"):'',    // 驾驶证到期时间
                        driverCertificationEffectDate:values.driverCertificationEffectDate?values.driverCertificationEffectDate.format("YYYY-MM-DD"):'',  // 从业资格证到期时间
                        driverLicenseType:values.driverLicenseType.join(",")  // 驾驶证类型
                    }),data => {
                        this.$message.success("提交成功");
                        this.goPage('back');
                    },err => {
                    },() => {
                        this.loading.submit = true;
                    });
                }
            });
        },
        /**
         * 页面跳转
         * @param {String} type [跳转类型]
         */
        goPage(type) {
            switch(type) {
                case "back": // 回退
                    this.$tabs.close({
                        goProps:this.page.from
                    });
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

<style>
</style>
