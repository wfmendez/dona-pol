// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title DonationApp v2
 * @dev Accepts POL donations with optional on-chain messages.
 *      Tracks unique donors and emits full event data for real-time frontends.
 */
contract DonationApp {
    // ── State ──────────────────────────────────────────────────────────────────
    address public immutable owner;

    /// @notice Total amount donated per address (in wei)
    mapping(address => uint256) public totalDonatedBy;

    /// @notice Number of unique donor addresses
    uint256 public donorCount;

    // ── Events ─────────────────────────────────────────────────────────────────
    event DonationReceived(
        address indexed donor,
        uint256 amount,
        uint256 totalBalance,
        uint256 timestamp,
        string  message
    );

    // ── Constructor ────────────────────────────────────────────────────────────
    constructor() {
        owner = msg.sender;
    }

    // ── Donation entry-points ─────────────────────────────────────────────────

    /**
     * @dev Plain ETH transfer (no message).  Triggered by MetaMask's
     *      sendTransaction({ to: CONTRACT_ADDRESS, value: ... }).
     */
    receive() external payable {
        require(msg.value > 0, "Donation must be greater than zero.");
        _processDonation("");
    }

    /**
     * @dev Donate with an optional on-chain message (max ~280 chars recommended).
     *      Called via contract.donate(message, { value: ... }).
     */
    function donate(string calldata message) external payable {
        require(msg.value > 0, "Donation must be greater than zero.");
        _processDonation(message);
    }

    // ── Internal ───────────────────────────────────────────────────────────────
    function _processDonation(string memory message) internal {
        // Track unique donors
        if (totalDonatedBy[msg.sender] == 0) {
            donorCount++;
        }
        totalDonatedBy[msg.sender] += msg.value;

        emit DonationReceived(
            msg.sender,
            msg.value,
            address(this).balance,
            block.timestamp,
            message
        );
    }

    // ── Owner actions ──────────────────────────────────────────────────────────
    function withdraw() external {
        require(msg.sender == owner, "Only the owner can withdraw funds.");
        uint256 balance = address(this).balance;
        require(balance > 0, "There are no funds to withdraw.");
        (bool success, ) = owner.call{value: balance}("");
        require(success, "Fund transfer failed.");
    }

    // ── View helpers ───────────────────────────────────────────────────────────
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
