// AgencyHealthCard.js
import React from 'react';

function AgencyHealthCard({ title, text, additionalText }) {
    return (
        <div className="card mb-4">
            <div className="card-body">
                <h5 className="card-title">{title}</h5>
                <p className="card-text">{text}</p>
                {additionalText && <p className="card-text">{additionalText}</p>}
            </div>
        </div>
    );
}

export default AgencyHealthCard;
