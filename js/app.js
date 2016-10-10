




function FingerCarousel(oId){
			this.carousel = document.querySelector("#" + oId);
			//所有lis
			this.lis = document.querySelectorAll("#" + oId +" ul li");
		
			//ul
			this.ul = document.querySelector("#" + oId +" ul");
            //所有图片
			this.images = document.querySelectorAll("#" + oId +" ul li img");
			//备份this
			var self = this;
			//loading
			this.loading = document.querySelector("#" + oId +" .loading");

			//等所有图片加载好之后，然后才显示
			for(var i = 0 , sum = 0 ; i < this.images.length ; i++){
				this.images[i].onload = function(){
					sum ++;
					console.log(sum);
					if(sum == self.images.length){
						self.ul.style.display = "block";
						self.loading.style.display = "none";
					}
				}
			}
			
			this.init();

			//绑定3个监听：
			this.carousel.addEventListener("touchstart",function(event){
				self.touchstartHandler.call(self,event);
			},false);
			this.carousel.addEventListener("touchmove",function(event){
				self.touchmoveHandler.call(self,event);
			},false);
			this.carousel.addEventListener("touchend",function(event){
				self.touchendHandler.call(self,event);
			},false);

		  	window.addEventListener("resize",function(){
		  		self.init.call(self);
		  	},false);
		}

		//初始化
		FingerCarousel.prototype.init = function(){
			console.log(22222);
			//宽度
			this.w = parseFloat(getComputedStyle(this.carousel)["width"]);

			//信号量
			this.idx = 0;
			//下一张
			this.nextIdx = 1;
			//上一张
			this.prevIdx = this.lis.length - 1;

			//设置高度
			this.carousel.style.height = this.w * (300 / 560) + "px";

			//第0张图复原
			this.lis[0].style.transition = "none";
			this.lis[0].style.webkitTransform = "translate3d(0px,0,0)";
			//用px为单位，除0之外的所有li去猫腻位置
			for(var i = 1 ; i < this.lis.length ; i++){
				this.lis[i].style.transition = "none";
				this.lis[i].style.webkitTransform = "translate3d(" + this.w + "px,0,0)";
			}
		}
		//触摸开始
		FingerCarousel.prototype.touchstartHandler = function(event){
			//阻止默认事件
			event.preventDefault();
			//记录时间，这一时刻的时间戳
			this.startTime = new Date();
			//这根手指
			var finger = event.touches[0];
			//触摸开始的位置
 			this.startX = finger.clientX;
 			//去掉所有li的过渡
 			this.lis[this.idx].style.webkitTransition = "none";
 			this.lis[this.prevIdx].style.webkitTransition = "none";
 			this.lis[this.nextIdx].style.webkitTransition = "none";
 			//就位
 			this.lis[this.idx].style.webkitTransform = "translate3d(" + 0 + "px,0,0)";
			this.lis[this.nextIdx].style.webkitTransform = "translate3d(" + this.w + "px,0,0)";
			this.lis[this.prevIdx].style.webkitTransform = "translate3d(" + -this.w + "px,0,0)";

		}
		//触摸移动
		FingerCarousel.prototype.touchmoveHandler = function(event){
			//阻止默认事件
			event.preventDefault();
			//手指
			var finger = event.touches[0];
			//移动的距离
			this.dx = finger.clientX - this.startX;
 			//一共有3张图片要跟着手指实时的移动
 			this.lis[this.idx].style.webkitTransform = "translate3d(" + (0 + this.dx) + "px,0,0)";
 			this.lis[this.nextIdx].style.webkitTransform = "translate3d(" + (this.w + this.dx) + "px,0,0)";
 			this.lis[this.prevIdx].style.webkitTransform = "translate3d(" + (-this.w + this.dx) + "px,0,0)";
		 
		}
		//触摸结束
		FingerCarousel.prototype.touchendHandler = function(event){
			//阻止默认事件
			event.preventDefault();
			//看看这次用户抬手和上一次抬手的时间间隔
			var endDuaring = new Date() - this.endTime;
			//给这一次松手加上时间
			this.endTime = new Date();
			//看一下用户花了多少时间触摸
			var touchDuaring = this.endTime - this.startTime;
			
			//用户两次抬手的时间小于了300毫秒，说明上一次的动画还没有完成，此时不宜再来一个动画，变成干蹦。
			if(endDuaring < 300){
				var transitionString = "none";
			}else{
				var transitionString = "all 0.3s cubic-bezier(0.56, 1.24, 1, 0.98) 0s";
			}

			//判断此时是否滑动完成，用过渡来实现动画
			if((this.dx >= this.w / 2) || (this.dx > 10 && touchDuaring < 200)){
				//向右滑动成功
				this.lis[this.idx].style.webkitTransition = transitionString;
				this.lis[this.idx].style.webkitTransform = "translate3d(" + this.w + "px,0,0)";
				this.lis[this.prevIdx].style.webkitTransition = transitionString;
				this.lis[this.prevIdx].style.webkitTransform = "translate3d(" + 0 + "px,0,0)";

				//信号量的改变
 				this.nextIdx = this.idx;
 				this.idx = this.prevIdx;
 				this.prevIdx--;
 				if(this.prevIdx < 0){
 					this.prevIdx = this.lis.length - 1;
 				}
			}else if((this.dx <= -this.w / 2) || (this.dx < -10 && touchDuaring < 200)){
				//向左滑动成功
				this.lis[this.idx].style.webkitTransition = transitionString;
				this.lis[this.idx].style.webkitTransform = "translate3d(" + -this.w + "px,0,0)";
				this.lis[this.nextIdx].style.webkitTransition = transitionString;
				this.lis[this.nextIdx].style.webkitTransform = "translate3d(" + 0 + "px,0,0)";
 				
 				//信号量的改变
 				this.prevIdx = this.idx;
 				this.idx = this.nextIdx;
 				this.nextIdx++;
 				if(this.nextIdx > this.lis.length - 1){
 					this.nextIdx = 0;
 				}
			}else{
				//没有成功，弹回来
				this.lis[this.idx].style.webkitTransition = "all 0.3s cubic-bezier(0.56, 1.24, 1, 0.98) 0s";
				this.lis[this.idx].style.webkitTransform = "translate3d(" + 0 + "px,0,0)";
				this.lis[this.nextIdx].style.webkitTransition = "all 0.3s cubic-bezier(0.56, 1.24, 1, 0.98) 0s";
				this.lis[this.nextIdx].style.webkitTransform = "translate3d(" + this.w + "px,0,0)";
				this.lis[this.prevIdx].style.webkitTransition = "all 0.3s cubic-bezier(0.56, 1.24, 1, 0.98) 0s";
				this.lis[this.prevIdx].style.webkitTransform = "translate3d(" + -this.w + "px,0,0)";
			}

			
			}
			
		

		var f1 = new FingerCarousel("carousel");






