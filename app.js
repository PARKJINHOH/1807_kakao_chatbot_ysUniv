var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();


//url 모음
var ys_homepage = 'http://www.yeonsung.ac.kr';
var ys_location = 'https://www.google.co.kr/maps/place/%EC%97%B0%EC%84%B1%EB%8C%80%ED%95%99%EA%B5%90/@37.3964417,126.9048964,15.17z/data=!4m5!3m4!1s0x0:0x90333c28b83c0e84!8m2!3d37.396555!4d126.9077861';
var ys_scholarship = 'http://www.yeonsung.ac.kr/ko/cms/FR_CON/index.do?MENU_ID=650';
var ys_mileage = 'http://www.yeonsung.ac.kr/ko/cms/FR_CON/index.do?MENU_ID=930';
var kosaf = 'http://hope.kosaf.go.kr';
var Univstudy = 'http://www.yeonsung.ac.kr/ko/cms/FR_CON/index.do?MENU_ID=1450';




//추가 시작
var http = require('http');
var bodyParser = require('body-parser');
//추가 끝

// http 시작
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// http 끝

// view engine 시작
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
// view engine 끝

/*  설정 시작    */
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

//http://서버주소/keyboard
app.get('/keyboard', function (req, res) {
    //전달할 데이터
    var data = {
        'type': 'buttons',
        'buttons': ['도움말']
    };
    // json 형식으로 응답
    res.json(data);
});



