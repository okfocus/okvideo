# OKVideo

OKVideo is a jQuery plugin that allows for YouTube or Vimeo videos to be used as full-screen backgrounds on webpages. OKVideo aims to be customizable while making some basic decisions about how the plugin should control video.


## Usage

After including jQuery and the OKVideo plugin, instantiate OKVideo like so :

``` js

$(function(){
  $.okvideo({ source: '[:id]' }) // [:id] refers to a YouTube or Vimeo ID
}

```

Alternatively, OKVideo conveniently will accept and parse full urls from YouTube or Vimeo:

``` js

$(function(){
  $.okvideo({ source: '[:url]' }) // [:url] refers to a YouTube or Vimeo URL
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
	  <td>boolean: 0 or 1</td>
	</tr>
    <tr>
      <td>captions</td>
      <td>enable or disable captions (youtube videos only)</td>
	  <td>boolean: 0 or 1</td>
	</tr>
    <tr>
      <td>loop</td>
	  <td>loop the video</td>
	  <td>boolean: 0 or 1</td>
	</tr>
  </tbody>
</table>
