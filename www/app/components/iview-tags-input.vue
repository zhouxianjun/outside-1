<style scoped>
    .tags-input{
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
        font-size: 0.75rem;
        padding: 0.1rem 0
    }
</style>
<script>
    import tagsInput from 'vue-tagsinput';
    export default {
        name: 'i-tags-input',
        extends: tagsInput,
        mounted() {
            this.$on('blur', () => {this.$parent.$emit('on-form-blur', this.tags)})
        }
    }
</script>