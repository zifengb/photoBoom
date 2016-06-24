var boom = function (container,img){
	this.container = container;
	this.img = img;
};

boom.prototype = {
	'constructor':boom.prototype,
	'createBubble':function(){
		if(this.img){
			// 获取图片的宽高度
			var width = this.img.offsetWidth;
			var height = this.img.offsetHeight;
			this.img.style.display = 'none';

			this.container.style.width = width + 'px';
			this.container.style.height = height + 'px';

			var tdWidth = Math.ceil(Math.max(width,height)/14);

			// 气泡
			var table = ['<table>'];
			for(var y = 14,posY = 0; y > 0 && posY < 14; y-- && posY++){
				table.push('<tr>');
				for(var x = 14,posX = 0; x > 0 && posX < 14; x-- && posX++){
					table.push('<td style="left:'+(posX*tdWidth)+'px;top:'+(posY*tdWidth)
						+'px;background: url('+this.img.src+');background-position:'
						+(x*tdWidth)+'px '+(y*tdWidth)+'px;width:'+(tdWidth-2)
						+'px;height:'+(tdWidth-2)+'px;border-radius:'+(tdWidth/2)+'px;"></td>');
				}
				table.push('</tr>');
			}

			table.push('</table>');
			this.container.innerHTML += table.join('');
		}
	},
	'scar':function(x,pointX,pointY){
		var y;
		if(x < this.container.offsetWidth/2)
			y = x-pointX + pointY;
		else
			y = -x+pointX + pointY;

		return {'x':x,'y':y};
	},
	'start':function(){
		this.createBubble();

		var td = this.container.getElementsByTagName('td');

		for (var i = td.length - 1; i >= 0; i--) {
			var pointX =  parseInt(td[i].offsetLeft);
			var pointY =  parseInt(td[i].offsetTop);
			// console.log(pointX+','+pointY)

			// 随机设置弹射轨迹的自变量x
			var arrX = [-100,-80,-60,-40,40,60,80,100];
			var randomNum = parseInt(Math.random()*(arrX.length - 1));
			var x = arrX[randomNum];

			var level = Math.ceil((Math.random()*3));

			// console.log(x)

			// 建立弹射轨迹
			var data = {
				'disX':this.scar(x,pointX,pointY)['x'],
				'disY':this.scar(x,pointX,pointY)['y'],
				'scale':level,
				'blur':level
			}

			// 触发boom
			this.animate(td[i],data);
		};
	},
	'animate':function(ele,data){
		// 定义爆炸所需要的样式
		// left,top
		// scale
		// opacity

		//缩放
		ele.style.webkitTransform = 'scale('+data.scale+','+data.scale+')';
		ele.style.oTransform = 'scale('+data.scale+','+data.scale+')';
		ele.style.transform = 'scale('+data.scale+','+data.scale+')';

		// 毛玻璃
		ele.style.webkitFilter = 'blur('+data.blur+'px)';
		ele.style.oFilter = 'blur('+data.blur+'px)';
		ele.style.filter = 'blur('+data.blur+'px)';

		var boomStyle={
			'left':data.disX,
			'top':data.disY,
			'opacity':0
		};

		move(ele,boomStyle);
	}
}

//获取非行间样式公用函数
function getStyle(obj,attr){
	if(obj.currentStyle){
		return obj.currentStyle[attr];
	}else{
		return getComputedStyle(obj,false)[attr];
	}
};

//任意值运动公用函数(缓冲版)
function move(obj,json,callback){
	var speed=0;
	clearInterval(obj.timer);
	obj.timer=setInterval(function(){	
		var Stop=true;//控制停止的bug
		
		for(var attr in json){
			//判断是否为改变透明度
			var cur=0;
			if(attr=='opacity'){
				cur=Math.round(parseFloat(getStyle(obj,attr))*100);//四舍五入避免计算机的小数误差
			}else{
				cur=parseInt(getStyle(obj,attr));
			}
			//速度
			speed=(json[attr]-cur);
			speed=speed>0?Math.ceil(speed):Math.floor(speed);
			
			if(cur!=json[attr]) Stop=false;
			
			if(attr=='opacity'){
				obj.style.filter='alpha(opacity:'+(cur+speed)+')';
				
				obj.style[attr]=(cur+speed)/100;
			}else{
				obj.style[attr]=cur+speed+'px';
			}
		}
		
		if(Stop){
			clearInterval(obj.timer);
			
			if(callback)	callback();//注意第二个callback后的括号不能少 
		}
	},30);
}

window.onload = function(){
	var container = document.getElementsByClassName('container');
	for(var i =0,ele;ele = container[i++];){
		var img = ele.getElementsByTagName('img')[0];
		ele.style.width = img.offsetWidth + 'px';
		// 使用闭包引用img
		(function(img){
			ele.onclick = function (){
				var boomObject = new boom(this,img);
				boomObject.start();
			}
		})(img);
	}
}