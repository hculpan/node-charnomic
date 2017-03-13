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
        points INT DEFAULT 0,
        leftgame DATETIME NULL,
        monitor BOOLEAN DEFAULT 0
    );

    insert into players (lastname, firstname, points, onleave) values ('Boivin', 'Bill', 0, 1);
    insert into players (lastname, firstname, points, monitor) values ('Culpan', 'Harry', 8, 1);
    insert into players (lastname, firstname, points) values ('Duignan', 'Chris', 7);
    insert into players (lastname, firstname, points) values ('Koehler', 'Steve', 10);
    insert into players (lastname, firstname, points) values ('Mele', 'Al', 4);
    insert into players (lastname, firstname, points) values ('Thomason', 'Mike', 0);
    insert into players (lastname, firstname, points) values ('Wiegand', 'Paul', 0);

    commit;

end $$

delimiter ;

-- Execute the procedure
call create_players();

-- Drop the procedure
drop procedure create_players;

