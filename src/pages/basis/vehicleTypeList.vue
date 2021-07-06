<template>
<!-- 车型列表 -->
<div class="m-basisList">
    <div class="g-header">
        <div class="btn-group">
            <button class="btn btn-add" @click="goPage('add')"></button>
        </div>
        <a-form layout="inline" :form="searchForm.form">
            <a-form-item>
                <a-input placeholder="车型" autocomplete="off" allowClear
                @input="() => { return getListDebounce(1) }"
                v-decorator="[
                    'name'
                ]"></a-input>
            </a-form-item>
            <a-form-item>
                <a-select placeholder="请选择动力类型" allowClear
                v-decorator="[
                    'powerType'
                ]">
                    <a-select-option v-for="en in $store.state.list.vehiclePowerType" :key="en.value">{{ en.label }}</a-select-option>
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
            <template slot="action" slot-scope="record">
                <a-button-group size="small">
                    <a-button type="link" @click="goPage('edit',record)">修改</a-button>
                </a-button-group>
            </template>
        </a-table>
    </div>
    <!-- 编辑车型 -->
    <a-modal
    :title="editVehicleType.title"
    class="m-basisEditVehicleType"
    width="349px"
    :visible="editVehicleType.show"
    :maskClosable="false"
    @cancel="editVehicleType.show = false;">
        <a-form :form="editVehicleType.form" :colon="false" class="g-basisForm">
            <a-form-item label="车辆型号" prop="name">
                <a-input placeholder="请输入10个字以内" :maxLength="10" autocomplete="off"
                v-decorator="[
                    'name',
                    {
                        rules:[
                            {required:true}
                        ]
                    }
                ]"></a-input>
            </a-form-item>
            <a-form-item label="车辆品牌" prop="brand">
                <a-input placeholder="请输入10个字以内" :maxLength="10" autocomplete="off"
                v-decorator="[
                    'brand',
                    {
                        rules:[
                            {required:true}
                        ]
                    }
                ]"></a-input>
            </a-form-item>
            <a-form-item label="动力类型" prop="powerType">
                <a-select placeholder="请选择动力类型" allowClear
                v-decorator="[
                    'powerType',
                    {
                        rules:[
                            {required:true}
                        ]
                    }
                ]">
                    <a-select-option v-for="en in $store.state.list.vehiclePowerType" :key="en.value">{{ en.label }}</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="额载数" prop="seatNumber">
                <a-input-number placeholder="请输入" :max="99" :min="0" :precision="0"
                v-decorator="[
                    'seatNumber',
                    {
                        rules:[
                            {required:true}
                        ]
                    }
                ]"></a-input-number>
            </a-form-item>
        </a-form>
        <template slot="footer">
            <a-button type="default" class="btn btn-cancel" @click="editVehicleType.show = false;">取消</a-button>
            <a-button type="primary" class="btn btn-submit" @click="submitInfo" :loading="editVehicleType.submitLoading">确定</a-button>
        </template>
    </a-modal>
</div>
</template>

<script>
import debounce from 'lodash/debounce'; // 防抖

export default {
    data() {
        return {
            loading:{
                table:false
            },
            columns:[
                {
                    title:'车辆型号',
                    dataIndex:'name'
                },{
                    title:'动力类型',
                    dataIndex:'powerTypeStr'
                },{
                    title:'品牌',
                    dataIndex:'brand'
                },{
                    title:'额载数',
                    dataIndex:'seatNumber'
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
                        values.hasOwnProperty('powerType') && this.getList(1);
                    }
                })
            },
            editVehicleType:{   // 编辑车型
                show:false,
                submitLoading:false,
                vid:null,   // 编号
                title:'',   // 标题
                form:this.$form.createForm(this)
            }
        }
    },
    created() {
        this.getList();
    },
    methods:{
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
            this.$api.post(this.$face.VEHICLE.typeList.findPage,{
                name:param.name,
                powerType:param.powerType,
                page:this.pagination.current,
                rows:this.pagination.pageSize
            },data => {
                this.pagination.total = data.total;
                this.tableData = Array.from(data.list,val => Object.assign(val,{
                    powerTypeStr:this.$api.getDictionaryLabel(this.$store.state.list.vehiclePowerType,val.powerType)
                }));
                this.loading.table = false;
            },err => {
                this.loading.table = false;
            });
        },
        /**
         * 提交车型
         */
        submitInfo() {
            let {editVehicleType} = this;
            editVehicleType.form.validateFields((err,values) => {
                if(!err) {
                    editVehicleType.submitLoading = true;
                    this.$api.post(this.$face.VEHICLE.typeList[editVehicleType.vid?'update':'save'],Object.assign({
                        id:editVehicleType.vid
                    },values),data => {
                        Object.assign(editVehicleType,{
                            show:false,
                            submitLoading:false
                        });
                        this.getList(1);
                        this.$message.success("提交成功");
                    },err => {
                        editVehicleType.submitLoading = false;
                    });
                }
            });
        },
        /**
         * 页面跳转
         * @param {String} type [跳转类型]
         * @param {Object} record [数据]
         */
        goPage(type,record) {
            let {editVehicleType} = this;
            switch(type) {
                case "add": // 新增
                    Object.assign(editVehicleType,{
                        show:true,
                        title:'新增车型',
                        vid:null
                    });
                    editVehicleType.form.resetFields();
                break;
                case "edit":   // 编辑
                    Object.assign(editVehicleType,{
                        show:true,
                        title:'编辑车型',
                        vid:record.id
                    });
                    this.$nextTick(() => {
                        editVehicleType.form.setFieldsValue({
                            name:record.name,
                            brand:record.brand,
                            powerType:record.powerType,
                            seatNumber:parseInt(record.seatNumber)
                        });
                    });
                break;
            }
        }
    }
}
</script>

<style lang="less">
.m-basisEditVehicleType {

    .ant-modal-footer {

        .btn {
            width:123px;
            height:40px;
            border-radius: 8px;
        }

        .btn-cancel {
            color:#84838E;
            font-size: 16px;
        }
    }
}
</style>