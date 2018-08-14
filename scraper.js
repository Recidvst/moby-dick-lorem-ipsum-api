// get core
const express = require('express');
// filesystem
const fs = require('fs');
// scraping
const request = require('request');
const cheerio = require('cheerio');
// middleware
const cors = require('cors')
const morgan = require('morgan')
const pretty = require('express-prettify');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const parseString = require('xml2js').parseString;

// declare app
const app = express();
const port = ( process.env.NODE_ENV === 'production' ) ? process.env.PORT : 8000;
// middleware
app.use(morgan('combined'))
app.use(cors());
app.use(pretty({ always: true, spaces: 2 }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/scrape', function(req, res){

  url = 'http://www.gutenberg.org/files/2701/2701-h/2701-h.htm';

  request(url, function(error, response, html){
    
    console.log('Requesting...');
    
        if(!error){
            var $ = cheerio.load(html, { xmlMode: true });

            var paragraphs = $('p').textContent;
            var stringParagraphs = JSON.stringify(paragraphs, null, 4);

            res.send(paragraphs);

            fs.writeFile('outputString.json', data, function(err) {            
                console.log('File successfully written!');        
            });            
    
        }

    });

});

// set the server listening
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

console.log('Load "http://localhost:PORT/scrape" to request scrape data');

// error handling?
process.on('uncaughtException', function (err) {
    console.error(err);
    console.error(err.stack);
});

module.exports = app;