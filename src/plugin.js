import videojs from 'video.js';

// Default options for the plugin.
const defaults = {
  position: 'top-right',
  fadeTime: null,
  url: undefined,
  image: undefined,
  text: undefined,
};

/**
 * Sets up the div, img or text and optional a tags for the plugin.
 *
 * @function setupWatermark
 * @param    {Player} player
 * @param    {Object} [options={}]
 */
const setupWatermark = (player, options) => {
  // Add a div and img tag
  const videoEl = player.el();
  const div = document.createElement('div');
  let img;
  let text;

  div.classList.add('vjs-watermark-content');
  div.classList.add(`vjs-watermark-${options.position}`);

  if (options.image) {
    img = document.createElement('img');
    img.src = options.image;
    img.width = player.width_;
  }

  if (options.text) {
    text = document.createElement('p');
    text.innerText = options.text;
    text.classList.add('vjs-watermark-text');
  }

  // if a url is provided make the image link to that URL.
  if (options.url) {
    const a = document.createElement('a');

    a.href = options.url;
    // if the user clicks the link pause and open a new window
    a.onclick = function (e) {
      e.preventDefault();
      player.pause();
      window.open(options.url);
    };
    if (img) { a.appendChild(img); }
    if (text) { a.appendChild(text); }
    div.appendChild(a);
  } else {
    // pass through any clicks on the div
    div.onclick = function (e) { player.handleTechClick_(player.tech_); }
    if (img) { div.appendChild(img); }
    if (text) { div.appendChild(text); }
  }
  videoEl.appendChild(div);
};

/**
 * Fades the watermark image.
 *
 * @function fadeWatermark
 * @param    {Object} [options={
 *                  fadeTime:
 *                  'The number of milliseconds before the inital watermark fade out'}]
 */
const fadeWatermark = (options) => {
  setTimeout(
    () => document.getElementsByClassName('vjs-watermark-content')[0]
      .classList.add('vjs-watermark-fade'),
    options.fadeTime
  );
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
  if (!(options.image || options.text)) { return; }
  setupWatermark(player, options);

  // Setup watermark autofade
  if (options.fadeTime === null) {
    return;
  }

  player.on('play', () => fadeWatermark(options));
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
videojs.registerPlugin('watermark', watermark);

// Include the version number.
watermark.VERSION = '__VERSION__';

export default watermark;
