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


function Dashboard() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    // Initialize the dateRange state with yesterday's date
    const [dateRange, setDateRange] = useState([
        {
            startDate: yesterday,
            endDate: yesterday,
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
