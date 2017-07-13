/**
 * Created by alone on 17-6-29.
 */
'use strict';
import Table from "../../components/i-table.vue";
import Common from "../common";
import $ from 'jquery';
import {getAttribute, PushType, ModeType, TempleType, PositionType} from "../dic";
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
                    mode: ''
                }
            },
            PushType,
            ModeType,
            TempleType,
            PositionType,
            loadingBtn: false,
            table: {
                columns: [{
                    title: '用户',
                    key: 'username'
                }, {
                    title: 'UUID',
                    key: 'uuid'
                }, {
                    title: '类型',
                    key: 'type',
                    render: (h, params) => {
                        return h('span', getAttribute(PushType, 'id', params.row[params.column.key]).name);
                    }
                }, {
                    title: '模式',
                    key: 'mode',
                    render: (h, params) => {
                        return h('span', getAttribute(ModeType, 'id', params.row[params.column.key]).name);
                    }
                }, {
                    title: '友盟消息',
                    key: 'msg_id'
                }, {
                    title: '发送频率',
                    key: 'max_send_num',
                    render: (h, params) => {
                        return Common.RENDER.APPEND(h, params)('条/秒');
                    }
                }, {
                    title: '发送时间',
                    key: 'start_time',
                    render: Common.RENDER.DATE
                }, {
                    title: '描述',
                    key: 'description'
                }, {
                    title: '创建时间',
                    key: 'create_time',
                    render: Common.RENDER.DATE
                }],
                data: [],
                total: 0
            },
            model: false,
            adModel: false,
            pushAdModel: false,
            adList: [],
            adVo: {
                id: null,
                temple: 6000,
                position: 5000,
                fault_click_rate: 0,
                show_day: 1,
                count_down: 3
            },
            adValidate: {
                temple: [{type: 'number', required: true, trigger: 'change' }],
                position: [{type: 'number', required: true, trigger: 'change' }],
                fault_click_rate: [{type: 'number', required: true, trigger: 'blur' }],
                show_day: [{type: 'number', required: true, trigger: 'blur' }],
                count_down: [{type: 'number', required: true, trigger: 'blur' }]
            },
            waitSetId: null,
            ad: {
                columns: [{
                    type: 'selection',
                    width: 60,
                    align: 'center'
                }, {
                    title: '用户',
                    key: 'username'
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
                        temple: '',
                        position: ''
                    }
                }
            },
            selected: new Map()
        }
    },
    async mounted() {
        await this.doQuery();
        Common.slimScroll(this.$refs['adForm'].$el);
        Common.slimScroll($('.ivu-table-body', this.$refs['table'].$el));
    },
    components: {
        Table
    },
    watch: {

    },
    methods: {
        async pushAd() {
            this.$refs['adForm'].validate(async (valid) => {
                if (valid) {
                    let date = this.$refs['adVoStartDate'].currentValue;
                    let success = await this.fetch('push/ad', {method: 'post', data: Object.assign({
                        start_time: date ? date.getTime() : null,
                        type: 1000
                    }, this.adVo)});
                    if (success === false) {
                        this.resetLoadingBtn();
                        return;
                    }
                    this.pushAdModel = false;
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
            let list = await this.fetch('/push/list/page', {params: this.search});
            list && (this.table.data = list.page.count === 0 ? [] : JSON.parse(list.page.items));
            list && (this.table.total = list.page.count);
            this.loadingBtn = false;
        },
        async doAdQuery() {
            let date = this.$refs['adDate'].currentValue;
            this.ad.search.query.start_time = date[0] instanceof Date ? Common.dateFormat(date[0]) : '';
            this.ad.search.query.end_time = date[1] instanceof Date ? Common.dateFormat(date[1]) : '';
            Common.voNumberToChar(this.ad.search.query);
            let list = await this.fetch('/ad/list/page', {params: this.ad.search});
            list && (this.ad.data = list.page.count === 0 ? [] : JSON.parse(list.page.items));
            list && (this.ad.total = list.page.count);
            this.ad.data.forEach(item => item['_checked'] = item.ow);
            for (let ids of this.selected.values()) {
                ids.forEach(id => this.ad.data.forEach(item => item['_checked'] = item.id === id));
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
        async changePageByAd(page) {
            this.ad.page = page;
            this.doAdQuery();
        },
        async changePageSizeByAd(size) {
            this.ad.pageSize = size;
            this.doAdQuery();
        },
        selectionChange(selection) {
            let array = [];
            selection.forEach(item => array.push(item.id));
            this.selected.set(this.ad.page, array);
        },
        cancel() {
            this.loadingBtn = false;
            this.selected.clear();
        },
        selectAd() {

        },
        resetLoadingBtn() {
            this.loadingBtn = false;
            this.$nextTick(() => this.loadingBtn = true);
        }
    }
}