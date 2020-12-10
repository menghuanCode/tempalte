const jquery = require('jquery')
const fs = require('fs');
const { isArray } = require('./utils');

const data = require('./data.json')
const root = getRoot(data);
const routes = getRoutes(root);
const menus = getMenus(root);


function getRoot(data, id = 'rootId', lock = false) {
    if (isArray(data)) {
        let routes = [];
        for (let i = 0; i < data.length; i++) {
            routes.push(getRoot(data[i], lock ? id : (id + i)))
        }
        return routes;
    }

    if (data.subMenus && data.subMenus.length) {
        return { path: `/${id}`, name: id, icon: 'icon-shezhi', component: './index', text: data.name, routes: getRoot(data.subMenus, id, true) }
    }

    let name = data.url.match(/^\/boss(.+)\/index$/) && data.url.match(/^\/boss\/(.+)\/index$/)[1];
    let path = data.newUrl || `/${id}/${name}`
    return { name, path, text: data.name, component: '.' + path };
}

function getRoutes(root) {
    if (isArray(root)) {
        let routes = [];
        for (let i = 0; i < root.length; i++) {
            routes.push(getRoutes(root[i]))
        }
        return routes;
    }

    let { text, routes, ...rest } = root;

    if (routes && routes.length) {
        return { ...rest, routes: getRoutes(routes) }
    }

    return rest;
}

function getMenus(root, menus = {}, label = ['menu']) {
    if (isArray(root)) {
        for (let i = 0; i < root.length; i++) {
            getMenus(root[i], menus, label)
        }
        return menus;
    }

    let key = [...label, root.name].filter(_ => _);
    menus[key.join('.')] = root.text;

    if (root.routes && root.routes.length) {
        getMenus(root.routes, menus, key)
    }

    return menus;
}


fs.writeFileSync('./data/root.json', JSON.stringify(root), { encoding: 'utf8' })
fs.writeFileSync('./data/routes.json', JSON.stringify(routes), { encoding: 'utf8' })
fs.writeFileSync('./data/menus.json', JSON.stringify(menus), { encoding: 'utf8' })