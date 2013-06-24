/*
Dungeon World (DW) is a tabletop roleplaying game. This application tells you how long since you have asked a PC a question while playing DW.
2013-06-23
Based on Player Tracker by Gino (http://ginof.com/apps/player_tracker/)
Modifications by Michael Brewer
This work is licensed under the Creative Commons Attribution 3.0 Unported License. To view a copy of this license, visit http://creativecommons.org/licenses/by/3.0/ or send a letter to Creative Commons, 444 Castro Street, Suite 900, Mountain View, California, 94041, USA.
*/
$(init);

var players = [];

function init(){
	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	window.requestAnimationFrame = requestAnimationFrame;
	
	$('input').focus();

	$('input').keypress(function (e) {
		if (e.which == 13){
			e.preventDefault();
			createPlayer();
			$(this).val('');
		}
	});
	$('#plus').click(createPlayer);
	// start ticker
	requestAnimationFrame(step);
}

function createPlayer(){
	var name = $('input').val();
	if (name == ''){
		$('input').focus();
		return;
	}
	$('input').val('');
	$("#players").append('<div name="'+players.length+'" class="player"><span class="count">0</span><span class="name">'+name+'</span><span class="time"></span></div>');
	var element = $(".player:last").eq(0);
	var $div = $(element);
	players.push({
		name:name,
		count:-1,
		last:new Date().getTime(),
		element:element
	});
	element.click(playerClicked);
	playerClicked.call(element);
}

function playerClicked(){
	var $div = $(this);
	var index = $div.attr('name');
	players[index].element.find('.count').text(++players[index].count);
	players[index].last = new Date().getTime();
	$div.removeClass('animate');
	$div.css({backgroundColor:'#33CC33'});
    setTimeout(function() {
        $div.addClass('animate').css({backgroundColor:'#EECC00'});
		var transitionEnd = function() {
			console.log('tend');
		    setTimeout(function() {
				$div.addClass('animate').css({backgroundColor:'#CC3333'});
			}, 15);
		}
		$div.on('webkitTransitionEnd',transitionEnd);
		$div.on('transitionend',transitionEnd);
		$div.on('oTransitionEnd',transitionEnd);
    }, 15);
}

function step(){
	var time = new Date().getTime();
	for (var i = 0; i < players.length; i++) {
		players[i].element.find('.time').text( get_elapsed_time_string((time - players[i].last)/1000) );
	};
	requestAnimationFrame(step);
}

function get_elapsed_time_string(total_seconds) {
	function pretty_time_string(num) {
		return ( num < 10 ? "0" : "" ) + num;
	}
	
	var hours = Math.floor(total_seconds / 3600);
	total_seconds = total_seconds % 3600;
	
	var minutes = Math.floor(total_seconds / 60);
	total_seconds = total_seconds % 60;
	
	var seconds = Math.floor(total_seconds);
	
	// Pad the minutes and seconds with leading zeros, if required
	hours = pretty_time_string(hours);
	minutes = pretty_time_string(minutes);
	seconds = pretty_time_string(seconds);
	
	// Compose the string for display
	var currentTimeString="";
	if(hours!="00"){
		currentTimeString = hours + ":" + minutes + ":" + seconds;
	}else{
		currentTimeString = minutes + ":" + seconds;
	}
	
	return currentTimeString;
}