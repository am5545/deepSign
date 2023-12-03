// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DeepSign {
    struct Tweet {
        string content;
        address author;
        address mentioned;
        bool isEndorsed;
    }

    Tweet[] public tweets;

    function postTweet(string calldata _content, address _mentioned) external {
        tweets.push(Tweet({
            content: _content,
            author: msg.sender,
            mentioned: _mentioned,
            isEndorsed: false
        }));
    }

    function endorseTweet(uint _tweetId) external {
        require(tweets[_tweetId].mentioned == msg.sender, "Only the mentioned user can endorse.");
        tweets[_tweetId].isEndorsed = true;
    }
}
