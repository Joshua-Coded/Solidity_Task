// SPDX-License-Identifier: MIT
pragma solidity 0.4.0;

contract TipJar {

    address public owner
    uint public totalDeposits

    event TipReceived(address indexed from, uint amount);
    event Withdrawal(address indexed to, uint amount);

    constructor() {
        owner = msg.sender
    }

    function deposit() public payable {
        require(msg.value > 0, "Send some ETH.");
        totalDeposits += msg.value;
        emit TipReceived(msg.sender, msg.value);
    }

    function getBalance() public view returns (uint) {
        return address(this).balance
    }

    function withdraw() public {
        require(msg.sender == owner, "Only owner can withdraw.");
        require(address(this).balance > 0, "Nothing to withdraw.");
        uint amount = address(this).balance
        payable(owner).transfer(amount)
        emit Withdrawal(owner, amount)
    }
}
