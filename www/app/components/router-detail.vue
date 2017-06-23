<template>
    <span>
        消费者 = {{detail.consumeHost}} 方法 = {{detail.method}} 调用提供者 = {{detail.providerAddress}}
    </span>
</template>
<script>
    export default {
        props: {
            detail: Object
        }
    }
</script>