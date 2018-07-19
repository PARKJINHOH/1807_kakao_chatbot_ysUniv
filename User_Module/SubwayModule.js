module.exports.trainup = function (callback) {
    var request = require('request');

    var url = 'http://swopenapi.seoul.go.kr/api/subway';
    var key = '5161544a4961646738304174544c57';

    var queryParams = '/' + key; /* Service Key*/
    queryParams += '/' + encodeURIComponent('json'); /*타입 json*/
    queryParams += '/' + encodeURIComponent('realtimeStationArrival');
    queryParams += '/' + encodeURIComponent('0');
    queryParams += '/' + encodeURIComponent('8');
    queryParams += '/' + encodeURIComponent('안양');

    request({
        url: url + queryParams,
        method: 'GET'
    }, function (error, response, body) {
        //    console.log('url : ' + url + queryParams);
        var trainLineNm, arvlMsgbe1, arvlMsgbe2; // 상행
        var trainLineNmep, arvlMsgbe1ep, arvlMsgbe2ep; // 급행상행
        var trainLineNm2, arvlMsgbe12, arvlMsgbe22; // 상행 2번째 열차

        try {
            var jsonbody = JSON.parse(body);
            var items = jsonbody.realtimeArrivalList;
            items.forEach(function (record) {
                if (record.rowNum == '1') {
                    /*상행 일반*/
                    trainLineNm = JSON.stringify(record.trainLineNm).slice(1, -1); // 도착지 방면 .slice(1, -1) 큰따음표 제거
                    arvlMsgbe1 = JSON.stringify(record.arvlMsg2).slice(1, -1); // 전역 진입, 전역 도착, 몇번째 등
                    arvlMsgbe2 = JSON.stringify(record.arvlMsg3).slice(1, -1); // 열차위치한 역
                }

                if (record.rowNum == '2') {
                    /*상행 급행*/
                    trainLineNmep = JSON.stringify(record.trainLineNm).slice(1, -1); // 도착지 방면
                    arvlMsgbe1ep = JSON.stringify(record.arvlMsg2).slice(1, -1); // 전역 진입, 전역 도착, 몇번째 등
                    arvlMsgbe2ep = JSON.stringify(record.arvlMsg3).slice(1, -1); // 열차위치한 역
                }

                if (record.rowNum == '5') {
                    /*2번째 상행 일반*/
                    trainLineNm2 = JSON.stringify(record.trainLineNm).slice(1, -1); // 도착지 방면
                    arvlMsgbe12 = JSON.stringify(record.arvlMsg2).slice(1, -1); // 전역 진입, 전역 도착, 몇번째 등
                    arvlMsgbe22 = JSON.stringify(record.arvlMsg3).slice(1, -1); // 열차위치한 역
                }
            });
            callback('▶상행 열차 정보◀' + '\n┌◈도착지 방면\n└ ' + trainLineNm + '\n┌◈열차 상태\n└ ' + arvlMsgbe1 + '\n┌◈열차 위치\n└ ' + arvlMsgbe2 + '역' +
                '\n \n▶상행 [다음] 열차 정보◀' + '\n┌◈도착지 방면\n└ ' + trainLineNm2 + '\n┌◈열차 상태\n└ ' + arvlMsgbe12 + '\n┌◈열차 위치\n└ ' + arvlMsgbe22 + '역' +
                '\n \n▶상행 [급행] 열차 정보◀' + '\n┌◈도착지 방면\n└ ' + trainLineNmep + '\n┌◈열차 상태\n└ ' + arvlMsgbe1ep + '\n┌◈열차 위치\n└ ' + arvlMsgbe2ep + '역' +
                '\n \n▶안양역 부터의 소요 시간◀\n명학(3분)-금정(5분)-군포(8분)-당정(10분)-의왕(12분)-성균관대(16분)-화서(19분)-수원(21분)');
        } catch (exception) {
            callback('죄송합니다. 서버상에 문제가 생긴듯 합니다. \n잠시 후 조회 부탁드리겠습니다.');
        }
    });
};

