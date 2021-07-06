<template>
<!-- 车辆列表 -->
<div class="m-basisList">
    <div class="g-header">
        <div class="btn-group">
            <button class="btn btn-add" @click="goPage('add')"></button>
        </div>
        <a-form layout="inline" :form="searchForm.form">
            <a-form-item>
                <a-input placeholder="车牌号" autocomplete="off" allowClear
                @input="() => { return getListDebounce(1) }"
                v-decorator="[
                    'numberPlate'
                ]"></a-input>
            </a-form-item>
            <a-form-item>
                <a-select placeholder="请选择车型" allowClear
                v-decorator="[
                    'vehicleTypeId'
                ]">
                    <a-select-option v-for="en in list.vehicleType" :key="en.id">{{ en.name }}</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item>
                <a-select placeholder="请选择车况" allowClear
                v-decorator="[
                    'vehicleCondition'
                ]">
                    <a-select-option v-for="en in list.vehicleCondition" :key="en.value">{{ en.label }}</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item>
                <a-select placeholder="请选择状态" allowClear
                v-decorator="[
                    'isEnable'
                ]">
                    <a-select-option v-for="en in [{label:'启用',value:'1'},{label:'禁用',value:'0'}]" :key="en.value">{{ en.label }}</a-select-option>
                </a-select>
            </a-form-item>
        </a-form>
    </div>
    <div class="content">
        <a-table size="small" class="g-basisTable" rowKey="id"
        :loading="loading.table"
        :columns="columns"
        :data-source="tableData"
        :pagination="pagination"
        @change="getList"
        @showSizeChange="getList">
            <template slot="status" slot-scope="record">
                <a-switch :checked="record.isEnable == '1'" @change="vehicleOperation('changeStatus',record)"/>
            </template>
            <template slot="action" slot-scope="record">
                <a-button-group size="small">
                    <a-button type="link" @click="goPage('check',record)">查看</a-button>
                    <a-button type="link" @click="goPage('edit',record)">修改</a-button>
                    <a-button type="link" @click="vehicleOperation('service',record)" v-if="record.vehicleCondition == '1'">维修</a-button>
                    <a-button type="link" @click="vehicleOperation('serviceFinsh',record)" v-else>维修结束</a-button>
                </a-button-group>
            </template>
        </a-table>
    </div>
    <!-- 编辑车辆 -->
    <a-modal
    :title="editVehicle.title"
    class="m-basisEditVehicle"
    width="349px"
    :visible="editVehicle.show"
    :maskClosable="false"
    @cancel="editVehicle.show = false;">
        <a-form :form="editVehicle.form" :colon="false" class="g-basisForm">
            <a-form-item label="车牌号" prop="numberPlate">
                <a-input placeholder="请输入10个字以内" :maxLength="10" autocomplete="off"
                v-decorator="[
                    'numberPlate',
                    {
                        rules:[
                            {required:true}
                        ]
                    }
                ]"></a-input>
            </a-form-item>
            <a-form-item label="车辆型号" prop="vehicleTypeId">
                <a-select placeholder="请选择车型" allowClear
                v-decorator="[
                    'vehicleTypeId',
                    {
                        rules:[
                            {required:true}
                        ]
                    }
                ]">
                    <a-select-option v-for="en in list.vehicleType" :key="en.id">{{ en.name }}</a-select-option>
                </a-select>
            </a-form-item>
        </a-form>
        <template slot="footer">
            <a-button type="default" class="btn btn-cancel" @click="editVehicle.show = false;">取消</a-button>
            <a-button type="primary" class="btn btn-submit" @click="submitInfo" :loading="editVehicle.submitLoading">确定</a-button>
        </template>
    </a-modal>
    <!-- 维修 -->
    <a-modal
    title="维修"
    width="560px"
    :visible="service.show"
    :maskClosable="false"
    @cancel="service.show = false;">
        <a-form :form="service.form" :colon="false" class="g-basisForm">
            <a-form-item label="时间" prop="date">
                <a-range-picker
                :show-time="{ format: 'HH:mm' }"
                :disabled-date="disabledDate"
                format="YYYY-MM-DD HH:mm"
                v-decorator="[
                    'date',
                    {
                        rules:[
                            {required:true}
                        ]
                    }
                ]">
                </a-range-picker>
            </a-form-item>
        </a-form>
        <template slot="footer">
            <a-button type="default" class="btn btn-cancel" @click="service.show = false;">取消</a-button>
            <a-button type="primary" class="btn btn-submit" @click="vehicleOperation('submitService')" :loading="service.submitLoading">确定</a-button>
        </template>
    </a-modal>
</div>
</template>

<script>
import debounce from 'lodash/debounce'; // 防抖
import moment from 'moment';

