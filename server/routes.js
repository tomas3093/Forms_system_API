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
        console.log(myFunctions.getCurrentTime() + '\t' + status + '\t\t' + req.url);

        res.render('menu');
    });

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

        // QUERY FOR INDEX
        db.query(   'SELECT ifnull(max(user_id) + 1, 1) AS user_id FROM users',
                    function (err, data) {
                        if (err) {
                            res.status(500).send(consts.HTTP_STATUS_500 + '\n' + err);
                        }
                        else {

                            // VALUES
                            let v = {
                                user_id: data[0].user_id,
                                username: req.body.username,
                                email: req.body.email,
                                last_login: myFunctions.formatDate(new Date(), 'y-MM-dd HH:mm:ss'),
                                name: myFunctions.optionalFormFieldCheck(req.body.name),
                                sex: myFunctions.optionalFormFieldCheck(req.body.sex),
                                country: myFunctions.optionalFormFieldCheck(req.body.country),
                                birthdate: myFunctions.optionalFormFieldCheck(req.body.birthdate)
                            };

                            // INSERT VALUES
                            db.query(   'INSERT INTO users ' +
                                        '(user_id, username, email, last_login, name, sex, country, birthdate) ' +
                                        'VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                                        [v.user_id, v.username, v.email, v.last_login, v.name, v.sex, v.country, v.birthdate],
                                        function (err) {
                                            if (err) {
                                                res.status(500).send(consts.HTTP_STATUS_500 + '\n' + err);
                                            }
                                            else {
                                                res.status(200).send(consts.HTTP_STATUS_200);
                                            }
                                        });
                        }
                    });
    });

    // TODO
    /**
     * Updates info about existing user
     */
    app.post('/api/user/:id', function (req, res) {

    });

    /**
     * Deletes user
     */
    app.delete('/api/user/:id', function (req, res) {

    });


    // Default route
    app.use(function(req, res){
        myFunctions.apiGetResponseCheck(req, res, null, [], true);
    });
};

module.exports = appRouter;