const request = require('request');
require('dotenv').config({silent : true})
const striptags = require('striptags');

module.exports = {

  getArticles: function(callback) {
    let articles = [];
    request
    .get('http://www.isabellalowengrip.se/wp-json/wp/v2/posts', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        let posts = JSON.parse(body);
        posts = posts.map(extractIDAndContent);
        callback(posts);
      }
    })
  },
}

function extractIDAndContent(post) {
  return { 'id': post.id, 'title': striptags(post.title.rendered), 'post': striptags(post.content.rendered, ['p', 'ul', 'li', 'em', 'a']) };
}
