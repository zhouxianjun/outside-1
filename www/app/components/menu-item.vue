<template>
    <li v-if="menu.sub && menu.sub.length && menu.show" class="treeview">
        <a href="#" :id="`menu-item-${menu.id}`" @click="menuClick(menu.id)">
            <i v-bind:class="`fa ${menu.icon}`"></i>
            <span v-html="menu.name"></span>
            <i class="fa fa-angle-left pull-right"></i>
        </a>
        <ul class="treeview-menu">
            <self-menu-item :menu="menu" v-for="menu in menu.sub" @on-collapsed="handCollapsed" @on-expanded="handExpanded" @on-selected="handClick" :key="menu.id"></self-menu-item>
        </ul>
    </li>
    <li v-else-if="menu.show">
        <a href="#" :id="`menu-${menu.id}`" @click.stop.prevent="handClick(menu.id)"><i v-bind:class="`fa ${menu.icon}`"></i>
            <span v-html="menu.name"></span>
        </a>
    </li>
</template>
<script>
    import $ from 'jquery';
    export default {
        name: 'self-menu-item',
        props: {
            menu: Object
        },
        methods: {
            handClick(id) {
                this.$emit('on-selected', id);
            },
            handCollapsed(id) {
                this.$emit('on-collapsed', id);
            },
            handExpanded(id) {
                this.$emit('on-expanded', id);
            },
            menuClick(id) {
                let d = $(`#menu-item-${id}`), e = d.next();
                if (e.is(".treeview-menu") && e.is(":visible") && !$("body").hasClass("sidebar-collapse")){
                    this.doEmit(id, false);
                } else if (e.is(".treeview-menu") && !e.is(":visible")) {
                    let f = d.parents("ul").first();
                    let array = f.find("ul:visible").prev();
                    for(let item of array) {
                        this.doEmit(item.id.replace('menu-item-', ''), false);
                    }
                    this.doEmit(id, true);
                }
            },
            doEmit(id, open) {
                let el = $(`#menu-item-${id}`);
                let timer = setInterval(() => {
                    let isActive = el.parent('li').is('.active');
                    if (open && isActive) {
                        clearInterval(timer);
                        this.$emit('on-expanded', id);
                    }
                    if (!open && !isActive) {
                        clearInterval(timer);
                        this.$emit('on-collapsed', id);
                    }
                }, 100);
            }
        }
    }
</script>