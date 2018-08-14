const express = require('express');
const router = express.Router({mergeParams: true});

router.get('/', (request, response, next) => {
    response.send('Welcome to the Moby Dick Lorem Ipsum generator API');
});

module.exports = router;