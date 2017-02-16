/**
 * Created by QING on 2016/11/23.
 */
//网盘子导航的打开和关闭
function sdMenu(){
    var skyDrive = document.getElementsByClassName('skyDrive')[0];
    var sdNav = document.getElementsByClassName('sdNav')[0];
    var icon1 = document.getElementsByClassName('icon')[0];
    var a = skyDrive.getElementsByTagName('a')[0];

    skyDrive.onclick = function(){
        if(icon1.className == 'icon close'){
            icon1.className = 'icon open';
            sdNav.style.display = 'block';
            skyDrive.style.backgroundColor = '#f6f6f8';
            a.style.color = '#333528';
        }else{
            icon1.className = 'icon close';
            sdNav.style.display = 'none';
            skyDrive.style.backgroundColor = '#252525';
            a.style.color = '#efffff';
        }
    };

    // document.body.onclick = function(e){
    //     if((e.clientX < skyDrive.offsetLeft || e.clientX > (skyDrive.offsetLeft+skyDrive.offsetWidth))
    //     && (e.clientY < skyDrive.offsetTop || e.clientY > (skyDrive.offsetTop+skyDrive.offsetHeight))){
    //         icon1.className = 'icon close';
    //         sdNav.style.display = 'none';
    //         skyDrive.style.backgroundColor = '#252525';
    //         a.style.color = '#efffff';
    //     }
    // };
};

//更多子菜单的打开和关闭
function moreNav(){
    var more = document.getElementsByClassName('more')[0];
    var moreNav = document.getElementsByClassName('more_nav')[0];
    var icon2 = document.getElementsByClassName('icon')[1];

    more.onclick = function(){
        if(icon2.className == 'icon close'){
            icon2.className = 'icon open';
            moreNav.style.display = 'block';
        }else{
            icon2.className = 'icon close';
            moreNav.style.display = 'none';
        }
    };
}