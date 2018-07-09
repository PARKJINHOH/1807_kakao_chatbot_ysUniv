var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');



//추가
var http = require('http');
var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

/*  설정 시작    */
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//http://서버주소/keyboard
app.get('/keyboard', function(req,res){
    //전달할 데이터
    var data={
        'type' : 'buttons',
        'buttons' : ['도움말','장학금','현장실습']
    };
    // json 형식으로 응답
    res.json(data);
});



//http://서버주소/message
app.post('/message',function(req,res){
    var string = req.body.content;
    var msg = "";
    var searchlist = ['도움말','국가장학금','장학금','f성적','방학 현장실습','학기제 현장실습','현장실습','재수강'
+'연성대학교','대학교','학식','급식'];
    var listcount = 0;   

   for(var i=0; i<searchlist.length; i++){
    if(string.indexOf(searchlist[i]) != -1){
      msg = searchlist[i];
      break;
    }else{
     listcount++;
    }
   }


    console.log('전달받은 메시지 : ' + msg);
    
    var send = {}; //응답할 데이터
    
    switch(msg){
	 case '도움말':
            send = {
                'message' : {
                    'text' : '명령어 \n 국가장학금, 장학금 \n f성적 , 성적 \n 현장실습, 방학 현장실습, 학기제 현장실습 \n 재수강 \n 학식, 급식 \n 대학교, 연성대학교 \n 업데이트 날짜 : 2018 / 07 / 06 by 연성대 컴퓨터 소프트웨어_PJH'
                }
            }
            break;

        case '장학금' :
            send = {
                'message' : {
                    'text' : '성적장학금은 과, 학년에 따라 받는 인원수는 다르며, 평균 4-7명정도 받을 수 있습니다.'
                }
            }
            break;
            
        case '현장실습' :
            send = {
                'message' : {
                    'text' : '현장실습은 방학 혹은 학기에 하는 현장실습이 있습니다.'
                },
                keyboard:{
                    'type': 'buttons',
                    'buttons':['방학 현장실습','학기제 현장실습']
                }
            }
            break;

        case 'f성적' :
            send = {
                 'message' : {
                    'text' : 'f성적이신가요? 저런... 열심히 하시죠...'
                }
            }
            break;

        case '국가장학금' :
            send = {
                 'message' : {
                    'text' : '국가장학금 저도 좀 받을 수 있으면....'
                }
            }
            break;

        case '재수강' :
            send = {
                 'message' : {
                    'text' : '재수강... 불쌍하셔라....'
                }
            }
            break;
	

        case '방학 현장실습' :
            send = {
                'message' : {
                    'text' : '학과사무실에 물어보면 찾고자 하는 정보를 빠르고 정확하게 알 수 있습니다. \n 이수 시간 : 160시간 \n 일수 : 20일+a \n 급여 : 최소 20만원 이상 \n  '
                }
            }
            break;

        case '학기제 현장실습' :
            send = {
                'message' : {
                    'text' : '학기 내내 하는 현장실습 입니다.  '
                }
            }
            break;
                        
        default :
            send = {
                 'message' : {
                    'text' : '죄송합니다. 학습이 부족해 알 수 없는 명령입니다. 좀 더 공부하겠습니다.'
                }
            }
            break;
      }
    res.json(send) //send에 저장된 데이터 전달    
});




/* 설정 끝 */







// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
