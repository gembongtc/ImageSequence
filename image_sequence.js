/*
# =1.0.1=
# -July 23 :
#   + add handler for init, rewindEnd , playEnd
#   + add yoyo , loop
# =1.0.2=
# -Aug 4 :
#   + getContainer
# -Aug 5 : 
#   + setButtonMode
# =1.0.3=
# +Toggle Mode
# +set positionTop, positionBottom for toggle
# =1.0.4=
# +container use string id or DOM element
# custom
*/
var ImageSequence = function(_cont, _width, _handler, _type, _fps){
    this.dev = false;
    var container;
    if (_cont != undefined || _cont != null) {
        if (typeof _cont === "string") {
            container = document.getElementById(_cont);
        }else{
            container = _cont;
        }
    }
    
    console.log(container);     
    var fps = _fps || 24;
    var width = _width;
    var totalWidth = container.offsetWidth;
    var currentFrame = 1;
    var totalFrame = totalWidth/width;
    var handler = _handler;
    var timer, count;
    var type = _type || "normal";
    var y = "0%";
    var _this = this;
    
    this.isPlay = false;
    this.isRewind = false;
    
    var playHandler = function(yoyo, loop, to, override){
        if (currentFrame < totalFrame) {
            if (_this.dev)console.log("play handler : ",container.id, (-width * currentFrame) + "px "+y);
            container.style.backgroundPosition = (-width * currentFrame) + "px "+y;
            currentFrame++;
        } else {
            clearInterval(timer);
            
            if (loop > 0){
                count = loop-1;
                if (yoyo == true){
                    _this.rewind(yoyo, loop-1, override);
                }else{
                    _this.stop();
                    _this.play(yoyo, loop-1, override);
                }
            }else if (loop < 0) {
                if (yoyo == true){
                    _this.rewind(yoyo, -1, override);
                }else{
                    _this.stop();
                    _this.play(yoyo, -1, override);
                }
            }else{
                currentFrame = totalFrame-1;
                if (type == "background") {
                    _this.stop();
                    _this.setCurrentFrame(0);
                    container.style.display = "none";
                    container.style.opacity = "0";
                }
                _this.isPlay = false;
            }
            
            if (handler) if ( handler.playEnd instanceof Function ) handler.playEnd();
        }
    }
    
    var rewindHandler = function(yoyo, loop, to, override){
        if (currentFrame > -1) {
            container.style.backgroundPosition = (-width * currentFrame) + "px "+y;
            currentFrame--;
        } else {
            clearInterval(timer);            
            
            if (loop > 0){
                count = loop-1;
                if (yoyo == true){
                    _this.play(yoyo, loop-1, override);
                }else{
                    currentFrame = totalFrame;
                    _this.rewind(yoyo, loop-1, override);
                }
            }else if (loop < 0) {
                if (yoyo == true){
                    _this.play(yoyo, -1, override);
                }else{
                    currentFrame = totalFrame;
                    _this.rewind(yoyo, -1, override);
                }
            }else{
                currentFrame = 0;
                _this.isRewind = false;
            }
            
            if (handler) if ( handler.rewindEnd instanceof Function ) handler.rewindEnd();
        }
    }
    
    var playHandlerTo = function(yoyo, loop, to){
        if (currentFrame < totalFrame && currentFrame < to) {
            container.style.backgroundPosition = (-width * currentFrame) + "px "+y;
            currentFrame++;
            console.log("playHandlerTo", currentFrame);
        } else {
            clearInterval(timer);
            if (handler) if ( handler.playEnd instanceof Function ) handler.playEnd();
            if (currentFrame < 0) {
                currentFrame = totalFrame-1;
            }
            console.log("playHandlerToEnd", currentFrame);
        }
    }
    
    var rewindHandlerTo = function(yoyo, loop, to){
        if (currentFrame > -1 && currentFrame > to) {
            container.style.backgroundPosition = (-width * currentFrame) + "px "+y;
            currentFrame--;
            console.log("rewindHandlerTo", currentFrame);
        } else {
            clearInterval(timer);            
            if (handler) if ( handler.rewindEnd instanceof Function ) handler.rewindEnd();
            if (currentFrame < 0) {
                currentFrame = 0;
            }
            console.log("rewindHandlerToEnd", currentFrame);
        }
    }
    
    var onRoll = function (e){
        _this.play();
    }
    var onOut = function (e){
        _this.rewind();
    }
    var goToHandler = function(to){
        // to = 2, curr = 97
        currentFrame += Math.ceil(( 0.05 * (to - currentFrame) ));
        
        if (currentFrame > -1 && currentFrame < totalFrame) {
            container.style.backgroundPosition = (-width * currentFrame) + "px "+y;
        } else {
            clearInterval(timer);            
        }
    }
    
    this.getTotalFrame = function(){return totalFrame}
    this.getCurrentFrame = function(){return currentFrame}
    this.getContainer = function(){return container}
    this.getCount = function(){return count}
    
    this.init = function(){
        if (container) {
            if (_this.dev) console.log("init :",container.getAttribute("id"));
            
            clearInterval(timer);
            
            container.setAttribute("scaling","none");
            container.style.width = width+"px";
            container.style.backgroundImage = "url("+container.getAttribute('src')+")";
            container.style.backgroundPosition = "0px "+y;
            currentFrame = 0;
            
            switch(type){
                case "toggle":
                    container.style.height = container.offsetHeight/2+"px";
                case "button":
                    _this.enableButton();
                    break;
            }
            if (handler) if ( handler.init instanceof Function ) handler.init();
        }else{
            console.log("init failed");
        }
    }
    this.play = function(_yoyo, _loop, _override ){
        if (container) {
            if (_this.dev) console.log("play :",container.getAttribute("id"));
            if (!_this.isPlay) {
                if (type == "background") {
                    container.style.display = "block";
                    container.style.opacity = "1";
                }
                currentFrame += 1;
                clearInterval(timer);
                
                var yoyo = (_yoyo == undefined || _yoyo == null )? false : _yoyo;
                var loop = (_loop == undefined || _loop == null )? 0 : _loop;
                var override = (_override == undefined || _override == null )? true : _override;
                if (!override) _this.isPlay = true;
                
                count = loop;
                timer = setInterval(playHandler, 1000 / fps, yoyo, loop, override);
            }
        }else{
            if (_this.dev) console.log("play failed");
        }
    }
    
    this.rewind = function(_yoyo, _loop, _override){
        if (container) {
            if (_this.dev) console.log("rewind :",container.getAttribute("id"));
            if (!_this.isRewind){
                clearInterval(timer);
                currentFrame -= 1;
                
                var yoyo = (_yoyo == undefined || _yoyo == null )? false : _yoyo;
                var loop = (_loop == undefined || _loop == null )? 0 : _loop;
                var override = (_override == undefined || _override == null )? false : _override;
                if (override) _this.isRewind = true;
                
                count = loop;
                timer = setInterval(rewindHandler, 1000 / fps, yoyo, loop, override);
            }
        }else{
            if (_this.dev) console.log("rewind failed");
        }
    }
    
    this.pause = function(){
        clearInterval(timer);
        _this.isPlay = false;
        _this.isRewind = false;
    }
    
    this.stop = function(){
        if (container){
            _this.isPlay = false;
            _this.isRewind = false;
            clearInterval(timer);
            container.style.backgroundPosition = "0px "+y;
            currentFrame = 0;
        }
    }
    /*
    @ set current frame to destination frame without animation
    @ params _frame : destination frame
    @ ex : intro.setCurrentFrame( intro.getTotalFrame() );
    */
    this.setCurrentFrame = function(_frame){
        if (_frame < totalFrame && _frame > -1) {
            currentFrame = _frame;
            container.style.backgroundPosition = (-width * currentFrame) + "px "+y;
        }
    }
    /*
    @ change background position to bottom, used on toggle type sequence
    @ ex : toggleAudio.positionBottom(); // mute
    */
    this.positionBottom = function(){
        if (container) {
            y = "100%";
            this.setCurrentFrame(currentFrame);
        }
    }
    /*
    @ change background position to top, used on toggle type sequence
    @ ex : toggleAudio.positionTop(); // unmute
    */
    this.positionTop = function(){
        if (container) {
            y = "0%";
            this.setCurrentFrame(currentFrame);
        }
    }
    /*
    @ rewind sequence to destination frame
    @ params _frame : destination frame
    @ intro.rewindTo(1); // current frame goto frame 1
    */
    this.rewindTo = function(_frame){
        if (container) {
            if (_this.dev) console.log("rewind :",container.getAttribute("id"));
            
            clearInterval(timer);
            currentFrame -= 1;
            
            var yoyo = false;
            var loop = 0;
            var to = _frame || null;
            count = loop;
            timer = setInterval(rewindHandlerTo, 1000 / fps, yoyo, loop, to);
        }else{
            if (_this.dev) console.log("rewind failed");
        }
    }
    /*
    @ play sequence to destination frame
    @ params _frame : destination frame
    @ intro.playTo(20); // current frame goto frame 20
    */
    this.playTo = function(_frame){
        if (container) {
            if (_this.dev) console.log("play :",container.getAttribute("id"));
            
            if (type == "background") {
                container.style.display = "block";
                container.style.opacity = "1";
            }
            
            currentFrame += 1;
            clearInterval(timer);
            
            var yoyo = false;
            var loop = 0;
            var to = _frame || null;
            count = loop;
            timer = setInterval(playHandlerTo, 1000 / fps, yoyo, loop, to);
        }else{
            if (_this.dev) console.log("play failed");
        }
    }
    /*
    @ set current frame to destination frame with animation forward or backward
    @ params _frame : destination frame
    @ intro.goTo( intro.getTotalFrame() ); // current frame goto totalFrame
    */
    this.goTo = function(_frame){
        if (container) {
            clearInterval(timer);
            timer = setInterval(goToHandler, 1000 / fps, _frame);
        }
        
    }
    /*
    @ disable toggle or button type
    */
    this.disableButton = function(){
        if (container && (type == "button" || type == "toggle")) {
            container.style.cursor = "default";
            container.removeEventListener("mouseover", onRoll);
            container.removeEventListener("mouseout", onOut);
        }
    }
    /*
    @ enable toggle or button type
    */
    this.enableButton = function(){
        if (container && (type == "button" || type == "toggle")) {
            container.style.cursor = "pointer";
            
            container.removeEventListener("mouseover", onRoll);
            container.removeEventListener("mouseout", onOut);
            
            container.addEventListener("mouseover", onRoll);
            container.addEventListener("mouseout", onOut);   
        }
    }

    /*
    @ add handler to current container
    @ params init : function(){},
    @ params playEnd : function(){},
    @ params rewindEnd : function(){}
    */
    this.addHandler = function(obj){
        handler = obj;
    }
    
    this.init();
}