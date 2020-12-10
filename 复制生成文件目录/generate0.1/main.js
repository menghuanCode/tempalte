const fs = require('fs')
const path = require('path')
const { toFirstUpperCase, isArray } = require('./utils')
const { columnsTsx, indexTsx, tableTsx, apiTsx } = require('./template')
const root = require('./data/root.json')

function getDirExist(...dir) {
    try {
        let stats = fs.statSync(path.join(__dirname, ...dir));
        return stats.isDirectory();
    } catch (e) {
        return false;
    }
}

// 清空 dist 目录;
if (getDirExist('dist')) {
    fs.rmdirSync('dist', { recursive: true });
}

fs.mkdirSync('dist')
fs.mkdirSync('dist/services')
fs.mkdirSync('dist/pages')

function generateDirs(path) {
    let pathDirs = path.split('/').filter(_ => _);
    for (let i = 1; i < pathDirs.length; i++) {
        let dir = pathDirs.slice(0, i).join('/');
        if (!getDirExist(dir)) {
            fs.mkdirSync(dir);
        }
    }
}

/**
 * 生成组件
 * @param {*} name 组件名
 * @param {*} path 组件路径
 */
function generateComponents(name = '', path = 'dist/pages') {
    if (!name) {
        return;
    }


    console.log(name, path)
    let table = toFirstUpperCase(name) + 'Table'

    try {
        fs.mkdirSync(`${path}`)
        // 组件目录
        fs.mkdirSync(`${path}/components`)
        fs.mkdirSync(`${path}/components/${table}`)

        fs.writeFileSync(`${path}/index.tsx`, indexTsx(name, table))
        fs.writeFileSync(`${path}/components/${table}/columns.tsx`, columnsTsx())
        fs.writeFileSync(`${path}/components/${table}/index.tsx`, tableTsx(name))
    } catch (error) {
        let { message } = error;
        // console.log(message)
        let isNoDirectory = message.search('no such file or directory, mkdir') !== -1;
        if (isNoDirectory) {
            generateDirs(path)
        }
    }

}

// 生成服务
function generateServices(name = '', path = 'dist/services') {
    try {
        fs.writeFileSync(`${path}/${name}.ts`, apiTsx(name))
    } catch (error) {
        let { message } = error;
        let isNoDirectory = message.search('no such file or directory, mkdir') !== -1;
        if (isNoDirectory) {
            generateDirs(path)
        }
    }
}

/**
 * 递归调用创建项目
 * @param {*} root 根节点
 */
function generateProject(root) {
    // 如果是数组的话
    if (isArray(root)) {
        for (let i = 0; i < root.length; i++) {
            generateProject(root[i], path);
        }
        return;
    }

    // 如果是对象并且有子路由
    if (root.routes && root.routes.length) {
        return generateProject(root.routes);
    }

    // 没有子路由了
    generateComponents(root.name, 'dist/pages' + root.path)
    generateServices(root.name, 'dist/services')
}

generateProject(root)