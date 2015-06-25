
$(document).ready(function(){

	var i = 0;
	var num = 0;
	var num_buf = 0;

	var radius = 180;
	var time_holder;
	var round_class;

	var x;
	var y;

	// Динамические переменные для таймера.
	var status = 'wait';				//
	var status_buffer = 'wait';			//	Предыдущее значение статуса хранится в памяти
	var dt = 0;							//	10мс
	var count = 0;						//	отсчет в упражнении
	var rest_count = 0;					//	отсчет отдыха (счетчик для пауз)
	var begin_count = 4;				//	счетчик для начала упражнения
	var period = 10;					// 	Скорость, выраженная периодом

	var x_monitor;						//	Положение монитора слайдера
	var monitor_margin = 25;			//

	// Константы и настройки
	var amount_of_points = 96;			//  Количество движений в упражнении
	var count_mult = 32;				//	Количество двиэений в подходе
	var rest_amount = 3;				//	Время отдыха
	var accuracy = 50;					//	Интервал кванта времени
	var speed_of_resetting = 7;			//	Во время ресета убираются классы. Этот параметр задаёт скорость анимации
	var max_speed = 50;
	var min_speed = -6;

	time_holder = setInterval(tick,accuracy);
	makeCircle();

	$("#speed").slider({
 		animate: "fast",
 		max: max_speed,
		value: period,
 		slide: function(event,ui){
			period = $("#speed" ).slider( "option", "value" );
 			i=0;
			dt = 0;
 		},
		change:function(event,ui){
			period = $("#speed").slider("option", "value");
			i = 0;
			dt = 0;
		}
	});
	$('#speed_monitor').html($("#speed" ).slider( "option", "value" ));


	// Поместить таймер внутрь круга
	x = $("#main").offset().left + $("#main").width()/2 - $('#time').width()/2;
	y = $("#main").offset().top + $("#main").height()/2 - $('#time').height()/2
	$("#time").offset({left:x, top:y });

	// Поместить статусбар
	x = $("#main").offset().left ;
	y = $("#main").offset().top + $('#main').height() + parseInt($("#status_bar").css('margin-top'));
	$("#status_bar").css("width",$('#main').width());
	$("#status_bar").offset({left:x, top:y });


	// Поместить слайдер под круг
	x = $("#main").offset().left ;
	y = $("#main").offset().top + $('#main').height() + parseInt($("#speed").css('margin-top'));
	$("#speed").offset({left:x, top:y });
	$("#speed").css("width",$('#main').width());

	// Поместить монитор скорости под круг
	x = $("#main").offset().left + $("#speed" ).slider( "option", "value" )*( $("#main").width()/max_speed) - 10;
	y = $("#main").offset().top + $('#main').height() + parseInt($("#speed").css('margin-top'))+monitor_margin;
	$("#speed_monitor").offset({left:x, top:y });

	// Поместить минус
	x = $("#main").offset().left;
	y = $("#main").offset().top + $('#main').height() + parseInt($("#speed").css('margin-top'))+ monitor_margin;
	$("#minus").offset({left:x, top:y });

	// Поместить плюс
	x = $("#main").offset().left + $("#main").width() - $("#plus").width();
	y = $("#main").offset().top + $('#main').height() + parseInt($("#speed").css('margin-top'))+ monitor_margin;
	$("#plus").offset({left:x, top:y });

	// Поместить START
	x = $("#main").offset().left + $("#main").width()/2 - $("#start").width()/2;
	y = $("#main").offset().top - $('#start').height() -25;
	$("#start").offset({left:x, top:y });

	// Поместить RESET
	x = $("#main").offset().left + $("#main").width()/2 - $("#reset").width()/2;
	y = $("#time").offset().top + $('#time').height()/2 + 60;
	$("#reset").offset({left:x, top:y });

	function tick(){
		dt++;

		// Коордлинаты монитора скорости.
		x_monitor = $("#main").offset().left + $("#speed" ).slider( "option", "value" )*( $("#main").width()/(max_speed)) - 20;

		// Столкновение с минусом. Число в конце - щель между кнопкой и монитором
		if (x_monitor < ($("#minus").offset().left + $("#minus").width()+5)){
			x_monitor = $("#minus").offset().left + $("#minus").width()+5;
		}

		// Столкновение с плюсом. Число в конце - щель между кнопкой и монитором
		if (x_monitor > ($("#main").offset().left + $("#main").width() - $("#plus").width()- $("#speed_monitor").width()-5 )){
			x_monitor = $("#main").offset().left + $("#main").width() - $("#plus").width()- $("#speed_monitor").width() -5;
		}
		y = $("#main").offset().top + $('#main').height() + parseInt($("#speed").css('margin-top'))+monitor_margin;
		$("#speed_monitor").offset({left:x_monitor, top:y });
		$('#speed_monitor').html($("#speed" ).slider( "option", "value" ));

		if (dt == period) {
			dt = 0;
			switch (status) {
				case 'wait':
					waiting();
					break;
				case 'begin':
					beginning();
					break;
				case 'count':
					counting();
					break;
				case 'rest':
					resting();
					break;
				case 'reset':
					resetting();
					break;
			}
		}
	}

	function waiting(){
		// Простой перед запуском
		if (count_mult <= 8) {
			$('#time').html('00:00');
		} else {
			$('#time').html('0:00');
		}
		$('#status_bar').html('Нажмите START для начала');

	}

	function beginning(){
		// Первый отсчет
		begin_count--;

		$('#time').html(begin_count);
		$('#status_bar').html('Готовьсь!');
		if (begin_count == 0) {
			poop();
			begin_count = 4;
			status = 'count';
		} else {
			peep()
		}

	}

	function counting(){
		// Отсчет подхода
		count++;
		сhick();
		$('#time').html(convert(count, count_mult));
		$('#status_bar').html('Работаем!');
		num = count + 1;
		$("#round"+num).addClass('round_focus');
		if ((count % count_mult) == 0) {
			peep();
			status = 'rest';
		}
		if (count == amount_of_points) {
			status = 'reset';
			poop();
			count = 0;
		}
	}

	function resting(){
		// Перерыв между упражнениями
		rest_count++;
		//$('#time').html(rest_count);
		$('#status_bar').html('Отдыхаем несколько секунд');
		var real_rest = Math.floor((rest_amount *1000) / (period * accuracy)); //Вычисление количества шагов для отдыха
		if (rest_count == real_rest){
			status = 'begin';
			rest_count = 0;
		}
	}

	function resetting(){
		// Сбросить все счетчики
		count = 0;
		rest_count = 0;
		begin_count = 4;
		status = 'wait';
		$('#start').html('START');
		reset_circle();
	}

	function convert(count,count_mult){
		var mins = Math.floor(count/count_mult);
		var secs = (count % count_mult);

		if (secs < 10) {
			secs = '0' + secs;
		}
		if (count_mult <= 9){
			if (mins < 10) {
				mins = '0'+mins;
			}
		}
		return (mins + ':' + secs)
	}

	//Аудио проигрыватели
	var chick_i = 0;
	function сhick(){
		chick_i++;
		document.getElementById('chick' + chick_i).play();
		if (chick_i == 3) {
			chick_i = 0;
		}
	}

	var chock_i = 0;
	function сhock(){
		chock_i++;
		document.getElementById('сhock' + chock_i).play();
		if (chock_i == 3) {
			chock_i = 0;
		}
	}

	var peep_i = 0;
	function peep(){
		peep_i++;
		document.getElementById('peep' + peep_i).play();
		if (peep_i == 3) {
			peep_i = 0;
		}
	}

	var poop_i = 0;
	function poop(){
		poop_i++;
		document.getElementById('poop' + poop_i).play();
		if (poop_i == 3) {
			poop_i = 0;
		}
	}


	//	Кнопка паузы
	$(document).on('ready', function(){
		if (status = 'wait'){
			$('#start').html('START');
		}
		$('#start').click(function(){
			if (status == 'wait'){
				status = 'begin';
				$('#start').html('PAUSE');
			} else {
				if (status != 'pause'){
					status_buffer = status;
					status = 'pause';
					$('#start').html('GO');
				} else {
					status = status_buffer;
					$('#start').html('PAUSE');
				}
			}
		});
	});

	//	Кнопка сброса
	$(document).on('ready', function(){
		$('#reset').click(function(){
			status = 'reset';

		});
	});

	// Нажатие кнопок 8, 16, 32 и т.д
	$(document).on('ready', function(){
		$('.button').click(function(){
			status = 'reset';
			count_mult = parseInt($(this).html());
			$('#main').html('');
			makeCircle();
			clearInterval(time_holder);
			time_holder = setInterval(tick,50);
			
		});
	});

	$(document).on('ready', function(){
		$('#plus').click(function(){
			period++;
			$("#speed").slider('value',period);
		});
	});

	$(document).on('ready', function(){
		$('#minus').click(function(){
			period--;
			$("#speed").slider('value',period);
		});
	});


	function makeCircle() {
		$('#main').html('');
		var num = 0;
		for (var counter = 1; counter < amount_of_points+1; counter++) {
			if (num == 0) {
				round_class = "round_mult";
			} else {
				round_class = "round";
			}
			$('#main').append('<div class="'+round_class+'" id="round' + counter+'"></div>');
			
			num +=1;
			if (num == count_mult) {
				num = 0;
			}
		}
		var phi=-90;
		var x=0;
		var y=0;
		var w = $("#main").width();
		var h = $("#main").height();

		for (var count = 1; count < amount_of_points + 1; count++) {



			if (w<=h) {
				radius = w/2;
			} else {
				radius = h/2;
			}
			// Координаты точки
			x = Math.cos(phi*Math.PI/180)*radius;
			y = Math.sin(phi*Math.PI/180)*radius ;

			// Смещение
			x += $("#main").offset().left + w/2;
			y += $("#main").offset().top + h/2;

			// Поправка на размер точки
			x -= $("#round"+count).width()/2;
			y -= $("#round"+count).width()/2;
			$("#round"+count).offset({left:x, top: y});
			phi += 360/amount_of_points;
		}


		//$('.round,.round_mult').click(function(){
		//	$('.monitor').html($(this).width());
		//});
	}

	function reset_circle(){
		/*
		 for (var foo = 1; foo <= amount_of_points; foo++){
		 $("#round"+foo).removeClass('round_focus');
		 }
		 */
		var num = 0;
		setInterval(deleteClass,speed_of_resetting);
		function deleteClass(){
			num ++;
			$("#round"+num).removeClass('round_focus');
		}

	}
});