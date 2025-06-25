// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title DonationApp
 * @dev Un contrato simple para recibir donaciones y permitir que solo el propietario las retire.
 */
contract DonationApp {
    // La dirección del propietario del contrato, establecida en el momento del despliegue.
    // Es 'immutable' porque no cambiará durante la vida del contrato.
    address public immutable owner;

    // Un evento que se emite cada vez que se recibe una nueva donación.
    // Esto permite que el frontend escuche las donaciones en tiempo real.
    event DonationReceived(address indexed donor, uint256 amount, uint256 totalDonated, uint256 timestamp);

    /**
     * @dev El constructor se ejecuta solo una vez, cuando se despliega el contrato.
     * Establece la dirección que despliega el contrato como el propietario.
     */
    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Una función 'receive' se ejecuta cuando el contrato recibe Ether (MATIC en Polygon)
     * sin que se especifique ninguna otra función. Es la forma principal de donar.
     * Debe ser 'payable'.
     */
    receive() external payable {
        // Asegurarse de que la donación no sea de cero.
        require(msg.value > 0, "La donacion debe ser mayor que cero.");

        // Obtener el balance total actual del contrato.
        uint256 totalBalance = address(this).balance;

        // Emitir el evento con los detalles de la donación.
        emit DonationReceived(msg.sender, msg.value, totalBalance, block.timestamp);
    }

    /**
     * @dev Permite al propietario del contrato retirar el balance completo.
     */
    function withdraw() external {
        // Solo el propietario puede llamar a esta función.
        require(msg.sender == owner, "Solo el propietario puede retirar fondos.");

        // Obtener el balance total del contrato.
        uint256 balance = address(this).balance;

        // Asegurarse de que haya fondos para retirar.
        require(balance > 0, "No hay fondos para retirar.");

        // Transferir el balance a la dirección del propietario.
        // Se usa .call en lugar de .transfer o .send por seguridad y eficiencia de gas.
        (bool success, ) = owner.call{value: balance}("");
        require(success, "La transferencia de fondos fallo.");
    }

    /**
     * @dev Una función de vista pública para que cualquiera pueda consultar el balance del contrato.
     * No consume gas si se llama externamente.
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
