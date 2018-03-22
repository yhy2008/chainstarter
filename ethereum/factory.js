import web3 from './web3';
import CrowdfundFactory from './build/CrowdfundFactory.json';
import config from '../config';

const factory = new web3.eth.Contract(
    JSON.parse(CrowdfundFactory.interface),
    config.FACTORY_ADDRESS
);

export default factory;