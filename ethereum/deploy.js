const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledCrowdfundFactory = require('./build/CrowdfundFactory.json');
const config = require('../config');

const provider = new HDWalletProvider(
    config.MNEMONIC,
    config.PROVIDER_URI
);

const web3 = new Web3(provider);


const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('正在使用账户', accounts[0], '部署合约');

    result = await new web3.eth.Contract(JSON.parse(compiledCrowdfundFactory.interface))
        .deploy({ data: compiledCrowdfundFactory.bytecode })
        .send({ from: accounts[0], gas: '1000000' });

    console.log('合约地址为：', result.options.address);
};
deploy();
