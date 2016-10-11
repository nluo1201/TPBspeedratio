// ==UserScript==
// @name         TPBspeedratio
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the pirate's ships!
// @author       HL
// @downloadURL https://github.com/nluo1201/TPBspeedratio/TPBspeedratio.js
// @match        http*://thepiratebay.org/*
// ==/UserScript==


// Helper functions:

function isURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return pattern.test(str);
}

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
};
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
};


//  Confirm all button that has id: 'butconfirm'
var confirm = document.getElementById('butconfirm');
if(confirm) confirm.click();

// confirm age without needing to click 'confirm'
var confirmage = document.getElementById('confirm_age');
if(confirmage){
    confirmage = confirmage.getElementsByTagName('button')[0];
    if(confirmage) confirmage.click();
}

// make the TPB menu logo disapear exept the query box
var logo = document.getElementById('TPBlogo');
if(logo){
    //logo.style.height = '1';
    logo.src="";
    logo.alt="HOME";
    logo.innerHTML = '<a href="https://' + window.location.hostname + '"> HOME </a>';
}

// Get rid of the latest new thing on full site page:
var latestnews = document.getElementsByClassName("data width100perc clear");
if(latestnews[0]) latestnews[0].remove();

// Get rid of the land-logo-sign and land-logo-text:
var landlogo = document.getElementsByClassName("land-logo-sign");
if(landlogo && landlogo[0]) landlogo[0].remove();
var landtext = document.getElementsByClassName("land-logo-text");
if(landtext && landtext[0]) landtext[0].remove();

// Get rid of the anoying sidebar and sidebarCell
var sidebar = document.getElementById('sidebar');
if(sidebar) sidebar.remove();
var sidebarCell = document.getElementsByClassName('sidebarCell');
if(sidebarCell[0]) sidebarCell[0].remove();

// Get rid of the anoying big Torrent rss div:
var trss = document.getElementsByClassName("spareBlock hzSpare");
if(trss[0]){
    var unwantted = trss[0];
    var nparent = unwantted.parentNode;
    if(nparent){
        var children = nparent.children;
        var mainbox = children[1];
        if(mainbox){
            if(mainbox.firstChild){
                mainbox.firstChild.remove();
            }
        }
        if(children[0]) children[0].remove();
    }

}

// Get rid of the big tagcloud div:
var tagcloud = document.getElementById("tagcloud");
if(tagcloud){
	tagcloud.remove();
}
var hidebut = document.getElementsByClassName('line50perc showmore botmarg0');
if(hidebut && hidebut[0]) hidebut[0].remove();

// Get rid of the rss logos:
var rsslogo = document.getElementsByClassName('ka ka16 ka-rss normalText rsssign ka-red');
if(rsslogo){
    for(var i = 0 ; i < rsslogo.length; i++){
        rsslogo[i].style.visibility = 'hidden';
    }
}

// Get rid of the studpid pirate bay home logo at the home page.
//document.getElementsByTagName('h1')[0].style.display = 'none';

// Start of the good stuff.

function create_Torrentspeedratio(matching_term){
   //var rows = document.querySelectorAll('[id*="' + matching_term +'"]');
	var tbody = document.getElementById("searchResult").tBodies[0];
	var tr = document.getElementById('searchResult').tHead.children[0];
    var newh = document.createElement('th');
	newh.innerHTML = '<strong> Speedratio </strong>';
	newh.style.color = 'red';
	tr.appendChild(newh);
	var cellrows = tbody.getElementsByTagName("tr");
	for (i = 0; i < cellrows.length; ++i) {
		var current = cellrows[i];
		if(! current.cells) break;
		if(! current.cells[2]) break;
		var seed = parseFloat(current.cells[2].innerHTML) ;
		var leech = parseFloat(current.cells[3].innerHTML);
		var x = current.insertCell();
		var ratio = ((seed - leech) / (seed + leech) ) * seed;
		if(seed === 0){
			ratio = -999999;
		}
		x.innerHTML = "<strong>" + parseFloat(ratio).toFixed(2) + "</strong>";
		if(ratio >= 1000) {
			x.style.color = "black";
			current.style.backgroundColor = 'rgba(0, 225, 3, 0.2)';
		}
		else if (ratio >= 100 &&  ratio < 1000) {
			x.style.color = "darkslateblue";
			current.style.backgroundColor = 'rgba(0, 100, 0, 0.1)';
		}
		else if(ratio >= 10 && ratio < 100){
			x.style.color = "blue";
			current.style.backgroundColor = 'rgba(169, 169, 169, 0.2)';
		}
		else if (ratio > 2 && ratio < 10){
			x.style.color = "darkorange";
			current.style.backgroundColor = 'rgba(255, 127, 80, 0.1)';
		}
		else {
			x.style.color = "red";
			current.style.backgroundColor = 'rgba(220, 20, 60, 0.1)';
		}
	}
	// Sorting all largest speedratio first in decending order.
	tbody = document.getElementById("searchResult").tBodies[0];
	for(i = 0; i < cellrows.length - 1; i++) {
		for(var j = 0; j < cellrows.length - (i + 1); j++) {
			if(! cellrows.item(j).cells) break;
			if(! cellrows.item(j).cells[4]) break;
			if(! cellrows.item(j).cells[4].children[0]) break;
            if(! cellrows.item(j+1).cells) break;
			if(! cellrows.item(j+1).cells[4]) break;
			if(! cellrows.item(j+1).cells[4].children[0]) break;
			var speeda = Number(cellrows.item(j).cells[4].children[0].innerHTML);
			var speedb = Number(cellrows.item(j+1).cells[4].children[0].innerHTML);
			if(speedb > speeda) {
				tbody.insertBefore(cellrows.item(j+1),cellrows.item(j));
				// update the rows position after swaps;
				cellrows = tbody.getElementsByTagName("tr");
			}
		}
	}


}

// Insert a column of speedratio value for knowing which will be downloaded the fastest
// more seed = more speed!
create_Torrentspeedratio("searchResult");



