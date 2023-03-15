// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IERC20 {
    function totalSupply() external view returns (uint256);

    function ballanceOf(address account) external view returns (uint256);

    function transfer(address recipient, uint256 amount) external returns (bool);

    function allowance(address owner, address spender) external view returns (uint256);

    function approve(address spender, uint amount) external returns (bool);

    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);

}

//WRDAO tokenomics contract
contract WRDAO is IERC20 {
    //State variables
    string public name = "WRDAO";
    string public symbol = "WRDAO";
    uint8 public decimals = 18;
    uint256 public totalSupply = 1000000000 * 10**18;

    mapping(address => uint256) public balances;

    mapping(address => mapping(address => uint256)) public allowances;

    constructor() {
        balances[msg.sender] = totalSupply;
    }

    //get balance of tokens for an amount
    function balanceOf(address account) external view override returns (uint256) {
        return balances[account];
    }

    //transfer tokens from caller to recipient
    function transfer(address recipient, uint256 amount) external override returns (bool) {
        require(balances[msg.sender] >= amount, "Transfer balance");
        balances[msg.sender] -= amount;
        balances[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    //approve spender to transfer tokens on behalf of owner
    function approve(address spender, uint256 amount) external override returns (bool) {
        allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    //allowance for a spender to transfer tokens on behalf of owner
    function allowance (address owner, address spender) external view override returns (uint256) {
        return allowances[owner][spender];
    }

    //transfer tokens from sender to recipient on bnehalf of sender's approval
    function transferFrom(address sender, address recipient, uint256 amount) external overrride returns (bool) {
        require(balances[sender] >= amount, "Insuficient balance");
        require(allowances[sender][msg.sender] >= amount, "Insuficient allowance");
        balances[sendder] -= amount;
        balances[recipient] += amount;
        allowances[sender][msg.sender] -= amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }
}