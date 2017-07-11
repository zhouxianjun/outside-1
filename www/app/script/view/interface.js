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
                sortName: null,
                sortDir: null,
                query: {
                    name: '',
                    auth: ''
                }
            },
            loadingBtn: false,
            modelTitle: '',
            table: {
                columns: [{
                    title: '名称',
                    key: 'name'
                }, {
                    title: '接口',
                    key: 'auth'
                }, {
                    title: '描述',
                    key: 'description'
                }, {
                    title: '状态',
                    key: 'status',
                    render: Common.RENDER.STATUS
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
                                on: {
                                    click: async () => {
                                        this.modelTitle = '修改接口';
                                        Object.keys(this.vo).forEach(key => this.vo[key] = params.row[key]);
                                        this.model = true;
                                    }
                                }
                            }, '修改')
                        ]);
                    }
                }],
                data: [],
                total: 0
            },
            model: false,
            vo: {
                id: null,
                name: null,
                auth: null,
                description: null,
                status: null
            },
            interfaceValidate: {
                name: [{required: true, trigger: 'blur' }],
                auth: [{required: true, trigger: 'blur' }],
                status: [{type: 'boolean', required: true, trigger: 'blur' }]
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
        add() {
            this.model = true;
            this.modelTitle = '新增接口';
            Common.clearVo(this.vo);
            this.vo.status = false;
        },
        addOrUpdate() {
            this.$refs['form'].validate(async (valid) => {
                if (valid) {
                    let url = this.vo.id ? '/permissions/interface/update' : '/permissions/interface/add';
                    let success = await this.fetch(url, {method: 'post', data: this.vo});
                    if (success === false) {
                        this.loadingBtn = false;
                        this.$nextTick(() => this.loadingBtn = true);
                        return;
                    }
                    this.model = false;
                    setTimeout(() => this.doQuery(), 500);
                } else {
                    this.$Message.error('表单验证失败!');
                }
            });
        },
        async doQuery() {
            Common.clearVo(this.vo);
            Common.voNumberToChar(this.search.query);
            let list = await this.fetch('/permissions/interface/list/mgr', {params: this.search});
            list && (this.table.data = list.interfaces.count === 0 ? [] : JSON.parse(list.interfaces.items));
            list && (this.table.total = list.interfaces.count);
            this.loadingBtn = false;
        },
        async changePage(page) {
            this.search.page = page;
            this.doQuery();
        },
        async changePageSize(size) {
            this.search.pageSize = size;
            this.doQuery();
        }
    }
}