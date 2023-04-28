
var clr_reg = '#6d8289';
var clr_err = '#e35d68';
var clr_sel = '#55c54c';
var clr_selFon = '#0d242d';    // '#1e2d34'
var clr_fon = '#1E353D';

var width_reg = 1;
var width_sel = 3;


var can_w;
var can_h;  

var can_emptyFild = 35-0.5;
var can_zg = 30;
var can_zgplus;  // = can_emptyFild + can_zg;
var can_sh;  // = can_h - can_emptyFild * 2 - can_zg * 2;
var can_shplus;  // = can_zgplus + can_sh;


var can_rs = 25;
var can_sp = 27;
var can_sw;  // = (can_w - can_emptyFild * 2 - can_zg * 2 - can_rs * 2 - can_sp)/2+0.5;
var can_swplus;
var can_fl = 0;
var can_flplus;
var can_rsplus;
var can_spplus;
var can_art; 
var can_artplus;
var can_mat;
var can_matplus;


var can_step;

var can_conLength;  // = can_zg;  // Coners Length
var can_txtFont = "normal 13px Oxygen";
// var can_txtSize = "13px";
var can_txtOffs = 20;

var texts = [];
var oldVal;

var myCanvas;
var ctx;
var wid;




$(document).ready(function() {	

	if (ctx == null) {
		canvasInit();		

		getValFmomTab($('.tab ~ .sel').attr('id'));
		inputDisable($('.tab ~ .sel').attr('id'));

		getValues();

		setTimeout(DrawCanvas,200);
	}


	$('.input').not('.slc').focus(function(event) {
		$('.input').removeClass('sel');
		$(this).addClass('sel');
		getValues();
		DrawCanvas();
	});

	$('.input').not('.slc').on('input', function() {
		// Validation
		var preg = $(this).val().replace(/[^\d.,]/igm, '').replace(',', '.').replace(/\.([^.]*)\./img, ".$1").replace(/^0{2,}/, '0');
		// console.log($(this).val() + "   " +preg);
		// $(this).attr('value', preg);
		$(this).val(preg);
		// console.log($(this).val());
		if (preg == "" || preg == '0') {
			$(this).addClass('err');
		}
		else{
			$(this).removeClass('err');
		}


		texts = [];	
		var txt = {};
		txt.val = $(this).val();	
		txt.id = $(this).attr('id');
		txt.cl = $(this).attr('class');
		texts.push(txt);
		var sh;

		if ($(this).attr('id') == 'sdLW') {
			sh = $('#sdLH');
			txt = {};
			txt.val = sh.val();	
			txt.id = sh.attr('id');
			txt.cl = sh.attr('class');
			texts.push(txt);
		}
		if ($(this).attr('id') == 'sdLH') {
			sh = $('#sdLW');
			txt = {};
			txt.val = sh.val();	
			txt.id = sh.attr('id');
			txt.cl = sh.attr('class');
			texts.push(txt);
		}
		getValues();
		DrawCanvas();
	});

	$('.tab').on('click', function() {
		$('.tab').removeClass('sel');	
		$(this).addClass('sel');
	
		tabChange($(this).attr('id'));
	});

	$('#sdLW').focusout(function() {	
		if (Number($('#brd').val()) > (Number(this.value))) {
			$('#brd').val(this.value);	
		}
	});
});



// ============================================================================
// Functions

function canvasInit(){
	can_w = $('#mycanvas').width();
	can_h = $('#mycanvas').height();  
	can_step = can_w/80;
	can_step = can_step.toFixed();

	myCanvas =  document.getElementById("mycanvas");
	ctx = myCanvas.getContext("2d");

	ctx.lineWidth = 1;
	ctx.strokeStyle = "#788b92"; 
}


function tabChange(tabId){
	var tab = $('#' + tabId);
	$('.input.sel').removeClass('sel');

	$('.chbset.dis').prop('disabled', false).removeClass('dis').prop('checked', function(){
		return $(this).prop('value') == 'true' ? true : false;
	});
	
	$('.dis.dis').prop('disabled', false).removeClass('dis');
	$('input.input[value=0]').addClass('err');

	inputDisable(tabId);

	getValFmomTab(tabId);
	getValues();
	DrawCanvas();
}

