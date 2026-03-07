/* **********************************************************************
	NAMESPACE 생성
********************************************************************** */
;(function(window){
	'use strict';

	var global = "$utils", namaSpace = "MARS.utils", nameSpaceRoot = null;

	function createNameSpace(identifier, module){
		var win = window, name = identifier.split('.'), p, i = 0;

		if(!!identifier){
			for(i=0; i< name.length; i += 1){
				if(!win[name[i]]){
					if(i === 0){
						win[name[i]] = {};
						nameSpaceRoot = win[name[i]];
					}else{
						win[name[i]] = {};
					}
				}
				win = win[name[i]];
			}
		}

		if(!!module){
			for(p in module){
				if(!win[p]){
					win[p] = module[p];
				}
			}
		}
		return win;
	}

	window[global] = createNameSpace(namaSpace,{
		nameSpace : function(identifier, module){
			return createNameSpace(identifier, module);
		}
	});

})(window);


/* **********************************************************************
	전역변수 및 언어설정
********************************************************************** */
var ui;
var slider_swiper = new Array();
var browser;
var ui_scroll;
var ui_picker;
var ui_step;
var ui_num = 0;

/* STICKY 스타일 */
if(!!window.IntersectionObserver){
	var observer = new IntersectionObserver((entries) => {
		entries.forEach(entry =>{
			var num = entry.target.getAttribute('data-scroll-bg');
			if(entry.isIntersecting) {
				entry.target.classList.add('ui-stuck');
				$(entry.target).parents('.container').attr('data-stuck',num);
			}else{
				entry.target.classList.remove('ui-stuck');
				$(entry.target).parents('.container').removeAttr('data-stuck');
			};
		});
	}, {
		rootMargin : '-90% 0% 0% 0%'
	});

	var observer2 = new IntersectionObserver((entries) => {
		entries.forEach(entry =>{
			if(entry.isIntersecting) {
				entry.target.classList.add('ui-stuck');
			}else{
				entry.target.classList.remove('ui-stuck');
			}
		});
	}, {
		rootMargin : '0% 0% -100% 0%'
	});

	var observer3 = new IntersectionObserver((entries) => {
		entries.forEach(entry =>{
			if(entry.isIntersecting) {
				entry.target.classList.add('active');
			}else{
				entry.target.classList.remove('active');
			}
		});
	}, {
		rootMargin : '-50% 0% -50% 0%'

	});
}

/* 브라우저확인 */
(function(window, $) {
	'use strict';
	browser = $.borwser;

	if (!browser) $.browser = browser = {};

	browser.ios = (/ip(ad|hone|od)/i).test(navigator.userAgent);
	browser.android = (/android/i).test(navigator.userAgent);

	$('html').addClass(browser.ios ? "ios" : browser.android ? "android" : '');

})(window, jQuery);

