/**
 * Created by alone on 17-6-29.
 */
'use strict';
import Table from "../../components/i-table.vue";
import Common from '../common';
import $ from 'jquery';
import 'jquery-ui';
import 'jquery.fancytree/dist/skin-lion/ui.fancytree.min.css';
import 'jquery.fancytree/dist/jquery.fancytree-all-deps.min';
export default {
    data() {
        return {
            loadingBtn: false,
            modelTitle: '',
            tree: null,
            table: {
                columns: [{
                    type: 'selection',
                    width: 60,
                    align: 'center'
                }, {
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
            menuModel: false,
            interfaceModel: false,
            removeModal: false,
            removeItem: null,
            waitSetMenuId: null,
            selectedInterface: null,
            vo: {
                id: null,
                pid: null,
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
        this.initTree();
        await this.doQuery();
        Common.slimScroll($('.ivu-table-body', this.$refs['table'].$el));
    },
    components: {
        Table
    },
    methods: {
        add(pid) {
            this.modelTitle = '新增菜单';
            this.menuModel = true;
            this.loadingBtn = true;
            Common.clearVo(this.vo);
            this.vo.pid = isNaN(pid) ? 0 : pid;
            this.vo.show = false;
            this.vo.status = false;
        },
        update(data) {
            this.modelTitle = '修改接口';
            this.$refs['form'].resetFields();
            Object.keys(this.vo).forEach(key => this.vo[key] = data[key]);
            this.menuModel = true;
            this.loadingBtn = true;
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
                    this.menuModel = false;
                    setTimeout(() => this.doQuery(), 500);
                } else {
                    this.loadingBtn = false;
                    this.$Message.error('表单验证失败!');
                }
            });
        },
        async remove() {
            if (!this.removeItem) return;
            let success = await this.fetch('/permissions/menu/del', {method: 'post', data: {id: this.removeItem.id}});
            if (success === false) {
                this.loadingBtn = false;
                return;
            }
            this.removeModal = false;
            setTimeout(() => this.doQuery(), 500);
        },
        showRemove(data) {
            this.removeItem = data;
            this.removeModal = true;
        },
        async showInterface(id) {
            this.interfaceModel = true;
            let list = await this.fetch('/permissions/interface/list/set', {params: {menu: id}});
            list && (this.table.data = list.interfaces);
            this.table.data.forEach(item => item['_checked'] = item.ow);
            this.waitSetMenuId = id;
            this.loadingBtn = true;
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
            this.interfaceModel = false;
            setTimeout(() => this.doQuery(), 500);
        },
        selectionChange(selection) {
            this.selectedInterface = [];
            selection.forEach(item => this.selectedInterface.push(item.id));
        },
        async doQuery() {
            Common.clearVo(this.vo);
            let result = await this.fetch('/permissions/menu/list/mgr');
            Common.renderTree(result.tree, item => item.title = item.name);
            this.tree = result.tree;
            $('#menu-grid').fancytree('option', 'source', result.tree);
            this.loadingBtn = false;
        },
        initTree() {
            $('#menu-grid').fancytree({
                autoScroll: true,
                source: [],
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
                    $tdList.eq(6).html(`<button type="button" class="btn btn-primary btn-sm margin-r-5">设置接口</button><button type="button" class="btn btn-warning btn-sm margin-r-5">修改</button><button type="button" class="btn btn-primary btn-sm margin-r-5">新增子菜单</button><button type="button" class="btn btn-danger btn-sm">删除</button>`);
                    let $button = $('button', $tdList.eq(6));
                    $button.eq(0).on('click', () => this.showInterface(node.data.id));
                    $button.eq(1).on('click', () => this.update(node.data));
                    $button.eq(2).on('click', () => this.add(node.data.id));
                    $button.eq(3).on('click', () => this.showRemove(node.data));
                }
            });
        }
    }
}