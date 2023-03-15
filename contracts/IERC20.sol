// SPDX-license-identifier: MIT

pragma solidity ^0.8.0;

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function ballanceOf(address account) external view returns (uint256);
}