//http://서버주소/message
app.post('/message', function (req, res) {
    //string = 입력받은 카카오톡 문자
    var string = req.body.content;

    //모든 공백 제거 / 소문자 치환
    var trimstring = string.replace(/(\s*)/g, "").toLowerCase();

    // 최종 전달받은 메시지 변수
    var msg = "";

    //챗봇이 알아들을 수 있는 큰 분류 list
    var searchlist = ['도움말', '장학금', '성적', '현장실습', '재수강', '대학교', '학식'];

    // for문할 때, 입력된게 맞지 않으면 list 이동할 때 사용.
    var listcount = 0;

    for (var i = 0; i < searchlist.length; i++) {
        if (trimstring.indexOf(searchlist[i]) != -1) {
            msg = trimstring;
            break;
        } else {
            listcount++;
        }
    }


    console.log('전달받은 메시지 : ' + msg);

    var send = {}; //응답할 데이터
    var testa = '1';

    switch (trimstring) {
        case '도움말':
            send = {
                'message': {
                    'text': '********명령어******** \n ● 국가장학금, 장학금 \n ● f학점 , 성적 \n ● 현장실습, 방학 현장실습, 학기제 현장실습 \n ● 재수강 \n ● 학식, 급식 \n ● 대학교, 연성대학교 \n' +
                        '업데이트 날짜 : 2018 / 07 / 11 by 연성대 컴퓨터 소프트웨어_PJH'
                }
            }
            break;
            // 국가장학금, 1유형, 2유형, 장학금, 성적장학금, gem마일리지, f학점
        case '국가장학금':
            send = {
                'message': {
                    'text': '국가장학금 \n 매년 2회 실시를 하며 등록 기간이 있으며 1유형과 2유형이 있습니다. 아래 버튼을 클릭해 주세요.'
                },
                keyboard: {
                    'type': 'buttons',
                    'buttons': ['1유형', '2유형']
                },
                "message_button": {
                    "label": "국가장학금 홈페이지",
                    "url": kosaf
                }
            }
            break;

        case '1유형':
            send = {
                'message': {
                    'text': '국가 장학금 1유형 \n 매년 2회 실시를 하며 신청일정에 신청을 꼭 해야 합니다. 장학금 금액은 가구소득분위에 따라서 장학금을 차등 지급 합니다. 올해년도 신청일자는 ~ 입니다.'
                }
            }
            break;

        case '2유형':
            send = {
                'message': {
                    'text': '2유형 장학금은 대학교에서 주는 장학금으로 1유형 장학금을 받은 학생중에서 선발이 됩니다. 1유형을 받았어도 선택이 안될 수 있으니 심사를 기다려 보세요. \n 만약 1유형+2유형이 한학기 등록금을 초과할 경우 초과분은 미지급되며, 이후 학교에서의 성적장학금, 복지장학금등 기타 장학금은 받을 수 없습니다.. 자세한건 [장학금 지급 순서]로 검색해 보세요.'
                }
            }
            break;

        case '장학금':
            send = {
                'message': {
                    'text': '장학금은 다양하게 얻을 수 있습니다. 대회, 성적, 자격증 취득, Gem마일리지 등이 있습니다. \n 대회 장학금 금액은 대회, 순위에 따라 다르며 교내 대회같은 경우 경쟁률이 낮기 떄문에 충분히 장학금을 얻을 수 있습니다. \n*(성적 장학금, Gem마일리지를 검색해 보세요.)'
                },
                keyboard: {
                    'type': 'buttons',
                    'buttons': ['장학금 지급 순서', '성적 장학금', 'gem 마일리지']
                },
                "message_button": {
                    "label": "교내, 교외 장학금 종류",
                    "url": ys_scholarship
                }
            }
            break;
        case '장학금지급순서':
            send = {
                'message': {
                    'text': '장학금 지급 순서\n 장학금은 고지서에서 빠지며 빠지는 순서는 국가장학금 > 성적장학금으로 빠진다. 만약 한학기 등록금이 300만원 일때, 국가장학금으로 250만원을 받았고 성적장학금으로 100만원을 받을때, 성적장학금은 50만원만 받을 수 있고 50만원은 받을 수 없습니다.'
                }
            }
            break;
        case '성적장학금':
            send = {
                'message': {
                    'text': '성적장학금 \n 학년별 성적이 우수한 학생을 위에서부터 지급, 인원은 인원수에 따라 다르며 4명~7명정도 받는다. \n 1등은 한학기 전액, 2등은 50%, 3등은 30%, 4등은 20% 이며 변동이 많으니 학과사무실 및 담임교수님께 문의를 해보는게 정확하다. \n 성적장학금은 계좌로 주는게 아닌, 국가장학금처럼 고지서에서 자동으로 빠진다.'
                }
            }
            break;
        case 'gem마일리지':
            send = {
                'message': {
                    'text': ''
                },
                "message_button": {
                    "label": "커리어&Gem마일리지 안내표",
                    "url": ys_mileage
                }
            }
            break;

        case '성적':
            send = {
                'message': {
                    'text': '성적 , 성적분포, 성적 정리표 \n 성적은 학점과 점수가 있으며 학점은 4.5만점, 점수는 100점 만점 입니다. 성적 분포는 A는 최대 30%를 교수님이 줄 수 있습니다. \n   점수     학점   등급 \n100~95     4.5     A+ \n94~90      4.0     A0 \n89~85      3.5     B+\n84~80      3.0     B0\n84~80      3.0     B0\n79~76      2.5     C+\n75~70      2.0     C0\n69~65      1.5     D+\n64~60      1.0     D0\n59~           -       F\n \n 순위는 따로 통합정보시스템에 없으며, 학과사무실에 전화를 해야만 알 수 있습니다.'
                }
            }
            break;
        case '연성대':
        case '대학교':
        case '연성대학교':
            send = {
                'message': {
                    'text': '안녕하세요. 연성대학교 입니다. \n 연락처 : 031-441-1100'
                },
                keyboard: {
                    'type': 'buttons',
                    'buttons': ['연성대학교위치']
                },
                "message_button": {
                    "label": "연성대학교 홈페이지 링크",
                    "url": ys_homepage
                }
            }
            break;

        case '연성대학교위치':
            send = {
                "message": {
                    "text": "위치 : 경기도 안양시 만안구 안양3동 양화로37번길 34",
                    "message_button": {
                        "label": "연성대학교 주소 위치",
                        "url": ys_location
                    }
                }
            }
            break;
        case '현장실습':
            send = {
                'message': {
                    'text': '방학 현장실습, 학기제 현장실습이 있습니다. \n 현장실습을 하지 못할경우 졸업을 할 수 없습니다.'
                },
                keyboard: {
                    'type': 'buttons',
                    'buttons': ['방학 현장실습', '학기제 현장실습']
                },
                "message_button": {
                    "label": "연성대학교 홈페이지 링크",
                    "url": ys_homepage
                }
            }
            break;
        case '방학현장실습':
            send = {
                'message': {
                    'text': '하계방학 및 동계방학에 이루어지는 현장실습이며, 동계에 현장실습을 할 경우 졸업이전 최종서류를 작성, 제출해야 하기 때문에 기말고사 종료후 바로 해야 합니다. \n이수시간 : 1일 8시간 이내로 인정하며, 총 4주(160시간) 이상을 원칙으로 합니다.\n 급여 : 업체가 주는 급여는 최소 20만원입니다. \n 자세한건 학과 사무실에 물어보세요.'
                },
                "message_button": {
                    "label": "연성대학교 학과별 홈페이지",
                    "url": Univstudy
                }
            }
            break;
        case '학기제현장실습':
            send = {
                'message': {
                    'text': '졸업학년도 재학생으로 2학기 등록을 한 학생중 개강 후 학기중에 현장실습을 가는것을 말합니다. \n이수시간 : 1일 8시간, 주 40시간을 기준으로 연속적으로 15주간 실시 이상을 원칙으로 합니다. \n 급여 : 업체가 주는 급여는 최소 20만원입니다. \n 자세한건 학과 사무실에 물어보세요.'
                },
                "message_button": {
                    "label": "연성대학교 학과별 홈페이지",
                    "url": Univstudy
                }
            }
            break;
        case '날씨':
            send = {
                'message': {
                    'text': 'testa : ' + testa
                }
            }
            break;

        default:
            send = {
                'message': {
                    'text': '죄송합니다. 학습이 부족해 알 수 없는 명령입니다. 좀 더 공부하겠습니다.'
                }
            }
            break;
    }
    res.json(send) //send에 저장된 데이터 전달    
});


/* 설정 끝 */




// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
//끝
