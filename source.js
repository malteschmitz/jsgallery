// jsgallery 2.1 <http://code.google.com/p/jsgallery/>
// Copyright (c) 2008 Malte Schmitz <http://malte.schmitz-sh.de>
// This software is released under the MIT License <http://www.opensource.org/licenses/mit-license.php>

// checked with JSLint <http://www.jslint.com> (Recommended Options and assuming a Browser)
// This code should be minified using JSMin <http://javascript.crockford.com/jsmin.html> before deployment.

function $(a) {
  return document.getElementById(a);
}

function jsgallery(id) {
  //////////////////////////////////////////////////////////////////////////////
  //PROPERTIES
  this.id = id;
  
  this.images = [];
  this.thumbnails = [];
   
  this.delay = 5;
  this.activeBorderColor = '#FF0000';
  this.defaultBorderColor = '#FFFF80';
  this.playInterval = null;
  
  this.thumbnailContainerHeight = 0;
  this.activeImage = 1;
  
  //////////////////////////////////////////////////////////////////////////////
  //METHODS
  
  this.addClickHandler = function (object, handler) {
    object.jsgallery = this;
    object.onclick = handler;
  };
  this.addButton = function (clickHandler, image, altText) {
    //<button onClick=""><img src="" alt=""></button>
    var node = document.createElement('button');
    this.addClickHandler(node, clickHandler);
    node.appendChild(document.createElement('img'));
    node.firstChild.src = image;
    node.firstChild.alt = altText;
    this.buttonContainer.appendChild(node);
    return node;
  };
  this.addImages = function (prefix, count, digits) {
    count = count || 0;
    digits = digits || 2; 
    
    function int2str(int, digits) {
      int = String(int);
      while (int.length < digits) {
        int = '0' + int;
      }
      return int;
    }
    
    var number = '';
    for (var i = 1; i <= count; i++) {
      number = int2str(i, digits);
      this.addImage(prefix + number + '.jpg',
      String(i),
      prefix + number + 'k.jpg');
    }
  };
  this.addImage = function (image, title, thumbnail) {
    var dom = document.createElement('div');
    var node = document.createElement('p');
    node.appendChild(document.createElement('img'));
    node.firstChild.src = image;
    node.firstChild.alt = title;
    node.className = 'jsgallery_image';
    dom.appendChild(node);
    node = document.createElement('p');
    node.appendChild(document.createTextNode(title));
    node.className = 'jsgallery_title';
    dom.appendChild(node);
    this.images.push(dom);
    this.imageContainer.appendChild(dom);
    if (this.images.length !== 1) {
      dom.style.display = 'none';
    }
      
    dom = document.createElement('img');
    dom.src = thumbnail;
    dom.alt = title;
    this.addClickHandler(dom, this.thumbnailClickHandler);
    this.thumbnails.push(dom);
    this.thumbnailContainer.appendChild(dom);
    
    if (this.images.length === 1) {
      this.defaultBorderColor = dom.style.borderColor; 
      dom.style.borderColor = this.activeBorderColor;
    }
    
    dom.jsgalleryImageId = this.images.length;
  };
  this.showImage = function (i) {
    this.thumbnails[this.activeImage - 1].style.borderColor = this.defaultBorderColor;
    this.images[this.activeImage - 1].style.display = 'none';
    this.activeImage = i;
    this.thumbnails[this.activeImage - 1].style.borderColor = this.activeBorderColor;
    this.images[this.activeImage - 1].style.display = 'block';
  };
  this.nextImage = function () {
    if (this.activeImage < this.images.length) {
      this.showImage(this.activeImage + 1);
    } else {
      this.showImage(1);
    }
  };
  this.doPlay = function () {
    this.firstBtn.style.display = 'none';
    this.prevBtn.style.display = 'none';
    this.playBtn.style.display = 'none';
    this.pauseBtn.style.display = 'inline';
    this.nextBtn.style.display = 'none';
    this.lastBtn.style.display = 'none';
    this.playInterval = window.setInterval('$(\'' + this.id + '\').jsgallery.nextImage();', this.delay * 1000);
  };
  this.doPause = function () {
    this.firstBtn.style.display = 'inline';
    this.prevBtn.style.display = 'inline';
    this.playBtn.style.display = 'inline';
    this.pauseBtn.style.display = 'none';
    this.nextBtn.style.display = 'inline';
    this.lastBtn.style.display = 'inline';
    window.clearInterval(this.playInterval);
    this.playInterval = null;
  };
  
  //////////////////////////////////////////////////////////////////////////////
  //EVENT HANDLER
  
  //Click Handler
  //this.jsgallery = active instance of this class
  //this = sender of the event
  this.firstClickHandler = function () {
    this.jsgallery.showImage(1);
  };
  this.prevClickHandler = function () {
    if (this.jsgallery.activeImage > 1) {
      this.jsgallery.showImage(this.jsgallery.activeImage - 1);
    } else {
      this.jsgallery.showImage(this.jsgallery.images.length);
    }
  };
  this.playClickHandler = function () {
    this.jsgallery.doPlay();
  };
  this.pauseClickHandler = function () {
    this.jsgallery.doPause();
  };
  this.nextClickHandler = function () {
    this.jsgallery.nextImage();
  };
  this.lastClickHandler = function () {
    this.jsgallery.showImage(this.jsgallery.images.length);
  };
  this.thumbnailClickHandler = function () {
    if (this.jsgallery.playInterval === null) {
      this.jsgallery.showImage(this.jsgalleryImageId);
    }
  };
  
  //////////////////////////////////////////////////////////////////////////////
  //CONSTRUCTOR  
  
  //<div class="jsgallery"></div>
  var dom = document.createElement('div');
  dom.className = 'jsgallery';
  dom.id = id;
  $(id).parentNode.replaceChild(dom, $(id));
  $(id).jsgallery = this;
  
  //<div class="jsgallery_button_container"></div>
  this.buttonContainer = document.createElement('div');
  this.buttonContainer.className = 'jsgallery_button_container';
  dom.appendChild(this.buttonContainer);
  
  this.firstBtn = this.addButton(this.firstClickHandler, 'jsgallery_first.gif', '|<<');
  this.prevBtn = this.addButton(this.prevClickHandler, 'jsgallery_prev.gif', '<<');
  this.playBtn = this.addButton(this.playClickHandler, 'jsgallery_play.gif', 'Play');
  this.pauseBtn = this.addButton(this.pauseClickHandler, 'jsgallery_pause.gif', 'Pause');
  this.pauseBtn.style.display = 'none';
  this.nextBtn = this.addButton(this.nextClickHandler, 'jsgallery_next.gif', '>>');
  this.lastBtn = this.addButton(this.lastClickHandler, 'jsgallery_last.gif', '>>|');
  
  //<div class="jsgallery_image_container"></div>
  this.imageContainer = document.createElement('div');
  this.imageContainer.className = 'jsgallery_image_container';
  dom.appendChild(this.imageContainer);
  
  //<div class="jsgallery_thumbnail_container"></div>
  this.thumbnailContainer = document.createElement('div');
  this.thumbnailContainer.className = 'jsgallery_thumbnail_container';
  dom.appendChild(this.thumbnailContainer);
}