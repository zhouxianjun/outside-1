/**
 * Created by alone on 17-6-29.
 */
'use strict';
import Table from "../../components/i-table.vue";
import VersionDetail from '../../components/version-detail.vue';
import Common from '../common';
import {PositionType} from '../dic';
export default {
    data() {
        return {
            search: {
                page: 1,
                pageSize: 10,
                sortName: 'create_time',
                sortDir: 'desc',
                query: {
                    version: '',
                    producer: ''
                }
            },
            PositionType,
            model: false,
            modelTitle: '',
            adPositionModel: false,
            loadingBtn: false,
            version: null,
            table: {
                columns: [{
                    type: 'expand',
                    width: 50,
                    render: (h, params) => {
                        return h(VersionDetail, {
                            props: {
                                detail: params.row,
                                support: params.row['support']
                            }
                        })
                    }
                }, {
                    title: '版本',
                    key: 'version'
                }, {
                    title: '厂商',
                    key: 'producer'
                }, {
                    title: '激活限制',
                    key: 'active_limit'
                }, {
                    title: 'MD5',
                    key: 'md5'
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
                                        this.modelTitle = '修改版本';
                                        this.loadingBtn = true;
                                        Object.keys(this.vo).forEach(key => this.vo[key] = params.row[key]);
                                    }
                                }
                            }, '修改'),
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    loading: this.loadingBtn
                                },
                                on: {
                                    click: async () => {
                                        this.adPositionModel = true;
                                        this.version = params.row;
                                        this.loadingBtn = true;
                                        this.$refs['positionForm'].resetFields();
                                    }
                                }
                            }, '配置广告位')
                        ]);
                    }
                }],
                data: [],
                total: 0
            },
            vo: {
                id: null,
                version: null,
                producer: null,
                md5: null,
                active_limit: 0,
            },
            versionValidate: {
                version: [{required: true, trigger: 'blur' }],
                producer: [{required: true, trigger: 'blur' }],
                md5: [{required: true, trigger: 'blur' }],
                active_limit: [{type: 'number', required: true, trigger: 'blur' }]
            },
            positionVo: {
                position: null,
                sdk: null,
                api: null
            },
            positionValidate: {
                position: [{type: 'number', required: true, trigger: 'change' }],
                sdk: [{type: 'number', required: true, trigger: 'change' }],
                api: [{type: 'number', required: true, trigger: 'change' }]
            },
            Sdks: [],
            Apis: [],
            supports: []
        }
    },
    async mounted() {
        await this.doQuery();
        let res = await this.fetch('/support/list/all');
        this.supports = res.list;
    },
    components: {
        Table
    },
    watch: {
        'positionVo.position'(position) {
            let array = [];
            this.table.data.forEach(item => {
                if (item.id === this.version.id && item.support && Array.isArray(item.support)) {
                    item.support.forEach(s => s.position === position && array.push(s));
                }
            });
            this.Sdks = [];
            this.Apis = [];
            this.supports.forEach(sup => (sup.type === 8000 && array.find(s => s.support === sup.id)) || this.Sdks.push(sup));
            this.supports.forEach(sup => (sup.type === 8001 && array.find(s => s.support === sup.id)) || this.Apis.push(sup));
        }
    },
    methods: {
        add() {
            this.model = true;
            this.modelTitle = '新增版本';
            this.loadingBtn = true;
            this.$refs['form'].resetFields();
        },
        async addOrUpdate() {
            this.$refs['form'].validate(async (valid) => {
                if (valid) {
                    let url = this.vo.id ? '/version/update' : '/version/add';
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
        async configPosition() {
            if (!this.version) return;
            let success = await this.fetch('/version/config', {method: 'post', data: Object.assign({version: this.version.id}, this.positionVo)});
            if (success === false) {
                this.resetLoadingBtn();
                return;
            }
            this.version = null;
            this.adPositionModel = false;
            setTimeout(() => this.doQuery(), 500);
        },
        async doQuery() {
            let date = this.$refs['date'].currentValue;
            this.search.query.start_time = date[0] instanceof Date ? Common.dateFormat(date[0]) : '';
            this.search.query.end_time = date[1] instanceof Date ? Common.dateFormat(date[1]) : '';
            Common.voNumberToChar(this.search.query);
            let list = await this.fetch('/version/list/page', {params: this.search});
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