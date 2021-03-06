(function(){
			var saveToken = function() {
				var hash = window.location.pathname.substring(1, window.location.pathname.length);
				var token = document.cookie.substring(6, document.cookie.length);
				if (token) { localStorage.setItem(hash, token); }
				else {
					$('#save-button').css('display', 'none');
					$('.input-allowed .fa.fa-edit').css('display', 'none');
					$('.input-allowed').off('click');
					$('.all-criterias').addClass('hide');
					$('.trash-button').css('display', 'none');
					$('#new-row').parent('tr').css('display', 'none');
				}
			}

			var jsonifyDecison = function(){
				var decision = {}	


			    var filterByAttr = function(arr, attr, val){
			    	var final = [];
			    	for (var i = 0; i < arr.length; i ++){

			    		if (arr[i][attr] && arr[i][attr] == val) {
			    			final.push(arr[i]);
			    		}
			    	}
			    	return final;
			    }

			    var getParentId = function(id) {
			    	return $('#' + id).parent().attr('id');
			    }

			    
			    // use innerHTML for criteria because if it is hidden by css, it will be ''
			    // use innerText for choice because it has font awesome icons in it
			    decision.title = $('#title').text();
			    decision.subtitle = $('#subtitle').text();
			    decision.largeNumbers = $('.large-numbers-button input:checked').val();
			    
			    var choices = $('.choice').htmljsonify(['innerText', 'choice'], ['title', 'id']);
			    var criteria = $('.criteria:not(.new-criteria').htmljsonify(['innerHTML', 'criteria', 'color'], ['title', 'id', 'color']);
			    var priorities = $('.percent').htmljsonify(['innerHTML', 'priority'], ['columnWidth', 'id']);
			    var ranks = $('.rank-choice:checked').htmljsonify(['value', 'choice']);
		


			    for (var i = 0; i < choices.length; i ++){
			    	var thisRank = filterByAttr(ranks, 'choice', choices[i].id);
			    	choices[i].ranks = [];
			    	var temp = {};
			    	for (var j = 0; j < thisRank.length; j ++){
			    		temp[j] = thisRank[j].value;
			    		choices[i].ranks.push(thisRank[j].value);
			    	}
			    }

			    for (var i = 0; i < criteria.length; i ++ ){
			    	criteria[i].parentId = getParentId('criteria-' + criteria[i].id);
			    }

			    decision.choices = choices;
			    decision.criteria = criteria;
			    decision.priorities = priorities;

			    return decision;
			}

			var postDecision = function() {
				var putUrl = "/api/decisions" + window.location.href.substring(window.location.href.lastIndexOf('/'), window.location.href.length);
				var data = jsonifyDecison();
				var hash = window.location.pathname.substring(1, window.location.pathname.length);
				var token = localStorage.getItem(hash);
				if (token) {
					$.ajax({
						url: putUrl,
						method: 'put',
						data: JSON.stringify(data),
						contentType: 'application/json',
						headers: {
							"Authorization": token
						}


					}).done(function(data){
						var date = new Date();
						$('.save-success')
							.addClass('hide-opacity')
							.text('Saved ' + date.toLocaleTimeString());
						setTimeout(function() {
							$('.save-success').removeClass('hide-opacity');
						}, 30000);

					}).fail(function(){
						$('#modal').css('display', 'block');
						$('.close').click(function(e){
							$('#modal').css('display', 'none');
						});
						$('window').click(function(e){
							if ($(event.target).is('#modal')) {
								$('#modal').css('display', 'none');
							}
						});
						$('#save-button').css('display', 'none');
					});
				} else {
					$('#modal').css('display', 'block');
					$('.close').click(function(e){
						$('#modal').css('display', 'none');
					});
					window.onclick = function(e){
						if ($(e.target).is('#modal')) {
							$('#modal').css('display', 'none');
						}
					};
					$('#save-button').css('display', 'none');

				}
			}
			$(document).ready(function(){
				
				$('#save-button').click(postDecision);
				saveToken();
			})
})(jQuery)