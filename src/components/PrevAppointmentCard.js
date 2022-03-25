import React from "react";
import { FaUserAlt } from "react-icons/fa";

function PrevAppointmentCard({
  doctorName,
  doctorDetails,
  date,
  time,
  hospital,
  hospitalPhone,
}) {
  return (
    <div className="flex flex-col shadow-lg bg-lighter p-8">
      <div className="text-sm font-bold mb-4 text-primary">Date: {date}</div>
      <div className="flex flex-row space-x- 8 mb-4">
        <div className="bg-gray-200 rounded-full p-4">
          <FaUserAlt size={30} />
        </div>
        <div className="flex flex-col">
          <div className="font-bold text-xl text-primary">{doctorName}</div>
          <p>{doctorDetails}</p>
        </div>
      </div>
      <div className="text-sm mb-2 text-primary">
        <strong>Time:</strong> {time}
      </div>
      <div className="font-bold text-sm text-primary">{hospital}</div>
      <div className="text-xs text-primary">{hospitalPhone}</div>
    </div>
  );
}

export default PrevAppointmentCard;
