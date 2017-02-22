function BannerRotator(strXMLPath, iTimeOut){
	var self = this;	//atribui à variavel self a referencia a this(BannerRotator) para chamar um metodo dentro de outro
	var iTimeOut = iTimeOut;
	var t;
	function ajax(strFileName, func){
		var xmlhttp = new XMLHttpRequest();

		xmlhttp.onreadystatechange = verify;

		function verify(){	//verifica estado e chama callback
			if (this.readyState == 4 && this.status == 200){
				func(this);
			}
		}
		xmlhttp.open('GET', strFileName, true);
		xmlhttp.send();
		return false;
	}
	
	function timer(){
		t = setTimeout(function(){self.changeBanner(false);}, iTimeOut);
	}
	
	this.changeBanner = function (blnIsBacking, event){
		var bannerList = document.getElementById('bannerRotator').getElementsByClassName('banner-list')[0];
		var iNextBanner, iPreviousBanner, blnFirstLoad = true;
		
		if(event){
			event.preventDefault();
		}
		
		clearTimeout(t);
		timer();

		if (blnIsBacking == false){
			iNextBanner = 0;
			iPreviousBanner = bannerList.children.length - 1;	//	iniciando o banner anterior como sendo o ultimo da lista, pois o banner anterior do priemiro primeiro da lista é o ultimo
		}else{
			iNextBanner = bannerList.children.length - 1;	//	iniciando o banner anterior como sendo o ultimo da lista, pois o banner anterior do priemiro primeiro da lista é o ultimo
			iPreviousBanner = 0;
		}
		for (var i = 0; i < bannerList.children.length; i++){	//percorre a lista de <li>
			if(bannerList.children[i].classList.contains('show-banner')){	//caso encontre a classe 'show-banner', este é o banner atual
				iPreviousBanner = i;
				if (blnIsBacking == false){
					if(i < bannerList.children.length - 1){	//apenas soma caso i seja menor q o penultimo indice
						iNextBanner = i + 1;
					}
				}else{
					if (i > 0){	//nao pode subtrair caso i seja menor q 0, pois 0 é o menor indice
						iNextBanner = i - 1;
					}
				}
				blnFirstLoad = false;
			}
		}
		for (var i = 0; i < bannerList.children.length; i++){	//percorre a lista de <li> para remover a classe 'show-banner' do banner atual
			bannerList.children[i].classList.remove('show-banner');
			bannerList.children[i].classList.remove('hide-banner');
		}
		bannerList.children[iNextBanner].classList.add('show-banner');
		//adiciona a classe hide-banner apenas se nao for a chamada inicial
		if(blnFirstLoad == false){
			bannerList.children[iPreviousBanner].classList.add('hide-banner');
		}
	}

	this.carregaBanner = function (xmlDoc){
		var bannerNodes = xmlDoc.responseXML.getElementsByTagName('banner');
		
		for(var i = 0; i < bannerNodes.length; i++){
			var strSrc = bannerNodes[i].getElementsByTagName('source')[0].textContent;
			var li = document.createElement('li');
			var img = document.createElement('img');

			img.setAttribute('src', strSrc);	//monta os <li> com as imagens do xml
			li.appendChild(img);

			//adiciona o li montado dinamicamente ao <ul> .banner-list
			document.getElementById('bannerRotator').getElementsByClassName('banner-list')[0].appendChild(li);
		}
		//adiciona a classe hidden a div com o texto de loading
		document.getElementById('bannerRotator').getElementsByClassName('loading-img')[0].classList.add('hidden');
		self.changeBanner(false);
	}
	
	this.init = function(){
		document.getElementById('btRight').addEventListener('click', function(){self.changeBanner(false)}, false);
		document.getElementById('btLeft').addEventListener('click', function(){self.changeBanner(true)}, false);		
		ajax(strXMLPath, this.carregaBanner);
	}
}

function clickMenu(e){
	//e.preventDefault();
	
	var mainMenuOptions = document.getElementById('mainMenu').children;
	
	for(var i=0; i < mainMenuOptions.length; i++){	
		mainMenuOptions[i].classList.remove('selected');
	}
	this.classList.add('selected');
}

function whatPage(){
	var arrPathName = window.location.pathname.split('/');
	var currentPage = arrPathName[arrPathName.length - 1].toLowerCase();
	if(currentPage == ''){
		currentPage = 'index.html';
	}
	return currentPage;
}

function onLoadSelectMenu(){	//seleciona a opçao do menu no onload de acordo com a pagina
	var currentPage = whatPage();
	var mainMenuOptions = document.getElementById('mainMenu').children;
	
	if(currentPage == '' || currentPage == 'index.html'){
		mainMenuOptions[0].classList.add('selected');
	}else if(currentPage == 'sitio.html'){
		mainMenuOptions[1].classList.add('selected');
	}else if(currentPage == 'localizacao.html'){
		mainMenuOptions[2].classList.add('selected');
	}else if(currentPage == 'contato.html'){
		mainMenuOptions[3].classList.add('selected');
	}
}

function htmlLoad() {
	var currentPage = whatPage();
	var mainMenu = document.getElementById('mainMenu').children;
	//var strLoc = 'https://akiramissaka.github.io/sitioborges-desk/img/banner-home/banner.xml'
	
	if(currentPage == 'index.html'){ //carrega o banner rotator apenas se a pagina atual for a home
		var bannerRotator = new BannerRotator('img/banner-home/banner.xml', 5000);
		//var bannerRotator = new BannerRotator(strLoc, 5000);
		bannerRotator.init();
	}
	
	onLoadSelectMenu()
		
	// eventos
	for(var i=0; i < mainMenu.length; i++){	// adiciona o listener pra cada item do menu
		mainMenu[i].addEventListener('click', clickMenu, false);
	}
	
}

/* no onload do DOM chama a funcao htmlLoad */
document.addEventListener('DOMContentLoaded', htmlLoad, false);