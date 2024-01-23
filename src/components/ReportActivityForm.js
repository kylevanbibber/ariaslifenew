import React, { useState, useEffect } from 'react';
import '../ReportActivityForm.css';

function ReportActivityForm() {
    // State variables for form fields
    const currentDate = new Date().toLocaleDateString('en-CA'); // Format YYYY-MM-DD
    const [reportDate, setReportDate] = useState(currentDate);
    
    const [mga, setMga] = useState('');
    const [agent, setAgent] = useState('');
    const [mgas, setMgas] = useState([]);
    const agents = ['Agent 1', 'Agent 2', 'Agent 3'];

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
    const fetchData = async () => {
        const sheetId = '1OIHKR6KyA5gLrNSTQVff6_g1DMzsjppQxTAgfJvh7Ks';
        const range = 'MGA/RGA!A:A'; // Assuming MGA names are in column A
        const apiKey = 'AIzaSyAUQ8D5K1kc2CBTEd0RM3WUOhcI5OJGydg';
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.values;
    };

    useEffect(() => {
        fetchData().then(rawData => {
            // Assuming each row in rawData is an array with the first element being the MGA name
            const fetchedMgas = rawData.map(row => row[0]);
            setMgas(fetchedMgas);
        }).catch(error => {
            console.error('Error fetching MGA data:', error);
        });
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        // Form submission logic
        const formData = {
            agent, reportDate,
            hardCardDetails: { hardCardAppts, hardCardSits, hardCardSales, hardCardAlp },
            posDetails: { posAppts, posSits, posSales, posAlp },
            referralDetails: { referralAppts, referralSits, referralSales, referralAlp },
            vendorDetails: { vendorAppts, vendorSits, vendorSales, vendorAlp }
        };
        console.log(formData);
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>



{/* Agent and MGA Dropdowns */}
<div className="dropdown-group">
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
                                <div className="input-row">
                                <div className="section-header">Hard Card</div>
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
                                <div className="input-row">
                                <div className="section-header">POS</div>
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
                                <div className="input-row">
                                <div className="section-header">Referral</div>
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
                                <div className="input-row">
                                <div className="section-header">Vendor</div>
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
            <th>Calls</th>
            <th>Appts</th>
            <th>Sits</th>
            <th>Sales</th>
            <th>ALP</th>
            <th>Refs</th>
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
        </div>
    );
};

export default ReportActivityForm;
