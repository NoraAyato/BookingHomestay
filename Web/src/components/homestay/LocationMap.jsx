import React from "react";

const LocationMap = ({ address, title }) => {
  return (
    <div className="border-b pb-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Vị trí</h2>
      <p className="text-gray-600 mb-4">{address}</p>
      <div className="h-[400px] rounded-lg overflow-hidden shadow-lg">
        <iframe
          src={`https://www.google.com/maps?q=${encodeURIComponent(
            address
          )}&output=embed`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          title={`Vị trí của ${title}`}
        ></iframe>
      </div>
    </div>
  );
};

export default LocationMap;
