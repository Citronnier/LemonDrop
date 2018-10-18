var roomid = undefined;

$(document).ready(function () {
    // $('#date')[0].value = new Date().getFullYear() + '-01-01';
    get('rooms', function (res) {
        var rooms = JSON.parse(res);
        $('#roomlist').empty();
        for (var r of rooms) {
            $('#roomlist').append('<a id="room-' + r.id + '" href="#">' + r.name + '</a>');
            $('#room-' + r.id).on('click', null, r.id, getActs);
        }
    });
});

$('#commit').on('click', commit);

function getActs(e) {
    roomid = e.data;
    var year = new Date().getFullYear();
    var month = new Date().getMonth() + 1;
    get('rooms/' + roomid + '/acts/month/' + year + '-' + month, function (res) {
        var acts = JSON.parse(res);
        $('#actlist').empty();
        for (var act of acts) {
            $('#actlist').append('<p>' + JSON.stringify(act) + '</p>');
        }
        $('#actpanel')[0].hidden = false;
    });
    return false;
};

function commit() {
    var date = $('#date')[0].value;
    var beginHour = ('0' + $('#begin-hour')[0].value).substr(-2);
    var beginMinute = ('0' + $('#begin-minute')[0].value).substr(-2);
    var endHour = ('0' + $('#end-hour')[0].value).substr(-2);
    var endMinute = ('0' + $('#end-minute')[0].value).substr(-2);
    post('rooms/' + roomid + '/acts', JSON.stringify({
        begin: date + ' ' + beginHour + ':' + beginMinute,
        end: date + ' ' + endHour + ':' + endMinute,
        user: $('#user')[0].value,
    }), function (res) {
        $('#room-' + roomid).click();
    })
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

function post(url, content, success, fail) {
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
    req.open('POST', url);
    req.send(content);
};