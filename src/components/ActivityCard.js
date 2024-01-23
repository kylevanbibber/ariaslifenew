import React, { useEffect, useState } from 'react';
import '../ActivityCards.css';

const ActivityCards = ({ dateRange }) => {
    const [processedData, setProcessedData] = useState({
        alp: 0,
        calls: 0,
        appointments: 0,
        sits: 0,
        sales: 0,
        refs: 0,
    });
    
    const [showAverage, setShowAverage] = useState(false);
    const handleToggle = (event) => {
        setShowAverage(event.target.id === "average");
    };

    const [alpCounter, setAlpCounter] = useState(0);
    const [displayAlp, setDisplayAlp] = useState(0);

const usePointerGlow = () => {
  useEffect(() => {
    const syncPointer = ({ clientX, clientY }) => {
      document.documentElement.style.setProperty('--x', `${clientX}px`);
      document.documentElement.style.setProperty('--y', `${clientY}px`);
    };
    window.addEventListener('mousemove', syncPointer);
    return () => window.removeEventListener('mousemove', syncPointer);
  }, []);
};
const animateValue = (start, end, duration) => {
    if (start === end) return;
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        setDisplayAlp(Math.floor(progress * (end - start) + start));
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
};
    useEffect(() => {
        fetchData().then(rawData => {
            const filteredData = filterDataByDateRange(rawData, dateRange);
            processData(filteredData);
        }).catch(error => {
            console.error('Error fetching or processing data:', error);
            setProcessedData({
                alp: 'Error',
                calls: 'Error',
                appointments: 'Error',
                sits: 'Error',
                sales: 'Error',
                refs: 'Error',
            });
        });
    }, [dateRange, showAverage]);

    const fetchData = async () => {
        const sheetId = '1OIHKR6KyA5gLrNSTQVff6_g1DMzsjppQxTAgfJvh7Ks';
        const range = 'Agency Activity';
        const apiKey = 'AIzaSyAUQ8D5K1kc2CBTEd0RM3WUOhcI5OJGydg';
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.values;
    };

    const filterDataByDateRange = (data, dateRange) => {
        let startDate = new Date(dateRange[0].startDate);
        let endDate = new Date(dateRange[0].endDate);
    
        // Convert start and end dates to UTC
        startDate = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()));
        endDate = new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59));
    
        return data.filter((row, index) => {
            if (index === 0) return false;
            const itemDate = new Date(row[0] + 'T00:00:00Z'); // Parse as UTC
            return itemDate >= startDate && itemDate <= endDate;
        });
    };
    

    const processData = (data) => {
        let sum = {
            alp: 0,
            calls: 0,
            appointments: 0,
            sits: 0,
            sales: 0,
            refs: 0,
        };
        let count = 0;

        data.forEach(row => {
            sum.alp += parseFloat(row[24] || 0);
            sum.calls += parseFloat(row[20] || 0);
            sum.appointments += parseFloat(row[21] || 0);
            sum.sits += parseFloat(row[22] || 0);
            sum.sales += parseFloat(row[23] || 0);
            sum.refs += parseFloat(row[25] || 0);
            count++;
        });

        const average = {
            alp: (sum.alp / count).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
            calls: Math.round(sum.calls / count).toLocaleString(),
            appointments: Math.round(sum.appointments / count).toLocaleString(),
            sits: Math.round(sum.sits / count).toLocaleString(),
            sales: Math.round(sum.sales / count).toLocaleString(),
            refs: Math.round(sum.refs / count).toLocaleString(),
        };

        const total = {
            alp: sum.alp.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
            calls: sum.calls.toLocaleString(),
            appointments: sum.appointments.toLocaleString(),
            sits: sum.sits.toLocaleString(),
            sales: sum.sales.toLocaleString(),
            refs: sum.refs.toLocaleString(),
        };
    
        setProcessedData(showAverage ? average : total);
        let finalValue = showAverage ? (sum.alp / count) : sum.alp;
        animateValue(alpCounter, finalValue, 500); // 2000 ms for animation
        setAlpCounter(finalValue);

    };
    usePointerGlow(); // Activate the glowing effect

    return (
        <>
            <div className="header-with-toggle">
                <h4>Activity</h4>
                <div className="tabs">
                    <input type="radio" id="sum" name="calculation_type" value="Sum" checked={!showAverage} onChange={handleToggle} />
                    <label for="sum">Sum</label>
                    <input type="radio" id="average" name="calculation_type" value="Average" checked={showAverage} onChange={handleToggle} />
                    <label for="average">Avg</label>
                </div>
            </div>
        <div className="cards-row">
        <div className="card" >
                <h5 className="card-title">ALP</h5>
                <p className="card-text">{displayAlp.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
            </div>
            <div className="card" >
                <h5 className="card-title">Calls</h5>
                <p className="card-text">{processedData.calls}</p>
            </div>
            <div className="card" >
                <h5 className="card-title">Appointments</h5>
                <p className="card-text">{processedData.appointments}</p>
            </div>
            <div className="card" >
                <h5 className="card-title">Sits</h5>
                <p className="card-text">{processedData.sits}</p>
            </div>
            <div className="card" >
                <h5 className="card-title">Sales</h5>
                <p className="card-text">{processedData.sales}</p>
            </div>
            <div className="card" >
                <h5 className="card-title">Refs</h5>
                <p className="card-text">{processedData.refs}</p>
            </div>
        </div>
        </>
    );
};

export default ActivityCards;
const Counter = ({ value }) => {
    // Logic to split the value into individual digits
    const digits = value.toFixed(2).split('');

    return (
        <div className="counter">
            {digits.map((digit, index) => (
                <span key={index} className="digit">
                    {digit}
                </span>
            ))}
        </div>
    );
};