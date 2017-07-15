/**
 * Created by alone on 17-6-29.
 */
'use strict';
import Table from "../../components/i-table.vue";
import InstallDetail from '../../components/install-detail.vue';
import Common from "../common";
import $ from 'jquery';
import {getAttribute, InstallTimeType, ModeType, NetType, InstallPathType, ResourcesType} from "../dic";
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
                    pkg: ''
                }
            },
            ModeType,
            InstallTimeType,
            NetType,
            InstallPathType,
            ResourcesType,
            loadingBtn: false,
            modelTitle: '',
            table: {
                columns: [{
                    type: 'expand',
                    width: 50,
                    render: (h, params) => {
                        return h(InstallDetail, {
                            props: {
                                detail: params.row
                            }
                        })
                    }
                }, {
                    type: 'selection',
                    width: 60,
                    align: 'center',
                    disableCheck: true
                }, {
                    title: '用户',
                    key: 'username'
                }, {
                    title: '图片',
                    key: 'image_name'
                }, {
                    title: 'APK',
                    key: 'resources_name'
                }, {
                    title: '打开次数',
                    key: 'open_count',
                    render: (h, params) => {
                        return Common.RENDER.APPEND(h, params)('次');
                    }
                }, {
                    title: '展示时长',
                    key: 'show_time',
                    render: (h, params) => {
                        return Common.RENDER.APPEND(h, params)('秒');
                    }
                }, {
                    title: '保留时间',
                    key: 'keep_time',
                    render: (h, params) => {
                        return Common.RENDER.APPEND(h, params)('秒');
                    }
                }, {
                    title: '上报限制',
                    key: 'upload_limit',
                    render: (h, params) => {
                        return Common.RENDER.APPEND(h, params)('秒');
                    }
                }, {
                    title: '最大次数',
                    key: 'max_count',
                    render: (h, params) => {
                        return Common.RENDER.APPEND(h, params)('次');
                    }
                }, {
                    title: '创建时间',
                    key: 'create_time',
                    render: Common.RENDER.DATE
                }, {
                    title: '操作',
                    key: 'action',
                    width: 200,
                    align: 'center',
                    disableCheck: true,
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    disabled: params.row['push_count'] > 0,
                                    loading: this.loadingBtn
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: async () => {
                                        this.model = true;
                                        this.modelTitle = '修改';
                                        this.loadingBtn = true;
                                        Object.keys(this.vo).forEach(key => this.vo[key] = params.row[key]);
                                        this.$refs['installTime'].currentValue = [
                                            params.row['start_time'] ? new Date(params.row['start_time']) : null,
                                            params.row['end_time'] ? new Date(params.row['end_time']) : null];
                                        this.$refs['pointTime'].currentValue = params.row['point_time'] ? new Date(params.row['point_time']) : null;
                                        this.imageName = params.row['image_name'];
                                        this.apkName = params.row['resources_name'];
                                    }
                                }
                            }, '修改'),
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small',
                                    loading: this.loadingBtn
                                },
                                on: {
                                    click: async () => {
                                        this.removeModal = true;
                                        this.removeItem = params.row;
                                        this.loadingBtn = true;
                                    }
                                }
                            }, '删除')
                        ]);
                    }
                }],
                data: [],
                total: 0
            },
            model: false,
            resourcesModel: false,
            removeModal: false,
            removeItem: null,
            imageName: '',
            apkName: '',
            vo: {
                id: null,
                image: null,
                resources: null,
                time_type: 7003,
                net_open: true,
                open_count: 0,
                show_time: 1,
                net_type: 7102,
                keep_time: 0,
                upload_limit: 0,
                install_path: 7202,
                max_count: 0
            },
            installValidate: {
                image: [{type: 'number', required: true, trigger: 'blur' }],
                resources: [{type: 'number', required: true, trigger: 'blur' }],
                time_type: [{type: 'number', required: true, trigger: 'change' }],
                net_open: [{type: 'boolean', required: true, trigger: 'blur' }],
                open_count: [{type: 'number', required: true, trigger: 'blur' }],
                show_time: [{type: 'number', required: true, trigger: 'blur' }],
                net_type: [{type: 'number', required: true, trigger: 'change' }],
                keep_time: [{type: 'number', required: true, trigger: 'blur' }],
                upload_limit: [{type: 'number', required: true, trigger: 'blur' }],
                install_path: [{type: 'number', required: true, trigger: 'change' }],
                max_count: [{type: 'number', required: true, trigger: 'blur' }]
            },
            resources: {
                columns: [{
                    title: '名称',
                    key: 'name'
                }, {
                    title: 'MD5',
                    key: 'md5'
                }, {
                    title: '大小',
                    key: 'size'
                }, {
                    title: '创建时间',
                    key: 'create_time',
                    render: Common.RENDER.DATE
                }, {
                    title: '操作',
                    key: 'action',
                    width: 200,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                on: {
                                    click: async () => {
                                        this.resourcesModel = false;
                                        if (this.resources.search.query.type === '3000') {
                                            this.vo.image = params.row.id;
                                            this.imageName = params.row.name;
                                        } else {
                                            this.vo.resources = params.row.id;
                                            this.apkName = params.row.name;
                                        }
                                    }
                                }
                            }, '选择')
                        ]);
                    }
                }],
                data: [],
                total: 0,
                search: {
                    page: 1,
                    pageSize: 10,
                    sortName: 'create_time',
                    sortDir: 'desc',
                    query: {
                        user: '',
                        type: '',
                        md5: '',
                        name: '',
                        pkg: ''
                    }
                }
            },
            pushModel: false,
            pushVo: {
                mode: 2000,
                description: null,
                filter: null,
                max_send_num: 1
            },
            pushValidate: {
                max_send_num: [{type: 'number', required: true, trigger: 'blur' }],
                mode: [{type: 'number', required: true, trigger: 'change' }],
                filter: [{required: true, trigger: 'blur' }]
            },
            installs: null,
            selected: new Map()
        }
    },
    async mounted() {
        await this.doQuery();
        Common.slimScroll(this.$refs['form'].$el);
        Common.slimScroll($('#selectDiv'));
        Common.slimScroll($('#pushDiv'));
    },
    components: {
        Table
    },
    watch: {

    },
    methods: {
        async sendPush() {
            this.$refs['pushForm'].validate(async (valid) => {
                if (valid) {
                    let date = this.$refs['pushStartDate'].currentValue;
                    let success = await this.fetch('push/install', {method: 'post', data: {
                        push: Object.assign({
                            start_time: date ? date.getTime() : null,
                            type: 1001
                        }, this.pushVo),
                        installs: this.installs
                    }});
                    if (success === false) {
                        this.resetLoadingBtn();
                        return;
                    }
                    this.pushModel = false;
                    setTimeout(() => this.doQuery(), 500);
                } else {
                    this.resetLoadingBtn();
                    this.$Message.error('表单验证失败!');
                }
            });
        },
        showPush() {
            if (!this.installs || this.installs.length <= 0) {
                this.$Message.error('请选择要推送的内容!');
                return;
            }
            this.pushModel = true;
            this.loadingBtn = true;
            this.$refs['pushForm'].resetFields();
        },
        async addOrUpdate() {
            if (this.vo.time_type === 7001 && !this.$refs['installTime'].currentValue[0]) {
                this.$Message.error('请选择安装时间段!');
                return;
            }
            if (this.vo.time_type === 7002 && !this.$refs['pointTime'].currentValue) {
                this.$Message.error('请选择安装时间段!');
                return;
            }
            this.$refs['form'].validate(async (valid) => {
                if (valid) {
                    let url = this.vo.id ? '/install/update' : '/install/add';
                    let dates = this.vo.time_type === 7001 ? this.$refs['installTime'].currentValue : [null, null];
                    let date = this.vo.time_type === 7002 ? this.$refs['pointTime'].currentValue : null;
                    let success = await this.fetch(url, {method: 'post', data: Object.assign({
                        start_time: dates[0] ? dates[0].getTime() : null,
                        end_time: dates[0] ? dates[1].getTime() : null,
                        point_time: date ? date.getTime() : null
                    }, this.vo)});
                    if (success === false) {
                        this.resetLoadingBtn();
                        return;
                    }
                    this.model = false;
                    setTimeout(() => this.doQuery(), 500);
                } else {
                    this.resetLoadingBtn();
                    this.$Message.error('表单验证失败!');
                }
            });
        },
        async remove() {
            if (!this.removeItem) return;
            let success = await this.fetch('/install/remove', {method: 'post', data: {id: this.removeItem.id}});
            if (success === false) {
                this.resetLoadingBtn();
                return;
            }
            this.removeItem = null;
            this.removeModal = false;
            setTimeout(() => this.doQuery(), 500);
        },
        async doQuery() {
            let date = this.$refs['date'].currentValue;
            this.search.query.start_time = date[0] instanceof Date ? Common.dateFormat(date[0]) : '';
            this.search.query.end_time = date[1] instanceof Date ? Common.dateFormat(date[1]) : '';
            Common.voNumberToChar(this.search.query);
            let list = await this.fetch('/install/list/page', {params: this.search});
            list && (this.table.data = list.page.count === 0 ? [] : JSON.parse(list.page.items));
            list && (this.table.total = list.page.count);
            this.loadingBtn = false;
            Common.setCheckedData(this.selected, this.table.data);
        },
        async doResourcesQuery() {
            Common.voNumberToChar(this.resources.search.query);
            let list = await this.fetch('/resources/list/page', {params: this.resources.search});
            list && (this.resources.data = list.page.count === 0 ? [] : JSON.parse(list.page.items));
            list && (this.resources.total = list.page.count);
        },
        selectionChange(selection) {
            let array = [];
            selection.forEach(item => array.push(item.id));
            this.selected.set(this.search.page, array);
            this.installs = array;
        },
        async changePage(page) {
            this.search.page = page;
            this.doQuery();
        },
        async changePageSize(size) {
            this.search.pageSize = size;
            this.doQuery();
        },
        async changePageByResources(page) {
            this.resources.search.page = page;
            this.doResourcesQuery();
        },
        async changePageSizeByResources(size) {
            this.resources.search.pageSize = size;
            this.doResourcesQuery();
        },
        add() {
            this.model = true;
            this.modelTitle = '新增';
            this.loadingBtn = true;
            this.$refs['form'].resetFields();
            this.imageName = null;
            this.apkName = null;
            this.$refs['installTime'].currentValue = null;
            this.$refs['pointTime'].currentValue = null;
        },
        showResources(is) {
            this.resourcesModel = true;
            this.resources.search.query.type = is ? '3002' : '3000';
            this.doResourcesQuery();
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