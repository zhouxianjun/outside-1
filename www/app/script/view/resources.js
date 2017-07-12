/**
 * Created by alone on 17-6-29.
 */
'use strict';
import Table from "../../components/i-table.vue";
import Common from "../common";
import {getAttribute, ResourcesType} from "../dic";
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
                    type: '',
                    md5: '',
                    name: '',
                    pkg: ''
                }
            },
            ResourcesType,
            loadingBtn: false,
            modelTitle: '',
            table: {
                columns: [{
                    title: '名称',
                    key: 'name'
                }, {
                    title: '用户',
                    key: 'username'
                }, {
                    title: '类型',
                    key: 'type',
                    render: (h, params) => {
                        return h('span', getAttribute(ResourcesType, 'id', params.row.type).name);
                    }
                }, {
                    title: '资源地址',
                    key: 'path'
                }, {
                    title: 'MD5',
                    key: 'md5'
                }, {
                    title: '大小',
                    key: 'size'
                }, {
                    title: '包名',
                    key: 'pkg'
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
            removeModal: false,
            removeItem: null,
            vo: {
                name: null,
                type: 3000,
                path: null,
                pkg: null
            },
            resourcesValidate: {
                name: [{required: false, trigger: 'blur' }],
                type: [{type: 'number', required: true, trigger: 'change' }],
                path: [{required: false, trigger: 'blur' }],
                pkg: [{required: false, trigger: 'blur' }]
            },
            uploadData: {
                'x:type': null,
                'x:pkg': null,
                'x:user': null,
                token: null
            }
        }
    },
    async mounted() {
        await this.doQuery();
    },
    components: {
        Table
    },
    watch: {
        'vo.type'(t) {
            this.resourcesValidate.name[0].required = t === 3001;
            this.resourcesValidate.path[0].required = t === 3001;
            this.resourcesValidate.pkg[0].required = t === 3002;
        }
    },
    methods: {
        async add() {
            if (this.vo.type !== 3001) {
                this.resetLoadingBtn();
                this.$Message.warning('请上传文件');
                return;
            }
            this.$refs['form'].validate(async (valid) => {
                if (valid) {
                    let success = await this.fetch('/resources/add', {method: 'post', data: this.vo});
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
            let success = await this.fetch('/resources/remove', {method: 'post', data: {id: this.removeItem.id}});
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
            let list = await this.fetch('/resources/list/page', {params: this.search});
            list && (this.table.data = list.page.count === 0 ? [] : JSON.parse(list.page.items));
            list && (this.table.total = list.page.count);
            this.loadingBtn = false;
        },
        async changePage(page) {
            this.search.page = page;
            this.doQuery();
        },
        async changePageSize(size) {
            this.search.pageSize = size;
            this.doQuery();
        },
        showAdd() {
            this.model = true;
            this.modelTitle = '上传资源';
            this.loadingBtn = true;
            this.$refs['form'].resetFields();
        },
        async beforeUpload() {
            let res = await this.fetch('/resources/upload/token');
            if (!res) return false;
            this.uploadData.token = res.token;
            this.uploadData['x:type'] = this.vo.type;
            this.uploadData['x:pkg'] = this.vo.pkg;
            this.uploadData['x:user'] = this.$parent.user.id;
            return true;
        },
        async uploaded(res) {
            this.$refs['upload'].clearFiles();
            if (!res.success) {
                return;
            }
            this.model = false;
            setTimeout(() => this.doQuery(), 500);
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