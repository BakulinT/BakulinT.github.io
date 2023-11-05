$(document).ready(() => {
    $("[data-header-menu]").on("click", () => {
        const $menu = $(".menu");

        if ($menu.hasClass("menu__hide")) {
            $menu.removeClass("menu__hide");
        }
        else {
            $menu.addClass("menu__hide");
        }
    });

    if ( window.screen.width > 1080 ) 
    {
        $(".menu").removeClass("menu__hide");
    }
    $(".menu").addClass("menu_animation");
});