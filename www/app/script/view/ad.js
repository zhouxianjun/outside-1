/**
 * Created by alone on 17-6-29.
 */
'use strict';
import Table from "../../components/i-table.vue";
import Common from "../common";
import $ from "jquery";
import {getAttribute, ModeType, PositionType, ResourcesType, TempleType} from "../dic";
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
            ModeType,
            TempleType,
            PositionType,
            ResourcesType,
            loadingBtn: false,
            modelTitle: '',
            table: {
                columns: [{
                    type: 'selection',
                    width: 60,
                    align: 'center'
                }, {
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
                                        Object.keys(this.vo).forEach(key => this.vo[key] = params.row[key]);
                                        this.$refs['showDate'].currentValue = params.row['show_time'] ? new Date(params.row['show_time']) : null;
                                        this.$refs['voDate'].currentValue = [
                                            params.row['show_time_start'] ? new Date(params.row['show_time_start']) : null,
                                            params.row['show_time_end'] ? new Date(params.row['show_time_end']) : null];
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
                name: null,
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
            selected: new Map(),
            pushModel: false,
            pushVo: {
                mode: 2000,
                description: null,
                filter: null,
                max_send_num: 1
            },
            pushValidate: {
                max_send_num: [{type: 'number', required: true, trigger: 'blur' }],
                mode: [{type: 'number', required: true, trigger: 'change' }],
                filter: [{required: true, trigger: 'blur' }]
            },
            ads: null,
            selectedAd: new Map(),
            rePushModel: false,
            rePushVo: {
                mode: 2000,
                description: null,
                filter: null,
                max_send_num: 1,
                type: 1003,
                fault_click_rate: 0,
                show_day: 1,
                count_down: 3
            },
            rePushValidate: {
                max_send_num: [{type: 'number', required: true, trigger: 'blur' }],
                mode: [{type: 'number', required: true, trigger: 'change' }],
                filter: [{required: true, trigger: 'blur' }],
                type: [{type: 'number', required: true, trigger: 'change' }],
                fault_click_rate: [{type: 'number', required: true, trigger: 'blur' }],
                show_day: [{type: 'number', required: true, trigger: 'blur' }],
                count_down: [{type: 'number', required: true, trigger: 'blur' }]
            }
        }
    },
    async mounted() {
        await this.doQuery();
        Common.slimScroll(this.$refs['form'].$el);
        Common.slimScroll($('#selectDiv'));
        Common.slimScroll($('#pushDiv'));
        Common.slimScroll($('#rePushDiv'));
    },
    components: {
        Table
    },
    watch: {

    },
    methods: {
        async sendPush() {
            this.$refs['pushForm'].validate(async (valid) => {
                if (valid) {
                    let date = this.$refs['pushStartDate'].currentValue;
                    let success = await this.fetch('/push/ad', {method: 'post', data: {
                        push: Object.assign({
                            start_time: date ? date.getTime() : null,
                            type: 1000
                        }, this.pushVo),
                        ads: this.ads
                    }});
                    if (success === false) {
                        this.resetLoadingBtn();
                        return;
                    }
                    this.pushModel = false;
                    setTimeout(() => this.doQuery(), 500);
                } else {
                    this.resetLoadingBtn();
                    this.$Message.error('表单验证失败!');
                }
            });
        },
        async reSendPush() {
            this.$refs['rePushForm'].validate(async (valid) => {
                if (valid) {
                    let date = this.$refs['rePushStartDate'].currentValue;
                    const {fault_click_rate, show_day, count_down} = this.rePushVo;
                    let body = [];
                    this.ads.forEach(ad => {
                        switch (this.rePushVo.type) {
                            case 1003:
                                body.push({ad_id: ad, fault_click_rate});
                                break;
                            case 1004:
                                let showTime = this.$refs['rePushShowDate'].currentValue;
                                let showTimes = this.$refs['rePushDate'].currentValue;
                                body.push({ad_id: ad, show_day,
                                    show_time: showTime ? showTime.getTime() : null,
                                    show_time_start: showTimes[0] ? showTimes[0].getTime() : null,
                                    show_time_end: showTimes[1] ? showTimes[1].getTime() : null
                                });
                                break;
                            case 1005:
                                body.push({ad_id: ad, count_down});
                                break;
                        }
                    });
                    let success = await this.fetch('/push/ad/change', {method: 'post', data: {
                        push: Object.assign({
                            start_time: date ? date.getTime() : null
                        }, this.rePushVo),
                        body
                    }});
                    if (success === false) {
                        this.resetLoadingBtn();
                        return;
                    }
                    this.rePushModel = false;
                    setTimeout(() => this.doQuery(), 500);
                } else {
                    this.resetLoadingBtn();
                    this.$Message.error('表单验证失败!');
                }
            });
        },
        showPush() {
            if (!this.ads || this.ads.length <= 0) {
                this.$Message.error('请选择要推送的内容!');
                return;
            }
            this.pushModel = true;
            this.loadingBtn = true;
            this.$refs['pushForm'].resetFields();
            this.$refs['pushStartDate'].currentValue = null;
        },
        showRePush() {
            if (!this.ads || this.ads.length <= 0) {
                this.$Message.error('请选择要推送的内容!');
                return;
            }
            this.rePushModel = true;
            this.loadingBtn = true;
            this.$refs['rePushForm'].resetFields();
            this.$refs['rePushStartDate'].currentValue = null;
            this.$refs['rePushShowDate'].currentValue = null;
            this.$refs['rePushDate'].currentValue = [null, null];
        },
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
            Common.setCheckedData(this.selectedAd, this.table.data);
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
            Common.setCheckedData(this.selected, this.resources.data);
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
            this.resources.search.page = page;
            this.doResourcesQuery();
        },
        async changePageSizeByResources(size) {
            this.resources.search.pageSize = size;
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
            this.selected.set(this.resources.search.page, array);
        },
        selectionChangeAd(selection) {
            let array = [];
            selection.forEach(item => array.push(item.id));
            this.selectedAd.set(this.search.page, array);
            this.ads = array;
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
        },
        percentFormat(val) {
            return`${val}%`;
        }
    }
}