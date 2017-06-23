<template>
    <div class="modal fade" tabindex="-1" role="dialog">
        <div :class="['modal-dialog', size]" role="document">
            <div class="modal-content">
                <div class="modal-header" v-if="showHeader">
                    <slot name="header">
                        <button v-if="closable" type="button" class="close" data-dismiss="modal" aria-label="关闭"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title">{{title}}</h4>
                    </slot>
                </div>
                <div class="modal-body">
                    <slot></slot>
                </div>
                <div class="modal-footer" v-if="showFooter">
                    <slot name="footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">{{cancelText}}</button>
                        <button type="button" class="btn btn-primary" @click="ok">{{okText}}</button>
                    </slot>
                </div>
            </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->
</template>
<script>
    export default {
        name: 'modal',
        data() {
            return {
                showHeader: true,
                showFooter: true
            }
        },
        methods: {
            ok() {
                this.$emit('on-ok', () => {$(this.$el).modal('hide')});
            }
        },
        props: {
            title: String,
            closable: {type: Boolean, default: true},
            cancelText: {type: String, default: '取消'},
            okText: {type: String, default: '确定'},
            size: {type: String, default: ''}
        },
        watch: {
            title (val) {
                if (this.$slots.header === undefined) {
                    this.showHeader = !!val;
                }
            }
        },
        mounted() {
            if (this.$slots.header === undefined && !this.title) {
                this.showHeader = false;
            }
            $(this.$el).on('shown.bs.modal', event => this.$emit('on-show', event)).on('hidden.bs.modal', event => this.$emit('on-cancel', event));
        }
    }
</script>