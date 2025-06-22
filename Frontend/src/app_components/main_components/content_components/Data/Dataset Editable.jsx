import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { sensor_db } from "../../../../../firebase_database/firebase";
import getGrowthStage from "../Dashboard/dashboard_components/getGrowthStage";

const SensorTable = () => {
  const [sensorData, setSensorData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [adjustDate, setAdjustDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [targetDayNumber, setTargetDayNumber] = useState(1);
  const [phaseResetDate, setPhaseResetDate] = useState(null); // ✅ Initially null
  const [sortAsc, setSortAsc] = useState(false);

  // Fetch data from Firebase
  useEffect(() => {
    document.title = "Dataset | Verde";

    const sensorRef = ref(sensor_db, 'predictions'); // using Manual logging

    const unsubscribe = onValue(sensorRef, (snapshot) => {
      if (snapshot.exists()) {
        const rawData = snapshot.val();
        const parsedData = Object.entries(rawData).map(([id, entry]) => ({
          id,
          ...entry,
          timestampObj: new Date(entry.timestamp)
        }));

        const sortedData = parsedData.sort((a, b) =>
          sortAsc ? a.timestampObj - b.timestampObj : b.timestampObj - a.timestampObj
        );

        if (!localStorage.getItem('plantStartDate') && sortedData.length > 0) {
          const firstTimestamp = new Date(sortedData[sortedData.length - 1].timestamp);
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

    return () => unsubscribe();
  }, [sortAsc]);

  // Toggle sort
  const toggleSort = () => setSortAsc((prev) => !prev);

  // Adjust growth start based on a known date = day #
  const handleAdjustStartDate = () => {
    const selected = new Date(adjustDate);
    const newStart = new Date(selected);
    newStart.setDate(selected.getDate() - (targetDayNumber - 1));
    localStorage.setItem('plantStartDate', newStart.toISOString());
    setStartDate(newStart);
  };

  const handleClearResetDate = () => setPhaseResetDate(null);

  return (
    <div className="w-full h-[90%] p-6 bg-emerald-200 mt-15 rounded-[30px]">
      {/* Controls */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Sensor Readings Table</h2>
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
          {/* Manual date = day # */}
          <div className="flex gap-2 items-center">
            <label className="text-sm font-medium">Date:</label>
            <input
              type="date"
              className="border border-gray-300 rounded px-2 py-1"
              value={adjustDate}
              onChange={(e) => setAdjustDate(e.target.value)}
            />
            <label className="text-sm font-medium">= Day</label>
            <input
              type="number"
              min={1}
              className="border border-gray-300 rounded px-2 py-1 w-[80px]"
              value={targetDayNumber}
              onChange={(e) => setTargetDayNumber(parseInt(e.target.value))}
            />
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-[30px] shadow"
              onClick={handleAdjustStartDate}
            >
              Adjust Growth Start
            </button>
          </div>

          {/* Reset phase date */}
          <div className="flex gap-2 items-center">
            <input
              type="date"
              className="border border-gray-300 rounded px-2 py-1"
              value={phaseResetDate ? phaseResetDate.toISOString().split("T")[0] : ""}
              onChange={(e) => {
                const val = e.target.value;
                setPhaseResetDate(val ? new Date(val) : null);
              }}
            />
            <button
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-[30px] shadow"
              onClick={handleClearResetDate}
            >
              Clear Reset Date
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="relative overflow-scroll max-h-[90%] rounded-xl shadow bg-white scrollbar-hide">
        <table className="min-w-full table-fixed">
          <thead className="bg-gray-200 sticky top-0 z-10">
            <tr>
              <th
                className="text-left py-2 px-4 w-[200px] cursor-pointer select-none hover:bg-gray-300 transition"
                onClick={toggleSort}
                title="Click to sort by timestamp"
              >
                Timestamp {sortAsc ? "▲" : "▼"}
              </th>
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
            {sensorData.map((entry) => {
              let dayNum = 1;

              if (startDate) {
                const adjustedCutoff = new Date(adjustDate);
                adjustedCutoff.setHours(0, 0, 0, 0); // Reset time to 00:00:00

                const timestamp = entry.timestampObj;

                if (timestamp < adjustedCutoff) {
                  // Before adjusted date → count from original startDate
                  dayNum = Math.floor((timestamp - startDate) / (1000 * 60 * 60 * 24)) + 1;
                } else {
                  // On or after adjusted date → restart at Day 1
                  dayNum = Math.floor((timestamp - adjustedCutoff) / (1000 * 60 * 60 * 24)) + 1;
                }
              }

              return (
                <tr key={entry.id} className="border-t">
                  <td className="py-2 px-4">{entry.timestamp}</td>
                  <td className="py-2 px-4">{entry.temperature}</td>
                  <td className="py-2 px-4">{entry.humidity}</td>
                  <td className="py-2 px-4">{entry.ph}</td>
                  <td className="py-2 px-4">{entry.tds}</td>
                  <td className="py-2 px-4">{dayNum}</td>
                  <td className="py-2 px-4">{getGrowthStage(dayNum)}</td>
                  <td className="py-2 px-4">{entry.predicted_days}</td>
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
