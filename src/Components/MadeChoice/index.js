import React, {useEffect, useState} from 'react';
import './MadeChoice.css';
import {ethers} from 'ethers';
import {CONTRACT_ADDRESS} from '../../constants';
import contract from '../../utils/RockPaperScissors.json';
import rockImage from '../../resources/ROCK.jpg';
import paperImage from '../../resources/PAPER.jpg';
import scissorsImage from '../../resources/SCISSORS.jpg';

const MadeChoice = ({setMadeChoice}) => {
    const rock = {
        name: "ROCK",
        image: rockImage,
        sign: "R"
    }
    const paper = {
        name: "PAPER",
        image: paperImage,
        sign: "P"
    }
    const scissors = {
        name: "SCISSORS",
        image: scissorsImage,
        sign: "S"
    }
    const choices = [rock, paper, scissors];
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


    const renderCharacters = () =>
        choices.map((choice) => (
            <div className="character-item" key={choice.name}>
                <div className="name-container">
                    <p>{choice.name}</p>
                </div>
                <img src={choice.image} alt={choice.name}/>
                <button
                    type="button"
                    className="character-mint-button"
                    onClick={() => makeChoiceAction(choice.sign)}
                >{`${choice.name}`}</button>
            </div>
        ));

    const makeChoiceAction = async (choice) => {
        try {
            if (gameContract) {
                console.log('Make choice in progress...');
                const makeChoiceTxn = await gameContract.makeChoice(choice);
                await makeChoiceTxn.wait();
                console.log('makeChoiceTxn:', makeChoiceTxn);
                setMadeChoice(true);
            }
        } catch (error) {
            console.warn('makeChoiceAction Error:', error);
        }
    };

    return (
        <div className="select-choice-container">
            <div className="character-grid">{renderCharacters()}</div>
        </div>
    );
};

export default MadeChoice;