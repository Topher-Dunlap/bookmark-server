const express = require('express');
const bookmarkRouter = express.Router();
const {v4: uuid} = require('uuid');
const logger = require('./logger');
const bodyParser = express.json();
const { bookmarks } = require('./store');

bookmarkRouter
    .route('/bookmarks')
    ///GET REQ
    .get((req, res) => {
        res.json(bookmarks);
    })
    ///POST REQ
    .post(bodyParser, (req, res) => {
        const { title, url, description, rating } = req.body;

        /// Validate that values exist exist
        if (!title) {
            logger.error(`Title is required`);
            return res
                .status(400)
                .send('Invalid data');
        }
        if (!url) {
            logger.error(`URL is required`);
            return res
                .status(400)
                .send('Invalid data');
        }
        if (!description) {
            logger.error(`Description is required`);
            return res
                .status(400)
                .send('Invalid data');
        }
        if (!rating) {
            logger.error(`Rating is required`);
            return res
                .status(400)
                .send('Invalid data');
        }

        /// If bookmark exists, generate an ID
        const id = uuid();
        const bookmark = {
            id,
            title,
            description,
            rating,
        };

        /// Push a bookmark object into the array.
        bookmarks.push(bookmark);

        /// log the card creation and send a response including a location header
        logger.info(`Bookmark with id ${id} created`);
        res
            .status(201)
            .location(`http://localhost:8000/card/${id}`)
            .json(bookmark);

    })

bookmarkRouter
    .route('/bookmarks/:id')
    .get((req, res) => {
        const {id} = req.params;
        const bookmark = bookmarks.find(c => c.id == id);

        // make sure we found bookmark
        if(!bookmark) {
            logger.error(`Bookmark with id ${id} not found.`);
            return res
                .status(404)
                .send('Bookmark Not Found');
        }
        res.json(bookmark);
    })

    /// DELETE REQ
    .delete((req, res) => {
        const {id} = req.params;
        const bookmarkIndex = bookmarks.findIndex(c => c.id == id);

        if (bookmarkIndex === -1) {
            logger.error(`Bookmark with id ${id} not found.`);
            return res
                .status(404)
                .send('Not Found');
        }

        /// Remove Bookmark
        bookmarks.splice(bookmarkIndex, 1);
        logger.info(`Bookmark with id ${id} deleted.`)

        res
            .status(204)
            .end();

    })

module.exports = bookmarkRouter