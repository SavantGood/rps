import React, {useEffect, useState} from 'react';
import './App.css';
import MadeChoice from './Components/MadeChoice';
import {CONTRACT_ADDRESS} from './constants';
import contract from './utils/RockPaperScissors.json';
import {ethers} from 'ethers';
import JoinRoom from "./Components/JoinRoom";
import GameResult from "./Components/GameResult";

const App = () => {
    const [currentAccount, setCurrentAccount] = useState(null);
    const [joinRoom, setJoinRoom] = useState(null);
    const [madeChoice, setMadeChoice] = useState(null);
    const [player1MadeChoice, setPlayer1MadeChoice] = useState(null);
    const [player2MadeChoice, setPlayer2MadeChoice] = useState(null);
    const [gameContract, setGameContract] = useState(null);

    const checkIfWalletIsConnected = async () => {
        try {
            const {ethereum} = window;

            if (!ethereum) {
                console.log('Make sure you have MetaMask!');
                return;
            } else {
                console.log('We have the ethereum object', ethereum);

                const accounts = await ethereum.request({method: 'eth_accounts'});

                if (accounts.length !== 0) {
                    const account = accounts[0];
                    console.log('Found an authorized account:', account);
                    setCurrentAccount(account);
                } else {
                    console.log('No authorized account found');
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const renderContent = () => {
        if (!currentAccount) {
            return (
                <div className="connect-wallet-container">
                    <img
                        src="https://hips.hearstapps.com/hmg-prod/images/people-playing-paper-rock-scissors-royalty-free-illustration-1583269312.jpg?crop=0.997xw:0.712xh;0.00160xw,0.181xh&resize=1200:*"
                    />
                    <button
                        className="cta-button connect-wallet-button"
                        onClick={connectWalletAction}
                    >
                        Connect Wallet
                    </button>
                </div>
            );
        } else if (currentAccount && !joinRoom) {
            return <JoinRoom setJoinRoom={setJoinRoom}/>;
        } else if (currentAccount && joinRoom && !madeChoice) {
            return <MadeChoice setMadeChoice={setMadeChoice}/>;
        } else if (currentAccount && joinRoom && madeChoice) {
            return <GameResult/>;
        }
    };

    const connectWalletAction = async () => {
        try {
            const {ethereum} = window;

            if (!ethereum) {
                alert('Get MetaMask!');
                return;
            }
            const accounts = await ethereum.request({
                method: 'eth_requestAccounts',
            });
            console.log('Connected', accounts[0]);
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);
        }
    };

    const checkNetwork = async () => {
        try {
            if (window.ethereum.networkVersion !== '97') {
                alert("Please connect to BNB-Chain Testnet!")
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
        checkNetwork();
    }, []);

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

    useEffect(() => {
        const onMadeChoice = async (resultData) => {
            console.log(
                `Player1MadeChoice - result: ${resultData}`
            );
            setPlayer1MadeChoice(resultData);
        };

        if (gameContract) {
            console.log(gameContract.address)
            gameContract.on('Player1MadeChoice', onMadeChoice);
        }

        return () => {
            if (gameContract) {
                gameContract.off('Player1MadeChoice', onMadeChoice);
            }
        };
    }, [gameContract]);

    useEffect(() => {
        const onMadeChoice = async (resultData) => {
            console.log(
                `Player2MadeChoice - result: ${resultData}`
            );
            setPlayer2MadeChoice(resultData);
        };

        if (gameContract) {
            console.log(gameContract.address)
            gameContract.on('Player2MadeChoice', onMadeChoice);
        }

        return () => {
            if (gameContract) {
                gameContract.off('Player2MadeChoice', onMadeChoice);
            }
        };
    }, [gameContract]);

    useEffect(async () => {
        if (player1MadeChoice && player2MadeChoice) {
            console.log('Disclose in progress...');
            const discloseTxn = await gameContract.disclose();
            await discloseTxn.wait();
            console.log('discloseTxn:', discloseTxn);
        }
    }, [player1MadeChoice, player2MadeChoice]);

    return (
        <div className="App">
            <div className="container">
                <div className="header-container">
                    <p className="header gradient-text">RockPaperScissors</p>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default App;