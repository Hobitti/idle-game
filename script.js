
var go="true";
var money=100;
var gps=0;
var what=0;
var pop=10;
var build =[
//hinta,max workers,nyk taso, nyk tyolaiset
[10,10,1,1,0],
[1000,5,5,0,0],
[100000,3,100,0,0],
[10000000,2,5000,0,0],
[100000000,1,20000,0,0]
];
	
play();
calculate();
load();
function play () {           //  create a loop function

   setTimeout(function () {    //  call a 3s setTimeout when the loop is called
    var net = gps / 40;
	var pops = 0.025;
	money=money + net;
	pop=pop+pops;
	show_pop=Math.floor(pop);
	var show_money=Math.floor(money);
	document.getElementById("1").innerHTML = show_money+"$ "+gps+"$/sek";
	document.getElementById("pop").innerHTML = "Population(slaves):"+show_pop;
	play()                     //  ..  setTimeout()
   }, 25)
   return true;
}
function upgarde(what) {// päivittää rakennuksen
	var cost=build[what][0]*(2*build[what][3]);
	console.log(cost);
	if(money >=cost) {//tarkistaa että rahaa on tarpeeksi
		money=money-cost;
		build[what][3]++;
		build[what][1]++;
		
		build[what][0]=build[what][0]*2;
		calculate();
	}
	else {
		alert("No money for that");
	}
	return true;
}
function calculate() {//lasekkee tuotannon runnataan vain kus sen pitäisi muuttua
	gps=0;
	var max=0;
	var i=4;
	var nimi=i+"_pop";
	var hnimi=i+"_hinta"
	var mult_gps=1;
	while(-1!=i) {
		var cost=build[i][0] * ( 2 * build[i][3] +1);
		max=build[i][1]*build[i][3];
		gps=gps + build[i][2] * build[i][4] * mult_gps;
		if(build[i][4]==null || build[i][4]=="") build[i][4]=0;
		document.getElementById(nimi).innerHTML = "Workers:" + build[i][4]+"/"+max;
		document.getElementById(hnimi).innerHTML = "Price:" + cost;
		i--;
		nimi=i+"_pop";
		hnimi=i+"_hinta";
	}
	return i;
}
function lisaa(what){//lisää työläisen rakennukseen.
	var nimi=what+"_pop";
	var max=build[what][1]*build[what][3];
	if (event.shiftKey && build[what][4] < max) {
		pop_need= max - build[what][4];
		if(pop_need <= pop) {
			build[what][4]=max;
			pop -= pop - pop_need;
		}
		else  {
			build[what][4]+=Math.floor(pop);
			pop-=Math.floor(pop);
		}
	}
	else {
		if(pop > 1 && build[what][4] < max) {
			build[what][4]++;
			pop--;
		} 
		else if(build[what][4] == build[what][1]) alert("No space for new workers");
		else alert("Not enought popultaion");
	}
	document.getElementById(nimi).innerHTML = "Workers:"+ build[what][4]+"/"+max;
	calculate();
}
function poista(what, event){
	var nimi=what+"_pop";
	var max=build[what][1]*build[what][3];
	if (event.shiftKey) {
		pop+=build[what][4];
		build[what][4]=0;
		
	}
	else {	
		if(build[what][4]>0) {
			build[what][4]--;
			pop++;
		}
		else alert("No one works here");
	}
	document.getElementById(nimi).innerHTML = "Workers:" + build[what][4]+"/"+max;
	calculate();
	
}
function save() {
	var i=0;
	var d=new Date();
	while(build.length>i) {
		setCookie("rakennus"+i,build[i][3]);
		setCookie("rakennus_tyolais"+i,build[i][4]);
		setCookie("rakennus_max_tyolaiset"+i,build[i][1]);
		i++;
	}
	setCookie("money",money);
	setCookie("pop",pop);
	setCookie("time", d.getTime());
	console.log("yeet");
}

function load() {
		var i=0;
		while(build.length>i) {
			build[i][3]=getCookie("rakennus"+i);
			build[i][4]=getCookie("rakennus_tyolais"+i);
			build[i][1]=getCookie("rakennus_max_tyolaiset"+i);
			i++;
		}
		money=parseInt(getCookie("money"))
		pop=parseInt(getCookie("pop"))
		calculate();
}
function setCookie(name,value) {
    var expires = "";
    
        var date = new Date();
        date.setTime(date.getTime() + (1200*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name+'=; Max-Age=-99999999;';  
}
function array2dToJson(a, p, nl) {
  var i, j, s = '{"' + p + '":[';
  nl = nl || '';
  for (i = 0; i < a.length; ++i) {
    s += nl + array1dToJson(a[i]);
    if (i < a.length - 1) {
      s += ',';
    }
  }
  s += nl + ']}';
  return s;
}
function array1dToJson(a, p) {
  var i, s = '[';
  for (i = 0; i < a.length; ++i) {
    if (typeof a[i] == 'string') {
      s += '"' + a[i] + '"';
    }
    else { // assume number type
      s += a[i];
    }
    if (i < a.length - 1) {
      s += ',';
    }
  }
  s += ']';
  if (p) {
    return '{"' + p + '":' + s + '}';
  }
  return s;
}