const LOADING_STATUS = 'loading';
const COMPLETE_STATUS = 'complete';
const TOTAL_FRAMES = 34;

var currentStatus = '';
var currentFrame = 0;

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    var queryOptions = {
        active: true,
        currentWindow: true
    }
    chrome.tabs.query(queryOptions, function(currentTab) {
        currentTab = currentTab[0];
        console.log(currentTab);
        if (currentTab.id === tabId) {
            update(changeInfo.status);
        }
    });
});

function update(status) {
    if (status === LOADING_STATUS) {
        startLoading();
    } else if (status === COMPLETE_STATUS) {
        stopLoading();
    } else {
        return;
    }
}

function startLoading() {
    currentStatus = LOADING_STATUS;
    var interval = setInterval(function() {
        if (currentStatus === LOADING_STATUS) {
            var newFrame = (currentFrame + 1) % TOTAL_FRAMES;
            setIconImage(newFrame);
            currentFrame = newFrame;
        }
    }, 100);
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