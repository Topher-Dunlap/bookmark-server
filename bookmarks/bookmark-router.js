const express = require('express');
const bookmarkRouter = express.Router();
const {v4: uuid} = require('uuid');
const logger = require('../src/logger');
const bodyParser = express.json();
const {bookmarks} = require('../src/store');
const BookmarksService = require('./BookmarksService');
const xss = require('xss')

bookmarkRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        BookmarksService.getAllBookmarks(knexInstance)
            .then(bookmarks => {
                // console.log(bookmarks.title)
                res.json(bookmarks)
            })
            .catch(next)
    })
    .post(bodyParser, (req, res) => {
        const newBookmark = {title, url, description, rating} = req.body;

        /// Validate that values exist exist
        for (const [key, value] of Object.entries(newBookmark)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })
            }
        }

        /// If bookmark exists, generate an ID
        const id = uuid();
        const bookmark = {
            id,
            title,
            url,
            description,
            rating,
        };

        /// Push a bookmark object into the array.
        bookmarks.push(bookmark);

        /// log the bookmark creation and send a response including a location header
        logger.info(`Bookmark with id ${id} created`);
        res
            .status(201)
            .location(`/bookmarks/${id}`)
            .json(bookmark);

    })

bookmarkRouter
    .route('/bookmarks/:id')
    .all((req, res, next) => {
        BookmarksService.getById(
            req.app.get('db'),
            req.params.bookmark_id
        ).then(bookmark => {
            if (!bookmark) {
                return res.status(404).json({
                    error: { message: `Bookmark doesn't exist` }
                })
            }
            res.bookmark = bookmark // save the article for the next middleware
            next() // don't forget to call next so the next middleware happens!
        }).catch(next)
    })
    .get((req, res, next) => {
        res.json({
            id: bookmark.id,
            title: xss(bookmark.title), // sanitize title
            description: xss(bookmark.description), // sanitize content
            rating: bookmark.rating,
        })
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