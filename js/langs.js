var arrLang = {
	'0' : {
		'trinC' : 'TernIn',
		'sdLWC' : 'Side Width',
		'sdLHC' : 'Side Height',
		'jntC' : 'Joint',
		'spinC' : 'Spine',
		'brdC' : 'Board Cover',
		'qtrC' : 'Spine Cover',
		'flpC' : 'Flaps',
		'gdsC' : '<span></span>Guides',
		'pwsC' : '<span></span>Page with scheme',
		'lwsC' : '<span></span>Layer with scheme',		
		'sprC' : '<span></span>Use spreads',
		'bldC' : 'Marks Offset',
		'slgC' : 'Mark Length',
		'unitesC' : 'Unites',
		'sVerC' : 'InDesign',	
		'sCovC' : 'Softcover',		
		'sCovTxtC' : 'Paperback',		
		'hCovC' : 'Casebound',		
		'hCovTxtC' : 'Classic hardcover',		
		'intgC' : 'Integral',	
		'intgTxtC' : 'Holand binding',	
		'sostC' : 'Casebound',	
		'sostTxtC' : 'With hinge cloth'		
	},

	'1' : {
		'trinC' : 'Загиб',
		'sdLWC' : 'Ширина карт. сторонки',
		'sdLHC' : 'Высота карт. сторонки',
		'jntC' : 'Расстав',
		'spinC' : 'Корешок',
		'brdC' : 'Покровный материал',
		'qtrC' : 'Материал корешка',
		'flpC' : 'Клапан',
		'gdsC' : '<span></span>Направляющие',
		'pwsC' : '<span></span>Полоса со схемой',
		'lwsC' : '<span></span>Слой со схемой',
		'sprC' : '<span></span>Разворотом',
		'bldC' : 'Отступ меток',
		'slgC' : 'Длина меток',
		'unitesC' : 'Ед. Измерения',
		'sVerC' : 'InDesign',
		'sCovC' : 'Мягкий переплет',
		'sCovTxtC' : 'Классическая обложка',
		'hCovC' : 'Твердый переплет',		
		'hCovTxtC' : 'С переплетным картоном',		
		'intgC' : 'Интегральный',	
		'intgTxtC' : 'Без переплетного картона',	
		'sostC' : 'Составной переплет',
		'sostTxtC' : 'Тканевый корешок'
	}
};

$(document).ready(function() {
	$('.input#lng').on("change", (function(){
		langChange(this.value);			
	}));	
});

function langChange(langNum) {
	$('.comments, .tab-header, .tab-txt').each(function(index, element){
		$(this).html(arrLang[langNum][$(this).attr('id')]);
	});	
}