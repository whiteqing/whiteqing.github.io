/**
 * Created by QING on 2016/11/17.
 */


window.onload = function(){
    sdMenu();
    moreNav();

    var username = document.getElementsByClassName('username')[0];
    var password = document.getElementsByClassName('password')[0];
    var submit = document.getElementById('submit');
    var warning = document.getElementsByClassName('warning')[0];

    //账号信息:账号，密码和用户名
    var acNum = ["miaoweiketang","miaovketang","miaov","miaov66"];
    var acPass = ["miaoweiketang","miaovketang","miaov","miaov66"];
    var acName = ["妙味课堂88","妙味课堂55","妙味课堂99","妙味课堂66"];

    //测试账号是否正确
    function testAcNum(){
        for(var i=0; i<acNum.length; i++){
            if(username.value == '') return;
            if(acNum.indexOf(username.value) != -1){
                warning.innerHTML = '';
            }else{
                warning.innerHTML = '账号错误';
            }
        }
    };
    username.onblur = testAcNum;
    submit.onclick = function(){
        if(username.value == '' || password.value == ''){
            warning.innerHTML = '请确认账号密码！';
        }else{
            var index = acNum.indexOf(username.value);
            if(acPass.indexOf(password.value) != index){
                warning.innerHTML = '密码错误';
            }else{
                warning.innerHTML = '';
                window.location.href = 'user.html'; //账号密码都正确就跳转
            }
        }
   }

};