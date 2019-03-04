var imageLoader = document.getElementById('imageLoader');
imageLoader.addEventListener('change', handleImage, false);
var canvas = document.getElementById('imageCanvas');
var ctx = canvas.getContext('2d');
var colorsArray = [];

function handleImage(e){
  var reader = new FileReader();
  reader.onload = function(event){
    var img = new Image();
    img.onload = function(){
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img,0,0);
      generateColors();
    }
    img.src = event.target.result;
  }
  reader.readAsDataURL(e.target.files[0]);
}

function getPixelColor( imagedata, x, y ) {
  var position = ( x + imagedata.width * y ) * 4, data = imagedata.data;
  // return { r: data[ position ], g: data[ position + 1 ], b: data[ position + 2 ], a: data[ position + 3 ] };
  return rgbToHex(data[ position ], data[ position + 1 ], data[ position + 2 ])
}

function generateColors() {
  var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  // console.log(imgData);
  var colors = [];
  for (var i = 0; i < imgData.data.length; i += 4) {
    colors.push(rgbToHex(imgData.data[i], imgData.data[i + 1], imgData.data[i + 2]));
    // imgData.data[i] = 255-imgData.data[i];
    // imgData.data[i + 1] = 255-imgData.data[i + 1];
    // imgData.data[i + 2] = 255-imgData.data[i + 2];
    // imgData.data[i + 3] = 255;
  }
  // console.log('colors ', colors);
  for(var h = 0; h < canvas.height; h++) {
    colorsArray[h] = [];
    for(var w = 0; w < canvas.width; w++) {
      colorsArray[h][w] = getPixelColor(imgData, w, h);
    }
  }
  _generateBoxShadow();
  // console.log('colorsArray ', colorsArray);
}

function _generateBoxShadow() {
  var step = 1;
  var bsArray = [];
  // for(var i = 0; i < colorsArray.length; i+=step) {
  //   for(var j = 0; j < colorsArray[i].length; j+=step) {
  //     var bs = (j*step)+'px '+(i*step)+'px '+'4px '+step+'px '+colorsArray[i][j];
  //     bsArray.push(bs);
  //   }
  // }
  colorsArray.forEach(function(item, itemIndex) {
    item.forEach(function(element, elementIndex) {
      var bs = (elementIndex*step)+'px '+(itemIndex*step)+'px '+'0 '+step+'px '+colorsArray[itemIndex][elementIndex];
      bsArray.push(bs);
    });
    elementIndex = 0;
  });
  var finalBS = bsArray.join(', ');
  console.log('finalBS ', finalBS);
  $('#genImg').css('box-shadow', finalBS);
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
