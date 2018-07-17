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
                callback('▷' + resultbody + '°C');
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

    var todaydateForecast = '' + yyyyy + mmm + ddd;

    var monArr = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31); // 1월~12월 일수
    var mon3 = today.getMonth() + 1; //3시간 뒤 (월)
    var year3 = today.getFullYear(); //3시간 뒤 (년) 해가 바뀔떄 사용...
    var date3 = today.getDate();
    //2월 윤년 구하기
    if (mmm != '02') {
        lastDay = monArr[Number(mmm) - 1];
    } else {
        if ((yyyyy % 4 == 0 && yyyyy % 100 != 0) || yyyyy % 400 == 0) {
            monArr[1] = 29;
        } else {
            monArr[1] = 28;
        }
    }

    /*시간 데이터값*/
    //Update Date
    var uphour = today.getHours();
    var upmin = today.getMinutes();
    var updYear = today.getFullYear();
    var updMonth = today.getMonth();
    var updDate = today.getDate();
    var upTime;
    if (upmin < 40) {
        upTime = uphour - 1 + '시 ' + '00분';
    } else {
        upTime = uphour + '시 ' + '00분';
    }

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
    var fcstTime;
    var fcstTime6;

    if (todaytimeForecast < 0210) {
        todaytimeForecast = '2310';
        fcstTime = '0300';
        fcstTime6 = '0600';
        if (ddd === 01) {
            mmm = today.getMonth;
            ddd = today.getDate - 1;
            todaydateForecast = '' + yyyyy + mmm + ddd;
        } else {
            ddd = today.getDate - 1;
            todaydateForecast = '' + yyyyy + mmm + ddd;
        }
    } else if (todaytimeForecast < 0510) {
        todaytimeForecast = '0210';
        fcstTime = '0600';
        fcstTime6 = '0900';
    } else if (todaytimeForecast < 0810) {
        todaytimeForecast = '0510';
        fcstTime = '0900';
        fcstTime6 = '1200';
    } else if (todaytimeForecast < 1110) {
        todaytimeForecast = '0810';
        fcstTime = '1200';
        fcstTime6 = '1500';
    } else if (todaytimeForecast < 1410) {
        todaytimeForecast = '1110';
        fcstTime = '1500';
        fcstTime6 = '1800';
    } else if (todaytimeForecast < 1710) {
        todaytimeForecast = '1410';
        fcstTime = '1800';
        fcstTime6 = '2100';
    } else if (todaytimeForecast < 2010) {
        todaytimeForecast = '1710';
        date3 = date3 + 1;
        fcstTime = '2100';
        fcstTime6 = '0000';
        if (ddd === monArr[Number(mmm) - 1]) {
            mon3 = mon3 + 1;
            date3 = '01';
            if (mmm == 12) {
                year3 = year3 + 1;
                mon3 = '01';
            }
        }

    } else if (todaytimeForecast < 2310) {
        todaytimeForecast = '2010';
        date3 = date3 + 1;
        fcstTime = '0000';
        fcstTime6 = '0300';
        if (ddd === monArr[Number(mmm) - 1]) {
            mon3 = mon3 + 1;
            date3 = '01';
            if (mmm == 12) {
                year3 = year3 + 1;
                mon3 = '01';
            }
        }
    }
    if (mon3 < 10) {
        mon3 = "0" + mon3;
    }
    if (date3 < 10) {
        date3 = "0" + date3;
    }

    var queryParamsForecast = '?' + encodeURIComponent('ServiceKey') + '=' + Key; /* Service Key*/
    queryParamsForecast += '&' + encodeURIComponent('ServiceKey') + '=' + encodeURIComponent(Key); /* 서비스 인증 */
    queryParamsForecast += '&' + encodeURIComponent('base_date') + '=' + encodeURIComponent(todaydateForecast); /* 오늘 날짜 */
    queryParamsForecast += '&' + encodeURIComponent('base_time') + '=' + encodeURIComponent(todaytimeForecast); /* 매시간 */
    queryParamsForecast += '&' + encodeURIComponent('nx') + '=' + encodeURIComponent('59'); /* 예보지점의 X 좌표값 */
    queryParamsForecast += '&' + encodeURIComponent('ny') + '=' + encodeURIComponent('123'); /* 예보지점의 Y 좌표값 */
    queryParamsForecast += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('100'); /* 한 페이지 결과 수 */
    queryParamsForecast += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* 페이지 번호 */
    queryParamsForecast += '&' + encodeURIComponent('_type') + '=' + encodeURIComponent('json'); /* xml(기본값), json */

    var resultPOP; //강수확률
    var resultREH; //습도
    var resultSKY; //구름
    var resultTMN; //최저
    var resultTMX; //최고
    var outresult; //결과
    var resultT3H; //3시간뒤
    var resultT3H6; //6시간뒤


    //동네
    request({
        url: urlSpaceData + queryParamsForecast,
        method: 'GET'
    }, function (error, response, bodyForecast) {
        console.log(urlSpaceData + queryParamsForecast);
        var jsonbodyForecast = JSON.parse(bodyForecast);
        var itemsForecast = jsonbodyForecast.response.body.items.item;

        var dddd = today.getDate() + 1;
        var mmmm = today.getMonth() + 1; //January is 0!
        var yyyyyy = today.getFullYear();
        var date2310; //2310분 이전 날짜
        if (todaytimeForecast >= 0 && todaytimeForecast < 0210) {
            if (mmm < 10) {
                mmm = "0" + mmm;
            }
            if (ddd < 10) {
                ddd = "0" + ddd;
            }
            date2310 = '' + yyyyy + mmm + ddd;
        } else {
            if (mmmm < 10) {
                mmmm = "0" + mmmm;
            }
            if (dddd < 10) {
                dddd = "0" + dddd;
            }
            date2310 = '' + yyyyyy + mmmm + dddd;
        }

        itemsForecast.forEach(function (record) {
            //강수
            if (record.category === "POP" && record.fcstDate == todaydateForecast && record.fcstTime == fcstTime) {
                resultPOP = JSON.stringify(record.fcstValue);
            }
            //습도
            if (record.category === "REH" && record.fcstDate == todaydateForecast && record.fcstTime == fcstTime) {
                resultREH = JSON.stringify(record.fcstValue);
            }
            //구름
            if (record.category === "SKY" && record.fcstDate == todaydateForecast && record.fcstTime == fcstTime) {
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
            // 3시간뒤 온도
            if (record.category === "T3H" && record.fcstDate == todaydateForecast && record.fcstTime == fcstTime) {
                resultT3H = JSON.stringify(record.fcstValue);
            }
            // 6시간뒤 온도
            if (record.category === "T3H" && record.fcstDate == year3 + '' + mon3 + date3 && record.fcstTime == fcstTime6) {
                resultT3H6 = JSON.stringify(record.fcstValue);
            }
            //최저
            if (record.fcstDate == date2310 && record.category === "TMN") {
                resultTMN = JSON.stringify(record.fcstValue);
            }
            //최고
            if (record.fcstDate == date2310 && record.category === "TMX") {
                resultTMX = JSON.stringify(record.fcstValue);
            }
             outresult = '3시간/6시간 뒤\n▷' + resultT3H + '°C/' + resultT3H6 + '°C\n현재습도\n▷' + resultREH + '% \n강수확률\n▷' + resultPOP + '%\n구름상태\n▷' + resultSKY + '\n내일 최저/최고기온\n▷' + resultTMN + '°C/' + resultTMX + '°C\n서비스 제공자\n▷기상청';
        });

        callback(outresult)

    });
}