function inputDisable(tab){
	$('p.comments').not('.' + tab).not('.alws').prop('disabled', true).addClass('dis');
	$('input.input').not('.' + tab).not('.alws').prop('disabled', true).addClass('dis');		
	$('.chbset').not('.' + tab).not('.alws').prop('disabled', true).addClass('dis').prop('checked', function(){
		$(this).prop('value', $(this).prop('checked') ? 'true' : 'false');
		return false;
	});		
}


function calkFullSize(){
	var arr = ["trin", "sdLW", "jnt", "spin", "flp"]
	wid = 0;
	for (var i = arr.length - 1; i >= 0; i--) {
		$('#'+ arr[i]).each(function(){
			if (this.disabled == false) {
				wid += Number($(this).val()) * 2;				
			}
		});
	}
	wid -= $("#spin").val();

	var hgt = Number($("#sdLH").val()) + ($("#trin").attr('disabled') == 'disabled' ? 0: Number($("#trin").val() * 2));
	
	var txt = {val : "Size: " + wid + " x " + hgt,
			 id : "fullSize", cl : ""};
	texts.push(txt);
	
	return;
}

function addMoreTxt(){
	texts.push({val : "Front", id : "txt_front", cl : ""});
	texts.push({val : "side", id : "txt_frSide", cl : ""});
	texts.push({val : "Back", id : "txt_back", cl : ""});
	texts.push({val : "side", id : "txt_bcSide", cl : ""});
	texts.push({val : "Spine", id : "txt_spine", cl : ""});
	if ($('.tab.sel').attr('id') == 'int') {
		texts.push({id : "integralCorners", cl : ""});		
	}	

	// нахлест покровного материала и материала корешка	
	if ($('.tab.sel').attr('id') == 'sos') {
	var can_nahlest = wid - (Number(texts.filter(function(v){return v.id === 'trin'})[0].val) + Number(texts.filter(function(v){return v.id === 'brd'})[0].val)) * 2 - Number(texts.filter(function(v){return v.id === 'qtr'})[0].val);
	can_nahlest *= -1/2;
	texts.push({val : can_nahlest, id : "nahlest", cl : ""});
	}
}

function getValFmomTab(tab){
	switch (tab){
		case 'cov':
			can_zg = 0;
			can_rs = 0;
			can_fl = 50;			
			break;
		case 'hCov':
			can_zg = 30;
			can_rs = 25;
			can_fl = 0;
			break;
		case 'int':
			can_zg = 30;		
			can_rs = 0; 
			can_fl = 0;
			break;
		case 'sos':
			can_zg = 30;
			can_rs = 25;
			can_fl = 0;
			break;
	}

	can_zgplus = can_emptyFild + can_zg;
	can_sh = can_h - can_emptyFild * 2 - can_zg * 2;
	can_shplus = can_zgplus + can_sh;
	can_flplus = can_zgplus + can_fl;

	can_sw = (can_w - can_emptyFild * 2 - can_zg * 2 - can_rs * 2 - can_sp - can_fl * 2)/2;
	can_art = can_sw - (can_sw / 5);
	can_artplus = can_zgplus + can_art;
	can_mat = can_art - 20;
	can_matplus = can_zgplus + can_mat;
	can_matw = can_w - can_matplus * 2;

	can_swplus = can_flplus + can_sw;
	can_rsplus = can_swplus + can_rs;
	can_spplus = can_rsplus + can_sp+0.5;

	can_conLength = can_zg;
}


function getValues(){
	texts = [];
	$('input.input').not('.dis').each(function(){
		var txt = {};
		txt.val = $(this).val();
		txt.id = $(this).attr('id');
		txt.cl = $(this).attr('class');
		texts.push(txt);
	});

	// Add perimetr
	var txt = {};
		// txt.val = $(this).val();
		txt.id = 'perimetr';
		txt.cl = '';
		texts.push(txt);

	calkFullSize();
	addMoreTxt();
}


