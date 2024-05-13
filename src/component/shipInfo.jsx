import React, { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";
import { fetchCSVData } from "../utils/fetchCSVData";
import { getTime } from "../utils/getTime";
import { Marker } from "react-map-gl";
import { generateTimestamps } from "../utils/generateTimestamps";
import pic from "../assets/cargo-ship.png";

const ShipInfo = () => {
  const [text, setText] = useState("");
  const [data, setData] = useState([]);
  const [shipLoc, setShipLoc] = useState([]);
  const [timestamps, setTimestamps] = useState([]);
  const [index, setIndex] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [isMoving, setIsMoving] = useState(false);

  let minTimestamp;
  let maxTimestamp;

  const fetchData = async () => {
    const res = await fetchCSVData("./geo_stats_data_7_days - geo_stats.csv");
    if (res) setText(res);
    try {
      if (text == "") return;
      Papa.parse(text, {
        header: true,
        complete: (result) => {
          setData(result.data);
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
        },
      });
    } catch (error) {
      console.error("Error fetching CSV file:", error);
    }
  };
  useMemo(() => {
    const processedData = [];
    minTimestamp = getTime(1);
    maxTimestamp = getTime(-1);

    data.forEach((data) => {
      const {
        site_name,
        location_latitude,
        location_longitude,
        heading,
        ec_timestamp,
      } = data;
      if (!processedData[ec_timestamp]) {
        processedData[ec_timestamp] = [];
      }
      if (ec_timestamp < minTimestamp) minTimestamp = ec_timestamp;
      if (ec_timestamp > maxTimestamp) maxTimestamp = ec_timestamp;
      if (location_latitude && location_longitude) {
        processedData[ec_timestamp].push({
          site_name,
          location_latitude,
          location_longitude,
          heading,
        });
      }
    });
    processedData.sort();
    setTimestamps(
      generateTimestamps(new Date(minTimestamp), new Date(maxTimestamp))
    );
    setShipLoc(processedData);
  }, [data]);

  const renderMarkers = (index) => {
    if (shipLoc && timestamps[index]) {
      return shipLoc[timestamps[index]].map((ship) => (
        <Marker
          key={ship.id || Math.random()} // Add a unique key for each marker
          longitude={ship.location_longitude}
          latitude={ship.location_latitude}
          anchor="bottom"
        >
          <div
            style={{
              height: 20,
              width: 20,
            }}
          >
            <img src={pic}></img>
          </div>
        </Marker>
      ));
    } else {
      return null; // Return null to avoid rendering empty content
    }
  };
  const handleClick = () => {
    if (isMoving) {
      clearInterval(intervalId);
      setIsMoving(false);
      return; // Clear existing interval if it exists
    }

    // Start a new interval to increment the index every second
    const id = setInterval(() => {
      setIndex((prevIndex) => (prevIndex < 83 ? prevIndex + 1 : 0));
    }, 1000);
    setIntervalId(id);
    setIsMoving(true);
  };

  useEffect(() => {
    fetchData();
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [text, intervalId]);

  return (
    <>
      {renderMarkers(index)}
      <div className="flex flex-row justify-center absolute w-full  bottom-16">
        <div className="bg-white h-10 w-60 flex flex-col items-center">
          {timestamps[index]}
          <button className=" bg-sky-500 w-full" onClick={handleClick}>
            {isMoving ? "Stop" : "Start"} Tracking
          </button>
        </div>
      </div>
    </>
  );
};

export default ShipInfo;
