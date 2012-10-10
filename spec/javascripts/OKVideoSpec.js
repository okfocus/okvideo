describe('okvideo', function() {

  describe('will accept', function(){

    afterEach(function(){
      expect($('#okplayer')).toExist();
      expect($('#okplayer-mask')).toExist();
      expect($('#okplayer-mask')).toBe('div');
      $('#okplayer, #okplayer-mask').remove();
      $('script').each(function(){
        if ($(this).attr('src') === 'http://www.youtube.com/player_api' ||
            $(this).attr('src') === 'http://a.vimeocdn.com/js/froogaloop2.min.js' ||
            $(this).attr('async') === 'async') $(this).remove();
      });
    });

    it('a youtube id', function(){
      $.okvideo({ source: 'u1zgFlCw8Aw' });
      waits(2000);
      runs(function(){
        expect($('#okplayer').attr('src').split('.')[1]).toEqual('youtube');
      });
    });

    it('a youtube url', function(){
      $.okvideo({ source: 'http://www.youtube.com/watch?v=u1zgFlCw8Aw' });
      waits(2000);
      runs(function(){
        expect($('#okplayer').attr('src').split('.')[1]).toEqual('youtube');
      });
    });

    it('a vimeo id', function(){
      $.okvideo({ source: '41091645' });
      waits(2000);
      runs(function(){
        expect($('#okplayer').attr('src').split('.')[1]).toEqual('vimeo');
      });

    });

    it('a vimeo url', function(){
      $.okvideo({ source: 'http://vimeo.com/41091645' });
      waits(2000);
      runs(function(){
        console.log($('#okplayer'));
        expect($('#okplayer').attr('src').split('.')[1]).toEqual('vimeo');
      });
    });

    it('a video as a string', function(){
      $.okvideo('41091645');
      waits(2000);
      runs(function(){
        expect($('#okplayer').attr('src').split('.')[1]).toEqual('vimeo');
      });
    });

  });

});
