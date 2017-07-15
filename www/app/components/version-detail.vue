<template>
    <div class="box-body">
        <div class="box-group" :id="`accordion_${detail.id}`">
            <!-- we are adding the .panel class so bootstrap.js collapse plugin detects it -->
            <div class="panel box box-primary" v-for="(item, index) in positions" :key="item">
                <div class="box-header with-border">
                    <h4 class="box-title">
                        <a data-toggle="collapse" :data-parent="`#accordion_${detail.id}`" :class="{collapsed: index !== 0}" :href="`#collapse_${detail.id}_${item.id}`" :aria-expanded="index === 0 ? 'true' : 'false'" class="">
                            {{item.name}}
                        </a>
                    </h4>
                </div>
                <div :id="`collapse_${detail.id}_${item.id}`" class="panel-collapse collapse" :class="{'in': index === 0}" :aria-expanded="index === 0 ? 'true' : 'false'" :style="index === 0 ? {} : {height: '0px'}">
                    <div class="box-body">
                        <div class="row" v-for="sup in item.sups" :key="sup">
                            <div class="col-md-4">
                                <label>类型:</label>
                                <span v-html="sup.type + index"></span>
                            </div>
                            <div class="col-md-4">
                                <label>名称:</label>
                                <span v-html="sup.name"></span>
                            </div>
                            <div class="col-md-4">
                                <label>使用:</label>
                                <span v-html="sup.use"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Common from '../script/common';
    import {getAttribute, PositionType, SupportType} from "../script/dic";
    export default {
        props: {
            detail: Object,
            support: Array
        },
        data() {
            return {
                positions: []
            }
        },
        methods: {
        },
        mounted() {
            let map = new Map();
            this.support.forEach(sup => {
                if (!map.has(sup.position)) {
                    map.set(sup.position, {
                        id: sup.position,
                        name: getAttribute(PositionType, 'id', sup.position).name,
                        sups: []
                    });
                }
                map.get(sup.position).sups.push({
                    id: sup.support,
                    name: sup.name,
                    type: getAttribute(SupportType, 'id', sup.type).name,
                    use: Common.statusFormat(sup.use_now, '目前使用', '未使用')
                });
            });

            for (let value of map.values()) {
                this.positions.push(value);
            }
        }
    }
</script>