function DrawCanvas(){	
	// canvas
	ctx.fillStyle = "#1b3d47";
	ctx.fillRect(0.5,0.5, can_w-1, can_h-1);

	// Chart
	// can_step = can_step.toFixed();
	for (var i = Number(can_step) + 1; i < (Number(can_w-can_step+5)); i += Number(can_step)) {
		drawLine([i-0.5,0, i-0.5,can_h], "#304f58", false, false, false, getWidth(clr_reg));
		drawLine([0 ,i-0.5, can_w, i-0.5], "#304f58", false, false, false, getWidth(clr_reg));
	}

	// canvas stroke
	ctx.strokeStyle = "#788b92";
	ctx.strokeRect(0.5,0.5, can_w-1, can_h-1);

	// perimetr
	ctx.clearRect(can_emptyFild, can_emptyFild, can_w - (can_emptyFild * 2), can_h - (can_emptyFild * 2));
	ctx.strokeRect(can_emptyFild, can_emptyFild, can_w - (can_emptyFild * 2), can_h - (can_emptyFild * 2));
	
	var leftOffset  = 140.5;
	var topOffset = 27.5;
	ctx.clearRect(can_w - leftOffset, can_h - topOffset ,  leftOffset - can_emptyFild, topOffset-7);
	// ctx.strokeRect(can_w - leftOffset, can_h - topOffset - 5,  leftOffset - can_emptyFild, topOffset);
	
	drawCorners(clr_err);
	
	schemeProc();
	txtProc();
}


function schemeProc(){
	// Draw selected Backgrounds
	for (var i = texts.length - 1; i >= 0; i--) {
		if (texts[i].cl.indexOf('sel') !== -1) {
			DrawSelection(texts[i], clr_sel);
		}
	}

	// Draw schem
	for (var i = texts.length - 1; i >= 0; i--) {
		if (texts[i].cl.indexOf('dis') == -1) {
			DrawSchem(texts[i]);
		}
	}

	// Draw Selected Lines
	for (var i = texts.length - 1; i >= 0; i--) {
		var item = texts[i].cl;
		if (item.indexOf('dis') == -1 && (item.indexOf('sel') != -1 | item.indexOf('err') != -1)) {
		var clr;
			switch (true){     // (texts[i].cl.split(" ")[1]){
				case texts[i].cl.indexOf('sel') !== -1:    // 'sel':
					clr = clr_sel;
					// drawAllTxt(texts[i], clr_sel)
					break;
				case texts[i].cl.indexOf('err') !== -1: 
					clr = clr_err;
					// drawAllTxt(texts[i], clr_err);				
					break;
				default:
					clr = clr_reg;
					// drawAllTxt(texts[i], clr_reg);				
					break;
			}			
			DrawSelectedLines(texts[i], clr);
		}
	}
}

function txtProc(){
	for (var i = texts.length - 1; i >= 0; i--) {
		var clr;		
		switch (true){     // (texts[i].cl.split(" ")[1]){
			case texts[i].cl.indexOf('sel') !== -1:    // 'sel':
				// DrawSelection(texts[i], clr_sel, true)
				clr = clr_sel;
				break;
			case texts[i].cl.indexOf('err') !== -1: 
				// DrawSelection(texts[i], clr_err);
				clr = clr_err;				
				break;
			default:
				// DrawSelection(texts[i], clr_reg);
				clr = clr_reg;				
				break;
		}
		drawAllTxt(texts[i], clr);
	}
}