module.exports.traindown = function (callback) {
    var request = require('request');

    var url = 'http://swopenapi.seoul.go.kr/api/subway';
    var key = '5161544a4961646738304174544c57';

    var queryParams = '/' + key; /* Service Key*/
    queryParams += '/' + encodeURIComponent('json'); /*타입 json*/
    queryParams += '/' + encodeURIComponent('realtimeStationArrival');
    queryParams += '/' + encodeURIComponent('0');
    queryParams += '/' + encodeURIComponent('8');
    queryParams += '/' + encodeURIComponent('안양');

    request({
        url: url + queryParams,
        method: 'GET'
    }, function (error, response, body) {
        //    console.log('url : ' + url + queryParams);
        var trainLineNmD, arvlMsgbe1D, arvlMsgbe2D; // 상행
        var trainLineNmepD, arvlMsgbe1epD, arvlMsgbe2epD; // 급행상행
        var trainLineNm2D, arvlMsgbe12D, arvlMsgbe22D; // 상행 2번째 열차

        try {
            var jsonbody = JSON.parse(body);
            var items = jsonbody.realtimeArrivalList;
            items.forEach(function (record) {
                if (record.rowNum == '3') {
                    /*하행 일반*/
                    trainLineNmD = JSON.stringify(record.trainLineNm).slice(1, -1); // 도착지 방면 .slice(1, -1) 큰따음표 제거
                    arvlMsgbe1D = JSON.stringify(record.arvlMsg2).slice(1, -1); // 전역 진입, 전역 도착, 몇번째 등
                    arvlMsgbe2D = JSON.stringify(record.arvlMsg3).slice(1, -1); // 열차위치한 역
                }

                if (record.rowNum == '4') {
                    /*하행 급행*/
                    trainLineNmepD = JSON.stringify(record.trainLineNm).slice(1, -1); // 도착지 방면
                    arvlMsgbe1epD = JSON.stringify(record.arvlMsg2).slice(1, -1); // 전역 진입, 전역 도착, 몇번째 등
                    arvlMsgbe2epD = JSON.stringify(record.arvlMsg3).slice(1, -1); // 열차위치한 역
                }

                if (record.rowNum == '6') {
                    /*2번째 하행 일반*/
                    trainLineNm2D = JSON.stringify(record.trainLineNm).slice(1, -1); // 도착지 방면
                    arvlMsgbe12D = JSON.stringify(record.arvlMsg2).slice(1, -1); // 전역 진입, 전역 도착, 몇번째 등
                    arvlMsgbe22D = JSON.stringify(record.arvlMsg3).slice(1, -1); // 열차위치한 역
                }
            });
            callback('▶하행 열차 정보◀' + '\n┌◈도착지 방면\n└ ' + trainLineNmD + '\n┌◈열차 상태\n└ ' + arvlMsgbe1D + '\n┌◈열차 위치\n└ ' + arvlMsgbe2D + '역' +
                '\n \n▶하행 [다음] 열차 정보◀' + '\n┌◈도착지 방면\n└ ' + trainLineNm2D + '\n┌◈열차 상태\n└ ' + arvlMsgbe12D + '\n┌◈열차 위치\n└ ' + arvlMsgbe22D + '역' +
                '\n \n▶하행 [급행] 열차 정보◀' + '\n┌◈도착지 방면\n└ ' + trainLineNmepD + '\n┌◈열차 상태\n└ ' + arvlMsgbe1epD + '\n┌◈열차 위치\n└ ' + arvlMsgbe2epD + '역' +
                '\n \n▶안양역 부터의 소요 시간◀\n관악(3분)-석수(6분)-금청구청(8분)-독산(11분)-가산디지털단지(13분)-구로(17분)');
        } catch (exception) {
            callback('죄송합니다. 서버상에 문제가 생긴듯 합니다. \n잠시 후 조회 부탁드리겠습니다.');
        }
    });
};
