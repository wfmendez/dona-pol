import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css'; 

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// --- ¡ACCIÓN IMPORTANTE #2! ---
// Pega aquí el ABI de tu contrato. Lo encontrarás en:
// dona-pol/backend/artifacts/contracts/DonationApp.sol/DonationApp.json
// Busca la clave "abi" y copia TODO el array que contiene.
const contractABI = [
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
        "name": "donor",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "totalDonated",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "DonationReceived",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "getContractBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
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
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
];


function App() {
  // Estados para manejar la información de la DApp
  const [walletAddress, setWalletAddress] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [message, setMessage] = useState('¡Bienvenido! Conecta tu billetera para empezar.');
  const [contractBalance, setContractBalance] = useState('0');
  const [isOwner, setIsOwner] = useState(false);

  // Función para actualizar el balance mostrado en la UI
  const updateBalance = async (currentContract) => {
    if (!currentContract) return;
    try {
      const balance = await currentContract.getContractBalance();
      setContractBalance(ethers.formatEther(balance)); // Convierte Wei a Ether para mostrarlo
    } catch (error) {
      console.error("Error al obtener el balance:", error);
    }
  };

  // Este 'hook' se ejecuta una sola vez cuando el componente se carga
  useEffect(() => {
    const connectWallet = async () => {
      // Comprueba si MetaMask está instalado
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          
          // Pide al usuario conectar su cuenta de MetaMask
          const accounts = await provider.send("eth_requestAccounts", []);
          setWalletAddress(accounts[0]);
          
          // Obtiene el 'signer', necesario para enviar transacciones
          const web3Signer = await provider.getSigner();
          setSigner(web3Signer);
          
          // Crea una instancia del contrato con la que podemos interactuar
          const donationContract = new ethers.Contract(contractAddress, contractABI, web3Signer);
          setContract(donationContract);

          // Comprueba si la dirección conectada es la del dueño del contrato
          const ownerAddress = await donationContract.owner();
          setIsOwner(accounts[0].toLowerCase() === ownerAddress.toLowerCase());

          setMessage('Billetera conectada correctamente.');
          updateBalance(donationContract);

        } catch (error) {
          console.error("Error conectando la billetera:", error);
          setMessage('Error al conectar. Revisa la consola para más detalles.');
        }
      } else {
        setMessage('MetaMask no está instalado. Por favor, instálalo.');
      }
    };

    connectWallet();

    // Configura listeners para recargar la página si el usuario cambia de cuenta o de red
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => window.location.reload());
      window.ethereum.on('chainChanged', () => window.location.reload());
    }
  }, []); // El array vacío asegura que este efecto se ejecute solo una vez

  // Función para manejar el envío de donaciones
  const handleDonate = async () => {
    if (!contract || !donationAmount || parseFloat(donationAmount) <= 0) {
      setMessage('Por favor, ingresa un monto válido para donar.');
      return;
    }

    try {
      setMessage(`Procesando donación de ${donationAmount} POL...`);
      // Convierte el monto a Wei, la unidad más pequeña de Ether/POL
      const amountInWei = ethers.parseEther(donationAmount);
      
      // Envía la transacción. Como no llamamos a una función específica,
      // se activa la función `receive()` de nuestro contrato.
      const tx = await signer.sendTransaction({
        to: contractAddress,
        value: amountInWei
      });

      await tx.wait(); // Espera a que la transacción se confirme

      setMessage(`¡Gracias por tu donación de ${donationAmount} POL!`);
      setDonationAmount('');
      updateBalance(contract); // Actualiza el balance en la UI
    } catch (error) {
      console.error("Error al donar:", error);
      setMessage(`Error en la donación: ${error.reason || 'Transacción rechazada.'}`);
    }
  };

  // Función para que el dueño retire los fondos
  const handleWithdraw = async () => {
    if (!contract || !isOwner) {
      setMessage("Acción no permitida. Solo el propietario puede retirar fondos.");
      return;
    }

    try {
      setMessage("Retirando fondos...");
      const tx = await contract.withdraw(); // Llama a la función 'withdraw' del contrato
      await tx.wait();

      setMessage("¡Fondos retirados exitosamente!");
      updateBalance(contract); // Actualiza el balance
    } catch (error) {
      console.error("Error al retirar:", error);
      setMessage(`Error al retirar: ${error.reason || 'Transacción rechazada.'}`);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Dona-Pol</h1>
        <p>{message}</p>
        
        {walletAddress && <p className="address"><strong>Tu Dirección:</strong> {walletAddress}</p>}
        
        <div className="card">
          <h2>Balance del Contrato</h2>
          <p className="balance">{contractBalance} POL (local)</p>
        </div>

        <div className="card">
          <h3>Realizar Donación</h3>
          <input
            type="number"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
            placeholder="Ej: 0.01"
          />
          <button onClick={handleDonate} disabled={!signer}>
            Donar
          </button>
        </div>

        {isOwner && (
          <div className="card owner-card">
            <h3>Panel de Administrador</h3>
            <button onClick={handleWithdraw} disabled={!signer}>
              Retirar Fondos
            </button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
