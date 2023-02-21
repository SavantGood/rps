import React, {useEffect, useState} from 'react';
import {ethers} from 'ethers';
import {CONTRACT_ADDRESS} from '../../constants';
import myEpicGame from '../../utils/RockPaperScissors.json';
import './GameResult.css';

const GameResult = () => {
    const [gameContract, setGameContract] = useState(null);

    useEffect(() => {
        const onGameResult = async (sender, resultData) => {
            console.log(
                `ReadyGameResult - sender: ${sender} result: ${resultData}`
            );
            switch (resultData) {
                case 1:
                    document.getElementById('win').textContent = 'WIN PLAYER 1'
                    return;
                case 2:
                    document.getElementById('win').textContent = 'WIN PLAYER 2'
                    return;
                case 0:
                    document.getElementById('win').textContent = 'DRAW!'
                    return;
                default:
                    document.getElementById('win').textContent = 'WAIT RESULT!'
                    return;
            }
        };

        if (gameContract) {
            console.log(gameContract.address)
            gameContract.on('ReadyGameResult', onGameResult);
        }

        return () => {
            if (gameContract) {
                gameContract.off('ReadyGameResult', onGameResult);
            }
        };
    }, [gameContract]);

    useEffect(() => {
        const {ethereum} = window;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const gameContract = new ethers.Contract(
                CONTRACT_ADDRESS,
                myEpicGame.abi,
                signer
            );

            setGameContract(gameContract);
        } else {
            console.log('Ethereum object not found');
        }
    }, []);

    return (
        <div className="winner-container">
            <div className="connect-wallet-container">
                <h2 className="win-header" id="win">WAIT RESULT</h2>
            </div>
        </div>
    );
};

export default GameResult;