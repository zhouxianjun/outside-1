/**
 * Created by alone on 17-6-29.
 */
'use strict';
import Table from "../../components/i-table.vue";
import Common from '../common';
export default {
    data() {
        return {
            selectItem: null,
            loadingBtn: false,
            modelTitle: '',
            tree: {
                columns: [{
                    title: '名称',
                    key: 'name'
                }, {
                    title: '编码',
                    key: 'code'
                }, {
                    title: '描述',
                    key: 'txtDesc'
                }, {
                    title: '类型',
                    key: 'dropType'
                }],
                data: []
            },
            model: false,
            vo: {
                id: null,
                name: null,
                auth: null,
                description: null,
                status: null
            },
            interfaceValidate: {
                name: [{required: true, trigger: 'blur' }],
                auth: [{required: true, trigger: 'blur' }],
                status: [{type: 'boolean', required: true, trigger: 'blur' }]
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
        add() {
            this.model = true;
            this.modelTitle = '新增接口';
            Common.clearVo(this.vo);
        },
        addOrUpdate() {
            this.$refs['form'].validate(async (valid) => {
                if (valid) {
                    let url = this.vo.id ? '/permissions/interface/update' : '/permissions/interface/add';
                    let success = await this.fetch(url, {method: 'post', data: this.vo});
                    if (success === false) {
                        this.loadingBtn = false;
                        return;
                    }
                    this.selectItem = null;
                    this.model = false;
                    setTimeout(() => this.doQuery(), 500);
                } else {
                    this.$Message.error('表单验证失败!');
                }
            });
        },
        async doQuery() {
            Common.clearVo(this.vo);
            let result = await this.fetch('/permissions/menu/list/mgr');
            result && (this.tree.data = result.tree);
            this.loadingBtn = false;
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