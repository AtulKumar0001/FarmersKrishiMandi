// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PostHarvestingContract {
    struct ContractDetails {
        string buyerId;
        string farmerId;
        uint256 setPrice;
        string cropType;
        uint256 quantity;
        uint256 duration;
        string contractStatus;
        uint256 createdAt;
        bool buyerVerified;
        bool farmerVerified;
    }

    ContractDetails public contractData;
    string private buyerSecret;
    string private farmerSecret;
    bool private initialized;

    // Events
    event ContractInitialized(string message);
    event ContractCompleted(string message);
    event ContractRejected(string message);
    event BuyerVerified(string buyerId);
    event FarmerVerified(string farmerId);

    modifier onlyOnce() {
        require(!initialized, "Contract already initialized");
        initialized = true;
        _;
    }

    modifier contractActive() {
        require(initialized, "Contract not initialized");
        require(
            keccak256(abi.encodePacked(contractData.contractStatus)) == 
            keccak256(abi.encodePacked("Pending")),
            "Contract is not active"
        );
        _;
    }

    function initialize(
        string memory _buyerId,
        string memory _farmerId,
        uint256 _setPrice,
        string memory _cropType,
        uint256 _quantity,
        uint256 _duration,
        string memory _buyerSecret,
        string memory _farmerSecret
    ) public onlyOnce {
        require(bytes(_buyerSecret).length > 0, "Buyer secret cannot be empty");
        require(bytes(_farmerSecret).length > 0, "Farmer secret cannot be empty");
        require(_setPrice > 0, "Price must be greater than 0");
        require(_quantity > 0, "Quantity must be greater than 0");
        require(_duration > 0, "Duration must be greater than 0");

        contractData = ContractDetails({
            buyerId: _buyerId,
            farmerId: _farmerId,
            setPrice: _setPrice,
            cropType: _cropType,
            quantity: _quantity,
            duration: _duration,
            contractStatus: "Pending",
            createdAt: block.timestamp,
            buyerVerified: false,
            farmerVerified: false
        });

        buyerSecret = _buyerSecret;
        farmerSecret = _farmerSecret;

        emit ContractInitialized("Contract successfully initialized!");
    }

    function verifyBuyerSecret(string memory _secret) public contractActive {
        require(!contractData.buyerVerified, "Buyer already verified");
        require(
            keccak256(abi.encodePacked(_secret)) == 
            keccak256(abi.encodePacked(buyerSecret)),
            "Invalid buyer secret"
        );

        contractData.buyerVerified = true;
        emit BuyerVerified(contractData.buyerId);

        _checkAndUpdateContractStatus();
    }

    function verifyFarmerSecret(string memory _secret) public contractActive {
        require(!contractData.farmerVerified, "Farmer already verified");
        require(
            keccak256(abi.encodePacked(_secret)) == 
            keccak256(abi.encodePacked(farmerSecret)),
            "Invalid farmer secret"
        );

        contractData.farmerVerified = true;
        emit FarmerVerified(contractData.farmerId);

        _checkAndUpdateContractStatus();
    }

    function completeContract() public contractActive {
        require(
            block.timestamp >= contractData.createdAt + contractData.duration,
            "Contract duration has not ended"
        );
        
        _checkAndUpdateContractStatus();
    }

    function getContractStatus() public view returns (
        string memory status,
        bool buyerVerified,
        bool farmerVerified,
        uint256 remainingTime
    ) {
        uint256 endTime = contractData.createdAt + contractData.duration;
        uint256 remaining = block.timestamp >= endTime ? 0 : endTime - block.timestamp;

        return (
            contractData.contractStatus,
            contractData.buyerVerified,
            contractData.farmerVerified,
            remaining
        );
    }

    function _checkAndUpdateContractStatus() private {
        if (contractData.buyerVerified && contractData.farmerVerified) {
            if (block.timestamp >= contractData.createdAt + contractData.duration) {
                contractData.contractStatus = "Fulfilled";
                emit ContractCompleted("Contract successfully completed!");
            }
        } else if (block.timestamp >= contractData.createdAt + contractData.duration) {
            contractData.contractStatus = "Rejected";
            emit ContractRejected("Contract rejected due to incomplete verification");
        }
    }

    // View functions for contract details
    function getContractDetails() public view returns (
        string memory buyerId,
        string memory farmerId,
        uint256 setPrice,
        string memory cropType,
        uint256 quantity,
        uint256 duration,
        uint256 createdAt
    ) {
        return (
            contractData.buyerId,
            contractData.farmerId,
            contractData.setPrice,
            contractData.cropType,
            contractData.quantity,
            contractData.duration,
            contractData.createdAt
        );
    }

    // Emergency function to handle stuck contracts
    function emergencyReject() public {
        require(initialized, "Contract not initialized");
        require(
            block.timestamp >= contractData.createdAt + contractData.duration + 1 days,
            "Emergency period not reached"
        );
        
        contractData.contractStatus = "Rejected";
        emit ContractRejected("Contract rejected through emergency function");
    }
}