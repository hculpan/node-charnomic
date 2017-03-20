$(function(){

    var tmpl,   // Main template HTML
    tdata = {};  // JSON data object that feeds the template

    // Initialise page
    var initPage = function() {

        // Load the HTML template
        $.get("/templates/home.html", function(d){
            tmpl = d;
        });

        // Retrieve the server data and then initialise the page
        $.getJSON("/players_rules", function (d) {
            $.extend(tdata, d.data);
        });

        // When AJAX calls are complete parse the template
        // replacing mustache tags with vars
        $(document).ajaxStop(function () {
            var template = Handlebars.compile(tmpl);
            $("#content").html( template(tdata) );
        })
    }();
});

Handlebars.registerHelper('player_name', function(lastname, firstname) {
  return firstname + " " + lastname.substr(0, 1) + ".";
});
