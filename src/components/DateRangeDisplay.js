import React from 'react';

const getWeekNumber = (date) => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000)) + ((startOfYear.getDay() + 6) % 7);
    return Math.ceil(days / 7);
};

const isSameMonthAndYear = (date1, date2) => {
    return date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
};

const isLastWeek = (startDate, endDate, today) => {
    const startWeek = getWeekNumber(startDate);
    const currentWeek = getWeekNumber(today);
    return startWeek === currentWeek - 1 && isSameMonthAndYear(startDate, endDate);
};

const isThisWeek = (startDate, endDate, today) => {
    const startWeek = getWeekNumber(startDate);
    const currentWeek = getWeekNumber(today);
    return startWeek === currentWeek && isSameMonthAndYear(startDate, endDate);
};

const DateRangeDisplay = ({ startDate, endDate }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let displayText;

    if (startDate.toDateString() === today.toDateString() && endDate.toDateString() === today.toDateString()) {
        displayText = 'Today';
    } else if (startDate.toDateString() === yesterday.toDateString() && endDate.toDateString() === yesterday.toDateString()) {
        displayText = 'Yesterday';
    } else if (isThisWeek(startDate, endDate, today)) {
        displayText = 'This Week';
    } else if (isLastWeek(startDate, endDate, today)) {
        displayText = 'Last Week';
    } else if (isSameMonthAndYear(startDate, today) && isSameMonthAndYear(endDate, today)) {
        displayText = 'This Month';
    } else if (isSameMonthAndYear(startDate, new Date(today.getFullYear(), today.getMonth() - 1)) && 
               isSameMonthAndYear(endDate, new Date(today.getFullYear(), today.getMonth() - 1))) {
        displayText = 'Last Month';
    } else {
        displayText = `${startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
    }
    const words = displayText.split(' ');
    const firstWord = words.shift(); // Get the first word
    const restOfText = words.join(' '); // Get the rest of the text
    return (
        <div className="date-range-display">
            <span>{firstWord}</span> <span>{restOfText}</span>
        </div>
    );
};

export default DateRangeDisplay;
