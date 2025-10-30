// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FarmContract {
    enum DeliveryStatus {
        Pending,
        Accepted,
        InProgress,
        ReadyForDelivery,
        Completed,
        Cancelled
    }

    struct Contract {
        uint256 id;
        address farmer;
        address contractor;
        string cropName;
        uint256 price;
        uint256 expectedDeliveryDate;
        DeliveryStatus deliveryStatus;
        bytes32 farmerOtpHash;
        bytes32 contractorOtpHash;
    }

    uint256 private contractCounter;
    mapping(uint256 => Contract) public contracts;

    event ContractCreated(
        uint256 indexed contractId,
        address indexed farmer,
        address indexed contractor,
        string cropName,
        uint256 price,
        uint256 expectedDeliveryDate
    );

    event StatusUpdated(uint256 indexed contractId, DeliveryStatus status);

    function createContract(
        address _farmer,
        string memory _cropName,
        uint256 _price,
        uint256 _expectedDeliveryDate,
        string memory _farmerOtp,
        string memory _contractorOtp
    ) external returns (uint256) {
        require(_farmer != address(0), "Invalid farmer address");
        require(_price > 0, "Price must be greater than zero");
        require(
            _expectedDeliveryDate > block.timestamp,
            "Expected delivery date must be in the future"
        );

        contractCounter++;
        uint256 contractId = contractCounter;

        contracts[contractId] = Contract({
            id: contractId,
            farmer: _farmer,
            contractor: msg.sender,
            cropName: _cropName,
            price: _price,
            expectedDeliveryDate: _expectedDeliveryDate,
            deliveryStatus: DeliveryStatus.Pending,
            farmerOtpHash: keccak256(abi.encodePacked(_farmerOtp)),
            contractorOtpHash: keccak256(abi.encodePacked(_contractorOtp))
        });

        emit ContractCreated(
            contractId,
            _farmer,
            msg.sender,
            _cropName,
            _price,
            _expectedDeliveryDate
        );

        return contractId;
    }

    function updateStatus(uint256 _contractId, DeliveryStatus _status)
        external
    {
        require(
            msg.sender == contracts[_contractId].farmer ||
            msg.sender == contracts[_contractId].contractor,
            "Only contract participants can update the status"
        );

        contracts[_contractId].deliveryStatus = _status;

        emit StatusUpdated(_contractId, _status);
    }

    function verifyOtp(uint256 _contractId, string memory _otp)
        external
        view
        returns (bool)
    {
        Contract storage farmContract = contracts[_contractId];
        bytes32 otpHash = keccak256(abi.encodePacked(_otp));

        if (msg.sender == farmContract.farmer) {
            return otpHash == farmContract.farmerOtpHash;
        } else if (msg.sender == farmContract.contractor) {
            return otpHash == farmContract.contractorOtpHash;
        }

        return false;
    }

    function getContract(uint256 _contractId)
        external
        view
        returns (Contract memory)
    {
        return contracts[_contractId];
    }
}