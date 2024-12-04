
# [OPTIONAL]
delete from user;
delete from post;             
delete from book;             
delete from comment;          
delete from filter;         
delete from `like`;             
delete from postfilter; 


# Insert usersi              EMAIL              USERNAME      F_NAME        l_NAME_     ID  PASSWORD BIO  CREATED_AT
insert into user values ("alejandro@test.com", "Alejandro",   "Alejandro",   NULL,       1, "$2b$12$r3JW.rmsG11lNEgMu3xYYedyd0sBiMrkXYEy47z8/eH4vnrhYnQfK",  NULL, NULL); # Password is -> "contraseña"
insert into user values ("mar@test.com",       "Maruja",      "Mar",         NULL,       2, "$2b$12$r3JW.rmsG11lNEgMu3xYYedyd0sBiMrkXYEy47z8/eH4vnrhYnQfK",  NULL, NULL); # Password is -> "contraseña"
insert into user values ("william@test.com",   "William",     "William D",   NULL,       3, "$2b$12$r3JW.rmsG11lNEgMu3xYYedyd0sBiMrkXYEy47z8/eH4vnrhYnQfK",  NULL, NULL); # Password is -> "contraseña"
insert into user values ("malik@test.com",     "Malik",       "Malik",       NULL,       4, "$2b$12$r3JW.rmsG11lNEgMu3xYYedyd0sBiMrkXYEy47z8/eH4vnrhYnQfK",  NULL, NULL); # Password is -> "contraseña"
insert into user values ("victor@test.com",    "Victor",      "Victor",      NULL,       5, "$2b$12$r3JW.rmsG11lNEgMu3xYYedyd0sBiMrkXYEy47z8/eH4vnrhYnQfK",  NULL, NULL); # Password is -> "contraseña"
insert into user values ("arnau@test.com",     "Arnau",       "Arnau",       NULL,       6, "$2b$12$r3JW.rmsG11lNEgMu3xYYedyd0sBiMrkXYEy47z8/eH4vnrhYnQfK",  NULL, NULL); # Password is -> "contraseña"

# Insert books -         ID, TITLE, AUTHOR, DESCRIPTION, CREATED_AT
insert into book values (1, "Asesinato en el Orient Express", "Agatha Christie", "Un asesinato misterioso ocurre en un lujoso tren, y Hércules Poirot debe resolverlo.", CURRENT_TIMESTAMP);
insert into book values (2, "Cien años de soledad", "Gabriel García Márquez", "La historia mágica y trágica de la familia Buendía en Macondo.", CURRENT_TIMESTAMP);
insert into book values (3, "1984", "George Orwell", "Una distopía donde el Gran Hermano lo controla todo, y la libertad es solo un sueño.", CURRENT_TIMESTAMP);
insert into book values (4, "El principito", "Antoine de Saint-Exupéry", "Un cuento encantador sobre la amistad y el descubrimiento.", CURRENT_TIMESTAMP);
insert into book values (5, "El señor de los anillos", "J.R.R. Tolkien", "La épica aventura para destruir el Anillo Único y salvar la Tierra Media.", CURRENT_TIMESTAMP);
insert into book values (8, "Orgullo y prejuicio", "Jane Austen", "La historia de amor entre Elizabeth Bennet y Fitzwilliam Darcy.", CURRENT_TIMESTAMP);

# Insert posts -        ID, BOOKID, USERID, CONTENT, LIKES, CREATED_AT
insert into post values (1,     4,      1, "El principito es un libro maravilloso. Me hizo reflexionar sobre la vida y la amistad.", 5, CURRENT_TIMESTAMP);
insert into post values (2,     1,      2, "Hércules Poirot es el mejor detective. ¡Qué historia! El final me dejó boquiabierta.", 7, CURRENT_TIMESTAMP);
insert into post values (3,     2,      3, "La narrativa mágica de Macondo me hizo reflexionar sobre la vida y el tiempo.", 10, CURRENT_TIMESTAMP);
insert into post values (4,     3,      4, "1984 es un libro impactante. Me hizo cuestionar todo sobre el poder y la libertad.", 8, CURRENT_TIMESTAMP);
insert into post values (5,     5,      5, "Una aventura épica. Tolkien es el maestro de la fantasía.", 12, CURRENT_TIMESTAMP);
insert into post values (8,     8,      1, "Acabo de terminar Orgullo y prejuicio y estoy completamente enamorado/a de esta historia. 💕✨ Austen es maravilloso.", 3, CURRENT_TIMESTAMP);

