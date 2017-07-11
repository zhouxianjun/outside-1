/**
 * Created by alone on 17-6-29.
 */
'use strict';
import Table from "../../components/i-table.vue";
import LoggerDetail from '../../components/logger-detail.vue';
import Common from '../common';
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
                    ip: '',
                    path: ''
                }
            },
            table: {
                columns: [{
                    type: 'expand',
                    width: 50,
                    render: (h, params) => {
                        return h(LoggerDetail, {
                            props: {
                                detail: params.row,
                                params: JSON.parse(params.row.params),
                                body: JSON.parse(params.row.body)
                            }
                        })
                    }
                }, {
                    title: '用户',
                    key: 'name'
                }, {
                    title: 'IP',
                    key: 'ip'
                }, {
                    title: '地址',
                    key: 'path'
                }, {
                    title: '耗时',
                    key: 'ms'
                }, {
                    title: 'METHOD',
                    key: 'method'
                }, {
                    title: '创建时间',
                    key: 'create_time',
                    render: Common.RENDER.DATE
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
            let list = await this.fetch('/admin/logger/list/page', {params: this.search});
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