// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {PointStorage} from './storage/PointStorage.sol';
import {BadgeToken} from './token/BadgeToken.sol';

// Open Zeppelin libraries for controlling upgradability and access.
import {Initializable} from '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import {OwnableUpgradeable} from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import {UUPSUpgradeable} from '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import {Strings} from '@openzeppelin/contracts/utils/Strings.sol';

import {CustomerManagementCore} from './CustomerManagementCore.sol';
import {IPointCore} from './interfaces/IPointCore.sol';

contract PointCore is
    Initializable,
    UUPSUpgradeable,
    OwnableUpgradeable,
    IPointCore,
    PointStorage,
    BadgeToken
{
    CustomerManagementCore public customerManagerInstance;

    uint256 public pointsForPremium;
    uint256 public pointsForGold;
    uint256 public pointsForTitanium;

    string public metadataURI;

    modifier validClient(uint256 clientId) {
        require(
            customerManagerInstance.isClientExists(clientId),
            'InvalidClientID on PointCore'
        );
        _;
    }

    function initialize(
        address _customerManagerInstanceAddress,
        string memory uri
    ) public initializer {
        __Ownable_init(msg.sender);
        customerManagerInstance = CustomerManagementCore(
            _customerManagerInstanceAddress
        );
        __ERC1155_init(uri);

        setPointThresholds(200, 500, 1000);
        metadataURI = uri;
    }

    // ---------- SETTERS ----------
    /// @dev set points for each level
    function setPointThresholds(
        uint256 premium,
        uint256 gold,
        uint256 titanium
    ) public onlyOwner {
        pointsForPremium = premium;
        pointsForGold = gold;
        pointsForTitanium = titanium;
    }

    /// @dev add points
    function addPoints(
        uint256 clientId,
        uint points
    ) public onlyOwner validClient(clientId) {
        clientPoints[clientId] += points;
        updateClientLevel(clientId);

        emit PointsAdded(clientId, points);
    }

    /// @dev remove points
    function removePoints(
        uint256 clientId,
        uint points
    ) public onlyOwner validClient(clientId) {
        if (points > clientPoints[clientId])
            revert InsufficientPoints(clientPoints[clientId], points);

        clientPoints[clientId] -= points;
        emit PointsRemoved(clientId, points);
    }

    /// ---------- GETTERS ----------
    /**
     * @dev Returns the total points of a given client.
     * @param clientId The ID of the client.
     * @return Total points of the client.
     */
    function getClientPoints(
        uint256 clientId
    ) public view validClient(clientId) returns (uint) {
        return clientPoints[clientId];
    }

    function getClientLevel(
        uint256 clientId
    ) public view validClient(clientId) returns (uint) {
        return clientLevel[clientId];
    }

    function getVersion() public pure returns (string memory) {
        return '1.0.0';
    }

    function tokenURI(uint256 tokenId) public view returns (string memory) {
        require(!_exists(tokenId), 'Token ID does not exist');
        return
            string(
                abi.encodePacked(metadataURI, '/', Strings.toString(tokenId))
            );
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return customerManagerInstance.getUserTokenID(msg.sender) == tokenId;
    }

    /// ---------- INTERNAL ----------
    function updateClientLevel(uint256 clientId) internal {
        uint256 currentPoints = clientPoints[clientId];
        uint256 currentLevel = clientLevel[clientId];
        uint256 newLevel = 0;

        clientLevel[clientId] = newLevel;

        if (currentPoints >= pointsForTitanium) {
            newLevel = CUSTOMER_TITANIUM;
        } else if (currentPoints >= pointsForGold) {
            newLevel = CUSTOMER_GOLD;
        } else if (currentPoints >= pointsForPremium) {
            newLevel = CUSTOMER_PREMIUM;
        }

        address clientAddress = customerManagerInstance.getClientWalletAddress(
            clientId
        );

        if (newLevel != currentLevel) {
            burnPreviousLevelToken(clientId, clientAddress, currentLevel);
            _mint(clientAddress, newLevel, 1, '');
            emitMintEvent(clientId, newLevel);

            // if (newLevel == CUSTOMER_TITANIUM) {
            //     clientPoints[clientId] = 0;
            //     emit ClientPointsReset(clientId);
            // }
        }

        emit ClientPointsChanged(clientId, clientPoints[clientId]);
    }

    function burnPreviousLevelToken(
        uint256 clientId,
        address clientAddress,
        uint256 currentLevel
    ) internal {
        if (currentLevel != 0 && balanceOf(clientAddress, currentLevel) > 0) {
            _burn(clientAddress, currentLevel, 1);
            emitBurnEvent(clientId, currentLevel);
        }
    }

    function emitMintEvent(uint256 clientId, uint256 level) internal {
        address clientAddress = customerManagerInstance.getClientWalletAddress(
            clientId
        );
        if (level == CUSTOMER_TITANIUM) {
            emit CustomerTitaniumMinted(clientId, clientAddress);
        } else if (level == CUSTOMER_GOLD) {
            emit CustomerGoldMinted(clientId, clientAddress);
        } else if (level == CUSTOMER_PREMIUM) {
            emit CustomerPremiumMinted(clientId, clientAddress);
        }
    }

    function emitBurnEvent(uint256 clientId, uint256 burnedLevel) internal {
        address clientAddress = customerManagerInstance.getClientWalletAddress(
            clientId
        );
        if (burnedLevel == CUSTOMER_GOLD) {
            emit CustomerGoldBurned(clientId, clientAddress);
        } else if (burnedLevel == CUSTOMER_PREMIUM) {
            emit CustomerPremiumBurned(clientId, clientAddress);
        }
    }
}
