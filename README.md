API for Forms App

------------------------------------------------------------
ROUTES
------------------------------------------------------------

    GET     /                       - shows page with options

------
USERS
------

    GET     /api/users              - JSON - all users
    GET     /api/user/:id           - JSON - user with id

    PUT     /api/user               - creates new user
                                    - request body:

                                        username: george
                                        email: mthn@gg.vvcs
                                        name: [optional]
                                        sex: [optional]
                                        country: [optional]
                                        birthdate: [optional]

    POST    /api/user/:id           - updates existing user
                                        - request body:

                                            username: [optional]
                                            email: [optional]
                                            name: [optional]
                                            sex: [optional]
                                            country: [optional]
                                            birthdate: [optional]

    DELETE  /api/user/:id           - deletes user with id

------
FORMS
------

    GET     /api/forms?user=:id     - JSON - all forms created by specific user
    GET     /api/form/:id           - JSON - form with id

    PUT     /api/form               - creates new form
                                    - request body:

                                        username: george
                                        email: mthn@gg.vvcs
                                        name: [optional]
                                        sex: [optional]
                                        country: [optional]
                                        birthdate: [optional]

    POST    /api/form/:id           - updates existing form
                                        - request body:

                                            username: [optional]
                                            email: [optional]
                                            name: [optional]
                                            sex: [optional]
                                            country: [optional]
                                            birthdate: [optional]

    DELETE  /api/form/:id           - deletes form with id and all its parts



------------------------------------------------------------
------------------------------------------------------------
TODO LIST
------------------------------------------------------------

- API routes documentation
- routes.js refactoring
- tests
- API autentication system
