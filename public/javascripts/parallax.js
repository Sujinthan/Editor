$(function(){
	$('#content').scroll(function(){
		var wScroll = $(this).scrollTop();
		console.log("Scroll: " + wScroll);
		var temp = $('#info').offset().top;
		console.log("info div: " + temp)
		var lang = $('#languages').offset().top;
		console.log("lang div: " + lang);
		var wHeight = $(this).height();
		console.log('wHeight: ' + wHeight);
		var infotitlediv = $('#infotitle').offset().top;
		console.log("infotitledive: " +infotitlediv);
		console.log((0/100)/3);
		$('#titlehead').css({
			'transform': 'translate(-50%,' + (wScroll-150)/3+ "%)"
		});
		if(wScroll > $('#info').offset().top-(wHeight)*4){
			$('#infotitle').css({
				'opacity': (wScroll)/wHeight
			})
		
		}
		if(wScroll > $('#languages').offset().top-(wHeight)*2 ){
			$('#languagestitle').css({
				'opacity': (wScroll*0.6)/(wHeight*1.2)
			})
		}
		if(wScroll > $('#joinus').offset().top-(wHeight) ){
			$('#jointitle').css({
				'opacity': (wScroll*0.5)/(wHeight*1.5)
			})
		}
	});
});


