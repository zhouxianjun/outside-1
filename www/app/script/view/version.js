/**
 * Created by alone on 17-6-29.
 */
'use strict';
import Table from "../../components/i-table.vue";
import VersionDetail from '../../components/version-detail.vue';
import Common from '../common';
import {PositionType, ModeType} from '../dic';
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
            ModeType,
            model: false,
            modelTitle: '',
            adPositionModel: false,
            useModel: false,
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
                            },
                            on: {
                                'on-remove': async id => {
                                    let success = await this.fetch('/version/support', {method: 'post', data: {id}});
                                    success && setTimeout(() => this.doQuery(), 500);
                                }
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
                    width: 250,
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
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: async () => {
                                        this.adPositionModel = true;
                                        this.version = params.row;
                                        this.loadingBtn = true;
                                        this.$refs['positionForm'].resetFields();
                                    }
                                }
                            }, '广告位'),
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    loading: this.loadingBtn
                                },
                                on: {
                                    click: async () => {
                                        this.useModel = true;
                                        this.version = params.row;
                                        this.loadingBtn = true;
                                        this.$refs['useForm'].resetFields();
                                        this.$refs['pushStartDate'].currentValue = null;
                                    }
                                }
                            }, '内容切换')
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
            useVo: {
                position: null,
                sdk: null,
                api: null,
                mode: 2000,
                description: null,
                filter: null,
                max_send_num: 1
            },
            useValidate: {
                position: [{type: 'number', required: true, trigger: 'change' }],
                sdk: [{type: 'number', required: true, trigger: 'change' }],
                api: [{type: 'number', required: true, trigger: 'change' }],
                max_send_num: [{type: 'number', required: true, trigger: 'blur' }],
                mode: [{type: 'number', required: true, trigger: 'change' }],
                filter: [{required: true, trigger: 'blur' }]
            },
            Sdks: [],
            Apis: [],
            haveSdks: [],
            haveApis: [],
            supports: []
        }
    },
    async mounted() {
        await this.doQuery();
        Common.slimScroll(this.$refs['useForm'].$el);
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
            this.haveSdks = [];
            this.haveApis = [];
            this.supports.forEach(sup => {
                let find = array.find(s => s.support === sup.id);
                (!find && sup.type === 8000) && this.Sdks.push(sup);
                (!find && sup.type === 8001) && this.Apis.push(sup);
            });
        },
        'useVo.position'(position) {
            let array = [];
            this.table.data.forEach(item => {
                if (item.id === this.version.id && item.support && Array.isArray(item.support)) {
                    item.support.forEach(s => s.position === position && array.push(s));
                }
            });
            this.haveSdks = [];
            this.haveApis = [];
            this.supports.forEach(sup => {
                let find = array.find(s => s.support === sup.id);
                (find && sup.type === 8000) && this.haveSdks.push(sup);
                (find && sup.type === 8001) && this.haveApis.push(sup);
            });
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
        async useSupport() {
            this.$refs['useForm'].validate(async (valid) => {
                if (valid) {
                    let date = this.$refs['pushStartDate'].currentValue;
                    let success = await this.fetch('/push/change/support', {method: 'post', data: {
                        push: Object.assign({
                            start_time: date ? date.getTime() : null,
                            type: 1002
                        }, this.useVo),
                        change: Object.assign({version: this.version.id}, this.useVo)
                    }});
                    if (success === false) {
                        this.resetLoadingBtn();
                        return;
                    }
                    this.useModel = false;
                    setTimeout(() => this.doQuery(), 500);
                } else {
                    this.resetLoadingBtn();
                    this.$Message.error('表单验证失败!');
                }
            });
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