/**
 * Created by alone on 17-6-29.
 */
'use strict';
import Table from "../../../components/i-table.vue";
import Common from '../../common';
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
                    pkg: ''
                }
            },
            table: {
                columns: [{
                    title: '激活日期',
                    key: 'days'
                }, {
                    title: '激活数量',
                    key: 'nums'
                }, {
                    title: '渠道',
                    key: 'channel'
                }, {
                    title: '版本',
                    key: 'version'
                }, {
                    title: '厂商',
                    key: 'producer'
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
            let list = await this.fetch('/statistics/client/active', {params: this.search});
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