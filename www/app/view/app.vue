<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<script>
    export default {
        data () {
            return {}
        },
        mounted () {
            this.$router.mode === 'abstract' && this.$router.push('/');
        },
        beforeDestroy () {
        },
        methods: {
        }
    }
</script>