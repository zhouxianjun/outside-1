<script>
    import table from 'iview/src/components/table';
    import $ from 'jquery';
    export default {
        name: 'Table',
        props: {
            headerColor: {
                type: String,
                default: ''
            }
        },
        mixins: [table],
        mounted() {
            this.changeHeaderColor(this.headerColor);
        },
        methods: {
            changeHeaderColor(val) {
                val && $('th', this.$refs['header']).css('background-color', val);
            }
        },
        watch: {
            headerColor(val) {
                this.changeHeaderColor(val);
            }
        }
    }
</script>