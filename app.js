const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
const contractAddress = "0xd663f777b436298beEAb89f3254B34C56700a00E";
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
		"stateMutability": "nonpayable",
		"type": "constructor"
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
    };

    // Set the first account as default
    if (accounts.length > 0) {
        web3.eth.defaultAccount = accounts[0];
    }
}

function postTweet() {
    const content = document.getElementById('tweetContent').value;
    const mentioned = document.getElementById('mentionedAddress').value;

    contract.methods.postTweet(content, mentioned).send({from: web3.eth.defaultAccount})
        .then(() => {
            console.log('Tweet posted!');
            loadTweets();
        }).catch(error => {
            console.error('Error posting tweet:', error);
        });
}

function endorseTweet(tweetId) {
    contract.methods.endorseTweet(tweetId).send({from: web3.eth.defaultAccount})
        .then(() => {
            console.log('Tweet endorsed!');
            loadTweets();
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

function loadTweets() {
    console.log("Loading tweets...");

    contract.methods.getAllTweets().call().then(tweets => {
        console.log("Tweets loaded:", tweets);

        const tweetsElement = document.getElementById('tweets');
        tweetsElement.innerHTML = tweets.map((tweet, index) => 
            `<div class="tweet">
                <p>${tweet.author}: ${tweet.content}</p>
                <button onclick="endorseTweet(${index})">Endorse</button>
            </div>`
        ).join('');
    }).catch(error => {
        console.error("Error loading tweets:", error);
    });
    console.log("accounts", accounts);
}


// Call this function to refresh the tweets list
initializeApp();
loadTweets();
