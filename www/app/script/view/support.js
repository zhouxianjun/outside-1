/**
 * Created by alone on 17-6-29.
 */
'use strict';
import Table from "../../components/i-table.vue";
import Common from '../common';
import {getAttribute, SupportType} from '../dic';
export default {
    data() {
        return {
            search: {
                page: 1,
                pageSize: 10,
                sortName: 'create_time',
                sortDir: 'desc',
                query: {
                    name: '',
                    type: ''
                }
            },
            model: false,
            modelTitle: '',
            removeModal: false,
            removeItem: null,
            loadingBtn: false,
            SupportType,
            table: {
                columns: [{
                    title: '名称',
                    key: 'name'
                }, {
                    title: '类型',
                    key: 'type',
                    render: (h, params) => {
                        return h('span', getAttribute(SupportType, 'id', params.row[params.column.key]).name);
                    }
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
                                    type: 'primary',
                                    size: 'small',
                                    loading: this.loadingBtn
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: async () => {
                                        this.model = true;
                                        this.modelTitle = '修改';
                                        this.loadingBtn = true;
                                        Object.keys(this.vo).forEach(key => this.vo[key] = params.row[key]);
                                    }
                                }
                            }, '修改'),
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
            },
            vo: {
                id: null,
                name: null,
                type: 8000
            },
            voValidate: {
                name: [{required: true, trigger: 'blur' }],
                type: [{type: 'number', required: true, trigger: 'change' }]
            }
        }
    },
    async mounted() {
        await this.doQuery();
    },
    components: {
        Table
    },
    watch: {
    },
    methods: {
        add() {
            this.model = true;
            this.modelTitle = '新增';
            this.loadingBtn = true;
            this.$refs['form'].resetFields();
        },
        async addOrUpdate() {
            this.$refs['form'].validate(async (valid) => {
                if (valid) {
                    let url = this.vo.id ? '/support/update' : '/support/add';
                    let success = await this.fetch(url, {method: 'post', data: this.vo});
                    if (success === false) {
                        this.resetLoadingBtn();
                        return;
                    }
                    this.model = false;
                    setTimeout(() => this.doQuery(), 500);
                } else {
                    this.resetLoadingBtn();
                    this.$Message.error('表单验证失败!');
                }
            });
        },
        async remove() {
            if (!this.removeItem) return;
            let success = await this.fetch('/support/remove', {method: 'post', data: {id: this.removeItem.id}});
            if (success === false) {
                this.resetLoadingBtn();
                return;
            }
            this.removeItem = null;
            this.removeModal = false;
            setTimeout(() => this.doQuery(), 500);
        },
        async doQuery() {
            let date = this.$refs['date'].currentValue;
            this.search.query.start_time = date[0] instanceof Date ? Common.dateFormat(date[0]) : '';
            this.search.query.end_time = date[1] instanceof Date ? Common.dateFormat(date[1]) : '';
            Common.voNumberToChar(this.search.query);
            let list = await this.fetch('/support/list/page', {params: this.search});
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