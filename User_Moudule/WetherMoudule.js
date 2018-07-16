module.exports.weather = function (callback) {
    var request = require('request');
    //초단기실황 (현재 온도, 하늘 상태맑음(1), 구름조금(2), 구름많음(3), 흐림(4), 강수형태(비,비/눈,눈), 습도)

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

    var todaydate = yyyy + '' + mm + '' + dd;
    var todaytime;

    /*시간 데이터값*/
    var hour = today.getHours();
    var min = today.getMinutes();
    if (min < 40) {
        todaytime = hour - 1 + '40';
    } else {
        todaytime = hour + '40';
    }
    if (todaytime < 1040) {
        todaytime = "0" + todaytime;
    }

    var queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + Key; /* Service Key*/
    queryParams += '&' + encodeURIComponent('ServiceKey') + '=' + encodeURIComponent(Key); /* 서비스 인증 */
    queryParams += '&' + encodeURIComponent('base_date') + '=' + encodeURIComponent(todaydate); /* 오늘 날짜 */
    queryParams += '&' + encodeURIComponent('base_time') + '=' + encodeURIComponent(todaytime); /* 매시간 */
    queryParams += '&' + encodeURIComponent('nx') + '=' + encodeURIComponent('59'); /* 예보지점의 X 좌표값 */
    queryParams += '&' + encodeURIComponent('ny') + '=' + encodeURIComponent('123'); /* 예보지점의 Y 좌표값 */
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('200'); /* 한 페이지 결과 수 */
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* 페이지 번호 */
    queryParams += '&' + encodeURIComponent('_type') + '=' + encodeURIComponent('json'); /* xml(기본값), json */

    //초단기실황
    request({
        url: url + queryParams,
        method: 'GET'
    }, function (error, response, body) {


        var jsonbody = JSON.parse(body);
        var items = jsonbody.response.body.items.item;

        items.forEach(function (record) {
            if (record.category === "T1H") {
                var resultbody;
                resultbody = JSON.stringify(record.obsrValue);
                callback(resultbody);
            }
        });

    });
};







