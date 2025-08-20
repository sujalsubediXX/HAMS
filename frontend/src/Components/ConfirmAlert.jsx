import React from "react";

const ConfirmAlert = ({  onConfirm, onCancel, message,info }) => {


  return (
    <section className="fixed inset-0 w-full h-full z-50 flex justify-center items-center bg-[#0000007d] overflow-hidden pointer-events-auto">
      <div className="w-[66%] sm:w-[50%] md:w-[40%] lg:w-[28%] bg-white rounded-2xl shadow-sm py-10 px-6 md:py-10 md:px-6 lg:py-12 lg:px-16">
        <h1 className="text-lg font-semibold mb-12 text-center">
          {message || "Are you Sure ?"} 
        </h1>
        <div className="flex justify-between gap-4">
          <button
            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={onConfirm}
          >
            {info}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ConfirmAlert;
