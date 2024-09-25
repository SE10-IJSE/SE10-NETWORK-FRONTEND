$(document).on('click', '#Notifications .subtitle', function () {
    const subtitleText = $(this).text().trim();
    const iframe = $('#homePage .homeWallComponent iframe');

    if (subtitleText === "Birthdays") {
        $(parent.document).find('#homePage .homeWallComponent iframe').attr("src","/pages/birthdayPageMobile.html")
    } else {
        $(parent.document).find('#homePage .homeWallComponent iframe').attr("src","/pages/notificationPageMobile.html")
    }

    iframe.css({
        "border-radius": "0",
        "box-shadow": "none"
    });
});