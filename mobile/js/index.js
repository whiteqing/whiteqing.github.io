

function id(obj) {
    return document.getElementById(obj);
}

function bind(obj, ev, fn) {
    if(obj.addEventListener) {
        obj.addEventListener(ev, fn, false);
    } else {
        obj.attachEvent('on' + ev, function() {
            fn.call(obj);
        });
    }
}

function view() {
    return {
        w: document.documentElement.clientWidth,
        h: document.documentElement.clientHeight
    };
}

function addClass(obj, sClass) {
    var aClass = obj.className.split(' ');
    if (!obj.className) {
       obj.className = sClass;
        return;
    }
    for (var i = 0; i < aClass.length; i++) {
        if (aClass[i] === sClass) return;
    }
    obj.className += ' ' + sClass;
}

function removeClass(obj, sClass) {
    var aClass = obj.className.split(' ');
    if (!obj.className) return;
    for (var i = 0; i < aClass.length; i++) {
        if (aClass[i] === sClass) {
            aClass.splice(i, 1);
            obj.className = aClass.join(' ');
            break;
        }
    }
}
function fnLoad() {
    var iTime = new Date().getTime();
    var oW = id('welcome');
    var arr = [""];
    var bImgLoad = true;//判断图片是否加载完
    var bTime = false;//判断是否到了加载时间
    var oTimer = 0;
    bind(oW, "webkitTransitionEnd", end);//考虑兼容性问题，两个都写上
    bind(oW, "transitionend", end);

    oTimer = setInterval(function(){
        if(new Date().getTime() - iTime >=5000){//已经加载完
            bTime = true;
        }
        if(bImgLoad && bTime){
            clearInterval(oTimer);
            oW.style.opacity = 0;
        }
    }, 1000);
    function end() {
        removeClass(oW, 'pageShow');
        fnTab();
    }
    // for (var i = 0;i<arr.length; i++){
    //     var oImg = new Image();
    //     oImg.src = arr[i];
    //     oImg.onload = function(){
    //
    //     }
    // }
}

// bind(document, 'touchmove', function(ev){ //阻止默认事件
//     ev.preventDefault();
// });
function fnTab(){
    var oTab = id('tabPic');
    var oList = id('picList');
    var aNav = oTab.getElementsByTagName('nav')[0].children;
    var iNow = 0;
    var iX = 0;
    var iW = view().w;
    var oTimer = 0;
    var iStartTouchX = 0;
    var iStartX = 0;
    auto();
    if(!window.BfnScore){
        fnScore();
        window.BfnScore = true;
    }
    fnScore ();
    function auto(){
        oTimer = setInterval(function(){
            iNow++;
            iNow = iNow % aNav.length;//过界处理
            tab();
        }, 2000);
    }
    bind(oTab, 'touchstart', fnStart);//手指按下事件
    bind(oTab, 'touchmove', fnMove);//手指拖动事件
    bind(oTab, 'touchend', fnEnd);//手指抬起
    function fnStart(ev){
        oList.style.transition = 'none';
        ev = ev.changedTouches[0];//只记录第一个手指的动作
        iStartTouchX = ev.pageX;
        iStartX = iX;
        clearInterval(oTimer);
    }
    function fnMove(ev){
        ev = ev.changedTouches[0];
        var iDis = ev.pageX - iStartTouchX;//拖动的距离
        iX = iStartX + iDis;
        oList.style.WebkitTransform = oList.style.transform = 'translateX('+iX+'px)';
    }
    function fnEnd(){
        iNow = iX/iW;
        iNow = -Math.round(iNow);
        if(iNow < 0){
            iNow = 0;
        }
        if(iNow > aNav.length-1){
            iNow = aNav.length - 1;
        }
        // iNow = iNow % aNav.length;
        tab();
        auto();
    }
    function tab(){
        iX = -iNow * iW;
        oList.style.transition = '0.5s';
        oList.style.WebkitTransform = oList.style.transform = 'translateX('+iX+'px)';
        for(var i=0; i<aNav.length; i++){
            removeClass(aNav[i], 'active');
        }
        addClass(aNav[iNow], 'active');
    }
}