// ================================================================================
// Draw
function DrawSelection(tobj, clr){		
	ctx.strokeStyle = clr;
	switch (tobj.id){
		case "trin":
			if (clr == clr_sel) {
				drawRect([can_emptyFild, can_emptyFild+1, can_w - can_emptyFild * 2, can_zg-2], clr_selFon, true, true);				
				drawRect([can_emptyFild+1, can_zgplus-2, can_zg-2, can_zg + can_sh], clr_selFon, true, true);
				drawRect([can_w - can_zgplus+1, can_emptyFild, can_zg-2, can_zg * 2 + can_sh], clr_selFon, true, true);
				drawRect([can_emptyFild, can_shplus+1,can_w - can_emptyFild * 2, can_zg-2], clr_selFon, true, true);
			}
			break;
		case "sdLW":
			if (clr == clr_sel) {
				drawRect([can_flplus + 1, can_zgplus, can_sw-2, can_sh], clr_selFon, true, true);
				drawRect([can_w - can_swplus+1, can_zgplus, can_sw-2, can_sh], clr_selFon, true, true);
			}
			break;	
		case "flp":
			if (clr == clr_sel) {
				drawRect([can_zgplus + 1, can_zgplus, can_fl-2, can_sh], clr_selFon, true, true);
				drawRect([can_w - can_flplus + 1, can_zgplus, can_fl - 2, can_sh], clr_selFon, true, true);
			}
			break;	
		case "sdLH":
			if (clr == clr_sel) {
				drawRect([can_zgplus, can_zgplus + 1, can_fl + can_sw, can_sh - 2], clr_selFon, true, true);
				drawRect([can_w - can_swplus, can_zgplus +1 , can_fl + can_sw, can_sh- 2], clr_selFon, true, true);
			}
			break;	
		case "jnt":
			if (clr == clr_sel) {
				drawRect([can_swplus+1, can_zgplus, can_rs-2, can_sh], clr_selFon, true, true);
				drawRect([can_spplus+1, can_zgplus, can_rs-2, can_sh], clr_selFon, true, true);
			}			
			break;
		case "spin":
			if (clr == clr_sel) {
				drawRect([can_rsplus, can_zgplus, can_sp, can_sh], clr_selFon, true, true);
			}
			break;	
		case "brd":
			drawRect([can_emptyFild, can_emptyFild, can_zg + can_art, can_sh + can_zg *2], clr_selFon, true, true);
			drawRect([can_w - can_emptyFild, can_emptyFild , -1 * (can_zg + can_art), can_sh + can_zg * 2], clr_selFon, true, true);
			break;
		case "qtr":
			drawRect([can_matplus, can_emptyFild, can_matw, can_sh + can_zg *2], clr_selFon, true, true);			
			break;	
		case "fullSize":
			
			break;	

		default:
			break;
	}
}

function DrawSelectedLines(tobj, clr){		
	ctx.strokeStyle = clr;
	var wid = getWidth(clr);
	switch (tobj.id){
		case "trin":			
			// if (clr != clr_sel ) {clr = clr_err;}	
			drawLine([can_emptyFild, can_emptyFild, can_zgplus, can_emptyFild], clr, true, true, false, wid);
			drawLine([can_emptyFild, can_emptyFild, can_emptyFild, can_zgplus], clr, true, true, false, wid);
			break;
		case "sdLW":			
			drawLine([can_flplus, can_zgplus,
					can_swplus, can_zgplus], clr, true, true, false, wid);
			break;	
		case "flp":
			drawLine([can_zgplus, can_zgplus,
					can_flplus, can_zgplus], true, true, clr, false, wid);
			break;	
		case "sdLH":
			drawLine([can_zgplus, can_zgplus,
					can_zgplus, can_shplus], clr, true, false, false, wid);
			drawLine([can_swplus, can_zgplus,
					can_swplus, can_shplus], clr, true, false, false, wid);
			break;	
		case "jnt":	
				drawLine([can_swplus, can_zgplus,
					can_rsplus, can_zgplus], clr, true, true, false, wid);
			break;
		case "spin":
			drawLine([can_rsplus, can_zgplus,
					can_spplus, can_zgplus], clr, false, true, false, wid);
			break;	
		case "brd":
			drawLine([can_w - can_artplus, can_emptyFild,
					can_w - can_zgplus, can_emptyFild], clr, true, true, false, wid);			
			break;
		case "qtr":
			drawLine([can_matplus, can_emptyFild,
					can_matplus + can_matw, can_emptyFild], clr, true, true, false, wid);
			break;	
		case "fullSize":
			var leftOffset  = 140.5;
			var topOffset = 21.5;
			ctx.clearRect(can_w - leftOffset, can_h - topOffset -5,  leftOffset - can_emptyFild, topOffset-3);
			break;	
		default:
			break;
	}
}


