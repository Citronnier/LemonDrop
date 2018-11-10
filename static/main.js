var roomid = undefined;

$(document).ready(function () {
    $('#date').val(dateToStr(new Date()));
    get('rooms', function (res) {
        var rooms = JSON.parse(res);
        $('#roomlist').empty();
        for (var r of rooms) {
            $('#roomlist').append('<button class = "btn" id = "room-' + r.id + '">' + r.name + '</button>');
            $('#room-' + r.id).on('click', null, r.id, getActs);
        }
    });
});

$('#submit').on('click', submit);

function getActs(e) {
    roomid = e.data;
    var fromDate = new Date(), toDate = new Date();
    fromDate.setMonth(fromDate.getMonth() - 1);
    fromDate.setDate(1);
    toDate.setMonth(toDate.getMonth() + 7);
    toDate.setDate(0);
    get('rooms/' + roomid + '/acts/from/' + dateToStr(fromDate) + '/to/' + dateToStr(toDate), function (res) {
        var acts = JSON.parse(res);
        addData(acts);
        $('#actpanel')[0].hidden = false;
    });
    return false;
};

function submit() {
    var date = $('#date')[0].value;
    var beginHour = ('0' + $('#begin-hour')[0].value).substr(-2);
    var beginMinute = ('0' + $('#begin-minute')[0].value).substr(-2);
    var endHour = ('0' + $('#end-hour')[0].value).substr(-2);
    var endMinute = ('0' + $('#end-minute')[0].value).substr(-2);
    if ($('#user')[0].value === 'defaul') {
        alert('请选择借用部门！');
        return;
    }
    post('rooms/' + roomid + '/acts', JSON.stringify({
        begin: date + ' ' + beginHour + ':' + beginMinute,
        end: date + ' ' + endHour + ':' + endMinute,
        user: $('#user option:selected').text(),
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

function dateToStr(date) {
    return date.getFullYear() + '-'
        + ('0' + (date.getMonth() + 1)).substr(-2) + '-'
        + ('0' + date.getDate()).substr(-2);
};

function addData(acts) {
    var data = acts.map(function (act) { return {
        title: act.user,
        start: new Date(act.begin),
        end: new Date(act.end),
        allDay: false,
        text: act.begin.split(' ')[1] + " - " + act.end.split(' ')[1] + ' : ' + act.user,
    }});
    $('#holder').calendar({ data: data });
};