export default {
    data() {
        return {
            loading:{
                table:false
            },
            columns:[
                {
                    title:'车牌号',
                    dataIndex:'numberPlate'
                },{
                    title:'车辆型号',
                    dataIndex:'vehicleTypeLabel'
                },{
                    title:'座位数',
                    dataIndex:'seatNumber'
                },{
                    title:'服务区域',
                    dataIndex:'regionLabel'
                },{
                    title:'车况',
                    dataIndex:'vehicleConditionStr'
                },{
                    title:'状态',
                    scopedSlots: { customRender: 'status' }
                },{
                    title:'操作',
                    width:'170px',
                    scopedSlots: { customRender: 'action' }
                }
            ],
            tableData:[],
            getListDebounce:debounce(this.getList,300),
            pagination:{
                current:1,
                defaultCurrent:1,   // 默认当前页
                total:0,    // 总数
                defaultPageSize:this.$store.state.padding.size[0],  // 默认每页条数
                pageSize:this.$store.state.padding.size[0],
                showQuickJumper:true,   // 可以快速跳转至某页
                pageSizeOptions:Array.from(this.$store.state.padding.size,val => { return String(val); }), // 指定每页可以显示多少条
                showTotal:total => `共 ${total} 条记录 第${this.pagination.current}/${Math.ceil(total/this.pagination.pageSize)}页`
            },
            searchForm:{
                form:this.$form.createForm(this,{
                    onFieldsChange:(props,values) => {
                        (values.hasOwnProperty('vehicleTypeId') || values.hasOwnProperty('vehicleCondition') || values.hasOwnProperty('isEnable')) && this.getList(1);
                    }
                })
            },
            editVehicle:{   // 编辑车辆
                show:false,
                submitLoading:false,
                vid:null,   // 编号
                title:'',   // 标题
                form:this.$form.createForm(this)
            },
            service:{   // 车辆维修
                show:false,
                submitLoading:false,
                vid:null,   // 编号
                form:this.$form.createForm(this)
            },
            list:{
                vehicleCondition:[{label:'正常使用',value:'1'},{label:'维修',value:'2'}],    // 车况
                vehicleType:[]  // 车型列表
            }
        }
    },
    created() {
        // this.getVehicleType();
        // this.getList();
    },
    methods:{
        /**
         * 获取车型列表
         */
        getVehicleType() {
            this.$api.post(this.$face.VEHICLE.typeList.findPage,{
                page:1,
                rows:10000
            },data => {
                this.list.vehicleType = data.list;
            },err => {
            });
        },
        /**
         * 获取列表数据
         * @param {Object || Number} 翻页控件参数 [可能为Object或者Number]
         */
        getList(obj) {
            if(obj != void 0) {
                if(~Object.prototype.toString.call(obj).indexOf("Object")) {
                    // 对象
                    let {current,pageSize} = obj;
                    Object.assign(this.pagination,{
                        current,
                        pageSize
                    });
                } else if(~Object.prototype.toString.call(obj).indexOf("Number")) {
                    // 数字
                    this.pagination.current = obj;
                }
            }

            this.loading.table = true;
            let param = this.searchForm.form.getFieldsValue();
            this.$api.post(this.$face.VEHICLE.list.findListPage,{
                numberPlate:param.numberPlate,
                isEnable:param.isEnable,
                vehicleTypeId:param.vehicleTypeId,
                vehicleCondition:param.vehicleCondition,
                page:this.pagination.current,
                rows:this.pagination.pageSize
            },data => {
                this.pagination.total = data.total;
                this.tableData = data.list.map(val => {
                    return Object.assign({},val,{
                        vehicleConditionStr:this.$api.getDictionaryLabel(this.list.vehicleCondition,val.vehicleCondition)
                    });
                });
                this.loading.table = false;
            },err => {
                this.loading.table = false;
            });
        },
        /**
         * 提交车型
         */
        submitInfo() {
            let {editVehicle} = this;
            editVehicle.form.validateFields((err,values) => {
                if(!err) {
                    editVehicle.submitLoading = true;
                    this.$api.post(this.$face.VEHICLE.list[editVehicle.vid?'update':'save'],Object.assign({
                        id:editVehicle.vid
                    },values),data => {
                        Object.assign(editVehicle,{
                            show:false,
                            submitLoading:false
                        });
                        this.getList(1);
                        this.$message.success("提交成功");
                    },err => {
                        editVehicle.submitLoading = false;
                    });
                }
            });
        },
        /**
         * 禁用日期
         */
        disabledDate(current) {
            return current && current < moment().endOf('day')
        },
        /**
         * 车辆操作
         * @param {String} type [操作类型]
         * @param {Object} record [数据]
         */
        vehicleOperation(type,record) {
            switch(type) {
                case "changeStatus": // 变更状态
                    this.loading.table = true;
                    this.$api.post(this.$face.VEHICLE.list.enableOrDisable,{
                        id:record.id,
                        isEnable:record.isEnable == '1'?'0':'1'
                    },data => {
                        this.$message.success('变更成功');
                        this.getList();
                    },err => {
                        this.loading.table = false;
                    });
                break;
                case "service": // 维修
                    Object.assign(this.service,{
                        show:true,
                        submitLoading:false,
                        vid:record.id
                    });
                    this.service.form.resetFields();
                break;
                case "submitService":   // 提交维修
                    this.service.form.validateFields((err,values) => {
                        if(!err) {
                            this.service.submitLoading = true;
                            this.$api.post(this.$face.VEHICLE.list.repair,{
                                vehicleId:this.service.vid,
                                startDate:values.date[0].format("YYYY-MM-DD HH:mm:00"),
                                endDate:values.date[1].format("YYYY-MM-DD HH:mm:00")
                            },data => {
                                Object.assign(this.service,{
                                    show:false,
                                    submitLoading:false
                                });
                                this.$message.success("提交成功");
                                this.getList(1);
                            },err => {
                                this.service.submitLoading = false;
                            });
                        }
                    });
                break;
                case "serviceFinsh":    // 结束维修
                    this.$confirm({
                        title: "结束维修",
                        content: '确定要结束维修吗？',
                        okType: 'danger',
                        okButtonProps:{
                            style:'float:left;margin-right:10px;'
                        },
                        onOk:() => {
                            return new Promise((resolve,reject) => {
                                this.$api.post(this.$face.VEHICLE.list.endRepair,{
                                    vehicleId:record.id
                                },data => {
                                    this.$message.success("变更成功");
                                    this.getList();
                                    resolve();
                                },err => {
                                    reject();
                                });
                            });
                        },
                        onCancel:() => {}
                    });
                break;
            }
        },
        /**
         * 页面跳转
         * @param {String} type [跳转类型]
         * @param {Object} record [数据]
         */
        goPage(type,record) {
            let {editVehicle} = this;
            switch(type) {
                case "add": // 新增
                    Object.assign(editVehicle,{
                        show:true,
                        title:'新增车辆',
                        vid:null
                    });
                    editVehicle.form.resetFields();
                break;
                case "edit":   // 编辑
                    Object.assign(editVehicle,{
                        show:true,
                        title:'编辑车辆',
                        vid:record.id
                    });
                    this.$nextTick(() => {
                        editVehicle.form.setFieldsValue({
                            numberPlate:record.numberPlate,
                            vehicleTypeId:record.vehicleTypeId
                        });
                    });
                break;
                case "check":   // 查看
                    this.$router.push({
                        name:"basisEditVehicle",
                        params:{
                            from:"basisVehicleList",
                            status:"2",
                            vid:record.id
                        }
                    });
                break;
            }
        }
    }
}
</script>

