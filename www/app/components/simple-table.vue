<template>
    <table class="table table-striped table-hover">
        <thead>
        <tr>
            <th v-for="column in columns" :key="column" v-html="column.title"></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="record in records">
            <td v-for="item in record" v-html="item"></td>
        </tr>
        </tbody>
    </table>
</template>
<script>
    export default {
        name: 'simple-table',
        data() {
            return {
                records: []
            }
        },
        methods: {
            resolveValue(obj, field) {
                let result = obj;
                let split = field.split('.');
                for (let s of split) {
                    if (!result) return '';
                    result = result[s];
                }
                return result;
            }
        },
        props: {
            columns: Array,
            data: Array
        },
        watch: {
            data(value) {
                this.records = [];
                for (let val of value) {
                    let tmp = [];
                    for (let column of this.columns) {
                        let v = this.resolveValue(val, column.key);
                        if (column.renderer && typeof column.renderer === 'function') {
                            v = column.renderer(v, val);
                        }
                        tmp.push(v);
                    }
                    this.records.push(tmp);
                }
            }
        }
    }
</script>