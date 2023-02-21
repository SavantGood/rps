import React, {useEffect, useState} from 'react';
import './JoinRoom.css';
import {ethers} from 'ethers';
import {CONTRACT_ADDRESS} from '../../constants';
import contract from '../../utils/RockPaperScissors.json';

const JoinRoom = ({ setJoinRoom }) => {
    const [gameContract, setGameContract] = useState(null);

    useEffect(() => {
        const {ethereum} = window;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const gameContract = new ethers.Contract(
                CONTRACT_ADDRESS,
                contract.abi,
                signer
            );

            setGameContract(gameContract);
        } else {
            console.log('Ethereum object not found');
        }
    }, []);

    const joinRoomAction = async () => {
        try {
            if (gameContract) {
                let playerInRoom = await gameContract.playerInRoom();
                console.log(playerInRoom + " - player in ROOM")
                if (playerInRoom) {
                    setJoinRoom(true);
                    return;
                }
                console.log('Join to room in progress...');
                const joinTxn = await gameContract.join();
                await joinTxn.wait();
                console.log('joinTxn:', joinTxn);
                setJoinRoom(true);
            }
        } catch (error) {
            console.warn('joinTxn Error:', error);
        }
    };

    return (
        <div className="join-room-container">
            <button
                className="cta-button join-wallet-button"
                onClick={joinRoomAction}
            >
                Join Room
            </button>
        </div>
    );
};

export default JoinRoom;