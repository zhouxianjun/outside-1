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
                        <label>版本</label>
                        <div class="form-group">
                            <input type="text" v-model="search.query.version" class="form-control pull-right">
                        </div>
                    </div>
                    <div class="col-sm-4">
                        <label>厂商</label>
                        <div class="form-group">
                            <input type="text" v-model="search.query.producer" class="form-control pull-right">
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
                <span>版本列表</span>
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
            <Form ref="form" :model="vo" :label-width="80" :rules="versionValidate" style="max-height: 400px;overflow: hidden">
                <Form-item label="版本" prop="version">
                    <Input v-model="vo.version"/>
                </Form-item>
                <Form-item label="厂商" prop="producer">
                    <Input v-model="vo.producer"/>
                </Form-item>
                <Form-item label="MD5" prop="md5">
                    <Input v-model="vo.md5"/>
                </Form-item>
                <Form-item label="激活限制" prop="active_limit">
                    <Input-number :min="0" :max="9999999" v-model="vo.active_limit"></Input-number>
                </Form-item>
            </Form>
        </Modal>

        <Modal v-model="adPositionModel" title="设置广告位" :loading="loadingBtn" @on-ok="configPosition" @on-cancel="cancel">
            <Form ref="positionForm" :model="positionVo" :label-width="80" :rules="positionValidate" style="max-height: 400px;overflow: hidden">
                <Form-item label="广告位" prop="position">
                    <Select v-model="positionVo.position">
                        <Option v-for="item in PositionType" :value="item.id" :key="item">{{ item.name }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="SDK" prop="sdk">
                    <Select v-model="positionVo.sdk">
                        <Option v-for="item in Sdks" :value="item.id" :key="item">{{ item.name }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="API" prop="api">
                    <Select v-model="positionVo.api">
                        <Option v-for="item in Apis" :value="item.id" :key="item">{{ item.name }}</Option>
                    </Select>
                </Form-item>
            </Form>
        </Modal>
    </div>
</template>
<script>
    import view from '../script/view/version';
    export default view;
</script>