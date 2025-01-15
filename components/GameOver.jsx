import { useState } from 'react'
import { useEffect, useRef } from 'react'
import RegularButton from './RegularButton'
import Timer from './Timer'
import Confirmation from './Confirmation'

export default function GameOver({ handleClick, stopTime, level }) {
    const divRef = useRef(null)
    const [check, setCheck] = useState(false)


    useEffect(() => {
        divRef.current.focus()
    }, [])


    const checkRecord = () => {
        setCheck(true)
    }

    return (
        <div
            className="wrapper wrapper--accent"
            tabIndex={0}
            ref={divRef}
        >
            <p className="p--large">You've matched all the memory cards!</p>

            {check && <Confirmation />}
        </div>
    )
}