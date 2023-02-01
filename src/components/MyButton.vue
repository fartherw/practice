<template>
    <el-button :size="size" :type="type" :plain="plain" :round="round" :circle="circle" :disabled="disabled"
        :icon="icon" :autofocus="autofocus" :nativeType="nativeType" :loading="comfirmLoading" @click="handle">
        <slot></slot>
    </el-button>
</template>

<script>

export default {
    name: "my-button",
    props: {
        size: {
            type: String,
            default: ""
        },
        type: {
            type: String,
            default: "primary"
        },
        plain: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },

        round: {
            type: Boolean,
            default: false
        },
        circle: {
            type: Boolean,
            default: false
        },
        icon: {
            type: String,
            default: ""
        },
        autofocus: {
            type: Boolean,
            default: false
        },
        nativeType: {
            type: String,
            default: "button"
        },
    },
    data() {
        return {
            comfirmLoading: false,
        }
    },
    methods: {
        async handle() {
            this.comfirmLoading = true;
            await this.$listeners.click();//这样做比$emit的方法好处在于：可以接收函数执行的返回值
            this.comfirmLoading = false;
        }
    }
}
</script>

<style lang="less" scoped>

</style>