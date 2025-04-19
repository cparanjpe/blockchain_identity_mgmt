"use client";
import lighthouse from "@lighthouse-web3/sdk";
import { useState } from "react";
import { ethers } from "ethers";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Your deployed contract address
const contractABI =  [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "approver",
        "type": "address"
      }
    ],
    "name": "ApproverAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      }
    ],
    "name": "IdentityCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "IdentityVerified",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_approver",
        "type": "address"
      }
    ],
    "name": "addApprover",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "admin",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "approvers",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_dob",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_documentURI",
        "type": "string"
      }
    ],
    "name": "createIdentity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "getIdentity",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "identities",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "dob",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "documentURI",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "verified",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "isIdentityVerified",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "verifyIdentity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const LIGHTHOUSE_API_KEY = "837e5b84.eef749b067ef4c25b43a2a6601d542a4"

export default function Home() {
  const [account, setAccount] = useState(null);
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [identity, setIdentity] = useState(null);
  const [verifyAddress, setVerifyAddress] = useState("");
  const [thirdPartyVerifyAddress, setThirdPartyVerifyAddress] = useState("");
  const [approverAddress, setApproverAddress] = useState("");
  const [file, setFile] = useState(null);
  const [userToVerifyData, setUserToVerifyData] = useState(null);

  const fetchUserIdentity = async (address) => {
    if (!account) {
      alert("Connect wallet first!");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner(account);
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
  
      const data = await contract.getIdentity(address);
      setUserToVerifyData({
        name: data[0],
        dob: data[1],
        documentURI: data[2],
        isVerified: data[3],
      });
    } catch (err) {
      console.error("Error fetching user identity:", err);
      alert("User identity not found!");
      setUserToVerifyData(null);
    }
  };
  

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };


  const uploadToLighthouse = async (file) => {
    try {
      const response = await lighthouse.upload([file], LIGHTHOUSE_API_KEY);
      const cid = response.data.Hash;
      return `https://gateway.lighthouse.storage/ipfs/${cid}`;
    } catch (err) {
      console.error("Lighthouse upload error:", err);
      return null;
    }
  };

  // Connect to MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Wallet connection error:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  // Create identity on blockchain
  const createIdentity = async () => {
    if (!account) {
      alert("Connect wallet first!");
      return;
    }

    try {

      const documentURI = await uploadToLighthouse(file);
      if (!documentURI) {
        alert("File upload failed");
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner(account);
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Passing both name and dob
      const tx = await contract.createIdentity(name, dob,documentURI);
      await tx.wait();

      alert("Identity created successfully!");
    } catch (error) {
      console.error("Error creating identity:", error);
    }
  };

  // Fetch identity from blockchain
  const getIdentity = async () => {
    if (!account) {
      alert("Connect wallet first!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);

      const data = await contract.getIdentity(account);
      setIdentity({ name: data[0], dob: data[1],documentURI: data[2], isVerified: data[3] });
    } catch (error) {
      console.error("Error fetching identity:", error);
      alert("Identity not found!");
    }
  };

  // Admin verifies identity
  const verifyIdentity = async () => {
    if (!account) {
      alert("Connect wallet first!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner(account);
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.verifyIdentity(verifyAddress);
      await tx.wait();

      alert("Identity verified successfully!");
    } catch (error) {
      console.error("Error verifying identity:", error);
      alert("Verification failed!");
    }
  };

  const thirdPartyVerifyIdentity = async () => {
    if (!account) {
      alert("Connect wallet first!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner(account);
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Call the smart contract function to allow third-party verification
      const isVerified = await contract.isIdentityVerified(thirdPartyVerifyAddress);
      console.log(isVerified)

      alert("Third-party verification successful! Verification status : " + isVerified);
    } catch (error) {
      console.error("Error in third-party verification:", error);
      alert("Verification failed!");
    }
  };

  const addApprover = async () => {
    if (!account) {
      alert("Connect wallet first!");
      return;
    }
  
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner(account);
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
  
      const tx = await contract.addApprover(approverAddress);
      await tx.wait();
  
      alert("Approver added successfully!");
    } catch (error) {
      console.error("Error adding approver:", error);
      alert("Failed to add approver!");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Blockchain Identity Manager</h1>

      {!account ? (
        <button onClick={connectWallet} className="bg-blue-500 text-white px-4 py-2 rounded">
          Connect Wallet
        </button>
      ) : (
        <p>Connected: {account}</p>
      )}

      {/* Create Identity Section */}
      <div className="mt-6">
        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border px-4 py-2 rounded mr-2"
        />
        <input
          type="text"
          placeholder="Enter DOB (DD-MM-YYYY)"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className="border px-4 py-2 rounded mr-2"
        />
        <input type="file" onChange={handleFileUpload} className="border px-4 py-2 rounded mr-2" />

        <button onClick={createIdentity} className="bg-green-500 text-white px-4 py-2 rounded">
          Create Identity
        </button>
      </div>

      {/* Get Identity Section */}
      <div className="mt-6">
        <button onClick={getIdentity} className="bg-yellow-500 text-white px-4 py-2 rounded">
          Get My Identity
        </button>

        {identity && (
          <div className="mt-4 p-4 border rounded">
            <p><strong>Name:</strong> {identity.name}</p>
            <p><strong>DOB:</strong> {identity.dob}</p>
            <p><strong>Verification Status:</strong> {identity.isVerified ? "✅ Verified" : "❌ Not Verified"}</p>
            <p><strong>Document:</strong> <a href={identity.documentURI} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View Document</a></p>
          </div>
        )}
      </div>

      {/* Admin Verification Section */}
      <div className="mt-6">
        <h2 className="text-xl font-bold">Admin Verification</h2>
        <input
          type="text"
          placeholder="User Address to Verify"
          value={verifyAddress}
          onChange={(e) => setVerifyAddress(e.target.value)}
          className="border px-4 py-2 rounded mr-2"
        />
        <button onClick={() => fetchUserIdentity(verifyAddress)} className="bg-gray-500 text-white px-4 py-2 rounded">
  Fetch Identity
</button>

{userToVerifyData && (
  <div className="mt-4 w-full max-w-md bg-white shadow-lg rounded-lg p-6 border border-gray-200">
    <h3 className="text-lg font-semibold mb-4 text-gray-800">User Identity Details</h3>
    <div className="space-y-2 text-sm text-gray-700">
      <p>
        <span className="font-medium">Name:</span> {userToVerifyData.name}
      </p>
      <p>
        <span className="font-medium">DOB:</span> {userToVerifyData.dob}
      </p>
      <p>
        <span className="font-medium">Verification Status:</span>{" "}
        {userToVerifyData.isVerified ? (
          <span className="text-green-600 font-semibold">✅ Verified</span>
        ) : (
          <span className="text-red-600 font-semibold">❌ Not Verified</span>
        )}
      </p>
      <p>
        <span className="font-medium">Document:</span>{" "}
        <a
          href={userToVerifyData.documentURI}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline hover:text-blue-800"
        >
          View Document
        </a>
      </p>
    </div>
  </div>
)}


        <button onClick={verifyIdentity} className="bg-red-500 text-white px-4 py-2 rounded">
          Verify Identity
        </button>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-bold">Add Approver</h2>
        <input
          type="text"
          placeholder="Approver Address"
          value={approverAddress}
          onChange={(e) => setApproverAddress(e.target.value)}
          className="border px-4 py-2 rounded mr-2"
        />
        <button onClick={addApprover} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Approver
        </button>
      </div>


      <div className="mt-6">
        <h2 className="text-xl font-bold">Third-Party Verification</h2>
        <input
          type="text"
          placeholder="User Address to Verify"
          value={thirdPartyVerifyAddress}
          onChange={(e) => setThirdPartyVerifyAddress(e.target.value)}
          className="border px-4 py-2 rounded mr-2"
        />
        <button onClick={thirdPartyVerifyIdentity} className="bg-purple-500 text-white px-4 py-2 rounded">
          Third-Party Verify
        </button>
      </div>  
      
    </main>
  );
}
