/* **********************************************************************
	GUIDE PUBLISH
	*  퍼블리싱 샘플용
********************************************************************** */
;(function(window, $){
	'use strict';
	const publish  = {
		table : document.querySelectorAll('.guide-tbl[data-sort="true"]'),
		/* -----------------------------------------------------------
			작업목록 통계
		------------------------------------------------------------ */
		tableDataProcess : function(){
			//기본설정
			var total_files = document.querySelectorAll('.guide-tbl[data-sort="true"] .row').length,
			end_files = document.querySelectorAll('.guide-tbl[data-sort="true"] .row[data-state*="end"]').length,
			ing_files = document.querySelectorAll('.guide-tbl[data-sort="true"] .row[data-state*="ing"]').length,
			wait_files = document.querySelectorAll('.guide-tbl[data-sort="true"] .row[data-state*="wait"]').length,
			check_files = document.querySelectorAll('.guide-tbl[data-sort="true"] .row[data-state*="check"]').length,
			del_files = document.querySelectorAll('.guide-tbl[data-sort="true"] .row[data-state*="del"]').length,
			none_files = total_files - (end_files + ing_files + wait_files + check_files + del_files),
			html_percent = (end_files / (total_files - del_files)) * 100;
			
			//통계출력
			if(document.getElementsByClassName('guide-process').length == 1){
				document.querySelectorAll('[data-process="total"]')[0].innerHTML = total_files;
				document.querySelectorAll('[data-process="end"]')[0].innerHTML = end_files;
				document.querySelectorAll('[data-process="none"]')[0].innerHTML = none_files;
				document.querySelectorAll('[data-process="wait"]')[0].innerHTML = wait_files;
				document.querySelectorAll('[data-process="ing"]')[0].innerHTML = ing_files;
				document.querySelectorAll('[data-process="check"]')[0].innerHTML = check_files;
				document.querySelectorAll('[data-process="percent"]')[0].innerHTML = html_percent.toFixed(1)+"%";
			}
		},

		/* -----------------------------------------------------------
			수정사항 레이어 셋팅
		------------------------------------------------------------ */
		tableDataModify : function(){
			var td_modify = publish.table;
			for(var i = 0; i < td_modify.length; i++ ){
				var items = td_modify[i].querySelectorAll('[data-state*="modify"]');
				if(items.length > 0){
					
					items.forEach(function(element){
						var modify_date =  element.querySelector('[data-label="수정일"] .guide-tbl2 > tbody > tr:last-child > td:first-child').innerHTML;
						var modify_btn_html = '<a href="javascript:void(0);" data-btn="history">'+ modify_date +'</a>';
						element.querySelector('[data-label="수정일"]').insertAdjacentHTML('afterbegin', modify_btn_html);

						var modify_btn = element.querySelector('a[data-btn="history"]');
						modify_btn.addEventListener('click',function(e){
							e.preventDefault();
						
							var btn_event = this;
							var html_con = btn_event.parentElement.children[1].innerHTML;
							var popIdNum = new Date().getTime();
						
							var popup = '';
							popup += '<div id="uiPOPModify'+popIdNum+'" class="pop-mes2" data-popmodal="true">';
							popup += '	<dl>';
							popup += '		<dt>수정내역<button type="button" data-btn="pop-close">수정내역닫기</button></dt>';
							popup += '		<dd><table class="guide-tbl2"></table></dd>';
							popup += '	</dl>';
							popup += '</div>';
						
							document.getElementsByTagName('body')[0].insertAdjacentHTML('beforeend',popup);
						
							$plugin.popmodal('#uiPOPModify'+popIdNum,{
								modal_ajax : true,
								load_display : true,
								selector_return : btn_event,
								callback_before : function(el){
									el.pop.querySelector('.guide-tbl2').innerHTML = html_con;
									return true;
								}
							});
						
						})
					});
				}
			}
		},

		/* -----------------------------------------------------------
			탭 스크롤
		------------------------------------------------------------ */
		tabScroll : function(){
			var _el = document.querySelectorAll('.guide-wrap > header > nav > ul > li.active > ul');
			if(_el.length > 0) {
				var _ui = _el[0].parentElement;
				ui.setTabMove(_ui, 'active');
			}
		},

		/* -----------------------------------------------------------
			토글 컨텐츠
		------------------------------------------------------------ */
		setAutoToggle : function(){
			$plugin.togglecon('.guide-section[data-autoset="toggle"]',{
				selector_group : false
			});
		},

		/* -----------------------------------------------------------
			진행상태
		------------------------------------------------------------ */
		setState : function(){
			$(document).off('click.state').on('click.state','.guide-util > button', function(){
				var _val = $(this).attr('data-value');
				var _toggle_btn = $('[data-state*="'+_val+'"]').parents('[data-autoset="toggle"]:not(.active)').find('[data-toggle="btn"]');
				
				$('.guide-section[data-autoset="toggle"].active').each(function(i, obj){
					if($(obj).find('[data-state*="'+_val+'"]').length == 0) $(obj).find('[data-toggle="btn"]').trigger('click');
				});

				_toggle_btn.trigger('click');
				
				if(_val != 'total'){
					$('.guide-tbl, .guide-tit2').removeClass('none');
					$('.guide-tbl').each(function(i,obj){
						if($(obj).find('[data-state*="'+_val+'"]').length == 0) {
							if($(obj).prev('.guide-tit2').length == 1) $(obj).prev('.guide-tit2').addClass('none')
							$(obj).addClass('none');
						}
					});
					$('.guide-tbl > .row').addClass('none')
					$('.guide-tbl > .row[data-state*="'+_val+'"]').removeClass('none');
				}else{
					$('.guide-tbl > .row, .guide-tit2, .guide-tbl').removeClass('none');
					$('.guide-section[data-autoset="toggle"] [aria-expanded="false"]').trigger('click');
				}

				$('.guide-util > button').removeClass('active');
				$(this).addClass('active');
			});
		},

		/* -----------------------------------------------------------
			init : onload
		------------------------------------------------------------ */
		init : function() {
			publish.tabScroll();
			publish.tableDataProcess();
			publish.tableDataModify();
			publish.setAutoToggle();
			publish.setState();
			hljs.initHighlightingOnLoad();
		}
	}
	publish.init();
})(window, jQuery);