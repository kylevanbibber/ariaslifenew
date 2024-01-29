import React, { useState, useEffect } from 'react';
import '../MaxBonus.css';

const MaxBonus = () => {
    const [mgas, setMgas] = useState([]);
    const [selectedMga, setSelectedMga] = useState('');
    const [objectives, setObjectives] = useState({});
    const [lastMonthData, setLastMonthData] = useState(0);
    const [thisMonthData, setThisMonthData] = useState(0);
    const [remaining, setRemaining] = useState(0);
    const [bonusPercentage, setBonusPercentage] = useState(0);
    const [mgaMap, setMgaMap] = useState({});
    const [mgaData, setMgaData] = useState([]); // Corrected state declaration for mgaData
    const [associatesData, setAssociatesData] = useState([]); // Corrected state declaration for associatesData
    const [tenure, setTenure] = useState(''); // State for storing tenure
    const [linkedMgas, setLinkedMgas] = useState([]); // State for storing linked MGAs
    const [linkedMgasData, setLinkedMgasData] = useState([]);
    const [rollupsTotal, setRollupsTotal] = useState(0);
    const [vipData, setVipData] = useState([]);
    const [vipTotal, setVipTotal] = useState(0);
    const [vipStatus, setVipStatus] = useState('N'); // Default to 'N'
    const [expandedRow, setExpandedRow] = useState({ lastMonth: false, thisMonth: false });
    const [lastMonthCodes, setLastMonthCodes] = useState(0);
    const [lastMonthVips, setLastMonthVips] = useState(0);
    const [thisMonthCodes, setThisMonthCodes] = useState(0);
    const [thisMonthVips, setThisMonthVips] = useState(0);
    const [detailsData, setDetailsData] = useState([]);
    const [twoMonthsAgoData, setTwoMonthsAgoData] = useState(0);
    const [lastMonthDataShifted, setLastMonthDataShifted] = useState(0);
    const [rollupsTotalShifted, setRollupsTotalShifted] = useState(0);
    const [remainingShifted, setRemainingShifted] = useState(0);
    const [bonusPercentageShifted, setBonusPercentageShifted] = useState(0);
    const [lastMonthVipsShifted, setLastMonthVipsShifted] = useState(0);

    const fetchData = async () => {
        fetchMgaAndAssociatesData();
    };

    const fetchMgaAndAssociatesData = async () => {
        const sheetId = '1OIHKR6KyA5gLrNSTQVff6_g1DMzsjppQxTAgfJvh7Ks';
        const mgaRange = 'MGA/RGA';
        const associatesRange = 'ASSOCIATES 1$ WITH HIERARCHY';
        const vipRange = 'Potential VIP';
        const detailsRange = 'Details';
        const apiKey = 'AIzaSyAUQ8D5K1kc2CBTEd0RM3WUOhcI5OJGydg';
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values:batchGet?ranges=${encodeURIComponent(mgaRange)}&ranges=${encodeURIComponent(associatesRange)}&ranges=${encodeURIComponent(vipRange)}&ranges=${encodeURIComponent(detailsRange)}&key=${apiKey}`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Network response was not ok, status: ${response.status}`);
            }
            const result = await response.json();
            console.log("API Response:", result); // Debugging log
    
            if (result.valueRanges && result.valueRanges.length === 4) {
                setMgaData(result.valueRanges[0].values);
                setAssociatesData(result.valueRanges[1].values);
                setVipData(result.valueRanges[2].values);
                setDetailsData(result.valueRanges[3].values);
            } else {
                console.error('Unexpected API response format:', result);
            }
    
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    
    const calculateBonusPercentageShifted = (totalData, objective) => {
        if (totalData < objective) return 0;
    
        const overObjective = totalData - objective;
        let bonus = 100;
        bonus += 5 * overObjective;
        return Math.min(bonus, 125);
    };
    const getMostRecentDate = (data) => {
        return data.reduce((latest, row) => {
            const rowDate = new Date(row[10]); // Assuming column K is at index 10
            return rowDate > latest ? rowDate : latest;
        }, new Date(0));
    };
    const processDetailsData = (detailsData) => {
        const lastMonthStart = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
        const lastMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth(), 0);
    
        const selectedMgaColumnEValue = mgaData.find(row => row[0] === selectedMga)?.[4];
    
        let lastMonthVipCount = 0;
        detailsData.forEach((row, index) => {
            if (index === 0) return; // Skip the header row if present
    
            const dateStr = row[0];
            const date = new Date(dateStr.substring(0, 10)); // Extract just the date part
            const mgaName = row[11];
    
            if (mgaName === selectedMgaColumnEValue && date >= lastMonthStart && date <= lastMonthEnd) {
                lastMonthVipCount++;
            }
        });
    
        setLastMonthVips(lastMonthVipCount);
    };
    
    
    const processVipData = (vipData, mgaData, selectedMga) => {
        const selectedMgaColumnEValue = mgaData.find(row => row[0] === selectedMga)?.[4]; // Assuming column E is at index 4
    
        // Find the most recent date in column K
        const mostRecentDate = getMostRecentDate(vipData);
    
        // Filter rows with the most recent date and matching column I value
        const filteredRows = vipData.filter(row => {
            const rowDate = new Date(row[10]);
            const valueInJ = parseFloat(row[9]);
            const columnIValue = row[8];
            return rowDate.getTime() === mostRecentDate.getTime() && columnIValue === selectedMgaColumnEValue && valueInJ >= 5000;
        });
    
        // Count the number of rows that meet the criteria
        const totalVip = filteredRows.length;
    
        setVipTotal(totalVip);
    };
    
    
    const processMgaData = (mgaData) => {
        let newMgas = [];
        let newObjectives = {};
        let newMgaMap = {};
        let selectedMgaTenure = '';
        let linkedMgasForSelectedMga = [];
    
        mgaData.forEach((row, index) => {
            if (index === 0) return; // Skip header row
    
            const mgaName = row[0];
            const objective = parseFloat(row[10]);
            const columnEValue = row[4]; // MGA name from column E
            const tenureValue = row[6]; // Tenure from column G
            const tenureDate = row[5]
            const linkedMga = row[1]; // Linked MGA from column B
    
            if (mgaName && !isNaN(objective)) {
                newMgas.push(mgaName);
                newObjectives[mgaName] = objective;
                newMgaMap[mgaName] = columnEValue;
    
                if (mgaName === selectedMga) {
                    selectedMgaTenure = tenureValue;
                }
    
                if (linkedMga === selectedMga && mgaName !== '') {
                    linkedMgasForSelectedMga.push(mgaName);
                }
            }
        });
    
        // Processing linked MGAs
        let newLinkedMgasData = mgaData.filter(row => row[1] === selectedMga)
            .map(row => {
                return {
                    name: row[0],
                    tenure: row[6],
                    columnEValue: row[4]
                };
            });
    
        setMgas(newMgas);
        setObjectives(newObjectives);
        setMgaMap(newMgaMap);
        setTenure(selectedMgaTenure);
        setLinkedMgas(linkedMgasForSelectedMga);
        setLinkedMgasData(newLinkedMgasData);
    };
    const processLinkedMgasAssociatesData = () => {
        let totalRollups = 0;
    
        // Check if the selected MGA meets its specific tenure and code/VIP requirements
        const selectedMgaMeetsRequirements = (tenure === '2' && (lastMonthData + thisMonthData) >= 3) ||
                                             (tenure === '3' && (lastMonthData + thisMonthData) >= 5);
    
        console.log("Processing Linked MGAs. Selected MGA Meets Requirements:", selectedMgaMeetsRequirements);
    
        if (selectedMgaMeetsRequirements) {
            linkedMgasData.forEach(linkedMga => {
                if (linkedMga.tenure === '1') {
                    const lastMonthVipsForLinkedMga = getLastMonthVipsForLinkedMga(linkedMga.columnEValue);
                    const thisMonthVipsForLinkedMga = getThisMonthVipsForLinkedMga(linkedMga.columnEValue);
    
                    const lastMonthCount = countAssociatesData(associatesData, 'lastMonth', linkedMga.columnEValue);
                    const thisMonthCount = countAssociatesData(associatesData, 'thisMonth', linkedMga.columnEValue);
    
                    console.log(`Linked MGA: ${linkedMga.name}, Last Month - Codes: ${lastMonthCount}, VIPs: ${lastMonthVipsForLinkedMga}, This Month - Codes: ${thisMonthCount}, VIPs: ${thisMonthVipsForLinkedMga}`);
    
                    totalRollups += lastMonthCount + thisMonthCount + lastMonthVipsForLinkedMga + thisMonthVipsForLinkedMga;
                }
            });
        }
    
        console.log("Total Rollups:", totalRollups);
        setRollupsTotal(totalRollups);
    };
    
    
    // Helper function to get last month's VIPs for a linked MGA
    const getLastMonthVipsForLinkedMga = (columnEValue) => {
        const lastMonthStart = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
        const lastMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth(), 0);
        let lastMonthVipCount = 0;
    
        detailsData.forEach(row => {
            const dateStr = row[0];
            const date = new Date(dateStr.substring(0, 10)); // Extract just the date part
            const mgaName = row[11];
    
            if (mgaName === columnEValue && date >= lastMonthStart && date <= lastMonthEnd) {
                lastMonthVipCount++;
            }
        });
    
        return lastMonthVipCount;
    };
    
    const getThisMonthVipsForLinkedMga = (columnEValue) => {
        const thisMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const thisMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
        let thisMonthVipCount = 0;
    
        vipData.forEach(row => {
            // Ensure the row has enough columns to prevent index out of bounds errors
            if(row.length >= 11) {
                const columnIValue = row[8];
                const valueInJ = parseFloat(row[9]);
                const dateStr = row[10];
                const date = new Date(dateStr);
    
                if (columnIValue === columnEValue && valueInJ >= 5000 && date >= thisMonthStart && date <= thisMonthEnd) {
                    thisMonthVipCount++;
                }
            }
        });
    
        return thisMonthVipCount;
    };
    
    
    useEffect(() => {
        if (selectedMga && mgaMap[selectedMga] && associatesData.length > 0 && mgaData.length > 0) {
            processLinkedMgasAssociatesData();
        }
    }, [selectedMga, mgaMap, associatesData, mgaData]);
    
