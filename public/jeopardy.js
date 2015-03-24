"use strict";

var initCallbacks = function()
{
    $('#clear-results-button').click(function() {
        $("#output-div").empty();
    });

    var host = window.location.host;

    $('#search-clues-button').click(function() {
        var s = document.getElementById('search-text').value;
        $.get("http://"+host+"/search?searchstring="+s,
        function(data) {
            $("#output-div").prepend(data);
        });
    });

    $('#show-results-button').click(function() {
        var jdj = document.getElementById('j-dj-select').value;
        var daterange = document.getElementById('date-range-select').value;
        var dd = document.getElementById('dd-select').value;
        $.get("http://"+host+"/table?jdj="+jdj+"&daterange="+daterange+"&dd="+dd,
        function(data) {
            $("#output-div").prepend(data);
        });
    });

    $('#player-results-button').click(function() {
        var player = document.getElementById('player-select').value;
        $.get("http://"+host+"/player?player="+player,
        function(data) {
            $("#output-div").prepend(data);
        });
    });

};

$(initCallbacks);
