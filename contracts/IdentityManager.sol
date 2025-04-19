// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract IdentityManager {
    address public admin;
    mapping(address => bool) public approvers;
    uint private _nonce = block.timestamp; 

    struct Identity {
        string name;
        string dob;
        string documentURI;
        bool verified;
    }
    

    mapping(address => Identity) public identities;

    event IdentityCreated(address indexed user, string name);
    event IdentityVerified(address indexed user);
    event ApproverAdded(address indexed approver);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyApprover() {
        require(msg.sender == admin || approvers[msg.sender], "Not an admin or approver");
        _;
    }

    constructor() {
        admin = msg.sender; // Deployer is admin
    }

    function createIdentity(string memory _name, string memory _dob,string memory _documentURI) external {
        require(bytes(identities[msg.sender].name).length == 0, "Identity already exists!");
        identities[msg.sender] = Identity(_name, _dob, _documentURI, false);
        emit IdentityCreated(msg.sender, _name);
    }

    function verifyIdentity(address _user) external onlyApprover {
        require(bytes(identities[_user].name).length > 0, "Identity does not exist!");
        identities[_user].verified = true;
        emit IdentityVerified(_user);
    }

    function addApprover(address _approver) external onlyAdmin {
        require(!approvers[_approver], "Already an approver!");
        approvers[_approver] = true;
        emit ApproverAdded(_approver);
    }

    function getIdentity(address _user) external view returns (string memory, string memory, string memory, bool) {
        require(
        msg.sender == _user || msg.sender == admin || approvers[msg.sender],
        "Not authorized to view this identity"
        );
        require(bytes(identities[_user].name).length > 0, "Identity does not exist!");
        Identity memory id = identities[_user];
        return (id.name, id.dob, id.documentURI, id.verified);
    }

    function isIdentityVerified(address _user) external view returns (bool) {
        return identities[_user].verified;
    }
}
