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
                data: []
            },
            model: false,
            interfaceModel: false,
            waitSetMenuId: null,
            selectedInterface: null,
            vo: {
                id: null,
                name: null,
                path: null,
                icon: null,
                seq: null,
                description: null,
                show: null,
                status: null
            },
            menuValidate: {
                name: [{required: true, trigger: 'blur' }],
                seq: [{type: 'number', required: true, min: 0, max: 99, trigger: 'blur' }],
                show: [{type: 'boolean', required: true, trigger: 'blur' }],
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
            this.modelTitle = '新增菜单';
            Common.clearVo(this.vo);
        },
        addOrUpdate() {
            this.$refs['form'].validate(async (valid) => {
                if (valid) {
                    let url = this.vo.id ? '/permissions/menu/update' : '/permissions/menu/add';
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
        async setInterface() {
            let success = await this.fetch('/permissions/menu/interface/set', {method: 'post', data: {
                id: this.waitSetMenuId,
                interfaces: this.selectedInterface
            }});
            if (success === false) {
                this.loadingBtn = false;
                return;
            }
            this.selectItem = null;
            this.model = false;
            setTimeout(() => this.doQuery(), 500);
        },
        selectionChange(selection) {
            this.selectedInterface = selection;
        },
        async doQuery() {
            Common.clearVo(this.vo);
            let result = await this.fetch('/permissions/menu/list/mgr');
            result && (this.tree.data = result.tree);
            this.loadingBtn = false;
        }
    }
}