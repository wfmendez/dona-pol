# 💜 Dona-Pol

**Dona-Pol** is an innovative and secure decentralized application (dApp) designed to transform the charitable donation process using blockchain technology on the **Polygon network**. This project aims to enhance **transparency** and **efficiency** in charitable giving, ensuring that funds reach their causes with full traceability.

---

## ✨ Key Features

* **Transparent Donations:** All donation transactions are recorded on the Polygon blockchain, guaranteeing complete traceability and immutable transparency.
* **Efficiency with Polygon:** Leverages Polygon network's low fees and high speed to facilitate fast and cost-effective transactions.
* **Secure Smart Contracts:** Funds are managed by auditable smart contracts, eliminating the need for intermediaries and ensuring correct distribution to causes.
* **Intuitive User Interface:** Developed to be user-friendly, allowing donors to connect their wallet and make contributions easily.

---

## 🚀 Technologies Used

This project served as a key opportunity to apply and consolidate my knowledge within the Web3 ecosystem, utilizing the following technologies:

* **Solidity:** Programming language used for implementing robust and secure smart contracts on the blockchain.
* **Hardhat:** Development environment for compiling, deploying, testing, and debugging Ethereum/Polygon smart contracts.
* **React:** JavaScript library for building the interactive and dynamic frontend user interface.
* **Ethers.js / Web3.js (or similar):** (If you used one, you can mention it here, e.g., "JavaScript library for interacting with the Ethereum/Polygon blockchain from the frontend.")
* **HTML5 & CSS3:** For the structure and styling of the web application.
* **JavaScript (ES6+):** For frontend logic.
* **Polygon Network:** The target blockchain for transactions.
* **MetaMask:** (Or any other compatible wallet) Integration for user wallet connections.

---

## 🛠️ Local Installation and Usage

To set up and run Dona-Pol in your local development environment, follow these steps:

### Prerequisites

Make sure you have the following installed:

* [Node.js](https://nodejs.org/) (LTS version recommended)
* [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
* [MetaMask](https://metamask.io/) (or a compatible wallet) installed in your browser.

### Steps

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/wfmendez/dona-pol.git](https://github.com/wfmendez/dona-pol.git)
    cd dona-pol
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Hardhat and the Smart Contract:**
    * Navigate to your contract folder (e.g., `cd contracts`).
    * Compile the contracts:
        ```bash
        npx hardhat compile
        ```
    * Deploy the contracts to a local development network (Hardhat Network):
        ```bash
        npx hardhat node
        ```
        Keep this terminal open.

4.  **Deploy to a Testnet (Optional, but recommended):**
    * In a new terminal, deploy the contract to a testnet (e.g., Mumbai for Polygon):
        ```bash
        npx hardhat run scripts/deploy.js --network mumbai # or your chosen network
        ```
        *Ensure your environment variables for API keys and private keys are configured in a `.env` file.*

5.  **Start the Frontend Application:**
    * In a new terminal, navigate back to the root of your project (if you moved into the contracts folder).
    * Start the React development server:
        ```bash
        npm start
        # or
        yarn start
        ```
    * The application should open in your browser (usually at `http://localhost:3000`).

6.  **Connect Your Wallet:**
    * Ensure MetaMask (or your wallet) is configured for the network where you deployed your contracts (local Hardhat Network or a testnet like Mumbai).
    * Connect your wallet to the dApp via the connection button on the interface.

---

## 💡 Motivation and Learnings

Dona-Pol originated as a personal project with the aim of deepening and consolidating my knowledge in Web3 development. It allowed me to tackle practical challenges in:

* Designing and implementing on-chain logic with **Solidity**.
* Managing the smart contract lifecycle (deployment, testing) with **Hardhat**.
* Creating fluid user experiences for dApps with **React**.
* Securely and efficiently interacting with the **Polygon blockchain**.

This project serves as a practical demonstration of my capabilities as a Full-stack developer with a growing focus on the decentralized ecosystem.

---

## 🤝 Contributions

Contributions are welcome. If you have suggestions, ideas, or want to report a bug, feel free to open an *issue* or submit a *pull request*.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

## 📧 Contact

* **Your Name:** Wuillian Fernando Mendez Garcia
* **LinkedIn:** [https://www.linkedin.com/in/wf-mendez/](https://www.linkedin.com/in/wf-mendez/)
* **GitHub:** [https://github.com/wfmendez](https://github.com/wfmendez)
