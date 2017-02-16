window.onload = function(){
	sdMenu();
    moreNav();

    var data = [
			{
				id:0,
				name:'gg',
				pid:-1
			},
			{
				id:1,
				name:'新建文件夹',
				pid:-1
			},
			{
				id:2,
				name:'毛毛',
				pid:0  //表示父文件夹的id为0
			},
			{
				id:3,
				name:'sdddddd',
				pid:0  //表示父文件夹的id为0
			},
			{
				id:4,
				name:'bb',
				pid:2  //表示父文件夹的id为0
			}
    ];

    // 默认
    var def = {    	
    	fname:[],				// 存放是默认名字的文件夹
    	name:'新建文件夹',
    	setName:function(){		// 创建一个文件夹，判断这个文件夹的默认名字是什么
    		if(def.fname.length == 0){
				return 1;
			}else{
				for(var i=0; i<def.fname.length; i++){
					var num = parseInt(def.fname[i].split(' (')[1].split(')')[0]);
					if(num != i+1){
						return i+1;
					}						
				}
				//如果值都对了，说明前面的文件夹都是默认名字
				return def.fname.length+1;
			}			
		},
		deleteName:function(n){
			for(var i=0; i<def.fname.length; i++){
				if(def.fname[i] == n){
					def.fname.splice(i,1);
					// i--;
				}
			}
		}
    }

    
    var sys = document.getElementsByClassName('sys')[0];
    var btns = sys.getElementsByClassName('o_button');
    var fileList = document.getElementsByClassName('fileList')[0];
    var files = document.getElementsByClassName('file');
    var fileNames = document.getElementsByClassName('file_name');
    var fileIcons = document.getElementsByClassName('fileIcon');
    var checkboxs = document.getElementsByClassName('checkbox');
    var checkAll = document.getElementsByClassName('checkAll')[0].getElementsByTagName('input')[0];
    var crumbNav = document.getElementsByClassName('crumb_nav')[0];
    var bread = document.getElementsByClassName('bread')[0];
    var totalFile = crumbNav.getElementsByClassName('totalFile')[0];
    var back = crumbNav.getElementsByClassName('back')[0];
    var contextMenu = document.getElementsByClassName('contextMenu');
    var shadow = document.getElementById('shadow');//框选
    var dragCount = document.getElementById('dragCount');
	var count = document.getElementsByClassName('count')[0];
	var listSwitch = document.getElementsByClassName('list_switch')[0];
	var list = listSwitch.getElementsByClassName('list')[0];
	var thumbnail = listSwitch.getElementsByClassName('thumbnail')[0];
	var cssSwitch = document.getElementById('cssSwitch');
	var alters = document.getElementsByClassName('alter');
	var operation = document.getElementById('operation');
    var pid = -1;//在第一页创建数据，pid为-1
    var isRename = false;//没在重命名
   	var num = data.length-1;//设置数据id
   	var href = location.href;
   	var path = [];//记录跳转路径
   	var p = '';
   	var isMenuDelete = false;//不是点击的右键菜单里的删除时，此值为false
   	var isMenuRename = false;//不是点击的右键菜单里的重命名时，此值为false
   	var isList = false; //文件夹为列表布局时，此值为true
   	var parentFile = null;//目标文件夹
   	
   	totalFile.onclick = function(){
   		location.hash = '';
   	};
	// 初始化pid为-1的数据
	for(var i=0; i<data.length; i++){
		if(data[i].pid == -1){
			createFolder(data[i]);
			count.innerHTML = files.length;
		}
	}
	function createFolder(d){
		// 新建文件夹的时候全选按钮不勾
		if(checkAll.checked){
			checkAll.checked = false;
		}
		var file = document.createElement('div');
		file.className = 'file fl';
		file.isCheck = false;//是否被框选
		var fileIcon = document.createElement('div');
		fileIcon.className = 'fileIcon folder';	
		var checkbox = document.createElement('span');
		checkbox.className = 'checkbox';
		var fileName = document.createElement('a');
		fileName.className = 'file_name';
		var alter = document.createElement('div');
		alter.className = 'alter clear active';
		var input = document.createElement('input');
		input.type = 'text';		
		var sure = document.createElement('a');
		sure.className = 'sure';
		sure.href = 'javascript:;';
		var cancel = document.createElement('a');
		cancel.className = 'cancel';
		cancel.href = 'javascript:;';
		fileList.appendChild(file);
		file.appendChild(fileIcon);
		fileIcon.appendChild(checkbox);
		file.appendChild(fileName);
		file.appendChild(alter);
		alter.appendChild(input);
		alter.appendChild(sure);
		alter.appendChild(cancel);

		// 如果已经存在数据
		if(d){
			file.index = d.id;
			file.pid = d.pid;
			alter.className = 'alter clear';
			fileName.className = 'file_name active';
			fileName.innerHTML = d.name;
			input.value = d.name;
		}else{
			input.value = def.name + ' ('+def.setName()+')';
		}
		input.select();
		input.focus();

		input.onkeydown = function(ev){
			ev = ev || event;
			if(ev.keyCode === 13){
				ensureName();
			}
			
		};
		// 确认名字
		sure.onclick = ensureName;
		function ensureName(){
			var val = input.value;		
			if(/^\s*$/.test(val)){
				alert('文件名不能为空哦~');
			}else{
				var fN = convertToArray(fileNames);
				for(var i=0; i<fN.length; i++){
					if(fN[i] == sure.parentNode.previousElementSibling){
						continue;
					}else{
						if(fN[i].innerHTML == val){
							alert('文件夹不能重名哦');
							input.focus();
							input.select();
							return;
						}						
					}
				}

				// 不重名
				var a = sure.parentNode.previousElementSibling;
				var alter = sure.parentNode;
				// 执行的是重命名
				if(isRename){
					for(var i=0; i<data.length; i++){
						if(data[i].id == file.index){
							data[i].name = val;
						}
					}
					isRename = false;
				}else{
					// 执行的是新建文件夹，往data里面插入一条数据
					num++;
					var addData = {};
					addData.id = num;
					addData.name = val;
					addData.pid = pid;
					// 给文件夹一个标识，存好id和pid
					file.index = num;
					file.pid = pid;
					data.push(addData);
				
				}		
				// 如果是默认的名字，就存一下
				saveDefName(val, a.innerHTML); 

				a.className = 'file_name active';
				a.innerHTML = val;
				alter.className = 'alter clear';				
				
				count.innerHTML = files.length;
				console.log(def.fname);
				console.log(data);
			}
		}

		//取消名字
		cancel.onclick = function(){
			var a = this.parentNode.previousElementSibling;
			var alter = this.parentNode;
			// 刚创建的文件夹
			if(/^\s*$/.test(a.innerHTML)){		
				// num++;		
				// a.innerHTML = def.name + ' ('+def.setName()+')';			
				// // 往data里面插入一条数据
				// var addData = {};
				// addData.id = num;
				// addData.name = a.innerHTML;
				// addData.pid = pid;
				// // 给文件夹一个标识，存好id和pid
				// file.index = num;
				// file.pid = pid;
				// data.push(addData);
				// // 如果是默认的名字，就存一下
				// saveDefName(a.innerHTML);
				fileList.removeChild(file); 
				count.innerHTML = files.length;	
				isAllChecked();				
			}
			alter.className = 'alter clear';
			a.className = 'file_name active';
			input.value = a.innerHTML;
			isRename = false;
			console.log(def.fname);
				console.log(data);
		};

		// 鼠标移入蓝框和选择框出现
		fileIcon.onmouseover = function(){
			if(checkbox.className != 'checkbox checked'){
				fileIcon.className = 'fileIcon folder active';
				checkbox.className = 'checkbox active';
			}
		};

		// 鼠标移入蓝框和选择框消失
		fileIcon.onmouseout = function(){
			if(checkbox.className != 'checkbox checked'){
				fileIcon.className = 'fileIcon folder';
				checkbox.className = 'checkbox';
			}
		};

		// 右键菜单
		file.oncontextmenu = function(ev){
			ev = ev || event;
			ev.preventDefault();
			if(contextMenu.length == 1){
				document.body.removeChild(contextMenu[0]);
			}
			var disX = ev.clientX;
			var disY = ev.clientY;
			var menu = document.createElement('ul');
			menu.className = 'contextMenu';
			var menuOpen = document.createElement('li');
			menuOpen.innerHTML = '打开';
			var menuRename = document.createElement('li');
			menuRename.innerHTML = '重命名';
			var menuDelete = document.createElement('li');
			menuDelete.innerHTML = '删除';
			menu.appendChild(menuOpen);
			menu.appendChild(menuRename);
			menu.appendChild(menuDelete);
			document.body.appendChild(menu);
			var str = 'width:100%; height:33.3%; text-indent:24px; line-height:28px';
			menuOpen.style.cssText = str;
			menuRename.style.cssText = str;
			menuDelete.style.cssText = str;
			menu.style.cssText = 'border:1px solid #ccc; background:#fff; list-style:none; width:90px; height:80px; position:absolute; top:'+disY+'px; left:'+disX+'px; z-index:100';
			var contextMenuLis = contextMenu[0].getElementsByTagName('li');
			
			for(var i=0; i<contextMenuLis.length; i++){
				contextMenuLis[i].onmouseover = function(ev){
					ev = ev || event;
					
					this.style.background = 'blue';
					this.style.color = '#fff';
					this.style.cursor = 'pointer';
				};
				contextMenuLis[i].onmouseout = function(){
					this.style.background = '';
					this.style.color = '';
				};
			}

			// 打开文件夹
			menuOpen.onclick = function(){
				dblClickFn(fileIcon.parentNode.index);	
				contextMenu[0].style.display = 'none';			
			};
			// 重命名
			menuRename.onclick = function(){
				isMenuRename = true;
				renameFn(fileIcon);	
				contextMenu[0].style.display = 'none';		
			};
			// 删除
			menuDelete.onclick = function(){
				isMenuDelete = true;
				deleteFn(fileIcon);
				contextMenu[0].style.display = 'none';		
			};
		};
		
		// 点击选中和取消选中
		checkbox.onclick = function(){
			if(this.className == 'checkbox active'){
				this.className = 'checkbox checked';
				fileIcon.className = 'fileIcon folder active';
				isAllChecked();

				checkbox.parentNode.parentNode.isCheck = true;
			}else{
				this.className = 'checkbox active';
				fileIcon.className = 'fileIcon folder active';
				checkAll.checked = false;
				checkbox.parentNode.parentNode.isCheck = false;
			}
		};

		// 双击进入子文件夹	
		file.ondblclick = function(){
			dblClickFn(file.index);
		};

		loadFname();
	}

	// 判断是否全选
	function isAllChecked(){
		for(var i=0; i<checkboxs.length; i++){
			if(checkboxs[i].className != 'checkbox checked'){
				return;
			}
		}
		checkAll.checked = true;
	}

	// 双击文件夹和右键菜单点击打开
	function dblClickFn(index){
		path.push(index);
		p = '';
		for(var i=0; i<path.length; i++){
			if(path[i]==index){
				p = location.hash+ '%'+path[i]; 
			}
		}
		if(location.hash){
			location.hash = p;
		}else{
			location.hash = '#path='+p;
		}		
	}

	var as = bread.getElementsByTagName('a');
	var breadNav = {
		str:'',
		dataHash:''
	};
	// 查询应该显示哪些文件夹
	window.onhashchange = function(){
		fileList.innerHTML = '';
		def.fname = []; //当路径变化时，重新渲染当页的文件夹，默认名数组要清空
		var h = location.hash;
		if(h){
			var num = h.split('=')[1];
			var arr = num.split('%');
			var n = arr[arr.length-1];
			pid = parseInt(n);
		}else{
			var n = -1;
			pid = parseInt(n);
		}
		path = [];
		if(arr){
			for(var i=0; i<arr.length; i++){
				path.push(arr[i]);
			}
		}

		for(var i=0; i<data.length; i++){			
			if(data[i].pid == n && n){
				// console.log(data[i])
				createFolder(data[i]);
			}
		}

		// 控制显示返回上一级
		breadNav.dataHash = '';	
		for(var i=1; i<path.length-1; i++){
			breadNav.dataHash +='%'+path[i];
		}
		if(pid != -1){
			back.style.display = 'inline-block';
			back.nextElementSibling.style.display = 'inline-block';
			back.setAttribute('data-hash', breadNav.dataHash);
		}else{
			back.style.display = 'none';
			back.nextElementSibling.style.display = 'none';
		}

		// 点击返回上一级跳转
		clickHref(back);

		// 渲染面包屑导航
		breadNav.str = '';
		breadNav.dataHash = '';		
		for(var i=0; i<path.length; i++){
			for(var j=0; j<data.length; j++){
				if(path[i] == data[j].id && path[i] != ''){
					breadNav.dataHash +='%'+path[i];
					breadNav.str +='<em>&gt;</em><a href="javascript:;" data-hash="'+breadNav.dataHash+'">'+data[j].name+'</a>';
				}
			}
		}
		bread.innerHTML = breadNav.str;
		
		// 通过面包屑导航跳转
		if(as[as.length-1]){
			as[as.length-1].style.cursor = 'default';
			for(var i=0; i<as.length; i++){
				clickHref(as[i]);
			}
		}

		function clickHref(obj){
			obj.onclick = function(){
				var attr = obj.getAttribute('data-hash');
				if(attr){
					location.hash = '#path='+attr;
				}else{
					location.hash = '';
				}
			};
		}
		count.innerHTML = files.length;			
	}
	

	// 新建文件夹
	btns[1].onclick = function(){
		for(var i=0; i<fileNames.length; i++){
			// 如果有文件夹的名字还没有确定
			if(fileNames[i].className != 'file_name active'){
				alert('请先确定文件夹名字再创建新的哦~');
				return;
			}
		}
		createFolder();
	};

	// 删除文件夹
	btns[2].onclick = deleteFn;

	// 删除文件夹
	function deleteFn(fileIcon){
		for(var i=0; i<fileNames.length; i++){
			// 如果有文件夹的名字还没有确定
			if(fileNames[i].className != 'file_name active'){
				alert('请先确定文件夹名字再删除哦~');
				return;
			}
		}

		if(isMenuDelete){//点击了右键菜单中的删除				
			var a = fileIcon.nextElementSibling;
			// 删除有默认名的文件夹
			def.deleteName(a.innerHTML);	
			// 删除pid为此文件夹id的文件夹数据以及删除本条数据			
			var file = fileIcon.parentNode
			deleteData(file.index);
			console.log(data)
			fileList.removeChild(file);
			count.innerHTML = files.length;
			i--;
			isMenuDelete = false;
		}else{
			// 删除这条数据，删除有默认名的文件夹，删除pid为此文件夹id的文件夹的数据，删除这个文件夹
			for(var i=0; i<checkboxs.length; i++){
				if(checkboxs[i].className == 'checkbox checked'){
					var a = checkboxs[i].parentNode.nextElementSibling;
					// 删除有默认名的文件夹
					def.deleteName(a.innerHTML);	
					// 删除pid为此文件夹id的文件夹数据以及删除本条数据			
					var file = checkboxs[i].parentNode.parentNode; 
					deleteData(file.index);
					console.log(data)
					fileList.removeChild(file);
					count.innerHTML = files.length;
					i--;
				}
			}
		}

		// 把文件夹全部删除了
		if(!files.length){
			checkAll.checked = false;
		}
	}
	
	// 重命名操作
	btns[3].onclick = renameFn;

	// 重命名
	function renameFn(fileIcon){
		for(var i=0; i<fileNames.length; i++){
			// 如果有文件夹的名字还没有确定
			if(fileNames[i].className != 'file_name active'){
				alert('请先确定文件夹名字再进行重命名哦~');
				return;
			}
		}
		// 如果是点击的右键菜单中的重命名
		if(isMenuRename){
			isRename = true;
			var a = fileIcon.nextElementSibling;
			var alter = a.nextElementSibling;
			var input = alter.childNodes[0];
			a.className = 'file_name';
			alter.className = 'alter clear active';
			input.focus();
			input.select();
			isMenuRename = false;
			return;
		}

		var count = 0;
		for(var i=0; i<checkboxs.length; i++){
			if(checkboxs[i].className == 'checkbox checked'){
				count++;
			}
		}
		if(count !== 1 && count!==0){
			alert('选择你最想重命名的那个把~');
		}else if(count === 0){
			alert('选择一个文件夹再进行重命名哦~');
		}else{
			isRename = true;//正在执行重命名操作
			for(var i=0; i<checkboxs.length; i++){
				if(checkboxs[i].className == 'checkbox checked'){
					var a = checkboxs[i].parentNode.nextElementSibling;
					var alter = a.nextElementSibling;
					var input = alter.childNodes[0];
					a.className = 'file_name';
					alter.className = 'alter clear active';
					
					input.select();
					input.focus();
				}
			}
		}
	}
	// 全选
	checkAll.onclick = function(){
		if(checkAll.checked){//勾上
			for(var i=0; i<checkboxs.length; i++){				
				checkboxs[i].className = 'checkbox checked';
				checkboxs[i].parentNode.className = 'fileIcon folder active';
				checkboxs[i].parentNode.parentNode.isCheck = true; 
			}
		}else{
			for(var i=0; i<checkboxs.length; i++){				
				checkboxs[i].className = 'checkbox';
				checkboxs[i].parentNode.className = 'fileIcon folder';
				checkboxs[i].parentNode.parentNode.isCheck = false; 
			}
		}
	};

	// 切换缩略图布局
	thumbnail.onclick = switchThum;
	// 切换列表布局
	list.onclick = switchList;

	// 缩略图
	function switchThum(){
		thumbnail.className = 'thumbnail active';
		list.className = 'list';
		cssSwitch.href = 'css/thumbnail.css';
		isList = false;
		operation.style.display = 'none';
	}

	// 列表
	function switchList(){
		list.className = 'list active';
		thumbnail.className = 'thumbnail';
		cssSwitch.href = 'css/list.css';
		isList = true;
		operation.style.display = 'none';
	}

	// 类数组转换为数组
	function convertToArray(a){
		var arr = null;
		try{
			arr = Array.prototype.slice.call(a, 0);
		}catch(e){
			arr =  new Array();
			for(var i=0; i<a.length; i++){
				arr.push(a[i]);
			}
		}
		return arr;
	}

	// 每次加载filelist里面的内容时都判断是否有默认文件名
	function loadFname(){
		for(var i=0; i<fileNames.length; i++){
			saveDefName(fileNames[i].innerHTML);
		}
	} 

	// 如果是默认的名字，就要存在默认名字的数组里
	function saveDefName(inputVal, aVal){
		for(var i=0; i<def.fname.length; i++){
			// 如果重命名时改的名字在默认名数组里已经存在，就不操作
			if(def.fname[i] == inputVal){
				return;
			}
		}
		var arr = inputVal.split(' ');
		var reg = /^\(\d+\)$/;
		if(arr[0] == '新建文件夹' && reg.test(arr[1])){
			var num = parseInt(inputVal.split(' (')[1].split(')')[0]);
			if(def.fname[num-1]){//说明当前那个位置有值，就插入一位
				def.fname.splice(num-1,0,inputVal)
			}else{
				def.fname.push(inputVal);
			}
		}
		for(var i=0; i<def.fname.length; i++){
			// 如果改名之前是默认名，改名以后还是默认名，就把之前存的那个默认名从数组里删除
			if(def.fname[i] == aVal){
				def.fname.splice(i, 1);
			}
		}	
	}	

	// 删除pid为id的数据(删除文件夹以及它的子文件)	
	function getIndexById(array,id){
    	for (var i=0; i<array.length; i++){
    		if(array[i].id == id){
    			return i;
    		}
    	}
    }

    function getChild(array,id){
    	var child = [];
    	for(var i=0; i<data.length; i++){
			if(data[i].pid == id){
				child.push(data[i].id);
			}
		}
		return child;
    }

    function deleteData(id){
    	// console.log('开始删除'+id)
		var child = getChild(data,id);
		// console.log(child)
		for(var i = 0; i<child.length; i++){
			deleteData(child[i]);
		}
		// console.log('删除id'+id +':   '+getIndexById(data,id))
		data.splice(getIndexById(data,id),1);
		// console.log(data);
		
		return;
	}

	// 碰撞
	function bump(obj1, obj2){
		var p1 = obj1.getBoundingClientRect();
		var p2 = obj2.getBoundingClientRect();
		if(p1.right-20 < p2.left || p1.bottom-20 < p2.top ||
			p1.left+20 > p2.right || p1.top+20 > p2.bottom){//没碰上
			return false;
		}else{//碰上了
			return true;
		}
	}


	var posMarquee = {};//保存框选时鼠标点下的x和y
	var isMarquee = false; //状态：框选
	var posDrag = {};//保存拖拽时点下的x和y
	var isDrag = false; //状态：拖拽
	var pos = {};

	fileList.onmousedown = function(ev){
		// 是filelist和file的时候可以进行框选
		ev = ev || event;
		if(ev.target != contextMenu[0] && contextMenu[0]){
			contextMenu[0].style.display = 'none';
		};
		if(ev.target != operation && operation){
			operation.style.display = 'none';
		}

		if(ev.target == fileList || ev.target.parentNode == fileList){
			// 记录进行框选的坐标
			pos.x = ev.clientX;
			pos.y = ev.clientY;
			isMarquee = true;
			
		}else if(ev.target.parentNode.parentNode == fileList && !ev.target.previousElementSibling){
			
			// 在fileIcon上按下,且不是在a上按下
			if(ev.target.parentNode.isCheck && !ev.ctrlKey){
				//在选中的file上按下，move就可以拖拽被选中的file
				pos.x = ev.clientX;
				pos.y = ev.clientY;
				isDrag = true;
			}else{
				if(ev.ctrlKey){// 按住ctrl多选
					var cbox = ev.target.childNodes[0];
					// 如果当前的那个文件夹已经被选中,就不选
					if(cbox.className == 'checkbox checked'){
						cbox.className = 'checkbox active';
						ev.target.parentNode.isCheck = false;
						checkAll.checked = false;

					}else{
					//当前的文件夹没被选中，就选中它
						cbox.className = 'checkbox checked';
						ev.target.parentNode.isCheck = true;	
						isAllChecked();					
					}
				}
			}
		}
		if(isDrag || isMarquee){
			ev.preventDefault();
		}
		scrollDis = window.pageYOffset;
	};
	var scrollDis = null;//记录框选那一瞬间滚动条的距离
	var actualScrollDis = null;//实时记录滚动条滚动的距离

	window.onscroll = function(){
		actualScrollDis = window.pageYOffset;
	};
	document.onmousemove = function(ev){
		ev = ev || event;
		if(isMarquee){
			var l = ev.clientX;
			var t = ev.clientY;
			// if(l<fileList.getBoundingClientRect().left){
			// 	l = fileList.getBoundingClientRect().left;
			// }
			// if(t<fileList.getBoundingClientRect().top){
			// 	t = fileList.getBoundingClientRect().top;
			// }
			
			var w = Math.abs(l-pos.x);
			var h = Math.abs(t-pos.y);
			var iL = l<pos.x?l:pos.x;
			var iT = t<pos.y?t:pos.y;

			shadow.style.display = 'block';
			shadow.style.width = w + 'px';
			// shadow.style.height = h +'px';
			shadow.style.left = iL + 'px';
			if(actualScrollDis){
				if(scrollDis){
					shadow.style.top = iT+scrollDis+'px';
					shadow.style.height = h+'px';
				}else{
					shadow.style.top = iT +'px';
					shadow.style.height = h +actualScrollDis+'px';
				}				
			}else{
				if(scrollDis){
					shadow.style.top = iT+'px';
					shadow.style.height = h+scrollDis +'px';
				}else{
					shadow.style.top = iT +actualScrollDis+'px';
					shadow.style.height = h +'px';
				}			
			}
				
			for(var i=0; i<fileIcons.length; i++){
				if(isList){//列表布局
					var obj2 = files[i];
				}else{
					var obj2 = fileIcons[i];
				}
				if(bump(shadow, obj2)){//碰上了
					fileIcons[i].className = 'fileIcon folder active';
					fileIcons[i].childNodes[0].className = 'checkbox checked';
					files[i].isCheck = true;
					isAllChecked();
				}else{
					// 没碰上
					fileIcons[i].className = 'fileIcon folder';
					fileIcons[i].childNodes[0].className = 'checkbox';
					files[i].isCheck = false;
					checkAll.checked = false;					
				}
			}
		}
		if(isDrag){
			var all = 0;
			for(var i=0; i<files.length; i++){
				if(files[i].isCheck){
					all++;
				}
			}
			var x = ev.clientX;
			var y = ev.clientY;
			if(x<fileList.getBoundingClientRect().left){
				x = fileList.getBoundingClientRect().left;
			}
			if(y<fileList.getBoundingClientRect().top){
				y = fileList.getBoundingClientRect().top;
			}
			if(getComputedStyle(dragCount).display == 'none'){
				dragCount.style.display = 'block';
			}			
			dragCount.style.left = x + 'px';
			dragCount.style.top = y + window.pageYOffset+ 'px';
			dragCount.innerHTML = all;
			for(var i=0; i<fileIcons.length; i++){	
				if(isList){//列表布局
					var obj2 = files[i];
				}else{
					var obj2 = fileIcons[i];
				}			
				if(bump(dragCount, obj2)){//碰上了
					if(files[i].isCheck){
						continue;
					}
					fileIcons[i].className = 'fileIcon folder active';
					fileIcons[i].childNodes[0].className = 'checkbox active';
					files[i].isParentFile = true;
				}else{//没碰上
					if(files[i].isCheck){
						continue;
					}
					fileIcons[i].className = 'fileIcon folder';
					fileIcons[i].childNodes[0].className = 'checkbox';
					files[i].isParentFile = false;
				}
			}
		}
	};

	var checkFilesIdAndName = [];//保存选中的需要拖动的文件夹的id和名字
	document.onmouseup = function(ev){
		ev = ev || event;
		for(var i=0; i<files.length; i++){
			if(files[i].isParentFile){
				parentFile = files[i];
				console.log(parentFile)
				files[i].isParentFile = false;
				break;
			}
		}
		if(isMarquee){
			isMarquee = false;
			shadow.style.cssText = '';
		}

		if(isDrag){
			isDrag = false;
			if(getComputedStyle(dragCount).display == 'block'){
				dragCount.style.display = 'none';
			}
			if(parentFile){
				var parentId = parentFile.index;
				parentFile = null;				
			}
			checkFilesIdAndName = [];
			if(!parentId && parentId !== 0){
				return;
			}
			//找到勾选的文件夹的对应的那条数据，把那条数据的pid改成上面得到的id
			for(var i=0; i<files.length; i++){
				if(files[i].isCheck){
					var id = files[i].index;
					//获得被拖入的文件夹的名字，与目标文件夹里面的文件夹名字对比是否有重名
					var name = fileNames[i].innerHTML;
					checkFilesIdAndName.push({
						id: id,
						name: name,
						target: files[i]
					});
				}
			}
			var childFiles = isExist(parentId);
			for(var i=0;i<checkFilesIdAndName.length; i++){
				obj = checkFilesIdAndName[i];
				if(isSameName(obj, childFiles)){
					//重名
					var result = confirm('已经包含名为 '+obj.name+' 的文件夹，是否替换');
					if(result){
						// 点击确认替换
						// 删除要替换的文件夹，把拖动的文件夹的数据的pid变成parentId，拿到重名的
						// 那个子文件的id，删除数据
						replace(obj,childFiles,parentId);
					}else{
						// 不替换
						// 什么都不做
						continue;
					}
				}else{
					//不重名
					var index = getIndexById(data,obj.id);
		            data[index].pid = parentId;
		            def.deleteName(obj.name);
		            fileList.removeChild(obj.target);
		            count.innerHTML = files.length;
				}
			}
		}
	};

	// 找到目标文件夹中所有子文件夹的名字
	function isExist(parentId){
		var childFiles = [];
		for(var i=0; i<data.length; i++){
        	if(data[i].pid == parentId){
        		childFiles.push(data[i]);
        	}
		}
		return childFiles;
	}
    
    //判断子文件夹里是否与选中的文件重名
    function isSameName(obj, childFiles){
    	if(childFiles.length == 0){
    		return false;
    	}
    	for(var i = 0;i<childFiles.length; i++){
    		if(obj.name == childFiles[i].name){
    			return true;
    		}
    	}
    	return false;
    }

	// 替换
	function replace(obj, childFiles, parentId){
		console.log(obj.target.index)
		var sameId = null;
		for(var i=0; i<childFiles.length; i++){
			if(childFiles[i].name == obj.name){
				sameId = childFiles[i].id;
				break;
			}
		}
		
		deleteData(sameId);
		//删除结束

		var index = getIndexById(data,obj.id);
		data[index].pid = parentId;	
		def.deleteName(obj.name);
		fileList.removeChild(obj.target);
		count.innerHTML = files.length;
	}

	fileList.oncontextmenu = function(ev){
		ev = ev || event;
		var x = ev.clientX;
		var y = ev.clientY;
		if(ev.target == fileList){
			operation.style.display = 'block';
			operation.style.left = x + 'px';
			operation.style.top = window.pageYOffset+y + 'px';
		}
				
		ev.preventDefault();
	};

	var see = operation.childNodes[1];
	var seeUl = operation.childNodes[1].childNodes[3];
	var timer = null;

	see.onmouseover = function(){
		seeUl.style.display = 'block';
	}
	see.onmouseout = function(){
		seeUl.style.display = 'none';
	}	
	seeUl.onmouseover = function(){
		timer = setTimeout(function(){
			seeUl.style.display = 'block';
		}, 500)
	}
	seeUl.onmouseout = function(){
		clearTimeout(timer);
		seeUl.style.display = 'none';
	}	

	var seeUlLis = seeUl.getElementsByTagName('li');

	seeUlLis[0].onclick = switchList;
	seeUlLis[1].onclick = switchThum;



};

	

// https://pan.baidu.com/disk/home#list/path=%2F&vmode=grid
// https://pan.baidu.com/disk/home#list/vmode=grid&path=%2F慕课网视频
// https://pan.baidu.com/disk/home#list/vmode=grid&path=%2F慕课网视频%2FHTML5 移动Web App阅读器
