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
                        <label>类型</label>
                        <div class="form-group">
                            <Select v-model="search.query.type" class="pull-right">
                                <Option v-for="item in PushType" :value="item.id" :key="item">{{ item.name }}</Option>
                            </Select>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-6">
                        <label>过滤</label>
                        <div class="form-group">
                            <input type="text" v-model="search.query.filter" class="form-control pull-right">
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
                <span>推送历史</span>
                <div class="btn-group pull-right">
                    <button type="button" class="btn btn-default">推送</button>
                    <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                        <span class="caret"></span>
                        <span class="sr-only">Toggle Dropdown</span>
                    </button>
                    <ul class="dropdown-menu" role="menu">
                        <li><a href="#">广告</a></li>
                        <li class="divider"></li>
                        <li><a href="#">静默安装</a></li>
                    </ul>
                </div>
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
        <Modal v-model="pushAdModel" title="广告推送" :loading="loadingBtn" @on-ok="pushAd" @on-cancel="cancel">
            <Form ref="adForm" :model="adVo" :label-width="80" :rules="adValidate" style="max-height: 400px;overflow: hidden">
                <Form-item label="过滤">
                    <Input v-model="adVo.filter"/>
                </Form-item>
                <Form-item label="发送时间">
                    <Date-picker ref="adVoStartDate" type="datetime" placeholder="选择日期和时间"></Date-picker>
                </Form-item>
                <Form-item label="发送频率" prop="max_send_num">
                    <Input-number :min="1" :max="100" v-model="adVo.max_send_num"></Input-number>
                </Form-item>
                <Form-item label="模式" prop="mode">
                    <Select v-model="adVo.mode">
                        <Option v-for="item in ModeType" :value="item.id" :key="item">{{ item.name }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="描述">
                    <Input v-model="adVo.description"/>
                </Form-item>
                <ul class="todo-list">
                    <li v-for="item in adList">
                        <span class="text" v-html="item.name"></span>
                        <div class="tools">
                            <i class="fa fa-trash-o"></i>
                        </div>
                    </li>
                </ul>
            </Form>
        </Modal>
        <Modal v-model="adModel" title="选择广告" :scrollable="true" :width="800" :loading="loadingBtn" @on-ok="selectAd" @on-cancel="cancel">
            <div class="box box-default">
                <div class="box box-default">
                    <div class="box-header with-border">
                        <h3 class="box-title">查询</h3>

                        <div class="box-tools pull-right">
                            <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
                            <button type="button" class="btn btn-box-tool" @click="doAdQuery"><i class="glyphicon glyphicon-search"></i></button>
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
            </div>
            <Table ref="table" :height="300" :columns="ad.columns" :data="ad.data" @on-selection-change="selectionChange"></Table>
            <div style="margin: 10px 10px 0 10px;overflow: hidden">
                <div style="float: right;">
                    <Page :total="ad.total" :show-sizer="true" placement="top" @on-page-size-change="changePageSizeByAd" @on-change="changePageByAd"></Page>
                </div>
            </div>
        </Modal>
    </div>
</template>
<script>
    import view from '../script/view/push';
    export default view;
</script>