// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Ownable.sol";

contract DocumentFactory is Ownable {
    uint public documentCount = 0;

    struct Document {
        string ipfs_hash;
        string sha256_hash;
        string creator;
    }

    constructor() Ownable(msg.sender) {}

    mapping(bytes32 => Document) public documents;

    event DocumentCreated(string ipfs_hash, string sha256_hash, string creator);


    function createDocument(string memory _ipfs_hash, string memory _sha256_hash, string memory _creator) public onlyOwner {
        bytes32 hash = keccak256(abi.encodePacked(_ipfs_hash, _sha256_hash, _creator));
        documents[hash] = Document(_ipfs_hash, _sha256_hash, _creator);
        documentCount++;
        emit DocumentCreated(_ipfs_hash, _sha256_hash, _creator);
    }

}
