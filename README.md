API for Forms App

------------------------------------------------------------
ROUTES
------------------------------------------------------------

    GET     /                           - shows page with options

------
USERS
------

    GET     /api/users                  - JSON - all users
    GET     /api/user/:id               - JSON - user with id

    PUT     /api/user                   - creates new user
                                        - request body:

                                            username: george
                                            password: secretpassword
                                            email: mthn@gg.vvcs
                                            name: [optional]
                                            sex: [optional]
                                            country: [optional]
                                            birthdate: [optional]

    POST    /api/user/:id               - updates existing user
                                            - request body:

                                                username: [optional]
                                                password: [optional]
                                                email: [optional]
                                                last_login: [optional]
                                                name: [optional]
                                                sex: [optional]
                                                country: [optional]
                                                birthdate: [optional]

    DELETE  /api/user/:id               - deletes user with id

------
FORMS
------

    GET     /api/form/:id               - JSON - form with id
    GET     /api/forms?user=:id         - JSON - all forms created by specific user

    PUT     /api/form                   - creates new form
                                            - request body:

                                                user_id: user_id
                                                name: My form

    POST    /api/form/:id               - updates existing form
                                            - request body:

                                                name: My new form

    DELETE  /api/form/:id               - deletes form with id and all its parts


------
FORM QUESTION TYPES
------

    GET     /api/question-type/:id      - JSON - question-type with id
    GET     /api/question-types         - JSON - all question-types

    PUT     /api/question-type          - creates new question-type
                                            - request body:

                                                type_name: checkbox

    POST    /api/question-type/:id      - updates existing question-type
                                            - request body:

                                               type_name: checkbox-new

    DELETE  /api/question-type/:id      - deletes question-type with id and all questions of that type


------
FORM QUESTIONS
------

    GET     /api/question/:id           - JSON - question with id
    GET     /api/questions?form=:id     - JSON - all questions of particular form

    PUT     /api/question               - creates new question
                                            - request body:

                                                form_id: form_id
                                                text_value: What is your profession?
                                                sequence_number: 1
                                                question_type_id: question_type_id

    POST    /api/question/:id           - updates existing question
                                            - request body:

                                                text_value: What is your job?
                                                sequence_number: 1

    DELETE  /api/question/:id           - deletes question with id and all its options (answers)


------
FORM QUESTION options
------

    GET     /api/option/:id             - JSON - option with id
    GET     /api/options?question=:id   - JSON - all options of particular question

    PUT     /api/option                 - creates new option
                                            - request body:

                                                form_question_id: form_question_id
                                                option_value: Enter your answer
                                                option_note: Option description

    POST    /api/option/:id             - updates existing option
                                            - request body:

                                                option_value: Enter your answer
                                                option_note: Option description

    DELETE  /api/option/:id           - deletes option with id


------------------------------------------------------------
------------------------------------------------------------
TODO LIST
------------------------------------------------------------

- routes.js refactoring
- tests
- API autentication system
