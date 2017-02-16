/**
 * Created by QING on 2016/11/17.
 */

//点击换一换切换图片
function changeList(change, likeLi){
    change.changeNum ++;
    if(change.changeNum > likeLi.length-1){
        change.changeNum = 0;
    }
    for(var i=0;i<likeLi.length;i++){
        likeLi[i].className = '';
    }
    likeLi[change.changeNum].className = 'active';
}

//图片轮播
function carousel(hotLists,buttons){
    var plLis = hotLists.getElementsByTagName('li');
    var spans = buttons.getElementsByTagName('span');
    var width = plLis[0].offsetWidth;
    var spansPrev = 0;
    for(var i=0; i<spans.length; i++){
        spans[i].index = i;
        spans[i].onclick = function(){
            spans[spansPrev].className = '';
            this.className = 'active';
            spansPrev = this.index;
            startMove(hotLists, {
                left : -this.index * width
            });
        };
    }
}

window.onload = function(){
    sdMenu();
    moreNav();

    var cTabMenu = document.getElementsByClassName('c_tabMenu')[0];
    var as = cTabMenu.getElementsByTagName('a');
    var cTabCons = document.getElementsByClassName('c_tabCon');

    var likes = document.getElementsByClassName('like');
    var changes = document.getElementsByClassName('change');

    var hots = document.getElementsByClassName('hot');

    var likeLists = likes[likes.length-1].getElementsByTagName('ul');  //初始化“其他”页面的ul
    var hotLists = hots[hots.length-1].getElementsByTagName('ul');
    var buttons = hots[hots.length-1].getElementsByClassName('buttons');

    //tab切换
    var asPrev = as.length-1;
    for(var i=0; i<as.length; i++){
        as[i].index = i;
        as[i].onclick = function(){
            for(var i=0; i<cTabCons.length; i++){
                cTabCons[i].className = 'c_tabCon clear';
            }
            as[asPrev].className = '';
            this.className = 'active';
            asPrev = this.index;
            cTabCons[this.index].className += ' active';
            likeLists = likes[this.index].getElementsByTagName('ul');//一切换就找到切换页面中的like模块的ul
            hotLists = hots[this.index].getElementsByTagName('ul');
            buttons = hots[this.index].getElementsByClassName('buttons');
            carousel(hotLists[0],buttons[0]);
        };
    }

    for(var i=0; i<likes.length; i++){
        changes[i].changeNum = 0;
    }

    //换一换切换
    var that = null;
    for(var i=0;i<changes.length;i++){
        changes[i].index = i;
        changes[i].onclick = function(){
            that = this;
            changeList(that, likeLists);
        };
    }
    carousel(hotLists[0],buttons[0]);
};

