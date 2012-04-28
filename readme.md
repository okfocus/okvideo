# OKVideo

OKVideo is a jQuery plugin that allows for YouTube or Vimeo videos to be used as full-screen backgrounds on webpages. OKVideo aims to be customizable while making some basic decisions about how the plugin should control video.

OKVideo uses the new YouTube IFrame API which does not require any Flash objects to be present on your website. This means that mobile devices will play video served by OKVideo. Content from Vimeo is served in a similar manner, although sometimes their videos will still be served in Flash.

## Usage

After including jQuery and the OKVideo plugin, instantiate OKVideo like so:

``` js

$(function(){
  $.okvideo({ source: '[:id]' }) // [:id] refers to a YouTube or Vimeo ID
}

```

OKVideo conveniently will accept and parse full urls from YouTube or Vimeo:

``` js

$(function(){
  $.okvideo({ source: '[:url]', loop: 0 }) // [:url] refers to a YouTube or Vimeo URL
}

```

You can also simply pass an id or url if no other options are desired:

``` js

$(function(){
  $.okvideo('[:url]') // [:url] refers to a YouTube or Vimeo URL
}

```


## Options

<table>
  <tbody>
    <tr>
      <th>option</th>
	  <th>description</th>
	  <th>default</th>
	</tr>
    <tr>
     <td>source</td>
	   <td>an id or url from vimeo or youtube</td>
	   <td>null</td>
	</tr>
    <tr>
      <td>disablekeyControl</td>
	   <td>enable or disable key control (youtube videos only)</td>
	   <td>1</td>
	</tr>
    <tr>
      <td>captions</td>
      <td>enable or disable captions (youtube videos only)</td>
	   <td>0</td>
	</tr>
    <tr>
      <td>loop</td>
  	  <td>loop the video</td>
	    <td>1</td>
	</tr>
  </tbody>
</table>
