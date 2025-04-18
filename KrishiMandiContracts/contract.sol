// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PostHarvestingContract.sol";

contract PostHarvestingContractFactory {
    address public owner;
    address[] public deployedContracts;
    mapping(address => bool) public isContractDeployed;
    mapping(string => address[]) public farmerContracts; // Track contracts by farmerId
    mapping(string => address[]) public buyerContracts;  // Track contracts by buyerId

    event ContractDeployed(
        address indexed contractAddress,
        string indexed buyerId,
        string indexed farmerId,
        uint256 timestamp
    );

    constructor() {
        owner = msg.sender;
    }

    function createContract(
        string memory _buyerId,
        string memory _farmerId,
        uint256 _setPrice,
        string memory _cropType,
        uint256 _quantity,
        uint256 _duration,
        string memory _buyerSecret,
        string memory _farmerSecret
    ) public returns (address) {
        PostHarvestingContract newContract = new PostHarvestingContract();
        
        newContract.initialize(
            _buyerId,
            _farmerId,
            _setPrice,
            _cropType,
            _quantity,
            _duration,
            _buyerSecret,
            _farmerSecret
        );

        address contractAddress = address(newContract);
        
        deployedContracts.push(contractAddress);
        isContractDeployed[contractAddress] = true;
        farmerContracts[_farmerId].push(contractAddress);
        buyerContracts[_buyerId].push(contractAddress);

        emit ContractDeployed(
            contractAddress,
            _buyerId,
            _farmerId,
            block.timestamp
        );

        return contractAddress;
    }

    // Get all deployed contracts
    function getDeployedContracts() public view returns (address[] memory) {
        return deployedContracts;
    }

    // Get contracts for a specific farmer
    function getFarmerContracts(string memory _farmerId) public view returns (address[] memory) {
        return farmerContracts[_farmerId];
    }

    // Get contracts for a specific buyer
    function getBuyerContracts(string memory _buyerId) public view returns (address[] memory) {
        return buyerContracts[_buyerId];
    }

    // Get total number of contracts
    function getContractCount() public view returns (uint256) {
        return deployedContracts.length;
    }
}