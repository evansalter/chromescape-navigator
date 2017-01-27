const SELECTED_ICON_KEY = 'selectedIcon';

var select = document.getElementById('selectedIcon');

loadSelection();

document.getElementById('iconForm').addEventListener('submit', function(e) {
    e.preventDefault();

    var selection = select.options[select.selectedIndex].value;

    if (selection) {
        saveSelection(selection);
    } else {
        alert('Please select an icon');
    }
});

function loadSelection() {
    chrome.storage.sync.get(SELECTED_ICON_KEY, function(selection) {
        if (selection) {
            select.value = selection[SELECTED_ICON_KEY];
        }
    });
}

function saveSelection(selection) {
    var obj = {};
    obj[SELECTED_ICON_KEY] = selection;
    chrome.storage.sync.set(obj, function() {
        alert('Saved!')
    });
}