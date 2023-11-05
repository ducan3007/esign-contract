// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Ownable.sol";

contract DocumentFactory is Ownable {
    constructor() Ownable(msg.sender) {}

    enum DocumentStatus {
        CREATED,
        COMPLETED,
        REJECTED
    }

    struct Signer {
        uint256 signed_at;
        string email;
        address signing_address;
    }

    struct Document {
        uint256 create_at;
        bytes32 finalized_hash;
        address creator;
        DocumentStatus status;
        mapping(uint => Signer) signers;
        uint signer_count;
    }

    mapping(bytes32 => Document) public documents;
    mapping(bytes32 => bytes32) public finalized_documents;
    mapping(string => address[]) public signer_addresses;

    event DocumentCreated(bytes32 indexed hash, address indexed creator);
    event DocumentSigned(bytes32 indexed hash, address indexed signer, string email);
    event DocumentCompleted(bytes32 indexed hash);

    function updateSignerAddresses(string memory _email, address[] memory _addresses) public onlyOwner {
        signer_addresses[_email] = _addresses;
    }

    function getSignerAddresses(string memory _email) public view returns (address[] memory) {
        return signer_addresses[_email];
    }

    function createDocument(bytes32 _hash, Signer[] memory _signers) public onlyOwner {
        require(documents[_hash].create_at == 0, "D403");
        require(_signers.length > 0, "DocumentFactory: Signers must be greater than 0");

        documents[_hash].create_at = block.timestamp;
        documents[_hash].creator = msg.sender;
        documents[_hash].status = DocumentStatus.CREATED;
        documents[_hash].signer_count = _signers.length;

        for (uint i = 0; i < _signers.length; i++) {
            documents[_hash].signers[i] = _signers[i];
        }

        emit DocumentCreated(_hash, msg.sender);
    }

    // multiple signers
    function signDocument(bytes32 _hash, string memory _email) public {
        checkHash(_hash);

        require(documents[_hash].status == DocumentStatus.CREATED, "D405");

        bool all_signed = true;
        bool is_signer = false;
        bool is_signed = false;
        bool is_address_found = false;

        for (uint i = 0; i < documents[_hash].signer_count; i++) {
            if (documents[_hash].signers[i].signed_at != 0) {
                continue;
            }

            if (keccak256(abi.encodePacked(documents[_hash].signers[i].email)) == keccak256(abi.encodePacked(_email))) {
                if (signer_addresses[_email].length > 0) {
                    is_address_found = true;
                    for (uint j = 0; j < signer_addresses[_email].length; j++) {
                        if (msg.sender == signer_addresses[_email][j]) {
                            is_signer = true;
                            documents[_hash].signers[i].signed_at = block.timestamp;
                            documents[_hash].signers[i].signing_address = msg.sender;
                            emit DocumentSigned(_hash, msg.sender, _email);
                            is_signed = true;
                        }
                    }
                }
            }
        }

        require(is_address_found, "D409");
        require(is_signer, "D406");
        require(is_signed, "D407");

        for (uint i = 0; i < documents[_hash].signer_count; i++) {
            if (documents[_hash].signers[i].signed_at == 0) {
                all_signed = false;
            }
        }

        if (all_signed) {
            documents[_hash].status = DocumentStatus.COMPLETED;
            emit DocumentCompleted(_hash);
        }
    }

    // Owner Reject Document
    function rejectUnsignedDocument(bytes32 _hash) public onlyOwner {
        checkHash(_hash);

        require(documents[_hash].status == DocumentStatus.CREATED, "D405");

        bool all_signed = true;

        for (uint i = 0; i < documents[_hash].signer_count; i++) {
            if (documents[_hash].signers[i].signed_at == 0) {
                all_signed = false;
            }
        }

        require(!all_signed, "D408");

        documents[_hash].status = DocumentStatus.REJECTED;
    }

    function finalizeDocument(bytes32 _hash, bytes32 _finalized_hash) public onlyOwner {
        checkHash(_hash);
        documents[_hash].finalized_hash = _finalized_hash;
        finalized_documents[_finalized_hash] = _hash;
    }

    function getDocument(
        bytes32 _hash
    )
        public
        view
        returns (
            uint256 create_at,
            bytes32 finalized_hash,
            address creator,
            DocumentStatus status,
            uint signer_count,
            Signer[] memory signers
        )
    {
        checkHash(_hash);

        create_at = documents[_hash].create_at;
        finalized_hash = documents[_hash].finalized_hash;
        creator = documents[_hash].creator;
        status = documents[_hash].status;
        signer_count = documents[_hash].signer_count;
        signers = new Signer[](signer_count);

        for (uint i = 0; i < signer_count; i++) {
            signers[i] = documents[_hash].signers[i];
        }

        return (create_at, finalized_hash, creator, status, signer_count, signers);
    }

    function checkHash(bytes32 _hash) public view {
        require(documents[_hash].create_at != 0, "D404");
    }
}

