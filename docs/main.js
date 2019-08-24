//Objetos importantes de canvas
var canvas=document.getElementById('game');
var ctx=canvas.getContext('2d');
//score
var score=0;
//Crear el objeto de la nave
var nave={
	x:100,
	y:canvas.height-100,
	width:70,
	height:70,
	contador:0
}
var juego={
	estado:'iniciando'
}
var textoRespuesta = {
	contador: -1,
	titulo :'',
	subtitulo:''
}
var teclado={}
//array para los disparos
var disparos=[];
var disparosEnemigos=[];
//arreglo q almacena los enemigos
var enemigos=[];
//Defini variables para las imagenes
var fondo, imgNave, imgEnemigo, imgDisparo, imgDisparoEnemigo;
var imagenes=['space.jpg','nave.png','naveEnemiga.gif','disparoEnemiga.png','disparo.png','spaceDead.jpg','naveEnemigaDead.gif'];
var soundShoot, SoundInvaderShoot,soundDeadSpeace,soundDeadInvader,SoundEndGame,music,youwin,gameover,imgNaveDestruida,imgspacedead,imgNaveEnemigaDead;
var preloader;
//Definicio de funciones
function loadMedia(){
		preloader = new PreloadJS();
		preloader.onProgress = progresoCarga;
		cargar();
	
}
function cargar () {
	while(imagenes.length > 0){
		var imagen = imagenes.shift();
		preloader.loadFile(imagen);
	}
}
function progresoCarga(){
	console.log(parseInt(preloader.progress * 100)+"%");
	 progressbar = $( "#progressbar" );
	 progressbar.progressbar( "option", {
value: parseInt(preloader.progress * 100)
});

	if(preloader.progress ==1){
		var interval = window.setInterval(frameLoop,1000/25);
		fondo =new Image();
		fondo.src ='space.jpg';
		imgNave =new Image();
		imgNave.src ='nave.png';
	    imgEnemigo =new Image();
		imgEnemigo.src ='naveEnemiga.gif';
		imgDisparoEnemigo =new Image();
		imgDisparoEnemigo.src ='disparoEnemiga.png';
	    imgDisparo =new Image();
		imgDisparo.src ='disparo.png';
		imgNaveDestruida =new Image();
		imgNaveDestruida.src ='nave-muerta.png';
		imgspacedead =new Image();
		imgspacedead.src ='spaceDead.jpg';
		imgNaveEnemigaDead =new Image();
		imgNaveEnemigaDead.src ='naveEnemigaDead.gif';

		soundShoot=document.createElement('audio');
		document.body.appendChild(soundShoot);
		soundShoot.setAttribute('src','laserSpace.mp3');

		SoundInvaderShoot=document.createElement('audio');
		document.body.appendChild(SoundInvaderShoot);
		SoundInvaderShoot.setAttribute('src','laserEnemigo.ogg');

		soundDeadInvader=document.createElement('audio');
		document.body.appendChild(soundDeadInvader);
		soundDeadInvader.setAttribute('src','boom.mp3');

		youwin=document.createElement('audio');
		document.body.appendChild(youwin);
		youwin.setAttribute('src','Street Fighter II-You Win Perfect.mp3');

		gameover=document.createElement('audio');
		document.body.appendChild(gameover);
		gameover.setAttribute('src','gameover.ogg');

		music=document.createElement('audio');
		document.body.appendChild(music);
		music.setAttribute('src','Star Wars Theme Song By John Williams.ogg');
		music.volume=0.4;


	}
}
function dibujarEnemigos () {
	for(var i in enemigos){
		var enemigo=enemigos[i];
		ctx.save();
		if (enemigo.estado=='vivo') {ctx.drawImage(imgEnemigo,enemigo.x,enemigo.y,enemigo.width,enemigo.height);}
		if (enemigo.estado=='hit') {ctx.drawImage(imgNaveEnemigaDead,enemigo.x,enemigo.y,enemigo.width,enemigo.height);}
		ctx.restore();
	}
}

function dibujarFondo() {
	if(nave.estado=='muerto'){
		ctx.drawImage(imgspacedead,0,0);
	}
	else
	{	
		ctx.drawImage(fondo,0,0);
	}
}

