// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Ownable.sol";

contract CertificateFactory is Ownable {
    constructor() Ownable(msg.sender) {}

    struct certificate {
        uint256 create_at;
        string name;
        string email;
        string description;
        address creator;
    }

    mapping(bytes32 => certificate) public certificants;
}
