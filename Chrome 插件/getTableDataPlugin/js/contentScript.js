
let root = null;


$(function () {
  console.log('begin contentScript')
  // injectCustomJs()
})


// 接收来自后台的消息
chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  if (request == 'getTableColumns') {
    getTableColumns()
  }

  if (request == 'getRoutes') {
    if (!root) {
      root = getRoot(await getUserPerms());
    }
    logStringify(getRoutes(root))
  }

  if (request == 'getMenus') {
    if (!root) {
      root = getRoot(await getUserPerms());
    }
    logStringify(getMenus(root))
  }
});


// 向页面注入JS
function injectCustomJs(jsPath) {
  jsPath = jsPath || 'js/inject.js';
  var temp = document.createElement('script');
  temp.setAttribute('type', 'text/javascript');
  // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
  temp.src = chrome.extension.getURL(jsPath);
  temp.onload = function () {
    // 放在页面不好看，执行完后移除掉
    this.parentNode.removeChild(this);
  };
  document.head.appendChild(temp);
}


function getTableColumns() {
  _formatSearchData();
  _formatTableData();
  _formatModalData();
  // _formatFormData();
}

function _formatSearchData() {
  // 用户搜索
  const userSearch = $('#userSearch');
  const userSearchItem = userSearch.find('.layui-inline')
  const searchColumns = []

  // 先判断添加两个时间控制器
  // 开始时间
  if (userSearch.find('#startTime').length) {
    searchColumns.push({
      title: '开始时间',
      dataIndex: 'startTime',
      valueType: 'dateTime',
      hideInTable: true,
    })
  }
  // 结束时间
  if (userSearch.find('#endTime').length) {
    searchColumns.push({
      title: '结束时间',
      dataIndex: 'endTime',
      valueType: 'dateTime',
      hideInTable: true,
    })
  }

  $.each(userSearchItem, function (index, item) {
    const title = $(item).find('.layui-form-label').text();
    const controller = $(item).find('.layui-input-inline').children()[0];

    if (!controller) {
      return true;
    }

    // 控制器名称
    const controllerName = controller.tagName.toLowerCase();
    const controllerConfig = {}


    switch (controllerName) {
      case "input": {
        const placeholder = controller.placeholder;
        const { fieldProps = {} } = controllerConfig

        // 时间控制器，跳过
        if (placeholder === 'yyyy-MM-dd HH:mm:ss') {
          return true;
        }

        if (placeholder !== `请选择${title}`) {
          fieldProps['placeholder'] = placeholder
        }
        controllerConfig.fieldProps = fieldProps
        break
      }
      case "select": {
        const options = controller.options;
        const { valueEnum = {} } = controllerConfig
        for (let i = 0; i < options.length; i++) {
          const option = options[i]
          valueEnum['option' + i] = {
            text: option.innerText,
            status: option.value
          }
        }
        controllerConfig.valueEnum = valueEnum
      }
    }

    searchColumns.push({
      title,
      dataIndex: controller.name,
      hideInTable: true,
      ...controllerConfig
    })
  })

  console.log("searchColumns", JSON.stringify(searchColumns))
  writeObj(searchColumns)

}

function _formatTableData() {

  // 用户表格
  const tables = $('.layui-table-box')

  $.each(tables, (index, item) => {
    const tableColumns = []
    const $item = $(item)
    const headerItem = $item.find('.layui-table-header tr:eq(0) th');

    if (!headerItem && !headerItem.length) {
      return;
    }

    $.each(headerItem, (index, th) => {
      const title = $(th).text();
      const dataIndex = $(th).data('field')

      if (typeof dataIndex === "number" || !title) {
        return true;
      }

      tableColumns.push({
        title,
        dataIndex,
        hideInSearch: true
      })
    })

    console.log("tableColumns", JSON.stringify(tableColumns))
    writeObj(tableColumns)
  })


}

function _formatModalData() {
  const userForm = $('#userForm');
  // 用户搜索
  const userItem = userForm.find('.layui-inline')
  const columns = []

  $.each(userItem, function (index, item) {
    const title = $(item).find('.layui-form-label').text();
    const controller = $(item).find('.layui-input-inline').children()[0];

    if (!controller) {
      return true;
    }

    // 控制器名称
    const controllerName = controller.tagName.toLowerCase();
    const controllerConfig = {}


    switch (controllerName) {
      case "input": {
        const placeholder = controller.placeholder;
        const { fieldProps = {} } = controllerConfig

        if (placeholder !== `请选择${title}`) {
          fieldProps['placeholder'] = placeholder
        }
        controllerConfig.fieldProps = fieldProps
        break
      }
      case "select": {
        const options = controller.options;
        const { valueEnum = {} } = controllerConfig
        for (let i = 0; i < options.length; i++) {
          const option = options[i]
          valueEnum['option' + i] = {
            text: option.innerText,
            status: option.value
          }
        }
        controllerConfig.valueEnum = valueEnum
      }
    }

    controllerConfig.fieldProps['required'] = true;
    columns.push({
      title,
      dataIndex: controller.name,
      hideInTable: true,
      ...controllerConfig
    })
  })

  writeObj(columns)
}

function _formatFormData() {
  const form = $('form')
  form.each(function (index, item) {
    const $form = $(item)
    const $formItem = $form.find('.layui-form-item')
    const columns = []
    $formItem.each(function (index, item) {
      const $item = $(item);
      let title = $item.find('.layui-form-label').text();

      columns.push({
        title
      })

    })
    writeObj(columns)
  })
}

function writeObj(obj) {
  var description = "[" + "\n";
  for (var i in obj) {
    var property = obj[i];
    description += obj2string(property) + ", " + "\n";
  }

  description += "]"
  console.log(description);
}

function obj2string(o) {
  var r = [];
  if (typeof o == "string") {
    return "\"" + o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
  }
  if (typeof o == "object") {
    if (!o.sort) {
      for (var i in o) {
        r.push(i + ":" + obj2string(o[i]));
      }
      r = "{" + r.join() + "}";
    } else {
      for (var i = 0; i < o.length; i++) {
        r.push(obj2string(o[i]))
      }
      r = "[" + r.join() + "]";
    }
    return r;
  }
  return o.toString();
}

function logStringify(obj) {
  console.log(JSON.stringify(obj))
}


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

async function getUserPerms() {
  let res = await $.ajax('http://boss.ethancz.com/manager/boss/sysResources/getUserPerms')
  return res.data.perm;
}