function dibujarNave(){
	ctx.save();
	if(nave.estado=='muerto'){
		ctx.drawImage(imgNaveDestruida,nave.x,nave.y,nave.width,nave.height);
	}
	else
	{
		ctx.drawImage(imgNave,nave.x,nave.y,nave.width,nave.height);
	}
	ctx.restore();
}
function agregarEventosTeclado () {
	agregarEvento(document,"keydown",function(e){
		//ponemos en true la tecla presionada
		teclado[e.keyCode]=true;
		console.log(e.keyCode);
	});
		agregarEvento(document,"keyup",function(e){
		//ponemos en false la tecla q dejo de ser presionada
		teclado[e.keyCode]=false;
	});
	function agregarEvento(elemento,nombreEvento,funcion){
		if (elemento.addEventListener) {
			//navegadores de verdad
			elemento.addEventListener(nombreEvento,funcion,false)

		}
		else if(elemento.attachEvent){
			//Internet explorer
			elemento.attachEvent(nombreEvento,funcion);
		}
	}
}
function moverNave(){
	//movimiento a la izquierda
	if(teclado[37]){
		nave.x -=6;
		if(nave.x <0) nave.x=0;
	}
		//movimiento a la derecha
	if(teclado[39]){
		var limite=canvas.width - nave.width;
		nave.x +=6;
		if(nave.x >limite) nave.x=limite;
	}
	if(teclado[32]){
		//Disparos
		if(!teclado.fire){
			fire();
			teclado.fire=true;
		}	
	}
	else teclado.fire=false;
	if(nave.estado=='hit'){
		nave.contador++;
		if(nave.contador >=20){
			nave.contador=0;
			nave.estado='muerto';
			juego.estado='perdido';
			gameover.play();
			textoRespuesta.titulo ='Game Over :(';
			textoRespuesta.subtitulo='Presiona la tecla R para continuar';
	//		nombreJugador=prompt('Como te llamas Guachin?:','');
			alert('TU SCORE: '+score);
			score=0;
			textoRespuesta.contador=0;
		}
	}
}
function dibujarDisparosEnemigos () {
	for(var i in disparosEnemigos){
		var disparo=disparosEnemigos[i];
		ctx.save();
		ctx.drawImage(imgDisparoEnemigo,disparo.x, disparo.y, disparo.width, disparo.height);
		ctx.restore();
	}
}
function moverDisparosEnemigos () {
	for(var i in disparosEnemigos){
		var disparo=disparosEnemigos[i];
		disparo.y += 3;

	}
	disparosEnemigos=disparosEnemigos.filter(function(disparo){
		return disparo.y < canvas.height;
	})
}
function actualizaEnemigos () {
	function agregarDisparosEnemigos(enemigo){
		return{
			x: enemigo.x,
			y: enemigo.y,
			width: 8,
			height: 33,
			contador: 0

		}
	}
	if(juego.estado=='iniciando'){
		for (var i = 0; i < 10; i++) {
			console.log("a");
			enemigos.push({
				x:10 + (i*50),
				y:10,
				height:50,
				width:50,
				estado:'vivo',
				contador:0,
				puntos:1
			});
		}
		juego.estado='jugando';
	}
		for(var i in enemigos){
			var enemigo=enemigos[i];
			if(!enemigo) continue;
			if(enemigo && enemigo.estado =='vivo'){
				enemigo.contador++;
				enemigo.x += Math.sin(enemigo.contador * Math.PI /90)*5;

				if(aleatorio(0,enemigos.length * 10) == 4){ // 4 es para q no disparen tanto , el length para  mientars menos enemigos mas rapido dispaan ,
						SoundInvaderShoot.pause();
						SoundInvaderShoot.currentTime=0;
						SoundInvaderShoot.play();
					disparosEnemigos.push(agregarDisparosEnemigos(enemigo));
				}
			}
			if(enemigo && enemigo.estado=='hit'){
				enemigo.contador++;
				score=score+enemigo.puntos;
				if(enemigo.contador >= 20){
					enemigo.estado='muerto';
					enemigo.contador=0;

				}
			}
		}
		enemigos=enemigos.filter(function(enemigo){
			if(enemigo && enemigo.estado !='muerto') return true;
			return false;
		})
}
function moverDisparos(){
	for(var i in disparos){
		var disparo=disparos[i];
		disparo.y -=2;
	}
	disparos=disparos.filter(function(disparo){
		return disparo.y > 0;
	});
}
function fire(){
	soundShoot.pause();
	soundShoot.currentTime=0;
	soundShoot.play();
	disparos.push({
		x:nave.x+20,
		y:nave.y-10,
		width:20,
		height:30
	})
}
function dibujarDisparos () {
	ctx.save();
	for(var i in disparos){
		var disparo=disparos[i];
		ctx.drawImage(imgDisparo,disparo.x,disparo.y,disparo.width,disparo.height);
	}
	ctx.restore();
}
function dibujaTexto(){
	if(textoRespuesta.contador == -1) return;
	var alpha = textoRespuesta.contador/50.0;
	if(alpha>1){
		for(var i in enemigos){
			delete enemigos[i];
		}
	}
	ctx.save();
	ctx.globalAlpha =alpha;
	if(juego.estado =='perdido'){
		ctx.fillStyle='red';
		ctx.font='Bold 40pt Arial';
		ctx.fillText(textoRespuesta.titulo,140,200);
	    ctx.font='14pt Arial';
		ctx.fillText(textoRespuesta.subtitulo,190,250);
	}
		if(juego.estado =='victoria'){
		ctx.fillStyle='#567906';
		ctx.font='Bold 40pt Arial';
		ctx.fillText(textoRespuesta.titulo,140,200);
	    ctx.font='14pt Arial';
		ctx.fillText(textoRespuesta.subtitulo,190,250);
	}
	ctx.restore();
}
function actualizarEstadoJuego(){
	if(juego.estado =='jugando' && enemigos.length ==0){
		juego.estado='victoria';
		textoRespuesta.titulo='Salvaste La Ciudad =)';
		textoRespuesta.subtitulo='Presiona la tecla R para reiniciar';
		textoRespuesta.contador= 0;
		youwin.play();
	}
	if(textoRespuesta.contador >=0){
		textoRespuesta.contador++;
	}
	if((juego.estado=='perdido' || juego.estado=='victoria')&& teclado[82]){
		juego.estado='iniciando';
		nave.estado='vivo';
		textoRespuesta.contador=-1;
	}

}
function hit (a,b) {  //a = disparo , B= enemigo
	var hit =false;
	if(b.x + b.width >= a.x && b.x <a.x + a.width){
		if(b.y + b.height >= a.y && b.y  < a.y + a.height){
			hit=true;
		}

	}
		if(b.x <=a.x && b.x + b.width >= a.x + a.width){
			if(b.y <= a.y && b.y + b.height >= a.y + a.height){
				hit=true;
			}
		
	}
		if(a.x <=b.x && a.x + a.width >= b.x + b.width){
			if(a.y <= b.y && a.y + a.height >= b.y + b.height){
				hit=true;
			}
		
	}
	return hit;
}
function verificarContacto () {
	for(var i in disparos){
		var disparo = disparos[i];
		for (j in enemigos){
			var enemigo = enemigos[j];
			if(hit(disparo,enemigo)){
				soundDeadInvader.pause();
				soundDeadInvader.currentTime=0;
				soundDeadInvader.play();
				enemigo.estado='hit';
				enemigo.contador=0;
				
			}
		}
	}
	if(nave.estado== 'hit' || nave.estado=='muerto') return;
	for(var i in disparosEnemigos){
		var disparo = disparosEnemigos[i];
		if(hit(disparo,nave)){
			nave.estado ='hit';
			console.log('contacto');
		}
	}
}
function aleatorio(inferior,superior){
	var posibilidades = superior - inferior;
	var a= Math.random() * posibilidades;
	a=Math.floor(a);
	return parseInt(inferior)+ a;
}
function frameLoop(){
	music.play();
	actualizarEstadoJuego();
	moverNave();
	actualizaEnemigos();
	moverDisparos();
	moverDisparosEnemigos();
	dibujarFondo();
	verificarContacto();
	dibujarEnemigos();
	dibujarDisparosEnemigos();
	dibujarDisparos();
	dibujaTexto();
	dibujarNave();
}


//Ejecucion de funciones
document.getElementById("game").focus();
window.addEventListener('load',init);
function init(){
	agregarEventosTeclado();
	loadMedia();
}
