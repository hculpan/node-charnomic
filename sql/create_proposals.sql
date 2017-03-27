use charnomic;

DELIMITER $$

create procedure create_proposals()
begin
    drop table if exists proposals;

    create table proposals (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        proposal TEXT,
        name VARCHAR(255),
        num INT,
        proposedby INT,
        proposeddate DATETIME,
        voteopened DATETIME,
        voteclosed DATETIME,
        status varchar(10),

        FOREIGN KEY (proposedby)
              REFERENCES players(id)
              ON UPDATE CASCADE ON DELETE RESTRICT
    );

    insert into proposals (proposal, name, num, status, proposedby,
        proposeddate, voteopened, voteclosed)
      values ('Be it proposed that the first line of rule 6 will be changed to:
        "A rule-change is adopted if and only if the proposal receives votes in
        favor from a majority of players in the game."

        A rule-change is adopted if and only if the proposal receives votes in
        favor from a majority of players in the game. Any player may choose to
        abstain from the vote. If a player fails to vote within 3 days of the
        vote being called, their vote will be assumed to be an abstention.
        The voting must be completed within 7 days of the proposal’s initial
        introduction or the proposal will be rejected. The proposing player may
        call for a vote earlier than that, and he or she determines the final
        form of the proposal to be voted on prior to any votes being cast.',
        null, 12, 'failed', 2,
        '2017-02-25 17:00:00', '2017-02-27 20:00:00', '2017-03-28 08:00:00');

    insert into proposals (proposal, name, num, status, proposedby,
        proposeddate, voteopened, voteclosed)
      values ('A new rule shall be added that says:
        A player may take temporary leave of the game by notifying the other
        players that they will not be playing and the dates of their
        leave. During this period, they will automatically, voluntarily
        pass their turn pursuant to Rule 3 as soon as their turn commences and
        Abstain from all voting. The Player on Leave may not vote or make
        proposals while on Leave. The Player on Leave may rejoin the game
        early by notifying the other players and then resuming play.', 'Player on Leave',
        13, 'passed', 3,
        '2017-02-28 12:41:00', '2017-03-02 08:47:00', '2017-03-05 20:30:00');

    insert into proposals (proposal, name, num, status, proposedby,
        proposeddate, voteopened, voteclosed)
      values ('A new Rule shall be enacted:

        No Proposal may be enacted which directly, specifically and negatively
        affect any player or players currently on Leave as that term is defined
        in Rule 13. A proposal "directly, specifically and negatively" affects
        a player or players currently on Leave if, in the opinion of the Judge,
        (a) the proposal is intended to or in application will effect the player
        such that he would definitely have voted "No" to the proposal had he
        not been on Leave, and (b) the proposal effects any players then on
        Leave more than those not on Leave.', 'The "No Targeting of Players
        on Leave" Act', 14, 'passed', 4,
        '2017-03-07 09:12:00', '2017-03-08 06:45:00', '2017-03-08 12:09:00');

    insert into proposals (proposal, name, num, status, proposedby,
        proposeddate, voteopened, voteclosed)
      values ('I propose the following rule-change, being the enactment of rule 15 with the following content:

        Any player may request permission to invite one or more specifically named persons (each
        individually referred to as a "Potential Player") to join the game. Current players have
        24 hours to respond with an affirmative, negative, abstention or veto for each
        Potential Player. Current players not responding to the proposal of a Potential Player
        within 24 hours are determined to have abstained for that Potential Player.
        Permission is granted with a simple majority of "Active Responders" (affirmative responders / total
        non-abstaining responders), and no vetos. Each Player is allowed three lifetime vetos which
        may be used to forbid a new player from joining the game, regardless of the voting results
        from other players. Potential Players who are granted permission to join, and choose to join,
        start with a number of points equal to the lowest non-negative point total of active players,
        and assume their turn position pursuant to Rule 3 as of the conclusion of the turn active at the
        time of their joining. The inviting player ("Sponsor") earns 3 points per new player who joins
        under this rule and makes at least one proposal. The total maximum points over the course of
        the game which may be awarded to a Sponsor under this rule is 15. Players who have their turn
        involuntarily skipped twice consecutively are removed from the game by the Game Monitor.',
        null, 15, 'failed', 5,
        '2017-03-08 19:21:00', '2017-03-09 18:58:00', '2017-03-09 21:59:00');

    insert into proposals (proposal, name, num, status, proposedby,
        proposeddate, voteopened, voteclosed)
      values ('I propose a new rule be added that states:

        Each player is given a level starting at level 1.
        Each player will be given an initial account balance of 0 gold pieces.', null, 16, 'passed', 6,
        '2017-03-09 19:01:00', '2017-03-14 11:38:00', '2017-03-15 21:00:00');

    commit;

end $$

delimiter ;

-- Execute the procedure
call create_proposals();

-- Drop the procedure
drop procedure create_proposals;
