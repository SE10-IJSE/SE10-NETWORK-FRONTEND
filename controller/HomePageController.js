$(document).ready(function() {
    changeButtonCss('home');
});

function changeButtonCss(button) {
    const buttons = {
        home: '#homePage .homeButton ',
        post: '#homePage .myPostButton ',
        approve: '#homePage .approveButton '
    };

    Object.values(buttons).forEach(selector => $(selector).removeClass('active'));

    if (buttons[button]) {
        $(buttons[button]).addClass('active');
    }
}



$('#homePage .profile .myProfileBtn').click(function() {
    $('#homePage .homeWallComponent iframe').attr('src', '../components/pages/wall/profileWallComponent.html')
        .css({
            'border-radius': '15px',
            'box-shadow': '0px 4px 18.3px 0px rgba(0, 0, 0, 0.10)',
        });
    changeButtonCss('profile');
});

$('#navBar .profile').click(function (){
    $('#homePage .homeWallComponent iframe').attr('src', '../components/pages/wall/profileWallComponent.html')
        .css({
            'border-radius': '15px',
            'box-shadow': '0px 4px 18.3px 0px rgba(0, 0, 0, 0.10)',
        });
    changeButtonCss('profile');
})

$('#homePage .homeButton').click(function (){
    $('#homePage .homeWallComponent iframe').attr('src', '../components/pages/wall/homeWallComponent.html').css({
        'border-radius': '0',
        'box-shadow': 'none',
    })
    changeButtonCss('home');
})

$('#homePage .approveButton').click(function (){
    $('#homePage .homeWallComponent iframe').attr('src', '../components/pages/wall/adminApproveWallComponent.html').css({
        'border-radius': '0',
        'box-shadow': 'none',
    })
    changeButtonCss('approve');
});