use charnomic;

DELIMITER $$

create procedure create_players()
begin
    drop table if exists players;

    create table players (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        password VARCHAR(20),
        firstname VARCHAR(30),
        lastname VARCHAR(50),
        joined DATETIME DEFAULT CURRENT_TIMESTAMP,
        turn BOOLEAN DEFAULT 0,
        onleave BOOLEAN DEFAULT 0,
        active BOOLEAN DEFAULT 1,
        points INT DEFAULT 0,
        level INT DEFAULT 1,
        gold INT DEFAULT 0,
        vetoes INT DEFAULT 3,
        leftgame DATETIME NULL,
        monitor BOOLEAN DEFAULT 0
    );

    insert into players (lastname, firstname, points, onleave) values ('Boivin', 'Bill', 10, 1);
    insert into players (lastname, firstname, points, monitor) values ('Culpan', 'Harry', 18, 1);
    insert into players (lastname, firstname, points, onleave) values ('Duignan', 'Chris', 17, 1);
    insert into players (lastname, firstname, points, onleave) values ('Koehler', 'Steve', 20, 1);
    insert into players (lastname, firstname, points) values ('Mele', 'Al', 19);
    insert into players (lastname, firstname, points, turn) values ('Thomason', 'Mike', 19, 1);
    insert into players (lastname, firstname, points) values ('Wiegand', 'Paul', 19);

    commit;

end $$

delimiter ;

-- Execute the procedure
call create_players();

-- Drop the procedure
drop procedure create_players;
