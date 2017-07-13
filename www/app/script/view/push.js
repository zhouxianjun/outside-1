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
                mode: 2000,
                description: '',
                filter: null,
                max_send_num: 1
            },
            adValidate: {
                max_send_num: [{type: 'number', required: true, trigger: 'blur' }],
                mode: [{type: 'number', required: true, trigger: 'change' }],
                filter: [{required: true, trigger: 'blur' }]
            },
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
            selected: new Map(),
            selectedList: new Map(),
            ads: []
        }
    },
    async mounted() {
        await this.doQuery();
        Common.slimScroll($('#selectAdDiv'));
        Common.slimScroll($('#pushAdDiv'));
    },
    components: {
        Table
    },
    watch: {

    },
    methods: {
        async pushAd() {
            if (!this.ads || !this.ads.length) {
                this.$Message.error('请选择要推送的广告!');
                this.resetLoadingBtn();
                return;
            }
            this.$refs['adForm'].validate(async (valid) => {
                if (valid) {
                    let date = this.$refs['adVoStartDate'].currentValue;
                    let success = await this.fetch('push/ad', {method: 'post', data: {
                        push: Object.assign({
                            start_time: date ? date.getTime() : null,
                            type: 1000
                        }, this.adVo),
                        ads: this.ads
                    }});
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
        showPushAd() {
            this.pushAdModel = true;
            this.loadingBtn = true;
            this.$refs['adForm'].resetFields();
        },
        showAd() {
            this.adModel = true;
            this.doAdQuery();
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
            for (let ids of this.selected.values()) {
                this.ad.data.forEach(item => {
                    let have = false;
                    ids.forEach(id => {
                        if (item.id === id) have = true;
                    });
                    item['_checked'] = have;
                });
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
            this.ad.search.page = page;
            this.doAdQuery();
        },
        async changePageSizeByAd(size) {
            this.ad.search.pageSize = size;
            this.doAdQuery();
        },
        selectionChange(selection) {
            let array = [];
            let objs = [];
            selection.forEach(item => array.push(item.id));
            selection.forEach(item => objs.push(item));
            this.selected.set(this.ad.search.page, array);
            this.selectedList.set(this.ad.search.page, objs);
        },
        cancel() {
            this.loadingBtn = false;
            this.selected.clear();
            this.selectedList.clear();
        },
        selectAd() {
            let array = [];
            this.adList = [];
            for (let ids of this.selected.values()) {
                ids.forEach(id => array.push(id));
            }
            for (let items of this.selectedList.values()) {
                items.forEach(item => this.adList.push(item));
            }
            this.adModel = false;
            this.ads = array;
        },
        resetLoadingBtn() {
            this.loadingBtn = false;
            this.$nextTick(() => this.loadingBtn = true);
        }
    }
}