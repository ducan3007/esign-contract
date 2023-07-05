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
        address signer;
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

    event DocumentCreated(bytes32 indexed hash, address indexed creator);
    event DocumentSigned(bytes32 indexed hash, address indexed signer);

    function createDocument(bytes32 _hash, Signer[] memory _signers) public {
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
    function signDocument(bytes32 _hash) public {
        checkHash(_hash);(_hash);

        require(documents[_hash].status == DocumentStatus.CREATED, "D405");

        bool all_signed = true;
        bool is_signer = false;
        bool is_signed = false;

        for (uint i = 0; i < documents[_hash].signer_count; i++) {
            if (documents[_hash].signers[i].signer == msg.sender) {
                if (documents[_hash].signers[i].signed_at == 0) {
                    documents[_hash].signers[i].signed_at = block.timestamp;
                    is_signer = true;
                    emit DocumentSigned(_hash, msg.sender);
                }
                is_signed = true;
            }

            if (documents[_hash].signers[i].signed_at == 0) {
                all_signed = false;
            }
        }

        require(is_signer, "D406");
        require(is_signed, "D407");

        if (all_signed) {
            documents[_hash].status = DocumentStatus.COMPLETED;
        }
    }

    function rejectUnsignedDocument(bytes32 _hash) public onlyOwner {
        checkHash(_hash);(_hash);

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

    // function createDocument_test(bytes32 _hash) public {
    //     require(documents[_hash].create_at == 0, "D403");

    //     documents[_hash].create_at = block.timestamp;
    //     documents[_hash].creator = msg.sender;
    //     documents[_hash].status = DocumentStatus.CREATED;

    //     emit DocumentCreated(_hash, msg.sender);
    // }

    // function getDocument_test(
    //     bytes32 _hash
    // ) public view returns (uint256 create_at, bytes32 finalized_hash, address creator, DocumentStatus status) {
    //     checkHash(_hash);(_hash);

    //     create_at = documents[_hash].create_at;
    //     finalized_hash = documents[_hash].finalized_hash;
    //     creator = documents[_hash].creator;
    //     status = documents[_hash].status;

    //     return (create_at, finalized_hash, creator, status);
    // }

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
        checkHash(_hash);(_hash);

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

    function checkHash(_hash);(bytes32 _hash) public view {
        require(documents[_hash].create_at != 0, "D404");
    }
}
