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
                <span>静默列表</span>
                <button type="button" class="btn btn-default btn-sm pull-right" @click="add">
                    <span class="glyphicon glyphicon glyphicon-plus" aria-hidden="true"></span> 添加
                </button>
                <button type="button" class="btn btn-default btn-sm pull-right margin-r-5" @click="showPush">
                    <span class="glyphicon glyphicon glyphicon-plus" aria-hidden="true"></span> 推送
                </button>
            </div>
            <div class="panel-body">
                <Table :columns="table.columns" :data="table.data" :headerColor="`#fff`" @on-selection-change="selectionChange" class="overflow-no-x"></Table>
                <div style="margin: 10px;overflow: hidden">
                    <div style="float: right;">
                        <Page :total="table.total" :show-sizer="true" placement="top" @on-page-size-change="changePageSize" @on-change="changePage"></Page>
                    </div>
                </div>
            </div>
        </div>
        <Modal v-model="model" :title="modelTitle" :loading="loadingBtn" @on-ok="addOrUpdate" @on-cancel="cancel">
            <Form ref="form" :model="vo" :label-width="100" :rules="installValidate" style="max-height: 400px;overflow: hidden">
                <Form-item label="图标" prop="image">
                    <Input :value="imageName" icon="image" @on-click="showResources(false)" :readonly="true"/>
                </Form-item>
                <Form-item label="APK" prop="resources">
                    <Input :value="apkName" icon="social-android-outline" @on-click="showResources(true)" :readonly="true"/>
                </Form-item>
                <Form-item label="时间类型" prop="time_type">
                    <Select v-model="vo.time_type">
                        <Option v-for="item in InstallTimeType" :value="item.id" :key="item">{{ item.name }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="安装时间" v-show="vo.time_type == 7002">
                    <Date-picker ref="pointTime" type="datetime" placeholder="选择日期和时间"></Date-picker>
                </Form-item>
                <Form-item label="安装时间段" v-show="vo.time_type == 7001">
                    <Date-picker placement="top" ref="installTime" style="width: 100%" type="datetimerange" placeholder="选择日期和时间"></Date-picker>
                </Form-item>
                <Form-item label="联网打开" prop="net_open">
                    <i-switch v-model="vo.net_open" size="large">
                        <span slot="open">是</span>
                        <span slot="close">否</span>
                    </i-switch>
                </Form-item>
                <Form-item label="打开次数" prop="open_count">
                    <Input-number :min="0" :max="100" v-model="vo.open_count"></Input-number>
                </Form-item>
                <Form-item label="展示时长" prop="show_time">
                    <Input-number :min="0" :max="100" v-model="vo.show_time"></Input-number>
                </Form-item>
                <Form-item label="网络类型" prop="net_type">
                    <Select v-model="vo.net_type">
                        <Option v-for="item in NetType" :value="item.id" :key="item">{{ item.name }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="保留时间" prop="keep_time">
                    <Input-number :min="0" :max="100" v-model="vo.keep_time"></Input-number>
                </Form-item>
                <Form-item label="上报限制" prop="upload_limit">
                    <Input-number :min="0" :max="100" v-model="vo.upload_limit"></Input-number>
                </Form-item>
                <Form-item label="安装位置" prop="install_path">
                    <Select v-model="vo.install_path">
                        <Option v-for="item in InstallPathType" :value="item.id" :key="item">{{ item.name }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="最大次数" prop="max_count">
                    <Input-number :min="0" :max="100" v-model="vo.max_count"></Input-number>
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
        <Modal v-model="resourcesModel" title="选择资源" :scrollable="true" :width="800" @on-cancel="cancel">
            <div id="selectDiv" style="max-height: 400px; overflow: hidden">
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
                                <label>MD5</label>
                                <div class="form-group">
                                    <input type="text" v-model="resources.search.query.md5" class="form-control pull-right">
                                </div>
                            </div>
                            <div class="col-sm-4">
                                <label>包名</label>
                                <div class="form-group">
                                    <input type="text" v-model="resources.search.query.pkg" class="form-control pull-right">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Table ref="table" :columns="resources.columns" :data="resources.data"></Table>
                <div style="margin: 10px 10px 0 10px;overflow: hidden">
                    <div style="float: right;">
                        <Page :total="resources.total" :show-sizer="true" placement="top" @on-page-size-change="changePageSizeByResources" @on-change="changePageByResources"></Page>
                    </div>
                </div>
            </div>
            <div slot="footer">
            </div>
        </Modal>
        <Modal v-model="pushModel" title="新建推送" :loading="loadingBtn" @on-ok="sendPush" @on-cancel="cancel">
            <div id="pushDiv" style="max-height: 400px; overflow: hidden">
                <Form ref="pushForm" :model="pushVo" :label-width="80" :rules="pushValidate" style="max-height: 400px;overflow: hidden">
                    <Form-item label="过滤" prop="filter">
                        <Input v-model="pushVo.filter"/>
                    </Form-item>
                    <Form-item label="发送时间">
                        <Date-picker ref="pushStartDate" type="datetime" placeholder="选择日期和时间"></Date-picker>
                    </Form-item>
                    <Form-item label="发送频率" prop="max_send_num">
                        <Input-number :min="1" :max="100" v-model="pushVo.max_send_num"></Input-number>
                    </Form-item>
                    <Form-item label="模式" prop="mode">
                        <Select v-model="pushVo.mode">
                            <Option v-for="item in ModeType" :value="item.id" :key="item">{{ item.name }}</Option>
                        </Select>
                    </Form-item>
                    <Form-item label="描述">
                        <Input v-model="pushVo.description"/>
                    </Form-item>
                </Form>
            </div>
        </Modal>
    </div>
</template>
<script>
    import view from '../script/view/install';
    export default view;
</script>