# Insert filters -  ID, NAME
insert into filter values (1, "Drama");
insert into filter values (2, "Comedia");
insert into filter values (3, "Terror");
insert into filter values (4, "Fantasía");
insert into filter values (5, "Aventura");
insert into filter values (6, "Distopía");
insert into filter values (7, "Ciencia Ficción");
insert into filter values (8, "Romance");
insert into filter values (9, "Police");
insert into filter values (10, "Misterio");

# Insert postFilters - POSTID, FILTERID
insert into postfilter values (1, 4); -- El principito: drama, fantasía
insert into postfilter values (1, 5);

insert into postfilter values (2, 1); -- Asesinato en el Orient Express: drama, misterio, policíaco
insert into postfilter values (2, 9);
insert into postfilter values (2, 10);

insert into postfilter values (3, 1); -- Cien años de soledad: drama mágico
insert into postfilter values (3, 4);

insert into postfilter values (4, 6); -- 1984: distopía, drama
insert into postfilter values (4, 1);

insert into postfilter values (5, 4); -- El señor de los anillos: fantasía, aventura
insert into postfilter values (5, 1);

insert into postfilter values (8, 8); -- Orgullo y prejuicio: romance, drama, comedia
insert into postfilter values (8, 1);
insert into postfilter values (8, 2);

# Insert Likes            USRID POSTID
insert into `like` values (   1,    1);
insert into `like` values (   1,    2);
insert into `like` values (   1,    3);
insert into `like` values (   1,    8);
insert into `like` values (   2,    1);
insert into `like` values (   2,    2);
insert into `like` values (   2,    8);
insert into `like` values (   3,    1);
insert into `like` values (   3,    8);
insert into `like` values (   4,    1);

# Insert Comments         ID, USERID, POSTID, CONTENT, CREATED_AT
insert into comment values (NULL, 1, 1, "¡Me encantó el final! Agatha Christie es increíble.", CURRENT_TIMESTAMP);
insert into comment values (NULL, 2, 1, "Poirot es un genio, este caso fue alucinante.", CURRENT_TIMESTAMP);
insert into comment values (NULL, 4, 1, "Cuando acabes el libro, con Poirot hablando a todos, ¡qué genial! No me esperaba ese final, increíble!", CURRENT_TIMESTAMP);
insert into comment values (NULL, 3, 3, "La historia de los Buendía es tan compleja como hermosa.", CURRENT_TIMESTAMP);
insert into comment values (NULL, 4, 4, "1984 me dejó pensando mucho en la privacidad hoy en día.", CURRENT_TIMESTAMP);
insert into comment values (NULL, 5, 5, "La Tierra Media es un mundo espectacular. Recomendado.", CURRENT_TIMESTAMP);
insert into comment values (NULL, 2, 8, "¡Orgullo y prejuicio es mi libro favorito! Darcy es tan... 😍", CURRENT_TIMESTAMP);
insert into comment values (NULL, 3, 8, "¡Me encantó Orgullo y prejuicio! Austen es una genia.", CURRENT_TIMESTAMP);
insert into comment values (NULL, 4, 8, "Los protagonistas de ese libro son tan entrañables.", CURRENT_TIMESTAMP);


# Insert followers   FOLLOWERID, FOLLOWEDID
insert into followers values (1, 2);
insert into followers values (1, 3);
insert into followers values (1, 4);
insert into followers values (2, 1);
insert into followers values (2, 3);
insert into followers values (3, 1);
insert into followers values (3, 2);
insert into followers values (4, 5);
insert into followers values (5, 4);

# Show all database content
select * from user;
select * from post;
select * from book;
select * from `like`;
select * from filter;
select * from postfilter;
select * from comment;
