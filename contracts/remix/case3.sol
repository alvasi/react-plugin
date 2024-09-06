// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TournamentRewards  {
    struct Player {
        uint rank;
        uint gold;
        uint mysteryBoxes;
        uint characterSkins;
        bool hasEventExclusiveRing;
        uint crystalBoxes;
    }

    mapping(address => Player) public players;
    address public winner;

    function setRank(uint _rank) public {
        players[msg.sender].rank = _rank;
        distributeRewards(msg.sender);
    }

    function distributeRewards(address _player) private {
        if (_player == winner) {
            players[_player].gold += 10000;
            players[_player].mysteryBoxes += 5;
            players[_player].characterSkins += 1;
            if (!players[_player].hasEventExclusiveRing) {
                players[_player].hasEventExclusiveRing = true;
            }
            if (players[_player].crystalBoxes < 5) {
                players[_player].crystalBoxes += 5 - players[_player].crystalBoxes;
            }
        } else if (players[_player].rank <= 5) {
            players[_player].gold += 5000;
            players[_player].mysteryBoxes += 3;
            if (players[_player].crystalBoxes < 3) {
                players[_player].crystalBoxes += 3 - players[_player].crystalBoxes;
            }
        } else if (players[_player].rank <= 10) {
            players[_player].gold += 2500;
            players[_player].mysteryBoxes += 1;
            if (players[_player].crystalBoxes < 1) {
                players[_player].crystalBoxes += 1 - players[_player].crystalBoxes;
            }
        } else {
            players[_player].gold += 100;
        }
    }

    function setWinner(address _winner) public {
        winner = _winner;
        distributeRewards(winner);
    }

    function getPlayerRewards(address _player) public view returns (uint, uint, uint, bool, uint) {
        return (players[_player].gold, players[_player].mysteryBoxes, players[_player].characterSkins, players[_player].hasEventExclusiveRing, players[_player].crystalBoxes);
    }
}