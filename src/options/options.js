const SELECTED_ICON_KEY = 'selectedIcon';

var select = document.getElementById('selectedIcon');

loadSelection();

document.getElementById('iconForm').addEventListener('submit', function(e) {
    e.preventDefault();

    var selection = select.options[select.selectedIndex].id;

    if (selection) {
        saveSelection(selection);
    } else {
        alert('Please select an icon');
    }
});

function loadSelection() {
    chrome.storage.sync.get(SELECTED_ICON_KEY, function(selection) {
        if (selection) {
            console.log(selection[SELECTED_ICON_KEY]);
            select.value = "nn";
            // select.value = selection[SELECTED_ICON_KEY];
        }
    });
}

function saveSelection(selection) {
    chrome.storage.sync.set({SELECTED_ICON_KEY: selection}, function() {
        alert('Saved!')
    });
}