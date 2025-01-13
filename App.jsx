import { useState, useEffect } from 'react'
import Form from '/components/Form'
import MemoryCard from '/components/MemoryCard'
import AssistiveTechInfo from '/components/AssistiveTechInfo'
import GameOver from '/components/GameOver'
import ErrorCard from '/components/ErrorCard'
import Timer from './components/Timer'

export default function App() {
    const initialFormData = { category: "animals-and-nature", number: 10 }

    const [isFirstRender, setIsFirstRender] = useState(true)
    const [formData, setFormData] = useState(initialFormData)
    const [isGameOn, setIsGameOn] = useState(false)
    const [emojisData, setEmojisData] = useState([])
    const [selectedCards, setSelectedCards] = useState([])
    const [matchedCards, setMatchedCards] = useState([])
    const [areAllCardsMatched, setAreAllCardsMatched] = useState(false)
    const [isError, setIsError] = useState(false)
    const [isRunnign, setIsRunning] = useState(false)

    useEffect(() => {
        if (selectedCards.length === 2 && selectedCards[0].name === selectedCards[1].name) {
            setMatchedCards(prevMatchedCards => [...prevMatchedCards, ...selectedCards])
        }
    }, [selectedCards])

    useEffect(() => {
        if (emojisData.length && matchedCards.length === emojisData.length) {
            setAreAllCardsMatched(true)
        }
    }, [matchedCards])

    function handleFormChange(e) {
        setFormData(prevFormData => ({ ...prevFormData, [e.target.name]: e.target.value }))
    }


    async function stopTimer(e) {
        setaAtivateTimer(false)
    }

    async function startGame(e) {
        e.preventDefault()

        try {
            const response = await fetch(`https://emojihub.yurace.pro/api/all/category/${formData.category}`)

            if (!response.ok) {
                throw new Error("Could not fetch data from API")
            }

            const data = await response.json()
            const dataSlice = await getDataSlice(data)
            const emojisArray = await getEmojisArray(dataSlice)

            setEmojisData(emojisArray)
            setIsGameOn(true)
        } catch (err) {
            console.error(err)
            setIsError(true)
        } finally {
            setIsFirstRender(false)
        }
    }

    async function getDataSlice(data) {
        const randomIndices = getRandomIndices(data)

        const dataSlice = randomIndices.reduce((array, index) => {
            array.push(data[index])
            return array
        }, [])

        return dataSlice
    }

    function getRandomIndices(data) {
        const randomIndicesArray = []

        for (let i = 0; i < (formData.number / 2); i++) {
            const randomNum = Math.floor(Math.random() * data.length)
            if (!randomIndicesArray.includes(randomNum)) {
                randomIndicesArray.push(randomNum)
            } else {
                i--
            }
        }

        return randomIndicesArray
    }

    async function getEmojisArray(data) {
        const pairedEmojisArray = [...data, ...data]

        for (let i = pairedEmojisArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            const temp = pairedEmojisArray[i]
            pairedEmojisArray[i] = pairedEmojisArray[j]
            pairedEmojisArray[j] = temp
        }

        return pairedEmojisArray
    }

    function turnCard(name, index) {
        if (selectedCards.length < 2) {
            setSelectedCards(prevSelectedCards => [...prevSelectedCards, { name, index }])
        } else if (selectedCards.length === 2) {
            setSelectedCards([{ name, index }])
        }
    }

    const handleStart = () => setIsRunning(true);
    const handleStop = () => setIsRunning(false);

    function resetGame() {
        setIsGameOn(false)
        setIsRunning(false)
        setSelectedCards([])
        setMatchedCards([])
        setAreAllCardsMatched(false)
    }

    function resetError() {
        setIsError(false)
    }

    return (
        <main>
            <h1>Memory</h1>
            {!isGameOn && !isError &&
                <Form
                    handleSubmit={startGame}
                    handleChange={handleFormChange}
                    isFirstRender={isFirstRender}
                />
            }
            {isGameOn && !areAllCardsMatched &&
                <AssistiveTechInfo emojisData={emojisData} matchedCards={matchedCards} />}
            {areAllCardsMatched &&
                <>
                    <GameOver handleClick={resetGame}
                    />
                    
                </>}
            {isGameOn &&
                <>
                    <Timer isRunning={isGameOn && !areAllCardsMatched} />
                    <MemoryCard
                        handleClick={turnCard}
                        data={emojisData}
                        selectedCards={selectedCards}
                        matchedCards={matchedCards}
                    />
                </>
            }
            {isError &&
                <>
                    <ErrorCard handleClick={resetError} />
                    <Timer active={false} />
                </>
            }
        </main>
    )
}