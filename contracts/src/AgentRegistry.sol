// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AgentRegistry {
    struct Agent {
        uint256 id;
        string name;
        string role;
        uint256 reputation;
        address wallet;
        bool isActive;
    }

    mapping(uint256 => Agent) public agents;
    uint256 public nextAgentId = 1;

    event AgentRegistered(uint256 indexed id, string name, string role, address wallet);
    event ReputationUpdated(uint256 indexed id, uint256 newReputation);

    function registerAgent(string memory _name, string memory _role, address _wallet) external returns (uint256) {
        uint256 id = nextAgentId++;
        agents[id] = Agent({
            id: id,
            name: _name,
            role: _role,
            reputation: 0,
            wallet: _wallet,
            isActive: true
        });

        emit AgentRegistered(id, _name, _role, _wallet);
        return id;
    }

    function updateReputation(uint256 _id, uint256 _reputation) external {
        require(agents[_id].isActive, "Agent not active");
        agents[_id].reputation = _reputation;
        emit ReputationUpdated(_id, _reputation);
    }
}
