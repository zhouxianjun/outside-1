/**
 * Created by alone on 17-6-29.
 */
'use strict';
import Table from "../../components/i-table.vue";
import Common from "../common";
import {getAttribute, ModeType, PushType} from "../dic";
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
            model: false
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