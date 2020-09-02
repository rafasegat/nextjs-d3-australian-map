/* eslint-disable react/prop-types */
import React, { useRef, useEffect, useState } from "react";
import { min, max } from "d3-array";
import { geoPath, geoMercator } from "d3-geo";
import { scaleLinear } from "d3-scale";
import "d3-transition";
import { select } from "d3-selection";
import useResizeObserver from "../../../utils/useResizeObserver";

/**
 * Component that renders a map of whatever place.
 */
export default function Map({ data, property }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [district, setDistrict] = useState(null);

  // it will be triggered initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);

    // const minProp = min(
    //   data.features,
    //   (feature) => feature.properties[property]
    // );
    // const maxProp = max(
    //   data.features,
    //   (feature) => feature.properties[property]
    // );
    // const colorScale = scaleLinear() .domain([minProp, maxProp]) .range(["#ccc", "red"]);

    // use resized dimensions
    // but fall back to getBoundingClientRect, if no dimensions yet.
    const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect();

    // projects geo-coordinates on a 2D plane
    const projection = geoMercator()
      .rotate([0, -14])
      .fitSize([width, height], selectedDistrict || data) // if selectedDistrict has data, we will 'zoom' in the selected data, otherwise select all data
      .precision(100);

    // takes geojson data,
    // transforms that into the d attribute of a path element
    const pathGenerator = geoPath().projection(projection);

    // render each district
    svg
      .selectAll(".district") // selectAll selects all matching elements. Each function takes a single argument which specifies the selector string
      .data(data.features) // source of data
      .join("path") //  data join lets you specify exactly what happens to the DOM as data changes
      .on("click", (feature) => {
        setSelectedDistrict(selectedDistrict === feature ? null : feature);
      })
      .on("mouseover", (feature) => {
        setDistrict(feature.properties.CED_NAME);
      })
      .attr("class", "district")
      .attr("fill", "#F3E37C") // each district color
      .attr("stroke", "#EEA243") // edit the map lines
      .style("cursor", "pointer")
      // .attr("fill", (feature) => colorScale(feature.properties[property]))
      .attr("d", (feature) => pathGenerator(feature));

    // render text
    svg
      .selectAll(".label")
      .data([selectedDistrict])
      .join("text")
      .attr("class", "label")
      .text((feature) => feature && `District: ${feature.properties.CED_NAME}`)
      .attr("x", 10)
      .attr("y", 25);
  }, [data, dimensions, property, selectedDistrict]);

  return (
    <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
      <div>{district}</div>
      <svg ref={svgRef} className="svg-map" />
      <style>
        {`
          .svg-map {
            display: block;
            width: 100%;
            height: 80vh;
            overflow: visible;
          }

          .svg-map .district {
            cursor: pointer;
            transition: .1s ease;
          }

          .svg-map .district:hover {
            stroke: #EEA243;
            fill: #EEA243;
            stroke-width: 1px;
            cursor: pointer;
          }
        `}
      </style>
    </div>
  );
}
