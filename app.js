const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
const contractAddress = "0x6105c44A6808734d8E19aAE25643590Cd4927D55";
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_tweetId",
				"type": "uint256"
			}
		],
		"name": "endorseTweet",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllTweets",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "content",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "author",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "mentioned",
						"type": "address"
					},
					{
						"internalType": "bool",
						"name": "isEndorsed",
						"type": "bool"
					}
				],
				"internalType": "struct DeepSign.Tweet[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getMentionedTweets",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "content",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "author",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "mentioned",
						"type": "address"
					},
					{
						"internalType": "bool",
						"name": "isEndorsed",
						"type": "bool"
					}
				],
				"internalType": "struct DeepSign.Tweet[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "mentions",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_content",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "_mentioned",
				"type": "address"
			}
		],
		"name": "postTweet",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "tweets",
		"outputs": [
			{
				"internalType": "string",
				"name": "content",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "author",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "mentioned",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "isEndorsed",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

let contract = new web3.eth.Contract(contractABI, contractAddress);
abiDecoder.addABI(contractABI);
let accounts;

window.addEventListener('load', async function() {
    if (window.ethereum) {
        try {
            await window.ethereum.enable(); // Request access
            initializeApp();
        } catch (error) {
            console.error("User denied account access");
        }
    } else {
        console.log("Non-Ethereum browser detected. You should consider trying MetaMask!");
    }
});

function initializeApp() {
    contract = new web3.eth.Contract(contractABI, contractAddress);
    web3.eth.getAccounts().then((_accounts) => {
        accounts = _accounts;
        updateAccountsUI();
    });
}

function updateAccountsUI() {
    const accountsSelect = document.getElementById('accounts');
    accountsSelect.innerHTML = accounts.map(account => `<option value="${account}">${account}</option>`).join('');

    accountsSelect.onchange = function() {
        web3.eth.defaultAccount = accountsSelect.value;
				loadMentionedTweets();
    };

    // Set the first account as default
    if (accounts.length > 0) {
        web3.eth.defaultAccount = accounts[0];
				loadMentionedTweets();
    }
}

function postTweet() {
    const content = document.getElementById('tweetContent').value;
    const mentioned = document.getElementById('mentionedAddress').value;

    contract.methods.postTweet(content, mentioned).send({from: web3.eth.defaultAccount, gas: 300000})
        .then(() => {
            console.log('Tweet posted!');
            loadAllTweets();
        }).catch(error => {
            console.error('Error posting tweet:', error);
        });
}

function endorseTweet(tweetId) {
    contract.methods.endorseTweet(tweetId).send({from: web3.eth.defaultAccount, gas: 300000})
        .then(() => {
            console.log('Tweet endorsed!');
            loadAllTweets();
        }).catch(error => {
            console.error('Error endorsing tweet:', error);
        });
}

// function loadTweets() {
//     contract.methods.getAllTweets().call().then(tweets => {
//         const tweetsElement = document.getElementById('tweets');
//         tweetsElement.innerHTML = tweets.map((tweet, index) => 
//             `<div class="tweet">
//                 <p>${tweet.author}: ${tweet.content}</p>
//                 <button onclick="endorseTweet(${index})">Endorse</button>
//             </div>`
//         ).join('');
//     });
// }

function loadAllTweets() {
	contract.methods.getAllTweets().call().then(tweets => {
			const allTweetsElement = document.getElementById('allTweets');
			allTweetsElement.innerHTML = tweets.map(tweet => 
					`<div class="tweet">
							<p>${tweet.author}: ${tweet.content}</p>
					</div>`
			).join('');
	}).catch(error => {
			console.error("Error loading all tweets:", error);
	});
}

function loadMentionedTweets() {
	console.log("LoadMentionedTweets Called");
	const currentAccount = web3.eth.defaultAccount;

	// Replace 'getMentionedTweets' with the actual contract method name if different
	contract.methods.getMentionedTweets(currentAccount).call().then(tweets => {
			const mentionedTweetsElement = document.getElementById('mentionedTweets');
			mentionedTweetsElement.innerHTML = tweets.map((tweet, index) => 
					`<div class="tweet">
							<p>${tweet.author}: ${tweet.content}</p>
							${!tweet.isEndorsed ? `<button onclick="endorseTweet(${index})">Endorse</button>` : ''}
					</div>`
			).join('');
	}).catch(error => {
			console.error("Error loading mentioned tweets:", error);
	});
}

// Call this function to refresh the tweets list
initializeApp();
loadAllTweets();
