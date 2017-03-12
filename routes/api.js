var express = require('express');
var router = express.Router();
var users = require('../models/users');
var userTasks = require('../models/tasks');

router.get('/user', function(req, res, next) {
    if (req.user === undefined) {
        res.json({});
    }
    else {
        res.json([req.user]);
    }
});

router.patch('/:userID', function(req, res, next) {
    if (req.user === undefined) {
        res.redirect('/');
    }
    else {
        var userID = req.params.userID;
        if (req.user._id == userID) {
            users.findByIdAndUpdate(userID, req.body, function(err, results) {
                if(err) {
                    res.end(err);
                }
                else {
                    res.json(results);
                }
            });
        }
        else {
            res.redirect('/');
        }
    }
});

router.get('/:userID/tasks', function(req, res, next) {
    if (req.user === undefined) {
        res.json({});
    }
    else {
        var userID = req.params.userID;
        if (req.user._id == userID) {
            users.findById(userID, 'tasks')
                .populate('tasks')
                .exec(function(err, userTasks) {
                    if(err) {
                        res.end(err);
                    }
                    else {
                        res.json({userTasks});
                    }
                });
        }
        else {
            res.json({});
        }
    }
});

router.post('/:userID/tasks', function(req, res, next) {
    if (req.user === undefined) {
        res.redirect('/');
    }
    else {
        var userID = req.params.userID;
        if (req.user._id == userID) {
            var taskData = new userTasks({owner: userID});
            taskData.save(function(err) {
                if(err) {
                    res.end(err);
                }
                else {
                    var taskID = taskData._id;
                    users.findByIdAndUpdate(
                        userID,
                        { $push: { tasks: { $each: [taskID], $position: 0 }}},
                        { safe: true, upsert: true, new: true },
                        function(err, results) {
                            if(err) {
                                res.end(err);
                            }
                            else {
                                res.json(results);
                            }
                        }
                    );
                }
            });
        }
        else {
            res.redirect('/');
        }
    }
});

router.delete('/:userID/tasks', function(req, res, next) {
    if (req.user === undefined) {
        res.redirect('/');
    }
    else {
        var userID = req.params.userID;
        if (req.user._id == userID) {
            userTasks.find({owner: userID, isComplete: true},function(err, userCompletedTasks) {
                if(err) {
                    res.end(err);
                }
                else {
                    userCompletedTasks.forEach(function (userCompletedTask) {
                        users.findByIdAndUpdate(
                            userID,
                            { $pull: { tasks: userCompletedTask._id }},
                            { new: true, upsert: true },
                            function(err, results) {
                                if(err) {
                                    res.end(err);
                                }
                                else {
                                    userCompletedTask.remove(function(err) {
                                        if(err) {
                                            res.end(err);
                                        }
                                        else {
                                            res.json(results);
                                        }
                                    });
                                }
                            }
                        );
                    });
                }
            });
        }
        else {
            res.redirect('/');
        }
    }
});

router.patch('/:userID/task/:taskID', function(req, res, next) {
    if (req.user === undefined) {
        res.redirect('/');
    }
    else {
        var userID = req.params.userID;
        var taskID = req.params.taskID;
        if (req.user._id == userID) {
            userTasks.findById(taskID, function(err, taskData) {
                if(err) {
                    res.end(err);
                }
                else {
                    if (taskData.owner != userID) {
                        res.redirect('/');
                    }
                    else {
                        taskData.update(req.body, function(err, results) {
                            if(err) {
                                res.end(err);
                            }
                            else {
                                res.json(results);
                            }
                        });
                    }
                }
            });
        }
        else {
            res.redirect('/');
        }
    }
});

router.delete('/:userID/task/:taskID', function(req, res, next) {
    if (req.user === undefined) {
        res.redirect('/');
    }
    else {
        var userID = req.params.userID;
        var taskID = req.params.taskID;
        if (req.user._id == userID) {
            userTasks.findById(taskID, function(err, taskData) {
                if(err) {
                    res.end(err);
                }
                else {
                    if (taskData.owner != userID) {
                        res.redirect('/');
                    }
                    else {
                        users.findByIdAndUpdate(
                            userID,
                            { $pull: { tasks: taskID }},
                            { new: true, upsert: true },
                            function(err, results) {
                                if(err) {
                                    res.end(err);
                                }
                                else {
                                    taskData.remove(function(err) {
                                        if (err) {
                                            res.end(err);
                                        }
                                        else {
                                            res.json(results);
                                        }
                                    });
                                }
                            }
                        );
                    }
                }
            });
        }
        else {
            res.redirect('/');
        }
    }
});
module.exports = router;