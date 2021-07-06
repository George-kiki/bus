<template>
<!-- 司机列表 -->
<div class="m-basisList">
    <div class="g-header">
        <div class="btn-group">
            <button class="btn btn-add" @click="goPage('add')"></button>
        </div>
        <a-form layout="inline" :form="searchForm.form">
            <a-form-item>
                <a-input placeholder="姓名" autocomplete="off" allowClear
                @input="() => { return getListDebounce(1) }"
                v-decorator="[
                    'name'
                ]"></a-input>
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
                <a-switch :checked="record.isEnable === '1'" @change="driverOperation('changeStatus',record)"/>
            </template>
            <template slot="action" slot-scope="record">
                <a-button-group size="small">
                    <a-button type="link" @click="goPage('check',record)">查看</a-button>
                    <a-button type="link" @click="goPage('edit',record)">修改</a-button>
                </a-button-group>
            </template>
        </a-table>
    </div>
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
                    title:'工号',
                    dataIndex:'cardNo'
                },{
                    title:'姓名',
                    dataIndex:'name'
                },{
                    title:'手机号',
                    dataIndex:'phone'
                },{
                    title:'所属组织',
                    dataIndex:'regionName'
                },{
                    title:'驾驶证有效期',
                    dataIndex:'isVacation'
                },{
                    title:'从业资格证有效期'
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
                        values.hasOwnProperty('isEnable') && this.getList(1);
                    }
                })
            },
            editDriver:{   // 编辑车辆
                show:false,
                submitLoading:false,
                did:null,   // 编号
                title:'',   // 标题
                form:this.$form.createForm(this)
            },
            vacation:{   // 休假
                show:false,
                submitLoading:false,
                did:null,   // 编号
                form:this.$form.createForm(this)
            },
            list:{
                vehicleCondition:[{label:'正常使用',value:'1'},{label:'维修',value:'2'}],    // 车况
                vehicleType:[]  // 车型列表
            }
        }
    },
    created() {
        // this.getList();
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
            this.$api.post(this.$face.DRIVER.list.findListPage,{
                name:param.name,
                isEnable:param.isEnable,
                page:this.pagination.current,
                rows:this.pagination.pageSize
            },data => {
                this.pagination.total = data.total;
                this.tableData = data.list;
                this.loading.table = false;
            },err => {
                this.loading.table = false;
            });
        },
        /**
         * 页面跳转
         * @param {String} type [跳转类型]
         * @param {Object} record [数据]
         */
        goPage(type,record) {
            let {editDriver} = this;
            switch(type) {
                case "add": // 新增
                    this.$tabs.push({
                        sign:"basisEditDriver",
                        name:"新增司机",
                        model:"basisEditDriver",
                        belong:"basisDriverList",
                        params:{
                            from:'basisDriverList',
                            status:'0'
                        }
                    });
                break;
                case "edit":   // 编辑
                break;
                case "check":   // 查看
                    this.$router.push({
                        name:"basisEditDriver",
                        params:{
                            from:"basisDriverList",
                            status:"2",
                            did:record.id
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
