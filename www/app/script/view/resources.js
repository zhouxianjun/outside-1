/**
 * Created by alone on 17-6-29.
 */
'use strict';
import Table from "../../components/i-table.vue";
import Common from '../common';
import {ResourcesType, getAttribute} from '../dic';
export default {
    data() {
        return {
            search: {
                page: 1,
                pageSize: 10,
                sortName: 'create_time',
                sortDir: 'desc',
                query: {
                    user: '',
                    type: '',
                    md5: '',
                    name: '',
                    pkg: ''
                }
            },
            ResourcesType,
            loadingBtn: false,
            modelTitle: '',
            table: {
                columns: [{
                    title: '名称',
                    key: 'name'
                }, {
                    title: '用户',
                    key: 'username'
                }, {
                    title: '类型',
                    key: 'type',
                    render: (h, params) => {
                        return h('span', getAttribute(ResourcesType, 'id', params.row.type).name);
                    }
                }, {
                    title: '资源地址',
                    key: 'path'
                }, {
                    title: 'MD5',
                    key: 'md5'
                }, {
                    title: '大小',
                    key: 'size'
                }, {
                    title: '包名',
                    key: 'pkg'
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
                            }, '修改'),
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small',
                                    loading: this.loadingBtn
                                },
                                on: {
                                    click: async () => {

                                    }
                                }
                            }, '删除')
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
            resourcesValidate: {
                name: [{required: true, trigger: 'blur' }],
                auth: [{required: true, trigger: 'blur' }],
                status: [{type: 'boolean', required: true, trigger: 'blur' }]
            },
            image: 'img/user2-160x160-1kn_HAu.jpg'
        }
    },
    async mounted() {
        await this.doQuery();
    },
    components: {
        Table
    },
    methods: {
        async addOrUpdate() {

        },
        async doQuery() {
            let date = this.$refs['date'].currentValue;
            this.search.query.start_time = date[0] instanceof Date ? Common.dateFormat(date[0]) : '';
            this.search.query.end_time = date[1] instanceof Date ? Common.dateFormat(date[1]) : '';
            let list = await this.fetch('/resources/list/page', {params: this.search});
            list && (this.table.data = list.page.count === 0 ? [] : JSON.parse(list.page.items));
            list && (this.table.total = list.page.count);
        },
        async changePage(page) {
            this.search.page = page;
            this.doQuery();
        },
        async changePageSize(size) {
            this.search.pageSize = size;
            this.doQuery();
        },
        add() {
            this.model = true;
            this.modelTitle = '上传资源';
            this.loadingBtn = true;
        }
    }
}