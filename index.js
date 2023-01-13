import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundbutton = document.getElementById("fundbutton");
const balanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton");
balanceButton.onclick = getBalance;
connectButton.onclick = connect;
fundButton.onclick = fund;
withdrawButton.onclick = withdraw;

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        await ethereum.request({ method: "eth_requestAccounts" });
        connectButton.innerHTML = "Connected";
    } else {
        connectButton.innerHTML = "Please install MetaMask";
    }
}
async function fund() {
    const ethAmount = document.getElementById("ethAmount").value;
    console.log("Funding with" + ethAmount + "...");
    if (typeof window.ethereum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            });
        } catch (error) {
            console.log(error);
        }
    }
}
async function getBalance() {
    if (typeof window.ethereum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(contractAddress);
        console.log(ethers.utils.formatEther(balance));
    }
}

async function withdraw() {
    if (typeof window.ethereum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        try {
            const transactionResponse = await contract.withdraw();
            await listenForTransactionMine(transactionResponse, provider);
        } catch (error) {
            console.log(error);
        }
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log("Mining" + transactionResponse.hash + " !!");
    //This wait for this transaction to finish ....
    return new Promise((resolve, reject) => {});
    provider.once(transactionResponse.hash, (transactionReciept) => {
        console.log(
            "Completed with" + transactionReciept.confirmations + "confirmation"
        );
    });
    resolve();
    //Only once this transaction gets fired... we resolve this function
}
