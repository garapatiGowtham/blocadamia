# Blocadamia

### Team: Satoshi's Disciples

**Team Members:**
- **G. Gowtham Chowdary** – [garapatigowtham6@gmail.com](mailto:garapatigowtham6@gmail.com) – [LinkedIn](https://www.linkedin.com/in/gowtham-garapati/)  
- **P. Sreekar** – [anandasreekar@gmail.com](mailto:anandasreekar@gmail.com) – [LinkedIn](https://www.linkedin.com/in/sreekar-p-6b7b38270)  
- **A. Sai Anil Kumar** – [saianil416@gmail.com](mailto:saianil416@gmail.com) – [LinkedIn](https://in.linkedin.com/in/sai-anil-kumar-7a9297289)  

---

## 📜 Problem Statement

Across campuses, students face multiple financial challenges — managing daily expenses, securely making peer-to-peer payments, tracking budgets, borrowing/lending small amounts, and building trust in community transactions.  
Traditional solutions (cash, centralized payment apps) often lack transparency, accountability, or direct integration with reputation systems.  
We identified the need for a **secure, transparent, and decentralized financial ecosystem** tailored specifically for campus communities.

---

## 💡 Our Approach

We built **Blocadamia**, a **fully decentralized finance platform** for campus communities, powered by the **Aptos Blockchain**.  
Our approach was:

1. **Blockchain-First Architecture**  
   - All core financial logic (payments, budgeting, loans, reputation) is implemented on-chain as **Move smart contracts** for security and transparency.  
2. **Seamless Wallet Experience**  
   - Integrated Aptos Wallet Adapter to support wallets like Petra, Martian, Fewcha.  
   - Automatic faucet funding for onboarding in testnet environments.  
3. **Modular Frontend**  
   - Built with **Vite + React 18 + TypeScript** for speed and maintainability.  
   - Tailwind CSS for a **futuristic, minimalist UI**.  
4. **Feature Completeness**  
   - Included all planned blockchain features (Payments, Budgeting, Loans, Reputation) upfront, rather than incrementally.  
   - Designed for scalability so new features/modules can be added easily.

---

## 🌍 Expected Impact

We believe **Blocadamia** can:

- **Empower Students:** Give them direct control over finances without intermediaries.
- **Promote Financial Responsibility:** Budgeting + on-chain reputation encourages better money habits.
- **Strengthen Community Trust:** Transparent loan history and repayment rates.
- **Provide a Real Blockchain Experience:** Introduce a tech-forward solution that’s more secure than centralized options.

In a campus ecosystem, this can evolve into a **self-sustaining financial and trust system** that survives beyond the academic term and can scale to similar community environments.

---

## ⚙️ Features

- **Onboarding & Wallet Setup**: Connect wallet, auto-fund testnet account, store session locally.
- **Dashboard**: Real-time balance, active budgets, loan statuses, and reputation score.
- **Payments**: QR code scan or manual address entry, blockchain-signed transfers.
- **Budget Management**: Allocate percentages to different categories and store them on-chain.
- **Loans**: Request, approve, and repay campus loans with full on-chain history.
- **Reputation**: Track financial reliability with a scoring and badge system.
- **Notifications**: Real-time toast updates for all actions.
- **Responsive UI**: Mobile-first design with glassmorphism aesthetics.

---

## 🛠️ Technology Stack

**Frontend:**  
- [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/)  
- TypeScript  
- [Tailwind CSS](https://tailwindcss.com/)  
- [React Router v6](https://reactrouter.com/)

**Blockchain Integration:**  
- [Aptos TypeScript SDK (`@aptos-labs/ts-sdk`)](https://www.npmjs.com/package/@aptos-labs/ts-sdk)  
- Aptos Wallet Adapter (Petra, Martian, Fewcha)  
- Aptos Faucet API (Testnet)

**Other:**  
- `react-hot-toast` for notifications  
- Chart.js / Recharts for visualizations  
- QR scanner (`@blackbox-vision/react-qr-reader` or alternative)

---

## 📄 Smart Contracts (Move Modules)

We implemented the following **Move modules** and deployed them to **Aptos Testnet**. Each module address is stored in `.env.local`.

1. **Payments Module**
   - Function: `send_payment(recipient: address, amount: u64)`
   - Allows direct APT transfers between accounts.

2. **Budget Module**
   - Functions:  
     - `set_budget(user: address, categories: vector<u8>, allocations: vector<u64>)`  
     - `get_budget(user: address)`  
   - Record and retrieve budget allocations.

3. **Loans Module**
   - Functions:  
     - `request_loan(amount: u64, terms: vector<u8>)`  
     - `approve_loan(loan_id: u64)`  
     - `repay_loan(loan_id: u64, amount: u64)`  
   - Full on-chain loan lifecycle tracking.

4. **Reputation Module**
   - Functions:  
     - `update_reputation(user: address, delta: i64)`  
     - `get_reputation(user: address)`  
   - Transparent reputation scoring, affected by loan repayments and other actions.

---

## 🚀 Getting Started (Local Development)




PS:- The project has additional env files which were NOT uploaded, as the private keys enclosed within them are too sensitive to be shared. env may simply be created through an agent prompt upon complete page comprehension.
