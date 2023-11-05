// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Ownable.sol";

contract CertificateFactory is Ownable {
    constructor() Ownable(msg.sender) {}

    struct Candidate {
        uint256 issued_at;
        bytes32 cert_hash;
        address issuer;
        string name;
        string email;
        string status;
        uint256 expired_at;
    }

    struct Cert {
        bytes32 hash;
        uint256 created_at;
        Candidate[] candidates;
    }

    mapping(address => Cert[]) public certs;
    mapping(bytes32 => Candidate) public certificant_to_certhash;

    event CertificateCreated(bytes32 indexed hash, address indexed creator);
    event CertificateIssued(bytes32 indexed hash, string email, bytes32 indexed cert_hash);
    event CertificateRevoked(bytes32 indexed hash, string email);
    event CertificateExtended(bytes32 indexed hash, string email);

    function createCert(bytes32 _hash) public {
        for (uint i = 0; i < certs[msg.sender].length; i++) {
            if (certs[msg.sender][i].hash == _hash) {
                revert("CERT_ALREADY_CREATED");
            }
        }

        Cert storage newCert = certs[msg.sender].push();
        Candidate memory newCandidate = Candidate({
            issued_at: 0,
            name: "",
            email: "",
            cert_hash: 0x0,
            issuer: 0x0000000000000000000000000000000000000000,
            status: "CREATED",
            expired_at: 0
        });
        newCert.hash = _hash;
        newCert.created_at = block.timestamp;
        newCert.candidates.push(newCandidate);
        emit CertificateCreated(_hash, msg.sender);
    }

    function issueCert(bytes32 _hash, Candidate memory _candidate) public {
        checkCandidate(_candidate);
        bool isIssued = false;
        bool found = false;
        uint index = 0;
        _candidate.issuer = msg.sender;
        for (uint i = 0; i < certs[msg.sender].length; i++) {
            if (certs[msg.sender][i].hash == _hash) {
                index = i;
                found = true;
                for (uint j = 0; j < certs[msg.sender][i].candidates.length; j++) {
                    if (
                        keccak256(bytes(certs[msg.sender][i].candidates[j].email)) == keccak256(bytes(_candidate.email))
                    ) {
                        isIssued = true;
                        certs[msg.sender][i].candidates[j] = _candidate;
                        certificant_to_certhash[_candidate.cert_hash] = _candidate;
                        break;
                    }
                }
            }
        }
        if (!found) {
            revert("CERT_NOT_FOUND");
        }

        if (!isIssued) {
            certs[msg.sender][index].candidates.push(_candidate);
            certificant_to_certhash[_candidate.cert_hash] = _candidate;
        }
        emit CertificateIssued(_hash, _candidate.email, _candidate.cert_hash);
    }

    function revokeCert(bytes32 _hash, string memory _email) public {
        bool found = false;
        bool isIssued = false;
        for (uint i = 0; i < certs[msg.sender].length; i++) {
            if (certs[msg.sender][i].hash == _hash) {
                found = true;
                for (uint j = 0; j < certs[msg.sender][i].candidates.length; j++) {
                    if (keccak256(bytes(certs[msg.sender][i].candidates[j].email)) == keccak256(bytes(_email))) {
                        isIssued = true;
                        require(
                            keccak256(bytes(certs[msg.sender][i].candidates[j].status)) == keccak256(bytes("ISSUED")),
                            "STATUS_MUST_BE_ISSUED"
                        );
                        certs[msg.sender][i].candidates[j].status = "REVOKED";
                        certificant_to_certhash[certs[msg.sender][i].candidates[j].cert_hash].status = "REVOKED";
                        emit CertificateRevoked(_hash, _email);
                    }
                }
            }
        }
        if (!found) {
            revert("CERT_NOT_FOUND");
        }
        if (!isIssued) {
            revert("CERT_NOT_ISSUED");
        }
    }

    function getCertHashes() public view returns (bytes32[] memory) {
        bytes32[] memory hashes = new bytes32[](certs[msg.sender].length);
        for (uint i = 0; i < certs[msg.sender].length; i++) {
            hashes[i] = certs[msg.sender][i].hash;
        }
        return hashes;
    }

    function getCertDetails(bytes32 _hash) public view returns (Cert memory) {
        for (uint i = 0; i < certs[msg.sender].length; i++) {
            if (certs[msg.sender][i].hash == _hash) {
                return certs[msg.sender][i];
            }
        }
        revert("CERT_NOT_FOUND");
    }

    function verifyCert(bytes32 _hash) public view returns (Candidate memory) {
        return certificant_to_certhash[_hash];
    }

    function checkCandidate(Candidate memory _candidate) public pure {
        require(bytes(_candidate.name).length > 0, "CertificateFactory: Name must not be empty");
        require(bytes(_candidate.email).length > 0, "CertificateFactory: Email must not be empty");
        require(_candidate.expired_at > 0, "CertificateFactory: Expired_at must not be empty");
        require(_candidate.issued_at > 0, "CertificateFactory: Issued_at must not be empty");
        require(keccak256(bytes(_candidate.status)) == keccak256(bytes("ISSUED")), "STATUS_MUST_BE_ISSUED");
        require(_candidate.cert_hash != 0x0, "CertificateFactory: Cert_hash must not be empty");
        require(
            _candidate.expired_at > _candidate.issued_at,
            "CertificateFactory: Expired_at must be greater than Issued_at"
        );
    }
}
