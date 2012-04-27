/*
 * OKType by OKFocus v1.0.0
 * http://okfoc.us 
 *
 * Copyright 2012, OKFocus
 * Licensed under the MIT license.
 *
 */

var player, OKEvents;

(function ($) {
    
    $.okvid = function (options) {
        var base = this;

        base.init = function () {
            base.options = $.extend({}, $.okvid.options, options);
            
            $('body').append('<div id="player" style="position:fixed;left:0;top:0;overflow:hidden;z-index:-999;height:100%;width:100%;"></div>');
            
            base.setOptions();

            if (base.options.source.provider === 'youtube'){
                base.loadYoutubeAPI();
            } else if (base.options.source.provider === 'vimeo'){
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
            $('#player').replaceWith(function() {
                return '<iframe src="http://player.vimeo.com/video/' + base.options.source.id + '?api=1" frameborder="0" style="' + $(this).attr('style') + '" id="' + $(this).attr('id') + '"></iframe>';
            });
            base.insertJS('https://raw.github.com/gist/2504066/648698df42b2a093e46b0fdb2e94a7ff8e2bad6a/froogaloop.js', function(){ vimeo() });
        };

        base.insertJS = function(src, callback){
            var tag = document.createElement('script');
            tag.src = src;
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            if (typeof callback === 'function') {
                tag.onload = function() {
                    callback();
                }
            }
        };

        base.determineProvider = function () {
            if (/youtube.com/.test(base.options.source) || /vimeo.com/.test(base.options.source)) {
                return base.parseVideoURL(base.options.source);
            } else if (/[A-Za-z0-9_]+/.test(base.options.source)) {
                var id = base.options.source.match(/[A-Za-z0-9_]+/);
                if (!id.length === 11) throw "not youtube but thought it was for a sec";
                return { 'provider' : 'youtube', 'id' : id };
            } else {
                for (var i = 0; i < base.options.source.length; i++) {
                    if (typeof base.options.source[i] != 'number') {
                        throw 'not vimeo but thought it was for a sec'
                        break;
                    }
                }
                return { 'provider' : 'vimeo', 'id' : base.options.source };
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
    
    $.okvid.options = {
        source: null,
        autohide: '1',
        autoplay: '1',
        keyControls: '1',
        captions: '0',
        annotations: 3,
        loop: 1
    };

    $.fn.okvid = function (options) {
        return this.each(function () {
            (new $.okvid(options));
        });
    };

})(jQuery);

function vimeo() {
    var vimeo = $f(document.getElementById('player'));
    vimeo.addEvent('ready', function() {
        console.log(this);
//        vimeo.setVolume(0);
        vimeo.play();
  //      vimeo.setLoop(true);
    }); 
}

function onYouTubePlayerAPIReady() {
    var options = $(window).data('okoptions');
    player = new YT.Player('player', {
        videoId: options.source.id,
        playerVars: {
            'autohide': options.autohide,
            'autoplay': options.autoplay,
            'disablekb': options.keyControls,
            'cc_load_policy': options.captions,
            'controls': 0,
            'enablejsapi': 1,
            'fs': 0,
            'iv_load_policy': options.annotations,
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
            event.target.mute();
        },
        stateChange: function(event){
            // buffering notice
        },
        error: function(event){
            throw event;    
        }
    }
};