const processAssociatesData = (associatesData, vipData, month, mgaNameFromColumnE) => {
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth() + (month === 'lastMonth' ? -1 : 0), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + (month === 'lastMonth' ? 0 : 1), 0);

    let codesCount = 0;
    let vipCountThisIteration = 0;

    // Counting the codes
    associatesData.forEach((row, index) => {
        if (index === 0) return; // Skip header row
        const mgaName = row[2];
        const dateStr = row[5];

        if (mgaName === mgaNameFromColumnE && dateStr) {
            const date = parseDate(dateStr);
            if (date >= firstDay && date <= lastDay) {
                codesCount++;
            }
        }
    });

    // Counting the VIPs
    vipData.forEach((row, index) => {
        if (index === 0) return; // Skip header row
        const columnIValue = row[8];
        const rowDate = new Date(row[10]);
        const valueInJ = parseFloat(row[9]);

        if (columnIValue === mgaNameFromColumnE && valueInJ >= 5000 && rowDate >= firstDay && rowDate <= lastDay) {
            vipCountThisIteration++;
        }
    });

    // Update total data and VIP status based on VIP count for this iteration
    if (vipCountThisIteration > 0) {
        setVipTotal(prevVipTotal => prevVipTotal + vipCountThisIteration);
        setVipStatus('Y');
    }

    const totalMonthData = codesCount + vipCountThisIteration;
    if (month === 'lastMonth') {
        setLastMonthData(codesCount + lastMonthVips); // Include VIP count in the total
        setLastMonthCodes(codesCount);
    } else {
        setThisMonthData(totalMonthData);
        setThisMonthCodes(codesCount);
        setThisMonthVips(vipCountThisIteration);
    }
    console.log(`Selected MGA (${mgaNameFromColumnE}) - ${month}: Codes: ${codesCount}, VIPs: ${vipCountThisIteration}`);

};


    
    const countAssociatesData = (data, month, columnEValue) => {
        const date = new Date();
        const firstDay = new Date(date.getFullYear(), date.getMonth() + (month === 'lastMonth' ? -1 : 0), 1);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + (month === 'lastMonth' ? 0 : 1), 0);
    
        let count = 0;
        data.forEach((row, index) => {
            if (index === 0) return; // Skip header row
            const mgaName = row[2]; // Assuming MGA name is in column C (index 2)
            const dateStr = row[5]; // Assuming date is in column F (index 5)
    
            if (mgaName === columnEValue && dateStr) {
                const date = parseDate(dateStr);
                if (date >= firstDay && date <= lastDay) {
                    count++;
                }
            }
        });
    
        return count;
    };
    
    const calculateBonusPercentage = () => {
        if (objectives[selectedMga] === undefined) return 0;

        const totalData = lastMonthData + thisMonthData + rollupsTotal;
        const objective = objectives[selectedMga];

        if (totalData < objective) {
            return 0;
        }

        const overObjective = totalData - objective;
        let bonus = 100;

        bonus += 5 * overObjective;
        bonus = Math.min(bonus, 125);

        return bonus;
    };
    const resetVipData = () => {
        setVipTotal(0); // Reset VIP total
        setVipStatus('N'); // Reset VIP status
    };
    
    const setRemainingAndBonus = () => {
        const totalData = lastMonthData + thisMonthData;
        let remainingValue = objectives[selectedMga] - totalData;
    
        // Subtract rollups from remaining if applicable
        remainingValue -= rollupsTotal;
    
        setRemaining(remainingValue);
        setBonusPercentage(calculateBonusPercentage());
    };


    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (mgaData.length > 0) {
            processMgaData(mgaData);
            resetVipData();

        }
    }, [mgaData, selectedMga]);

    useEffect(() => {
        if (selectedMga && mgaMap[selectedMga]) {
            setVipTotal(0); // Reset VIP total
            setVipStatus('N'); // Reset VIP status
            processAssociatesData(associatesData, vipData, 'lastMonth', mgaMap[selectedMga]);
            processAssociatesData(associatesData, vipData, 'thisMonth', mgaMap[selectedMga]);
    
            processDetailsData(detailsData); // Process last month VIPs
            processDataForShiftedTimeframe();
            const totalDataShifted = twoMonthsAgoData.codes + twoMonthsAgoData.vips + lastMonthDataShifted.codes + lastMonthDataShifted.vips + rollupsTotalShifted;

            const remainingShifted = objectives[selectedMga] ? objectives[selectedMga] - totalDataShifted : 0;
            const remainingPlusFiveShifted = remainingShifted + 5; // Adjust based on your logic if necessary
            
            // Calculate bonus percentage for the shifted timeframe
            const bonusPercentageShifted = calculateBonusPercentageShifted(totalDataShifted, objectives[selectedMga]);
    
            // Calculate rollups for the shifted timeframe
            const rollupsShifted = calculateRollupsForShiftedTimeFrame();
            setRollupsTotalShifted(rollupsShifted);
            setRemainingShifted(remainingShifted);
        setBonusPercentageShifted(bonusPercentageShifted);

            const selectedMgaTenure = mgaData.find(row => row[0] === selectedMga)?.[6] ?? '';
            setTenure(selectedMgaTenure);
    
            const newLinkedMgasData = mgaData.filter(row => row[1] === selectedMga)
                .map(row => ({
                    name: row[0],
                    tenure: row[6],
                    columnEValue: row[4],
                    tenureDate: row[5]
                }));
    
            setLinkedMgasData(newLinkedMgasData);

            if (lastMonthVips > 0 || thisMonthVips > 0) {
                setVipStatus('Y');
            } else {
                setVipStatus('N');
            }
        }
    }, [selectedMga, mgaMap, associatesData, vipData, mgaData, detailsData]); // Add detailsData as a dependency
    

    useEffect(() => {
        if (selectedMga) {
            setRemainingAndBonus();
        }
    }, [objectives, lastMonthData, thisMonthData, selectedMga, rollupsTotal]);

    useEffect(() => {
        if (vipData.length > 0 && mgaData.length > 0 && selectedMga) {
            processVipData(vipData, mgaData, selectedMga);
        }
    }, [vipData, mgaData, selectedMga]);
    
    
    const handleMgaChange = (event) => {
        setSelectedMga(event.target.value);
    };

    const getFormattedDate = (date) => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    };
    const parseDate = (dateStr) => {
        if (!isNaN(dateStr) && !isNaN(parseFloat(dateStr))) {
            const serialDateOrigin = new Date(1899, 11, 30);
            return new Date(serialDateOrigin.getTime() + (parseFloat(dateStr) - 1) * 86400000);
        } else {
            return new Date(dateStr.split(' ')[0]);
        }
    };
    const lastMonthDate = new Date();
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
    const twoMonthsAgoDate = new Date();
    twoMonthsAgoDate.setMonth(twoMonthsAgoDate.getMonth() - 2);
    twoMonthsAgoDate.setDate(1); // Set to the first day of two months ago
    const lastMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth(), 0);
