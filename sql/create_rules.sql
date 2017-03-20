use charnomic;

DELIMITER $$

create procedure create_rules()
begin
    drop table if exists rules;

    create table rules (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        rule TEXT,
        name VARCHAR(255),
        num INT,
        proposedby INT,
        proposeddate DATETIME,
        voteopend DATETIME,
        voteclosed DATETIME,
        status varchar(10),

        FOREIGN KEY (proposedby)
              REFERENCES players(id)
              ON UPDATE CASCADE ON DELETE RESTRICT
    );

    insert into rules (rule, name, num)
      values ('All players must always abide by all the rules then in effect, in
        the form in which they are then in effect. The rules in the Initial Set
        are in effect when the game begins. The Initial Set consists of Rules
        1-11. Players start the game with zero points.', null, 1);

    insert into rules (rule, name, num)
      values ('A rule-change is the enactment, repeal, or amendment of a rule.', null, 2);

    insert into rules (rule, name, num)
      values ('Players shall alternate in alphabetical order by surname,
        taking one turn apiece. A player may voluntarily pass his or her turn,
        and any player who does not initiate their turn within 3 days of the
        turn starting shall have their turn involuntarily skipped and lose 10
        points.', null, 3);

    insert into rules (rule, name, num)
      values ('Each player on their turn proposes one rule-change and has
        it voted on. Each proposal will be given a number, starting with 12,
        and each proposal shall receive the next successive integer whether or
        not it is adopted. The player will receive a number of points equal to
        the number of the proposed rule-change multiplied by the fraction of
        votes in favor, rounding down.', null, 4);

    insert into rules (rule, name, num)
      values ('The winner is the first player to achieve 200 (positive) points.', null, 5);

    insert into rules (rule, name, num)
      values ('A rule-change is adopted if and only if the proposal receives a
        majority of votes in favor and no votes against. Any player may choose
        to abstain from the vote. If a player fails to vote within 3 days of the
        vote being called, their vote will be assumed to be an abstention. The
        voting must be completed within 7 days of the proposal’s initial
        introduction or the proposal will be rejected. The proposing player may
        call for a vote earlier than that, and he or she determines the final
        form of the proposal to be voted on prior to any votes being cast.', null, 6);

    insert into rules (rule, name, num)
      values ('An adopted rule-change takes full effect immediately at the
        completion of the vote that adopted it. New rules will be assigned the
        number of the proposal, and amended rules will have their number changed
        to match the proposal''s number.', null, 7);

    insert into rules (rule, name, num)
      values ('Each player always has exactly one vote.', null, 8);

    insert into rules (rule, name, num)
      values ('If two or more rules conflict with one another, then the rule
        with the lowest ordinal number takes precedence.', null, 9);

    insert into rules (rule, name, num)
      values ('If players disagree about the legality of a move or the
        interpretation or application of a rule, then the player preceding the
        one moving is to be the Judge and decide the question. Disagreement for
        the purposes of this rule may be created by the insistence of any
        player. This process is called invoking Judgment. The previous acting
        player becomes the Judge, and the Judge gives a decision. The Judge''s
        Judgment may be overruled only by a majority of favorable votes with
        no votes against by the other players taken before the next turn is begun.
        If a Judge''s Judgment is overruled, the player prior to the first Judge
        becomes a new Judge and gives a decision, and do as same as above until
        Judgement is not overruled. All Judgments, whether overruled or not,
        shall be recorded, but future judges are not bound by these decisions.', null, 10);

    insert into rules (rule, name, num)
      values ('The state of the game will be managed by a player called the
        Game Monitor, hereafter referred to as the GM. This individual will be
        responsible for preserving the current state of the Rules, maintaining
        records of any Judgments, the score of each player, and the order of
        turns. In addition, the GM will maintain any other game state information
        that may become necessary as the rules change. This information will
        be maintained in a location that all the players may access freely.
        The GM is Harry Culpan.', null, 11);

    insert into rules (rule, name, num)
      values ('A player may take temporary leave of the game by notifying the
        other players that they will not be playing and the dates of their
        leave. During this period, they will automatically, voluntarily pass
        their turn pursuant to Rule 3 as soon as their turn commences and
        Abstain from all voting. The Player on Leave may not vote or make
        proposals while on Leave. The Player on Leave may rejoin the game
        early by notifying the other players and then resuming play.', 'Player on Leave', 13);

    insert into rules (rule, name, num)
      values ('No Proposal may be enacted which directly, specifically and
        negatively affect any player or players currently on Leave as that
        term is defined in Rule 13. A proposal "directly, specifically and
        negatively" affects a player or players currently on Leave if, in the
        opinion of the Judge, (a) the proposal is intended to or in application
        will effect the player such that he would definitely have voted "No" to
        the proposal had he not been on Leave, and (b) the proposal effects any
        players then on Leave more than those not on Leave.', 'The "No
        Targeting of Players on Leave" Act', 14);

    insert into rules (rule, name, num)
      values ('Each player is given a level starting at level 1. Each player
        will be given an initial account balance of 0 gold pieces.', null, 16);

    commit;

end $$

delimiter ;

-- Execute the procedure
call create_rules();

-- Drop the procedure
drop procedure create_rules;
