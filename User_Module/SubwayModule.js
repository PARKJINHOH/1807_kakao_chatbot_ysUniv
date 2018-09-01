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
        var trainLineNm, arvlMsgbe1, arvlMsgbe2; // 상행
        var trainLineNmep, arvlMsgbe1ep, arvlMsgbe2ep; // 급행상행
        var trainLineNm2, arvlMsgbe12, arvlMsgbe22; // 상행 2번째 열차
        var train1, train2, train3;

        try {
            var jsonbody = JSON.parse(body);
            var items = jsonbody.realtimeArrivalList;
            var errCheck = jsonbody.status;

            if (errCheck == '500') {
                callback('열차 운행시간이 종료되었습니다.');
            } else {
                items.forEach(function (record) {

                    //상행 1번째 순서
                    if (record.ordkey.substr(0, 2) === '01' && record.btrainSttus === null && record.ordkey.substr(2, 3) < 10 && record.ordkey.substr(record.ordkey.length - 1, record.ordkey.length) === '0') {

                        trainLineNm = JSON.stringify(record.trainLineNm).slice(1, -1); // 도착지 방면 .slice(1, -1) 큰따음표 제거
                        arvlMsgbe1 = JSON.stringify(record.arvlMsg2).slice(1, -1); // 전역 진입, 전역 도착, 몇번째 등
                        arvlMsgbe2 = JSON.stringify(record.arvlMsg3).slice(1, -1); // 열차위치한 역

                        train1 = '▶상행 [일반] 열차 정보◀' + '\n┌◈도착지 방면\n└ ' + trainLineNm + '\n┌◈열차 상태\n└ ' + arvlMsgbe1 + '\n┌◈열차 위치\n└ ' + arvlMsgbe2 + '역';
                    }

                    if (!train1) {
                        train1 = '▶상행 [일반] 열차 정보◀\n열차정보가 없습니다. 막차 시간, 미발차, 너무 멀리 있는 열차 일 수 있으니 확인해주세요.';
                    }

                    //상행 급행
                    if (record.ordkey.substr(0, 2) === '01' && record.btrainSttus === '급행' && record.ordkey.substr(2, 3) < 15 && record.ordkey.substr(record.ordkey.length - 1, record.ordkey.length) === '1') {

                        trainLineNmep = JSON.stringify(record.trainLineNm).slice(1, -1); // 도착지 방면
                        arvlMsgbe1ep = JSON.stringify(record.arvlMsg2).slice(1, -1); // 전역 진입, 전역 도착, 몇번째 등
                        arvlMsgbe2ep = JSON.stringify(record.arvlMsg3).slice(1, -1); // 열차위치한 역

                        train2 = '\n \n▶상행 [급행] 열차 정보◀' + '\n┌◈도착지 방면\n└ ' + trainLineNmep + '\n┌◈열차 상태\n└ ' + arvlMsgbe1ep + '\n┌◈열차 위치\n└ ' + arvlMsgbe2ep + '역' + '\n┌▣(용산)급행 정차역\n 안양-군포(3번째 전역)-의왕(5)-성균관대(6)-수원(8)-병점(10)' + '\n┌▣(동인천)급행 정차역\n 안양-수원(8번째 전역)-병점(10)-오산(13)-서정리(16)';
                    }

                    if (!train2) {
                        train2 = '\n \n▶상행 [급행] 열차 정보◀\n열차정보가 없습니다. 막차 시간, 미발차, 너무 멀리 있는 열차 일 수 있으니 확인해주세요.';
                    }

                    //상행 2번째 순서
                    if (record.ordkey.substr(0, 2) === '02' && record.btrainSttus === null && record.ordkey.substr(2, 3) < 13 && record.ordkey.substr(record.ordkey.length - 1, record.ordkey.length) === '0') {
                        /*2번째 상행 일반*/
                        trainLineNm2 = JSON.stringify(record.trainLineNm).slice(1, -1); // 도착지 방면
                        arvlMsgbe12 = JSON.stringify(record.arvlMsg2).slice(1, -1); // 전역 진입, 전역 도착, 몇번째 등
                        arvlMsgbe22 = JSON.stringify(record.arvlMsg3).slice(1, -1); // 열차위치한 역

                        train3 = '\n \n▶상행 [다음] 열차 정보◀' + '\n┌◈도착지 방면\n└ ' + trainLineNm2 + '\n┌◈열차 상태\n└ ' + arvlMsgbe12 + '\n┌◈열차 위치\n└ ' + arvlMsgbe22 + '역'
                    }

                    if (!train3) {
                        train3 = '\n \n▶상행 [다음] 열차 정보◀\n열차정보가 없습니다. 막차 시간, 미발차, 너무 멀리 있는 열차 일 수 있으니 확인해주세요.';
                    }

                });
                callback(train1 + train2 + train3 +
                    '\n \n▶안양역 부터의 소요 시간◀\n명학(3분)-금정(5분)-군포(8분)-당정(10분)-의왕(12분)-성균관대(16분)-화서(19분)-수원(21분)' + '\n \n※ 전역이 10번째를 초과할 경우 "서동탄"에서 미발차한 열차가 있을 수 있으니 2~3분 후 다시 조회해 주세요. ' + '\n※ 실제와 약간 다를 수 있습니다.' + '\n자료제공 : 도시교통본부 교통정보과');
            }
        } catch (exception) {
            callback('죄송합니다. 서버상에 문제가 생긴듯 합니다. \n『잠시 후 조회 부탁드리겠습니다.』');
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

        var trainLineNmD, arvlMsgbe1D, arvlMsgbe2D; // 상행
        var trainLineNmepD, arvlMsgbe1epD, arvlMsgbe2epD; // 급행상행
        var trainLineNm2D, arvlMsgbe12D, arvlMsgbe22D; // 상행 2번째 열차
        var traind1, traind2, traind3;

        try {
            var jsonbody = JSON.parse(body);
            var items = jsonbody.realtimeArrivalList;
            var errCheck = jsonbody.status;

            if (errCheck == '500') {
                callback('열차 운행시간이 종료되었습니다.');
            } else {
                items.forEach(function (record) {

                    //하행 첫번째
                    if (record.ordkey.substr(0, 2) === '11' && record.btrainSttus === null && record.ordkey.substr(2, 3) < 10 && record.bstatnNm == '광명') {

                        arvlMsgbe2D = JSON.stringify(record.arvlMsg3).slice(1, -1); // 열차위치한 역

                        traind1 = '▶하행 [일반] 열차 정보◀' + '\n┌◈도착지 방면\n└ ' + '광명행' + '\n┌◈열차 상태\n└ ' + '안양역 미정차 열차입니다.' + '\n┌◈열차 위치\n└ ' + arvlMsgbe2D + '역';

                    } else if (record.ordkey.substr(0, 2) === '11' && record.btrainSttus === null && record.ordkey.substr(2, 3) < 10 && !(record.bstatnNm == '광명') && record.ordkey.substr(record.ordkey.length - 1, record.ordkey.length) === '0') {

                        /*하행 일반*/
                        trainLineNmD = JSON.stringify(record.trainLineNm).slice(1, -1); // 도착지 방면 .slice(1, -1) 큰따음표 제거
                        arvlMsgbe1D = JSON.stringify(record.arvlMsg2).slice(1, -1); // 전역 진입, 전역 도착, 몇번째 등
                        arvlMsgbe2D = JSON.stringify(record.arvlMsg3).slice(1, -1); // 열차위치한 역

                        traind1 = '▶하행 [일반] 열차 정보◀' + '\n┌◈도착지 방면\n└ ' + trainLineNmD + '\n┌◈열차 상태\n└ ' + arvlMsgbe1D + '\n┌◈열차 위치\n└ ' + arvlMsgbe2D + '역';
                    }

                    if (!traind1) {
                        traind1 = '\n \n▶하행 [일반] 열차 정보◀\n열차정보가 없습니다. 막차 시간, 미발차, 너무 멀리 있는 열차 일 수 있으니 확인해주세요.';
                    }

                    //하행 급행
                    if (record.ordkey.substr(0, 2) === '11' && record.btrainSttus === '급행' && record.ordkey.substr(2, 3) < 15 && record.ordkey.substr(record.ordkey.length - 1, record.ordkey.length) === '1') {
                        /*하행 급행*/
                        trainLineNmepD = JSON.stringify(record.trainLineNm).slice(1, -1); // 도착지 방면
                        arvlMsgbe1epD = JSON.stringify(record.arvlMsg2).slice(1, -1); // 전역 진입, 전역 도착, 몇번째 등
                        arvlMsgbe2epD = JSON.stringify(record.arvlMsg3).slice(1, -1); // 열차위치한 역

                        traind2 = '\n \n▶하행 [급행] 열차 정보◀' + '\n┌◈도착지 방면\n└ ' + trainLineNmepD + '\n┌◈열차 상태\n└ ' + arvlMsgbe1epD + '\n┌◈열차 위치\n└ ' + arvlMsgbe2epD + '역' + '\n┌▣(서울역-신창)급행 정차역\n 안양-금천구청(3번째 전역)-영등포(8)-서울역(14)' + '\n┌▣(용산-신창)급행 정차역\n 안양-가산디지털단지(5번째 전역)-구로(6)-신도림(7)-영등포(8)-신길(9)';
                    }

                    if (!traind2) {
                        traind2 = '\n \n▶하행 [급행] 열차 정보◀\n열차정보가 없습니다. 막차 시간, 미발차, 너무 멀리 있는 열차 일 수 있으니 확인해주세요.';
                    }

                    //하행 두번째
                    if (record.ordkey.substr(0, 2) === '12' && record.btrainSttus === null && record.ordkey.substr(2, 3) < 13 && record.ordkey.substr(record.ordkey.length - 1, record.ordkey.length) === '0' && !(record.bstatnNm == '광명')) {
                        /*2번째 하행 일반*/
                        trainLineNm2D = JSON.stringify(record.trainLineNm).slice(1, -1); // 도착지 방면
                        arvlMsgbe12D = JSON.stringify(record.arvlMsg2).slice(1, -1); // 전역 진입, 전역 도착, 몇번째 등
                        arvlMsgbe22D = JSON.stringify(record.arvlMsg3).slice(1, -1); // 열차위치한 역

                        traind3 = '\n \n▶하행 [다음] 열차 정보◀' + '\n┌◈도착지 방면\n└ ' + trainLineNm2D + '\n┌◈열차 상태\n└ ' + arvlMsgbe12D + '\n┌◈열차 위치\n└ ' + arvlMsgbe22D + '역';
                    } else if (record.ordkey.substr(0, 2) === '12' && record.btrainSttus === null && record.ordkey.substr(2, 3) < 13 && record.bstatnNm == '광명') {
                        arvlMsgbe22D = JSON.stringify(record.arvlMsg3).slice(1, -1); // 열차위치한 역
                        traind3 = '\n \n▶하행 [다음] 열차 정보◀' + '\n┌◈도착지 방면\n└ ' + '광명행' + '\n┌◈열차 상태\n└ ' + '안양역 미정차 열차입니다.' + '\n┌◈열차 위치\n└ ' + arvlMsgbe22D + '역';
                    }
                    if (!traind3) {
                        train1 = '▶하행 [다음] 열차 정보◀\n열차정보가 없습니다. 막차 시간, 미발차, 너무 멀리 있는 열차 일 수 있으니 확인해주세요.';
                    }

                });
                callback(traind1 + traind2 + traind3 +
                    '\n \n▶안양역 부터의 소요 시간◀\n관악(3분)-석수(6분)-금천구청(8분)-독산(11분)-가산디지털단지(13분)-구로(17분)' + '\n \n※ 전역이 10번째를 초과할 경우 "광명, 가산디지털단지 등" 미발차한 열차가 있을 수 있으니 2~3분 후 다시 조회해 주세요. ' + '\n※ 실제와 약간 다를 수 있습니다.' + '\n자료제공 : 도시교통본부 교통정보과');
            }
        } catch (exception) {
            callback('죄송합니다. 서버상에 문제가 생긴듯 합니다. \n『잠시 후 조회 부탁드리겠습니다.』');
        }
    });
};
