/**
 * Created by alone on 17-5-12.
 */
"use strict";
import tableToolSwf from 'admin-lte/plugins/datatables/extensions/TableTools/swf/copy_csv_xls_pdf.swf';
import moment from 'moment';
// 重构Popper
import Popper from 'popper.js';
const _getPosition = Popper.prototype._getPosition;
Popper.prototype._getPosition = function(popper, reference) {
    if ($(popper).parents('div[role=dialog].modal').length > 0) {
        return 'absolute';
    }
    Reflect.apply(_getPosition, this, [popper, reference]);
};
const Common = {
    /**
     * 获取浏览器高度
     * @returns {number}
     */
    getWindowHeight() {
        let winHeight = 0;
        if (window.innerHeight){
            winHeight = window.innerHeight;
        }else if ((document.body) && (document.body.clientHeight)){
            winHeight = document.body.clientHeight;
        }
        return winHeight;
    },
    dataTableSettings: {
        language: {
            "sProcessing": "处理中...",
            "sLengthMenu": "每页 _MENU_ 项",
            "sZeroRecords": "没有匹配结果",
            "sInfo": "当前显示第 _START_ 至 _END_ 项，共 _TOTAL_ 项。",
            "sInfoEmpty": "当前显示第 0 至 0 项，共 0 项",
            "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
            "sInfoPostFix": "",
            "sSearch": false,
            "sUrl": "",
            "sEmptyTable": "表中数据为空",
            "sLoadingRecords": "载入中...",
            "sInfoThousands": ",",
            "oPaginate": {
                "sFirst": "首页",
                "sPrevious": "上页",
                "sNext": "下页",
                "sLast": "末页",
                "sJump": "跳转"
            },
            "oAria": {
                "sSortAscending": ": 以升序排列此列",
                "sSortDescending": ": 以降序排列此列"
            }
        },
        autoWidth: false,   //禁用自动调整列宽
        stripeClasses: ["odd", "even"],//为奇偶行加上样式，兼容不支持CSS伪类的场合
        order: [],          //取消默认排序查询,否则复选框一列会出现小箭头
        processing: false,  //隐藏加载提示,自行处理
        serverSide: true,   //启用服务器端分页
        searching: false,    //禁用原生搜索
        lengthChange: false,
        pagingType: 'full_numbers'
    },
    defaultValidatorSetting: {
        framework: 'bootstrap',
        excluded: [':disabled', ':hidden', ':not(:visible)'],
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        live: 'enabled',
        message: '请填写有效的值',
        trigger: 'blur'
    },
    tableToolsButton: function () {
        if ($.fn.DataTable && $.fn.DataTable.TableTools) {
            console.log(tableToolSwf);
            $.fn.DataTable.TableTools.defaults["sSwfPath"] = tableToolSwf;
            $.fn.DataTable.TableTools.defaults["aButtons"] = [ "copy", "csv"];
            $.fn.DataTable.TableTools.buttons["copy"]["sButtonText"] = '复制';
        }
    },
    valid: {
        ip(rule, value, callback) {
            if (rule.required && (value === undefined || value === '' || value.length <= 0)) {
                callback(new Error(`不能为空`));
                return;
            }
            if (value) {
                value = Array.isArray(value) ? value : value.split(',');
                for (let val of value) {
                    let split = val.split('.');
                    if (split.length < 4 && !val.endsWith('*')) {
                        callback(new Error(`${val} 不是正确的IP地址`));
                        return;
                    }
                    for (let s of split) {
                        if (!/1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d\*\d|\*\d|\d\*|\d|\*/.test(s) || s.length > 3) {
                            callback(new Error(`${val} 不是正确的IP地址`));
                            return;
                        }
                    }
                }
            }
            callback();
        }
    },
    dateFormat(val, format = 'YYYY-MM-DD HH:mm:ss') {
        return moment(Number(val)).format(format);
    },
    RENDER: {
        DATE(h, params) {
            return h('span', Common.dateFormat(params.row[params.column.key]));
        }
    }
}
export default Common;