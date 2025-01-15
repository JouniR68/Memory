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
    const [record, setRecord] = useState({ time: context.stopTime, level: context.level, timestamp: new Date().toISOString() });
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
            const hasNewRecord = data.some((f) => {
                console.log("f-time: " + f.time)
                return context.stopTime < f.time
            }) // Compare with existing records
            setNewRecord(hasNewRecord);
        };

        checkNewRecord();
    }, [context.stopTime]);


    const saveRecord = async () => {

        try {
            console.log("record to be saved: ", record);

            await addDoc(collection(db, "records"), {
                ...record,
                //timestamp: new Date().toISOString(),
            });
            alert("Record saved successfully!");
            setNewRecord(false); // Close dialog after saving

        } catch (error) {
            console.error("Error saving record: ", error);
            alert("Failed to save record.");
        }
    };


    return (
        <>
            {newRecord && <div className="btn--endGame">


                <Button sx={{ fontWeight: 'bold' }} onClick={() => saveRecord()}>
                    Save New Record
                </Button>

            </div>
            }
            <div className="btn--endGame">
                <Button sx={{ fontWeight: 'bold' }} onClick={context.resetGame}>
                    Play again
                </Button>
            </div>
        </>
    );
};

export default Confirmation;
