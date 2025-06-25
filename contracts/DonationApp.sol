// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title DonationApp
 * @dev A simple contract to receive donations and allow only the owner to withdraw them.
 */
contract DonationApp {
    // The address of the contract owner, set at the time of deployment.
    // It's 'immutable' because it will not change throughout the contract's life.
    address public immutable owner;

    // An event that is emitted every time a new donation is received.
    // This allows the frontend to listen for donations in real-time.
    event DonationReceived(address indexed donor, uint256 amount, uint256 totalDonated, uint256 timestamp);

    /**
     * @dev The constructor runs only once, when the contract is deployed.
     * It sets the deploying address as the owner.
     */
    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev A 'receive' function is executed when the contract receives Ether (POL on Polygon)
     * without any other function being specified. It is the main way to donate.
     * It must be 'payable'.
     */
    receive() external payable {
        // Ensure the donation is not zero.
        require(msg.value > 0, "Donation must be greater than zero.");

        // Get the current total balance of the contract.
        uint256 totalBalance = address(this).balance;

        // Emit the event with the donation details.
        emit DonationReceived(msg.sender, msg.value, totalBalance, block.timestamp);
    }

    /**
     * @dev Allows the contract owner to withdraw the entire balance.
     */
    function withdraw() external {
        // Only the owner can call this function.
        require(msg.sender == owner, "Only the owner can withdraw funds.");

        // Get the total balance of the contract.
        uint256 balance = address(this).balance;

        // Ensure there are funds to withdraw.
        require(balance > 0, "There are no funds to withdraw.");

        // Transfer the balance to the owner's address.
        // .call is used instead of .transfer or .send for security and gas efficiency.
        (bool success, ) = owner.call{value: balance}("");
        require(success, "Fund transfer failed.");
    }

    /**
     * @dev A public view function for anyone to query the contract's balance.
     * It does not consume gas when called externally.
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
