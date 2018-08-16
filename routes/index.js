const express = require('express');
const router = express.Router({mergeParams: true});

router.get('/', (request, response, next) => {
    response.status(200).send("Welcome to the Moby Dick Lorem Ipsum generator API. \nCheck the docs @ https://github.com/Recidvst/moby-dick-lorem-ipsum for endpoint info.");
});

module.exports = router;