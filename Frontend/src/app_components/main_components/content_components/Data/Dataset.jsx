import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { sensor_db } from "../../../../../firebase_database/firebase";
import getGrowthStage from "../Dashboard/dashboard_components/getGrowthStage";

// Setting of standard growth duration of hydroponic plant in days
const GROWTH_DURATION_DAYS = 30;

// Calculate day number from the latest reset date
const calculateDayNumber = (timestamp, resetDates) => {
  const sortedResets = [...resetDates].sort((a, b) => a - b);

  for (let i = sortedResets.length - 1; i >= 0; i--) {
    if (timestamp >= sortedResets[i]) {
      return Math.floor((timestamp - sortedResets[i]) / (1000 * 60 * 60 * 24)) + 1;
    }
  }

  return 1;
};

const SensorTable = () => {
  // State to store sensor readings
  const [sensorData, setSensorData] = useState([]);
  const [startDate, setStartDate] = useState(null);

  const [resetDates, setResetDates] = useState([]); // ❌ missing
  const [newResetInput, setNewResetInput] = useState(""); // ❌ missing


  // State to toggle sort (false = newest first)
  const [sortAsc, setSortAsc] = useState(false); 

  // Function that retrieved reads real-time data of sensor readings
  useEffect(() => {
    document.title = "Dataset | Verde";     // Changing the name of the tab
    
    const sensorRef = ref(sensor_db, 'finaL-predictions'); // change it back to predictions_3
    
    const unsubscribe = onValue(sensorRef, (snapshot) => {
      if (snapshot.exists()) {
        const rawData = snapshot.val();
        // Convert Firebase object into an array with timestamp objects
        const parsedData = Object.entries(rawData).map(([id, entry]) => ({
          id,
          ...entry,
          timestampObj: new Date(entry.timestamp)
        }));

        // Sort the array by timestamp (based on sort direction)
        const sortedData = parsedData.sort((a, b) =>
          sortAsc
            ? a.timestampObj - b.timestampObj
            : b.timestampObj - a.timestampObj
        );

        // Automatically set the startDate if not already set
        if (!localStorage.getItem('plantStartDate') && sortedData.length > 0) {
          const firstTimestamp = new Date(sortedData[sortedData.length - 1].timestamp); // oldest entry
          localStorage.setItem('plantStartDate', firstTimestamp.toISOString());
          setStartDate(firstTimestamp);
        } else if (!startDate) {
          setStartDate(new Date(localStorage.getItem('plantStartDate')));
        }

        setSensorData(sortedData);
      } else {
        setSensorData([]);
      }
    });

    // CLeanup
    return () => unsubscribe();
  }, [sortAsc]); // sort direction is a dependency

const handleAddResetDate = () => {
    const parsedDate = new Date(newResetInput);
    if (!isNaN(parsedDate)) {
      const updatedResets = [...resetDates, parsedDate].sort((a, b) => a - b);
      setResetDates(updatedResets);
      localStorage.setItem(
        'plantResetDates',
        JSON.stringify(updatedResets.map(d => d.toISOString()))
      );
      setNewResetInput("");
    } else {
      alert("Invalid date");
    }
  };

  // Clear all reset dates
  const handleClearResetDates = () => {
    setResetDates([]);
    localStorage.removeItem('plantResetDates');
  };

  // Toggle the sorting order of the table  
  const toggleSort = () => setSortAsc((prev) => !prev);

  return (
    // Whole Dataset Container
<div className="w-full h-[90%] p-6 bg-emerald-200 mt-15 rounded-[30px]">
      {/* Header with reset date controls */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Sensor Readings Table</h2>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={newResetInput}
            onChange={(e) => setNewResetInput(e.target.value)}
            className="px-2 py-1 rounded-lg border border-gray-400"
          />
          <button
            onClick={handleAddResetDate}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-[30px] shadow"
          >
            Add Reset Date
          </button>
          <button
            onClick={handleClearResetDates}
            className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-[30px] shadow"
          >
            Clear All Resets
          </button>
        </div>
      </div>

      {/* Reset date preview */}
      {resetDates.length > 0 && (
        <div className="mb-4 text-sm text-gray-700">
          <strong>Reset Dates:</strong>{" "}
          {resetDates.map(d => d.toISOString().split("T")[0]).join(", ")}
        </div>
      )}

      {/* Scrollable table container */}
      <div className="relative overflow-scroll max-h-[90%] rounded-xl shadow bg-white scrollbar-hide">
        <table className="min-w-full table-fixed">
          <thead className="bg-gray-200 sticky top-0 z-10">
            <tr>
              {/* Sortable timestamp column */}
              <th
                className="text-left py-2 px-4 w-[200px] cursor-pointer select-none hover:bg-gray-300 transition"
                onClick={toggleSort}
                title="Click to sort by timestamp"
              >
                Timestamp {sortAsc ? "▲" : "▼"}
              </th>
              {/* Other sensor columns */}
              <th className="text-left py-2 px-4 w-[160px]">Temperature (°C)</th>
              <th className="text-left py-2 px-4 w-[140px]">Humidity (%)</th>
              <th className="text-left py-2 px-4 w-[100px]">pH</th>
              <th className="text-left py-2 px-4 w-[140px]">TDS (ppm)</th>
              <th className="text-left py-2 px-4 w-[100px]">Day #</th>
              <th className="text-left py-2 px-4 w-[140px]">Current Growth Stage</th>
              <th className="text-left py-2 px-4 w-[200px]">Predicted Maturity (Days)</th>
              <th className="text-left py-2 px-4 w-[140px]">Predicted Growth Stage</th>
            </tr>
          </thead>
          <tbody>
            {/* Render each row of sensor data */}
            {sensorData.map((entry) => {
              const dayNum = calculateDayNumber(entry.timestampObj, resetDates);
              return (
                <tr key={entry.id} className="border-t">
                  <td className="py-2 px-4">{entry.timestamp}</td>
                  <td className="py-2 px-4">{entry.temperature}</td>
                  <td className="py-2 px-4">{entry.humidity}</td>
                  <td className="py-2 px-4">{entry.ph}</td>
                  <td className="py-2 px-4">{entry.tds}</td>
                  <td className="py-2 px-4">{dayNum >= 0 ? dayNum : 1}</td>
                  <td className="py-2 px-4">{getGrowthStage(dayNum)}</td>
                  <td className="py-2 px-4">{entry.predicted_days}</td>{/**Apply the prediction here */}
                  <td className="py-2 px-4">{getGrowthStage(entry.predicted_days)}</td> 
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SensorTable;