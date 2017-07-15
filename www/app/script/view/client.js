/**
 * Created by alone on 17-6-29.
 */
'use strict';
import Table from "../../components/i-table.vue";
import Common from '../common';
export default {
    data() {
        return {
            search: {
                page: 1,
                pageSize: 10,
                sortName: 'create_time',
                sortDir: 'desc',
                query: {
                    imei: '',
                    device_id: '',
                    version: '',
                    phone: '',
                    model: '',
                    producer: ''
                }
            },
            loadingBtn: false,
            removeModal: false,
            removeItem: null,
            table: {
                columns: [{
                    title: '手机号码',
                    key: 'phone'
                }, {
                    title: 'IMEI',
                    key: 'imei'
                }, {
                    title: '设备ID',
                    key: 'device_id'
                }, {
                    title: '版本',
                    key: 'version_name'
                }, {
                    title: '手机型号',
                    key: 'model'
                }, {
                    title: '友盟TOKEN',
                    key: 'umeng_token'
                }, {
                    title: '创建时间',
                    key: 'create_time',
                    render: Common.RENDER.DATE
                }, {
                    title: '操作',
                    key: 'action',
                    width: 200,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small',
                                    loading: this.loadingBtn
                                },
                                on: {
                                    click: async () => {
                                        this.removeModal = true;
                                        this.removeItem = params.row;
                                        this.loadingBtn = true;
                                    }
                                }
                            }, '删除')
                        ]);
                    }
                }],
                data: [],
                total: 0
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
        async remove() {
            if (!this.removeItem) return;
            let success = await this.fetch('/client/remove', {method: 'post', data: {id: this.removeItem.id}});
            if (success === false) {
                this.resetLoadingBtn();
                return;
            }
            this.removeItem = null;
            this.removeModal = false;
            setTimeout(() => this.doQuery(), 500);
        },
        async doQuery() {
            Common.voNumberToChar(this.search.query);
            let list = await this.fetch('/client/list/page', {params: this.search});
            list && (this.table.data = list.page.count === 0 ? [] : JSON.parse(list.page.items));
            list && (this.table.total = list.page.count);
            this.loadingBtn = false;
        },
        async changePage(page) {
            this.search.page = page;
            this.doQuery();
        },
        async changePageSize(size) {
            this.search.pageSize = size;
            this.doQuery();
        },
        cancel() {
            this.loadingBtn = false;
        },
        resetLoadingBtn() {
            this.loadingBtn = false;
            this.$nextTick(() => this.loadingBtn = true);
        }
    }
}