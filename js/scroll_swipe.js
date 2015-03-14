var scrollPanes = function(section){
    var divs = section.querySelectorAll('.panel');
    var step = 0;
    var maxSteps = divs.length;
    var width = window.innerWidth;

    var currentScroll;
    section.addEventListener('scroll', function(event){
        currentScroll = event.target.scrollLeft;
    })

    var prevScroll;
    var idTimeout;

    section.addEventListener('touchend', function(event){
        function endScroll(){
            clearTimeout(idTimeout);
            idTimeout = setTimeout(function(){
                if(currentScroll === prevScroll){
                    actionEndScroll();
                    return;
                }
                prevScroll = currentScroll;
                endScroll();
            }, 100);
        }
        endScroll();

        function actionEndScroll(){
            var scroll = section.scrollLeft;
            var step = section.scrollLeft / width;
            step = Math.round(step);
            goToStep(step, true);
        }
    });

    function goToStep(goTo, force){
        if(!force && step == goTo){
            return;
        }
        
        step = goTo;
        currentScroll = step*width;
        prevScroll = currentScroll;
        smooth_scroll_to(section, currentScroll, 150, function(){
            nextStepEvent.step = step;
            section.dispatchEvent(nextStepEvent);
        });
    }

    window.addEventListener("resize", function(){
        width = window.innerWidth;
        goToStep(step, true);
    });
    
    var nextStepEvent = new CustomEvent(
                        "nextStepEvent", 
                        {
                            bubbles: true,
                            cancelable: true
                        }
                    );

    return {
        goToStep: goToStep
    }
}

//https://coderwall.com/p/hujlhg/smooth-scrolling-without-jquery

/**
    Smoothly scroll element to the given target (element.scrollLeft)
    for the given duration

    Returns a promise that's fulfilled when done, or rejected if
    interrupted
 */
var smooth_scroll_to = function(element, target, duration, callback) {
    target = Math.round(target);
    duration = Math.round(duration);
    if (duration < 0) {
        return;
    }
    if (duration === 0) {
        element.scrollLeft = target;
        callback();
        return;
    }

    var start_time = Date.now();
    var end_time = start_time + duration;

    var start_top = element.scrollLeft;
    var distance = target - start_top;

    // based on http://en.wikipedia.org/wiki/Smoothstep
    var smooth_step = function(start, end, point) {
        if(point <= start) { return 0; }
        if(point >= end) { return 1; }
        var x = (point - start) / (end - start); // interpolation
        return x*x*(3 - 2*x);
    }

    
        // This is to keep track of where the element's scrollLeft is
        // supposed to be, based on what we're doing
        var previous_top = element.scrollLeft;

        // This is like a think function from a game loop
        var scroll_frame = function() {
            if(element.scrollLeft != previous_top) {
                callback();
                return;
            }

            // set the scrollLeft for this frame
            var now = Date.now();
            var point = smooth_step(start_time, end_time, now);
            var frameTop = Math.round(start_top + (distance * point));
            element.scrollLeft = frameTop;

            // check if we're done!
            if(now >= end_time) {
                callback();
                return;
            }

            // If we were supposed to scroll but didn't, then we
            // probably hit the limit, so consider it done; not
            // interrupted.
            if(element.scrollLeft === previous_top
                && element.scrollLeft !== frameTop) {
                callback();
                return;
            }
            previous_top = element.scrollLeft;

            // schedule next frame for execution
            setTimeout(scroll_frame, 0);
        }

        // boostrap the animation process
        setTimeout(scroll_frame, 0); 
}