var Web3 = require('web3');

if (typeof web3 !== 'undefined'){
	console.debug(web3.currentProvider);
	web3 = new Web3(web3.currentProvider);
}else{
	web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545")) 
}

//Latest Block
var coinbase = web3.eth.coinbase;
document.getElementById('coinbase').innerText = web3.eth.coinbase;

var balance = web3.eth.getBalance(coinbase);
document.getElementById('balance').innerText = web3.toDecimal(balance);

var number = web3.eth.blockNumber;
var block = web3.eth.getBlock(number)
var d = new Date(block.timestamp*1000)
document.getElementById('latestBlock').innerText = number;
document.getElementById('latestBlockTimestamp').innerText = d.toUTCString();
document.getElementById('latestBlockHash').innerText = block.hash;

var filter =web3.eth.filter('latest')
filter.watch(function(error,log){
	var latestblock=web3.eth.getBlock(log);
	d = new Date(latestblock.timestamp*1000)
	document.getElementById('latestBlock').innerText = latestblock.number;
	document.getElementById('latestBlockTimestamp').innerText = d.toUTCString();
	document.getElementById('latestBlockHash').innerText = log;

})

//Search by BlockNumber or BlockHash 
function loadBlockByNumber(){
	numberinput=document.getElementById("nb1").value;
	var txt = ""
	var data = JSON.stringify({
	  	"jsonrpc": "2.0",
	  	"method": "eth_getBlockByNumber",
	  	"params": [web3.toHex(numberinput),true],
	  	"id": 67
		});

	var xhr = new XMLHttpRequest();

	xhr.addEventListener("readystatechange", function () {
		if (this.readyState === 4) {
		obj=JSON.parse(this.responseText);
		txt += "<table>"
		for (x in obj.result) {
			if (x=="transactions"){
				txt += "<tr><td>"+x+"</td><td>"+"<table>";
				translist=JSON.parse(JSON.stringify(obj.result.transactions));
				for (x in translist){
					txt += "<tr><td>" + translist[x].hash + "</td></tr>";
				}
				txt += "</table></td></tr>"

			}else{
				txt += "<tr><td>" + x +"</td><td>" + obj.result[x] + "</td></tr>";
			}
		}
		txt+="</table>"
		document.getElementById("Block").innerHTML = txt;
	}
});

xhr.open("POST", "http://0.0.0.0:8545");
xhr.setRequestHeader("Content-Type", "application/json");
xhr.setRequestHeader("Cache-Control", "no-cache");
xhr.send(data);
}

function loadBlockByHash(){
	hash=document.getElementById("hash").value;
	var txt = ""
	var data = JSON.stringify({
	  	"jsonrpc": "2.0",
	  	"method": "eth_getBlockByHash",
	  	"params": [web3.toHex(hash),true],
	  	"id": 67
		});

	var xhr = new XMLHttpRequest();

	xhr.addEventListener("readystatechange", function () {
		if (this.readyState === 4) {
		obj=JSON.parse(this.responseText);
		txt += "<table>"
		for (x in obj.result) {
			if (x=="transactions"){
				txt += "<tr><td>"+x+"</td><td>"+"<table>";
				translist=JSON.parse(JSON.stringify(obj.result.transactions));
				for (x in translist){
					txt += "<tr><td>" + translist[x].hash + "</td></tr>";
				}
				txt += "</table></td></tr>"

			}else{
				txt += "<tr><td>" + x +"</td><td>" + obj.result[x] + "</td></tr>";
			}
		}

		document.getElementById("Block").innerHTML = txt;
	}
});

xhr.open("POST", "http://0.0.0.0:8545");
xhr.setRequestHeader("Content-Type", "application/json");
xhr.setRequestHeader("Cache-Control", "no-cache");
xhr.send(data);
}


function loadContractByHash(){
	hash=document.getElementById("contract").value;
	var txt = ""
	var data = JSON.stringify({
	  	"jsonrpc": "2.0",
	  	"method": "eth_getTransactionReceipt",
	  	"params": [hash],
	  	"id": 67
		});

	var xhr = new XMLHttpRequest();

	xhr.addEventListener("readystatechange", function () {
		if (this.readyState === 4) {
		obj=JSON.parse(this.responseText);
		txt += "<table><td>Contract Address</td><td>"
		for (x in obj.result) {
			if (x=="contractAddress"){
				txt += obj.result[x]
				}
			}
		txt +="</td></table>"	
		}
		document.getElementById("Transactioninfo").innerHTML = txt;
	});

xhr.open("POST", "http://0.0.0.0:8545");
xhr.setRequestHeader("Content-Type", "application/json");
xhr.setRequestHeader("Cache-Control", "no-cache");
xhr.send(data);
}
