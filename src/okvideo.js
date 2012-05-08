/*
 * OKVideo by OKFocus v1.1
 * http://okfoc.us 
 *
 * Copyright 2012, OKFocus
 * Licensed under the MIT license.
 *
 */

var player, OKEvents;

(function ($) {
    
    $.okvideo = function (options) {

        if (typeof options !== 'object') options = { 'source' : options };

        var base = this;

        base.init = function () {
            base.options = $.extend({}, $.okvideo.options, options);
            
            $('body').append('<div style="position:fixed;left:0;top:0;overflow:hidden;z-index:-998;height:100%;width:100%;" id="okplayer-mask"></div><div id="okplayer" style="position:fixed;left:0;top:0;overflow:hidden;z-index:-999;height:100%;width:100%;"></div>');
            
            base.setOptions();

            if (base.options.source.provider === 'youtube') {
                base.loadYoutubeAPI();
            } else if (base.options.source.provider === 'vimeo') {
                base.loadVimeoAPI();
            }
        };
        
        base.setOptions = function () {
            base.options.source = base.determineProvider();
            $(window).data('okoptions', base.options);
        };

        base.loadYoutubeAPI = function () {
            base.insertJS('http://www.youtube.com/player_api');
        };

        base.loadVimeoAPI = function() {
            $('#okplayer').replaceWith(function() {
                return '</div><iframe src="http://player.vimeo.com/video/' + base.options.source.id + '?api=1&js_api=1&title=0&byline=0&portrait=0&playbar=0&autoplay=1&loop=' + base.options.loop + '&player_id=okplayer" frameborder="0" style="' + $(this).attr('style') + '" id="' + $(this).attr('id') + '"></iframe>';
            });

            base.insertJS('http://a.vimeocdn.com/js/froogaloop2.min.js', function(){ 
                vimeoPlayerReady() 
            });
        };

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

        base.determineProvider = function () {
            if (/youtube.com/.test(base.options.source) || /vimeo.com/.test(base.options.source)) {
                return base.parseVideoURL(base.options.source);
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
            }
        };

        base.parseVideoURL = function(url) {

            var retVal = {};
            var matches;
    
            function getParm(url, param) {
                var re = new RegExp("(\\?|&)" + param + "\\=([^&]*)(&|$)");
                var matches = url.match(re);
                if (matches) {
                    return(matches[2]);
                } else {
                    return("");
                }
            }
            
            if (url.indexOf("youtube.com/watch") != -1) {
                retVal.provider = "youtube";
                retVal.id = getParm(url, "v");
            } else if (matches = url.match(/vimeo.com\/(\d+)/)) {
                retVal.provider = "vimeo";
                retVal.id = matches[1];
            }
            return(retVal);
        };

        base.init();
    };

    $.okvideo.options = {
        source: null,
        disableKeyControl: 1,
        captions: 0,
        loop: 1,
        mute: null
    };

    $.fn.okvideo = function (options) {
        return this.each(function () {
            (new $.okvideo(options));
        });
    };

})(jQuery);

function vimeoPlayerReady() {   

    var vimeoPlayers = document.querySelectorAll('iframe');
    for (var i = 0, length = vimeoPlayers.length; i < length; i++) {        
        $f(vimeoPlayers[i]).addEvent('ready', OKEvents.v.ready);
    }
}

function onYouTubePlayerAPIReady() {
    var options = $(window).data('okoptions');
    player = new YT.Player('okplayer', {
        videoId: options.source.id,
        playerVars: {
            'autohide': 1,
            'autoplay': 1,
            'disablekb': options.keyControls,
            'cc_load_policy': options.captions,
            'controls': 0,
            'enablejsapi': 1,
            'fs': 0,
            'iv_load_policy': 1,
            'loop': options.loop,
            'showinfo': 0,
            'rel': 0,            
            'wmode': 'opaque'
        },
        events: {
            'onReady': OKEvents.yt.ready,
            'onError': OKEvents.yt.error
        }
    });
}

OKEvents = {
    yt: {
        ready: function(event){
            if (options.mute) event.target.mute();
        },
        error: function(event){
            throw event;
        }
    },
    v: {
        ready: function(player_id){
            if (options.mute) $f(player_id).api('api_setVolume', 0);
        }
    }
};
