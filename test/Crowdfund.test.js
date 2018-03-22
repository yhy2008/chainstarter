const ganache = require('ganache-cli');
const Web3 = require('web3');
const assert = require('assert');

const provider = ganache.provider();
const web3 = new Web3(provider);

const compiledCrowdfund = require('../ethereum/build/Crowdfund.json');
const compiledFactory = require('../ethereum/build/CrowdfundFactory.json');

let accounts;
let factory;
let crowdfundAddress;
let crowdfund;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ from: accounts[0], gas: '1000000' });
    
    factory.setProvider(provider);

    await factory.methods.createCrowdfund('100').send({
        from: accounts[0],
        gas: '1000000'
    });
    [crowdfundAddress] = await factory.methods.getDeployedCrowdfunds().call();
    crowdfund = await new web3.eth.Contract(
        JSON.parse(compiledCrowdfund.interface),
        crowdfundAddress
    );
});

describe('Crowdfunds', () => {
    it('deploy a fatory and a crowdfund', () => {
        assert.ok(factory.options.address);
        assert.ok(crowdfund.options.address);
    });

    it('marks creator as crowdfund manager', async () => {
        const manager = await crowdfund.methods.manager().call();
        assert.equal(accounts[0], manager);
    });

    it('allow contribute and mark as approver', async () => {
        await crowdfund.methods.contribute().send({
            from: accounts[1],
            value: '1000'
        });

        isApprover = await crowdfund.methods.approvers(accounts[1]).call();
        assert(isApprover);
    });

    it('requires a minimum contribution value', async () => {
        try {
            await crowdfund.methods.contribute.send({
                from: accounts[1],
                value: '50'
            });
            assert(false);
        } catch (err) {
            assert.ok(err)
        }
    });

    it('manager has ability to make a request', async () => {
        await crowdfund.methods.createRequest('test create', '10000', accounts[1]).send({
            from: accounts[0],
            gas: '1000000'
        });

        const request = await crowdfund.methods.requests(0).call();
        assert.equal('test create', request.description);
        assert.equal(accounts[1], request.receiver);
    });

    it('process request', async () => {
        await crowdfund.methods.contribute().send({
            from: accounts[1],
            value: web3.utils.toWei('2', 'ether')
        });

        await crowdfund.methods.createRequest('first request', web3.utils.toWei('1', 'ether'), accounts[2]).send({
            from: accounts[0],
            gas: '1000000'
        });
        await crowdfund.methods.approveRequest(0).send({
            from: accounts[1],
            gas: '1000000'
        });

        const beforeBalance = await web3.eth.getBalance(accounts[2]);
        await crowdfund.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        const afterBalance = await web3.eth.getBalance(accounts[2]);
        const difference = afterBalance - beforeBalance;

        assert(web3.utils.fromWei(difference.toString(), 'ether') > 0.9);
    });
});