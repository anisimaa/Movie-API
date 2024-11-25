CREATE TABLE users (  
    users_id int NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) NOT NULL,
    year_of_birth INT NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    create_time DATE DEFAULT CURRENT_DATE
);
CREATE TABLE review (  
    review_id int NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    stars INT NOT NULL,
    review_text VARCHAR(255),
    create_time DATE DEFAULT CURRENT_DATE
);

CREATE TABLE movie (  
    movie_id int NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    movie_name VARCHAR(100) NOT NULL,
    movie_year INT NOT NULL,
    create_time DATE DEFAULT CURRENT_DATE
);

CREATE TABLE genre (  
    genre_id int NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    genre_name VARCHAR(100) NOT NULL,
    create_time DATE DEFAULT CURRENT_DATE
);

CREATE TABLE favorite (  
    favorite_id int NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    create_time DATE DEFAULT CURRENT_DATE
);

-- Test data
INSERT INTO users (name, username, password, year_of_birth)
VALUES
  ('John Doe', 'johndoe123', 'password123', 1990),
  ('Jane Smith', 'janesmith456', 'password456', 1985),
  ('Alice Johnson', 'alicej789', 'password789', 2000),
  ('Bob Brown', 'bobbrown12', 'password112', 1995),
  ('Charlie Davis', 'charlied22', 'password122', 1988),
  ('Eve Black', 'eveblack55', 'password155', 1992),
  ('David Green', 'davidgreen77', 'password177', 1996);