const twoMonthsAgoEnd = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 0);

    const thisMonthDate = new Date();
    const handleRowClick = (rowName) => {
        setExpandedRow(prevState => ({
            ...prevState,
            [rowName]: !prevState[rowName]
        }));
    };
    

    const getNextMonthAndYear = () => {
        const now = new Date();
        const nextMonthDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        return {
            month: monthNames[nextMonthDate.getMonth()],
            year: nextMonthDate.getFullYear()
        };
    };

    const getThisMonthAndYear = () => {
        const now = new Date();
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        return {
            month: monthNames[now.getMonth()],
            year: now.getFullYear()
        };
    };
    
    
    const processDataForShiftedTimeframe = () => {
        const twoMonthsAgoStart = new Date(new Date().getFullYear(), new Date().getMonth() - 2, 1);
        const twoMonthsAgoEnd = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 0);
        const lastMonthStart = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
        const lastMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth(), 0);
    
        // Process 2 months ago data
        const twoMonthsAgoCodes = countAssociatesData(associatesData, 'twoMonthsAgo', mgaMap[selectedMga]);
        const twoMonthsAgoVips = countVips(detailsData, twoMonthsAgoStart, twoMonthsAgoEnd, mgaMap[selectedMga]);
        setTwoMonthsAgoData({ codes: twoMonthsAgoCodes, vips: twoMonthsAgoVips });
    
        // Process last month data (shifted)
        const lastMonthCodes = countAssociatesData(associatesData, 'lastMonth', mgaMap[selectedMga]);
        const lastMonthVips = countVips(detailsData, lastMonthStart, lastMonthEnd, mgaMap[selectedMga]);
        setLastMonthDataShifted({ codes: lastMonthCodes, vips: lastMonthVips });
        setLastMonthVipsShifted(lastMonthVips);
    
        // Process rollups for shifted time frame
        const rollupsShifted = calculateRollupsForShiftedTimeFrame();
        setRollupsTotalShifted(rollupsShifted);
    
        console.log(`Shifted Data - Selected MGA (${selectedMga}): Two Months Ago - Codes: ${twoMonthsAgoCodes}, VIPs: ${twoMonthsAgoVips}, Last Month - Codes: ${lastMonthCodes}, VIPs: ${lastMonthVips}`);
    };
    

    // Function to count VIPs in a given date range
    const countVips = (data, startDate, endDate, columnEValue) => {
        return data.reduce((count, row) => {
            const date = new Date(row[0].substring(0, 10));
            if (row[11] === columnEValue && date >= startDate && date <= endDate) {
                count++;
            }
            return count;
        }, 0);
    };
    const calculateRollupsForShiftedTimeFrame = () => {
        let totalRollups = 0;
        if (selectedMga && mgaMap[selectedMga] && linkedMgasData.length > 0) {
            linkedMgasData.forEach(linkedMga => {
                if (linkedMga.tenure === '1') {
                    const lastMonthVipsForLinkedMga = getLastMonthVipsForLinkedMga(linkedMga.columnEValue);
                    const twoMonthsAgoVipsForLinkedMga = getTwoMonthsAgoVipsForLinkedMga(linkedMga.columnEValue);
                    const lastMonthCount = countAssociatesData(associatesData, 'lastMonth', linkedMga.columnEValue);
                    const twoMonthsAgoCount = countAssociatesData(associatesData, 'twoMonthsAgo', linkedMga.columnEValue);
    
                    // Check if last month or two months ago is before the linkedMGA tenure date
                    const isBeforeTenureDate = (
                        new Date(lastMonthEnd) < new Date(linkedMga.tenureDate) ||
                        new Date(twoMonthsAgoEnd) < new Date(linkedMga.tenureDate)
                    );
    
                    if (!isBeforeTenureDate) {
                        totalRollups += lastMonthCount + twoMonthsAgoCount + lastMonthVipsForLinkedMga + twoMonthsAgoVipsForLinkedMga;
                    }
                }
            });
        }
        return totalRollups;
    };
    

