import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import SymptomHistory from "./SymptomHistroy";
import Floating from "./Floating";
const API = import.meta.env.VITE_API;
const UserProfile = () => {
  const userPhone = localStorage.getItem("phone");
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [toCancelId, setToCancelId] = useState(null);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I'm MediConnect. How can I help you today?" },
  ]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch(`${API}/get-user-appointments?phone=${userPhone}`);
        const data = await res.json();
        if (data.appointments) setAppointments(data.appointments);
      } catch {
        toast.error("Failed to fetch appointments.");
      }
    };
    fetchAppointments();
  }, [userPhone]);

  const cancelAppointment = async (id) => {
    try {
      const res = await fetch(`${API}/cancel-appointment/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Appointment cancelled.");
        setAppointments(appointments.filter((appt) => appt._id !== id));
      } else {
        toast.error("Failed to cancel appointment.");
      }
    } catch {
      toast.error("Error cancelling appointment.");
    }
  };

  const formatStatus = (date) => {
    if (!date) return "Invalid";
    const [day, month, year] = date.split('/');
    const apptDate = new Date(`${year}-${month.padStart(2,'0')}-${day.padStart(2,'0')}`);
    const today = new Date();
    today.setHours(0,0,0,0);
    apptDate.setHours(0,0,0,0);
    return apptDate < today ? "Completed" : "Upcoming";
  };

  return (
    <div className="p-6  text-gray-200 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Your Appointments</h2>

      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {appointments.map((appt) => (
            <div key={appt._id} className="bg-gray-800 p-4 rounded-xl shadow-xl">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{`Dr. ${appt.doctor_name}`}</h3>
                  <p className="text-sm text-gray-400">{appt.specialization}</p>
                  <p className="text-sm mt-1">{appt.location}</p>
                  <p className="text-sm">{`${appt.date} at ${appt.time}`}</p>
                  <p className="text-sm mt-1">Status: <strong>{formatStatus(appt.date)}</strong></p>
                  <p className="text-sm">
                    Doctor Status:{" "}
                    <span
                      className={`px-2 py-0.5 rounded-md text-white text-sm font-medium shadow-sm ${
                        appt.status === "Accepted" ? "bg-green-500" :
                        appt.status === "Rejected" ? "bg-red-500" : "bg-gray-500"
                      }`}
                    >
                      {appt.status}
                    </span>
                  </p>
                </div>
                <img src="/doctor-placeholder.png" alt="Doctor" className="h-16 w-16 rounded-full object-cover" />
              </div>

              <div className="mt-4 flex gap-2">
                {formatStatus(appt.date) === "Upcoming" && (
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded-xl hover:bg-red-600 active:scale-95 transition-all duration-200 shadow"
                    onClick={() => { setToCancelId(appt._id); setShowModal(true); }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-gray-900 border border-gray-700 shadow-2xl rounded-2xl p-6 w-full max-w-md animate-fade-in transition-all">
            <h2 className="text-xl font-bold text-gray-200 mb-3">Cancel Appointment?</h2>
            <p className="text-gray-400 mb-6">Are you sure you want to cancel this appointment?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={async () => { await cancelAppointment(toCancelId); setShowModal(false); setToCancelId(null); }}
                className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 active:scale-95 transition shadow"
              >
                Yes, Cancel
              </button>
              <button
                onClick={() => { setShowModal(false); setToCancelId(null); }}
                className="bg-gray-700 text-gray-200 px-4 py-2 rounded-xl hover:bg-gray-600 active:scale-95 transition shadow"
              >
                No, Go Back
              </button>
            </div>
          </div>
        </div>
      )}

      <SymptomHistory userPhone={userPhone} />
      <Floating messages={messages} setMessages={setMessages} />
    </div>
  );
};

export default UserProfile;
