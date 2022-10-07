(function($) {
    "use strict";

    /*============= preloader js css =============*/
    var cites = [];
    cites[0] =
        "CSS forum for CSS aspirants";
    cites[1] = "Community for the css aspirants";
    cites[2] = "Learn and help each other for css exams";
    cites[3] = "CSS website created by ab_developers";
    var cite = cites[Math.floor(Math.random() * cites.length)];
    $("#preloader p").text(cite);
    $("#preloader").addClass("loading");

    $(window).on("load", function() {
        setTimeout(function() {
            $("#preloader").fadeOut(500, function() {
                $("#preloader").removeClass("loading");
            });
        }, 500);
    });
})(jQuery);