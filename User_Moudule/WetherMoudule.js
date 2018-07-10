module.exports.wether = function wether() {
    var request = require('request');

    var url = 'http://newsky2.kma.go.kr/service/SecndSrtpdFrcstInfoService2/ForecastGrib';
    var Key = 'RbpZDI%2BoQZSqLj4VxAWdpA07wRUxDlpOp%2B47NNUJepyEr9VBxh0b7zdLCdNxNRDR34lV0%2BjAAiGgqNsN3o%2BOoQ%3D%3D';


    /*날짜 데이터값*/
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (mm < 10) {
        mm = "0" + mm;
    }
    if (dd < 10) {
        dd = "0" + dd;
    }

    var todaydate = yyyy + mm + dd;



    /*시간 데이터값*/
    var hour = today.getHours();
    var min = today.getMinutes();
    if (hour < 10) {
        hour = "0" + hour;
    }

    var todaytime = hour;

    /*위치 데이터값*/
    var nx = '59';
    var ny = '123';


    var queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + Key; /* Service Key*/
    queryParams += '&' + encodeURIComponent('ServiceKey') + '=' + encodeURIComponent(Key); /* 서비스 인증 */
    queryParams += '&' + encodeURIComponent('base_date') + '=' + encodeURIComponent(todaydate); /* 오늘 날짜 */
    queryParams += '&' + encodeURIComponent('base_time') + '=' + encodeURIComponent(hour - 1 + '00'); /* 매시간 */
    queryParams += '&' + encodeURIComponent('nx') + '=' + encodeURIComponent('59'); /* 예보지점의 X 좌표값 */
    queryParams += '&' + encodeURIComponent('ny') + '=' + encodeURIComponent('123'); /* 예보지점의 Y 좌표값 */
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); /* 한 페이지 결과 수 */
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* 페이지 번호 */
    queryParams += '&' + encodeURIComponent('_type') + '=' + encodeURIComponent('json'); /* xml(기본값), json */

    request({
        url: url + queryParams,
        method: 'GET'
    }, function (error, response, body) {

        var jsonbody = JSON.parse(body);
        var items = jsonbody.response.body.items.item;
        var resultbody;

        items.forEach(function (record) {
            if (record.category === "T1H") {
                resultbody = record.obsrValue;
            }
        });

        console.log('연성대학교 날씨 : ' + resultbody + '도');
        return resultbody;
    });
}