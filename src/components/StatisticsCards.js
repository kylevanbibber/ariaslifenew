import React, { useEffect, useState } from 'react';

const StatisticsCards = ({ dateRange }) => {
    const [statistics, setStatistics] = useState({
        callsToSet: 0,
        callsToSit: 0,
        showRatio: 0,
        closeRatio: 0,
        alpPerSit: 0,
        alpPerSale: 0,
    });

    useEffect(() => {
        fetchData().then(rawData => {
            const filteredData = filterDataByDateRange(rawData, dateRange);
            processData(filteredData);
        }).catch(error => {
            console.error('Error fetching or processing data:', error);
        });
    }, [dateRange]);

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
        startDate.setDate(startDate.getDate() - 1);

        let endDate = new Date(dateRange[0].endDate);
        endDate.setDate(endDate.getDate() - 1);
        endDate.setDate(endDate.getDate() + 1);

        return data.filter((row, index) => {
            if (index === 0) return false;
            const itemDate = new Date(row[0]);
            return itemDate >= startDate && itemDate < endDate;
        });
    };

    const processData = (data) => {
        const stats = {
            callsToSet: calculateCallsToSet(data),
            callsToSit: calculateCallsToSit(data),
            showRatio: calculateShowRatio(data),
            closeRatio: calculateCloseRatio(data),
            alpPerSit: calculateALPPerSit(data),
            alpPerSale: calculateALPPerSale(data),
        };
        setStatistics(stats);
    };
    

    return (
        <>
        <h4>Statistics</h4>
        <div className="cards-row">
            <div className="card">
                <h2 className="card-title">Calls to Set</h2>
                <p className="card-text">{statistics.callsToSet}</p>
            </div>
            <div className="card">
                <h2 className="card-title">Calls to Sit</h2>
                <p className="card-text">{statistics.callsToSit}</p>
            </div>
            <div className="card">
                <h2 className="card-title">Show Ratio</h2>
                <p className="card-text">{statistics.showRatio}</p>
            </div>
            <div className="card">
                <h2 className="card-title">Close Ratio</h2>
                <p className="card-text">{statistics.closeRatio}</p>
            </div>
            <div className="card">
                <h2 className="card-title">ALP/Sit</h2>
                <p className="card-text">{statistics.alpPerSit}</p>
            </div>
            <div className="card">
                <h2 className="card-title">ALP/Sale</h2>
                <p className="card-text">{statistics.alpPerSale}</p>
            </div>
        </div>
        </>
    );
};

export default StatisticsCards;
const calculateCallsToSet = (data) => {
    const totalCalls = data.reduce((sum, row) => sum + parseFloat(row[20] || 0), 0);
    const totalAppointments = data.reduce((sum, row) => sum + parseFloat(row[21] || 0), 0);
    return totalAppointments > 0 ? Math.round(totalCalls / totalAppointments) : 0;
};
const calculateCallsToSit = (data) => {
    const totalCalls = data.reduce((sum, row) => sum + parseFloat(row[20] || 0), 0);
    const totalSits = data.reduce((sum, row) => sum + parseFloat(row[22] || 0), 0);
    return totalSits > 0 ? Math.round(totalCalls / totalSits) : 0;
};
const calculateShowRatio = (data) => {
    const totalSits = data.reduce((sum, row) => sum + parseFloat(row[22] || 0), 0);
    const totalAppointments = data.reduce((sum, row) => sum + parseFloat(row[21] || 0), 0);
    return totalAppointments > 0 ? ((totalSits / totalAppointments) * 100).toFixed(2) + '%' : '0%';
};
const calculateCloseRatio = (data) => {
    const totalSales = data.reduce((sum, row) => sum + parseFloat(row[23] || 0), 0);
    const totalSits = data.reduce((sum, row) => sum + parseFloat(row[22] || 0), 0);
    return totalSits > 0 ? ((totalSales / totalSits) * 100).toFixed(2) + '%' : '0%';
};
const calculateALPPerSit = (data) => {
    const totalALP = data.reduce((sum, row) => sum + parseFloat(row[24] || 0), 0);
    const totalSits = data.reduce((sum, row) => sum + parseFloat(row[22] || 0), 0);
    const alpPerSit = totalSits > 0 ? totalALP / totalSits : 0;
    return `$${new Intl.NumberFormat().format(alpPerSit.toFixed(2))}`;
};
const calculateALPPerSale = (data) => {
    const totalALP = data.reduce((sum, row) => sum + parseFloat(row[24] || 0), 0);
    const totalSales = data.reduce((sum, row) => sum + parseFloat(row[23] || 0), 0);
    const alpPerSale = totalSales > 0 ? totalALP / totalSales : 0;
    return `$${new Intl.NumberFormat().format(alpPerSale.toFixed(2))}`;
};

