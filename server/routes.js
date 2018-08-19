// constants
const consts = require('./constants');

const myFunctions = require('./my-functions');

// Database
const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'demo-app',
    password: 'just-demo',
    database: 'form_system'
});
db.connect();


const appRouter = function (app) {

    /**
     * Shows intro page of API with links
     */
    app.get('/api', function (req, res) {
        let status = consts.HTTP_STATUS_200;

        myFunctions.printRespondLog(req, status);

        res.render('menu');
    });


    // ### USERS ###

    /**
     * Returns JSON with user specified by ID
     */
    app.get('/api/user/:id', function (req, res) {
        db.query(   'SELECT * FROM users WHERE user_id = ?',
                    [req.params.id],
                    function (err, data) {
                        myFunctions.apiGetResponseCheck(req, res, err, data);
                    })
    });

    /**
     * Returns JSON with all users
     */
    app.get('/api/users', function (req, res) {
        db.query(   'SELECT * FROM users',
                    function (err, data) {
                        myFunctions.apiGetResponseCheck(req, res, err, data);
                    })
    });


    /**
     * Creates a new user
     */
    app.put('/api/user', function (req, res) {

        let status = '';

        // QUERY FOR INDEX
        db.query(   'SELECT ifnull(max(user_id) + 1, 1) AS user_id FROM users',
                    function (err, data) {
                        if (err) {
                            status = consts.HTTP_STATUS_500;
                            res.status(500).send(status + '\n' + err);
                            myFunctions.printRespondLog(req, status);
                        }
                        else {

                            // VALUES
                            let v = {
                                user_id: data[0].user_id,
                                username: req.body.username,
                                email: req.body.email,
                                last_login: myFunctions.formatDate(new Date(), 'y-MM-dd HH:mm:ss'),
                                name: myFunctions.optionalFieldCheck(req.body.name),
                                sex: myFunctions.optionalFieldCheck(req.body.sex),
                                country: myFunctions.optionalFieldCheck(req.body.country),
                                birthdate: myFunctions.optionalFieldCheck(req.body.birthdate)
                            };

                            // INSERT VALUES
                            db.query(   'INSERT INTO users ' +
                                        '(user_id, username, email, last_login, name, sex, country, birthdate) ' +
                                        'VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                                        [v.user_id, v.username, v.email, v.last_login, v.name, v.sex, v.country, v.birthdate],
                                        function (err) {
                                            if (err) {
                                                status = consts.HTTP_STATUS_500;
                                                res.status(500).send(status + '\n' + err);
                                                myFunctions.printRespondLog(req, status);
                                            }
                                            else {
                                                status = consts.HTTP_STATUS_200;
                                                res.status(200).send(status);
                                                myFunctions.printRespondLog(req, status);
                                            }
                                        });
                        }
                    });
    });


    /**
     * Updates info about existing user
     */
    app.post('/api/user/:id', function (req, res) {

        let status = '';

        // QUERY FOR USER
        db.query(   'SELECT * FROM users WHERE user_id = ?',
                    [req.params.id],
                    function (err, data) {
                        if (err || data.length === 0) {
                            status = consts.HTTP_STATUS_500;
                            res.status(500).send(status + '\n' + err);
                            myFunctions.printRespondLog(req, status);
                        }
                        else {

                            // NEW VALUES
                            let v = {
                                user_id: data[0].user_id,
                                username: myFunctions.updatedFieldCheck(data[0].username, req.body.username),
                                email: myFunctions.updatedFieldCheck(data[0].email, req.body.email),
                                last_login: data[0].last_login,
                                name: myFunctions.updatedFieldCheck(data[0].name, req.body.name),
                                sex: myFunctions.updatedFieldCheck(data[0].sex, req.body.sex),
                                country: myFunctions.updatedFieldCheck(data[0].country, req.body.country),
                                birthdate: myFunctions.updatedFieldCheck(data[0].birthdate, req.body.birthdate)
                            };

                            // UPDATE VALUES
                            db.query(   'UPDATE users ' +
                                        'SET username = ?, email = ?, last_login = ?, name = ?, ' +
                                        'sex = ?, country = ?, birthdate = ? ' +
                                        'WHERE user_id = ?',
                                        [v.user_id, v.username, v.email, v.last_login, v.name, v.sex, v.country, v.birthdate, v.user_id],
                                        function (err) {
                                            if (err) {
                                                status = consts.HTTP_STATUS_500;
                                                res.status(500).send(status + '\n' + err);
                                                myFunctions.printRespondLog(req, status);
                                            }
                                            else {
                                                status = consts.HTTP_STATUS_200;
                                                res.status(200).send(status);
                                                myFunctions.printRespondLog(req, status);
                                            }
                                        });
                        }
                    });
    });


    /**
     * Deletes user
     */
    app.delete('/api/user/:id', function (req, res) {

        let status = '';

        // QUERY FOR USER
        db.query(   'SELECT * FROM users WHERE user_id = ?',
                    [req.params.id],
                    function (err, data) {
                        if (err || data.length === 0) {
                            status = consts.HTTP_STATUS_500;
                            res.status(500).send(status + '\n' + err);
                            myFunctions.printRespondLog(req, status);
                        }
                        else {

                            // DELETE VALUES
                            db.query(   'DELETE FROM users WHERE user_id = ?',
                                        [data[0].user_id],
                                        function (err) {
                                            if (err) {
                                                status = consts.HTTP_STATUS_500;
                                                res.status(500).send(status + '\n' + err);
                                                myFunctions.printRespondLog(req, status);
                                            }
                                            else {
                                                status = consts.HTTP_STATUS_200;
                                                res.status(200).send(status);
                                                myFunctions.printRespondLog(req, status);
                                            }
                                        });
                        }
            });
    });


    // ### FORMS ###

    /**
     * Returns JSON with form specified by ID
     */
    app.get('/api/form/:id', function (req, res) {
        db.query(   'SELECT * FROM forms WHERE form_id = ?',
                    [req.params.id],
                    function (err, data) {
                        myFunctions.apiGetResponseCheck(req, res, err, data);
                    })
    });


    /**
     * Returns JSON with forms created by specific user
     */
    app.get('/api/forms?user=:id', function (req, res) {
        db.query(   'SELECT * FROM forms WHERE user_id = ?',
                    function (err, data) {
                        myFunctions.apiGetResponseCheck(req, res, err, data);
                    })
    });


    /**
     * Creates a new form
     */
    app.put('/api/form', function (req, res) {

        let status = '';

        // QUERY FOR INDEX
        db.query(   'SELECT ifnull(max(form_id) + 1, 1) AS form_id FROM forms',
            function (err, data) {
                if (err) {
                    status = consts.HTTP_STATUS_500;
                    res.status(500).send(status + '\n' + err);
                    myFunctions.printRespondLog(req, status);
                }
                else {

                    // VALUES
                    let v = {
                        form_id: data[0].form_id,
                        user_id: req.body.user_id,
                        name: req.body.name,
                        created: myFunctions.formatDate(new Date(), 'y-MM-dd HH:mm:ss')
                    };

                    // INSERT VALUES
                    db.query(   'INSERT INTO forms ' +
                                '(form_id, user_id, name, created) ' +
                                'VALUES (?, ?, ?, ?)',
                                [v.form_id, v.user_id, v.name, v.created],
                                function (err) {
                                    if (err) {
                                        status = consts.HTTP_STATUS_500;
                                        res.status(500).send(status + '\n' + err);
                                        myFunctions.printRespondLog(req, status);
                                    }
                                    else {
                                        status = consts.HTTP_STATUS_200;
                                        res.status(200).send(status);
                                        myFunctions.printRespondLog(req, status);
                                    }
                                });
                }
            });
    });


    /**
     * Updates info about existing form
     */
    app.post('/api/form/:id', function (req, res) {

        let status = '';

        // QUERY FOR FORM
        db.query(   'SELECT * FROM forms WHERE form_id = ?',
                    [req.params.id],
                    function (err, data) {
                        if (err || data.length === 0) {
                            status = consts.HTTP_STATUS_500;
                            res.status(500).send(status + '\n' + err);
                            myFunctions.printRespondLog(req, status);
                        }
                        else {

                            // NEW VALUES
                            let v = {
                                form_id: data[0].form_id,
                                user_id: data[0].user_id,
                                name: myFunctions.updatedFieldCheck(data[0].name, req.body.name),
                                created: data[0].created
                            };

                            // UPDATE VALUES
                            db.query(   'UPDATE forms SET name = ? WHERE form_id = ?',
                                        [v.name, v.form_id],
                                        function (err) {
                                            if (err) {
                                                status = consts.HTTP_STATUS_500;
                                                res.status(500).send(status + '\n' + err);
                                                myFunctions.printRespondLog(req, status);
                                            }
                                            else {
                                                status = consts.HTTP_STATUS_200;
                                                res.status(200).send(status);
                                                myFunctions.printRespondLog(req, status);
                                            }
                                        });
                        }
                    });
    });


    /**
     * Deletes form
     */
    app.delete('/api/form/:id', function (req, res) {

        let status = '';

        // QUERY FOR FORM
        db.query(   'SELECT * FROM forms WHERE form_id = ?',
                    [req.params.id],
                    function (err, data) {
                        if (err || data.length === 0) {
                            status = consts.HTTP_STATUS_500;
                            res.status(500).send(status + '\n' + err);
                            myFunctions.printRespondLog(req, status);
                        }
                        else {

                            // DELETE VALUES
                            db.query(   'DELETE FROM forms WHERE form_id = ?',
                                [data[0].user_id],
                                function (err) {
                                    if (err) {
                                        status = consts.HTTP_STATUS_500;
                                        res.status(500).send(status + '\n' + err);
                                        myFunctions.printRespondLog(req, status);
                                    }
                                    else {
                                        status = consts.HTTP_STATUS_200;
                                        res.status(200).send(status);
                                        myFunctions.printRespondLog(req, status);
                                    }
                                });
                        }
                    });
    });



    // ### FORM QUESTION TYPES ###

    /**
     * Returns JSON with question-type specified by ID
     */
    app.get('/api/question-type/:id', function (req, res) {
        db.query(   'SELECT * FROM form_question_types WHERE question_type_id = ?',
                    [req.params.id],
                    function (err, data) {
                        myFunctions.apiGetResponseCheck(req, res, err, data);
                    })
    });


    /**
     * Returns JSON with all question-types
     */
    app.get('/api/question-types', function (req, res) {
        db.query(   'SELECT * FROM form_question_types',
                    function (err, data) {
                        myFunctions.apiGetResponseCheck(req, res, err, data);
                    })
    });


    /**
     * Creates a new question-type
     */
    app.put('/api/question-type', function (req, res) {

        let status = '';

        // QUERY FOR INDEX
        db.query(   'SELECT ifnull(max(question_type_id) + 1, 1) AS question_type_id FROM form_question_types',
                    function (err, data) {
                        if (err) {
                            status = consts.HTTP_STATUS_500;
                            res.status(500).send(status + '\n' + err);
                            myFunctions.printRespondLog(req, status);
                        }
                        else {

                            // VALUES
                            let v = {
                                question_type_id: data[0].question_type_id,
                                type_name: req.body.type_name
                            };

                            // INSERT VALUES
                            db.query(   'INSERT INTO form_question_types ' +
                                        '(question_type_id, type_name) VALUES (?, ?)',
                                        [v.form_id, v.user_id, v.name, v.created],
                                        function (err) {
                                            if (err) {
                                                status = consts.HTTP_STATUS_500;
                                                res.status(500).send(status + '\n' + err);
                                                myFunctions.printRespondLog(req, status);
                                            }
                                            else {
                                                status = consts.HTTP_STATUS_200;
                                                res.status(200).send(status);
                                                myFunctions.printRespondLog(req, status);
                                            }
                                        });
                        }
                    });
    });


    /**
     * Updates info about existing question-type
     */
    app.post('/api/question-type/:id', function (req, res) {

        let status = '';

        // QUERY FOR FORM
        db.query(   'SELECT * FROM form_question_types WHERE question_type_id = ?',
                    [req.params.id],
                    function (err, data) {
                        if (err || data.length === 0) {
                            status = consts.HTTP_STATUS_500;
                            res.status(500).send(status + '\n' + err);
                            myFunctions.printRespondLog(req, status);
                        }
                        else {

                            // NEW VALUES
                            let v = {
                                question_type_id: data[0].question_type_id,
                                type_name: myFunctions.updatedFieldCheck(data[0].type_name, req.body.type_name)
                            };

                            // UPDATE VALUES
                            db.query(   'UPDATE form_question_types SET type_name = ? WHERE question_type_id = ?',
                                        [v.name, v.question_type_id],
                                        function (err) {
                                            if (err) {
                                                status = consts.HTTP_STATUS_500;
                                                res.status(500).send(status + '\n' + err);
                                                myFunctions.printRespondLog(req, status);
                                            }
                                            else {
                                                status = consts.HTTP_STATUS_200;
                                                res.status(200).send(status);
                                                myFunctions.printRespondLog(req, status);
                                            }
                                        });
                        }
                    });
    });


    /**
     * Deletes question-type
     */
    app.delete('/api/question-type/:id', function (req, res) {

        let status = '';

        // QUERY FOR QUESTION-TYPE
        db.query(   'SELECT * FROM form_question_types WHERE question_type_id = ?',
                    [req.params.id],
                    function (err, data) {
                        if (err || data.length === 0) {
                            status = consts.HTTP_STATUS_500;
                            res.status(500).send(status + '\n' + err);
                            myFunctions.printRespondLog(req, status);
                        }
                        else {

                            // DELETE VALUES
                            db.query(   'DELETE FROM form_question_types WHERE question_type_id = ?',
                                        [data[0].question_type_id],
                                        function (err) {
                                            if (err) {
                                                status = consts.HTTP_STATUS_500;
                                                res.status(500).send(status + '\n' + err);
                                                myFunctions.printRespondLog(req, status);
                                            }
                                            else {
                                                status = consts.HTTP_STATUS_200;
                                                res.status(200).send(status);
                                                myFunctions.printRespondLog(req, status);
                                            }
                                        });
                        }
                    });
    });



    // ### FORM QUESTIONS ###

    /**
     * Returns JSON with form question specified by ID
     */
    app.get('/api/question/:id', function (req, res) {
        db.query(   'SELECT * FROM form_questions WHERE form_question_id = ?',
                    [req.params.id],
                    function (err, data) {
                        myFunctions.apiGetResponseCheck(req, res, err, data);
                    })
    });


    /**
     * Returns JSON with all questions of particular form
     */
    app.get('/api/questions?form=:id', function (req, res) {
        db.query(   'SELECT * FROM form_questions WHERE form_id = ?',
                    [req.params.id],
                    function (err, data) {
                        myFunctions.apiGetResponseCheck(req, res, err, data);
                    })
    });


    /**
     * Creates a new question
     */
    app.put('/api/question', function (req, res) {

        let status = '';

        // QUERY FOR INDEX
        db.query(   'SELECT ifnull(max(form_question_id) + 1, 1) AS form_question_id FROM form_questions',
                    function (err, data) {
                        if (err) {
                            status = consts.HTTP_STATUS_500;
                            res.status(500).send(status + '\n' + err);
                            myFunctions.printRespondLog(req, status);
                        }
                        else {

                            // VALUES
                            let v = {
                                form_question_id: data[0].form_question_id,
                                form_id: req.body.form_id,
                                text_value: req.body.text_value,
                                sequence_number: req.body.sequence_number,
                                question_type_id: req.body.question_type_id
                            };

                            // INSERT VALUES
                            db.query(   'INSERT INTO form_questions ' +
                                        '(form_question_id, form_id, text_value, sequence_number, question_type_id) ' +
                                        'VALUES (?, ?, ?, ?, ?)',
                                        [v.form_question_id, v.form_id, v.text_value, v.sequence_number, v.question_type_id],
                                        function (err) {
                                            if (err) {
                                                status = consts.HTTP_STATUS_500;
                                                res.status(500).send(status + '\n' + err);
                                                myFunctions.printRespondLog(req, status);
                                            }
                                            else {
                                                status = consts.HTTP_STATUS_200;
                                                res.status(200).send(status);
                                                myFunctions.printRespondLog(req, status);
                                            }
                                        });
                        }
                    });
    });


    /**
     * Updates info about existing question
     */
    app.post('/api/question/:id', function (req, res) {

        let status = '';

        // QUERY FOR QUESTION
        db.query(   'SELECT * FROM form_questions WHERE form_question_id = ?',
                    [req.params.id],
                    function (err, data) {
                        if (err || data.length === 0) {
                            status = consts.HTTP_STATUS_500;
                            res.status(500).send(status + '\n' + err);
                            myFunctions.printRespondLog(req, status);
                        }
                        else {

                            // NEW VALUES
                            let v = {
                                form_question_id: data[0].form_question_id,
                                form_id: data[0].form_id,
                                text_value: myFunctions.updatedFieldCheck(data[0].text_value, req.body.text_value),
                                sequence_number: myFunctions.updatedFieldCheck(data[0].sequence_number, req.body.sequence_number),
                                question_type_id: data[0].question_type_id
                            };

                            // UPDATE VALUES
                            db.query(   'UPDATE form_questions SET text_value = ?, sequence_number = ? WHERE form_question_id = ?',
                                        [v.text_value, v.sequence_number, v.form_question_id],
                                        function (err) {
                                            if (err) {
                                                status = consts.HTTP_STATUS_500;
                                                res.status(500).send(status + '\n' + err);
                                                myFunctions.printRespondLog(req, status);
                                            }
                                            else {
                                                status = consts.HTTP_STATUS_200;
                                                res.status(200).send(status);
                                                myFunctions.printRespondLog(req, status);
                                            }
                                        });
                        }
                    });
    });


    /**
     * Deletes question
     */
    app.delete('/api/question/:id', function (req, res) {

        let status = '';

        // QUERY FOR QUESTION
        db.query(   'SELECT * FROM form_questions WHERE form_question_id = ?',
                    [req.params.id],
                    function (err, data) {
                        if (err || data.length === 0) {
                            status = consts.HTTP_STATUS_500;
                            res.status(500).send(status + '\n' + err);
                            myFunctions.printRespondLog(req, status);
                        }
                        else {

                            // DELETE VALUES
                            db.query(   'DELETE FROM form_questions WHERE form_question_id = ?',
                                        [data[0].form_question_id],
                                        function (err) {
                                            if (err) {
                                                status = consts.HTTP_STATUS_500;
                                                res.status(500).send(status + '\n' + err);
                                                myFunctions.printRespondLog(req, status);
                                            }
                                            else {
                                                status = consts.HTTP_STATUS_200;
                                                res.status(200).send(status);
                                                myFunctions.printRespondLog(req, status);
                                            }
                                        });
                        }
                    });
    });



    // ### FORM QUESTION OPTIONS ###

    /**
     * Returns JSON with form question option specified by ID
     */
    app.get('/api/option/:id', function (req, res) {
        db.query(   'SELECT * FROM form_options WHERE option_id = ?',
                    [req.params.id],
                    function (err, data) {
                        myFunctions.apiGetResponseCheck(req, res, err, data);
                    })
    });


    /**
     * Returns JSON with all options of particular question
     */
    app.get('/api/options?question=:id', function (req, res) {
        db.query(   'SELECT * FROM form_options WHERE form_question_id = ? ' +
            '       ORDER BY sequence_number',
                    [req.params.id],
                    function (err, data) {
                        myFunctions.apiGetResponseCheck(req, res, err, data);
                    })
    });


    /**
     * Creates a new option
     */
    app.put('/api/option', function (req, res) {

        let status = '';

        // QUERY FOR INDEX
        db.query(   'SELECT ifnull(max(option_id) + 1, 1) AS option_id FROM form_options',
                    function (err1, data1) {
                        if (err1) {
                            status = consts.HTTP_STATUS_500;
                            res.status(500).send(status + '\n' + err1);
                            myFunctions.printRespondLog(req, status);
                        }
                        else {

                            // QUERY FOR SEQUENCE_NUMBER
                            db.query(   'SELECT ifnull(max(sequence_number) + 1, 1) AS sequence_number ' +
                                        'FROM form_options WHERE form_question_id = ?',
                                        [req.body.form_question_id],
                                        function (err2, data2) {
                                            if (err2) {
                                                status = consts.HTTP_STATUS_500;
                                                res.status(500).send(status + '\n' + err2);
                                                myFunctions.printRespondLog(req, status);
                                            }
                                            else {
                                                // VALUES
                                                let v = {
                                                    option_id: data1[0].option_id,
                                                    form_question_id: req.body.form_question_id,
                                                    option_value: req.body.option_value,
                                                    sequence_number: data2[0].sequence_number,
                                                    option_note: myFunctions.optionalFieldCheck(req.body.option_note)
                                                };

                                                // INSERT VALUES
                                                db.query(   'INSERT INTO form_options ' +
                                                            '(option_id, form_question_id, option_value, sequence_number, option_note) ' +
                                                            'VALUES (?, ?, ?, ?, ?)',
                                                            [v.option_id, v.form_question_id, v.option_value, v.sequence_number, v.option_note],
                                                            function (err3) {
                                                                if (err3) {
                                                                    status = consts.HTTP_STATUS_500;
                                                                    res.status(500).send(status + '\n' + err3);
                                                                    myFunctions.printRespondLog(req, status);
                                                                }
                                                                else {
                                                                    status = consts.HTTP_STATUS_200;
                                                                    res.status(200).send(status);
                                                                    myFunctions.printRespondLog(req, status);
                                                                }
                                                            });

                                            }
                                        });
                        }
                    });
    });


    /**
     * Updates info about existing option
     */
    app.post('/api/option/:id', function (req, res) {

        let status = '';

        // QUERY FOR OPTION
        db.query(   'SELECT * FROM form_options WHERE option_id = ?',
                    [req.params.id],
                    function (err, data) {
                        if (err || data.length === 0) {
                            status = consts.HTTP_STATUS_500;
                            res.status(500).send(status + '\n' + err);
                            myFunctions.printRespondLog(req, status);
                        }
                        else {

                            // NEW VALUES
                            let v = {
                                option_id: data[0].option_id,
                                form_question_id: data[0].form_question_id,
                                option_value: myFunctions.updatedFieldCheck(data[0].option_value, req.body.option_value),
                                sequence_number: data[0].sequence_number,
                                option_note: myFunctions.updatedFieldCheck(req.body.option_note)
                            };

                            // UPDATE VALUES
                            db.query(   'UPDATE form_options SET option_value = ?, sequence_number = ?, option_note = ? ' +
                                        'WHERE option_id = ?',
                                        [v.option_value, v.sequence_number, v.option_note, v.option_id],
                                        function (err) {
                                            if (err) {
                                                status = consts.HTTP_STATUS_500;
                                                res.status(500).send(status + '\n' + err);
                                                myFunctions.printRespondLog(req, status);
                                            }
                                            else {
                                                status = consts.HTTP_STATUS_200;
                                                res.status(200).send(status);
                                                myFunctions.printRespondLog(req, status);
                                            }
                                        });
                        }
                    });
    });


    /**
     * Deletes question
     */
    app.delete('/api/option/:id', function (req, res) {

        let status = '';

        // QUERY FOR OPTION
        db.query(   'SELECT * FROM form_options WHERE option_id = ?',
                    [req.params.id],
                    function (err, data) {
                        if (err || data.length === 0) {
                            status = consts.HTTP_STATUS_500;
                            res.status(500).send(status + '\n' + err);
                            myFunctions.printRespondLog(req, status);
                        }
                        else {

                            // DELETE VALUES
                            db.query(   'DELETE FROM form_options WHERE option_id = ?',
                                        [data[0].option_id],
                                        function (err) {
                                            if (err) {
                                                status = consts.HTTP_STATUS_500;
                                                res.status(500).send(status + '\n' + err);
                                                myFunctions.printRespondLog(req, status);
                                            }
                                            else {
                                                status = consts.HTTP_STATUS_200;
                                                res.status(200).send(status);
                                                myFunctions.printRespondLog(req, status);
                                            }
                                        });
                        }
                    });
    });



    // Default route
    app.use(function(req, res){
        myFunctions.apiGetResponseCheck(req, res, null, [], true);
    });
};

module.exports = appRouter;