<style lang="less">
.m-basisEditVehicle {

    .ant-modal-body {

        .ant-form-item {
            margin:10px 0 0 0;
            background-color: #F6F6FC;
            border-radius: 8px;

            .ant-form-explain {
                display: none;
            }

            .ant-form-item-label {
                position:absolute;
                left:16px;
                top:50%;
                font-weight: bold;
                height: 21px;
                line-height: 20px;
                text-align: left;
                transform: translate(0,-50%);

                label {
                    color:#15121F;
                    font-size: 16px;
                }
            }

            .ant-form-item-control {
                width:100%;
                border:1px solid transparent;
                border-radius: 8px;

                &.has-error {
                    border-color:#F91515;
                }

                .ant-form-item-children,
                .ant-input-affix-wrapper {
                    float:left;
                    height: 100%;
                    width:100%;
                }
            }

            .ant-input,
            .ant-input-number-input {
                padding:13px 15px 12px 100px;
                text-align: right;
            }

            .ant-input,
            .ant-select,
            .ant-select-search__field,
            .ant-select-selection__placeholder {
                float:left;
                width:100%;
                height: 46px;
                font-size: 16px;
                border: none;
                background-color: transparent;
                text-align: right;
            }

            .ant-input-number {
                float:left;
                width:100%;
                background-color: transparent;
                text-align: right;
                border: none;

                .ant-input-number-handler-wrap {
                    display: none;
                }
            }

            .ant-select-selection,
            .ant-select-selection__rendered {
                background-color: transparent;
                border: none;
                height: 100%;
            }

            .ant-select-selection-selected-value {
                float:right;
                line-height: 46px;
            }
        }
    }
}
</style>
