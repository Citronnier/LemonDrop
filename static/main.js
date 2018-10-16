$(document).ready(function () {
    get('rooms', function (res) {
        var rooms = JSON.parse(res);
        $('#roomlist').empty();
        for (var r of rooms) {
            $('#roomlist').append('<a id="room-' + r.id + '" href="#">' + r.name + '</a>');
            $('#room-' + r.id).on('click', null, r.id, getActs);
        }
    });
});

function getActs(e) {
    var roomid = e.data;
    var year = new Date().getFullYear();
    var month = new Date().getMonth() + 1;
    get('rooms/' + roomid + '/acts/month/' + year + '-' + month, function (res) {
        var acts = JSON.parse(res);
        $('#actlist').empty();
        for (var act of acts) {
            $('#actlist').append('<p>' + JSON.stringify(act) + '</p>');
        }
    });
    return false;
};

function get(url, success, fail) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState === 4) {
            if (req.status === 200) {
                success(req.responseText);
            } else if (fail) {
                fail(req.status);
            }
        }
    }
    req.open('GET', url);
    req.send();
};