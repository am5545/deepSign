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
    mapping(address => uint[]) public mentions;

    function getAllTweets() public view returns (Tweet[] memory) {
        return tweets;
    }
    
    function postTweet(string calldata _content, address _mentioned) external {
        Tweet memory newTweet = Tweet({
            content: _content,
            author: msg.sender,
            mentioned: _mentioned,
            isEndorsed: false
        });

        tweets.push(newTweet);
        
        // If a mentioned address is provided, add the tweet to their mentions
        if(_mentioned != address(0)) {
            mentions[_mentioned].push(tweets.length - 1);
        }
    }


    function endorseTweet(uint _tweetId) external {
        require(tweets[_tweetId].mentioned == msg.sender, "Only the mentioned user can endorse.");
        tweets[_tweetId].isEndorsed = true;
    }
    function getMentionedTweets(address user) public view returns (Tweet[] memory) {
        uint[] memory mentionedIndices = mentions[user];
        Tweet[] memory userMentions = new Tweet[](mentionedIndices.length);

        for (uint i = 0; i < mentionedIndices.length; i++) {
            userMentions[i] = tweets[mentionedIndices[i]];
        }
        return userMentions;
    }
}
