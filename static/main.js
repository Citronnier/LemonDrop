$(document).ready(function () {
    get('rooms', function (res) {
        var rooms = JSON.parse(res);
        $('#roomlist').empty();
        for (var r of rooms)
            $('#roomlist').append('<a>' + r.name + '</a>');
    });
});

function get(url, fn) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState === 4) {
            if (req.status === 200) {
                fn(req.responseText);
            } else {
                // (req.status);
            }
        }
    }
    req.open('GET', url);
    req.send();
};