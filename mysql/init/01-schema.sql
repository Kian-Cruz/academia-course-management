
CREATE DATABASE IF NOT EXISTS nextjs_db;
USE nextjs_db;

CREATE TABLE IF NOT EXISTS instructor (
    id INT NOT NULL AUTO_INCREMENT,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS courses (
    id INT NOT NULL AUTO_INCREMENT,
    code VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    credits INT NOT NULL,
    semester VARCHAR(20) NOT NULL,
    seats INT NOT NULL,
    instructorId INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (instructorId) REFERENCES instructor(id)
);

INSERT INTO instructor (fullname, email) VALUES
('Karn Yongsiriwit', 'karn@me.com'),
('Ana Silva', 'ana@me.com');

INSERT INTO courses
(code, title, credits, semester, seats, instructorId)
VALUES
('DIT312', 'Web Application Development', 3, '1/2026', 40, 1),
('DIT201', 'Database Systems', 3, '1/2026', 35, 1),
('DIT330', 'Cloud & DevOps', 3, '2/2026', 30, 2),
('DIT150', 'Introduction to Programming', 3, '1/2026', 50, 2);
