let params = {
    KOEFF_SPEED: 1.1,
    KOEFF_SHIFT: 0.25
}

class Slider {
    constructor(wrapper, container) {
        this.wrapper = wrapper;
        this.container = container;

        this.btnLeftName = "swiper-button-prev";
        this.slideActionName = "swiper-slide-active";
        this.btnHideLeft = "btn-hiden__left";
        this.btnHideRight = "btn-hiden__right";

        this.pntStartX = 0;
        this.currentTranslate = 0;
        this.blockLen;
        this.isDragging = false,
        this.animationID = null;
    }

    actionBlock() {
        let items = this.container.children;

        for (var i = 0; i < items.length; i++) {
            if (items[i].className.includes(this.slideActionName)) return i;
        }
        return 0;
    }

    returnEvent(evt) {
        if (evt.changedTouches === undefined) return evt;
        return evt.changedTouches[0];
    }

    switchingSlideBtn(name) {
        let items = this.container.children;
    
        let vector = ( name.includes(this.btnLeftName) ) ? -1 : 1;
        let action = this.actionBlock();
    
        let number = action + vector;
        if (number < 1) {
            this.wrapper.classList.add(this.btnHideLeft);
        } else if (number >= items.length - this.count) {
            this.wrapper.classList.add(this.btnHideRight);
        } else {
            this.wrapper.classList.remove(this.btnHideLeft);
            this.wrapper.classList.remove(this.btnHideRight);
        }

        if (number < 0 || number > items.length - this.count) return;
        

        this.currentTranslate = -this.blockLen * number;
        this.SetPositionSlide();
    
        // container.style.transform = `translate(-${ul.children[0].offsetWidth * number}px, 0px)`;
    
        items[action].classList.remove(this.slideActionName);
        items[number].classList.add(this.slideActionName);
    }

    sliderItems(number, action) {
        let items = this.container.children;
    
        if (action < 0) {
            action = 0;
            // $(this).find("[data-slider-btn].swiper-button-prev").css("opacity", 0);
        }
        else if (action > items.length - this.count) {
            action = items.length - this.count;
            // $(this).find("[data-slider-btn].swiper-button-next").css("opacity", 0);
        } else {
            // $(this).find("[data-slider-btn]").css("opacity", 1);
        }
    
        items[number].classList.remove(this.slideActionName);
        items[action].classList.add(this.slideActionName);
    }

    swipeStart(event) {
        let evt = this.returnEvent(event);
        
        this.isDragging = true;
    
        this.cursorPntX = this.currentTranslate;
        this.pntStartX = evt.clientX;
    
        this.animationID = requestAnimationFrame(this.animation.bind(this));
    }

    swipeMove(event) {
        if (!this.isDragging) return;
    
        let evt = this.returnEvent(event);
        this.currentTranslate = this.cursorPntX - params.KOEFF_SPEED*(this.pntStartX - evt.clientX);
    }

    swipeEnd(event) {
        if (!this.isDragging) return;
    
        let evt = this.returnEvent(event);
        
        this.isDragging = false;
        cancelAnimationFrame(this.animationID);
    
        let number = this.actionBlock();
        let temp = -this.currentTranslate / this.blockLen,
            action;
    
        if ( (temp - number) < -params.KOEFF_SHIFT) action = Math.floor(temp);
        else if ( (temp - number) > params.KOEFF_SHIFT ) action = Math.ceil(temp);
        else action = number;
        
        if (number != action) this.sliderItems(number, action);
    
        this.currentTranslate = this.cursorPntX - params.KOEFF_SPEED*(this.pntStartX - evt.clientX);
        this.currentTranslate = -action * this.blockLen;
    
        if (this.currentTranslate > 0) {
            this.currentTranslate = 0;
        }
        else if (this.currentTranslate < -this.blockLen * (this.container.childElementCount - this.count)) {
            this.currentTranslate = -(this.container.childElementCount - this.count) * this.blockLen;
        }
    
        this.SetPositionSlide();
    }

    animation() {
        this.SetPositionSlide();
    
        if (this.isDragging) requestAnimationFrame(this.animation.bind(this));
    }
    
    SetPositionSlide() {
        this.container.style.transform = `translate(${this.currentTranslate}px, 0px)`;
    }
    
    resizeWindow() {
        const width = this.wrapper.offsetWidth;
        let count = this.option.min_count;

        if (width > 1260) {
            count =  Math.floor( width / this.option.width );
        } 
        else if (width > 650) {
            count = this.option.max_count;
        }
        else if (width > 460) {
            count = this.option.avg_count;
        }

        this.count = count;
        this.blockLen = Math.floor( width / count );
        for (let i = 0; i < this.container.childElementCount; i++) {
            // this.container.children[i].cssText = `width: ${this.blockLen};`;
            $(this.container.children[i]).css({
                "width": this.blockLen,
                "margin-right": "0.625rem"
            });
            // this.container.children[i].style.width = this.blockLen;
        }
        this.container.style.width = `${this.blockLen * this.container.childElementCount}px`;
        // this.container.style.transform = "translate(0px, 0px)";
        this.currentTranslate = -this.blockLen * this.actionBlock();
        this.SetPositionSlide();
    }

    swipe() {
        const _this = this;

        const funcBind = (func, event) => func.bind(_this)(event);

        // Старт
        this.container.addEventListener( "mousedown", (event) => funcBind(_this.swipeStart, event) );
        this.container.addEventListener( "touchstart", (event) => funcBind(_this.swipeStart, event) );
    
        // Перемещение
        this.container.addEventListener( "mousemove", (event) => funcBind(_this.swipeMove, event) );
        this.container.addEventListener( "touchmove", (event) => funcBind(_this.swipeMove, event) );
    
        // Отпуск 
        this.container.addEventListener( "mouseup",  (event) => funcBind(_this.swipeEnd, event) );
        this.container.addEventListener( "mouseleave", (event) => funcBind(_this.swipeEnd, event) );
        this.container.addEventListener( "touchend",  (event) => funcBind(_this.swipeEnd, event)  );    
    }

    create(buttons, option) {
        const _this = this;
        
        this.option = option;
        this.resizeWindow();
        this.wrapper.classList.add(this.btnHideLeft);

        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i
            .test(navigator.userAgent)) 
        {
            this.swipe();
        }

        if (this.wrapper.offsetWidth <= this.container.offsetWidth) {
            buttons.forEach(btn => {
                btn.addEventListener("click", function(e) {
                    _this.switchingSlideBtn(this.className);
                });
                btn.style.display = "block";
            });
        } else {
            this.wrapper.classList.add(this.btnHideRight);
        }
        new ResizeObserver(entries => {
            console.log('ResizeObserver', this, entries);
            this.resizeWindow.bind(this)();
        }).observe(this.wrapper);

        // $(this.wrapper).get(0).addEventListener( "resize",  this.resizeWindow.bind(this) );
        window.addEventListener( "resize",  this.resizeWindow.bind(this) );
    }
}


$(document).ready(() => {
    const options = {
        "default": {
            'width': 400,
            'min_count': 1,
            'avg_count': 2,
            'max_count': 3
        },
        "type_2": {
            'width': 300,
            'min_count': 1,
            'avg_count': 1,
            'max_count': 3
        }
    }
    $("[data-wrapper-slider]").each(function() {
        let slider = new Slider(
            this,
            this.querySelector("[data-container-slider]")
        );
        slider.create(
            this.querySelectorAll("[data-slider-btn]"),
            this.dataset.wrapperSlider == "" ? options.default : options.type_2
        );
    });
});