function DrawSchem(tobj){
	ctx.lineWidth = 1;
	switch (tobj.id){
		case "trin":			
				
			break;
		case "sdLW":
				drawRect([can_flplus , can_zgplus, can_sw, can_sh], clr_reg, false, false);
				drawRect([can_w - can_swplus, can_zgplus, can_sw, can_sh], clr_reg, false, false);
		break;	
		case "flp":
				drawRect([can_zgplus , can_zgplus, can_fl, can_sh], clr_reg, false, false);
				drawRect([can_w - can_flplus, can_zgplus, can_fl, can_sh], clr_reg, false, false);
			break;	
		case "sdLH":
				
			break;	
		case "jnt":
				
			break;
		case "spin":
				drawRect([can_rsplus, can_zgplus, can_sp, can_sh], clr_reg, false, false);		
			break;	
		case "brd":
				drawLine([can_w - can_artplus-0.5, can_emptyFild,
					can_w - can_artplus, can_h - can_emptyFild], clr_reg, true, false);
			break;
		case "qtr":
				drawLine([can_w - can_matplus-0.5, can_emptyFild,
					can_w - can_matplus, can_h - can_emptyFild], clr_reg, true, false);
			break;
		case "perimetr":
			drawRect([can_emptyFild, can_emptyFild, can_w - (can_emptyFild * 2), can_h - (can_emptyFild * 2)], clr_reg, false, false);
			break;
		case "integralCorners":
				drawLine([can_emptyFild, can_zgplus + can_zg, can_zgplus + can_zg, can_emptyFild], clr_reg, true, true);

			break;
		default:
			break;
	}
}

function drawAllTxt(tobj, clr){
	switch (tobj.id){
			case "trin":
			if (can_zg > 0) {	
				drawTxt([can_emptyFild + can_zg / 2, can_emptyFild + can_zg / 2], clr, tobj.val);
			}
			break;
		case "sdLW":			
			drawTxt([can_flplus + can_sw / 2, can_zgplus + can_txtOffs],  clr, tobj.val);
			drawTxt([can_w - can_flplus - can_sw / 2, can_zgplus + can_txtOffs],  clr, tobj.val);
			break;
		case "flp":	
			if (can_fl > 0) {	
				drawTxt([can_zgplus + can_fl / 2, can_zgplus + can_txtOffs],  clr, tobj.val);
				drawTxt([can_w - can_zgplus - can_fl / 2, can_zgplus + can_txtOffs],  clr, tobj.val);		
			}		
			break;			
		case "sdLH":
			drawTxt([can_zgplus + can_txtOffs, can_zgplus + can_sh /2],  clr, tobj.val);
			break;	
		case "jnt":
			if (can_rs > 0) {
				drawTxt([can_swplus + can_rs / 2, can_zgplus + can_txtOffs],  clr, tobj.val);
				drawTxt([can_spplus + can_rs / 2, can_zgplus + can_txtOffs],  clr, tobj.val);
			}
			break;
		case "spin":
			drawTxt([can_rsplus + can_sp / 2, can_zgplus + can_txtOffs],  clr, tobj.val);
			break;	
		case "brd":
			if (can_zg > 0) {
			drawTxt([can_artplus / 2 + 30, can_shplus + 15],  clr, tobj.val);			
			drawTxt([can_w - can_artplus / 2 - 30, can_shplus + 15],  clr, tobj.val);			
			}
			break;
		case "qtr":
			if (can_zg > 0) {
			drawTxt([can_w / 2, can_shplus + 15],  clr, tobj.val);	
			}
			break;	
		case "fullSize":
			drawTxt([can_w - 90, can_h - can_txtOffs +2],  clr, tobj.val);
			break;	
		case "txt_front":
			drawTxt([can_w - can_flplus - 20, can_shplus - 90],  "#2b4b55", tobj.val, "bold 55px Oxygen", "right");			
			break;	
		case "txt_frSide":
			drawTxt([can_w - can_flplus - 20, can_shplus - 50],  "#2b4b55", tobj.val, "bold 30px Oxygen", "right");			
			break;
			case "txt_back":
			drawTxt([can_flplus + 20, can_shplus - 90],  "#2b4b55", tobj.val, "bold 55px Oxygen", "left");			
			break;	
		case "txt_bcSide":
			drawTxt([can_flplus + 20, can_shplus - 50],  "#2b4b55", tobj.val, "bold 30px Oxygen", "left");			
			break;	
		case "txt_spine":
			ctx.save();
			ctx.translate(can_w / 2-2, can_shplus - 40);
			ctx.rotate(-1 * Math.PI / 2);
			drawTxt([0,0],  "#2b4b55", tobj.val, "bold 20px Oxygen", "left");	
			ctx.restore();	
 			break;				
		case "nahlest":
			drawTxt([can_artplus - 10, can_shplus + 15],  clr, tobj.val);
			drawTxt([can_w - can_artplus + 10, can_shplus + 15],  clr, tobj.val);
 			break;
		default:
			break;
	}
}


