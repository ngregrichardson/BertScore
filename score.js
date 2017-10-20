$.ajax({
    url: 'https://www.thebluealliance.com/api/v3/team/frc4750/event/2017pawch/matches',
    headers: {
        'X-TBA-Auth-Key':'kGJ3EWlMyQx2MQjqcg58Blrwh520rgRjiF1GHhLybmY0RfTVMmErWAJMpVKXBhrd'
    },
    method: 'GET',
    dataType: 'json',
    success: function(data){
      $.each(data, function(index, el){
	      $('table#matches').append('<tr><td>'+
	      	el.comp_level+el.match_number+'</td><td>'+
	      	el.alliances.red.score+'</td><td>'+
	      	el.alliances.blue.score+'</td></tr>');
      });
    }
  });