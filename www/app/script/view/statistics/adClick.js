/**
 * Created by alone on 17-6-29.
 */
'use strict';
import Table from "../../../components/i-table.vue";
import Common from '../../common';
import {getAttribute, PositionType, TempleType} from "../../dic";
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
                    version: '',
                    producer: '',
                    channel: '',
                    name: '',
                    temple: '',
                    position: ''
                }
            },
            PositionType,
            TempleType,
            table: {
                columns: [{
                    title: '广告名称',
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
                    title: '渠道',
                    key: 'channel'
                }, {
                    title: '版本',
                    key: 'version'
                }, {
                    title: '厂商',
                    key: 'producer'
                }, {
                    title: '点击次数',
                    key: 'count'
                }, {
                    title: '推送次数',
                    key: 'push_count'
                }],
                data: [],
                total: 0
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
        async doQuery() {
            let date = this.$refs['date'].currentValue;
            this.search.query.start_time = date[0] instanceof Date ? Common.dateFormat(date[0]) : '';
            this.search.query.end_time = date[1] instanceof Date ? Common.dateFormat(date[1]) : '';
            Common.voNumberToChar(this.search.query);
            let list = await this.fetch('/statistics/ad/click', {params: this.search});
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
        }
    }
}