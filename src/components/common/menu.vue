<template>
<!-- 公共二级菜单 -->
<ul class="m-menu">
    <li class="item" :class="{active:value == en.value}" v-for="(en,index) in menu" :key="index" @click="changeMenu(en.value)">{{ en.name }}</li>
</ul>
</template>

<script>
export default {
    props:{
        value:{
            type:String,
            required:true
        },
        menu:{
            type:null,
            required:true
        }
    },
    data() {
        return {

        }
    },
    methods:{
        /**
         * 菜单变更
         * @param {String} value [菜单值]
         */
        changeMenu(value) {
            this.$emit("changeMenu",value)
            this.$emit("input",value);
        }
    }
}
</script>

<style lang="less">
.m-menu {
    padding:9px 8px;
    width:205px;
    height:100%;
    text-align: center;
    background-color: #fff;
    border-radius: 8px;

    .item {
        color:#84838E;
        font-size: 16px;
        height:48px;
        line-height:48px;
        border-radius: 8px;
        cursor: pointer;

        &.active {
            color:#fff;
            background-color:#0051FE;
        }

        &:not(.active):hover {
            background-color: #F5F5FD;
        }
    }
}
</style>