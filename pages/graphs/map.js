import React, { useState } from "react";
import Map from "../../components/D3/Map";
import data from "../../utils/Australia.districts.json";

export default function AustraliaMap() {
  const [property, setProperty] = useState("pop_est");
  return (
    <div>
      <header>
        <div className="title">
          <h1>Australian Map</h1>
        </div>
        <div>
          <h2>Category Selection</h2>
          <div>
            <select
              placeholder="State/Territory(ALL)"
              value={property}
              onChange={(event) => setProperty(event.target.value)}
            >
              <option value="pop_est">State/Territory(ALL)</option>
              <option value="name_len">NSW</option>
              <option value="name_len">VIC</option>
            </select>
          </div>
          {/* <div>
            <select
              placeholder="Service District (ALL)"
              value={property}
              onChange={(event) => setProperty(event.target.value)}
            >
              <option value="pop_est">NSW</option>
              <option value="name_len">VIC</option>
            </select>
          </div> */}
        </div>
      </header>
      <Map data={data} property={property} />

      <style jsx>
        {`
          header {
            display: flex;
          }
          .title {
            width: 50%;
          }
          .filters {
            width: 50%;
          }
        `}
      </style>
    </div>
  );
}
