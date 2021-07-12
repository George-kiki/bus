<template>
<!-- 编辑车辆 -->
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
                        <a-form-item label="车牌号">
                            <a-input placeholder="请输入" size="large" autocomplete="off"
                            :maxLength="10" 
                            :disabled="isDisabled"
                            v-decorator="[
                                'numberPlate',
                                {
                                    rules:[
                                        {required:true,message:'请输入车牌号'}
                                    ]
                                }
                            ]"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="车辆型号">
                            <a-select placeholder="请选择" size="large" 
                            :disabled="isDisabled"
                            :getPopupContainer="triggerNode => triggerNode.parentNode"
                            :dropdownMatchSelectWidth="false"
                            @change="changeVehicleType"
                            v-decorator="[
                                'vehicleTypeId',
                                {
                                    rules:[
                                        {required:true,message:'请选择车辆型号'}
                                    ]
                                }
                            ]">
                                <a-select-option v-for="en in list.vehicleType" :key="en.id" :value="en.id" :seatNumber="en.seatNumber">{{ en.name }}</a-select-option>
                            </a-select>
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
                    <a-col :span="6">
                        <a-form-item label="座位数">
                            <a-input-number size="large" disabled
                            v-decorator="[
                                'seatsCount'
                            ]"></a-input-number>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="102">
                    <a-col :span="6">
                        <a-form-item label="车辆自编号">
                            <a-input placeholder="请输入" size="large" autocomplete="off" allowClear
                            :maxLength="10"
                            :disabled="isDisabled"
                            v-decorator="[
                                'vehicleNumber',
                                {
                                    validateTrigger:'blur',
                                    rules:[
                                        {pattern:/^[a-zA-z0-9]{0,10}$/,message:'请输入车辆自编号'}
                                    ]
                                }
                            ]"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="行驶证登记时间">
                            <a-date-picker placeholder="请选择" size="large" 
                            :allowClear="false"
                            :disabled="isDisabled"
                            v-decorator="[
                                'drivingLicenceDate',
                                {
                                    rules:[
                                        {required:true,message:'请选择行驶证登记时间'}
                                    ]
                                }
                            ]"/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="营运证登记时间">
                            <a-date-picker placeholder="请选择" size="large" 
                            :allowClear="false"
                            :disabled="isDisabled"
                            v-decorator="[
                                'operationRegisterDate',
                                {
                                    rules:[
                                        {required:true,message:'请选择营运证登记时间'}
                                    ]
                                }
                            ]"/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="营运证年审有效期">
                            <a-date-picker placeholder="请选择" size="large" 
                            :allowClear="false"
                            :disabled="isDisabled"
                            v-decorator="[
                                'operationExaminedDate',
                                {
                                    rules:[
                                        {required:true,message:'请选择营运证年审有效期'}
                                    ]
                                }
                            ]"/>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="102">
                    <a-col :span="6">
                        <a-form-item label="车辆营运许可范围">
                            <a-select placeholder="请选择" size="large" allowClear
                            :disabled="isDisabled"
                            :options="$store.state.list.vehicleOperationScope"
                            v-decorator="[
                                'operationScope'
                            ]">
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="大架号">
                            <a-input placeholder="请输入" size="large" autocomplete="off" allowClear
                            :maxLength="10"
                            :disabled="isDisabled"
                            v-decorator="[
                                'fightNumber',
                                {
                                    validateTrigger:'blur',
                                    rules:[
                                        {pattern:/^[a-zA-z0-9]{0,10}$/,message:'请输入车辆自编号'}
                                    ]
                                }
                            ]"></a-input>
                        </a-form-item>
                    </a-col>
                </a-row>
            </div>
            <div class="detail">
                <div class="caption">道路运输证</div>
                <a-row :gutter="102">
                    <a-col :span="6">
                        <a-form-item label="道路运输证号">
                            <a-input placeholder="请输入" size="large" autocomplete="off" 
                            :maxLength="20" 
                            :disabled="isDisabled"
                            v-decorator="[
                                'roadCarriageNumber',
                                {
                                    validateTrigger:'blur',
                                    rules:[
                                        {required:true,message:'请输入道路运输证号'},
                                        {pattern:/^\d{1,20}$/,message:'请输入20位数字'}
                                    ]
                                }
                            ]"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="道路运输证有效期">
                            <a-date-picker placeholder="请选择" size="large" 
                            :allowClear="false"
                            :disabled="isDisabled"
                            v-decorator="[
                                'roadCarriageValidityDate',
                                {
                                    rules:[
                                        {required:true,message:'请选择道路运输证有效期'}
                                    ]
                                }
                            ]"/>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-form-item label="道路运输证照片" required>
                    <a-row :gutter="102">
                        <a-col :span="6" v-for="(en,index) in detail.roadCarriageImg" :key="index">
                            <div class="m-file" :class="{check:isDisabled,hasPht:en.url}">
                                <div class="tip">{{ en.tip }}</div>
                                <div class="g-pht">
                                    <input type="file" class="btn-upload" ref="roadCarriageImg" @change="fileOperation('change','roadCarriageImg',{type:'img',index})">
                                    <img :src="en.url" class="pht" @click="fileOperation('download','roadCarriageImg',{index})">
                                </div>
                                <div class="btn-delete" @click="fileOperation('delete','roadCarriageImg',{index})"></div>
                            </div>
                        </a-col>
                    </a-row>
                </a-form-item>
            </div>
            <div class="detail">
                <div class="caption">车辆行驶证</div>
                <a-row :gutter="102">
                    <a-col :span="6">
                        <a-form-item label="车辆行驶证号">
                            <a-input placeholder="请输入20位数字" autocomplete="off" size="large"
                            :maxLength="20" 
                            :disabled="isDisabled"
                            v-decorator="[
                                'drivingLicenceNumber',
                                {
                                    validateTrigger:'blur',
                                    rules:[
                                        {required:true,message:'请输入车辆行驶证号'},
                                        {pattern:/^\d{1,20}$/,message:'请输入20位数字'}
                                    ]
                                }
                            ]"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="车辆行驶证有效期">
                            <a-date-picker placeholder="请选择" size="large"
                            :allowClear="false"
                            :disabled="isDisabled"
                            v-decorator="[
                                'drivingLicenceValidityDate',
                                {
                                    rules:[
                                        {required:true,message:'请选择车辆行驶证有效期'}
                                    ]
                                }
                            ]"/>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-form-item label="车辆行驶证照片" required>
                    <a-row :gutter="102">
                        <a-col :span="6" v-for="(en,index) in detail.drivingLicenceImg" :key="index">
                            <div class="m-file" :class="{check:isDisabled,hasPht:en.url}">
                                <div class="tip">{{ en.tip }}</div>
                                <div class="g-pht">
                                    <input type="file" class="btn-upload" ref="drivingLicenceImg" @change="fileOperation('change','drivingLicenceImg',{type:'img',index})">
                                    <img :src="en.url" class="pht" @click="fileOperation('download','drivingLicenceImg',{index})">
                                </div>
                                <div class="btn-delete" @click="fileOperation('delete','drivingLicenceImg',{index})"></div>
                            </div>
                        </a-col>
                    </a-row>
                </a-form-item>
            </div>
            <div class="detail">
                <div class="caption">班车客运标志牌</div>
                <a-row :gutter="102">
                    <a-col :span="6">
                        <a-form-item label="班车客运标志牌有效期">
                            <a-date-picker placeholder="请选择" size="large"
                            :allowClear="false"
                            :disabled="isDisabled"
                            v-decorator="[
                                'trafficSignValidityDate',
                                {
                                    rules:[
                                        {required:true,message:'请选择班车客运标志牌有效期'}
                                    ]
                                }
                            ]"/>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-form-item label="标志牌照片" required>
                    <a-row :gutter="102">
                        <a-col :span="6" v-for="(en,index) in detail.trafficSignImg" :key="index">
                            <div class="m-file" :class="{check:isDisabled,hasPht:en.url}">
                                <div class="tip">{{ en.tip }}</div>
                                <div class="g-pht">
                                    <input type="file" class="btn-upload" ref="trafficSignImg" @change="fileOperation('change','trafficSignImg',{type:'img',index})">
                                    <img :src="en.url" class="pht" @click="fileOperation('download','trafficSignImg',{index})">
                                </div>
                                <div class="btn-delete" @click="fileOperation('delete','trafficSignImg',{index})"></div>
                            </div>
                        </a-col>
                    </a-row>
                </a-form-item>
            </div>
            <div class="detail">
                <div class="caption">车辆保险信息</div>
                <a-row :gutter="102">
                    <a-col :span="6">
                        <a-form-item label="强制险到期时间">
                            <a-date-picker placeholder="请选择" size="large"
                            :allowClear="false"
                            :disabled="isDisabled"
                            v-decorator="[
                                'forceInsuranceEndDate',
                                {
                                    rules:[
                                        {required:true,message:'请选择强制险到期时间'}
                                    ]
                                }
                            ]"/>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-form-item label="强制险照片" required>
                    <a-row :gutter="102">
                        <a-col :span="6" v-for="(en,index) in detail.forceInsuranceImg" :key="index">
                            <div class="m-file" :class="{check:isDisabled,hasPht:en.url}">
                                <div class="tip">{{ en.tip }}</div>
                                <div class="g-pht">
                                    <input type="file" class="btn-upload" ref="forceInsuranceImg" @change="fileOperation('change','forceInsuranceImg',{type:'img',index})">
                                    <img :src="en.url" class="pht" @click="fileOperation('download','forceInsuranceImg',{index})">
                                </div>
                                <div class="btn-delete" @click="fileOperation('delete','forceInsuranceImg',{index})"></div>
                            </div>
                        </a-col>
                    </a-row>
                </a-form-item>
                <a-row :gutter="102">
                    <a-col :span="6">
                        <a-form-item label="商业险到期时间">
                            <a-date-picker placeholder="请选择" size="large"
                            :allowClear="false"
                            :disabled="isDisabled"
                            v-decorator="[
                                'businessInsuranceEndDate',
                                {
                                    rules:[
                                        {required:true,message:'请选择商业险到期时间'}
                                    ]
                                }
                            ]"/>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-form-item label="商业险照片" required>
                    <a-row :gutter="102">
                        <a-col :span="6" v-for="(en,index) in detail.businessInsuranceImg" :key="index">
                            <div class="m-file" :class="{check:isDisabled,hasPht:en.url}">
                                <div class="tip">{{ en.tip }}</div>
                                <div class="g-pht">
                                    <input type="file" class="btn-upload" ref="businessInsuranceImg" @change="fileOperation('change','businessInsuranceImg',{type:'img',index})">
                                    <img :src="en.url" class="pht" @click="fileOperation('download','businessInsuranceImg',{index})">
                                </div>
                                <div class="btn-delete" @click="fileOperation('delete','businessInsuranceImg',{index})"></div>
                            </div>
                        </a-col>
                    </a-row>
                </a-form-item>
                <a-row :gutter="102">
                    <a-col :span="6">
                        <a-form-item label="承运人责任险到期时间">
                            <a-date-picker placeholder="请选择" size="large"
                            :allowClear="false"
                            :disabled="isDisabled"
                            v-decorator="[
                                'responsibilityInsuranceEndDate',
                                {
                                    rules:[
                                        {required:true,message:'请选择承运人责任险到期时间'}
                                    ]
                                }
                            ]"/>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-form-item label="承运人责任险照片" required>
                    <a-row :gutter="102">
                        <a-col :span="6" v-for="(en,index) in detail.responsibilityInsuranceImg" :key="index">
                            <div class="m-file" :class="{check:isDisabled,hasPht:en.url}">
                                <div class="tip">{{ en.tip }}</div>
                                <div class="g-pht">
                                    <input type="file" class="btn-upload" ref="responsibilityInsuranceImg" @change="fileOperation('change','responsibilityInsuranceImg',{type:'img',index})">
                                    <img :src="en.url" class="pht" @click="fileOperation('download','responsibilityInsuranceImg',{index})">
                                </div>
                                <div class="btn-delete" @click="fileOperation('delete','responsibilityInsuranceImg',{index})"></div>
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
                vid:'', // 车辆编号
                status:'0', // 页面状态(0:新增,1:编辑,2:查看)
                from:'' // 页面来自于
            },
            loading:{
                page:false,
                submit:false,
                upload:false
            },
            detail:{    // 详情
                form:this.$form.createForm(this),
                roadCarriageImg:[{name:'',tip:'运输证正面',url:''},{name:'',tip:'运输证反面',url:''}],   // 道路运输证照片
                drivingLicenceImg:[{name:'',tip:'行驶证正面',url:''},{name:'',tip:'行驶证反面',url:''}], // 车辆行驶证照片
                trafficSignImg:[{name:'',tip:'标志牌正面',url:''},{name:'',tip:'标志牌反面',url:''}],   // 班车客运标志牌照片
                forceInsuranceImg:[{name:'',tip:'强制险正面',url:''},{name:'',tip:'强制险反面',url:''}],   // 强制险照片
                businessInsuranceImg:[{name:'',tip:'商业险正面',url:''},{name:'',tip:'商业险反面',url:''}],   // 商业险照片
                responsibilityInsuranceImg:[{name:'',tip:'承运人责任险正面',url:''},{name:'',tip:'承运人责任险反面',url:''}],   // 承运人责任险照片
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
                },{
                    method:"post",
                    url:this.$face.VEHICLE.typeList.findPage,
                    params:{
                        page:1,
                        rows:10000
                    }
                },this.page.did?{
                    method:"post",
                    url:`${this.$face.VEHICLE.editVehicle.detailById}?id=${this.page.did}`,
                    params:{}
                }:null
            ].filter(val => val),data => {
                Object.assign(this.list,{
                    organization:data[0],
                    vehicleType:data[1].list
                });

                // 详情
                if(data[2]) {
                    let detail = data[2];
                    Object.assign(this.detail,{
                        roadCarriageImg:this.$api.initAnnex(detail.roadCarriageImg),
                        drivingLicenceImg:this.$api.initAnnex(detail.drivingLicenceImg),
                        trafficSignImg:this.$api.initAnnex(detail.trafficSignImg),
                        forceInsuranceImg:this.$api.initAnnex(detail.forceInsuranceImg),
                        businessInsuranceImg:this.$api.initAnnex(detail.businessInsuranceImg),
                        responsibilityInsuranceImg:this.$api.initAnnex(detail.responsibilityInsuranceImg)
                    });
                    
                    this.detail.form.setFieldsValue({
                        numberPlate:detail.numberPlate,
                        vehicleTypeId:detail.vehicleTypeId,
                        officeId:detail.officeId,
                        seatsCount:detail.seatsCount,
                        vehicleNumber:detail.vehicleNumber,
                        drivingLicenceDate:moment(detail.drivingLicenceDate,"YYYY-MM-DD"),
                        operationRegisterDate:moment(detail.operationRegisterDate,"YYYY-MM-DD"),
                        operationExaminedDate:moment(detail.operationExaminedDate,"YYYY-MM-DD"),
                        operationScope:detail.operationScope,
                        fightNumber:detail.fightNumber,
                        roadCarriageNumber:detail.roadCarriageNumber,
                        roadCarriageValidityDate:moment(detail.roadCarriageValidityDate,"YYYY-MM-DD"),
                        drivingLicenceNumber:detail.drivingLicenceNumber,
                        drivingLicenceValidityDate:moment(detail.drivingLicenceValidityDate,"YYYY-MM-DD"),
                        trafficSignValidityDate:moment(detail.trafficSignValidityDate,"YYYY-MM-DD"),
                        forceInsuranceEndDate:moment(detail.forceInsuranceEndDate,"YYYY-MM-DD"),
                        businessInsuranceEndDate:moment(detail.businessInsuranceEndDate,"YYYY-MM-DD"),
                        responsibilityInsuranceEndDate:moment(detail.responsibilityInsuranceEndDate,"YYYY-MM-DD")
                    });
                }
            },err => {
            },() => {
                this.loading.page = false;
            });
        },
        /**
         * 变更车辆型号
         * @param {Number} id [编号]
         * @param {VNode} node [选中的节点]
         */
        changeVehicleType(id,node) {
            this.detail.form.setFieldsValue({
                seatsCount:parseInt(node.data.attrs.seatNumber)
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
            debugger;
            let {detail} = this;

            detail.form.validateFields((error,values) => {
                if(!error) {
                    let message;

                    if(detail.roadCarriageImg.find(val => !val.url)) {
                        message = "请完善运输证照片";
                    } else if(detail.drivingLicenceImg.find(val => !val.url)) {
                        message = "请完善行驶证照片";
                    } else if(detail.trafficSignImg.find(val => !val.url)) {
                        message = "请完善标志牌照片";
                    } else if(detail.forceInsuranceImg.find(val => !val.url)) {
                        message = "请完善强制险照片";
                    } else if(detail.businessInsuranceImg.find(val => !val.url)) {
                        message = "请完善商业险照片";
                    } else if(detail.responsibilityInsuranceImg.find(val => !val.url)) {
                        message = "请完善承运人责任险照片";
                    }

                    if(message) {
                        this.$message.error(message)
                        return;
                    }

                    this.loading.submit = true;
                    this.$api.post(this.$face.VEHICLE.editVehicle[this.page.did?'update':'save'],Object.assign(values,{
                        id:this.page.did,
                        roadCarriageImg:detail.roadCarriageImg.map(val => `${val.url}*${val.name}`).join("|"),  // 运输证照片
                        drivingLicenceImg:detail.drivingLicenceImg.map(val => `${val.url}*${val.name}`).join("|"),  // 行驶证照片
                        trafficSignImg:detail.trafficSignImg.map(val => `${val.url}*${val.name}`).join("|"),    // 标志牌照片
                        forceInsuranceImg:detail.forceInsuranceImg.map(val => `${val.url}*${val.name}`).join("|"),  // 强制险照片
                        businessInsuranceImg:detail.businessInsuranceImg.map(val => `${val.url}*${val.name}`).join("|"),    // 商业险照片
                        responsibilityInsuranceImg:detail.responsibilityInsuranceImg.map(val => `${val.url}*${val.name}`).join("|"),    // 承运人责任险照片
                        drivingLicenceDate:values.drivingLicenceDate?values.drivingLicenceDate.format("YYYY-MM-DD"):'',  // 行驶证登记时间
                        operationRegisterDate:values.operationRegisterDate?values.operationRegisterDate.format("YYYY-MM-DD"):'',    // 营运证登记时间
                        operationExaminedDate:values.operationExaminedDate?values.operationExaminedDate.format("YYYY-MM-DD"):'',    // 营运证年审有效期
                        roadCarriageValidityDate:values.roadCarriageValidityDate?values.roadCarriageValidityDate.format("YYYY-MM-DD"):'',  // 道路运输证有效期
                        drivingLicenceValidityDate:values.drivingLicenceValidityDate?values.drivingLicenceValidityDate.format("YYYY-MM-DD"):'',  // 车辆行驶证有效期
                        trafficSignValidityDate:values.trafficSignValidityDate?values.trafficSignValidityDate.format("YYYY-MM-DD"):'',    // 班车客运标志牌有效期
                        forceInsuranceEndDate:values.forceInsuranceEndDate?values.forceInsuranceEndDate.format("YYYY-MM-DD"):'',    // 强制险到期时间
                        businessInsuranceEndDate:values.businessInsuranceEndDate?values.businessInsuranceEndDate.format("YYYY-MM-DD"):'',  // 商业险到期时间
                        responsibilityInsuranceEndDate:values.responsibilityInsuranceEndDate?values.responsibilityInsuranceEndDate.format("YYYY-MM-DD"):''   // 承运人责任险到期时间
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
                    return "新增车辆";
                case "1":
                    return "编辑车辆";
                case "2":
                    return "查看车辆";
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
