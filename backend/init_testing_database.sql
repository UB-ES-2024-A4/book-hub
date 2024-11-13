
# [OPTIONAL]
delete from user;
delete from post;             
delete from book;             
delete from comment;          
delete from filter;         
delete from `like`;             
delete from postfilter; 


# Insert usersi              EMAIL              USERNAME      F_NAME        l_NAME_     ID  PASSWORD BIO  CREATED_AT
insert into user values ("alejandro@test.com", "Alejandro",   "Alejandro",   NULL,       1, "contraseña",  NULL, NULL);
insert into user values ("mar@test.com",       "Maruja",      "Mar",         NULL,       2, "contraseña",  NULL, NULL);
insert into user values ("william@test.com",   "William",     "William D",   NULL,       3, "contraseña",  NULL, NULL);
insert into user values ("malik@test.com",     "Malik",       "Malik",       NULL,       4, "contraseña",  NULL, NULL);
insert into user values ("victor@test.com",    "Victor",      "Victor",      NULL,       5, "contraseña",  NULL, NULL);
insert into user values ("arnau@test.com",     "Arnau",       "Arnau",       NULL,       6, "contraseña",  NULL, NULL);


# Insert Books          ID  TITLE    AUTHOR         DESC   TIME
insert into book values (1, "1_test", "1_testAuth" , "1_test", CURRENT_TIMESTAMP);
insert into book values (2, "2_test", "2_testAuth" , "2_test", CURRENT_TIMESTAMP);
insert into book values (3, "3_test", "3_testAuth" , "3_test", CURRENT_TIMESTAMP);
insert into book values (4, "4_test", "4_testAuth" , "4_test", CURRENT_TIMESTAMP);
insert into book values (5, "5_test", "5_testAuth" , "5_test", CURRENT_TIMESTAMP);

# Insert posts          ID BOOK_ID USER_ID, DESC     LIKES  TIME
insert into post values (1,  1,     1,       "test",   0,    CURRENT_TIMESTAMP);
insert into post values (2,  1,     1,       "test",   0,    CURRENT_TIMESTAMP);
insert into post values (3,  2,     2,       "test",   0,    CURRENT_TIMESTAMP);
insert into post values (4,  2,     3,       "test",   0,    CURRENT_TIMESTAMP);
insert into post values (5,  3,     4,       "test",   0,    CURRENT_TIMESTAMP);

# Insert filters
insert into filter values (1, "Drama");
insert into filter values (2, "Comedia");
insert into filter values (3, "Terror");
insert into filter values (4, "Police");
insert into filter values (5, "Romance");
insert into filter values (6, "Horror");

# Insert postFilters         postID, FILTERID
insert into postfilter values(1, 2);
insert into postfilter values(1, 3);

insert into postfilter values(2, 1);
insert into postfilter values(2, 2);
insert into postfilter values(2, 5);


# Insert Likes            ID    USRID POSTID
insert into `like` values ( 1, 1);
insert into `like` values ( 2, 1);
insert into `like` values ( 3, 1);
insert into `like` values ( 4, 1);
insert into `like` values ( 2, 2);
insert into `like` values ( 1, 2);
insert into `like` values ( 1, 3);

# Insert Comments           ID      USER_ID   POST_ID  COMMENT   CREATED_AT
insert into comment values (NULL,  1,        1,      "Test Comment User 1", CURRENT_TIMESTAMP);
insert into comment values (NULL,  1,        2,      "Test Comment User 1", CURRENT_TIMESTAMP);
insert into comment values (NULL,  1,        1,      "Test Comment user 2", CURRENT_TIMESTAMP);
insert into comment values (NULL,  2,        1,      "Test Comment User 2", CURRENT_TIMESTAMP);
insert into comment values (NULL,  2,        3,      "Test Comment User 2", CURRENT_TIMESTAMP);
insert into comment values (NULL,  3,        3,      "Test Comment User 3", CURRENT_TIMESTAMP);

# Make users follow each other
insert into followers values (1, 2);
insert into followers values (1, 3);
insert into followers values (1, 4);
insert into followers values (2, 1);
insert into followers values (2, 3);
insert into followers values (3, 1);
insert into followers values (3, 2);
insert into followers values (4, 5);
insert into followers values (5, 4);
# Show all database

select * from user;
select * from post;
select * from book;
select * from `like`;
select * from filter;
select * from postfilter;
select * from comment;
