Demo API for forms system application

------------------------------------------------------------
ROUTES
------------------------------------------------------------

    GET     /                       - page with options
    GET     /api/users              - JSON - all users
    GET     /api/user/:id           - JSON - user with id

    PUT     /api/user               - create new user
                                    - request body:

                                        username:george
                                        email:mthn@gg.vvcs
                                        name: [optional]
                                        sex: [optional]
                                        country: [optional]
                                        birthdate: [optional]


    DELETE  /api/user/:id           - deletes user with id


------------------------------------------------------------
------------------------------------------------------------
TODO LIST
------------------------------------------------------------
- API autentication
- remaining routes