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
                    <div class="col-sm-6">
                        <label>用户</label>
                        <div class="form-group">
                            <input type="text" v-model="search.query.user" class="form-control pull-right">
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <label>模板</label>
                        <div class="form-group">
                            <Select v-model="search.query.temple" class="pull-right">
                                <Option v-for="item in TempleType" :value="item.id" :key="item">{{ item.name }}</Option>
                            </Select>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-6">
                        <label>广告位</label>
                        <div class="form-group">
                            <Select v-model="search.query.position" class="pull-right">
                                <Option v-for="item in PositionType" :value="item.id" :key="item">{{ item.name }}</Option>
                            </Select>
                        </div>
                    </div>
                    <div class="col-sm-6">
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
                <span>广告列表</span>
                <button type="button" class="btn btn-default btn-sm pull-right" @click="add">
                    <span class="glyphicon glyphicon glyphicon-plus" aria-hidden="true"></span> 添加
                </button>
            </div>
            <div class="panel-body">
                <Table :columns="table.columns" :data="table.data" :headerColor="`#fff`" class="overflow-no-x"></Table>
                <div style="margin: 10px;overflow: hidden">
                    <div style="float: right;">
                        <Page :total="table.total" :show-sizer="true" placement="top" @on-page-size-change="changePageSize" @on-change="changePage"></Page>
                    </div>
                </div>
            </div>
        </div>
        <Modal v-model="model" :title="modelTitle" :loading="loadingBtn" @on-ok="addOrUpdate" @on-cancel="cancel">
            <Form ref="form" :model="vo" :label-width="80" :rules="adValidate" style="max-height: 400px;overflow: hidden">
                <Form-item label="模板" prop="temple">
                    <Select v-model="vo.temple">
                        <Option v-for="item in TempleType" :value="item.id" :key="item">{{ item.name }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="广告位" prop="position">
                    <Select v-model="vo.position" class="pull-right">
                        <Option v-for="item in PositionType" :value="item.id" :key="item">{{ item.name }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="误点率" prop="fault_click_rate">
                    <Input-number :min="0" :max="100" v-model="vo.fault_click_rate"></Input-number>
                </Form-item>
                <Form-item label="展示频率" prop="show_day">
                    <Input-number :min="1" :max="100" v-model="vo.show_day"></Input-number>
                </Form-item>
                <Form-item label="展示时间">
                    <Date-picker ref="showDate" type="datetime" placeholder="选择日期和时间"></Date-picker>
                </Form-item>
                <Form-item label="展示时间段">
                    <Date-picker placement="top" ref="voDate" style="width: 100%" type="datetimerange" placeholder="选择日期和时间"></Date-picker>
                </Form-item>
                <Form-item label="倒计时" prop="count_down">
                    <Input-number :min="0" :max="100" v-model="vo.count_down"></Input-number>
                </Form-item>
            </Form>
        </Modal>
        <Modal v-model="removeModal" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>删除确认</span>
            </p>
            <div style="text-align:center">
                <p>确定删除 {{removeItem ? removeItem.name : ''}} 吗?，删除后将无法恢复。</p>
                <p>是否继续删除？</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" @click="remove">删除</Button>
            </div>
        </Modal>
        <Modal v-model="resourcesModel" title="设置资源" :scrollable="true" :width="800" :loading="loadingBtn" @on-ok="setResources" @on-cancel="cancel">
            <div class="box box-default">
                <div class="box-header with-border">
                    <h3 class="box-title">查询</h3>

                    <div class="box-tools pull-right">
                        <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
                        <button type="button" class="btn btn-box-tool" @click="doResourcesQuery"><i class="glyphicon glyphicon-search"></i></button>
                    </div>
                </div>
                <div class="box-body">
                    <div class="row">
                        <div class="col-sm-4">
                            <label>用户</label>
                            <div class="form-group">
                                <input type="text" v-model="resources.search.query.user" class="form-control pull-right">
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <label>类型</label>
                            <div class="form-group">
                                <Select v-model="resources.search.query.type" class="pull-right">
                                    <Option v-for="item in ResourcesType" :value="item.id" :key="item">{{ item.name }}</Option>
                                </Select>
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <label>MD5</label>
                            <div class="form-group">
                                <input type="text" v-model="resources.search.query.md5" class="form-control pull-right">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-4">
                            <label>名称</label>
                            <div class="form-group">
                                <input type="text" v-model="resources.search.query.name" class="form-control pull-right">
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <label>包名</label>
                            <div class="form-group">
                                <input type="text" v-model="resources.search.query.pkg" class="form-control pull-right">
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <label>创建时间</label>
                            <div class="form-group">
                                <Date-picker ref="resourcesDate" style="width: 100%" type="datetimerange" placeholder="选择日期和时间"></Date-picker>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Table ref="table" :height="300" :columns="resources.columns" :data="resources.data" @on-selection-change="selectionChange"></Table>
            <div style="margin: 10px 10px 0 10px;overflow: hidden">
                <div style="float: right;">
                    <Page :total="resources.total" :show-sizer="true" placement="top" @on-page-size-change="changePageSizeByResources" @on-change="changePageByResources"></Page>
                </div>
            </div>
        </Modal>
    </div>
</template>
<script>
    import view from '../script/view/ad';
    export default view;
</script>