/**
 static async Created by alone on 17-5-15.
 */
'use strict';
const Utils = require('../Utils');
const Result = require('../dto/Result');
const config = require('../../config.json');
const trc = require('trc');
const path = require('path');
const logger = require('tracer-logger');
const userService = trc.ServerProvider.instance(require('../thrift/UserService'));
const roleService = trc.ServerProvider.instance(require('../thrift/RoleService'));
const menuService = trc.ServerProvider.instance(require('../thrift/MenuService'));
const interfaceService = trc.ServerProvider.instance(require('../thrift/InterfaceService'));
const PublicStruct = require('../thrift/PublicStruct_types');
module.exports = class PermissionsController {
    static get routers() {
        return [{
            method: 'get',
            path: '/permissions/role/list/mgr',
            value: PermissionsController.rolesByMgr
        }, {
            method: 'get',
            path: '/permissions/role/list/set',
            value: PermissionsController.rolesBySetUser
        }, {
            method: 'post',
            path: '/permissions/role/add',
            value: PermissionsController.addRole
        }, {
            method: 'post',
            path: '/permissions/role/update',
            value: PermissionsController.updateRole
        }, {
            method: 'post',
            path: '/permissions/role/del',
            value: PermissionsController.delRole
        }, {
            method: 'post',
            path: '/permissions/role/menu/set',
            value: PermissionsController.setMenus
        }, {
            method: 'post',
            path: '/permissions/role/update/status',
            value: PermissionsController.updateRoleStatus
        }, {
            method: 'get',
            path: '/permissions/menu/list/mgr',
            value: PermissionsController.menusByMgr
        }, {
            method: 'get',
            path: '/permissions/menu/list/set',
            value: PermissionsController.menusBySetRole
        }, {
            method: 'post',
            path: '/permissions/menu/add',
            value: PermissionsController.addMenu
        }, {
            method: 'post',
            path: '/permissions/menu/update',
            value: PermissionsController.updateMenu
        }, {
            method: 'post',
            path: '/permissions/menu/del',
            value: PermissionsController.delMenu
        }, {
            method: 'get',
            path: '/permissions/menu/list',
            value: PermissionsController.menus
        }, {
            method: 'post',
            path: '/permissions/menu/interface/set',
            value: PermissionsController.setInterfaces
        }, {
            method: 'get',
            path: '/permissions/user/list',
            value: PermissionsController.users
        }, {
            method: 'post',
            path: '/permissions/user/add',
            value: PermissionsController.addUser
        }, {
            method: 'post',
            path: '/permissions/user/update',
            value: PermissionsController.updateUser
        }, {
            method: 'post',
            path: '/permissions/user/del',
            value: PermissionsController.delUser
        }, {
            method: 'post',
            path: '/permissions/user/role/set',
            value: PermissionsController.setRoles
        }, {
            method: 'get',
            path: '/permissions/user/logout',
            value: PermissionsController.logout
        }, {
            method: 'post',
            path: '/permissions/user/login',
            value: PermissionsController.login
        }, {
            method: 'get',
            path: '/permissions/user/info',
            value: PermissionsController.info
        }, {
            method: 'get',
            path: '/permissions/user/child',
            value: PermissionsController.childUsers
        }, {
            method: 'get',
            path: '/permissions/interface/list/mgr',
            value: PermissionsController.interfaceByMgr
        }, {
            method: 'post',
            path: '/permissions/interface/add',
            value: PermissionsController.addInterface
        }, {
            method: 'post',
            path: '/permissions/interface/update',
            value: PermissionsController.updateInterface
        }, {
            method: 'get',
            path: '/permissions/interface/list/set',
            value: PermissionsController.interfacesBySetMenu
        }];
    }
    static async rolesByMgr(ctx) {
        let roles = await roleService.rolesByUser(ctx.session.user.id);
        ctx.body = new Result(true, {
            key: 'tree',
            value: Utils.makeTree(roles, ctx.session.user.id, 'pid', 'id', 'children')
        }).json;
    }
    static async rolesBySetUser(ctx) {
        let roles = await roleService.rolesBySetUser(ctx.query.id, ctx.session.user.id);
        ctx.body = new Result(true, {
            key: 'tree',
            value: Utils.makeTree(roles, ctx.session.user.id, 'pid', 'id', 'children')
        }).json;
    }
    static async addRole(ctx) {
        let params = ctx.request.body;
        let res = await roleService.add(new PublicStruct.RoleStruct(params));
        ctx.body = new Result(!!res, {
            key: 'id',
            value: res
        }).json;
    }
    static async updateRole(ctx) {
        let params = ctx.request.body;
        let res = await roleService.update(new PublicStruct.RoleStruct(params));
        ctx.body = new Result(!!res).json;
    }
    static async setMenus(ctx) {
        let params = ctx.request.body;
        let res = await roleService.setMenus(params.id, ctx.session.user.id, params.menus);
        await PermissionsController.refreshAuth(ctx);
        ctx.body = new Result(!!res).json;
    }
    static async updateRoleStatus(ctx) {
        let params = ctx.request.body;
        let res = await roleService.updateStatus(params.ids);
        await PermissionsController.refreshAuth(ctx);
        ctx.body = new Result(!!res).json;
    }
    static async delRole(ctx) {
        let params = ctx.request.body;
        let res = await roleService.delRole(params.id);
        await PermissionsController.refreshAuth(ctx);
        ctx.body = new Result(!!res).json;
    }
    static async menusByMgr(ctx) {
        let menus = await menuService.menus();
        ctx.body = new Result(true, {
            key: 'tree',
            value: Utils.makeTree(menus, 0, 'pid', 'id', 'children')
        }).json;
    }
    static async menusBySetRole(ctx) {
        let menus = await menuService.menusBySetRole(ctx.session.user.id, ctx.query.role);
        ctx.body = new Result(true, {
            key: 'tree',
            value: Utils.makeTree(menus, 0, 'pid', 'id', 'children')
        }).json;
    }
    static async addMenu(ctx) {
        let params = ctx.request.body;
        let res = await menuService.add(new PublicStruct.MenuStruct(params), ctx.session.user.id);
        ctx.body = new Result(!!res, {
            key: 'id',
            value: res
        }).json;
    }
    static async updateMenu(ctx) {
        let params = ctx.request.body;
        let res = await menuService.update(new PublicStruct.MenuStruct(params));
        ctx.body = new Result(!!res).json;
    }
    static async delMenu(ctx) {
        let params = ctx.request.body;
        let res = await menuService.delMenu(params.id);
        await PermissionsController.refreshAuth(ctx);
        ctx.body = new Result(!!res).json;
    }
    static async menus(ctx) {
        let menus = await menuService.menusByUser(ctx.session.user.id);
        ctx.body = new Result(true, {
            key: 'tree',
            value: Utils.makeTree(menus, 0, 'pid', 'id', 'sub', item => {
                if (!item.sub) item.sub = [];
            })
        }, {
            key: 'user',
            value: ctx.session.user
        }).json;
    }
    static async users(ctx) {
        let userId = ctx.session.user.id;
        let users = await userService.usersByUser(userId);
        ctx.body = new Result(true, {
            key: 'tree',
            value: Utils.makeTree(users, userId, 'pid', 'id', 'children')
        }).json;
    }
    static async addUser(ctx) {
        let params = ctx.request.body;
        let res = await userService.add(new PublicStruct.UserStruct(params));
        ctx.body = new Result(!!res, {
            key: 'id',
            value: res
        }).json;
    }
    static async updateUser(ctx) {
        let params = ctx.request.body;
        params.id = params.id ? params.id : ctx.session.user.id;
        let res = await userService.update(new PublicStruct.UserStruct(params));
        if (res && params.status === false) {
            Utils.removeUser(ctx, params.id);
        }
        ctx.body = new Result(!!res).json;
    }
    static async delUser(ctx) {
        let params = ctx.request.body;
        let res = await userService.delUser(params.id);
        res && Utils.removeUser(ctx, params.id);
        ctx.body = new Result(!!res).json;
    }
    static async setRoles(ctx) {
        let params = ctx.request.body;
        let res = await userService.setRoles(params.id, ctx.session.user.id, params.roles);
        await PermissionsController.refreshAuth(ctx);
        ctx.body = new Result(!!res).json;
    }
    static async logout(ctx) {
        ctx.session = null;
        ctx.redirect('/');
    }
    static async login(ctx) {
        let param = ctx.request.body;
        try {
            let user = await userService.login(param.username, param.password);
            let parse = JSON.parse(user);
            let list = await interfaceService.interfacesByUser(parse.id);
            Utils.refreshAuth(ctx, parse, list);
            ctx.body = new Result(true).json;
        } catch (err) {
           logger.warn(`login error post: ${param.username}-${param.password}`, err);
           ctx.body = new Result(false, err.msg).json;
        }
    }
    static async info(ctx) {
        let res = await userService.info(ctx.session.user.id);
        let value = JSON.parse(res);
        Reflect.deleteProperty(value, 'password');
        Reflect.deleteProperty(value, 'username');
        ctx.body = new Result(true, {
            key: 'user',
            value: value
        }).json;
    }
    static async childUsers(ctx) {
        let users = await userService.usersByUser(ctx.session.user.id);
        ctx.body = new Result(true, {
            key: 'list',
            value: Utils.makeList(users)
        }).json;
    }
    static async interfaceByMgr(ctx) {
        let params = Object.assign({}, ctx.query);
        Reflect.set(params, 'query', JSON.parse(decodeURIComponent(ctx.query.query)));
        let res = await interfaceService.interfacesByPage(new PublicStruct.PageParamStruct(params));
        ctx.body = new Result(true, {
            key: 'interfaces',
            value: res
        }).json;
    }
    static async addInterface(ctx) {
        let params = ctx.request.body;
        let res = await interfaceService.add(new PublicStruct.InterfaceStruct(params));
        ctx.body = new Result(!!res, {
            key: 'id',
            value: res
        }).json;
    }
    static async updateInterface(ctx) {
        let params = ctx.request.body;
        let res = await interfaceService.update(new PublicStruct.InterfaceStruct(params));
        await PermissionsController.refreshAuth(ctx);
        ctx.body = new Result(!!res).json;
    }
    static async interfacesBySetMenu(ctx) {
        let interfaces = await interfaceService.interfacesBySetMenu(0, ctx.query.menu);
        ctx.body = new Result(true, {
            key: 'interfaces',
            value: Utils.makeList(interfaces)
        }).json;
    }
    static async setInterfaces(ctx) {
        let params = ctx.request.body;
        let res = await menuService.setInterfaces(params.id, ctx.session.user.id, params.interfaces);
        await PermissionsController.refreshAuth(ctx);
        ctx.body = new Result(!!res).json;
    }
    static async refreshAuth(ctx) {
        let list = await interfaceService.interfacesByUser(ctx.session.user.id);
        Utils.refreshAuth(ctx, null, list);
    }
};