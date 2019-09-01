// get core
const express = require('express');
// filesystem
const fs = require('fs');
// scraping
const requestP = require('request-promise');
const cheerio = require('cheerio');
// middleware
const cors = require('cors')
const morgan = require('morgan')

// utils
const slugify = require('./util/slugify.js');

// declare app
const app = express();
const port = ( process.env.NODE_ENV === 'production' ) ? process.env.PORT : 8000;

// middleware
app.use(morgan('combined'))
app.use(cors());

  // scrape destinations
  // moby dick = http://www.gutenberg.org/files/2701/2701-h/2701-h.htm
  // alice in winderland = https://www.gutenberg.org/files/11/11-h/11-h.htm
  // through the looking glass = https://www.gutenberg.org/files/12/12-h/12-h.htm

  // the url passed as an argument
  const bookURL = process.argv[2];

if (bookURL && bookURL !== '/' && bookURL !== '') {
  // set scrape url && requestP options (instruct cheerio)
  let options = {
    uri: bookURL,
    transform: function (body) {
      return cheerio.load(body);
    }
  };

    let bookName = '';
    let bookNameSlug = '';
    let titlesArray = [];
    let paragraphsArray = [];

    requestP(options)
    .then(function ($) {
      // scrape for titles and paragraphs
      let bookTitle = $('h1');
      let chapterTitles = $('h2');
      let paragraphs = $('p');

      // get book title
      if (bookTitle) {
        const nameText = $(bookTitle).text().trim(); // get text content
        if ( nameText !== '' ) {
          // update bookName text
          bookName = nameText;
          bookNameSlug = slugify(bookName);
        }
      }

      // get titles
      let chapterIterator = 1;
      $(chapterTitles).each( function(i, title) {
        let obj = {};
        let titleText = $(this).text().trim(); // get text content
        if ( titleText !== '' ) {
          if (titleText.indexOf('CHAPTER') > -1) {
            // populate obj
            obj.identifier = chapterIterator;
            // split unnecessary text out (e.g. "CHAPTER 6. The Street.")
            let splitText = titleText.split('. ');
            if (splitText && splitText.length > 1) {
              titleText = splitText[splitText.length - 1];
            }
            obj.content = titleText;
            // add to main array
            titlesArray.push(obj);
            chapterIterator++;
          }
        }
      });

      // get paras
      let titleIterator = 1;
      $(paragraphs).each( function(i, para) {
        let obj = {};
        const paraText = $(this).text().trim(); // get text content
        if ( paraText !== '' ) {
          // populate obj
          obj.identifier = titleIterator;
          obj.content = paraText;
          // add to main array
          paragraphsArray.push(obj);
          titleIterator++;
        }
      });
    })
    .then(function() {
      console.log('Done scraping');

      // parse arrays to json
      let titlesParsed = JSON.stringify(titlesArray, null, 4);
      let paragraphsParsed = JSON.stringify(paragraphsArray, null, 4);

      // get comma-less pseudo json for mLab import...
      let titlesStripped = titlesArray.map( item => {
        return JSON.stringify(item);
      }).join("\n");
      let paragraphsStripped = paragraphsArray.map( item => {
        return JSON.stringify(item);
      }).join("\n");

      // write json output to json files
      fs.writeFile(`content/${bookNameSlug}-titles.json`, titlesParsed, function(err) {
        console.log('Titles json file written!');
      });
      fs.writeFile(`content/${bookNameSlug}-paragraphs.json`, paragraphsParsed, function(err) {
        console.log('Paragraphs json file written!');
      });

      // write string output to txt files
      fs.writeFile(`content/${bookNameSlug}-titles.txt`, titlesStripped, function(err) {
        console.log('Titles string file written!');
      });
      fs.writeFile(`content/${bookNameSlug}-paragraphs.txt`, paragraphsStripped, function(err) {
        console.log('Paragraphs string file written!');
      });

    })
    .catch(function (err) {
      console.log(err);
    });

    console.log('working...');
}


// error handling?
process.on('uncaughtException', function (err) {
  console.error(err);
  console.error(err.stack);
});

module.exports = app;
