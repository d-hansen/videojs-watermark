import videojs from 'video.js';

// Default options for the plugin.
const defaults = {
  position: 'top-right',
  fadeTime: 3000,
  url: undefined,
  image: undefined
};

/**
 * Function to invoke when the player is ready.
 *
 * This is a great place for your plugin to initialize itself. When this
 * function is called, the player will have its DOM and child components
 * in place.
 *
 * @function onPlayerReady
 * @param    {Player} player
 * @param    {Object} [options={}]
 */
const onPlayerReady = (player, options) => {
  player.addClass('vjs-watermark');

  // if there is no image set just exit
  if (!options.image) {
    return;
  }
  // Add a div and img tag
  const videoEl = player.el();
  const div = document.createElement('div');
  const img = document.createElement('img');

  div.id = 'vjs-watermark';
  div.classList.add('vjs-watermark-content');
  div.classList.add(`vjs-watermark-${options.position}`);
  img.src = options.image;

  // if a url is provided make the image link to that URL.
  if (options.url) {
    const a = document.createElement('a');

    a.href = '#';
    // if the user clicks the link pause and open a new window
    a.onclick = (e) => {
      e.preventDefault();
      player.pause();
      window.open(options.url);
    };
    a.appendChild(img);
    div.appendChild(a);
  } else {
    div.appendChild(img);
  }
  videoEl.appendChild(div);

  player.on('play', () => {
    setTimeout(
      () => document.getElementById('vjs-watermark').classList.add('vjs-watermark-fade'),
    options.fadeTime);
  });
};

/**
 * A video.js plugin.
 *
 * In the plugin function, the value of `this` is a video.js `Player`
 * instance. You cannot rely on the player being in a "ready" state here,
 * depending on how the plugin is invoked. This may or may not be important
 * to you; if not, remove the wait for "ready"!
 *
 * @function watermark
 * @param    {Object} [options={}]
 *           An object of options left to the plugin author to define.
 */
const watermark = function(options) {
  this.ready(() => {
    onPlayerReady(this, videojs.mergeOptions(defaults, options));
  });
};

// Register the plugin with video.js.
videojs.plugin('watermark', watermark);

// Include the version number.
watermark.VERSION = '__VERSION__';

export default watermark;