/* **********************************************************************
	UI COMMON
	* ui 초기화
********************************************************************** */
;(function(window, $){
	'use strict';
	ui = $utils.nameSpace('MARS.common', {
		/* ---------------------------------------------------------------------------
			IOS META
		--------------------------------------------------------------------------- */
		setIosMeta : function(){
			var _cont = $('head')[0].children.viewport.content + ', viewport-fit=cover';
			$('meta[name="viewport"]').attr("content", _cont);
		},

		/* ---------------------------------------------------------------------------
			공통기능 : BODY SCROLL EVENT
		--------------------------------------------------------------------------- */
		scrollDisable : function(pop){
			//ui_scroll = window.pageYOffset;
			if(pop.parents('.popup-wrapper[data-popmodal="true"].load').length == 1){
				pop.parents('.popup-wrapper[data-popmodal="true"].load').addClass('disable');
			}else{
				if($('[data-popmodal="true"].load').length < 2){
					ui_scroll = window.pageYOffset;
					$('body').addClass('disable').css({
						'top' : (ui_scroll * -1)+'px'
					});
				}
			}
		},

		scrollEnable : function(pop){
			if(pop.parents('.popup-wrapper[data-popmodal="true"].load').length == 0){
				if($('[data-popmodal="true"].load').length < 2){
					$('body').removeClass('disable').removeAttr('style');
					window.scrollTo(0, ui_scroll);
					//ui_scroll = 0;
				}
			}
			$('.popup-wrapper[data-popmodal="true"]').removeClass('disable');
		},
		/* ---------------------------------------------------------------------------
			폼요소 : input
		--------------------------------------------------------------------------- */
		formInput : function(){
			if($('.text').length > 0){
				$('.text').each(function(i,obj){
					var _nodeName = $(obj)[0].nodeName;
					var _input = $(obj);
					var _el_class;

					if(_nodeName == 'DIV' || _nodeName == 'DD'){
						if($(obj).find('input').length > 0) _input = $(obj).find('input');
						else _input = $(obj).find('data');
					}

					if(_input.is('[aria-invalid]')){
						if(_input.is('[aria-invalid]') == true){
							if(_input.attr('aria-invalid') == 'false') _el_class = 'valid';
							else _el_class = 'invalid';
						}
					}

					if(_input.attr('disabled') || _input.attr('readonly') || _input.attr('data-disabled')) {
						if(_input.attr('aria-invalid') == 'true') _el_class = 'invalid';
						else _el_class = 'disabled';
					}
					if(_nodeName == 'DIV' || _nodeName == 'DD') {
						if(!$(obj).hasClass('input-date1')) $(obj).removeClass('invalid disabled valid').addClass(_el_class);
					}
					if(_input.parents('.input-wrap1')){
						if(_input.parents('.input-wrap1').find('.text[aria-invalid="true"]').length > 0) _el_class = 'invalid';
						_input.parents('.input-wrap1').removeClass('invalid disabled valid').addClass(_el_class);
					}
					if(_input.parents('.input-btn1')) _input.parents('.input-btn1').removeClass('invalid disabled valid').addClass(_el_class);
					if(_input.parents('.input-date1')) {
						if(_el_class == 'invalid') _input.parents('.input-date1').removeClass('disabled').addClass(_el_class);
					}
				});
			};

			$(document).on('input','input[aria-invalid], .invalid input',function(){
				if(!$(this).hasClass('text')) $(this).parent('.text').find('[aria-invalid]').removeAttr('aria-invalid');
				else $(this).removeAttr('aria-invalid');
				ui.formInput();
			});

			$('.input-wrap1 .text input').on('keyup', function(){
				if(this.value.length == 2){
					$(this).nextAll('input').focus();
				}
			});

			if($('.selectbox').length > 0){
				$('.selectbox').each(function(i,obj){
					var _nodeName = $(obj)[0].nodeName;
					var _input = $(obj);
					var _el_class;

					if(_nodeName == 'DIV' || _nodeName == 'DD') _input = $(obj).find('data');

					if(_input.attr('aria-invalid') == 'true') _el_class = 'invalid';
					if(_input.attr('aria-invalid') == 'false') _el_class = 'valid';
					if(_input.attr('disabled') || _input.attr('readonly') || _input.attr('data-disabled')) {
						if(_input.attr('aria-invalid') == 'true') _el_class = 'invalid';
						else _el_class = 'disabled';
					}

					if(_el_class != undefined){
						if(_input.parents('.input-btn1')) _input.parents('.input-btn1').removeClass('invalid disabled valid').addClass(_el_class);
						if(_input.parents('.select-wrap')) _input.parents('.select-wrap').removeClass('invalid disabled valid').addClass(_el_class);
					}else{
						if(_input.parents('.select-wrap').hasClass('invalid')){
							_input.attr('aria-invalid','true');
						}
					}
				});
			};

			$(document).on('click','.selectbox[aria-invalid], data[aria-invalid], .invalid data + button',function(){
				if(!$(this).hasClass('selectbox')) $(this).parents('.invalid').find('[aria-invalid]').removeAttr('aria-invalid');
				else {
					if($(this).parents('.select-wrap')) $(this).parents('.select-wrap').removeClass('invalid');
					$(this).removeAttr('aria-invalid');
				}
				ui.formInput();
			});

			if($('.textarea').length > 0){
				$('.textarea').each(function(i,obj){
					var _nodeName = $(obj)[0].nodeName;
					var _input = $(obj);
					var _el_class;

					if(_nodeName == 'DIV' || _nodeName == 'DD'){
						if($(obj).find('textarea').length > 0) _input = $(obj).find('textarea');
						else _input = $(obj).find('data');
					}

					if(_input.attr('aria-invalid') == 'true') _el_class = 'invalid';
					if(_input.attr('aria-invalid') == 'false') _el_class = 'valid';
					if(_input.attr('disabled') || _input.attr('readonly') || _input.attr('data-disabled')) {
						if(_input.attr('aria-invalid') == 'true') _el_class = 'invalid';
						else _el_class = 'disabled';
					}

					if(_nodeName == 'DIV' || _nodeName == 'DD') {
						$(obj).removeClass('invalid disabled valid').addClass(_el_class);
					}

					if(_input.parents('[data-mode="write"]').length){
						_input.parents('.form').attr('tabindex','0');
						_input.on('input keyup change', function(e){
							let content = $(this).val();
							if(content.length > 0){
								$(this).parents('.form').addClass('active');
							}else{
								$(this).parents('.form').removeClass('active');
							}
						});
					}
				});
			};

			if($('[type="radio"][aria-invalid]').length > 0){
				$('[type="radio"][aria-invalid]').each(function(i,obj){
					var _input = $(obj);
					var _el_class;

					if(_input.attr('aria-invalid') == 'true') _el_class = 'invalid';
					if(_input.attr('aria-invalid') == 'false') _el_class = 'valid';
					$(obj).parents('[class*="label-"]').removeClass('invalid valid').addClass(_el_class);
				});
			};

			if($('[type="checkbox"][aria-invalid]').length > 0){
				$('[type="checkbox"][aria-invalid]').each(function(i,obj){
					var _input = $(obj);
					var _el_class;

					if(_input.attr('aria-invalid') == 'true') _el_class = 'invalid';
					if(_input.attr('aria-invalid') == 'false') _el_class = 'valid';
					$(obj).parents('[class*="label-"]').removeClass('invalid valid').addClass(_el_class);
				});
			};

			const priceToString = price => {
				return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
			}

			if($('.range').length > 0){
				$('.range').each(function(i,obj){
					var _wrap = $(obj).parents('.input-range1');
					if(_wrap.find('.range input').length > 1){
						var _leftInput =  $(obj).find('[data-range="1"]').attr('id',ui.setGetUid('uiInputRangeLeft'+i));
						var _rightInput =  $(obj).find('[data-range="2"]').attr('id',ui.setGetUid('uiInputRangeRight'+i));
						var _left_val=  _leftInput.val();
						var _right_val= _rightInput.val();
						var _left_percent = ((+_left_val - +_leftInput.attr('min'))/ (+_leftInput.attr('min') - +_leftInput.attr('max'))) * -100;
						var _right_percent = ((+_right_val - +_rightInput.attr('min'))/ (+_rightInput.attr('min') - +_rightInput.attr('max'))) * -100;

						$(obj).css({
							'--el-range-min-val':_left_percent+'%',
							'--el-range-max-val':_right_percent+'%',
						});

						if(_wrap.length > 0) {
							if(_wrap.find('.text [data-range]')[0].nodeName == 'INPUT'){
								_wrap.find('.text [data-range="1"]').val(_left_val);
								_wrap.find('.text [data-range="2"]').val(_right_val);
							}else{
								_wrap.find('.text [data-range="1"]').val(_left_val).text(_left_val);
								_wrap.find('.text [data-range="2"]').val(_right_val).text(_right_val);
							}
						}
					}else{
						var _input =  $(obj).find('[data-range="1"]').attr('id',ui.setGetUid('uiInputRangeSingle'+i));
						var _val =  _input.val();
						var _percent = ((+_val - +_input.attr('min'))/ (+_input.attr('min') - +_input.attr('max'))) * -100;
						var _txt = _wrap.find('.info data[data-range="1"]');

						$(obj).css({
							'--el-range-max-val':_percent+'%',
						});

						if(_txt.attr('data-mode') == "comma") _txt.val(_val).text(priceToString(_val));
						else _txt.val(_val).text(_val);

						if(_wrap.find('.text input[data-range]').length) {
							var _input2 = _wrap.find('.text input[data-range="1"]').attr('id',ui.setGetUid('uiInputRangeInput'+i));
							_input2.val(priceToString(_val));
						}
					}
				})
			}

			const setSingleValue = e => {
				const _this = e.target;
				const _step = $(e.target).attr('step');
				const { value, min, max } = _this;
				const _txt = $(e.target).parents('.input-range1').find('data[data-range="1"]');
				const _input = $(e.target).parents('.input-range1').find('input[data-range="1"]');

				const percent = ((+_this.value - +min) / (+max - +min)) * 100;

				$(e.target).parents('.range').css({'--el-range-max-val': percent+'%'});

				if(_txt.attr('data-mode') == "comma") _txt.val(_this.value).text(priceToString(_this.value));
				else _txt.val(_this.value).text(_this.value);

				if($(e.target).parents('.input-range1').find('.text input[data-range="1"]').length) {
					_input[0].value = priceToString(_this.value)
				};
			};

			const setLeftValue = e => {
				const _this = e.target;
				const _step = $(e.target).attr('step');
				const { value, min, max } = _this;
				const inputRight =  document.getElementById($('.range input[data-range="2"]').attr('id'));

				if (+inputRight.value - +value < _step) {
					_this.value = +inputRight.value - _step;
				}

				const percent = ((+_this.value - +min) / (+max - +min)) * 100;

				$(e.target).parents('.range').css({'--el-range-min-val': percent+'%'});

				if($(e.target).parents('.input-range1').find('.text input[data-range]').length) $(e.target).parents('.input-range1').find('input[data-range="1"]').val(_this.value);
				if($(e.target).parents('.input-range1').find('.text data[data-range]').length) $(e.target).parents('.input-range1').find('data[data-range="1"]').val(_this.value).text(_this.value);
			};

			const setRightValue = e => {
				const _this = e.target;
				const _step = $(e.target).attr('step');
				const { value, min, max } = _this;
				const inputLeft =  document.getElementById($('.range input[data-range="1"]').attr('id'));

				if (+value - +inputLeft.value < _step) {
					_this.value = +inputLeft.value + _step;
				}

				const percent = ((+_this.value - +min) / (+max - +min)) * 100;

				$(e.target).parents('.range').css({'--el-range-max-val': percent+'%'});

				if($(e.target).parents('.input-range1').find('.text input[data-range]').length) $(e.target).parents('.input-range1').find('input[data-range="2"]').val(_this.value);
				if($(e.target).parents('.input-range1').find('.text data[data-range]').length) {
					if(_this.value > 80) $(e.target).parents('.input-range1').find('data[data-range="2"]').val(_this.value).text('80+');
					else $(e.target).parents('.input-range1').find('data[data-range="2"]').val(_this.value).text(_this.value);
				}
			};

			$(document).on("input",'[id^="uiInputRangeSingle"]', setSingleValue);
			$(document).on("input",'[id^="uiInputRangeLeft"]', setLeftValue);
			$(document).on("input",'[id^="uiInputRangeRight"]', setRightValue);
		},

		/* ---------------------------------------------------------------------------
			폼요소 : 삭제버튼
		--------------------------------------------------------------------------- */
		formDelete : function(){
			if($('[data-btn="delete"]').length > 0){
				$('[data-btn="delete"]').on('click',function(e){
					var _input = $(e.target).parent().find(' > input');
					_input.val('').focus();
				})
			}
		},

		/* ---------------------------------------------------------------------------
			폼요소 : input
		--------------------------------------------------------------------------- */
		formFocus : function(){
			if($('[type="text"], [type="tel"], [type="email"], [type="search"], textarea').length > 0) {
				$(document).on('focus','[type="text"], [type="tel"], [type="email"], [type="search"], [type="password"], textarea',function(){
					$('body').addClass('blur');
					$('.btn-top').css('display','none');
				}).on('blur','[type="text"], [type="tel"], [type="email"], [type="search"], [type="password"], textarea',function(){
					$('body').removeClass('blur');
					$('.btn-top').css('display','block');
				});
			}

			$('[data-mode="write"] .form').blur(function(){
				$(this).parents('.form').addClass('focusout');
				setTimeout(function(){
					$('.area-action').removeAttr('style');
				},300)
			});
			$('[data-mode="write"] .form').focus(function(){
				$(this).parents('.form').removeClass('focusout');
				$('.area-action').css('transition','all 0.3s');
			});

			if($('[data-search="input"]').length > 0){
				$(document).on('click', '[data-search="input"]', function(){
					$(this).parents('.form-search1').addClass('active');
					$(this).on('input',function(){
						if($(this).val() != ''){
							$(this).prev('span').removeClass('none');
							$('[data-search="cont"]').removeClass('none');
						}else{
							$(this).prev('span').addClass('none');
							$('[data-search="cont"]').addClass('none');
						}
					})
				});
				$(document).on('click', '[data-search="close"]', function(){
					$(this).parents('.form-search1').removeClass('active');
					$('[data-search="cont"]').addClass('none');
				});
			}
		},

		/* ---------------------------------------------------------------------------
			폼요소 : SELECT BOX : 셋팅
		--------------------------------------------------------------------------- */
		formSelectSet : function(){
			$('.select-wrap[data-autoset="select"]').each(function(i, obj){
				var _sel_text = $(obj).find('[data-select="text"]').text();
				var _sel_value = $(obj).find('[data-select="text"]').attr('data-value');
				var _sel_name = $(obj).find('.list input[type="radio"]').attr('name');

				if(_sel_text == ''){
					$(obj).find('[data-toggle="selectbtn"]').addClass('empty');
					$(obj).find('[name="'+_sel_name+'"]').prop('checked',false);
				}else{
					$(obj).find('[data-toggle="selectbtn"]').removeClass('empty');
					if(_sel_value != 'null' && _sel_value != null) $(obj).find('[name="'+_sel_name+'"][value="'+ _sel_value +'"]').prop('checked',true);
					else $(obj).find('[name="'+_sel_name+'"][value=""]').prop('checked',true);
				}
			});
		},
		/* ---------------------------------------------------------------------------
			폼요소 : SELECT BOX
		--------------------------------------------------------------------------- */
		formSelect : function(){
			var _prev_val;

			//옵션오픈
			$(document).off('click.select1').on('click.select1', '.select-wrap[data-autoset="select"] [data-toggle="selectbtn"]', function(ev){
				var _select_wrap = $(ev.target).parents('[data-autoset="select"]');
				var _select_val = _select_wrap.find('[data-select="text"]').attr('data-value');

				_select_wrap.find('.list > div').prepend('<button type="button" data-toggle="close">닫기</button>');
				_select_wrap.addClass('active').find('[data-toggle="selectbtn"]').attr('aria-expanded',true);

				setTimeout(function(){_select_wrap.find('[value="'+_select_val+'"]').focus();},100);//옵션이 길 경우 선택된 항목 스크롤 된 상태로 보여주기 위해 추가함.

				if(_select_val != '') _prev_val = _select_val;

				ui.scrollDisable($(this));
			});

			//옵션선택
			$(document).off('click.select2').on('click.select2', '.select-wrap[data-autoset="select"] .list [data-toggle="closebtn"], .select-wrap[data-autoset="select"] .list [data-toggle="close"]', function(ev){
				var _select_wrap = $(ev.target).parents('[data-autoset="select"]');
				var _select_val = _select_wrap.find('.list input:checked').val();
				var _select_txt = _select_wrap.find('.list input:checked + span').text();
				var _select_btn = _select_wrap.find('[data-toggle="selectbtn"] [data-select="text"]');
				var _close_btn = _select_wrap.find('[data-toggle="close"]');

				if($(this).attr('data-toggle') == 'closebtn'){
					if(_select_val == '') _select_val = null;
					_select_btn.text(_select_txt).attr('data-value',_select_val);
					_select_wrap.find('[data-toggle="selectbtn"]').attr('aria-expanded',false).removeClass('empty');

					if(_select_wrap.attr('data-callback')){
						var _callback_name = _select_wrap.attr('data-callback');
						var _callback_name_arr = _callback_name.split('.');

						setTimeout(function(){
							if(_callback_name_arr.length === 1) {
								window[_callback_name](_select_wrap.find('.list input:checked'), _prev_val);
							}else if(_callback_name_arr.length === 2){
								window[_callback_name_arr[0]][_callback_name_arr[1]](_select_wrap.find('.list input:checked'), _prev_val);
							}
							ui.formSelectSet();
						},0);
					}else{
						ui.formSelectSet();
					}
				}else{
					_select_wrap.find('input[value="'+_prev_val+'"]').prop('checked',true);
					ui.formSelectSet();
				}

				_select_wrap.removeClass('active');
				_close_btn.remove();
				ui.scrollEnable(_select_wrap);
			});
		},

		/* ---------------------------------------------------------------------------
			버튼요소 : SELECTED
		--------------------------------------------------------------------------- */
		setSelection : function(){
			$(document).off('click.select3').on('click.select3','[data-btn="selection"]', function(){
				var _parent = $(this).parents('ul');

				if($(this).hasClass('selected')){
					$(this).removeClass('selected').removeAttr('title');
				}else{
					_parent.find('[data-btn="selection"].selected').removeClass('selected').removeAttr('title');
					$(this).addClass('selected').attr('title','선택됨');
				}
			});
		},

		/* ---------------------------------------------------------------------------
			날짜선택 : DATEPICKER
		--------------------------------------------------------------------------- */
		setDatePicker : function(){
			$(document).off('click.picker').on('click.picker','[data-btn="picker"]' ,function(){
				var _input = $(this).next('input');
				var _input2 = $('[data-dateform]');
				$(_input).on('change',function(){
					$(_input).val(function(i, v){
						return v.replaceAll('/','.');
					}).val();
				});
				$(_input2).on('change',function(){
					$(_input2).val(function(i, v){
						return v.replaceAll('/','.');
					}).val();
				});
				if(_input.attr('data-dateform') == 'month'){
					ui.formMonthPicker(_input);
					_input.monthpicker('show');
				}else{
					var _today = new Date();
					//if(_input.val()) _today = moment(_input.val());

					//이전 날짜 선택 불가
					if(_input.attr('data-dateform') == 'today'){
						ui.formDatePicker(_input)
						ui_picker.reloadOptions({minDate:_today});
					}

					//시작일 선택
					else if(_input.attr('data-dateform') == 'start'){
						var _end = _input.parents('.input-date1').find('[data-dateform="end"]');
						ui.formDatePicker(_input, _input, _end);
						//ui_picker.reloadOptions({minDate:_today});
					}

					//종료일 선택
					else if(_input.attr('data-dateform') == 'end'){
						var _start = _input.parents('.input-date1').find('[data-dateform="start"]');
						ui.formDatePicker(_input, _start, _input);
					}

					//시작일 선택
					else if(_input.attr('data-dateform') == 'start2'){
						var _end = _input.parents('.input-date1').find('[data-dateform="end2"]');
						//if(_end.val()) _today = moment(_end.val());
						ui.formDatePicker(_input, _input, _end);
						// ui_picker.reloadOptions({minDate:_today});
					}

					//종료일 선택
					else if(_input.attr('data-dateform') == 'end2'){
						var _start = _input.parents('.input-date1').find('[data-dateform="start2"]');
						ui.formDatePicker(_input, _start, _input);
						// ui_picker.reloadOptions({period:function(){}});
						// ui_picker.reloadOptions({maxDate:_today});
						// ui_picker.reloadOptions({maxDate:_today});
					}

					else {
						ui.formDatePicker(_input)
					}

					ui_picker.show();
				}
			});
		},
		formDatePicker : function(el,start,end){
			var _option_singleDate = false;
			var _option_field = $(start)[0];
			var _option_secondField = $(end)[0];

			if(start == null){
				_option_singleDate = true;
				_option_field = $(el)[0];
				_option_secondField = null;
			}

			var _datepicker_option = {
				field: _option_field,
				secondField: _option_secondField,
				format: 'YYYY.MM.DD',
				singleDate: _option_singleDate,
				autoApply: false,
				autoclose: false,// 자동닫기
				numberOfColumns: 1,
				numberOfMonths: 12,
				footer: true,
				hoveringTooltip: false,
				dropdowns: {
					years: {
						min: 1900,
						max: 2050,
					},
					months: true,
				},
				onClose : function(){
					$(_option_field).change();
					$(_option_secondField).change();
				},
				firstDay: 0, // 시작요일설정
				//maxDate: moment().startOf('day').add(new Date(), 'day'),
			}
			ui_picker = new Lightpick(_datepicker_option);

		},

		formMonthPicker : function(el){
			var _monthpicker_option = {
				pattern: 'yyyy.mm',
				monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
				changeYear: false,
				id : ui.setGetUid('monthpicker_')
			}
			el.monthpicker(_monthpicker_option);
		},

		/* ---------------------------------------------------------------------------
			형제요소 선택 : jQuery siblings();
		--------------------------------------------------------------------------- */
		siblings : function(ele){
			const children= ele.parentElement.children;
			const tempArr = [];

			for (var i=0; i < children.length; i++){
				tempArr.push(children[i]);
			};

			return tempArr.filter(function(e){
				return e != ele;
			});
		},

		/* ---------------------------------------------------------------------------
			형제요소 클래스명 삭제 : jQuery siblings().removeClass();
		--------------------------------------------------------------------------- */
		siblingsRemove : function(ele, ele_class){
			for (var i=0; i < ele.length; i++){
				ele[i].classList.remove(ele_class);
			};
		},

		/* ---------------------------------------------------------------------------
			형제요소 속성 변경 : jQuery siblings().attr();
		--------------------------------------------------------------------------- */
		siblingsAttr : function(ele, ele_attr, ele_value){
			for (var i=0; i < ele.length; i++){
				ele[i].setAttribute(ele_attr, ele_value);
			};
		},

		/* ---------------------------------------------------------------------------
			페이지로드 : 페이지 유형 설정
		--------------------------------------------------------------------------- */
		setPage : function(){
			if($('.container[data-page]').length) {
				$('.container[data-page]').each(function(i, obj){
					var _page = $(obj).attr('data-page');
					$(obj).parents('main, article').removeClass('').addClass('page'+_page);
				});
				ui.setScrollTab();
			}

			if($('.container > .area-nav').length){
				$('.container').each(function(i, obj){
					$(obj).parents('main, article').find('.header').addClass('t1');
				});
			}
			ui.setBotState();
		},

		/* ---------------------------------------------------------------------------
			페이지로드 : 상단으로 버튼 설정
		--------------------------------------------------------------------------- */
		setTop : function(){
			var _win;

			//버튼셋팅
			if($('.container > .btn-top').length == 0) {
				var _btn = '<button type="button" class="btn-top">상단으로이동</button>';
				$('.container').each(function(i, obj){
					$(obj).append(_btn);
				});
			}

			if($('.container > .btn-top').length) {
				//스크롤이벤트
				$(window).scroll(function(){
					setBtnShow(this, '#wrapper, .popup-wrapper')
				});

				//풀팝업스크롤
				$('.popup-wrapper[data-popmodal="true"].load').scroll(function(){
					setBtnShow(this, '.popup-wrapper[data-popmodal="true"].load')
				});
			}

			//클릭이벤트
			$(document).off('click.top').on('click.top','.btn-top',function(){
				if($(this).parents('.popup-wrapper[data-popmodal="true"].load').length) _win = $(this).parents('.popup-wrapper[data-popmodal="true"].load');
				else  _win = $(window);
				_win.scrollTop(0);
			});

			function setBtnShow(a,b){
				var _top = $(a).scrollTop();
				var _btn = $(b).find('.btn-top');

				if(_top > 0) _btn.addClass('show');
				else _btn.removeClass('show');
			}

			//페이지 스크롤 멈춤 이벤트 (버튼 숨김처리)
			$.fn.scrollStopped = function(callback) {
				var that = this, $this = $(that);
				$this.scroll(function(ev) {
				  clearTimeout($this.data('scrollTimeout'));
				  $this.data('scrollTimeout', setTimeout(callback.bind(that), 2000, ev));
				});
			};
			   
			$(window).scrollStopped(function(ev){
				$('.btn-top').removeClass('show');
			});
		},

		/* ---------------------------------------------------------------------------
			툴팁 : 툴팁설정
		--------------------------------------------------------------------------- */
		setAutoTooltip : function(){
			if($('[data-btn="tooltip"]').length > 0) {
				$('[data-btn="tooltip"]').each(function(i, obj){
					if($(obj)[0].nodeName == 'A') var _id = $(obj).attr('href');
					else{
						var _id = ui.setGetUid('uiTOOLTIPCON'+i);
						$(obj).attr('aria-controls',_id);
						if($(obj).next('[data-popmodal="true"]').length > 0) $(obj).next('[data-popmodal="true"]').attr('id',_id);
						else $(obj).parents('label').next('[data-popmodal="true"]').attr('id',_id);
						_id = '#'+_id;
					}
					if(_id != "#none" && _id != "#" && _id != "" && _id != undefined){
						var _tooltip = $plugin.popmodal(_id,{
							scroll_doc : false,
							callback_before : function(e){
								var _top = $(e.pop_ev).offset().top;
								var _left = $(e.pop_ev).offset().left;
								var _wid = $(e.pop_ev).width();
								var _win = $(window).width() / 2;
								var _align = '';

								if($(e.pop).parents('.popup-wrapper').length){
									if($('body').hasClass('disable')){
										_top = _top - ($('body').css('top').replace('px','')*-1);
									}
								}

								if($(obj)[0].nodeName == 'BUTTON') _top = $(e.pop_ev).height();

								if(_win < _left) _align = 'right'
								else  _align = 'left'

								if(e.pop_ev.offsetParent == $('header.header')[0]){
									$(e.pop).attr('data-fixed','top')
								}
								$(e.pop_ev).addClass('tooltip-open');
								$(e.pop).css({'top':_top, '--el-left' : _left, '--el-size' : _wid}).attr('data-align',_align);
								return true;
							},
							callback_load : function(e){
								$(document).on('touchstart','[data-btn="pop-close"]',function(){
									_tooltip.outputClose();
								});
							},
							callback_after : function(e){
								$(e.pop_open).removeClass('tooltip-open');
								$(e.pop).removeAttr('style data-align');
							}
						});
					}
				});
			};
		},
		/* ---------------------------------------------------------------------------
			탭 : 탭설정
		--------------------------------------------------------------------------- */
		setAutoTab : function(){
			$plugin.togglecon('[data-autoset="tab"]',{
				toggle_type : 'tab',
				selector : '[data-autoset="tab"] > ul > li',
				selector_btn : '> a',
				selector_con : '#href',
			});

			$plugin.togglecon('.area-btn4[data-autoset="tab"]',{
				toggle_type : 'tab',
				selector : '.area-btn4[data-autoset="tab"]',
				selector_btn : 'a',
				selector_con : '#href',
				callback_load : function(e){
					var _wrap = e.this_wrapper[0];
					$(_wrap).find('> a').removeClass('active');
					$(e.this_btn).addClass('active');
				}
			});

			if($('[data-scroll]').length){
				$('[data-scroll]').each(function(i,obj){
					ui.setTabMove($(obj), '.active');
				});
			}

			//단일선택
			if($('.area-btn4:not(.t1) > button.btn-t1').length){
				$(document).on('click','.area-btn4:not(.t1) > button.btn-t1.c2',function(){
					var _btn_wrap = $(this).parents('.area-btn4');
					$(this).addClass('active').siblings().removeClass('active')
					ui.setTabMove(_btn_wrap, '.active');
				});
			}

			if($('[data-scroll="form"]')){
				$('[data-scroll="form"]').each(function(i,obj){
					$(obj).find('input:checked').parent('label').addClass('active');
					ui.setTabMove($(obj), '.active');

					$(document).on('change, focus','[data-scroll="form"] input',function(e){
						var _parentsAll = $(this).parents('[data-scroll="form"]').find('> label');
						var _parents = $(this).parents('label');
						_parentsAll.removeClass('active');
						_parents.addClass('active');
						ui.setTabMove($(obj), '.active');
					});
				});
			}
		},

		/* ---------------------------------------------------------------------------
			토글 : 기본 펼침 설정 : 리스트갯수에 따름
		--------------------------------------------------------------------------- */
		setToggleView : function(el, list){
			var _el_wrap = $(el).find('> section, > ul > li, > dl');

			_el_wrap.each(function(i, obj){
				var _el_list =  $(obj).find(list).length;
				var _el_btn = $(obj).find('[data-toggle="btn"]');
				if(_el_list < 5){
					if(!$(obj).hasClass('active')) _el_btn.trigger('click');
				}
			});
		},

		/* ---------------------------------------------------------------------------
			토글 : 토글설정
		--------------------------------------------------------------------------- */
		setAutoToggle : function(){
			$plugin.togglecon('.select-toggle1[data-autoset="select"]',{
				selector_group : false,
				selector_btn : '.basic [data-toggle="selectbtn"]',
				selector_con : '.list',
				selector_close : '.list button[data-option]',
				callback_load : function(a){
					if($(a.this_con).find('.list button[aria-selected]').length == 0){
						console.log('dd')
					}
					$(document).off('click.select').on('click.select', '[data-autoset="select"] .list button[data-option]', function(){
						$(this).parent().find('button').removeAttr('aria-selected');
						$(this).attr('aria-selected', true);
						$(this).parents('[data-autoset="select"]').find('button[data-value]')
							.attr('data-value', $(this).data('option'))
							.text( $(this).text())
					});
				}
			});

			$plugin.togglecon('[data-autoset="toggle"] > dl',{
				selector_group : false
			});

			$plugin.togglecon('[data-autoset="toggle"] > ul > li',{
				selector_group : false
			});

			$plugin.togglecon('[data-autoset="toggle"] > fieldset',{
				selector_group : false
			});

			$plugin.togglecon('[data-autoset="toggle"] > section',{
				selector_group : false
			});

			$plugin.togglecon('.tbl-toggle[data-autoset="toggle"]',{
				selector_group : false
			});

			$plugin.togglecon('.data2[data-autoset="toggle"]',{
				selector_group : false
			});

			//스탭
			ui_step = $plugin.togglecon('.info-step1[data-autoset="toggle"]',{
				selector_group : false,
				callback_load : function(ev){
					if($(ev.this_con).parents('.wrap-step1:not([data-scroll-tab])').length) ui.scrollDisable(ev.this_btn);
				},
				callback_after : function(ev){
					if($(ev.this_con).parents('.wrap-step1:not([data-scroll-tab])').length) ui.scrollEnable(ev.this_btn);
				}
			});

			$plugin.togglecon('.info-data1 dl[data-autoset="toggle"]',{
				selector_group : false
			});

			$plugin.togglecon('.info-con2 > dl > dd[data-autoset="toggle"]',{
				selector_group : false
			});
			$plugin.togglecon('.info-con2 > ul > li[data-autoset="toggle"]',{
				selector_group : false
			});

			$plugin.togglecon('.info-con2 > ul > li[data-autoset="toggle"]',{
				selector_group : false
			});

			$plugin.togglecon('.btn-util5[data-autoset="toggle"]',{
				selector_group : false
			});

			$plugin.togglecon('.board-list2 .area1[data-autoset="toggle"]',{
				selector_group : false
			});

			$plugin.togglecon('[data-autoset="menu"] > dl > dd',{
				selector_group : false
			});

			var _nav_sub = $plugin.togglecon('.area-nav[data-autoset="toggle"]',{
				selector_group : false,
				callback_load : function(e){
					ui.scrollDisable(e.this_btn);
					$('body').removeClass('off');
					$(document).on('click','#wrapper .header, #wrapper .container > *:not(.area-nav), #wrapper .footer',function(){
						_nav_sub.outputClose();
					});
				},
				callback_after : function(e){
					ui.scrollEnable(e.this_btn);
				}
			});

			/* 인풋 */
			$(document).on('input','input[data-autoset="form"]', function(ev){
				if($(this).val() != '') $('[data-id="' + $(this).attr('data-tabcon') + '"]').removeClass('active');
				else $('[data-id="' + $(this).attr('data-tabcon') + '"]').addClass('active');
			});

			/*  셀렉트 토글 */
			$(document).off('change.select').on('change.select', 'select[data-autoset="form"]', function(ev){
				var _el_option = $(ev.target).find('option');
				var _el_wrapper = $(ev.target).parent('[data-autoset="form"]').eq(0);

				_el_option.each(function(){
					if($(this).is(':selected')){
						$('[data-id="' + $(this).attr('data-tabcon') + '"]').addClass('active');
					}else{
						$('[data-id="' + $(this).attr('data-tabcon') + '"]').removeClass('active');
					}
				});
			});

			/*  체크박스 */
			$('.label-check1.box2[data-autoset="form"] .area > label > input').each(function(i, obj){
				var _el_parent = $(obj).parents('label');
				if($(obj).prop('checked')){
					_el_parent.next('.ui-tabcon').addClass('active');
				}
			});

			$(document).off('change.checkbox').on('change.checkbox', '[data-autoset="form"] input[type="checkbox"]', function(ev){
				var _el_wrapper = $(ev.target).parent('[data-autoset="form"]').eq(0);
				if($(this).attr('data-tabcon')){
					if($(this).prop('checked')){
						$('[data-id="' + $(this).attr('data-tabcon') + '"]').addClass('active');
					}else{
						$('[data-id="' + $(this).attr('data-tabcon') + '"]').removeClass('active');
					}
				}else{
					var _el_parent = $(this).parents('label');
					if($(this).prop('checked')){
						_el_parent.next('.ui-tabcon').addClass('active');
					}else{
						_el_parent.next('.ui-tabcon').removeClass('active');
					}
				}
			});

			$(document).off('change.checkbox2').on('change.checkbox2', '[data-btn="display"] input[type="checkbox"]', function(ev){
				var _el_wrapper = $(this).parents('[data-btn="display"]').next('[data-display="list"]');
				if($(this).prop('checked')){//요약보기
					_el_wrapper.addClass('view');
				}else{
					_el_wrapper.removeClass('view');
				}
			})

			/*  라디오버튼 */
			$(document).off('change.radio').on('change.radio', '[data-autoset="form"] input[type="radio"]', function(ev){
				var _el_radio = $('input[type="radio"][name="'+ $(ev.target).attr('name') +'"]');

				_el_radio.each(function(){
					if($(this).attr('data-tabcon') == $(ev.target).attr('data-tabcon')){
						$('[data-id="' + $(this).attr('data-tabcon') + '"]').addClass('active');
					}else{
						$('[data-id="' + $(this).attr('data-tabcon') + '"]').removeClass('active');
					}
				});
				ui.setScrollTab();
			});
		},

		/* ---------------------------------------------------------------------------
			탭 : 가로스크롤형 탭 활성화탭이동
		--------------------------------------------------------------------------- */
		setTabMove : function(ele, ele_select){
			var _this_list;
			var _this_list_wrap;
			var _this_el;

			if(ele.find('>ul>li').length){
				_this_list_wrap = ele.find('ul')
				_this_list = _this_list_wrap.find('>li');
				_this_el = _this_list_wrap.find('>li'+ele_select);
			}else if(ele.find('ol>li').length){
				_this_list_wrap = ele.find('>ol')
				_this_list = _this_list_wrap.find('>li');
				_this_el = _this_list_wrap.find('>li'+ele_select);
			}else if(ele.find('>button').length){
				_this_list_wrap = ele;
				_this_list = _this_list_wrap.find('>button');
				_this_el = _this_list_wrap.find('>button'+ele_select);
			}else if(ele.find('>a').length){
				_this_list_wrap = ele;
				_this_list = _this_list_wrap.find('>a');
				_this_el = _this_list_wrap.find('>a'+ele_select);
			}else if(ele.find('>label').length){
				_this_list_wrap = ele;
				_this_list = _this_list_wrap.find('>label');
				_this_el = _this_list_wrap.find('>label'+ele_select);
			}

			var _select_index = _this_list.index(_this_el);
			var _move_left=0;

			for(var i=0;i<_select_index;i++){
				_move_left += _this_list.eq(i).outerWidth();
			}

			_this_list_wrap.animate({scrollLeft : _move_left},0);
		},

		/* ---------------------------------------------------------------------------
			스크롤 : 스크롤 탭 제어
		--------------------------------------------------------------------------- */
		setScrollTab : function(){
			if($('[data-scroll-tab]').length){
				var scroll_nav = '[data-scroll-tab]:visible';
				var scroll_section = $('[data-scroll-con]:visible');
				var scroll_value, scroll_timer, scroll_timer3, scroll_nav_top,scroll_end, scroll_mode=false;
				var scroll_target;

				/* 탭 스크립트 호출 */
				$(document).off('click.scrollTab').on('click.scrollTab','[data-scroll-tab]:visible a', function(e){
					e.preventDefault();
					clearTimeout(scroll_timer);
					scroll_mode = true;

					//위치이동
					var move_target = $($(e.target).attr('href'));

					//스크롤 기준점 : 팝업
					if($(e.target).parents('.popup-wrapper[data-popmodal]').length){
						scroll_target = $(e.target).parents('.popup-wrapper[data-popmodal]');
						var move_top = move_target.offset().top + scroll_target.scrollTop();
						scroll_nav_top = $(e.target).parents(scroll_nav).outerHeight() + 88;

					}else{
						scroll_target = $('html, body');
						var move_top = move_target.offset().top;
						scroll_nav_top = $(e.target).parents(scroll_nav).outerHeight() + 88;
						if($(e.target).parents('#wrapper').length){
							$('body').addClass('off');
							if($(e.target).parents().hasClass('info-step1') || $(e.target).parents().hasClass('package-details')){
								scroll_nav_top = $(e.target).parents(scroll_nav).outerHeight();
							}
							if($(e.target).parents('#wrapper').find('.wrap-step1[data-sticky]:not([data-scroll-tab])').length){
								scroll_nav_top = ($(e.target).parents(scroll_nav).outerHeight() + 100)
							}
						}
					}

					//스크롤 예외페이지
					if($(e.target).parents('article[data-sticky-double]').length){
						$('body').removeClass('off');
						scroll_nav_top = $(e.target).parents(scroll_nav).outerHeight() + 136;
					}

					move_top -= scroll_nav_top;

					scroll_target.animate({scrollTop : move_top}, 0, function(){
						scroll_mode = false;
					});

					//현재탭 클래스 셋팅
					if($(e.target).parents('[data-scroll-tab]').hasClass('info-step1') || $(e.target).parents('[data-scroll-tab]').hasClass('wrap-step1')){
						$(e.target).parent('li').attr('aria-current','step').siblings().removeAttr('aria-current');
						ui_step.outputClose();
					}else{
						if($(e.target).parents().hasClass('package-details')){
							$(e.target).parent('li').addClass('active').siblings().removeClass('active');
						}else{
							$(e.target).addClass('active').siblings().removeClass('active');
						}
						ui.setTabMove($(scroll_nav), '.active');
					};
				});

				/* 스크롤 발생시 활성화탭 설정 */
				$(window).off('scroll.scrollTab').on('scroll.scrollTab', function(ev){
					if(scroll_timer) clearTimeout(scroll_timer);
					var el = $(ev.target);
					scroll_timer = setTimeout(setPageSection((el), 10));
				});

				$('.popup-wrapper[data-popmodal]').off('scroll.scrollTab').on('scroll.scrollTab', function(ev){
					if(scroll_timer) clearTimeout(scroll_timer);
					var el = $(ev.target);
					scroll_timer = setTimeout(setPageSection((el), 10));
				});

				setPageSection($(window));
			};

			function setPageSection(ev){
				scroll_value = $(ev).scrollTop();
				scroll_section.each(function(index, element){
					var scroll_base = scroll_value + $(scroll_nav).outerHeight() + 88;

					if($(ev).hasClass('popup-wrapper')){
						var scroll_top = $(element).offset().top + scroll_value - ($(window).height() /3);
						scroll_end = $(ev).find('article');
					}else{
						var scroll_top = $(element).offset().top - ($(window).height() /3);
						scroll_end = $(ev).find('#wrapper');
					}

					if(scroll_base >= scroll_top){
						if(!scroll_mode){
							var scroll_btn = $('[href="#' + $(element).attr('id') + '"]');
							var scroll_par = scroll_btn.parents(scroll_nav);

							if(scroll_par.hasClass('info-step1') || scroll_par.hasClass('wrap-step1')){
								scroll_btn = scroll_btn.parents('li');
								scroll_btn.attr('aria-current','step').siblings().removeAttr('aria-current');
							}else{
								if(scroll_par.parent().hasClass('package-details')){
									scroll_btn = scroll_btn.parents('li');
									if(scroll_value < 88) $('body').removeClass('off');
								}
								scroll_btn.addClass('active').siblings().removeClass('active');
								ui.setTabMove($(scroll_nav), '.active');
							}
						}
					}
				});

			}
		},

		/* ---------------------------------------------------------------------------
			스크롤 : 하단영역 BG 제어
		--------------------------------------------------------------------------- */
		setScrollBg : function(){
			if($('[data-scroll-bg]').length){
				var num = $('[data-scroll-bg]').length;
				for(var i = 0; i < num; i++ ){
					var obj  = $('[data-scroll-bg]').eq((num - 1)-i);
					if(obj.attr('id')) var _id = obj.attr('id');
					else _id = ui.setGetUid("uiScrollBg"+i);
					obj.attr('id', _id);
					ui.uiCallFixed(_id);
				};
			};
		},

		/* ---------------------------------------------------------------------------
			스크롤 : 보장분석 목록 스크롤
		--------------------------------------------------------------------------- */
		setScrollVertical : function(){
			if($('[data-slider-vertical="true"]').length){
				var _this = $('[data-slider-vertical="true"]');
				var _isScroll;
				$(window).unbind('scroll').scroll(function(){
					clearTimeout(_isScroll);
					if($(window).scrollTop()+($(window).height()/2) < _this.offset().top){
						$(' > ul > li',_this).removeClass('active');
					}else{
						_isScroll = setTimeout(function(){
							clearTimeout(_isScroll);
							$(' > ul > li' ,_this).each(function(i){
								if($(window).scrollTop() + $(window).height() - ($(window).height()/2)   >= Math.ceil($(this).offset().top )){
									$(this).addClass('active').siblings().removeClass('active');
								}
							});
							// if($('.form-search1').offset().top + 88 >= $('> ul > li.active',_this).offset().top){
							// 	$('html,body').stop().animate({
							// 		scrollTop : $('> ul > li.active',_this).offset().top - ($('.form-search1').outerHeight() + parseInt($('.form-search1').css('top'))+100)
							// 	});
							// };

						},200);
					}
				}).trigger('scroll');
			};
		},

		/* ---------------------------------------------------------------------------
			스크롤 : 하단영역 BG 제어
		--------------------------------------------------------------------------- */
		setScrollStuck : function(){
			if($('[data-scroll-stuck]').length){
				if($('[data-scroll-stuck]').attr('data-scroll-stuck') == 'top'){
					$('[data-scroll-stuck="top"]').each(function(i, obj){
						if($(obj).attr('id')) var _id = $(obj).attr('id');
						else _id = ui.setGetUid("uiScrollVertical"+i);
						$(obj).attr('id', _id);
						ui.uiCallFixed2(_id);
					});
				}else{
					$(window).on('scroll',function(){
						if($(this).scrollTop() > 0){
							$('[data-scroll-stuck]').addClass('ui-stuck');
						}else{
							$('[data-scroll-stuck]').removeClass('ui-stuck');
						}
					});
				}
			};
		},

		/* ---------------------------------------------------------------------------
			스크롤 : 고정영역 제어
		--------------------------------------------------------------------------- */
		setScrollTouch : function(){
			var _startY = 0, _endY = 0;

			$(document).on('touchstart','#wrapper',function(event){
				_startY = event.originalEvent.changedTouches[0].screenY;
			});

			$(document).on('touchend','#wrapper', function(event){
				_endY = event.originalEvent.changedTouches[0].screenY;
				if(!$('body').hasClass('disable')){
					//위로
					if(_startY - _endY > 28){
						if($(window).scrollTop() + $(window).height() < ($('#wrapper').outerHeight() - 1)) {
							$('body').addClass('off');
						}
					}

					//아래로
					else if(_endY - _startY > 28){
						$('body').removeClass('off show');
					}
				}
			});

			$(window).scroll(function(ev){
				if($(window).scrollTop() + $(window).height() > $('#wrapper').outerHeight() - 56) $('body').addClass('show');
			});
		},

		/* ---------------------------------------------------------------------------
			레이어 : ALERT
		--------------------------------------------------------------------------- */
		alert : function(mes, callback, type){
			var popidnum = ui.setGetUid("uiAlert");
			var popTitle = '알림';
			var popClass = 'pop-mes1';

			if(type == 'error') {
				popTitle = '오류';
				popClass = 'pop-mes2 t1';
			}

			var html_popup = '';
			html_popup += '<div id="'+ popidnum +'" class="'+ popClass +'" role="alertdialog" data-popmodal="true">';
			html_popup +='	<dl>';
			html_popup +='		<dt>'+ popTitle +'</dt>';
			html_popup +='		<dd>' + mes + '</dd>';
			html_popup +='		<dd class="area-action"><button type="button" class="btn-action c1" data-btn="pop-close">확인</button></dd>';
			html_popup +='	</dl>';
			html_popup += '</div>';

			document.body.insertAdjacentHTML('beforeend',html_popup);

			$plugin.popmodal('#'+popidnum,{
				modal_ajax : true,
				load_display : true,
				callback_after : function(){
					if(typeof callback != 'undefined' && callback){
						if(typeof callback == 'function'){
							callback();
						}else{
							if(callback){
								eval(callback);
							}
						}
					}
				}
			});
		},

		/* ---------------------------------------------------------------------------
			레이어 : CONFIRM
		--------------------------------------------------------------------------- */
		confirm : function(mes, callback1, callback2, btn1, btn2, tit){
			var popidnum = ui.setGetUid("uiConfirm");
			var _class = 't1';

			if(btn1 == undefined) btn1 = '취소';
			if(btn2 == undefined) btn2 = '확인';
			if(tit == undefined){
				tit = '알림';
				_class = '';
			}

			var html_popup = '';
			html_popup += '<div id="'+ popidnum +'" class="pop-mes1 '+ _class +'" role="alertdialog" data-popmodal="true">';
			html_popup +='	<dl>';
			html_popup +='		<dt>' + tit + '</dt>';
			html_popup +='		<dd>' + mes + '</dd>';
			html_popup +='		<dd class="area-action"><button type="button" class="btn-action" data-btn="pop-close">'+ btn1 +'</button><button type="button" class="btn-action c1" data-btn="pop-close">'+ btn2 +'</button></dd>';
			html_popup +='	</dl>';
			html_popup += '</div>';

			document.body.insertAdjacentHTML('beforeend',html_popup);

			$plugin.popmodal('#'+popidnum,{
				modal_ajax : true,
				load_display : true,
				callback_after : function(ev){
					if(ev.pop_close.classList[1] == 'c1'){ //확인
						if(typeof callback1 != 'undefined' && callback1){
							if(typeof callback1 == 'function'){
								callback1();
							}else{
								if(callback1){
									eval(callback1);
								}
							}
						}
					}else{ //취소
						if(typeof callback2 != 'undefined' && callback2){
							if(typeof callback2 == 'function'){
								callback2();
							}else{
								if(callback2){
									eval(callback2);
								}
							}
						}
					}
				}
			});
		},

		/* ---------------------------------------------------------------------------
			레이어 : TOAST
		--------------------------------------------------------------------------- */
		toast : function(mes, callback){
			var num = ui_num++;
			var popidnum = ui.setGetUid("uiToast" + num);
			var html_popup_cont = '';
			html_popup_cont +='	<dl id="'+ popidnum +'">';
			html_popup_cont +='		<dt>알림</dt>';
			html_popup_cont +='		<dd>' + mes +'</dd>';
			html_popup_cont +='	</dl>';

			var html_popup =  '<div class="pop-mes3 load" role="alert" data-popmodal="true">'+ html_popup_cont +'</div>';

			if($('.pop-mes3').length == 0) $('body').append(html_popup);
			else $('.pop-mes3').append(html_popup_cont);

			$plugin.popmodal('#'+popidnum,{
				modal_ajax : true,
				load_display : true,
				auto_focus : false,
				scroll_doc : false,
				callback_load : function(){
					var _add = '';
					if($('.popup-wrapper:visible').length > 0){
						if($('.popup-wrapper:visible').find('.area-action[data-sticky]:not(.none), .area-action[data-fixed]:not(.none)').length > 0){
							_add = 't1';
						}
					}else{
						if($('#wrapper:visible').find('.area-action[data-sticky]:not(.none), .area-action[data-fixed]:not(.none), .footer').length > 0){
							_add = 't1';
						}
					}

					$('.pop-mes3').addClass(_add);

					if($('.pop-mes3').find('dl').length > 1){
						$('#'+popidnum).siblings().remove();
					}

					setTimeout(function(){
						$('#'+popidnum).trigger("outputClose2");
					},3000);
				},
				callback_after : function(){
					if($('.pop-mes3').find('dl').length < 1) {
						$('.pop-mes3').remove();
					}
					if(typeof callback != 'undefined' && callback){
						if(typeof callback == 'function'){
							callback();
						}else{
							if(callback){
								eval(callback);
							};
						};
					};
				}
			});

		},

		/* ---------------------------------------------------------------------------
			스크롤 : STICKY 상태 제어용 스크립트 직접호출
		--------------------------------------------------------------------------- */
		uiCallFixed : function(_idvalue){
			if(!!window.IntersectionObserver){
				observer.observe(document.querySelector('#'+_idvalue));
			}
		},
		uiCallFixed2 : function(_idvalue){
			if(!!window.IntersectionObserver){
				observer2.observe(document.querySelector('#'+_idvalue));
			}
		},

		/* ---------------------------------------------------------------------------
			슬라이드 : 기본셋팅 및 호출
		--------------------------------------------------------------------------- */
		setSlider : function(){
			if($('[data-slider]').length) {
				$('[data-slider]').each(function(idx){
					if(!$(this).attr('id')){
						$(this).attr('id',ui.setGetUid("uiSlider"+idx));
					}
					var slider_id = $(this).attr('id');
					ui.sliderMove(slider_id);
				});
			}
		},

		/* ---------------------------------------------------------------------------
			슬라이드 : 기본셋팅 및 호출
		--------------------------------------------------------------------------- */
		sliderMove : function(slider_id){
			var slider_title = $('#' + slider_id).attr('data-slider-title');

			//기본옵션
			var _slider_option = {
				slidesPerView : '1',
				spaceBetween: 0,
				centeredSlides: false,
				slideClass : 'slide',
				slideActiveClass : 'active',
				wrapperClass : 'slide-area',
				autoHeight : false,
				navigation : {
					nextEl: '.ui-next',
					prevEl: '.ui-prev',
				},
				//loop: true,
			}

			//마크업변경 : 기본구조
			var slider_class = 'wrap-slider-' + $('#'+slider_id).attr('data-slider');
			var slider_selector = slider_id + 'Area';

			$('#'+slider_id).find('>*:not(.none)').addClass('slide');
			$('#'+slider_id).addClass('slide-area').attr('data-slider-load', true);
			if(!$('#'+slider_id).parent('div').hasClass(slider_class)) $('#'+slider_id).wrap('<div id="'+ slider_selector +'" class="'+ slider_class +'"></div>');

			//옵션변경 : Navigation
			if($('#'+slider_id).attr('data-navigation')){
				$('#'+slider_id).after($('<div class="pagination-nav"></div>'))
				$('#'+slider_id).siblings('.pagination-nav')
					.append($('<button type="button">').addClass('ui-prev').text('이전'))
					.append($('<button type="button">').addClass('ui-next').text('다음'));
			}

			//옵션변경 : Pagination
			if($('#'+slider_id).attr('data-pagination')){
				var slider_type;

				if($('#'+slider_id).attr('data-pagination') == 'bullet') slider_type = 'bullets';
				if($('#'+slider_id).attr('data-pagination') == 'fraction') slider_type = 'fraction';
				if($('#'+slider_id).attr('data-pagination') == 'progressbar') slider_type = 'progressbar';

				$('#'+slider_id).after($('<div class="pagination-'+ slider_type +'"></div>'));

				_slider_option['pagination'] = {
					el : '.pagination-'+ slider_type,
					bulletActiveClass : 'active',
					bulletClass : 'bullet',
					clickable : true,
					clickableClass : 'clickable',
					currentClass : 'current',
					totalClass : 'total',
					progressbarFillClass :'fill',
					type : slider_type,
					renderBullet:function(index,className){
						return '<button type="button" class="' + className + '">' + slider_title + (index + 1) + '</button>'
					},
					renderFraction:function(currentClass, totalClass){
						return '<span class="' + currentClass + '"></span>' + '<span class="' + totalClass + '"></span>';
					}
				}
			}

			//옵션변경 : Autoplay
			if($('#'+slider_id).attr('data-autoplay')){
				var _btn_area = $('<div class="pagination-ctrl"></div>');
				_btn_area
					.append($('<button type="button">').addClass('ui-start').text(slider_title + '자동재생시작'))
					.append($('<button type="button">').addClass('ui-stop').text(slider_title + '자동재생종료'));

				$('#'+slider_id).before(_btn_area);
				$('#'+slider_selector).attr('data-auto-state', true);

				$(document).on('click', '#' + slider_selector + ' .ui-start', function(){
					slider_swiper[slider_id].autoplay.start();
					$('#'+slider_selector).attr('data-auto-state', false);
					$('#'+slider_selector+' .ui-stop').focus();
				});

				$(document).on('click', '#' + slider_selector + ' .ui-stop', function(){
					slider_swiper[slider_id].autoplay.stop();
					$('#'+slider_selector).attr('data-auto-state', true);
					$('#'+slider_selector+' .ui-start').focus();
				});
				_slider_option['autoplay'] = {
					delay: 3000,
					disableOnInteraction: true,
				}
				_slider_option['loop'] = true;
			}

			//옵션변경 : SlidesPerView
			if($('#'+slider_id).attr('data-slides-view')){
				_slider_option['slidesPerView'] = 'auto',
				_slider_option['spaceBetween'] = 8
				//_slider_option['centeredSlides'] = true
			}

			if($('#'+slider_id).attr('data-effect') === 'fade'){
				$('#'+slider_selector).attr('data-auto-state', false);
				_slider_option['speed'] = 0,
				_slider_option['effect'] = 'fade',
				_slider_option['fadeEffect'] = {
					crossFade: true
				},
				_slider_option['autoplay'] = {
					delay: 7000,
					disableOnInteraction: false,
				},
				_slider_option['autoplayDisableOnInteraction'] = false,
				_slider_option['observer'] = true,
				_slider_option['observeparents'] = true,
				_slider_option['on'] = {
					slideChange : function(){
						this.autoplay.paused = false
					},
				};
			};

			if($('#'+slider_id).attr('data-auto-height') == 'true'){
				_slider_option['autoHeight'] = true;
			};


			//옵션추가 : 상단 텍스트 추가
			if($('#'+slider_id).attr('data-slider') === 'list3'){
				var viewNameTxt = '<div class="paging-name">';
				$('#'+slider_id).find('.slide').each(function(idx){
					viewNameTxt += '<span>'+$(this).attr('title')+'</span>';
				});
				viewNameTxt += '</div>'
				$('#'+slider_id).after(viewNameTxt);
				$('#'+slider_id).next('.paging-name').find('span:first').addClass('current');
				_slider_option['on'] = {
					slideChangeTransitionEnd : function(swiper){
						$('#'+slider_id).next('.paging-name').find('span').eq(this.activeIndex).addClass('current').siblings('span').removeClass('current');
					}
				};
			};
			//CASE  : 주제어
			if($('#'+slider_id).attr('data-slider') === 'list4'){
				_slider_option['watchSlidesProgress'] = true;
				_slider_option['direction'] = 'vertical';
				_slider_option['loop'] = true;
				_slider_option['allowTouchMove'] = false;
				_slider_option['slidesPerView'] = $('#'+slider_id).attr('data-view') ? $('#'+slider_id).attr('data-view') : 4;
				_slider_option['autoplay'] = {
					delay: $('#'+slider_id).attr('data-delay') ? $('#'+slider_id).attr('data-delay') : 2500
				};
			};
			if($('#'+slider_id).attr('data-slider') === 'list5'){
				_slider_option['loop'] = true;
				_slider_option['slidesPerView'] = "auto";
        		_slider_option['centeredSlides'] = true;
			};

			//슬라이드 선언
			slider_swiper[slider_id] = new Swiper('#'+slider_selector, _slider_option);

			//옵션추가 : 토스트팝업 출력
			if($('#'+slider_id).attr('data-slider-toast') === 'true'){
				slider_swiper[slider_id].on('slideResetTransitionStart',function(){
					if(this.activeIndex === 0){
						ui.toast('이전 페이지가 없습니다.');
					}else if(this.activeIndex === $('#'+slider_id).find('.slide').length-1){
						ui.toast('다음 페이지가 없습니다.');
					}
				});
			};

			//옵션추가 : 콜백함수 추가 : 체인지
			if($('#'+slider_id).attr('data-callback')){
				var _callback_name = $('#'+slider_id).attr('data-callback');
				var _callback_name_arr = _callback_name.split('.');
				slider_swiper[slider_id].on('slideChange',function(){
					if(_callback_name_arr.length === 1) {
						window[_callback_name](slider_swiper[slider_id]);
					}else if(_callback_name_arr.length === 2){
						window[_callback_name_arr[0]][_callback_name_arr[1]](slider_swiper[slider_id]);
					};
				});
			};

			//옵션추가 : 콜백함수 추가 : 로드
			if($('#'+slider_id).attr('data-callback-load')){
				var _callback_name = $('#'+slider_id).attr('data-callback-load');
				var _callback_name_arr = _callback_name.split('.');
				if(_callback_name_arr.length === 1) {
					window[_callback_name](slider_swiper[slider_id]);
				}else if(_callback_name_arr.length === 2){
					window[_callback_name_arr[0]][_callback_name_arr[1]](slider_swiper[slider_id]);
				};
			};
		},

		/* ---------------------------------------------------------------------------
			기타 : 전체메뉴
		--------------------------------------------------------------------------- */
		setNavi : function(){
			if($('#asideTotalMenu').length > 0){
				$plugin.popmodal('#asideTotalMenu');
				$(document).off('click.nav').on('click.nav','.btn-util5 a', function(ev){
					var _id = $(this).attr('href');
					var _parent = $(this).parents('.btn-util5');
					var _pos_top = $(_id).position().top;
					var _sticky_top = parseInt($(_id).find('dt').css('top'));
					var _scr_top = $('#asideTotalMenu').scrollTop();
					$('.btn-util5 a').removeClass('active');
					$(this).addClass('active');
					if(_parent.hasClass('active')) _parent.find('[data-toggle="btn"]').trigger('click');
					if(_id == '#uiFooterMenu') _sticky_top = 0;
					$('#asideTotalMenu').animate({scrollTop : ((_scr_top + _pos_top) - _sticky_top)});
					ui.setTabMove(_parent.find('[data-toggle="content"]'), '.active');
					return false;
				});
			}
			
			var scrollFnc;
			var depth2Section = $('[id*="uiMenu"]');
			var menuListChildren = $('.btn-util5 a');
			var depth2Heights = [];

			$('#asideTotalMenu').scroll(function(e){
				clearTimeout(scrollFnc);
				scrollFnc = setTimeout(function(){
					scrollFinish();
				},100);
			})
			
			function setSize() {
				depth2Heights = [];
				setTimeout(function(){
					depth2Section.each(function(){
						depth2Heights.push($(this).height());
					})
				},100)
				window.onresize = function(){
					setTimeout(function(){
						depth2Section.each(function(){
							depth2Heights.push($(this).height());
						})
					},100)
				}
			}
			function activeMenu(index){
				var targetTrigger = menuListChildren.eq(index);
				targetTrigger.addClass('active').siblings().removeClass('active');
				ui.setTabMove($('.btn-util5').find('[data-toggle="content"]'), '.active');
			}
			function scrollFinish() {
				var t = $('#asideTotalMenu').scrollTop();
				var h = 130;
				var index = 0;
				for(var i = 0; i< depth2Section.length; i ++){
					h += depth2Heights[i];
					if(t < h){
						index = i;
						break;
					}
				}
				activeMenu(index);
			}
			setSize();
			const divSize = document.querySelectorAll('.menu dl');
			const observer = new ResizeObserver(entries => {
			for (let entry of entries) {
				const {height} = entry.contentRect;
				setSize();
			}
			});
			divSize.forEach(divSize => {
				observer.observe(divSize);
			});
		},

		/* ---------------------------------------------------------------------------
			기타 : 버튼 유무 확인
		--------------------------------------------------------------------------- */
		setBotState : function(){
			setTimeout(function(){
				if($('.area-action[data-sticky], .area-action[data-fixed]').length > 0){
					var _el = $('.area-action[data-sticky], .area-action[data-fixed]');
					_el.parents('#wrapper, .popup-wrapper').addClass('is-button');
				}
				if($('.footer').length > 0 ){
					var _el = $('.footer');
					_el.parents('#wrapper').addClass('is-footer');
				}
				if($('.area-info3[data-sticky]').length > 0 ){
					var _el = $('.area-info3[data-sticky]');
					_el.parents('#wrapper, .popup-wrapper').addClass('is-sticky-info3');
				}
			},100);
		},

		/* ---------------------------------------------------------------------------
			기타 : 동적 INDEX ID 생성
		--------------------------------------------------------------------------- */
		setGetUid : function(namevalue){
			return  namevalue + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds()
		},

		/* ---------------------------------------------------------------------------
			기타 : 토글 스위치
		--------------------------------------------------------------------------- */
		toggleSwitch : function(){
			if($('[data-role="switchToggle"]').length>0){
				$('[data-role="switchToggle"]').each(function(){
					var _this = $(this);
					toggleChk($('> div.label-toggle1 input[type="checkbox"], > div.label-toggle1 input[type="radio"]' ,_this))
					$(' > div.label-toggle1 input[type="checkbox"], > div.label-toggle1 input[type="radio"]' ,_this).change(function(){
						toggleChk($(this));
					});

					function toggleChk(el){
						if(el.prop('checked') && el.parent('label').index() === 0){
							_this.addClass('active');
						}else{
							_this.removeClass('active');
						}
					}
				});
			}
		},

		/* ---------------------------------------------------------------------------
			기타 : HTML INCLUDE : 오픈 전 삭제 예정 :테스트용
		--------------------------------------------------------------------------- */
		setInclude : function(){
			if($('[data-include]').length > 0){
				var _url = $('[data-include]').data('include');
				$('[data-include]').load(_url+' #uiInclude',function(){
					var _html = $('#uiInclude').html();
					$('[data-include]').remove();
					$('.container').append(_html);
				});
			}
		},

		/* ---------------------------------------------------------------------------
			기타 : 카운팅 애니메이션
		--------------------------------------------------------------------------- */
		setCounter : function(){
			if($('.area-progress1').length > 0){
				$('.area-progress1').each(function(j, obj){
					var _val = $(obj).find(' > span > em').text();
					var _num = _val.length;
					var _html = '';

					$(obj).addClass('active');

					if(_num > 0){
						for(var j=0; j < _num; j++){
							_html += '<i data-num="'+ _val[j] +'">'+_val[j]+'</i>';
						}
						$(obj).find(' > span > em').html(_html);
					}
				});
			}
		},

		/* ---------------------------------------------------------------------------
			기타 : Lottie 애니메이션
		--------------------------------------------------------------------------- */
		setLottie : function(){
			//모의고사
			if($('.mockexam-history1').length){
				var _html = '<div class="lottie" data-lottie="decoration" data-lottie-path="../../../resource/img/cnd/img_decoration.json"></div>';
				$('.mockexam-history1').prepend(_html);
			}

			//축하포인트
			if($('.mes-headline1.lottie').length){
				$('.mes-headline1.lottie').each(function(i, obj){
					var _name = $(obj).find('.lottie').data('lottie');
					if(_name == 'wallet') $(obj).find('.lottie').attr('data-lottie-path','../../resource/img/plr/act/img_wallet.json')
					else if(_name == 'money') $(obj).find('.lottie').attr('data-lottie-path','../../resource/img/plr/act/img_point_event.json')
				});
			}

			//퀘스트
			if($('.quest-banner').length){
				$('.quest-banner .slider-t1 > li').each(function(i, obj){
					var _name = '';
					var _path = '';

					if($(obj).find(' > strong').hasClass('ico_02')){
						_name = 'community01';
						_path = '../../resource/img/plr/act/ico_login.json';
					}else if($(obj).find(' > strong').hasClass('ico_01')){
						_name = 'community02';
						_path = '../../resource/img/plr/act/ico_quiz.json';
					}else if($(obj).find(' > strong').hasClass('ico_03')){
						_name = 'community03';
						_path = '../../resource/img/plr/act/ico_class.json';
					}else if($(obj).find(' > strong').hasClass('ico_10')){
						_name = 'community04';
						_path = '../../resource/img/plr/act/ico_analysis.json';
					}else if($(obj).find(' > strong').hasClass('ico_07')){
						_name = 'community05';
						_path = '../../resource/img/plr/act/ico_subscription_design.json';
					}

					var _html = '<div class="lottie" data-lottie="'+_name+'" data-lottie-path="'+_path+'"></div>';
					$(obj).prepend(_html);
				})
			}

			if($('[data-lottie]').length){
				$('[data-lottie]').each(function(i,obj){
					var _name = $(obj).data('lottie');
					var _path = $(obj).data('lottie-path');
					lottie.loadAnimation({
						container: $('[data-lottie="'+_name+'"]')[0],
						renderer: 'svg',
						loop: true,
						autoplay: true,
						path: _path
					});
				});
			}
		},

		/* ---------------------------------------------------------------------------
			기타 : 마스킹처리
		--------------------------------------------------------------------------- */
		setMasking : function(){
			if($('[data-masking="true"]').length){
				$('[data-masking="true"]').each(function(i, obj){
					var strName = $(obj).text().split('');
					var num = strName.length;
					var txt = '';
					for(var j = 0; j < num; j++){
						txt += strName[j].replace('*','<span class="txt-masking">*</span>')
					}
					$(obj).html(txt);
				});
			}
		},

		/* ---------------------------------------------------------------------------
			init reload : 동적생성 컨텐츠중 재호출이 필요한 함수
		--------------------------------------------------------------------------- */
		initReload : function(){
			ui.setTop();
			ui.setBotState();
			ui.setMasking();
			ui.formFocus();
			ui.formInput();
			ui.formDelete();
			ui.formSelect();
			ui.formSelectSet();
			ui.setAutoToggle();
			ui.setDatePicker();
			ui.setSlider();
			ui.setScrollBg();
			ui.setScrollVertical();
			ui.setAutoTooltip();
			ui.setScrollStuck();
			ui.setScrollTab();
			ui.setCounter();
			ui.setLottie();
		},
		/* ---------------------------------------------------------------------------
			init : onload
		--------------------------------------------------------------------------- */
		init : function(){
			ui.setIosMeta();
			ui.setPage();
			ui.setTop();
			ui.setBotState();
			ui.setMasking();
			ui.formFocus();
			ui.formInput();
			ui.formDelete();
			ui.formSelectSet();
			ui.formSelect();
			ui.setAutoTab();
			ui.setAutoToggle();
			ui.setScrollTab();
			ui.setSlider();
			ui.setNavi();
			ui.toggleSwitch();
			ui.setDatePicker();
			//ui.setScrollTouch();
			ui.setScrollBg();
			ui.setScrollVertical();
			ui.setScrollStuck();
			ui.setAutoTooltip();
			ui.setSelection();
			ui.setInclude();
			ui.setCounter();
			ui.setLottie();
		}
	});
	$(document).ready(ui.init);
})(window, jQuery);

