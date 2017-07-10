<template>
    <div>
        <div class="box box-default">
            <div class="box-header with-border">
                <h3 class="box-title">查询</h3>

                <div class="box-tools pull-right">
                    <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
                    <button type="button" class="btn btn-box-tool" @click="doQuery"><i class="glyphicon glyphicon-search"></i></button>
                </div>
            </div>
            <div class="box-body">
                <div class="row">
                    <div class="col-sm-4">
                        <label>用户</label>
                        <div class="form-group">
                            <input type="text" v-model="search.query.user" class="form-control pull-right">
                        </div>
                    </div>
                    <div class="col-sm-4">
                        <label>类型</label>
                        <div class="form-group">
                            <Select v-model="search.query.type" class="form-control pull-right">
                                <Option v-for="item in ResourcesType" :value="item.id" :key="item">{{ item.name }}</Option>
                            </Select>
                        </div>
                    </div>
                    <div class="col-sm-4">
                        <label>MD5</label>
                        <div class="form-group">
                            <input type="text" v-model="search.query.md5" class="form-control pull-right">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-4">
                        <label>名称</label>
                        <div class="form-group">
                            <input type="text" v-model="search.query.name" class="form-control pull-right">
                        </div>
                    </div>
                    <div class="col-sm-4">
                        <label>包名</label>
                        <div class="form-group">
                            <input type="text" v-model="search.query.pkg" class="form-control pull-right">
                        </div>
                    </div>
                    <div class="col-sm-4">
                        <label>创建时间</label>
                        <div class="form-group">
                            <Date-picker ref="date" style="width: 100%" type="datetimerange" placeholder="选择日期和时间"></Date-picker>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="panel panel-default i-panel-default">
            <div class="panel-heading">
                <span>资源列表</span>
                <button type="button" class="btn btn-default btn-sm pull-right" @click="add">
                    <span class="glyphicon glyphicon glyphicon-plus" aria-hidden="true"></span> 添加
                </button>
            </div>
            <div class="panel-body">
                <Table :columns="table.columns" :data="table.data" :headerColor="`#fff`"></Table>
                <div style="margin: 10px;overflow: hidden">
                    <div style="float: right;">
                        <Page :total="table.total" :show-sizer="true" placement="top" @on-page-size-change="changePageSize" @on-change="changePage"></Page>
                    </div>
                </div>
            </div>
        </div>
        <Modal v-model="model" :title="modelTitle" @on-ok="addOrUpdate">
            <Form ref="form" :model="vo" :label-width="80" :rules="resourcesValidate">
                <Form-item label="名称" prop="name">
                    <Input v-model="vo.name" placeholder="请输入接口名"/>
                </Form-item>
                <Form-item label="类型" prop="type">
                    <Select v-model="vo.type">
                        <Option v-for="item in ResourcesType" :value="item.id" :key="item">{{ item.name }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="地址" prop="path" v-if="vo.type == 3001">
                    <Input v-model="vo.path"/>
                </Form-item>
                <Form-item label="包名" prop="pkg" v-if="vo.type == 3002">
                    <Input v-model="vo.pkg"/>
                </Form-item>
                <Form-item label="文件" v-if="vo.type != 3001">
                    <div>
                        <template v-if="vo.md5 && vo.md5 != ''">
                            <img :src="image">
                        </template>
                        <template v-else>
                            <Progress :percent="percentage" hide-info></Progress>
                        </template>
                    </div>
                    <Upload action="//jsonplaceholder.typicode.com/posts/" v-if="vo.type != 3000">
                        <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
                    </Upload>
                </Form-item>
            </Form>
        </Modal>
    </div>
</template>
<script>
    import view from '../script/view/resources';
    export default view;
</script>