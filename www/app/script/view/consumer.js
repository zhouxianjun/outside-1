/**
 * Created by alone on 17-5-22.
 */
'use strict';
import Table from "../../components/i-table.vue";
import consumerDetail from "../../components/consumer-detail.vue";
export default {
    data() {
        return {
            search: {
                namespace: '*',
                service: '*',
                version: '*',
                address: '*'
            },
            disableModal: false,
            shieldModal: false,
            selectItem: null,
            loadingBtn: false,
            table: {
                columns: [{
                    type: 'expand',
                    width: 50,
                    render: (h, params) => {
                        return h(consumerDetail, {
                            props: {
                                detail: params.row
                            }
                        })
                    }
                }, {
                    title: '命名空间',
                    key: 'namespace'
                }, {
                    title: '服务名',
                    key: 'service'
                }, {
                    title: '版本号',
                    key: 'version'
                }, {
                    title: '机器地址',
                    key: 'address',
                    render: (h, params) => {
                        return h('div', `${params.row.host}`);
                    }
                }, {
                    title: '操作',
                    key: 'action',
                    width: 200,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: params.row.status ? 'error' : 'success',
                                    size: 'small',
                                    loading: this.loadingBtn
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: async () => {
                                        if (params.row.status) {
                                            this.selectItem = params.row;
                                            this.disableModal = true;
                                        } else {
                                            await this.enableConsumer(params.row);
                                        }
                                    }
                                }
                            }, params.row.status ? '禁用' : '启用'),
                            h('Button', {
                                props: {
                                    type: params.row.shield ? 'success' : 'error',
                                    size: 'small',
                                    loading: this.loadingBtn
                                },
                                on: {
                                    click: async () => {
                                        if (!params.row.shield) {
                                            this.selectItem = params.row;
                                            this.shieldModal = true;
                                        } else {
                                            await this.recoveryConsumer(params.row);
                                        }
                                    }
                                }
                            }, params.row.shield ? '恢复' : '屏蔽')
                        ]);
                    }
                }],
                data: []
            }
        }
    },
    async mounted() {
        await this.doQuery();
    },
    components: {
        Table
    },
    methods: {
        async disableConsumer() {
            if (!this.selectItem) return;
            let params = {
                namespace: this.selectItem.namespace,
                version: this.selectItem.version,
                service: this.selectItem.service
            };
            this.loadingBtn = true;
            let success = await this.fetch('/service/consumer/disable', {method: 'post', data: {address: `${this.selectItem.host}`}, params: params});
            if (success === false) {
                this.loadingBtn = false;
                return;
            }
            this.selectItem = null;
            this.disableModal = false;
            setTimeout(() => this.doQuery(), 500);
        },
        async enableConsumer(item) {
            let params = {
                namespace: item.namespace,
                version: item.version,
                service: item.service
            };
            this.loadingBtn = true;
            let success = await this.fetch('/service/consumer/enable', {method: 'post', data: {address: `${item.host}`}, params: params});
            if (success === false) {
                this.loadingBtn = false;
                return;
            }
            setTimeout(() => this.doQuery(), 500);
        },
        async shieldConsumer() {
            if (!this.selectItem) return;
            let params = {
                namespace: this.selectItem.namespace,
                version: this.selectItem.version,
                service: this.selectItem.service
            };
            this.loadingBtn = true;
            let success = await this.fetch('/service/consumer/shield', {method: 'post', data: {address: `${this.selectItem.host}`}, params: params});
            if (success === false) {
                this.loadingBtn = false;
                return;
            }
            this.selectItem = null;
            this.shieldModal = false;
            setTimeout(() => this.doQuery(), 500);
        },
        async recoveryConsumer(item) {
            let params = {
                namespace: item.namespace,
                version: item.version,
                service: item.service
            };
            this.loadingBtn = true;
            let success = await this.fetch('/service/consumer/recovery', {method: 'post', data: {address: `${item.host}`}, params: params});
            if (success === false) {
                this.loadingBtn = false;
                return;
            }
            setTimeout(() => this.doQuery(), 500);
        },
        async doQuery() {
            let routers = await this.fetch('/service/consumer/list', {params: this.search});
            routers && (this.table.data = routers.list || []);
            this.loadingBtn = false;
        }
    }
}