/* **********************************************************************
	UI COMMON PLUGIN :  popmodal
	* 레이어팝업
********************************************************************** */
;(function(window){
	'use strict';
	var short = "$plugin";
	window[short] = window['$utils'].nameSpace('MARS.plugins',{
		popmodal : function(element,options){
			var methods = {},
				pluginName = 'publish.popmodal',
				el = document.querySelector(element),
				el_idValue = el.getAttribute("id"),
				length = el.length,
				defaults = {
					modal_ajax : false,
					class_open : 'load',
					selector_close : '[data-btn="pop-close"]',
					selector_return : null,
					aria_flag : true,
					load_display : false,
					auto_focus : false,
					auto_focus_el : true,
					auto_focus_target : false,
					scroll_doc : true,
					callback_before : null,
					callback_load : null,
					callback_after : null
				};
			if(length < 1) return;

			/* ---------------------------------------------------------------------------
				init : 초기화
			--------------------------------------------------------------------------- */
			methods.init = function(){
				methods.initVars();
				methods.initEvent();
			};

			/* ---------------------------------------------------------------------------
				initVars : 변수선언
			--------------------------------------------------------------------------- */
			methods.initVars = function(){
				el.options = Object.assign({}, defaults, options);
				el.vars = {
					id : pluginName + "-" + new Date().getTime(),
					pop : null,
					pop_ev : null,
					pop_open : null,
					pop_close : null,
					modal : null,
					active : false,
					ajax_flag : null
				};
			};

			/* ---------------------------------------------------------------------------
				initEvent : 이벤트 선언
			--------------------------------------------------------------------------- */
			methods.initEvent = function(){
				//팝업객체선언
				el.vars.pop = document.querySelector('#' + el_idValue);
				el.vars.pop.setAttribute('aria-hidden', true);

				if(el.vars.pop.classList[0] == 'pop-mes2' && el.vars.pop.classList[1] =='t1'){
					el.options.auto_focus_el = false;
				}

				//접근성
				if(el.options.aria_flag){
					if(!el.vars.pop.getAttribute('aria-label')){
						switch (el.vars.pop.getAttribute('role')){
							case 'alert' :
								break;
							case 'alertdialog' :
								el.vars.pop.setAttribute('aria-label', el.vars.pop.querySelector('dl > dt').outerText);
								break;
							default :
								if(el.vars.pop.querySelectorAll('h1').length) var dialog_title = el.vars.pop.querySelector('h1').outerText;
								else var dialog_title = el.vars.pop.querySelector('dl > dt').outerText + ' 안내';

								el.vars.pop.setAttribute('role','dialog')
								el.vars.pop.setAttribute('aria-label', dialog_title);
						}
					}
				}

				//팝업호출버튼
				el.vars.pop_open = document.querySelectorAll('button[aria-controls="'+el_idValue+'"], [role="button"][aria-controls="'+el_idValue+'"], a[href="#'+el_idValue+'"]');
				el.vars.pop_open.forEach(function(element){
					element.setAttribute('aria-haspopup', 'dialog');
					element.addEventListener('click',function(e){
						e.preventDefault();
						el.vars.pop_ev = this;

						if(!methods.display()){
							if(typeof el.options.callback_before === 'function'){
								if(!el.options.callback_before.call(el, el.vars)) return;
							};
							methods.pop();
						}
					});
				});

				if(el.options.load_display){
					if(typeof el.options.callback_before === 'function'){
						if(!el.options.callback_before.call(el, el.vars)){
							if(el.options.modal_ajax) methods.popRemove();
							return;
						}
					};
					methods.popCall();
				}
			};

			/* ---------------------------------------------------------------------------
				pop : 팝업호출
			--------------------------------------------------------------------------- */
			methods.pop = function(){
				//동적마크업추가 레이어체크
				if(el.options.modal_ajax && el.outputOpenCheck()){
					methods.popRemove();
				}

				//팝업오픈
				methods.popShow();
			};

			/* ---------------------------------------------------------------------------
				popCall : 팝업호출 콜함수
			--------------------------------------------------------------------------- */
			methods.popCall = function(){
				el.vars.pop = el;
				if(el.options.selector_return) el.vars.pop_ev = el.options.selector_return;
				methods.pop();
			};

			/* ---------------------------------------------------------------------------
				popShow : 팝업 오픈
			--------------------------------------------------------------------------- */
			methods.popShow = function(){
				//팝업오픈상태 설정
				el.vars.active = true;

				//오픈클래스 설정
				el.vars.pop.classList.add(el.options.class_open);
				el.vars.pop.setAttribute('aria-hidden', false);

				//닫기버튼 설정
				if(!!el.options.selector_close){
					el.vars.pop_close = el.vars.pop.querySelectorAll(el.options.selector_close)
					el.vars.pop_close.forEach(btn => {
						btn.addEventListener('click', function(e){
							e.preventDefault();
							if(methods.display()){
								el.vars.pop_close = this;
								methods.close();
							}
						})
					})
				};

				//풀팝업일 경우 탑버튼 재호출
				if(el.vars.pop.classList.contains('popup-wrapper')){
					ui.setTop();
					ui.setBotState();
				}

				//레이어오픈시 포커스 설정
				if(el.options.auto_focus) {
					if(el.options.auto_focus_el){
						if(el.options.auto_focus_target){
							el.vars.pop.querySelector(el.options.auto_focus_target).setAttribute('tabIndex', 0);
							el.vars.pop.querySelector(el.options.auto_focus_target).focus();
						}else{
							el.vars.pop_close[0].focus();
						};
					}else{
						el.vars.pop.children[0].setAttribute('tabIndex', 0);
						el.vars.pop.children[0].focus();
					};
				};

				//콜백함수
				if(typeof el.options.callback_load === 'function'){
					el.options.callback_load.call(el, el.vars);
				};

				//바닥스크롤방지
				if(el.options.scroll_doc){
					ui.scrollDisable($(el.vars.pop_ev));
				}
			};

			/* ---------------------------------------------------------------------------
				popHide : 팝업닫기
			--------------------------------------------------------------------------- */
			methods.popHide = function(){
				//팝업오픈상태 초기화
				el.vars.active = false;

				//오픈클래스 초기화
				el.vars.pop.classList.remove(el.options.class_open);
				el.vars.pop.setAttribute('aria-hidden', true);

				//동적레이어일경우 레이어삭제
				if(el.vars.ajax_flag) methods.popRemove();

				//포커스이동 초기화
				if(el.options.auto_focus){
					if(el.options.auto_focus_el){
					}else{
						el.vars.pop.children[0].removeAttribute('tabIndex');
					};
				}

				//바닥페이지 포커스 객체
				if(el.options.auto_focus) {
					if(el.options.auto_focus_el){
						if(el.options.auto_focus_target){
							if(!!el.vars.pop_ev) el.vars.pop_ev.focus();
						}
					}
				};

				if(el.options.load_display) methods.popRemove();

				//바닥스크롤방지
				if(el.options.scroll_doc){
					ui.scrollEnable($(el.vars.pop_ev));
				}

				el.vars.pop_ev = null;
				el.vars.ajax_flag = null;
			};

			/* ---------------------------------------------------------------------------
				popRemove : 팝업삭제
			--------------------------------------------------------------------------- */
			methods.popRemove = function(){
				el.vars.pop.remove();
			};

			/* ---------------------------------------------------------------------------
				display : 팝업상태확인
			--------------------------------------------------------------------------- */
			methods.display = function(){
				return el.vars.active;
			};

			/* ---------------------------------------------------------------------------
				close : 팝업닫기호출
			--------------------------------------------------------------------------- */
			methods.close = function(){
				methods.popHide();

				if(typeof el.options.callback_after === 'function'){
					el.options.callback_after.call(el, el.vars);
				}
			};

			/* ---------------------------------------------------------------------------
				외부호출 : 팝업오픈상태체크
			--------------------------------------------------------------------------- */
			el.outputOpenCheck = function(){
				return methods.display();
			};

			/* ---------------------------------------------------------------------------
				외부호출 : 열기
			--------------------------------------------------------------------------- */
			el.outputOpen = function(etarget){
				if(etarget) el.vars.pop_ev = etarget;
				methods.popCall();
			};

			/* ---------------------------------------------------------------------------
				외부호출 : 닫기
			--------------------------------------------------------------------------- */
			el.outputClose = function(){
				methods.popHide();
			};

			el.outputClose2 = function(){
				el.vars.pop_ev = null;
				methods.close();
				//methods.popHide();
			};

			methods.init();
			return el;
		}
	});
})(window);

