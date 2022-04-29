/*
 * 	Plugin de Preguntas v2.1 - 29/04/2022
 *	Se agregó opción de inglés, queda pendiente corregir .titleretro, por lo pronto se dejó 
 *	en false por default :P. rodrigoaiz@gmail.com
 *  Plugin de Preguntas v2 - 05/10/2013
 *  Agregada funcion de retroaliemntacion por el usuario tipo DIALOG - 29/01/13
 *  Agregada aleatoriedad de preguntas y respuestas
 *  Se agrega la opcion de indicar cual sera el elemnetod e retro - 04/04/14
 * Se agrega opcion al ccs !important para uso en temas de bootstrap
 *  UNAM - DGCCH
 *  Jonathan Bailon Segura
 *  jonn59@gmail.com
 */

(function ($) {
	$.fn.jQuiz = function (options) {
		// Create some defaults, extending them with any options that were provided
		var settings = $.extend({
			'location': 'top',
			'background-color': 'blue',
			'titleretro': false,
			'retro': false,
			'dialog': false,
			'aleatorio': false,
			'respaleatorias': false,
			'controles': false,
			'jquiztotal': '#jquiztotal',
			'jquizremarks': '#jquizremarks',
			'ingles': false
		}, options);

		return this.each(function () {
			var count = 0;
			var howmanyquestions = $("ol > div > li", this).length;
			var $this = this;


			/*
			 * Barajeamos las preguntas aleatoriamente
			 */
			if (settings.aleatorio == true) {
				var collection = $("div.questionContainer", this).get();
				collection.sort(function () {
					return Math.random() * 10 > 5 ? 1 : -1;
				});
				$.each(collection, function (i, el) {
					$el = $(el);
					$el.appendTo($el.parent());
				});
			}

			/*
			 * Barajeamos las respuestas aleatoriamente
			 */
			if (settings.respaleatorias == true) {

				var collection = $("div.questionContainer li ul li", this).get();
				collection.sort(function () {
					return Math.random() * 10 > 5 ? 1 : -1;
				});
				$.each(collection, function (i, el) {
					$el = $(el);
					$el.appendTo($el.parent());
				});
			}

			/*
			 * Colocamos los controles para atrazar o adelantar la pregunta
			 */

			function variableNext() {
				if (settings.ingles == true) {
					return 'Next';
				} else {
					return 'Siguiente';
				}
			}
			function variablePrev() {
				if (settings.ingles == true) {
					return 'Back';
				} else {
					return 'Anterior';
				}
			}

			if (settings.controles == true) {
				$val = $("div.questionContainer", this);
				tamano = $val.length;

				$val.each(function (indice, valor) {
					//alert(valor);
					if (indice == 0) {
						$(this).append('<div class="btnContainer"> \
							        <div class="prev"> &nbsp;</div> \
							        <div class="next"> <a class="btnNext over">'
							+ variableNext() +
							'</a></div> \
							        <div class="clear"> &nbsp;</div> \
							        </div>');
					} else if (indice == tamano - 1) {
						$(this).append('<div class="btnContainer"> \
							        <div class="prev"> <a class="btnPrev over">'
							+ variablePrev() +
							'</a></div> \
							        <div class="next"> &nbsp;</div> \
							        <div class="clear"> &nbsp;</div> \
							        </div>');
					} else {
						$(this).append('<div class="btnContainer"> \
							        <div class="prev"> <a class="btnPrev over">'+ variablePrev() + '</a></div> \
							        <div class="next"> <a class="btnNext over">'+ variableNext() + '</a></div> \
							        <div class="clear"> &nbsp;</div> \
							        </div>');
					}
				});
			}



			//Ocultamos las preguntas
			$("div.questionContainer", this).hide().first().show();
			//$("div.questionContainer", this).hide().first().attr("style", "display: block !important; visibility: visible !important");
			$(settings.jquizremarks, $this).hide();




			$("ol li ul li", this).click(function () {

				if (!($(this).parent("ul").hasClass("answered"))) {

					// removes unanswered class and adds answered class so they cannot change answer
					$(this).parent("ul").addClass("answered");

					// runs if they clicked the incorrect answer
					if (!($(this).hasClass("correct"))) {
						// puts strike-through wrong answer and makes their answer red for incorrect
						$(this).addClass("wronganswer");
						$(this).siblings(".correct").addClass("realanswer");
						// animate explanation & add styling depending on answer
						if (settings.titleretro) {
							if (settings.ingles == false) {
								$(this).parent().parent().children("div").prepend('<div class="d-block w-100 my-5">¡No es la respuesta esperada! </div>');
							} else {
								$(this).parent().parent().children("div").prepend('<div class="d-block w-100 my-5">That\'s wrong! </div>');
							}
						}
						$(this).parent().children("div").addClass("wrongbox");
						$(this).parent().children("div").fadeTo(500, 1);
					}

					// runs if they clicked the correct answer
					if ($(this).hasClass("correct")) {
						//adds one to quiz total correct tally
						count++;
						// makes correct answer green
						$(this).addClass("correctanswer");
						// animate explanation & add styling depending on answer
						if (settings.titleretro) {
							if (settings.ingles == false) {
								$(this).parent().parent().children("div").prepend('<div class="d-block w-100 my-5">¡Muy bien!</div>');
							} else {
								$(this).parent().parent().children("div").prepend('<div class="d-block w-100 my-5">Good job!</div>');
							}
						}
						$(this).parent().parent().children("div").addClass("rightbox");
						$(this).parent().parent().children("div").fadeTo(750, 1);
					}

					if ($('ul.answered', $this).length == howmanyquestions) {

						if (!settings.retro) {

							$(settings.jquizremarks).fadeIn('slow');
							if (settings.ingles == false) {
								$(settings.jquiztotal).html('Contestaste bien ' + count + ' de ' + howmanyquestions + ' preguntas. <br /> Si tuviste menos de la mitad de los aciertos te recomendamos volver a revisar este material con más atención.');
							} else {
								$(settings.jquiztotal).html('You answered correct ' + count + ' of ' + howmanyquestions + ' questions. <br /> If you had the half or less correct answers, you should go back and read again the learning resource.');
							}

						} else if (!settings.dialog) {
							$(settings.jquizremarks).fadeIn('slow');
							if (settings.ingles == false) {
								$(settings.jquiztotal).html('Contestaste bien ' + count + ' de ' + howmanyquestions + ' preguntas. <br /> ' + settings.retro);
							} else {
								$(settings.jquiztotal).html('You answered correct ' + count + ' of ' + howmanyquestions + ' questions. <br /> ' + settings.retro);
							}

						} else {
							var caja = jQuery('<div class="dialogletra" title="Retroalimentación">Contestaste bien ' + count + ' de ' + howmanyquestions + ' preguntas. <br /> ' + settings.retro + '</div>');
							caja.dialog({
								modal: true,
								width: 400,
							});
						}
					}
				}
			});

			$('.btnNext', this).click(function () {
				$(this).parents('.questionContainer').fadeOut(500, function () {
					$(this).next().fadeIn(500);
					//$(this).next().show();
				});
				var el = $('#progress');
				el.width(el.width() + 120 + 'px');
			});

			$('.btnPrev', this).click(function () {
				$(this).parents('.questionContainer').fadeOut(500, function () {
					$(this).prev().fadeIn(500)
				});
				var el = $('#progress');
				el.width(el.width() - 120 + 'px');
			});
		});
	};
})(jQuery); 