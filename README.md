# **Decentralized Identity Verification System**  

This project is a **blockchain-based identity verification system** using **Solidity, Hardhat, and MetaMask**. The system allows users to register their identity and an **admin** to verify them.

---
THIS DETAILS HOW TO INIT A BASIC PROJ. IF YOU WANT TO CLONE AND RUN PLEASE START FROM STEP-2

## **1️⃣ Prerequisites**  
Ensure the following are installed:  
- **Node.js v18+**  
- **MetaMask (Browser Extension)**  

Install Hardhat globally:  
```bash
npm install -g hardhat
```

---

## **2️⃣ Backend (Hardhat + Solidity) Setup**  
### **Step 1: Initialize Hardhat**  
Create a new Hardhat project:  
```bash
mkdir blockchain-identity
cd blockchain-identity
npx hardhat
```
Select **"Create a basic sample project"**, then install dependencies:  
```bash
npm install
```

---

### **Step 2: Install Dependencies**  
```bash
npm install --save-dev @nomicfoundation/hardhat-toolbox ethers dotenv
```

---

### **Step 3: Create Smart Contract**  
Inside `contracts/`, create a Solidity file (e.g., `IdentityManager.sol`).  
This contract will handle user identity creation and admin verification.  

---

### **Step 4: Compile the Smart Contract**  
Run the following command to check for errors and compile:  
```bash
npx hardhat compile
```

---

### **Step 5: Deploy the Contract**  
Create a deployment script inside `scripts/` (e.g., `deploy.js`).  

Start the local Hardhat blockchain:  
```bash
npx hardhat node
```

Deploy the contract to the local network:  
```bash
npx hardhat run scripts/deploy.js --network localhost
```
This command will return a **contract address**—copy it for later use.  

---

## **3️⃣ Connecting MetaMask to Hardhat Accounts**  
1. Open **MetaMask** → Click on **Profile Icon** → Select **"Import Account"**.  
2. Copy any private key from the Hardhat terminal (`npx hardhat node`).  
3. Paste the key into **MetaMask** to use Hardhat test accounts.  

To see available accounts:  
```bash
npx hardhat accounts
```

---

## **4️⃣ Frontend (Next.js + MetaMask) Setup**  
### **Step 1: Initialize Next.js**  
Create a new Next.js project:  
```bash
cd frontend
npm install ethers
```

---

### **Step 2: Connect MetaMask in Frontend**  
- **Users** will sign transactions using MetaMask.  
- **Admin** (deployer) has the ability to verify identities.  

Modify `pages/index.js` to interact with the contract using **Ethers.js**.  

---

## **5️⃣ Running the Full Project**  
### **Step 1: Start Hardhat Local Blockchain**  
```bash
npx hardhat node
```

### **Step 2: Deploy Contract**  
```bash
npx hardhat run scripts/deploy.js --network localhost
```

### **Step 3: Start Next.js Frontend**  
```bash
cd frontend
npm run dev
```

The project should now be running at **http://localhost:3000** 🎉.  

---

## **6️⃣ Interacting with the System**  
### **User Actions**
- **Connect MetaMask**  
- **Create Identity** (Registers name & DOB)  

### **Admin Actions**
- **Verify User Identity**  

To verify an identity, **MetaMask must be connected as the admin account** (deployer).  

---

## **7️⃣ Notes on MetaMask & Admin Privileges**  
- The **first Hardhat account** (deployer) is the **admin**.  
- If using a different wallet, import the private key into **MetaMask**.  
- To test admin actions, switch MetaMask to the **admin account**.  

---

## **8️⃣ Next Steps**
- **Enhance the UI** to display verification status.  
- **Add Gasless Transactions** using meta-transactions.  
- **Deploy on a Testnet** (Goerli, Sepolia).  

---

Now your buddy can easily set up and run the project! 🚀
