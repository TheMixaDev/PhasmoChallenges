const Lib = {
    BubblyButton: () => {
        var animateButton = function(e) {
            e.preventDefault;
            e.target.classList.remove('animate');
            e.target.classList.add('animate');
            setTimeout(function(){
                e.target.classList.remove('animate');
            },700);
        };
        var bubblyButtons = document.getElementsByClassName("bubbly-button");
        for (var i = 0; i < bubblyButtons.length; i++) {
            bubblyButtons[i].addEventListener('click', animateButton, false);
        }
    },
    AnimatedCards: () => {
        var x;
        var $cards = $(".card");
        var $style = $(".hover");
        $cards
        .on("mousemove touchmove", function(e) { 
            var pos = [e.offsetX,e.offsetY];
            e.preventDefault();
            if ( e.type === "touchmove" ) {
            pos = [ e.touches[0].clientX, e.touches[0].clientY ];
            }
            var $card = $(this);
            var l = pos[0];
            var t = pos[1];
            var h = $card.height();
            var w = $card.width();
            var px = Math.abs(Math.floor(100 / w * l)-100);
            var py = Math.abs(Math.floor(100 / h * t)-100);
            var pa = (50-px)+(50-py);
            var lp = (50+(px - 50)/1.5);
            var tp = (50+(py - 50)/1.5);
            var px_spark = (50+(px - 50)/7);
            var py_spark = (50+(py - 50)/7);
            var p_opc = 20+(Math.abs(pa)*1.5);
            var ty = ((tp - 50)/2) * -1;
            var tx = ((lp - 50)/1.5) * .5;
            var grad_pos = `background-position: ${lp}% ${tp}%;`
            var sprk_pos = `background-position: ${px_spark}% ${py_spark}%;`
            var opc = `opacity: ${p_opc/100};`
            var tf = `transform: rotateX(${ty}deg) rotateY(${tx}deg)`
            var style = `
            .card:hover:before { ${grad_pos} }  /* gradient */
            .card:hover:after { ${sprk_pos} ${opc} }   /* sparkles */ 
            `
            $cards.removeClass("active");
            if(!$card.hasClass("locked"))
                $card.removeClass("animated");
            $card.attr( "style", tf );
            $style.html(style);
            if ( e.type === "touchmove" ) {
            return false; 
            }
            clearTimeout(x);
        }).on("mouseout touchend touchcancel", function() {
            var $card = $(this);
            $style.html("");
            $card.removeAttr("style");
            if(!$card.hasClass("locked"))
            //if(!($card.hasClass("common") || $card.hasClass("rare") || $card.hasClass("legendary") || $card.hasClass("special")))
                x = setTimeout(function() {
                $card.addClass("animated");
                },2500);
        });
    }
}