// These are the TBA APIv3 key that allows access to the JSON file
var eventKey = 'JQWx3np1kuYKxcEzD5febqWrQAuYhFcYtFJ3gUb8Z0gthWwSb5397tkvdqiTv8oc';
var teamKey = '6um4nzQPqPd0ww0vjUxfc0gJcGHe9OOsmK7PpjOhDfwZhPFWbme4PYpOwb3Ryos9';

var teamInput = $('#teamInput'); // Team number input
var eventList = $('#eventList');; // Event dropdown
var eventData; // Holds the data for the events

var quals = []; // Qualifications
var quarts = []; // Quarter-Finals
var semis = [] // Semi-Finals
var finals = []; // Finals

var eventMap = {}; // Maps the event keys to the event names

// Run when Update Team button is hit
function updateEvents() {
  // This requests information from TBA of all events the team has participated in
  $.ajax({
    url: 'https://www.thebluealliance.com/api/v3/team/frc' + teamInput.val() + '/events/2018', // Creates the URL
    headers: {
      'X-TBA-Auth-Key': teamKey
    },
    statusCode: {
      404: function () { }
    },
    method: 'GET',
    eventDataType: 'json',
    success: function (events) {
      console.log(events);
      clearMatches();
      clearEvents();
      for (var i = 0; i < events.length; i++) { // For every event
        // Append it to the dropdown
        eventList.append('<option value="' + events[i].event_code + '">' + events[i].name + '</option>');
        // Map the code and the name
        eventMap[events[i].event_code] = events[i].name;
      }
      selectEvent();
    }
  });
}

// Run when Update Event button is hit or dropdown is changed
function selectEvent() {
  // If the selected value is still the default
  if ($('#eventList option:selected').val() === "Choose your team #...") {
    eventList.css("animation-name", "error"); // Run an error animation
    return; // Exit
  }
  // This requests information from TBA of all of the matches in the event
  $.ajax({
    url: 'https://www.thebluealliance.com/api/v3/team/frc' + teamInput.val() + '/event/2018' + $('#eventList option:selected').val() + '/matches', // Creates the URL
    headers: {
      'X-TBA-Auth-Key': eventKey
    },
    method: 'GET',
    eventDataType: 'json',
    success: function (matches) {
      eventData = matches; // Make the match data global
      updateMatches(); // Update the matches table
    }
  });
}

// This goes through all of the matches and puts the needed information from each into their respective arrays
function updateMatches() {
  // Clear the past matches' data
  clearMatches();

  for (var i = 0; i < eventData.length; i++) { // For each match
    var level = eventData[i].comp_level; // Get the level
    var number = eventData[i].match_number; // Get the number
    var redScore = eventData[i].alliances.red.score; // Get the red score
    var blueScore = eventData[i].alliances.blue.score; // Get the blue score
    if (eventData[i].videos[0] != undefined) { // If there is a video
      var videoType = eventData[i].videos[0].type; // Get the type of video
      var videoKey = eventData[i].videos[0].key; // Get the key of the video
    }

    if (level == "qm") { // If it is a qualifying match
      quals.splice(i, 0, ["Qualifier ", number, redScore, blueScore, videoType, videoKey]); // Append the match data to the repective array
    } else if (level == "qf") { // If it is a quarter-final
      quarts.splice(i, 0, ["Quarter-Final ", number, redScore, blueScore, videoType, videoKey]); // Append the match data to the repective array
    } else if (level == "sf") { // If it is a semi-final
      semis.splice(i, 0, ["Semi-Final ", number, redScore, blueScore, videoType, videoKey]); // Append the match data to the repective array
    } else if (level == "f") { // If it is a final
      finals.splice(i, 0, ["Final ", number, redScore, blueScore, videoType, videoKey]); // Append the match data to the repective array
    }
  }
  // Sort the arrays into chronological order
  sortLists();
  // Update the table with the new data
  updateTable();
}

