import React from "react";
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import { AiOutlineTwitter } from "react-icons/ai";
import { BsNewspaper } from "react-icons/bs";
import "leaflet/dist/leaflet.css";

const renderIcon = (component) => {
  return L.divIcon({
    className: "map icon",
    html: ReactDOMServer.renderToString(component),
  });
};

const generateMarkers = (locations, icon) => {
  return locations.map((location) => (
    <Marker position={location.coordinates} icon={renderIcon(icon)}>
      <Popup>
        Sentiment: {location.sentiment.type}
        <br />
        Polarity: {location.sentiment.polarity}
      </Popup>
    </Marker>
  ));
};

function SentimentMap({ newsLocations, twitterLocations }) {
  return (
    <Map center={[0, 0]} zoom={2} style={{ height: "100vh", width: "100vh" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {generateMarkers(
        newsLocations || [],
        <BsNewspaper size={32} style={{ fill: "black" }} />
      )}
      {generateMarkers(
        twitterLocations || [],
        <AiOutlineTwitter size={32} style={{ fill: "blue" }} />
      )}
    </Map>
  );
}

export default SentimentMap;
