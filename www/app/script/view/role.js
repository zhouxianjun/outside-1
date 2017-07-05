/**
 * Created by alone on 17-6-29.
 */
'use strict';
import Table from "../../components/i-table.vue";
import Common from "../common";
import $ from "jquery";
import "jquery-ui";
import "jquery.fancytree/dist/skin-lion/ui.fancytree.min.css";
import "jquery.fancytree/dist/jquery.fancytree-all-deps.min";
export default {
    data() {
        return {
            loadingBtn: false,
            roleTitle: '',
            tree: [],
            table: {
                columns: [{
                    type: 'selection',
                    width: 60,
                    align: 'center'
                }, {
                    title: '名称',
                    key: 'name'
                }, {
                    title: '路径',
                    key: 'path'
                }, {
                    title: '状态',
                    key: 'status',
                    render: Common.RENDER.STATUS
                }],
                data: []
            },
            roleModel: false,
            menuModel: false,
            removeModal: false,
            removeItem: null,
            waitSetRoleId: null,
            vo: {
                id: null,
                pid: null,
                name: null,
                only_login: null,
                status: null
            },
            roleValidate: {
                name: [{required: true, trigger: 'blur' }],
                only_login: [{type: 'boolean', required: true, trigger: 'blur' }],
                status: [{type: 'boolean', required: true, trigger: 'blur' }]
            }
        }
    },
    async mounted() {
        this.initTree();
        await this.doQuery();
    },
    components: {
        Table
    },
    methods: {
        add(pid) {
            this.roleTitle = '新增角色';
            this.roleModel = true;
            this.loadingBtn = true;
            Common.clearVo(this.vo);
            this.vo.pid = isNaN(pid) ? 1 : pid;
        },
        update(data) {
            this.roleTitle = '修改角色';
            this.$refs['form'].resetFields();
            Object.keys(this.vo).forEach(key => this.vo[key] = data[key]);
            this.roleModel = true;
            this.loadingBtn = true;
        },
        addOrUpdate() {
            this.$refs['form'].validate(async (valid) => {
                if (valid) {
                    let url = this.vo.id ? '/permissions/role/update' : '/permissions/role/add';
                    let success = await this.fetch(url, {method: 'post', data: this.vo});
                    if (success === false) {
                        this.loadingBtn = false;
                        return;
                    }
                    this.roleModel = false;
                    setTimeout(() => this.doQuery(), 500);
                } else {
                    this.loadingBtn = false;
                    this.$Message.error('表单验证失败!');
                }
            });
        },
        async remove() {
            if (!this.removeItem) return;
            let success = await this.fetch('/permissions/role/del', {method: 'post', data: {id: this.removeItem.id}});
            if (success === false) {
                this.loadingBtn = false;
                return;
            }
            this.removeModal = false;
            this.removeItem = null;
            setTimeout(() => this.doQuery(), 500);
        },
        showRemove(data) {
            this.removeItem = data;
            this.removeModal = true;
        },
        async showMenu(id) {
            this.menuModel = true;
            let list = await this.fetch('/permissions/menu/list/set', {params: {role: id}});
            Common.renderTree(list.tree, item => {
                item.title = item.name;
                item.checked = item.ow;
            });
            this.tree = list.tree;
            this.waitSetRoleId = id;
            this.loadingBtn = true;
        },
        async setMenu() {
            let menus = [];
            this.$refs['tree'].getCheckedNodes().forEach(n => menus.push(n.id));
            let success = await this.fetch('/permissions/role/menu/set', {method: 'post', data: {
                id: this.waitSetRoleId,
                menus: menus
            }});
            if (success === false) {
                this.loadingBtn = false;
                return;
            }
            this.menuModel = false;
            setTimeout(() => this.doQuery(), 500);
        },
        async doQuery() {
            Common.clearVo(this.vo);
            let result = await this.fetch('/permissions/role/list/mgr');
            Common.renderTree(result.tree, item => item.title = item.name);
            $('#role-grid').fancytree('option', 'source', result.tree);
            this.loadingBtn = false;
        },
        initTree() {
            $('#role-grid').fancytree({
                autoScroll: true,
                source: [],
                extensions: ["table"],
                table: {
                    nodeColumnIdx: 0
                },
                renderColumns: (event, data) => {
                    let node = data.node,
                        $tdList = $(node.tr).find(">td");
                    $tdList.eq(1).html(Common.statusFormat(node.data.only_login, '单人', '多人'));
                    $tdList.eq(2).html(Common.statusFormat(node.data.status));
                    $tdList.eq(3).text(Common.dateFormat(node.data.create_time));
                    $tdList.eq(4).html(Common.dateFormat(node.data.update_time));
                    $tdList.eq(5).html(`<button type="button" class="btn btn-primary btn-sm margin-r-5">设置菜单</button><button type="button" class="btn btn-warning btn-sm margin-r-5">修改</button><button type="button" class="btn btn-primary btn-sm margin-r-5">新增子角色</button><button type="button" class="btn btn-danger btn-sm">删除</button>`);
                    let $button = $('button', $tdList.eq(5));
                    $button.eq(0).on('click', () => this.showMenu(node.data.id));
                    $button.eq(1).on('click', () => this.update(node.data));
                    $button.eq(2).on('click', () => this.add(node.data.id));
                    $button.eq(3).on('click', () => this.showRemove(node.data));
                }
            });
        }
    }
}