var Util = {
	tpl: function (id) {
		return document.getElementById(id).innerHTML;
	},

	ajax: function (url, fn) {

		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if(xhr.readyState === 4) {
				if(xhr.status === 200) {
					var data = JSON.parse(xhr.responseText)
					fn && fn(data)
				}
			}
		}

		xhr.open('GET',url, true)
		xhr.send(null);

	}
}
Vue.filter('price', function(price) {
	return price + '元'
})
Vue.filter('orignPrice', function(price) {
	return "门市价:" + price + '元';
})

Vue.filter('sales' , function(num) {
	return '已售' + num;
})

var HomeComponent = Vue.extend({
	template: Util.tpl('tpl_home'),

	data: function () {
	return {
		types: [
		        {id: 1, title: '美食', url: '01.png'},
				{id: 2, title: '电影', url: '02.png'},
				{id: 3, title: '酒店', url: '03.png'},
				{id: 4, title: '休闲娱乐', url: '04.png'},
				{id: 5, title: '外卖', url: '05.png'},
				{id: 6, title: 'KTV', url: '06.png'},
				{id: 7, title: '周边游', url: '07.png'},
				{id: 8, title: '丽人', url: '08.png'},
				{id: 9, title: '小吃快餐', url: '09.png'},
				{id: 10, title: '火车票', url: '10.png'}
		],
		banner: [],
		ad: [],
		list: [],
		
	  }

	},
	created: function () {
		this.$dispatch('show-search',true),
	    this.$dispatch('show-Banner',true)
		var me = this;
		Util.ajax('data/home.json', function(res){

			 if(res && res.errno === 0) {
			 	me.list = res.data.list;
			 	me.$set('ad', res.data.ad);
			 	me.$set('banner', res.data.banner);
			 }

		})
    //    var Banner = document.getElementById("home-banner")[0];
	   // var w = parseFloat(getComputedStyle(Banner)["width"]);
	   // var Banner.style.height = w * (300 / 560) + "px";
		 


	}
})
var ListComponent = Vue.extend({
	template: Util.tpl('tpl_list'),
	props: ['csearch'],
	data: function(){
		return {
			types: [
				{value: '价格排序', key: 'price'},
				{value: '销量排序', key: 'sales'},
				{value: '好评排序', key: 'evaluate'},
				{value: '优惠排序', key: 'discount'}
			],
			// 默认保留前三个
			list: [],
			// 保留剩下的
			other: []

		}
	},
	methods: {
		loadMore: function(){
			this.list = [].concat(this.list,this.other)
			this.other=[]
		},
		sortBy: function(type){
			if(type === 'discount'){
				this.list.sort(function(a,b){
					var ap = a.orignPrice - a.price;
					var bp = b.orignPrice - b.price;
					return ap - bp;

				})
			   }else{
					this.list.sort(function(a,b){
						return b[type] - a[type]
					})
				}
			}

	},
	created: function(){
		this.$dispatch('show-search',false),
		this.$dispatch('show-Banner',false)
		var me = this;
		var query = me.$parent.query;
		var str = '?'
		if(query[0] && query[1]){
			str += query[0] + "=" + query[1]
		}
		Util.ajax('data/list.json' + str,function(res){
			if(res && res.errno === 0){
                me.list = res.data.slice(0,3)
                me.$set('other', res.data.slice(3));

			}
		})
	}

})
var ProductComponent = Vue.extend({
	template: Util.tpl('tpl_product'),
	props: ['csearch'],
	data: function () {
		return {
			data: {
				src: '01.jpg'
			}
		}
	},
created: function () {
  this.$dispatch('show-search',false),
  this.$dispatch('show-Banner',false)
  var me = this;
  Util.ajax('data/product.json',function (res){
  	if(res && res.errno === 0) {
  		me.data = res.data;

  	}
  })
	}
})

Vue.component('home', HomeComponent)
Vue.component('list', ListComponent)
Vue.component('product',ProductComponent)

//实例化VUE
var app = new Vue({
	el: "#app",
	data: {
		view: '',
		query: [],
		search: '',
		dealSearch: '',
		showSearch: true,
		showBanner: true

	},
	methods: {
		goSearch: function () {
			this.dealSearch = this.search
		},
		goBack: function () {
			history.go(-1);
		}
	},
	events: {
		'show-search': function(val){
			this.showSearch = val;
		},
		'show-Banner': function(val){
			this.showBanner = val;
		}
	}
})

//设置路由
function router () {
	var str = location.hash;
	str = str.slice(1);
	str = str.replace(/^\//,'')
    //转化为数组
	str = str.split('/')
	// if (str.indexOf('/') > -1) {
	// 	str = str.slice(0,str.indexOf('/'))
	// }

	var map = {
		home: true,
		list: true,
		product: true
	}

	if (map[str[0]]) {
	  app.view = str[0];
	}else {
		app.view = 'home'
	}
	app.query = str.slice(1);
}

window.addEventListener('load',router)

window.addEventListener('hashchange',router)