<template>
    <!-- 移除按钮之间的空格 -->
    <a-config-provider :autoInsertSpaceInButton="false" :locale="zh_CN">
        <router-view/>
    </a-config-provider>
</template>

<style lang="less">
</style>

<script>
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';
import Vue from 'vue'

export default {
    data () {
        return {
            zh_CN   // 汉化
        }
    }
}
</script>
