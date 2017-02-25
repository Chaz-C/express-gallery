
HandleBars.registerHelper("small", function(value, options) {
  let count = 0;
  let html = '';

  for (var i = 1; i < value.length; i++) {

    if (count === 3 ) {
      html += '<hr>';
    }

    html +=
`<div class="small-photo-box">
  <a href="/gallery/${options.fn(items[i])}">
    <div class="photos" style="background:url(${options.fn(items[i])}); background-size: cover; background-position: center;
    "></div>
  </a>
  <div class="photo-info">
    Author: ${options.fn(items[i])} <br>
    Description: ${options.fn(items[i])} <br>
  </div>
</div>
`;

count++;
  }
  return html;
});