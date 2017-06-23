/**
 * Created by alone on 17-5-22.
 */
'use strict';
import Table from "../../components/i-table.vue";
import providerDetail from "../../components/provider-detail.vue";
import Common from '../common';
export default {
    data() {
        return {
            search: {
                namespace: '*',
                service: '*',
                version: '*',
                address: '*'
            },
            disableProviderModal: false,
            selectItem: null,
            loadingBtn: false,
            table: {
                columns: [{
                    type: 'expand',
                    width: 50,
                    render: (h, params) => {
                        return h(providerDetail, {
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
                        return h('div', `${params.row.host}:${params.row.port}`);
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
                                            this.disableProviderModal = true;
                                        } else {
                                            await this.enableProvider(params.row);
                                        }
                                    }
                                }
                            }, params.row.status ? '禁用' : '启用'),
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    loading: this.loadingBtn
                                },
                                on: {
                                    click: async () => {
                                        this.selectItem = params.row;
                                        Object.keys(this.edit).forEach(key => this.edit[key] = isNaN(params.row[key]) ? params.row[key] : Number(params.row[key]));
                                        this.editModel = true;
                                    }
                                }
                            }, '动态配置')
                        ]);
                    }
                }],
                data: []
            },
            editModel: false,
            overrideWeight: false,
            overrideWarmup: false,
            overrideAttr: false,
            edit: {
                weight: undefined,
                warmup: undefined,
                attr: ''
            },
            editValidate: {
                weight: [{type: 'number', min: 0, max: 99999, trigger: 'blur' }],
                warmup: [{type: 'number', min: 0, max: 99999999999, trigger: 'blur' }]
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
        override() {
            this.$refs['edit'].validate(async (valid) => {
                if (valid) {
                    let body = Object.assign({}, this.edit);
                    this.overrideWeight || Reflect.deleteProperty(body, 'weight');
                    this.overrideWarmup || Reflect.deleteProperty(body, 'warmup');
                    this.overrideAttr || Reflect.deleteProperty(body, 'attr');
                    let success = await this.fetch('/service/provider/override', {method: 'post', data: body, params: {
                        namespace: this.selectItem.namespace,
                        version: this.selectItem.version,
                        service: this.selectItem.service,
                        address: `${this.selectItem.host}:${this.selectItem.port}`
                    }});
                    if (success === false) {
                        this.loadingBtn = false;
                        return;
                    }
                    this.selectItem = null;
                    this.editModel = false;
                    setTimeout(() => this.doQuery(), 500);
                } else {
                    this.$Message.error('表单验证失败!');
                }
            })
        },
        async disableProvider() {
            if (!this.selectItem) return;
            let params = {
                namespace: this.selectItem.namespace,
                version: this.selectItem.version,
                service: this.selectItem.service
            };
            this.loadingBtn = true;
            let success = await this.fetch('/service/provider/disable', {method: 'post', data: {address: `${this.selectItem.host}:${this.disableProviderItem.port}`}, params: params});
            if (success === false) {
                this.loadingBtn = false;
                return;
            }
            this.selectItem = null;
            this.disableProviderModal = false;
            setTimeout(() => this.doQuery(), 500);
        },
        async enableProvider(item) {
            let params = {
                namespace: item.namespace,
                version: item.version,
                service: item.service
            };
            this.loadingBtn = true;
            let success = await this.fetch('/service/provider/enable', {method: 'post', data: {address: `${item.host}:${item.port}`}, params: params});
            if (success === false) {
                this.loadingBtn = false;
                return;
            }
            setTimeout(() => this.doQuery(), 500);
        },
        async doQuery() {
            let routers = await this.fetch('/service/provider/list', {params: this.search});
            routers && (this.table.data = routers.list || []);
            this.loadingBtn = false;
        }
    }
}