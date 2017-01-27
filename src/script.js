const LOADING_STATUS = 'loading';
const COMPLETE_STATUS = 'complete';
const CURRENT_TAB_QUERY = {
    active: true,
    currentWindow: true
}
const SELECTED_ICON_KEY = 'selectedIcon';
const DEFAULT_ICON = 'nn';
const ICON_CONFIG = {
    nn: {
        directoryName: 'netscape',
        totalFrames: 34,
        frameRate: 130
    },
    ie: {
        directoryName: 'explorer',
        totalFrames: 34,
        frameRate: 150
    }
}

var currentStatus = '';
var currentFrame = 0;
var currentTabs = {}
var tabStatuses = {}
var interval;

var selectedIcon = '';

chrome.storage.sync.get(SELECTED_ICON_KEY, function(selection) {
    if (selection[SELECTED_ICON_KEY]) {
        selectedIcon = selection[SELECTED_ICON_KEY];
    } else {
        selectedIcon = DEFAULT_ICON;
    }
});

chrome.storage.onChanged.addListener(function (changes, areaName) {
    if (areaName !== 'sync') {
        return;
    }
    if (changes.hasOwnProperty(SELECTED_ICON_KEY)) {
        setIcon(changes[SELECTED_ICON_KEY].newValue);
    }
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    var status = changeInfo.status;
    if (status) {
        updateTabStatus(tab.windowId, tabId, status);
    }
    chrome.tabs.query(CURRENT_TAB_QUERY, function(currentTab) {
        currentTab = currentTab[0];
        if (currentTab.id === tabId) {
            updateAppStatus(status);
        }
    });
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
    currentTabs[activeInfo.windowId] = activeInfo.tabId;
    var currentTabStatus = getTabStatus(activeInfo.windowId, activeInfo.tabId);
    stopLoading();
    if (currentTabStatus) {
        updateAppStatus(currentTabStatus);
    }
});

function generateTabKey(windowId, tabId) {
    return windowId + "|" + tabId;
}

function updateTabStatus(windowId, tabId, status) {
    var tabKey = generateTabKey(windowId, tabId);
    tabStatuses[tabKey] = status;
}

function getTabStatus(windowId, tabId) {
    var tabKey = generateTabKey(windowId, tabId);
    return tabStatuses[tabKey];
}

function updateAppStatus(status) {
    switch (status) {
        case LOADING_STATUS:
            startLoading();
            break;
        case COMPLETE_STATUS:
            stopLoading();
            break;
        default:
            return;
    }
}

function startLoading() {
    currentStatus = LOADING_STATUS;
    var config = ICON_CONFIG[selectedIcon];
    if (!interval) {
        interval = setInterval(function() {
            if (currentStatus === LOADING_STATUS) {
                var newFrame = (currentFrame + 1) % config.totalFrames;
                setIconImage(newFrame);
                currentFrame = newFrame;
            } else {
                clearInterval(interval);
                interval = undefined;
            }
        }, config.frameRate);
    }
}

function stopLoading() {
    currentStatus = COMPLETE_STATUS;
    currentFrame = 0;
    setIconImage(0);
}

function setIcon(icon) {
    selectedIcon = icon;
    setIconImage(0);
}

function setIconImage(frame) {
    var config = ICON_CONFIG[selectedIcon];
    var path = 'icon-frames/' + config.directoryName + '/frame_' + frame + '.png';
    chrome.browserAction.setIcon({ path: path });
}