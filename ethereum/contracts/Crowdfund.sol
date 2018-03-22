pragma solidity ^0.4.17;

contract CrowdfundFactory {
    address[] public deployedCrowdfunds;
    
    function createCrowdfund(uint minimum) public {
        address newCrowdfund = new Crowdfund(minimum, msg.sender);
        deployedCrowdfunds.push(newCrowdfund);
    }
    
    function getDeployedCrowdfunds() public view returns (address[]) {
        return deployedCrowdfunds;
    }
}

contract Crowdfund {
    struct Request {
        string description;
        uint value;
        address receiver;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }
    
    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approverCount;
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    function Crowdfund(uint minimum, address creator) public {
        manager = creator;
        minimumContribution = minimum;
    }
    
    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        approverCount++;
    }
    
    function createRequest(string description, uint value, address receiver) public restricted {
        Request memory newRequest = Request({
            description: description,
            value: value,
            receiver: receiver,
            complete: false,
            approvalCount: 0
        });
        requests.push(newRequest);
    }
    
    function approveRequest(uint index) public {
        Request storage request = requests[index];
        
        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);
        
        request.approvalCount++;
        request.approvals[msg.sender] = true;
    }
    
    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];
        
        require(!request.complete);
        require(request.approvalCount > (approverCount / 2));
        
        request.receiver.transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns (uint, uint, uint, uint, address) {
        return (
            minimumContribution,
            requests.length,
            this.balance,
            approverCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
}