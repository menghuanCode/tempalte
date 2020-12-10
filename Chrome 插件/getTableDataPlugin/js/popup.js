console.log('begin popup')

// 点击获取 table columns
$('#get_table_button').on('click', () => {
  sendMessageToContentScript('getTableColumns')
})

// 点击获取 table columns
$('#get_routes').on('click', () => {
  sendMessageToContentScript('getRoutes')
})

// 点击获取 table columns
$('#get_menus').on('click', () => {
  sendMessageToContentScript('getMenus')
})

// 向content-script主动发送消息
function sendMessageToContentScript(message, callback) {
  getCurrentTabId((tabId) => {
    chrome.tabs.sendMessage(tabId, message, function (response) {
      if (callback) callback(response);
    });
  });
}

// 获取当前选项卡ID
function getCurrentTabId(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (callback) callback(tabs.length ? tabs[0].id : null);
  });
}
