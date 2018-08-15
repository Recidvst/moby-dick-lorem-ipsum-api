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

// declare app
const app = express();
const port = ( process.env.NODE_ENV === 'production' ) ? process.env.PORT : 8000;

// middleware
app.use(morgan('combined'))
app.use(cors());

  // set scrape url && requestP options (instruct cheerio)
  url = 'http://www.gutenberg.org/files/2701/2701-h/2701-h.htm'; // open license
  let options = {
      uri: url,
      transform: function (body) {
          return cheerio.load(body);
      }
  };  
  let titlesArray = [];
  let paragraphsArray = [];

  requestP(options)
    .then(function ($) {     
        // scrape for titles and paragraphs   
        let chapterTitles = $('h2');
        let paragraphs = $('p');

        // get titles
        $(chapterTitles).each( function(i, title) {  
            let obj = {};
            var text = $(this).text().trim(); // get text content
            if ( text !== '' ) {
                // populate obj
                obj.identifier = i;
                obj.content = text;
                // add to main array
                titlesArray.push(obj);
            }             
        });
        
        // get paras
        $(paragraphs).each( function(i, para) {  
            let obj = {}; 
            var text = $(this).text().trim(); // get text content
            if ( text !== '' ) {
                // populate obj
                obj.identifier = i;
                obj.content = text;
                // add to main array
                paragraphsArray.push(obj); 
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
        fs.writeFile('titles.json', titlesParsed, function(err) {            
            console.log('Titles json file written!');        
        }); 
        fs.writeFile('paragraphs.json', paragraphsParsed, function(err) {            
            console.log('Paragraphs json file written!');        
        }); 

        // write string output to txt files 
        fs.writeFile('titles.txt', titlesStripped, function(err) {            
            console.log('Titles string file written!');        
        }); 
        fs.writeFile('paragraphs.txt', paragraphsStripped, function(err) {            
            console.log('Paragraphs string file written!');        
        }); 

    })
    .catch(function (err) {
        console.log(err);
    });

    console.log('working...');

// error handling?
process.on('uncaughtException', function (err) {
    console.error(err);
    console.error(err.stack);
});

module.exports = app;