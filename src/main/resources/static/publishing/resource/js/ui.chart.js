/* *********************************************************************************
    롯데손해보험 MARS
    CHART SCRIPT
********************************************************************************* */
var convertNumber = /[^\.\-|^0(0)+|^0-9\.]/g;
var progressbarChart = function(){
	$(".multiple-chart .item").each(function(){
		var progressbarrate = $(this).find(".percent").text().replace(convertNumber, '')
		$(this).find("p").animate({width:(progressbarrate)+"%"}, 1000)
		if(progressbarrate >= 100){
			$(this).find("p").css({background:"#f0f"})
		}
		else if(progressbarrate <= $(this).siblings(".chart_cutline").text().replace(convertNumber, '')){
			$(this).find("p").css({background:"#ff0"})
		}
	})
	$(".chart_cutline").each(function(){
		$(this).css({left:($(this).text().replace(convertNumber, ''))+"%"})
	})
}

var percentageChart = function(){
	$(".percentage-chart").each(function(){
		var $this = $(this);
		var minValue = $this.find(".value-min").text();
		var maxValue = $this.find(".value-max").text();
		var inputValue = $this.find(".value-current").text();
		var minData = minValue.replace(convertNumber, '');
		var maxData = maxValue.replace(convertNumber, '');
		var inputData = inputValue.replace(convertNumber, '');
		$this.find(".graphbar p").animate({width:(100/(maxData-minData))*(inputData-minData)+"%"}, 1000);
		$this.find(".total").prepend("<strong>"+maxData+"</strong>");
		$this.filter(".deco-circle").find(".graphbar").append("<em class='circle'></em>");
		$this.find(".circle").animate({left:(100/(maxData-minData))*(inputData-minData)+"%"}, 1000);

		$this.filter(".deco-wall").append("<em class='wall'></em>");
		$this.find(".wall").css({width:(100/(maxData-minData))*(inputData-minData)+"%"}, 1000);

		$this.filter(".deco-tooltip").prepend("<p class='tooltip'></p>");
		$this.find(".tooltip").text(inputValue).animate({left:(100/(maxData-minData))*(inputData-minData)+"%"}, 1000);
		var tooltipLength = $this.find(".tooltip").text().length;
		var tooltipWidth = (tooltipLength*10);
		$this.find(".tooltip").css({marginLeft:-((tooltipWidth+10)/2)+"px"});

		$this.find(".legend-current strong").prepend(inputData);
		$this.find(".legend-residuum strong").prepend(maxData-inputData);
	})
}

Highcharts.setOptions({
	lang: {
		thousandsSep: ','
	},
});