import { useState, useEffect, useContext } from "react";
import { db } from "./firebase"; // Import Firebase configuration
import { addDoc, collection, getDocs } from "firebase/firestore";
import {
    TextField,
    Button,
} from "@mui/material";
import RegularButton from "./RegularButton";
import MyContext from "../MyContext";

const Confirmation = ({ handleClick }) => {
    const context = useContext(MyContext)

    const [name, setName] = useState("");
    const [record, setRecord] = useState({ time: context.stopTime, level: parseInt(context.level), timestamp: new Date().toISOString() });
    const [data, setData] = useState([]);
    const [newRecord, setNewRecord] = useState(false);

    console.log("Timer stopped in " + context.stopTime + ", context.level" + context.level)

    // Fetch records only once when the component mounts
    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "records"));
                const recordsArray = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setData(recordsArray); // Save fetched records in state
            } catch (error) {
                console.error("Error fetching records: ", error);
            }
        };

        fetchRecords();
    }, []);

    data.forEach(d => console.log("d-time: ", d.time))
    // Check if a new record has been achieved

    useEffect(() => {
        const checkNewRecord = () => {
            if (data.length === 0) return; // Avoid checking if no records exist
            return data.some((f) => {
                console.log(`stopTime ${context.stopTime} - stored time ${f.time}`)                
                return context.stopTime < f.time
            })             
        };
                
        const hasNewRecord = checkNewRecord();
        hasNewRecord ? setNewRecord(true) : setNewRecord(false);
    }, [context.stopTime]);


    const saveRecord = async () => {

        try {
            console.log("record to be saved: ", record);

            await addDoc(collection(db, "records"), {
                ...record,
                //timestamp: new Date().toISOString(),
            });
            
            alert("Record saved successfully!");            
            setNewRecord(false);

        } catch (error) {
            console.error("Error saving record: ", error);
            alert("Failed to save record.");
        }
    };


    return (
        <>
            {newRecord && 
                <Button sx={{ fontWeight: 'bold', marginTop:'2rem' }} onClick={() => saveRecord()}>
                    Save New Record
                </Button>

            
            }
            {context.isGameOn && 
                <Button sx={{ fontWeight: 'bold', marginTop:'2rem' }} onClick={context.resetGame}>
                    Play again
                </Button>            
}
        </>
    );
};

export default Confirmation;
