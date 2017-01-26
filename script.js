const LOADING_STATUS = 'loading';
const COMPLETE_STATUS = 'complete';
const TOTAL_FRAMES = 34;
const CURRENT_TAB_QUERY = {
    active: true,
    currentWindow: true
}
const FRAME_RATE = 130;

var currentStatus = '';
var currentFrame = 0;
var currentTabs = {}
var tabStatuses = {}
var interval;

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
    console.log("New tab status: " + status);
    var tabKey = generateTabKey(windowId, tabId);
    tabStatuses[tabKey] = status;
}

function getTabStatus(windowId, tabId) {
    var tabKey = generateTabKey(windowId, tabId);
    return tabStatuses[tabKey];
}

function updateAppStatus(status) {
    console.log("Current status: " + currentStatus + "\nNew status: " + status);
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
    console.log("interval: " + interval);
    if (!interval) {
        interval = setInterval(function() {
            if (currentStatus === LOADING_STATUS) {
                var newFrame = (currentFrame + 1) % TOTAL_FRAMES;
                setIconImage(newFrame);
                currentFrame = newFrame;
            } else {
                clearInterval(interval);
                interval = undefined;
            }
        }, FRAME_RATE);
    }
}

function stopLoading() {
    currentStatus = COMPLETE_STATUS;
    currentFrame = 0;
    setIconImage(0);
}

function setIconImage(frame) {
    var path = 'icon-frames/frame_' + frame + '.png';
    chrome.browserAction.setIcon({ path: path });
}