<template>
    <ul class="sidebar-menu" data-widget="true">
        <li class="header">MAIN NAVIGATION</li>
        <self-menu-item :menu="menu" v-for="menu in menus" :key="menu.id" @on-collapsed="handCollapsed" @on-expanded="handExpanded" @on-selected="handClick"></self-menu-item>
    </ul>
</template>
<script>
    import SelfMenuItem from './menu-item.vue';
    import $ from 'jquery';
    export default {
        name: 'self-menu',
        data() {
            return {
                active: this.value
            }
        },
        props: {
            menus: Array,
            value: [String, Number]
        },
        mounted() {

        },
        methods: {
            handClick(id) {
                this.active = id;
                this.$emit('on-selected', id);
            },
            handCollapsed(id) {
                this.$emit('on-collapsed', id);
            },
            handExpanded(id) {
                this.$emit('on-expanded', id);
                this.activeMenu(this.active, true);
            },
            openMenu(el) {
                return new Promise(resolve => {
                    let parent = el.prev().parents('ul').first();
                    let ul = parent.find('ul:visible').slideUp(500);
                    ul.removeClass('menu-open');
                    let parent_li = el.prev().parent("li");

                    el.slideDown(500, () => {
                        el.addClass('menu-open');
                        parent.find('li.active').removeClass('active');
                        parent_li.addClass('active');
                        resolve();
                    });
                });
            },
            activeMenu(id, expand) {
                let a = $(`#menu-${id}`);
                if (!a.length) {
                    $(this.$el).find('li.active').not('.treeview').removeClass('active');
                    return;
                }
                let active = a.parents('li.treeview').eq(0).hasClass('active');
                if (!active && expand) return;
                let parents = a.parents('ul.treeview-menu');

                if (!parents || !parents.length) {
                    let parent = $(this.$el);
                    let ul = parent.find('ul:visible').slideUp(500);
                    ul.removeClass('menu-open');
                    parent.find('li.active').removeClass('active');
                }

                if (!parents.first().is(':visible')) {
                    (async () => {
                        for (let i = parents.length; i > 0; i--) {
                            let p = $(parents.get(i - 1));
                            if (!p.is(':visible')) {
                                await this.openMenu(p);
                            }
                        }
                        a.parent('li').addClass('active');
                    })();
                    return;
                }
                parents.find('li.active').removeClass('active');
                a.parent('li').addClass('active');
                a.parents('li.treeview').addClass('active');
            }
        },
        watch: {
            value(val) {
                this.active = val;
            },
            active(val) {
                this.activeMenu(val);
            }
        },
        components: {
            SelfMenuItem
        }
    }
</script>