const vipStatusShifted = (twoMonthsAgoData.vips > 0 || lastMonthVipsShifted > 0) ? 'Y' : 'N';


// Function to calculate VIPs for 2 months ago for a linked MGA
const getTwoMonthsAgoVipsForLinkedMga = (columnEValue) => {
    const twoMonthsAgoStart = new Date(new Date().getFullYear(), new Date().getMonth() - 2, 1);
    const twoMonthsAgoEnd = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 0);
    let twoMonthsAgoVipCount = 0;

    vipData.forEach(row => {
        if (row.length >= 11) {
            const columnIValue = row[8];
            const valueInJ = parseFloat(row[9]);
            const dateStr = row[10];
            const date = new Date(dateStr);

            if (columnIValue === columnEValue && valueInJ >= 5000 && date >= twoMonthsAgoStart && date <= twoMonthsAgoEnd) {
                twoMonthsAgoVipCount++;
            }
        }
    });

    return twoMonthsAgoVipCount;
};

    return (
        <div>
            <div className="maxcards-row">
                <select value={selectedMga} onChange={handleMgaChange}>
                    {mgas.map(mga => (
                        <option key={mga} value={mga}>{mga}</option>
                    ))}
                </select>
            </div>
            <h2>
            <strong style={{ color: "grey", fontWeight: "normal" }}>{getNextMonthAndYear().month}</strong> 
            <span style={{ color: "black" }}>{getNextMonthAndYear().year}</span>
        </h2>
            <table className="maxbonus-table">
                <thead>
                    <tr>
                        <th colSpan={2} className="top-table-header" style={{ backgroundColor: "#00548c" }}>Objective</th>
                        <th colSpan={2} className="top-table-header" style={{ backgroundColor: "#ED722F" }}>60 Day Window</th>
                        <th className="top-table-header" style={{ backgroundColor: "#ED722F" }}>Rollups</th>
                        <th colSpan={2} className="top-table-header" style={{ backgroundColor: "#B25271" }}>Needed</th>
                        <th colSpan={2} className="top-table-header" style={{ backgroundColor: "#00548cc3" }}>Bonus</th>
                    </tr>
                    <tr>
                        <th className="top-table-header" style={{ backgroundColor: "#319b43bb" }}>100%</th>
                        <th className="top-table-header" style={{ backgroundColor: "#319b43bb" }}>125%</th>
                        <th className="top-table-header" style={{ backgroundColor: "#319b43bb" }}>{getFormattedDate(lastMonthDate)}</th>
                        <th className="top-table-header" style={{ backgroundColor: "#319b43bb" }}>{getFormattedDate(thisMonthDate)}</th>
                        <th className="top-table-header" style={{ backgroundColor: "#319b43bb" }}>Total</th>
                        <th className="top-table-header" style={{ backgroundColor: "#319b43bb" }}>100%</th>
                        <th className="top-table-header" style={{ backgroundColor: "#319b43bb" }}>125%</th>
                        <th className="top-table-header" style={{ backgroundColor: "#319b43bb" }}>Bonus</th>
                        <th className="top-table-header" style={{ backgroundColor: "#319b43bb" }}>VIP</th>
                    </tr>
                </thead>
                <tbody>
                <tr>
                    <td className="table-input-like">{objectives[selectedMga]}</td>
                    <td className="table-input-like">{objectives[selectedMga] + 5}</td>
                    <td className={`table-input-like ${expandedRow.lastMonth ? 'expanded-cell' : 'expandable-cell'}`}
    onClick={() => handleRowClick('lastMonth')}>
    {lastMonthData}
</td>
<td className={`table-input-like ${expandedRow.thisMonth ? 'expanded-cell' : 'expandable-cell'}`}
    onClick={() => handleRowClick('thisMonth')}>
    {thisMonthData}
</td>
                    <td className="table-input-like">{rollupsTotal}</td>
                    <td className="table-input-like">{remaining}</td>
                    <td className="table-input-like">{remaining + 5}</td>
                    <td className="table-input-like">{bonusPercentage}%</td>
                    <td className="table-input-like">{vipStatus}</td>
                </tr>
                {(expandedRow.lastMonth || expandedRow.thisMonth) && (
        <tr>
            <td colSpan={2}></td>
            {/* If Last Month is expanded, show its details */}
            {expandedRow.lastMonth ? (
                <td className="expanded-detail">
                    Codes: {lastMonthCodes}<br/>
                    VIP: {lastMonthVips}
                </td>
            ) : (
                <td></td> // Empty cell if not expanded
            )}

            {/* If This Month is expanded, show its details */}
            {expandedRow.thisMonth ? (
                <td className="expanded-detail">
                    Codes: {thisMonthCodes}<br/>
                    VIP: {thisMonthVips}
                </td>
            ) : (
                <td></td> // Empty cell if not expanded
            )}

            {/* Add empty cells to fill the remaining columns */}
            <td colSpan={6}></td>
        </tr>
    )}
</tbody>
            </table>

            <h2>
            <strong style={{ color: "grey", fontWeight: "normal" }}>{getThisMonthAndYear().month}</strong> 
            <span style={{ color: "black" }}>{getThisMonthAndYear().year}</span>
        </h2>
<table className="maxbonus-table">
<thead>
                    <tr>
                        <th colSpan={2} className="top-table-header" style={{ backgroundColor: "#00548c" }}>Objective</th>
                        <th colSpan={2} className="top-table-header" style={{ backgroundColor: "#ED722F" }}>60 Day Window</th>
                        <th className="top-table-header" style={{ backgroundColor: "#ED722F" }}>Rollups</th>
                        <th colSpan={2} className="top-table-header" style={{ backgroundColor: "#B25271" }}>Needed</th>
                        <th colSpan={2} className="top-table-header" style={{ backgroundColor: "#00548cc3" }}>Bonus</th>
                    </tr>
                    <tr>
                        <th className="top-table-header" style={{ backgroundColor: "#319b43bb" }}>100%</th>
                        <th className="top-table-header" style={{ backgroundColor: "#319b43bb" }}>125%</th>
                        <th className="top-table-header" style={{ backgroundColor: "#319b43bb" }}>{getFormattedDate(twoMonthsAgoDate)}</th>
                        <th className="top-table-header" style={{ backgroundColor: "#319b43bb" }}>{getFormattedDate(lastMonthDate)}</th>
                        <th className="top-table-header" style={{ backgroundColor: "#319b43bb" }}>Total</th>
                        <th className="top-table-header" style={{ backgroundColor: "#319b43bb" }}>100%</th>
                        <th className="top-table-header" style={{ backgroundColor: "#319b43bb" }}>125%</th>
                        <th className="top-table-header" style={{ backgroundColor: "#319b43bb" }}>Bonus</th>
                        <th className="top-table-header" style={{ backgroundColor: "#319b43bb" }}>VIP</th>
                    </tr>
                </thead>
    <tbody>
        <tr>
            {/* Data cells, replace these with your state variables for the shifted timeframe */}
            <td className="table-input-like">{objectives[selectedMga]}</td>
            <td className="table-input-like">{objectives[selectedMga] + 5}</td>
            <td className="table-input-like">{twoMonthsAgoData.codes + twoMonthsAgoData.vips}</td>
            <td className={`table-input-like`}>{lastMonthData}</td>            
            <td className="table-input-like">{rollupsTotalShifted}</td>
            <td className="table-input-like">{remainingShifted}</td>
<td className="table-input-like">{remainingShifted + 5}</td>
<td className="table-input-like">{bonusPercentageShifted}%</td>
<td className="table-input-like">{vipStatusShifted}</td>

        </tr>
        {/* Expanded row details for two months ago and last month */}
        {/* ... */}
    </tbody>
</table>

        </div>
    );
};

export default MaxBonus;
