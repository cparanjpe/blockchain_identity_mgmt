const hre = require("hardhat");

async function main() {
    const [owner] = await hre.ethers.getSigners();
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";  // Replace with actual address

    const IdentityManager = await hre.ethers.getContractFactory("IdentityManager");
    const contract = await IdentityManager.attach(contractAddress);

    console.log(`Using account: ${owner.address}`);

    // Register an identity
    let tx = await contract.connect(owner).createIdentity("Alice", "01-01-2000");
    await tx.wait();
    console.log("Identity Created!");

    // Fetch the identity
    const [name, dob, exists] = await contract.getIdentity(owner.address);
    console.log(`Fetched Identity -> Name: ${name}, DOB: ${dob}, Exists: ${exists}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
