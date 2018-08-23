/*
Created		8/5/2018
Modified		8/16/2018
Project		
Model		
Company		
Author		
Version		
Database		mySQL 5 
*/


Create table users (
	user_id Int NOT NULL,
	username Varchar(30) NOT NULL,
	password Char(128) NOT NULL,
	email Varchar(40) NOT NULL,
	registered Datetime NOT NULL,
	last_login Datetime,
	name Varchar(30),
	sex Char(1),
	country Varchar(40),
	birthdate Date,
	UNIQUE (username),
	UNIQUE (email),
 Primary Key (user_id)) ENGINE = MyISAM;

Create table forms (
	form_id Int NOT NULL,
	user_id Int NOT NULL,
	name Varchar(35) NOT NULL,
	created Datetime NOT NULL,
 Primary Key (form_id)) ENGINE = MyISAM;

Create table form_question_types (
	question_type_id Int NOT NULL,
	type_name Varchar(20) NOT NULL,
 Primary Key (question_type_id)) ENGINE = MyISAM;

Create table form_questions (
	form_question_id Int NOT NULL,
	form_id Int NOT NULL,
	text_value Varchar(650) NOT NULL,
	sequence_number Int NOT NULL COMMENT 'Poradie danej otazky vramci celeho formulara',
	question_type_id Int NOT NULL,
 Primary Key (form_question_id)) ENGINE = MyISAM;

Create table form_options (
	option_id Int NOT NULL,
	form_question_id Int NOT NULL,
	option_value Varchar(150) NOT NULL,
	sequence_number Int NOT NULL COMMENT 'Poradie odpovede (moznosti) v ramci vsetkych moznosti k danej otazke',
	option_note Varchar(200),
 Primary Key (option_id)) ENGINE = MyISAM;


Alter table forms add Foreign Key (user_id) references users (user_id) on delete  restrict on update  restrict;
Alter table form_questions add Foreign Key (form_id) references forms (form_id) on delete  restrict on update  restrict;
Alter table form_questions add Foreign Key (question_type_id) references form_question_types (question_type_id) on delete  restrict on update  restrict;
Alter table form_options add Foreign Key (form_question_id) references form_questions (form_question_id) on delete  restrict on update  restrict;


