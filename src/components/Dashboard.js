import React, { useState, useEffect } from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import ActivityCards from './ActivityCard';
import '../Dashboard.css';
import DateRangeDisplay from './DateRangeDisplay'; // Import the new component
import StatisticsCards from './StatisticsCards';
import Modal from './Modal';
import ReportActivityForm from './ReportActivityForm';
import MaxBonus from './MaxBonus';
import { TickerInput } from './Ticker';
function Dashboard() {
    const currentDateTime = new Date();
    const currentHour = currentDateTime.getHours();

    // Determine if the current time is before 7 PM (19:00 hours in 24-hour format)
    const isBefore7PM = currentHour < 19;

    // Set initial date to yesterday if before 7 PM, otherwise set it to today
    const initialDate = new Date();
    if (isBefore7PM) {
        initialDate.setDate(initialDate.getDate() - 1);
    }

    const [dateRange, setDateRange] = useState([
        {
            startDate: initialDate,
            endDate: initialDate,
            key: 'selection',
        },
    ]);

    const [isPickerVisible, setIsPickerVisible] = useState(false);

    const handleSelect = ranges => {
        setDateRange([ranges.selection]);
    };

    const togglePicker = () => {
        setIsPickerVisible(!isPickerVisible);
    };
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reportFormData, setReportFormData] = useState(() => {
        // Load saved data from local storage or initialize with default values
        const savedData = localStorage.getItem('reportFormData');
        return savedData ? JSON.parse(savedData) : {};
    });
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);
    useEffect(() => {
        localStorage.setItem('reportFormData', JSON.stringify(reportFormData));
    }, [reportFormData]);
    
    return (
        <div className="container">

            <div className="buttons-container">
            <button onClick={handleOpenModal} className="dashboard-button">Report Activity</button>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <ReportActivityForm formData={reportFormData} setFormData={setReportFormData} />
            </Modal>
                            <a href="http://ariaslife.com/agent_tools/index.html" className="dashboard-button main-button" target="_blank" rel="noopener noreferrer">
                Presentation Launcher
                </a>                
                <a href="https://ariaslife.com/verify" className="dashboard-button" target="_blank" rel="noopener noreferrer">
                Verification Survey
                </a>
            </div>
<MaxBonus />
            <div className="date-picker-group">
    <DateRangeDisplay
        startDate={dateRange[0].startDate}
        endDate={dateRange[0].endDate}
    />
    <button onClick={togglePicker} className="calendar-button">
        <i className="fas fa-calendar-alt"></i>
        <span>{dateRange[0].startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        <span> - </span>
        <span>{dateRange[0].endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
    </button>
    {isPickerVisible && (
        <div className="date-picker-overlay">
            <DateRangePicker
                ranges={dateRange}
                onChange={handleSelect}
            />
        </div>
    )}
</div>
            <ActivityCards dateRange={dateRange} />
            <StatisticsCards dateRange={dateRange} />
        </div>
    );
}

export default Dashboard;
