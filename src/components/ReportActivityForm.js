import React, { useState, useEffect } from 'react';
import '../ReportActivityForm.css';

function ReportActivityForm() {
    // State variables for form fields
    const currentDate = new Date().toLocaleDateString('en-CA'); // Format YYYY-MM-DD
    const [reportDate, setReportDate] = useState(currentDate);
    

    const [mgas, setMgas] = useState([]);
    const [agents, setAgents] = useState([]); // Initialize with an empty array
    const [mga, setMga] = useState(localStorage.getItem('selectedMGA') || '');
    const [agent, setAgent] = useState(localStorage.getItem('selectedAgent') || '');
    const [rga, setRga] = useState('');
    const [legacy, setLegacy] = useState('');
    const [tree, setTree] = useState('');
    const [didWork, setDidWork] = useState('yes'); // Default to 'yes'

    // State variables for Hard Card details
    const [hardCardAppts, setHardCardAppts] = useState(0);
    const [hardCardSits, setHardCardSits] = useState(0);
    const [hardCardSales, setHardCardSales] = useState(0);
    const [hardCardAlp, setHardCardAlp] = useState(0);

    // State variables for POS details
    const [posAppts, setPosAppts] = useState(0);
    const [posSits, setPosSits] = useState(0);
    const [posSales, setPosSales] = useState(0);
    const [posAlp, setPosAlp] = useState(0);

    // State variables for Referral details
    const [referralAppts, setReferralAppts] = useState(0);
    const [referralSits, setReferralSits] = useState(0);
    const [referralSales, setReferralSales] = useState(0);
    const [referralAlp, setReferralAlp] = useState(0);

    // State variables for Vendor details
    const [vendorAppts, setVendorAppts] = useState(0);
    const [vendorSits, setVendorSits] = useState(0);
    const [vendorSales, setVendorSales] = useState(0);
    const [vendorAlp, setVendorAlp] = useState(0);


    const [totalCalls, setTotalCalls] = useState(0);
    const [totalAppts, setTotalAppts] = useState(0);
    const [totalSits, setTotalSits] = useState(0);
    const [totalSales, setTotalSales] = useState(0);
    const [totalAlp, setTotalAlp] = useState(0);
    const [totalRefs, setTotalRefs] = useState(0);

    useEffect(() => {
        if (didWork === 'no') {
            // Reset all totals to 0 if 'No' is selected
            setTotalCalls(0);
            setTotalAppts(0);
            setTotalSits(0);
            setTotalSales(0);
            setTotalAlp(0);
            setTotalRefs(0);
        } else {
            // Calculate totals normally if 'Yes' is selected
            const apptsTotal = Number(hardCardAppts) + Number(posAppts) + Number(referralAppts) + Number(vendorAppts);
            const sitsTotal = Number(hardCardSits) + Number(posSits) + Number(referralSits) + Number(vendorSits);
            const salesTotal = Number(hardCardSales) + Number(posSales) + Number(referralSales) + Number(vendorSales);
            const alpTotal = Number(hardCardAlp) + Number(posAlp) + Number(referralAlp) + Number(vendorAlp);

            setTotalAppts(apptsTotal);
            setTotalSits(sitsTotal);
            setTotalSales(salesTotal);
            setTotalAlp(alpTotal);
        }
    }, [
        didWork,
        hardCardAppts, hardCardSits, hardCardSales, hardCardAlp,
        posAppts, posSits, posSales, posAlp,
        referralAppts, referralSits, referralSales, referralAlp,
        vendorAppts, vendorSits, vendorSales, vendorAlp
    ]);

    const handleDidWorkChange = (value) => {
        setDidWork(value);
        if (value === 'yes') {
            // Focus on the first checkbox
        }
    };
    const mgaSheetId = '1OIHKR6KyA5gLrNSTQVff6_g1DMzsjppQxTAgfJvh7Ks'; // Declare it in the global scope

    const fetchData = async (sheetId, range) => {
        const apiKey = 'AIzaSyAUQ8D5K1kc2CBTEd0RM3WUOhcI5OJGydg';
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    };
    const sheetIdMapping = {
        'Adams': '1fxXePNEiavzMtjqf-Jm5NiY2ZfbtzlYv5-JCsno5diA',
        'Agency': '1W3NRrXyPD9j6jhtApGeckJ78yFN6jN7XNApCJwyAzHM',
        'Evanson': '17BTz3XlktDr47kJgvMMfl4C91ClVI23GRry9s4L2Yg8',
        // Add more mappings as needed
    };
    
    const fetchAgentsForSelectedMGA = async (selectedMGA) => {
        console.log("Selected MGA:", selectedMGA);
    
        if (selectedMGA) {
            // Fetch the entire MGA/RGA range
            const response = await fetchData(mgaSheetId, 'MGA/RGA!A:D');
            const selectedMgaRow = response.values.find(row => row[0] === selectedMGA);
    
            if (selectedMgaRow) {
                // Set the RGA, Legacy, and Tree values
                setRga(selectedMgaRow[1] || ''); // Column B
                setLegacy(selectedMgaRow[2] || ''); // Column C
                setTree(selectedMgaRow[3] || ''); // Column D
    
                // Fetch agents based on the MGA's sheet indicator in Column D
                const agentSheetId = sheetIdMapping[selectedMgaRow[3]];
                if (agentSheetId) {
                    const agentRange = 'ActiveAgentsEmails!B:D';
                    try {
                        const response = await fetchData(agentSheetId, agentRange);
                        console.log("Agent data response:", response);
    
                        if (response && response.values && response.values.length > 0) {
                            const uniqueAgentNames = new Set();
                            const agentData = response.values
                                .slice(1) // Skip the first row (header)
                                .filter(row => {
                                    const agentName = row[0];
                                    if (!uniqueAgentNames.has(agentName)) {
                                        uniqueAgentNames.add(agentName);
                                        return true;
                                    }
                                    return false;
                                })
                                .sort((a, b) => a[0].localeCompare(b[0])); // Sort alphabetically
    
                            const formattedAgentNames = agentData.map(row => `${row[0]} - ${row[2]}`);
                            console.log("Formatted agent names:", formattedAgentNames);
                            setAgents(formattedAgentNames);
                        }
                    } catch (error) {
                        console.error('Error fetching agents:', error);
                    }
                }
            }
        }
    };
    
    
    useEffect(() => {
        console.log("MGA changed to:", mga);
        if (mga) {
            fetchAgentsForSelectedMGA(mga);
        }
    }, [mga, mgas]);
    // Effect to update local storage when MGA or Agent changes
    useEffect(() => {
        localStorage.setItem('selectedMGA', mga);
        localStorage.setItem('selectedAgent', agent);
    }, [mga, agent]);
    useEffect(() => {
        console.log('Fetching MGA data...');
        const mgaSheetId = '1OIHKR6KyA5gLrNSTQVff6_g1DMzsjppQxTAgfJvh7Ks';
        const mgaRange = 'MGA/RGA!A:D'; // Only fetch column A
        fetchData(mgaSheetId, mgaRange).then(data => {
            console.log('MGA data:', data.values);
            setMgas(data.values.map(row => row[0])); // Store only MGA names
        }).catch(error => {
            console.error('Error fetching MGA data:', error);
        });
    }, []);

const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    // Gather all form data
    const formData = {
        mga,
        agent: agent,
        reportDate,
        rga,
        legacy,
        tree,
        hardCardDetails: {
            appts: hardCardAppts,
            sits: hardCardSits,
            sales: hardCardSales,
            alp: hardCardAlp
        },
        posDetails: {
            appts: posAppts,
            sits: posSits,
            sales: posSales,
            alp: posAlp
        },
        referralDetails: {
            appts: referralAppts,
            sits: referralSits,
            sales: referralSales,
            alp: referralAlp
        },
        vendorDetails: {
            appts: vendorAppts,
            sits: vendorSits,
            sales: vendorSales,
            alp: vendorAlp
        },
        totals: {
            calls: totalCalls,
            appts: totalAppts,
            sits: totalSits,
            sales: totalSales,
            alp: totalAlp,
            refs: totalRefs
        }
    };

    // Determine the App Script URL based on the MGA (if needed)
    // const appScriptUrl = getAppScriptUrl(mga); // Implement this function based on your logic

    // Example App Script URL (replace with your actual URL)
    const appScriptUrl = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

    // Send data to Google App Script
    try {
        const response = await fetch(appScriptUrl, {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();
        console.log('Form submitted successfully', result);
        // Handle success (e.g., showing a success message)
    } catch (error) {
        console.error('Error submitting form', error);
        // Handle error (e.g., showing an error message)
    }
};


    return (
        <div className="form-container">
            <form 
                action="https://script.google.com/macros/s/AKfycbzbePjEbK9v73P5XOHyFLyDalDWXJve11_zLvaA-t1kyfsRVmgesyqhWSIaAFuC9RN1/exec" // Replace with your Web App URL
                method="POST"
                target="hidden_iframe" // Optional: If you want to handle the response in an iframe
                onSubmit={handleSubmit}
            >


{/* Agent and MGA Dropdowns */}
<div className="dropdown-group">
        {/* MGA Dropdown */}
        <div className="dropdown-field-group">
        <label htmlFor="mga">MGA:</label>
        <select
            id="mga"
            value={mga}
            onChange={(e) => setMga(e.target.value)}
            className="input-field"
        >
            {mgas.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
    </div>
    {/* Agent Dropdown */}
    <div className="dropdown-field-group">
        <label htmlFor="agent">Agent:</label>
        <select
            id="agent"
            value={agent}
            onChange={(e) => setAgent(e.target.value)}
            className="input-field"
        >
            {agents.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
    </div>


</div>
{/* Report Date Input */}
<div className="dropdown-field-group">
    <label htmlFor="reportDate">Report Date:</label>
    <input
        type="date"
        id="reportDate"
        value={reportDate}
        onChange={(e) => setReportDate(e.target.value)}
        max={currentDate} // Set the max attribute to the current date
        className="input-field"
    />
</div>
{/* Did You Work Today? Radio Buttons */}
<div className="input-field-group">
<label>
        Did you have activity on {new Date(reportDate + 'T00:00').toLocaleDateString('en-US', {
            month: '2-digit', 
            day: '2-digit', 
            year: 'numeric'
        })}?
    </label>
    <div className="radio-buttons">
        <input
            type="radio"
            id="workYes"
            name="didWork"
            value="yes"
            checked={didWork === 'yes'}
            onChange={() => handleDidWorkChange('yes')}
        />
        <label htmlFor="workYes">Yes</label>
        <input
            type="radio"
            id="workNo"
            name="didWork"
            value="no"
            checked={didWork === 'no'}
            onChange={() => setDidWork('no')}
        />
        <label htmlFor="workNo">No</label>
    </div>
</div>
<div>
                    <input type="hidden" id="rga" name="rga" value={rga} />
                    <input type="hidden" id="legacy" name="legacy" value={legacy} />
                    <input type="hidden" id="tree" name="tree" value={tree} />
                </div>
                {didWork === 'yes' && (
                    <div>
                        
<div className="section">
                {/* Common Labels */}
                <div className="label-row">
                    <div className="empty-header"></div> {/* Placeholder for alignment */}
                    <label className="common-label">Appts</label>
                    <label className="common-label">Sits</label>
                    <label className="common-label">Sales</label>
                    <label className="common-label">ALP</label>
                </div>
                        {/* Hard Card Section */}
                            <div>
                                <div className="input-row" style={{ backgroundColor: "#00548c", paddingRight: "3px", marginBottom: "5px"}}>
                                <div className="section-header" style={{ color: "white"}}>Hard Card</div>
                                    <div className="input-field-group">
                                        <label htmlFor="hardCardAppts"></label>
                                        <input
                                            type="number"
                                            id="hardCardAppts"
                                            value={hardCardAppts}
                                            onChange={(e) => setHardCardAppts(e.target.value)}
                                            className="input-field"
                                            onFocus={(e) => e.target.select()}
                                        />
                                    </div>
                                    <div className="input-field-group">
                                        <label htmlFor="hardCardSits"></label>
                                        <input
                                            type="number"
                                            id="hardCardSits"
                                            value={hardCardSits}
                                            onChange={(e) => setHardCardSits(e.target.value)}
                                            className="input-field"
                                            onFocus={(e) => e.target.select()}

                                        />
                                    </div>
                                    <div className="input-field-group">
                                        <label htmlFor="hardCardSales"></label>
                                        <input
                                            type="number"
                                            id="hardCardSales"
                                            value={hardCardSales}
                                            onChange={(e) => setHardCardSales(e.target.value)}
                                            className="input-field"
                                            onFocus={(e) => e.target.select()}

                                        />
                                    </div>
                                    <div className="input-field-group">
                                        <label htmlFor="hardCardAlp"></label>
                                        <input
                                            type="number"
                                            id="hardCardAlp"
                                            value={hardCardAlp}
                                            onChange={(e) => setHardCardAlp(e.target.value)}
                                            className="input-field"
                                            onFocus={(e) => e.target.select()}

                                        />
                                    </div>
                                </div>
                            </div>
                        

                        {/* POS Section */}
                            <div>
                                <div className="input-row" style={{ backgroundColor: "#ED722F", paddingRight: "3px", marginBottom: "5px"}}>
                                <div className="section-header" style={{ color: "white"}}>POS</div>
                                    <div className="input-field-group">
                                        <label htmlFor="posAppts"></label>
                                        <input
                                            type="number"
                                            id="posAppts"
                                            value={posAppts}
                                            onChange={(e) => setPosAppts(e.target.value)}
                                            className="input-field"
                                            onFocus={(e) => e.target.select()}
                                        />
                                    </div>
                                    <div className="input-field-group">
                                        <label htmlFor="posSits"></label>
                                        <input
                                            type="number"
                                            id="posSits"
                                            value={posSits}
                                            onChange={(e) => setPosSits(e.target.value)}
                                            className="input-field"
                                            onFocus={(e) => e.target.select()}

                                        />
                                    </div>
                                    <div className="input-field-group">
                                        <label htmlFor="posSales"></label>
                                        <input
                                            type="number"
                                            id="posSales"
                                            value={posSales}
                                            onChange={(e) => setPosSales(e.target.value)}
                                            className="input-field"
                                            onFocus={(e) => e.target.select()}

                                        />
                                    </div>
                                    <div className="input-field-group">
                                        <label htmlFor="posAlp"></label>
                                        <input
                                            type="number"
                                            id="posAlp"
                                            value={posAlp}
                                            onChange={(e) => setPosAlp(e.target.value)}
                                            className="input-field"
                                            onFocus={(e) => e.target.select()}

                                        />
                                    </div>
                                </div>
                            </div>
                        

                        {/* Referral Section */}
                            <div>
                                <div className="input-row" style={{ backgroundColor: "#B25271", paddingRight: "3px", marginBottom: "5px"}}>
                                <div className="section-header" style={{ color: "white"}}>Referral</div>
                                    <div className="input-field-group">
                                        <label htmlFor="referralAppts"></label>
                                        <input
                                            type="number"
                                            id="referralAppts"
                                            value={referralAppts}
                                            onChange={(e) => setReferralAppts(e.target.value)}
                                            className="input-field"
                                            onFocus={(e) => e.target.select()}
                                        />
                                    </div>
                                    <div className="input-field-group">
                                        <label htmlFor="referralSits"></label>
                                        <input
                                            type="number"
                                            id="referralSits"
                                            value={referralSits}
                                            onChange={(e) => setReferralSits(e.target.value)}
                                            className="input-field"
                                            onFocus={(e) => e.target.select()}

                                        />
                                    </div>
                                    <div className="input-field-group">
                                        <label htmlFor="referralSales"></label>
                                        <input
                                            type="number"
                                            id="referralSales"
                                            value={referralSales}
                                            onChange={(e) => setReferralSales(e.target.value)}
                                            className="input-field"
                                            onFocus={(e) => e.target.select()}

                                        />
                                    </div>
                                    <div className="input-field-group">
                                        <label htmlFor="referralAlp"></label>
                                        <input
                                            type="number"
                                            id="referralAlp"
                                            value={referralAlp}
                                            onChange={(e) => setReferralAlp(e.target.value)}
                                            className="input-field"
                                            onFocus={(e) => e.target.select()}

                                        />
                                    </div>
                                </div>
                            </div>
                        

                        {/* Vendor Section */}
                            <div>
                                <div className="input-row" style={{ backgroundColor: "#319B42", paddingRight: "3px", marginBottom: "3px"}}>
                                <div className="section-header" style={{ color: "white"}}>Vendor</div>
                                    <div className="input-field-group">
                                        <label htmlFor="vendorAppts"></label>
                                        <input
                                            type="number"
                                            id="vendorAppts"
                                            value={vendorAppts}
                                            onChange={(e) => setVendorAppts(e.target.value)}
                                            className="input-field"
                                            onFocus={(e) => e.target.select()}
                                        />
                                    </div>
                                    <div className="input-field-group">
                                        <label htmlFor="vendorSits"></label>
                                        <input
                                            type="number"
                                            id="vendorSits"
                                            value={vendorSits}
                                            onChange={(e) => setVendorSits(e.target.value)}
                                            className="input-field"
                                            onFocus={(e) => e.target.select()}

                                        />
                                    </div>
                                    <div className="input-field-group">
                                        <label htmlFor="vendorSales"></label>
                                        <input
                                            type="number"
                                            id="vendorSales"
                                            value={vendorSales}
                                            onChange={(e) => setVendorSales(e.target.value)}
                                            className="input-field"
                                            onFocus={(e) => e.target.select()}

                                        />
                                    </div>
                                    <div className="input-field-group">
                                        <label htmlFor="vendorAlp"></label>
                                        <input
                                            type="number"
                                            id="vendorAlp"
                                            value={vendorAlp}
                                            onChange={(e) => setVendorAlp(e.target.value)}
                                            className="input-field"
                                            onFocus={(e) => e.target.select()}

                                        />
                                    </div>
                                </div>
                            </div>
                            </div>
                    </div>
                )}
<table>
    <thead>
        <tr>
            <th className="top-table-header" style={{ backgroundColor: "#00548c" }}>Calls</th>
            <th className="top-table-header" style={{ backgroundColor: "#00548c" }}>Appts</th>
            <th className="top-table-header" style={{ backgroundColor: "#00548c" }}>Sits</th>
            <th className="top-table-header" style={{ backgroundColor: "#00548c" }}>Sales</th>
            <th className="top-table-header" style={{ backgroundColor: "#00548c" }}>ALP</th>
            <th className="top-table-header" style={{ backgroundColor: "#00548c" }}>Refs</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td className="usable-input">
                <input
                    type="number"
                    value={totalCalls}
                    onChange={(e) => setTotalCalls(Number(e.target.value))}
                    disabled={didWork === 'no'}
                    className="input-field" // Apply the input-field class
                    onFocus={(e) => e.target.select()}

                />
            </td>
            <td>
                <input
                    type="number"
                    value={didWork === 'yes' ? totalAppts : 0}
                    disabled
                    className="input-field" // Apply the input-field class
                />
            </td>
            <td>
                <input
                    type="number"
                    value={didWork === 'yes' ? totalSits : 0}
                    disabled
                    className="input-field" // Apply the input-field class
                />
            </td>
            <td>
                <input
                    type="number"
                    value={didWork === 'yes' ? totalSales : 0}
                    disabled
                    className="input-field" // Apply the input-field class
                />
            </td>
            <td>
                <input
                    type="number"
                    value={didWork === 'yes' ? totalAlp : 0}
                    disabled
                    className="input-field" // Apply the input-field class
                />
            </td>
            <td className="usable-input">
                <input
                    type="number"
                    value={totalRefs}
                    onChange={(e) => setTotalRefs(Number(e.target.value))}
                    disabled={didWork === 'no'}
                    className="input-field" // Apply the input-field class
                    onFocus={(e) => e.target.select()}

                />
            </td>
        </tr>
    </tbody>
</table>

                <input type="submit" value="Submit" className="submit-button" />
            </form>
            <iframe name="hidden_iframe" id="hidden_iframe" style={{display: 'none'}}></iframe> {/* Optional iframe for handling responses */}
        </div>
    );
};

export default ReportActivityForm;
