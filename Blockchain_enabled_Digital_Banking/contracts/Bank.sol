// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Bank {
    event TransactionRecorded(address indexed from, address indexed to, uint256 amount, uint256 timestamp);
    
    mapping(address => uint256) public balances;
    uint256 public totalVolume;
    
    constructor() {
        // No need for owner in basic version
    }

    // Deposit ETH into your account
    function deposit() public payable {
        totalVolume += msg.value;
        balances[msg.sender] += msg.value;
        emit TransactionRecorded(address(0), msg.sender, msg.value, block.timestamp);
    }

    // Transfer between internal balances
    function transfer(address _to, uint256 _amount) public {
        require(_to != address(0), "Invalid recipient");
        require(balances[msg.sender] >= _amount, "Insufficient balance");
        
        balances[msg.sender] -= _amount;
        balances[_to] += _amount;
        emit TransactionRecorded(msg.sender, _to, _amount, block.timestamp);
    }

    // Withdraw ETH from your balance
    function withdraw(uint256 _amount) public {
        require(balances[msg.sender] >= _amount, "Insufficient balance");
        require(address(this).balance >= _amount, "Contract ETH balance too low");
        
        balances[msg.sender] -= _amount;
        (bool success, ) = payable(msg.sender).call{value: _amount}("");
        require(success, "Transfer failed");
        
        emit TransactionRecorded(msg.sender, address(0), _amount, block.timestamp);
    }

    // View contract balance
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // Allow contract to receive ETH
    receive() external payable {}
}