function fnScore (){
    var oScore = id('score');
    var aLi = oScore.getElementsByTagName('li');
    var arr = ['好失望', '没有想象的那么差','很一般','良好','棒极了'];
    for(var i=0; i<aLi.length; i++){
        fn(aLi[i]);
    }
    function fn(oLi){
        var aNav = oLi.getElementsByTagName('a');
        var oInput = oLi.getElementsByTagName('input')[0];
        for(var i=0; i<aNav.length; i++){
            aNav[i].index = i;
            bind(aNav[i], 'touchstart', function(){
                for(var i=0; i<aNav.length; i++){
                    if(i<=this.index){
                        addClass(aNav[i], 'active');
                    }else{
                        removeClass(aNav[i], 'active');
                    }
                }
                oInput.value = arr[this.index];
            });
        }
    }
    if(!window.BfnIndex){
        fnIndex();
        window.BfnIndex = true;
    }
}
function fnInfo(oInfo, sInfo){
    oInfo.innerHTML = sInfo;
    oInfo.style.WebkitTransform = oInfo.style.transform = 'scale(1)';
    oInfo.style.opacity = '1';
    setTimeout(function(){
        oInfo.style.WebkitTransform = oInfo.style.transform = 'scale(0)';
        oInfo.style.opacity = '0';
    }, 1000);
}
function fnIndex(){
    var oIndex = id('index');
    var oBtn = oIndex.getElementsByClassName('btn')[0];
    var oInfo = oIndex.getElementsByClassName('info')[0];
    var bScore = false;
    bind(oBtn, 'touchend', fnEnd);
    function fnEnd(){
        bScore = fnScoreChecked();
        if(bScore){
            if(bTag()){
                fnIndexOut();
            }else{
                fnInfo(oInfo, '给景区添加标签');
            }
        }else{
            fnInfo(oInfo, '请给景区评分');
        }
    }
    function fnScoreChecked(){
        var oScore = id('score');
        var aInput = oScore.getElementsByTagName('input');
        for(var i=0; i<aInput.length; i++){
            if(aInput[i].value == 0){
                return false;
            }
        }
        return true;
    }
    function bTag(){
        var oIndexTag = id('indexTag');
        var aInput = oIndexTag.getElementsByTagName('input');
        for(var i=0; i<aInput.length; i++){
            if(aInput[i].checked){
                return true;
            }
        }
        return false;
    }
}
function fnIndexOut(){
    var oMask = id('mask');
    var oIndex = id('index');
    var oNews = id('news');
    addClass(oMask, 'pageShow');
    addClass(oNews, 'pageShow');
    if(!window.BfnNews){
        fnNews();
        window.BfnNews = true;
    }
    setTimeout(function(){
        oMask.style.opacity = '1';
        oIndex.style.WebkitFilter = oIndex.style.filter = 'blur(5px)';
    }, 14);
    setTimeout(function(){
        oNews.style.transition = '0.5s';
        oMask.style.opacity = '1';
        oIndex.style.WebkitFilter = oIndex.style.filter = 'blur(0px)';
        oNews.style.opacity = 1;
        removeClass(oMask,"pageShow");
    }, 3000);

}

function fnNews(){
    var oNews = id('news');
    var oInfo = oNews.getElementsByClassName('info')[0];
    var aInput = oNews.getElementsByTagName('input');
    aInput[0].onchange = function(){
        // console.log(this.files);
        if(this.files[0].type.split('/')[0] == 'video'){
            fnNewsOut();
            this.value = '';
        }else{
            fnInfo(oInfo, '请上传视频');
        }
    };
    aInput[1].onchange = function(){
        // console.log(this.files);
        if(this.files[0].type.split('/')[0] == 'image'){
            fnNewsOut();
            this.value = '';
        }else{
            fnInfo(oInfo, '请上传图片');
        }
    };
}
function fnNewsOut(){
    var oNews = id('news');
    var oForm = id('form');
    addClass(oForm, 'pageShow');
    oNews.style.cssText = '';
    removeClass(oNews, 'pageShow');
    if(!window.BformIn){
        formIn();
        window.BformIn = true;
    }

}

function formIn(){
    var oForm = id('form');
    var oOver = id('over');
    var aFormTag = id('formTag').getElementsByTagName('label');
    var oBtn = oForm.getElementsByClassName('btn')[0];
    var bOff = false;
    for(var i=0;i<aFormTag.length; i++){
        bind(aFormTag[i], 'touchend', function(){
            bOff = true;
            addClass(oBtn, 'submit');
        });
    }
    bind(oBtn, 'touchend', function(){
        if(bOff)
        {
            for(var i=0;i<aFormTag.length;i++)
            {
                aFormTag[i].getElementsByTagName("input")[0].checked=false;
            }
            bOff=false;
            addClass(oOver,"pageShow");
            removeClass(oForm,"pageShow");
            removeClass(oBtn,"submit");
            over();
        }
    });
}

function over(){
    var oOver = id('over');
    var oBtn = oOver.getElementsByClassName('btn')[0];
    bind(oBtn, 'touchend', function(){
        removeClass(oOver, 'pageShow');
    });
}
