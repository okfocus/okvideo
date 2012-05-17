/*
 * OKVideo by OKFocus v1.4
 * http://okfoc.us 
 *
 * Copyright 2012, OKFocus
 * Licensed under the MIT license.
 *
 */

var player, OKEvents, options;

(function ($) {

    "use strict";
    
    $.okvideo = function (options) {

        // if the option var was just a string, turn it into an object
        if (typeof options !== 'object') options = { 'source' : options };

        var base = this;
        
        // kick things off
        base.init = function () {
            base.options = $.extend({}, $.okvideo.options, options);

            // draw a bigger div if set to 'adproof'
            if (base.options.adproof) {
                $('body').append('<div style="position:fixed;left:0;top:0;overflow:hidden;z-index:-998;height:100%;width:100%;" id="okplayer-mask"></div><div id="okplayer" style="position:fixed;left:0;top:0;overflow:hidden;z-index:-999;height:110%;width:110%;"></div>');
            } else {
                $('body').append('<div style="position:fixed;left:0;top:0;overflow:hidden;z-index:-998;height:100%;width:100%;" id="okplayer-mask"></div><div id="okplayer" style="position:fixed;left:0;top:0;overflow:hidden;z-index:-999;height:100%;width:100%;"></div>');
            }
            
            base.setOptions();

            if (base.options.source.provider === 'youtube') {
                base.loadYoutubeAPI();
            } else if (base.options.source.provider === 'vimeo') {
                base.options.volume /= 100;
                base.loadVimeoAPI();
            }
        };
        
        // clean the options
        base.setOptions = function () {
            // exchange 'true' for '1'
            for (var key in this.options){                
                if (this.options[key] === true) this.options[key] = 1;
            }            
            
            base.options.source = base.determineProvider();

            // pass options to the window
            $(window).data('okoptions', base.options);
        };

        // load the youtube api 
        base.loadYoutubeAPI = function () {
            base.insertJS('http://www.youtube.com/player_api');
        };

        // load the vimeo api by replacing the div with an iframe and loading js
        base.loadVimeoAPI = function() {
            $('#okplayer').replaceWith(function() {
                return '<iframe src="http://player.vimeo.com/video/' + base.options.source.id + '?api=1&js_api=1&title=0&byline=0&portrait=0&playbar=0&loop=' + base.options.loop + '&player_id=okplayer" frameborder="0" style="' + $(this).attr('style') + 'visibility:hidden;background-color:black;" id="' + $(this).attr('id') + '"></iframe>';
            });

            base.insertJS('http://a.vimeocdn.com/js/froogaloop2.min.js', function(){ 
                vimeoPlayerReady(); 
            });
        };

        // insert js into the head and exectue a callback function
        base.insertJS = function(src, callback){
            var tag = document.createElement('script');

            if (callback){
                if (tag.readyState){  //IE
                    tag.onreadystatechange = function(){
                        if (tag.readyState == "loaded" ||
                            tag.readyState == "complete"){
                            tag.onreadystatechange = null;
                            callback();
                        }
                    };
                } else {
                    tag.onload = function() {
                        callback();
                    }
                }
            }
            tag.src = src;
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        };

        // is it from youtube or vimeo?
        base.determineProvider = function () {            
            var a = document.createElement('a');
            a.href = base.options.source;

            if (/youtube.com/.test(base.options.source)){
                return { 'provider' : 'youtube', 'id' : a.search.slice(a.search.indexOf('v=') + 2) }
            } else if (/vimeo.com/.test(base.options.source)) {
                return { 'provider' : 'vimeo', 'id' : a.pathname.slice(1) }
            } else if (/[A-Za-z0-9_]+/.test(base.options.source)) {
                var id = new String(base.options.source.match(/[A-Za-z0-9_]+/));
                if (id.length == 11) {
                    return { 'provider' : 'youtube', 'id' : id };                
                } else {
                    for (var i = 0; i < base.options.source.length; i++) {
                        if (typeof parseInt(base.options.source[i]) != 'number') {
                            throw 'not vimeo but thought it was for a sec'
                        }
                    }
                    return { 'provider' : 'vimeo', 'id' : base.options.source };
                }
            } else {
                throw 'OKVideo: Invalid video source';
            }
        };

        base.init();
    };

    $.okvideo.options = {
        source: null,
        disableKeyControl: 1,
        captions: 0,
        loop: 1,
        hd: 1,
        volume: 0,
        adproof: false
    };

    $.fn.okvideo = function (options) {
        return this.each(function () {
            (new $.okvideo(options));
        });
    };

})(jQuery);

// vimeo player ready
function vimeoPlayerReady() {
    options = $(window).data('okoptions');

    var iframe = $('#okplayer')[0];
    player = $f(iframe);
    
    // hide player until Vimeo hides controls...
    window.setTimeout($('#okplayer').css('visibility', 'visible'), 2000);
    
    player.addEvent('ready', function () {
        player.api('play');
        if ('ontouchstart' in window.touchStart) {
            // mobile devices cannot listen for play event
            OKEvents.v.onPlay();
        } else {
            player.addEvent('play', OKEvents.v.onPlay());
        }
    });
}

// youtube player ready
function onYouTubePlayerAPIReady() {
    options = $(window).data('okoptions');
    player = new YT.Player('okplayer', {
        videoId: options.source.id,
        playerVars: {
            'autohide': 1,
            'autoplay': 0,
            'disablekb': options.keyControls,
            'cc_load_policy': options.captions,
            'controls': 0,
            'enablejsapi': 1,
            'fs': 0,
            'iv_load_policy': 1,
            'loop': options.loop,
            'showinfo': 0,
            'rel': 0,    
            'wmode': 'opaque',
            'hd': options.hd
        },
        events: {
            'onReady': OKEvents.yt.ready,
            'onStateChange': OKEvents.yt.onStateChange,
            'onError': OKEvents.yt.error
        }
    });
}

OKEvents = {
    yt: {
        ready: function(event){
            event.target.setVolume(options.volume);
            event.target.playVideo();
        },
        onStateChange: function(event){
            if (event.data === 0 && options.loop) event.target.playVideo();
        },
        error: function(event){
            throw event;
        }
    },
    v: {
        onPlay: function(){
            player.api('api_setVolume', options.volume);
        }
    }
};