function drawTxt(coord, clr, val, font, txtAlgn){
	if (typeof(font)==='undefined') font = can_txtFont;
	if (typeof(txtAlgn)==='undefined') txtAlgn = "center";
	ctx.font = font;
    ctx.fillStyle = clr;
    ctx.textAlign = txtAlgn;
    ctx.textBaseline = "middle";
	ctx.fillText(val, coord[0], coord[1]);
}

function drawLine(coord, clr, hmirr, vmirr, shad, width ){
	shad = typeof shad !== 'undefined' ? shad : false;
	width = typeof width !== 'undefined' ? width : 1;


	if (shad == true) {shadow(true);}
	ctx.strokeStyle = clr;
	ctx.lineWidth = width;

	drawLN(coord);

	var arr = coord;

	if (vmirr) {
		arr[1] = can_h - coord[1];
		arr[3] = can_h - coord[3];
		drawLN(arr);
	}

	if (hmirr) {
		arr[0] = can_w - coord[0];
		arr[2] = can_w - coord[2];
		drawLN(arr);

		if (vmirr) {	
			arr[1] = can_h - coord[1];
			arr[3] = can_h - coord[3];
			drawLN(arr);
		}
	}

	if (shad == true) {shadow();}		
}

function drawLN(coord){
	ctx.beginPath();
	ctx.moveTo(coord[0], coord[1]);
	ctx.lineTo(coord[2], coord[3]);
	ctx.stroke();
}

function drawRect(coord, clr, fill, shad){
	if (shad == true) {shadow(true);}
	ctx.strokeStyle = clr;
	ctx.fillStyle = clr;
	if (fill == true) {
		ctx.fillRect(coord[0], coord[1], coord[2], coord[3]);
	}
	else {
		ctx.strokeRect(coord[0], coord[1], coord[2], coord[3]);
	}
	if (shad == true) {shadow(false);}
}

function shadow(_shad){
	if (_shad == true) {
		ctx.shadowOffsetX = 10;
		ctx.shadowOffsetY = 10;
		ctx.shadowBlur = 20;
		ctx.shadowColor = "black";
	}
	else{
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
		ctx.shadowBlur = 0;
	}
}

function getWidth(clr){
	var myWidth;
	if (clr == clr_sel) {myWidth = width_sel;}
	else {myWidth = width_reg;}
	return myWidth;
}

// coners
function drawCorners(clr){
	var wid = 2; 
	drawLine([0, 0, 
		can_zgplus, 0], clr, true, true, false, wid);
	drawLine([0, 0, 
		0, can_zgplus], clr, true, true, false, wid);
}






function beforsubmit() {
	var dat = {};
	$('input.input[type="text"]').each(function(index, el) {
		// if (el.disabled) {
		// dat[el.id] = 0;			
		// }
		// else {
		dat[el.id] = Number(el.value);			
		// }
    });

	$('input[type="checkbox"]').each(function(index, el) {
		dat[el.id] = el.checked;
	});
	$('select').each(function(index, el) {
		dat[el.id] = Number(el.value);
	});
	$('.tab.sel').each(function(index, el) {
		var idn;
		switch (el.id){
		case 'cov':
			idn = 1;			
			break;
		case 'hCov':
			idn = 2;
			break;
		case 'int':
			idn = 3;
			break;
		case 'sos':
			idn = 4;
			break;
	}
		dat['ct'] = idn;
	});
		$('#hidData').val(JSON.stringify(dat));
		$('#hidSet').val(JSON.stringify(dat));	
}

function recover() {
	$('.tab').removeClass('sel');
	var ind = $('#ct').val();
	ind = ind < 1 ? 1 : ind;
	ind = ind > 4 ? 4 : ind;	
	
	var tab = $('#tabs').children().eq(ind - 1);
	tab.addClass('sel');

	if (ctx == null) {
		canvasInit();		
	}

	// $('#cancel').prop('value', $('#gds').prop('value'));

	$('.chbset').each(function(index, el) {		
		if ($(this).prop('value') == 'True') {
			$(this).prop('checked', true);
		}
		if ($(this).prop('value') == 'False') {
			$(this).prop('checked', false);
		}
	});

	tabChange(tab.attr('id'));	
	langChange($('.input#lng').val());	
}
