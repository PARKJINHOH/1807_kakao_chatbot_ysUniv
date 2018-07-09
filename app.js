var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();


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

    switch (trimstring) {
        case '도움말':
            send = {
                'message': {
                    'text': '********명령어******** \n ● 국가장학금, 장학금 \n ● f학점 , 성적 \n ● 현장실습, 방학 현장실습, 학기제 현장실습 \n ● 재수강 \n ● 학식, 급식 \n ● 대학교, 연성대학교 \n' +
                        '업데이트 날짜 : 2018 / 07 / 09 by 연성대 컴퓨터 소프트웨어_PJH'
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
                }
            }
            break;

        case '성적':
            send = {
                'message': {
                    'text': '성적 , 성적분포, 성적 정리표 \n 성적은 학점과 점수가 있으며 학점은 4.5만점, 점수는 100점 만점 입니다. 성적 분포는 A는 최대 30%를 교수님이 줄 수 있습니다. \n 점수 100~95, [학점 4.5 , 등급 A+] \n 점수 94~90, [학점 4.0 , 등급 A0] \n 점수 89~85, [학점 3.5 , 등급 B+] \n 점수 84~80, [학점 3.0 , 등급 B0] \n 점수 84~80, [학점 3.0 , 등급 B0] \n 점수 79~76, [학점 2.5 , 등급 C+] \n 점수75~70, [학점 2.0 , 등급 C0] \n 점수 69~65, [학점 1.5 , 등급 D+] \n 점수 64~60, [학점 1.0 , 등급 D0] \n 점수59~, [학점 -  , 등급 F] \n \n 순위는 따로 통합정보시스템에 없으며, 학과사무실에 전화를 해야만 알 수 있습니다.'
                }
            }
            break;
        case '연성대':
        case '대학교':
        case '연성대학교':
            send = {
                'message': {
                    'text': '연성대학교 홈페이지 링크 입니다.'
                },
                "photo": {
                    "url": "http://www.yeonsung.ac.kr/ajax/CMN_SVC/FileView.do?GBN=X01&SITE_GROUP_NO=2&SITE_NO=2",
                    "width": 640,
                    "height": 480
                },
                "message_button": {
                    "label": "연성대학교 홈페이지",
                    "url": "http://www.yeonsung.ac.kr"
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
