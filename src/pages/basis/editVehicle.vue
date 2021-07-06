<template>
<!-- 编辑车辆 -->
<a-spin :spinning="loading.page" class="m-editVehicle" :class="{disabled:detail.isEnable == '0'}">
    <div class="header">
        <a-button icon="caret-left" class="btn-back" @click="goPage('back')"></a-button>
        <span class="title">{{ getTitle }}</span>
    </div>
    <div class="userInfo">
        <div class="item numberPlate">
            <div class="name">车牌号</div>
            <div class="descript">{{ detail.numberPlate }}</div>
        </div>
        <div class="item power">
            <div class="name">动力类型</div>
            <div class="descript">{{ detail.powerTypeStr }}</div>
        </div>
        <div class="item count">
            <div class="name">额载</div>
            <div class="descript">{{ detail.seatNumber }}</div>
        </div>
        <div class="item region">
            <div class="name">服务区域</div>
            <div class="descript">{{ detail.regionLabel }}</div>
        </div>
        <div class="item status">
            <div class="name">状态</div>
            <div class="descript">{{ detail.isEnableStr }}</div>
        </div>
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
            current:{
                tab:''
            },
            detail:{
                numberPlate:'', // 车牌号
                vehicleTypeLabel:'',    // 动力类型
                seatNumber:'',  // 额载
                regionLabel:'', // 服务区域
                isEnable:'' // 状态
            }
        }
    },
    created() {
        Object.assign(this.page,this.$route.params);
        this.getDetail();
    },
    mounted() {
        this.changeTab('shift');
    },
    methods:{
        /**
         * 获取详情
         */
        getDetail() {
            this.loading.page = true;
            this.$api.post(`${this.$face.VEHICLE.edit.detailById}?id=${this.page.vid}`,{
            },data => {
                Object.assign(this.detail,data,{
                    powerTypeStr:this.$api.getDictionaryLabel(this.$store.state.list.vehiclePowerType,data.vehiclePowerType),
                    isEnableStr:data.isEnable == '1'?'启用':'禁用'
                });
                this.loading.page = false;
            },err => {
                this.loading.page = false;
            });
        },
        /**
         * 切换tab
         * @param {String} tab [标签]
         */
        changeTab(tab) {
            if(this.current.tab != tab) {
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
            return this.page.status == '2';
        }
    }
}
</script>

<style lang="less">
.m-editVehicle {
    height: 100%;

    &.disabled {
        filter: grayscale(100%);
    }

    .ant-spin-container {
        display: flex;
        flex-direction: column;
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
        }
    }

    .userInfo {
        margin-top:32px;
        display: flex;

        .item {
            padding:23px 24px;
            width:10px;
            margin-left:12px;
            flex-grow: 1;
            height:105px;
            border-radius: 8px;
            box-shadow: 0 2px 11px 0 rgba(0,0,0,0.1);

            .name {
                color:#84838E;
                font-size: 14px;
                font-weight: bold;
                letter-spacing: 2px;
            }

            .descript {
                color:#15121F;
                font-size: 26px;
                font-family: "ZiTiQuanXinYiGuanHeiTi3.0-2";
            }

            &:first-child {
                margin-left:0;
            }

            &.numberPlate {
                background:#fff url("../../assets/vehicle/numberPlate.png") no-repeat calc(100% - 14px) center;
                background-size: 72px;
            }

            &.power {
                background:#fff url("../../assets/vehicle/power.png") no-repeat calc(100% - 14px) center;
                background-size: 72px;
            }

            &.count {
                background:#fff url("../../assets/vehicle/count.png") no-repeat calc(100% - 14px) center;
                background-size: 72px;
            }

            &.region {
                background:#fff url("../../assets/vehicle/region.png") no-repeat calc(100% - 14px) center;
                background-size: 72px;
            }

            &.status {
                background:#fff url("../../assets/vehicle/status.png") no-repeat calc(100% - 14px) center;
                background-size: 72px;
            }
        }
    }

    .tab {
        padding-bottom: 21px;
        margin-top:32px;

        .item {
            float:left;
            position:relative;
            color:#84838E;
            font-size: 18px;
            cursor: pointer;
            font-weight: bold;

            &:not(:first-child) {
                margin-left:12px;
            }

            &:hover {
                opacity: 0.8;
            }

            &.active {
                color:#15121F;

                &::before {
                    content:"";
                    margin-left:-12px;
                    display: block;
                    position: absolute;
                    bottom:-2px;
                    left:50%;
                    width:24px;
                    height:3px;
                    background-color: #0051FE;
                }
            }
        }
    }
}
</style>