/* **********************************************************************
	UI COMMON PLUGIN : togglecon
	* 토글형컨텐츠 : 탭, 아코디언 등
********************************************************************** */
;(function(window, $){
	'use strict';
	var short = '$plugin';
	window[short] = window['$utils'].nameSpace('MARS.plugins',{
		togglecon : function(element,options){
			var methods = {},
				pluginName = 'publish.popmodal',
				el = $(element),
				length = el.length,
				defaults = {
					toggle_type : 'toggle',
					aria_flag : true,
					selector : element,
					selector_group : true,
					selector_btn : '[data-toggle="btn"]',
					selector_con : '[data-toggle="content"]',
					selector_subcon : false,
					selector_close : false,
					event_flag : false,
					doc_event : false,
					class_active : 'active',
					auto_scroll : false,
					auto_scrolltab : false,
					callback_before: null,
					callback_load : null,
					callback_after: null
				}
			/* ---------------------------------------------------------------------------
				init : 초기화
			--------------------------------------------------------------------------- */
			methods.init = function(){
				methods.initVars();
				methods.initEvent();
			};

			/* ---------------------------------------------------------------------------
				initVars : 변수선언
			--------------------------------------------------------------------------- */
			methods.initVars = function(){
				el.options = Object.assign({}, defaults, options);
				el.vars = {
					this_group : null,
					this_wrapper : null,
					this_btn : null,
					this_con : null,
					this_close : null
				};
			};

			/* ---------------------------------------------------------------------------
				initEvent : 이벤트 선언
			--------------------------------------------------------------------------- */
			methods.initEvent = function(){
				//토글객체설정
				el.vars.this_wrapper = el;

				//콜백함수(before)
				if (typeof el.options.callback_before === 'function'){
					el.options.callback_before.call(el,el.vars);
				};

				$(document).off('click.togglecon2', el.options.selector+' '+el.options.selector_btn).on('click.togglecon2', el.options.selector+' '+el.options.selector_btn, function(e){
					el.vars.this_wrapper = $(e.target).parents(el.options.selector);

					if(!el.options.event_flag) e.preventDefault();

					el.vars.this_btn = $(this);

					if(el.options.selector_con=="#href"){
						el.vars.this_con = $($(this).attr("href"));
					}else{
						el.vars.this_con = $(this).parents(el.options.selector);
					}

					if (!el.vars.this_con.hasClass(el.options.class_active) || el.options.toggle_type=="tab") {
						methods.conShow();
					} else {
						methods.conHide();
					}
				});

				//콜백함수
				if (typeof el.options.callback_before === 'function'){
					el.options.callback_before.call(el,el.vars);
				};

				//접근성개선
				if(el.options.aria_flag){
					if(el.options.toggle_type=='tab'){
						if($(element).find('>ul').length) $(element).find('>ul').attr('role','tablist');
						else $(element).attr('role','tablist');
					}

					$(el.options.selector + ' ' + el.options.selector_btn).each(function(){
						var $el_element = $(this).parents(el.options.selector);
						var $el_element_btn = $(this), _href;

						if(el.options.toggle_type=='tab'){
							$el_element_btn.attr('role','tab');
							_href = $(this).attr('href');

							if($el_element.hasClass(el.options.class_active)){
								$el_element_btn.attr('aria-selected',true);
								if(!_href.match(/(\/|.+\..+)/)){
									$($(this).attr('href'))
										.attr('role','tabpanel')
										.attr('aria-expanded',true);
								}
							}else{
								$el_element_btn.attr('aria-selected',false);
								if(!_href.match(/(\/|.+\..+)/)){
									$($(this).attr('href'))
										.attr('role','tabpanel')
										.attr('aria-expanded',false);
								}
							}
						}

						if(el.options.toggle_type=='toggle'){
							if($el_element.hasClass(el.options.class_active)){
								$el_element_btn.attr('aria-expanded',true);
							}else{
								$el_element_btn.attr('aria-expanded',false);
							}
						}
					});
				}
			};

			/* ---------------------------------------------------------------------------
				togglecon.conShow : 열기
			--------------------------------------------------------------------------- */
			methods.conShow = function(){
				//그룹형
				if(el.options.selector_group){
					if(el.options.toggle_type=='tab') el.vars.this_con.siblings('.ui-tabcon').removeClass(el.options.class_active);
					else el.vars.this_con.siblings().removeClass(el.options.class_active);

					var el_group = $(el.options.selector+' '+el.options.selector_btn);
					if(el.options.toggle_type =="toggle" && !el.options.selector_siblings){
						el_group = el.vars.this_con.siblings();
					}

					if(el.options.toggle_type =="tab"){
						el.vars.this_btn.parents(el.options.selector).siblings()
							.removeClass(el.options.class_active)
							.find(el.options.selector_btn).attr('aria-expanded',false);
					}

					el_group.each(function(){
						if(el.options.toggle_type =="toggle"){
							$(this).parents(el.options.selector).removeClass(el.options.class_active);
						}
					});
				}

				//오픈클래스 적용
				el.vars.this_con.addClass(el.options.class_active);
				if(el.options.aria_flag){
					if(el.options.toggle_type =="tab"){
						el.vars.this_btn.parents(el.options.selector).addClass(el.options.class_active);
						el.vars.this_btn.attr('aria-selected',true);
						if(el.options.selector_con=="#href") $(el.vars.this_btn.attr('href')).attr('aria-expanded',true);
					}

					if(el.options.toggle_type =="toggle"){
						el.vars.this_btn.attr('aria-expanded',true);
					}
				}

				//콜백함수
				if (typeof el.options.callback_load === 'function'){
					el.options.callback_load.call(el,el.vars);
				};

				//컨텐츠 내부 닫기기능
				if (!!el.options.selector_close && el.options.toggle_type !="tab"){
					$(document).off('click.togglecon', el.options.selector +' '+ el.options.selector_close).on('click.togglecon', el.options.selector +' '+ el.options.selector_close, function(e){
						el.vars.this_wrapper = $(e.target).parents(el.options.selector);
						el.vars.this_con = $(e.target).parents(el.options.selector);
						el.vars.this_btn = $(e.target).parents(el.options.selector).find(el.options.selector_btn);
						methods.conHide();
						el.vars.this_btn.focus();
					});
				}

				//외부영역 클릭시 닫기
				if(el.options.doc_event){
					$(document).on('click.togglecon', function(e){
						if(!$(e.target).closest(el.vars.this_btn).length) {
							methods.conHide();
						}
					});
				}

				if(el.options.auto_scrolltab){
					ui.setTabMove($(el.vars.this_btn.parents(element)), '.active');
				}
			};

			/* ---------------------------------------------------------------------------
				togglecon.conHide : 닫기
			--------------------------------------------------------------------------- */
			methods.conHide = function(){
				$(el.vars.this_con).removeClass(el.options.class_active);

				if (typeof el.options.callback_after === 'function'){
					el.options.callback_after.call(el,el.vars);
				}

				if(el.options.toggle_type =="toggle"){
					el.vars.this_btn.attr('aria-expanded',false);
				}
			};

			/* ---------------------------------------------------------------------------
				외부호출  : 닫기
			--------------------------------------------------------------------------- */
			el.outputClose = function(){
				if(el.options.toggle_type=="toggle"){
					el.vars.this_btn = $(el.options.selector+' '+el.options.selector_btn);
					el.vars.this_con = $(el.options.selector);
					methods.conHide();
				}
			};

			/* ---------------------------------------------------------------------------
				외부호출 : 열기
			--------------------------------------------------------------------------- */
			el.outputOpen = function(ev, etarget){
				if(el.options.toggle_type=="toggle"){
					el.vars.this_btn = $(el.options.selector+' '+el.options.selector_btn);
					el.vars.this_con = $(el.options.selector);
					methods.conShow();
				}
			};

			methods.init();
			return el;
		}
	});
})(window, jQuery);

/* **********************************************************************
	UI COMMON PLUGIN : 스크롤 멈춤 이벤트
********************************************************************** */
$.fn.scrollStopped = function(callback) {
	var that = this, $this = $(that);
	$this.scroll(function(ev) {
		clearTimeout($this.data('scrollTimeout'));
		$this.data('scrollTimeout', setTimeout(callback.bind(that), 1000, ev));
	});
};