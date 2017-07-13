/**
 * Created by alone on 17-6-29.
 */
'use strict';
import Table from "../../components/i-table.vue";
import Common from "../common";
import $ from 'jquery';
import {getAttribute, TempleType, PositionType, ResourcesType} from "../dic";
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
                    temple: '',
                    position: '',
                    name: ''
                }
            },
            TempleType,
            PositionType,
            ResourcesType,
            loadingBtn: false,
            modelTitle: '',
            table: {
                columns: [{
                    title: '用户',
                    key: 'username'
                }, {
                    title: '名称',
                    key: 'name'
                }, {
                    title: '模板',
                    key: 'temple',
                    render: (h, params) => {
                        return h('span', getAttribute(TempleType, 'id', params.row.temple).name);
                    }
                }, {
                    title: '广告位',
                    key: 'position',
                    render: (h, params) => {
                        return h('span', getAttribute(PositionType, 'id', params.row.position).name);
                    }
                }, {
                    title: '误点率',
                    key: 'fault_click_rate',
                    render: (h, params) => {
                        return Common.RENDER.APPEND(h, params)('%');
                    }
                }, {
                    title: '展示频率',
                    key: 'show_day',
                    render: (h, params) => {
                        return Common.RENDER.APPEND(h, params)('次/天');
                    }
                }, {
                    title: '展示时间',
                    key: 'show_time',
                    render: Common.RENDER.DATE
                }, {
                    title: '倒计时',
                    key: 'count_down',
                    render: (h, params) => {
                        return Common.RENDER.APPEND(h, params)('秒');
                    }
                }, {
                    title: '时间段',
                    key: 'show_time_start',
                    render: (h, params) => {
                        return Common.RENDER.DATE_RANGE(h, params)('show_time_start', 'show_time_end');
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
                                        this.resourcesModel = true;
                                        this.waitSetId = params.row.id;
                                        this.loadingBtn = true;
                                        this.doResourcesQuery();
                                    }
                                }
                            }, '资源'),
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    disabled: params.row['push_count'] > 0,
                                    loading: this.loadingBtn
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: async () => {
                                        this.model = true;
                                        this.modelTitle = '修改广告';
                                        this.loadingBtn = true;
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
            model: false,
            resourcesModel: false,
            removeModal: false,
            removeItem: null,
            vo: {
                id: null,
                temple: 6000,
                position: 5000,
                fault_click_rate: 0,
                show_day: 1,
                count_down: 3
            },
            adValidate: {
                name: [{required: true, trigger: 'blur' }],
                temple: [{type: 'number', required: true, trigger: 'change' }],
                position: [{type: 'number', required: true, trigger: 'change' }],
                fault_click_rate: [{type: 'number', required: true, trigger: 'blur' }],
                show_day: [{type: 'number', required: true, trigger: 'blur' }],
                count_down: [{type: 'number', required: true, trigger: 'blur' }]
            },
            waitSetId: null,
            resources: {
                columns: [{
                    type: 'selection',
                    width: 60,
                    align: 'center'
                }, {
                    title: '名称',
                    key: 'name'
                }, {
                    title: '类型',
                    key: 'type',
                    render: (h, params) => {
                        return h('span', getAttribute(ResourcesType, 'id', params.row.type).name);
                    }
                }, {
                    title: 'MD5',
                    key: 'md5'
                }, {
                    title: '大小',
                    key: 'size'
                }, {
                    title: '创建时间',
                    key: 'create_time',
                    render: Common.RENDER.DATE
                }],
                data: [],
                total: 0,
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
                }
            },
            selected: new Map()
        }
    },
    async mounted() {
        await this.doQuery();
        Common.slimScroll(this.$refs['form'].$el);
        Common.slimScroll($('.ivu-table-body', this.$refs['table'].$el));
    },
    components: {
        Table
    },
    watch: {

    },
    methods: {
        async addOrUpdate() {
            this.$refs['form'].validate(async (valid) => {
                if (valid) {
                    let url = this.vo.id ? '/ad/update' : '/ad/add';
                    let dates = this.$refs['voDate'].currentValue;
                    let date = this.$refs['showDate'].currentValue;
                    if (!date && !dates[0] && !dates[1]) {
                        this.$Message.error('必须设置一个展示时间!');
                        this.resetLoadingBtn();
                        return;
                    }
                    let success = await this.fetch(url, {method: 'post', data: Object.assign({
                        show_time_start: dates[0] ? dates[0].getTime() : null,
                        show_time_end: dates[0] ? dates[1].getTime() : null,
                        show_time: date ? date.getTime() : null
                    }, this.vo)});
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
            let success = await this.fetch('/ad/remove', {method: 'post', data: {id: this.removeItem.id}});
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
            let list = await this.fetch('/ad/list/page', {params: this.search});
            list && (this.table.data = list.page.count === 0 ? [] : JSON.parse(list.page.items));
            list && (this.table.total = list.page.count);
            this.loadingBtn = false;
        },
        async doResourcesQuery() {
            let date = this.$refs['resourcesDate'].currentValue;
            this.resources.search.query.start_time = date[0] instanceof Date ? Common.dateFormat(date[0]) : '';
            this.resources.search.query.end_time = date[1] instanceof Date ? Common.dateFormat(date[1]) : '';
            Common.voNumberToChar(this.resources.search.query);
            let list = await this.fetch('/resources/ad/page', {params: Object.assign({id: this.waitSetId}, this.resources.search)});
            list && (this.resources.data = list.page.count === 0 ? [] : JSON.parse(list.page.items));
            list && (this.resources.total = list.page.count);
            this.resources.data.forEach(item => item['_checked'] = item.ow);
            for (let ids of this.selected.values()) {
                ids.forEach(id => this.resources.data.forEach(item => item['_checked'] = item.id === id));
            }
        },
        async changePage(page) {
            this.search.page = page;
            this.doQuery();
        },
        async changePageSize(size) {
            this.search.pageSize = size;
            this.doQuery();
        },
        async changePageByResources(page) {
            this.resources.page = page;
            this.doResourcesQuery();
        },
        async changePageSizeByResources(size) {
            this.resources.pageSize = size;
            this.doResourcesQuery();
        },
        async setResources() {
            let array = [];
            for (let ids of this.selected.values()) {
                ids.forEach(id => array.push(id));
            }
            let success = await this.fetch('/ad/set/resources', {method: 'post', data: {
                id: this.waitSetId,
                resources: array
            }});
            if (success === false) {
                this.resetLoadingBtn();
                return;
            }
            this.resourcesModel = false;
            setTimeout(() => this.doQuery(), 500);
        },
        selectionChange(selection) {
            let array = [];
            selection.forEach(item => array.push(item.id));
            this.selected.set(this.resources.page, array);
        },
        add() {
            this.model = true;
            this.modelTitle = '新增广告';
            this.loadingBtn = true;
            this.$refs['form'].resetFields();
        },
        cancel() {
            this.loadingBtn = false;
            this.selected.clear();
        },
        resetLoadingBtn() {
            this.loadingBtn = false;
            this.$nextTick(() => this.loadingBtn = true);
        }
    }
}