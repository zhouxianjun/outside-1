/**
 * Created by alone on 17-6-29.
 */
'use strict';
import Table from "../../components/i-table.vue";
import Common from '../common';
import Vue from 'vue';
import 'jquery-ui';
import 'jquery.fancytree/dist/skin-lion/ui.fancytree.min.css';
import 'jquery.fancytree/dist/jquery.fancytree-all-deps.min';
export default {
    data() {
        return {
            selectItem: null,
            loadingBtn: false,
            modelTitle: '',
            tree: null,
            treeHeight: 100,
            table: {
                columns: [{
                    title: '名称',
                    key: 'name'
                }, {
                    title: '接口',
                    key: 'auth'
                }, {
                    title: '描述',
                    key: 'description'
                }, {
                    title: '状态',
                    key: 'status',
                    render: Common.RENDER.STATUS
                }],
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
            Common.renderTree(result.tree, item => item.title = item.name);
            this.tree = result.tree;
            $('#menu-grid').fancytree({
                source: result.tree,
                extensions: ["table"],
                table: {
                    nodeColumnIdx: 0
                },
                renderColumns: (event, data) => {
                    let node = data.node,
                        $tdList = $(node.tr).find(">td");
                    $tdList.eq(1).text(node.data.seq);
                    $tdList.eq(2).html(`<i class="fa ${node.data.icon}"></i>`);
                    $tdList.eq(3).text(node.data.path);
                    $tdList.eq(4).html(Common.statusFormat(node.data.show, '显示', '隐藏'));
                    $tdList.eq(5).html(Common.statusFormat(node.data.status));
                    let res = Vue.compile(`<div><template><Button type="primary">Primary</Button></template></div>`);
                    let component = new Vue({
                        data: {},
                        render: res.render,
                        staticRenderFns: res.staticRenderFns
                    });
                    $tdList.eq(6).html(component.$mount().$el);
                }
            });
            this.loadingBtn = false;
        }
    }
}