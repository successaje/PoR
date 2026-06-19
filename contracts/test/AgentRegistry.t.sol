// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/AgentRegistry.sol";

contract AgentRegistryTest is Test {
    AgentRegistry agentRegistry;
    address owner = address(1);
    address unauthorized = address(2);

    function setUp() public {
        vm.prank(owner);
        agentRegistry = new AgentRegistry(owner);
    }

    function test_RegisterAgent_Success() public {
        vm.prank(owner);
        uint256 id = agentRegistry.registerAgent("Prism", "Fraud Detection", address(100));
        
        (uint256 fetchedId, string memory name, string memory role, uint256 rep, address wallet, bool isActive) = agentRegistry.agents(id);
        
        assertEq(fetchedId, id);
        assertEq(name, "Prism");
        assertEq(role, "Fraud Detection");
        assertEq(rep, 0);
        assertEq(wallet, address(100));
        assertTrue(isActive);
    }

    function test_RegisterAgent_Revert_NonOwner() public {
        vm.prank(unauthorized);
        vm.expectRevert();
        agentRegistry.registerAgent("Rogue", "Hacking", address(999));
    }
}
