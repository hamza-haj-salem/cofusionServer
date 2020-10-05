const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Boards = require('../models/boards');

const boardRouter = express.Router();

boardRouter.use(bodyParser.json());

boardRouter.route('/')
.get((req,res,next) => {
    Boards.find({})
    .then((boards) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(boards);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post((req, res, next) => {
    Boards.create(req.body)
    .then((board) => {
        console.log('board Created ', board);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(board);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})

// *********** **************** ************** ***********

boardRouter.route('/:boardId')
.get((req,res,next) => {
    Boards.findById(req.params.boardId)
    .then((board) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(board);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post((req, res, next) => {
    Boards.findById(req.params.boardId)
    .then((board) => {
        if (board != null) {
            board.lists.push(req.body);
            board.save()
            .then((board) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(board);
            }, (err) => next(err));
        }
        else {
            err = new Error('Board ' + req.params.boardId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})

.put((req, res, next) => {
    Boards.findById(req.params.boardId)
    .then((board) => {
        if (board != null ) {
            if (req.body.name) {
                board.name = req.body.name;
            }
            board.save()
            .then((board) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(board);
            }, (err) => next(err));
        }

       
    }, (err) => next(err))
    .catch((err) => next(err));
})  

.delete((req, res, next) => {
    Boards.findByIdAndRemove(req.params.boardId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

// *********** *********  CRUD LIST ******** ********

boardRouter.route('/:boardId/lists/:listId')
.get((req,res,next) => {
    Boards.findById(req.params.boardId)
    .then((board) => {
        if (board != null &&  board.lists.id(req.params.listId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(board.lists.id(req.params.listId));
        }
        else if (board == null) {
            err = new Error('Board ' + req.params.listId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('list ' + req.params.listId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})

.delete((req, res, next) => {
    Boards.findById(req.params.boardId)
    .then((board) => {
        if (board != null && board.lists.id(req.params.listId) != null) {
            board.lists.id(req.params.listId).remove();
            board.save()
            .then((board) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(board);
            }, (err) => next(err));
        }
        else if (board == null) {
            err = new Error('board ' + req.params.boardId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('list ' + req.params.listId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post((req, res, next) => {
    Boards.findById(req.params.boardId)
    .then((board) => {
        if (board != null && board.lists.id(req.params.listId) != null) {
            if (req.body.title) {
                //board.lists.id(req.params.listId).title = req.body.title;
                board.lists.id(req.params.listId).cards.push(req.body);   
            }
            board.save()
            .then((board) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(board);
            }, (err) => next(err));
        }
        else if (board == null) {
            err = new Error('Board ' + req.params.boardId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('list ' + req.params.listId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})

// ******* ******** ********* ******** ********* *********

boardRouter.route('/:boardId/lists/:listId/cards/:cardId')
.delete((req, res, next) => {
    Boards.findById(req.params.boardId)
    .then((board) => {
        if (board != null && board.lists.id(req.params.listId) != null) {
            board.lists.id(req.params.listId).cards.id(req.params.cardId).remove();
            board.save()
            .then((board) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(board);
            }, (err) => next(err));
        }
        else if (board == null) {
            err = new Error('board ' + req.params.boardId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('list ' + req.params.listId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = boardRouter;
