--data.sql
INSERT INTO STUDENT (id, name, email) VALUES ('85905', 'Rana Beyaz', '85905@studmail.htw-aalen.de');
INSERT INTO STUDENT (id, name, email) VALUES ('85910', 'Fatme Khraizat', '85910@studmail.htw-aalen.de');
INSERT INTO STUDENT (id, name, email) VALUES ('86169', 'Emre Hirka', '86169@studmail.htw-aalen.de');
INSERT INTO STUDENT (id, name, email) VALUES ('83128', 'Emre Tülü', '83128@studmail.htw-aalen.de');
INSERT INTO STUDENT (id, name, email) VALUES ('83061', 'Evren Kacar', '83061@studmail.htw-aalen.de');

INSERT INTO COURSE ( name, description) VALUES ( 'Projektseminar Programmierprojekt', 'Ein Projekt welches in Gruppenarbeit absolviert
wird. Jede Gruppe lernt die Tools kennen, um eine Webanwendung zu programmieren.');

INSERT INTO Course_Group (id, name, course_id)
VALUES (1, 'Gruppe A', 1),
       (2, 'Gruppe B', 1);

INSERT INTO Assignment_Course_Student (course_id, student_id) VALUES (1, 85905);
INSERT INTO Assignment_Course_Student (course_id, student_id) VALUES (1, 85910);
INSERT INTO Assignment_Course_Student (course_id, student_id) VALUES (1, 83061);

INSERT INTO Assignment_Group_Student (group_id, student_id)
VALUES (1, 85905),
       (1, 85910);

INSERT INTO WEB_USER (USERNAME,PASSWORD, ROLE) values ('user1', 'password', 'ROLE_USER');
INSERT INTO WEB_USER (USERNAME,PASSWORD, ROLE) values ('user2', 'password', 'ROLE_LECTURER');


