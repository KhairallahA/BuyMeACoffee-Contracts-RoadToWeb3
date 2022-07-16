// scripts/withdraw.js
const hre = require("hardhat");
const abi = require("../artifacts/contracts/BuyMeACoffee.sol/BuyMeACoffee.json");


async function getBalance(provider, address) {
    const balanceBigInt = await provider.getBalance(address);
    return hre.ethers.utils.formatEther(balanceBigInt);
}

async function main() {
    // Get the contract that has been deployed to Goerli.
    const contractAddress="0xdD0C9E9aFE9741013ac19Db70B32EDD1C753479F";
    const contractABI = abi.abi;

    // Get the node connection and wallet connection.
    const provider = new hre.ethers.providers.AlchemyProvider("rinkeby", process.env.RINKEBY_API_KEY);

    // Ensure that signer is the SAME address as the original contract deployer,
    // or else this script will fail with an error.
    const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);

    // Instantiate connected contract.
    const buyMeACoffee = new hre.ethers.Contract(contractAddress, contractABI, signer);

    
    // Check starting balances.
    console.log(`current balance of owner: ${await getBalance(provider, signer.address)} ETH`);
    console.log(`current balance of contract: ${await getBalance(provider, buyMeACoffee.address)} ETH`);


    // Buy Coffee
    // console.log("buying..");
    // const tip = {"value": hre.ethers.utils.parseEther("1")}
    // const buyCoffeeTxn = await buyMeACoffee.buyCoffee("Ahmed", "You're best!", tip);
    // await buyCoffeeTxn.wait();
    // Check starting balances.
    // console.log(`current balance of owner: ${await getBalance(provider, signer.address)} ETH`);
    // console.log(`current balance of contract: ${await getBalance(provider, buyMeACoffee.address)} ETH`);

    
    // Withdraw funds if there are funds to withdraw.
    const contractBalance = await getBalance(provider, buyMeACoffee.address);
    if (contractBalance !== "0.0") {
        console.log("withdrawing funds..")
        const withdrawTxn = await buyMeACoffee.withdrawTips();
        await withdrawTxn.wait();
    } else {
        console.log("no funds to withdraw!");
    }

    // Check starting balances.
    console.log(`current balance of owner: ${await getBalance(provider, signer.address)} ETH`);
    console.log(`current balance of contract: ${await getBalance(provider, buyMeACoffee.address)} ETH`);
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });