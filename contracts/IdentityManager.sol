// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract IdentityManager {
    address public admin;

    struct Identity {
        string name;
        string dob;
        bool verified;
    }

    mapping(address => Identity) public identities;

    event IdentityCreated(address indexed user, string name);
    event IdentityVerified(address indexed user);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can verify identities");
        _;
    }

    constructor() {
        admin = msg.sender; // Deployer's address is admin
    }

    function createIdentity(string memory _name, string memory _dob) external {
        require(bytes(identities[msg.sender].name).length == 0, "Identity already exists!");
        identities[msg.sender] = Identity(_name, _dob, false);
        emit IdentityCreated(msg.sender, _name);
    }

    function verifyIdentity(address _user) external onlyAdmin {
        require(bytes(identities[_user].name).length > 0, "Identity does not exist!");
        identities[_user].verified = true;
        emit IdentityVerified(_user);
    }

    function getIdentity(address _user) external view returns (string memory, string memory, bool) {
        require(bytes(identities[_user].name).length > 0, "Identity does not exist!");
        Identity memory id = identities[_user];
        return (id.name, id.dob, id.verified);
    }
}
