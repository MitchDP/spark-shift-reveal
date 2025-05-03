
import React from "react";

const PrintStyles = () => {
  return (
    <style jsx global>{`
      @media print {
        body * {
          visibility: hidden;
        }
        .print-container, .print-container * {
          visibility: visible;
        }
        .print-hide {
          display: none !important;
        }
        .print-container {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        
        /* Calendar specific print styles */
        .card-calendar {
          box-shadow: none !important;
          border: none !important;
        }
        .calendar-day {
          min-height: 120px !important;
          height: auto !important;
        }
        .day-content {
          max-height: none !important;
        }
      }
    `}</style>
  );
};

export default PrintStyles;
