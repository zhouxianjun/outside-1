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
import {province, city, getAttribute} from '../dic';
export default {
    data() {
        return {
            loadingBtn: false,
            userTitle: '',
            tree: [],
            province,
            cityList: [],
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
            userModel: false,
            roleModel: false,
            removeModal: false,
            removeItem: null,
            waitSetUserId: null,
            vo: {
                id: null,
                pid: null,
                username: null,
                name: null,
                password: null,
                phone: null,
                real_name: null,
                email: null,
                province: null,
                city: null,
                company: null,
                status: null
            },
            userValidate: {
                username: [
                    {required: true, trigger: 'blur' },
                    {min: 3, max: 20, message: '必须是3～20个字符之间', trigger: 'blur' },
                    {pattern: /^[a-zA-Z0-9_]{3,16}$/, message: '只能为字母数字字符或下划线', trigger: 'blur' }
                ],
                name: [{required: true, trigger: 'blur' }],
                password: [{required: true, pattern: /^[a-zA-Z]\w{5,17}$/, trigger: 'blur'}],
                phone: [{required: true, pattern: /(^(\d{3,4}-)?\d{7,8})$|(1[3|4|5|8][0-9]{9})/, message: '请输入正确的电话或手机号码', trigger: 'blur'}],
                real_name: [{required: false, pattern: /[\u4E00-\u9FA5]{2,5}(?:·[\u4E00-\u9FA5]{2,5})*/, message: '请输入正确的姓名', trigger: 'blur'}],
                email: [{type: 'email', required: true, trigger: 'blur' }],
                city: [{ type: 'number', required: true, message: '请选择城市', trigger: 'change' }],
                status: [{type: 'boolean', required: true, trigger: 'blur' }]
            }
        }
    },
    async mounted() {
        this.initTree();
        await this.doQuery();
        Common.slimScroll(this.$refs['form'].$el);
    },
    components: {
        Table
    },
    watch: {
        'vo.province'(val) {
            this.cityList = getAttribute(city, 'province', val, true);
        }
    },
    methods: {
        add(pid) {
            this.userTitle = '新增用户';
            this.userModel = true;
            this.loadingBtn = true;
            Common.clearVo(this.vo);
            this.vo.pid = isNaN(pid) ? 1 : pid;
            this.vo.status = false;
            this.userValidate.password.required = true;
        },
        update(data) {
            this.userTitle = '修改用户';
            this.$refs['form'].resetFields();
            Object.keys(this.vo).forEach(key => this.vo[key] = data[key]);
            this.vo.password = null;
            this.userValidate.password.required = false;
            this.userModel = true;
            this.loadingBtn = true;
        },
        addOrUpdate() {
            this.$refs['form'].validate(async (valid) => {
                if (valid) {
                    let url = this.vo.id ? '/permissions/user/update' : '/permissions/user/add';
                    let success = await this.fetch(url, {method: 'post', data: this.vo});
                    if (success === false) {
                        this.resetLoadingBtn();
                        return;
                    }
                    this.userModel = false;
                    setTimeout(() => this.doQuery(), 500);
                } else {
                    this.resetLoadingBtn();
                    this.$Message.error('表单验证失败!');
                }
            });
        },
        async remove() {
            if (!this.removeItem) return;
            let success = await this.fetch('/permissions/user/del', {method: 'post', data: {id: this.removeItem.id}});
            if (success === false) {
                this.resetLoadingBtn();
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
        async showRole(id) {
            this.roleModel = true;
            let list = await this.fetch('/permissions/role/list/set', {params: {id}});
            Common.renderTree(list.tree, item => {
                item.title = item.name;
                item.checked = item.ow;
            });
            this.tree = list.tree;
            this.waitSetUserId = id;
            this.loadingBtn = true;
        },
        async setRole() {
            let roles = [];
            this.$refs['tree'].getCheckedNodes().forEach(n => roles.push(n.id));
            let success = await this.fetch('/permissions/user/role/set', {method: 'post', data: {
                id: this.waitSetUserId,
                roles
            }});
            if (success === false) {
                this.resetLoadingBtn();
                return;
            }
            this.roleModel = false;
            setTimeout(() => this.doQuery(), 500);
        },
        async doQuery() {
            Common.clearVo(this.vo);
            let result = await this.fetch('/permissions/user/list');
            Common.renderTree(result.tree, item => item.title = item.name);
            $('#user-grid').fancytree('option', 'source', result.tree);
            this.loadingBtn = false;
        },
        initTree() {
            $('#user-grid').fancytree({
                autoScroll: true,
                source: [],
                extensions: ["table"],
                table: {
                    nodeColumnIdx: 0
                },
                renderColumns: (event, data) => {
                    let node = data.node,
                        $tdList = $(node.tr).find(">td");
                    $tdList.eq(1).text(node.data.username);
                    $tdList.eq(2).html(Common.emailFormat(node.data.email));
                    $tdList.eq(3).text(node.data.phone);
                    $tdList.eq(4).text(getAttribute(province, 'id', node.data.province).name);
                    $tdList.eq(5).text(getAttribute(city, 'id', node.data.city).name);
                    $tdList.eq(6).html(Common.statusFormat(node.data.status));
                    $tdList.eq(7).html(Common.dateFormat(node.data.create_time));
                    $tdList.eq(8).html(`<button type="button" class="btn btn-primary btn-sm margin-r-5">设置角色</button><button type="button" class="btn btn-warning btn-sm margin-r-5">修改</button><button type="button" class="btn btn-primary btn-sm margin-r-5">新增子用户</button><button type="button" class="btn btn-danger btn-sm">删除</button>`);
                    let $button = $('button', $tdList.eq(8));
                    $button.eq(0).on('click', () => this.showRole(node.data.id));
                    $button.eq(1).on('click', () => this.update(node.data));
                    $button.eq(2).on('click', () => this.add(node.data.id));
                    $button.eq(3).on('click', () => this.showRemove(node.data));
                }
            });
        },
        resetLoadingBtn() {
            this.loadingBtn = false;
            this.$nextTick(() => this.loadingBtn = true);
        }
    }
}