// Remove all match data from the arrays and the table
function clearMatches() {
  quals.length = 0;
  quarts.length = 0;
  semis.length = 0;
  finals.length = 0;
  $("#matches tr>th").remove();
  $("#matches tr>td").remove();
}

// Remove all events from the dropdown
function clearEvents() {
  eventList.empty();
}

// This sorts the matches in chronological order per match type (Qual 1, Qual 2, Quarter-Final 1, etc.)
function sortLists() {
  quals.sort(function (a, b) {
    return a[1] - b[1];
  });
  quarts.sort(function (a, b) {
    return a[1] - b[1];
  });
  semis.sort(function (a, b) {
    return a[1] - b[1];
  });
  finals.sort(function (a, b) {
    return a[1] - b[1];
  });
}

// This passes all of the values into the table
function updateTable() {
  $('#eventName').innerHTML = eventMap[$('#eventList option:selected').val()];
  $('table#matches').append('<thead id="tableHeader"><th>Match</th><th>Red</th><th>Blue</th></thead>');
  for (var i = 0; i < quals.length; i++) {
    $('table#matches').append('<tr><td><a href="http://www.' + quals[i][4] + '.com/watch?v=' + quals[i][5] + '" title="Watch video" target="_blank" style="color:' + onAlliance(i) + '!important;">' + quals[i][0] + ' ' + quals[i][1] + '</a></td><td style="color:rgb(227, 76, 38);" class="' + redWinner(i) + '">' + quals[i][2] + '</td><td style="color:rgb(39, 71, 146);" class="' + blueWinner(i) + '">' + quals[i][3] + '</td></tr>');
  }
  for (var i = 0; i < quarts.length; i++) {
    $('table#matches').append('<tr><td><a href="http://www.' + quarts[i][4] + '.com/watch?v=' + quarts[i][5] + '" title="Watch video" target="_blank" style="color:' + onAlliance(i) + '!important;">' + quarts[i][0] + ' ' + quarts[i][1] + '</a></td><td style="color:rgb(227, 76, 38);" class="' + redWinner(i) + '">' + quarts[i][2] + '</td><td style="color:rgb(39, 71, 146);" class="' + blueWinner(i) + '">' + quarts[i][3] + '</td></tr>');
  }
  for (var i = 0; i < semis.length; i++) {
    $('table#matches').append('<tr><td><a href="http://www.' + semis[i][4] + '.com/watch?v=' + semis[i][5] + '" title="Watch video" target="_blank" style="color:' + onAlliance(i) + '!important;">' + semis[i][0] + ' ' + semis[i][1] + '</a></td><td style="color:rgb(227, 76, 38);" class="' + redWinner(i) + '">' + semis[i][2] + '</td><td style="color:rgb(39, 71, 146);" class="' + blueWinner(i) + '">' + semis[i][3] + '</td></tr>');
  }
  for (var i = 0; i < finals.length; i++) {
    $('table#matches').append('<tr><td><a href="http://www.' + finals[i][4] + '.com/watch?v=' + finals[i][5] + '" title="Watch video" target="_blank" style="color:' + onAlliance(i) + '!important;">' + finals[i][0] + ' ' + finals[i][1] + '</a></td><td style="color:rgb(227, 76, 38);" class="' + redWinner(i) + '">' + finals[i][2] + '</td><td style="color:rgb(39, 71, 146);" class="' + blueWinner(i) + '">' + finals[i][3] + '</td></tr>');
  }
}

// This returns "winner" if red wins and "loser" if they lose
function redWinner(i) {
  if (eventData[i].winning_alliance == "red") {
    return "winner";
  }
  return "loser";
}

// This returns "winner" if blue wins and "loser" if they lose
function blueWinner(i) {
  if (eventData[i].winning_alliance == "blue") {
    return "winner";
  }
  return "loser";
}

function onAlliance(i) {
  if (eventData[i].alliances.red.team_keys.includes('frc' + teamInput.val())) {
    return "rgb(227, 76, 38)";
    // This returns the alliance that the team is on
  }
  return "rgb(39, 71, 146)";
}
