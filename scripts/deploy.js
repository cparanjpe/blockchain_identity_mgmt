const hre = require("hardhat");

async function main() {
    const IdentityManager = await hre.ethers.getContractFactory("IdentityManager");
    const identityManager = await IdentityManager.deploy();

    await identityManager.waitForDeployment();
    console.log(`Contract deployed to: ${identityManager.target}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
