import React, { useState } from 'react';
import '../Ticker.css'
export const TickerInput = ({ label, allowDouble }) => {
    const [value, setValue] = useState(0);

    const handleIncrement = (increment = 1) => {
        setValue(prevValue => prevValue + increment);
    };

    const handleDecrement = (decrement = 1) => {
        setValue(prevValue => (prevValue >= decrement ? prevValue - decrement : 0));
    };

    return (
        <div className="ticker-input">
            <label>{label}: </label>
            {allowDouble && <button onClick={() => handleDecrement(2)}>--</button>}
            <button onClick={() => handleDecrement()}>-</button>
            <input type="number" value={value} onChange={e => setValue(Number(e.target.value))} />
            <button onClick={() => handleIncrement()}>+</button>
            {allowDouble && <button onClick={() => handleIncrement(2)}>++</button>}
        </div>
    );
};

const ActivityInputForm = () => {
    return (
        <div className="activity-input-form">
            <TickerInput label="Calls" allowDouble={true} />
            <TickerInput label="Appts" />
            <TickerInput label="Sits" />
            <TickerInput label="Sales" />
            <TickerInput label="ALP" />
            {/* Add other inputs as needed */}
        </div>
    );
};

export default ActivityInputForm;
