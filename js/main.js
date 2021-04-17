/*
 * Copyright (C) 2019 Ivà Domingo i Solsona - https://www.iva.cat/
 *
 *
 *  Redistribution and use in source and binary forms, with or without
 *  modification, are permitted provided that the following conditions
 *  are met:
 *
 *    Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *
 *    Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the
 *    distribution.
 *
 *    Neither the name of Ivà Domingo i Solsona nor the names of
 *    its contributors may be used to endorse or promote products derived
 *    from this software without specific prior written permission.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 *  "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 *  LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 *  A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 *  OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 *  SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 *  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 *  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 *  THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 *  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 *  OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

/* Obtener la URL de la página actual con JavaScript 
 * https://cybmeta.com/obtener-la-url-de-la-pagina-actual-con-javascript-y-sus-componentes 
 * Juan Padial jpadial@cybmeta.com
 */
function getAbsolutePath() {
    let loc = window.location;
    let pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
    return loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
}
const gUrl = 'https://api.github.com/repos/isabelGimenez/web/contents/';
const dUrl = './dossier.json';
const bUrl = getAbsolutePath();
let dossier = [];
//var msnry;
let first = 0;

function browseDetection () {

    //Check if browser is IE
    if (navigator.userAgent.search("MSIE") >= 0) {
        return '/jpg/';
    }
    //Check if browser is Chrome
    else if (navigator.userAgent.search("Chrome") >= 0) {
        return '/webp/';
    }
    //Check if browser is Firefox
    else if (navigator.userAgent.search("Firefox") >= 0) {
        return '/jpg/';
    }
    //Check if browser is Safari
    else if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
        return '/jpg/';
    }
    //Check if browser is Opera
    else if (navigator.userAgent.search("Opera") >= 0) {
        return '/webp/';
    }
}

let removeChilds = function(element){
  while(element.hasChildNodes()){
    element.removeChild(element.firstChild);
  }
};

let hiddenElement = function(){
  let element = document.getElementById("portada");
  element.style.display = "none";
  hiddenSessions();
};

let hiddenSessions = function(){
    let n = document.getElementById("gsessio").children;
    for (let i=0; i <n.length; i++){
        n[i].style.display = "none";
    }
}

let showSession = function(id){
    portada();
    document.getElementById("portada").style.display="none";
    document.getElementById(id).style.display = "block";

}

let portada = function(){
  let element = document.getElementById("portada");
  element.style.display = "block";
  let grid = document.querySelector('.grid');
  removeChilds(grid);
  grid.setAttribute("class","grid");
  grid.setAttribute("style",'');
  hiddenSessions();

};

function addEvent (element, event, selector, func) {
    element.addEventListener(event, function(e){
        let that = this;
        let helper = function (el) {
            if (el !== that) {
                if (el.classList.contains(selector)) {
                    return el;
                }
                return helper(el.parentNode);
            }
            return false;
        };
        let el = helper(e.target);
        if (el !== false) {
            func.call(this, e);
        }
    });
}

function getPos (name){
  let pos=0;
  dossier.forEach(function(element,i){
    if(element.name === name)  pos = i;
  });
  return pos;
}

function getJSON (url, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        let status = xhr.status;
        if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
}

function pintarMenu (nom, data){
  let menu = document.getElementById(nom);
  if (menu !== undefined){
    data.forEach(function(e){
      let element = document.createElement("a");
      element.classList.add('dropdown-item');
      element.classList.add('nav-link');
      element.classList.add('bg-light');
      let name = e.name;
      element.setAttribute("id", name);
      if(name === "embaras") name = "embar&agrave;s";
      element.innerHTML = name.toUpperCase().charAt(0)+name.substring(1,name.length);
      element.setAttribute("href",'#dossier');
      element.addEventListener("click", hiddenElement);
      element.onclick = pintarImatges;
      menu.appendChild(element);      
    });
  }
}

function pintarImatges (e){
	e.preventDefault();
  	let grid = document.querySelector('.grid');
  	grid.className= '';
  	grid.classList.add('grid');
  	grid.classList.add("effect-"+Math.floor((Math.random() * 10) + 1));

  	removeChilds(grid);
  	dossier[getPos(e.target.id)].images.forEach(function(image, i){
	    image.classList.add("img-thumbnail");
	    let element = document.createElement("li");
	    element.classList.add("grid-item");
	    if (i===0){
	    	element.setAttribute("id", "gran");
	    }
	    if(image.width>image.height){
	    	image.classList.add("horitzontal");
	    }
	    else{
	    	image.classList.add("vertical");
	    }

       // imagesLoaded( image, function(){
            element.appendChild(image);
        //});

	    grid.insertBefore(element, grid.firstChild);
  	});
	let anim = new AnimOnScroll( document.getElementById( 'grid' ), {
		    	minDuration : 0.4,
		    	maxDuration : 0.7,
				viewportFactor : 0.2
		    	});

  	if (!first){
    	addEvent(grid, 'click', 'grid-item', function(e){ 
    		let tipus;
      		e.preventDefault();
        	let target = e.target;
	        if(e.target.tagName==="IMG"){
	        	//if($(e.target).hasClass( "vertical" )){
                if(e.target.classList.contains( "vertical" )){
	        		tipus = 'grid-item--gran-vertical';
	        	}
	        	else{
	        		tipus = 'grid-item--gran-horitzontal';
	        	}
	          target=e.target.parentElement;
	        }
	        if(target.tagName==="LI"){
    		    target.classList.toggle(tipus);
          		if(target!==gran){
            		gran.classList.remove('grid-item--gran-horitzontal');
            		gran.classList.remove('grid-item--gran-vertical');
          		}
          		// trigger layout
          		gran = target;
 		        anim.layout();
        	}
    	});
    	first++;
  	}
  /*	let element = document.createElement("p");
  	element.textContent = "Les imatges incloses en aquest espai s&oacute;n c&ograve;pies de les originals.";
  	document.getElementById("gallery").appendChild(element);*/
}

window.onload = function(){


    //document.getElementById("pro").onresize= function (){
     //   let h =window.innerHeight*0.7;
       // document.getElementById("pro").style.height= h+"px";
   // }

    /* Portada */
 /* let img = document.createElement("img");
  img.src = "./abril1920.jpg";
  img.classList.add('img-fluid');
  img.setAttribute("max-width",'100%');

  imagesLoaded( img, function(){
    document.getElementById('portada').appendChild(img);
  });*/

	 /*Get Dossier */
  	getJSON(dUrl, function(err, data) {
    	if (err !== null) {
        	alert("Disculpeu l\'error\nSi persisteix podeu adjuntar una captura de pantalla\na webmaster@isabelgimenez.cat\nGràcies.\n\nDescripcció:\n" + err);
      	} 
    	else {
        	data.forEach(function(album){
                let Album = {};
                Album.name = album.name;
                      Album.images = [];
                      let aURL = gUrl+album.path+browseDetection();
                      getJSON(aURL, function(err, data){
                                      if(err !== null){
                                        alert('Something went wrong: ' + err);
                                      }
                                      else{
                                        data.forEach(function(imatge){
                                          if (imatge.name !== "images.json"){
                                            let image = new Image();
                                            image.src = bUrl + imatge.path;
                                            image.alt = imatge.description;
                                            Album.images.push(image);
                                          }
                                        });
                                      }
                      });
                      dossier.push(Album);
        	});
        	pintarMenu("Dossier", dossier);
      	}
    });
};