module.exports.tem = function (callback) {
    var request = require('request');

    // 동네예보 (아침 최저기온, 낮 최고기온)
    var urlSpaceData = 'http://newsky2.kma.go.kr/service/SecndSrtpdFrcstInfoService2/ForecastSpaceData';
    var Key = 'RbpZDI%2BoQZSqLj4VxAWdpA07wRUxDlpOp%2B47NNUJepyEr9VBxh0b7zdLCdNxNRDR34lV0%2BjAAiGgqNsN3o%2BOoQ%3D%3D';

    /*날짜 데이터값*/
    var today = new Date();
    var ddd = today.getDate();
    var mmm = today.getMonth() + 1; //January is 0!
    var yyyyy = today.getFullYear();

    if (mmm < 10) {
        mmm = "0" + mmm;
    }
    if (ddd < 10) {
        ddd = "0" + ddd;
    }

    var todaydateForecast = yyyyy + '' + mmm + '' + ddd;

    /*시간 데이터값*/
    //Update Date
    var updYear = today.getFullYear();
    var updMonth = today.getMonth();
    var updDate = today.getDate();
    var upTime;

    //서버에서 시간 불러오는 변수
    var hourForecast = today.getHours();
    var minForecast = today.getMinutes();
    if (hourForecast < 10) {
        hourForecast = "0" + hourForecast;
    }
    if (minForecast < 10) {
        minForecast = "0" + minForecast;
    }
    var todaytimeForecast = hourForecast + '' + minForecast;

    if (todaytimeForecast < 0210) {
        todaytimeForecast = '2310';
        if (ddd === 01) {
            mmm = today.getMonth - 1;
            ddd = today.getDate - 1;
            todaydateForecast = yyyyy + '' + mmm + '' + ddd;
        }
    } else if (todaytimeForecast < 0510) {
        todaytimeForecast = '0210';
        upTime = '2시 10분';
    } else if (todaytimeForecast < 0810) {
        todaytimeForecast = '0510';
        upTime = '5시 10분';
    } else if (todaytimeForecast < 1110) {
        todaytimeForecast = '0810';
        upTime = '8시 10분';
    } else if (todaytimeForecast < 1410) {
        todaytimeForecast = '1110';
        upTime = '11시 10분';
    } else if (todaytimeForecast < 1710) {
        todaytimeForecast = '1410';
        upTime = '14시 10분';
    } else if (todaytimeForecast < 2010) {
        todaytimeForecast = '1710';
        upTime = '17시 10분';
    } else if (todaytimeForecast < 2310) {
        todaytimeForecast = '2010';
        upTime = '20시 10분';
    }


    var queryParamsForecast = '?' + encodeURIComponent('ServiceKey') + '=' + Key; /* Service Key*/
    queryParamsForecast += '&' + encodeURIComponent('ServiceKey') + '=' + encodeURIComponent(Key); /* 서비스 인증 */
    queryParamsForecast += '&' + encodeURIComponent('base_date') + '=' + encodeURIComponent(todaydateForecast); /* 오늘 날짜 */
    queryParamsForecast += '&' + encodeURIComponent('base_time') + '=' + encodeURIComponent(todaytimeForecast); /* 매시간 */
    queryParamsForecast += '&' + encodeURIComponent('nx') + '=' + encodeURIComponent('59'); /* 예보지점의 X 좌표값 */
    queryParamsForecast += '&' + encodeURIComponent('ny') + '=' + encodeURIComponent('123'); /* 예보지점의 Y 좌표값 */
    queryParamsForecast += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('300'); /* 한 페이지 결과 수 */
    queryParamsForecast += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* 페이지 번호 */
    queryParamsForecast += '&' + encodeURIComponent('_type') + '=' + encodeURIComponent('json'); /* xml(기본값), json */

    var resultPOP; //강수확률
    var resultREH; //습도
    var resultSKY; //구름
    var resultTMN; //최저
    var resultTMX; //최고
    var outresult; //결과


    //동네
    request({
        url: urlSpaceData + queryParamsForecast,
        method: 'GET'
    }, function (error, response, bodyForecast) {

        var jsonbodyForecast = JSON.parse(bodyForecast);
        var itemsForecast = jsonbodyForecast.response.body.items.item;


        itemsForecast.forEach(function (record) {
            if (record.category === "POP") {
                resultPOP = JSON.stringify(record.fcstValue);
            }
            if (record.category === "REH") {
                resultREH = JSON.stringify(record.fcstValue);
            }
            if (record.category === "SKY") {
                resultSKY = JSON.stringify(record.fcstValue);
                resultSKY = Number(resultSKY);
                if (resultSKY === 1) {
                    resultSKY = '맑음';
                } else if (resultSKY === 2) {
                    resultSKY = '구름조금';
                } else if (resultSKY === 3) {
                    resultSKY = '구름많음';
                } else if (resultSKY === 4) {
                    resultSKY = '흐림';
                }
            }

            var dddd = today.getDate() + 1;
            var mmmm = today.getMonth() + 1; //January is 0!
            var yyyyyy = today.getFullYear();
            if (mmmm < 10) {
                mmmm = "0" + mmmm;
            }
            if (dddd < 10) {
                dddd = "0" + dddd;
            }
            var checkdate = yyyyyy + '' + mmmm + '' + dddd;
            //최저
            if (record.fcstDate == checkdate && record.category === "TMN") {
                resultTMN = JSON.stringify(record.fcstValue);
            }
            //최고
            if (record.fcstDate == checkdate && record.category === "TMX") {
                resultTMX = JSON.stringify(record.fcstValue);
            }
            outresult = '습      도 : ' + resultREH + '% \n강수확률 : ' + resultPOP + '%\n구      름 : ' + resultSKY + '\n내일 최저/최고기온 : ' + resultTMN + '/' + resultTMX + '°C 입니다. \n 업데이트 성공 시각 : ' + updYear + '.' + updMonth + '.' + updDate + '.  ' + upTime + '\n날씨 서비스 제공자 : 공공데이터포털';
        });

        callback(outresult)

    });
}
