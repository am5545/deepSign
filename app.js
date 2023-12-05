const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
const contractAddress = "0xFA9075A156F6E5688b41D82f1ECAfc262d796630";
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
				console.log(web3.eth.defaultAccount);
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
	let mentioned = document.getElementById('mentionedAddress').value;

	// If no mention is entered, set the mentioned variable to the zero address
	if (mentioned === '') {
			mentioned = '0x0000000000000000000000000000000000000000';
	}

	contract.methods.postTweet(content, mentioned).send({from: web3.eth.defaultAccount, gas: 300000})
			.then(() => {
					console.log('Tweet posted!');
					loadAllTweets();
					loadMentionedTweets();
			}).catch(error => {
					console.error('Error posting tweet:', error);
			});
}


function endorseTweet(tweetId) {
    contract.methods.endorseTweet(tweetId).send({from: web3.eth.defaultAccount, gas: 300000})
        .then(() => {
            console.log('Tweet endorsed!');
            loadAllTweets();
						loadMentionedTweets();
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

// function loadAllTweets() {
// 	contract.methods.getAllTweets().call().then(tweets => {
// 			const allTweetsElement = document.getElementById('allTweets');
// 			allTweetsElement.innerHTML = tweets.map(tweet => {
// 					// Check if the mentioned address is the zero address
// 					const isZeroAddress = tweet.mentioned === '0x0000000000000000000000000000000000000000';
// 					const mentionedText = isZeroAddress ? '' : `Mentioned: ${tweet.mentioned}`;
// 					const endorsedText = isZeroAddress ? '' : tweet.isEndorsed ? ' | Endorsed' : ' | Not endorsed';
// 					return `<div class="tweet ${tweet.isEndorsed ? 'tweet-endorsed' : 'tweet-not-endorsed'}">
// 							<p>${tweet.author}: ${tweet.content} ${mentionedText}${endorsedText}</p>
// 					</div>`;
// 			}).join('');
// 	}).catch(error => {
// 			console.error("Error loading all tweets:", error);
// 	});
// }

function loadAllTweets() {
	contract.methods.getAllTweets().call().then(tweets => {
			const allTweetsElement = document.getElementById('allTweets');
			allTweetsElement.innerHTML = tweets.map(tweet => {
					const tweetClass = tweet.isEndorsed ? 'tweet-endorsed' : 'tweet-not-endorsed';
					const mentioned = tweet.mentioned ? `Mentioned: ${tweet.mentioned}` : 'No mention';
					const endorsed = tweet.isEndorsed ? 'Endorsed' : 'Not endorsed';
					return `<div class="tweet ${tweetClass}">
							<p>${tweet.author}: ${tweet.content} <br> ${mentioned} | ${endorsed}</p>
					</div>`;
			}).join('');
	}).catch(error => {
			console.error("Error loading all tweets:", error);
	});
}

function loadMentionedTweets() {
	console.log("LoadMentionedTweets Called");
	const currentAccount = web3.eth.defaultAccount;

	contract.methods.getMentionedTweets(currentAccount).call().then(tweets => {
			const mentionedTweetsElement = document.getElementById('mentionedTweets');
			mentionedTweetsElement.innerHTML = tweets
					.filter(tweet => !tweet.isEndorsed) // Filter out endorsed tweets
					.map((tweet, index) => {
							// Create a button only if the tweet is not endorsed
							const endorseButton = !tweet.isEndorsed
									? `<button onclick="endorseTweet(${index})">Endorse</button>`
									: '';
							return `<div class="tweet" id="tweet-${index}">
									<p>${tweet.author}: ${tweet.content}</p>
									${endorseButton}
									<button onclick="ignoreTweet(${index})">Ignore</button>
							</div>`;
					})
					.join('');
	}).catch(error => {
			console.error("Error loading mentioned tweets:", error);
	});
}


// Add this new function to handle the 'Ignore' button click
function ignoreTweet(index) {
	const tweetElement = document.getElementById(`tweet-${index}`);
	tweetElement.style.display = 'none'; // This hides the tweet from the UI
}


// Call this function to refresh the tweets list
initializeApp();
loadAllTweets();
