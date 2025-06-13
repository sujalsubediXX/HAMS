import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ConfirmAlert from "../../Components/ConfirmAlert.jsx";

const ManageSpecialty = () => {
  const [specialty, setSpecialty] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [editMode, setEditMode] = useState({ status: false, data: "" });
  const [data, setData] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchSpecialties = async () => {
    try {
      const response = await axios.get("/api/specialty/getAllSpecialties");
      setSpecialty(response.data.data || []);
    } catch (error) {
      console.error("Unable to fetch specialties:", error);
      toast.error("Failed to load specialties.");
    }
  };

  const handleAddSpecialty = async (e) => {
    e.preventDefault();
    if (!data || data.trim() === "") {
      toast.error("Specialty name is required.");
      return;
    }
    try {
      await axios.post("/api/specialty/addSpecialty", { name: data });
      toast.success("Specialty added successfully.");
      setData("");
    } catch (error) {
      console.error("Unable to add Specialty:", error);
      toast.error("Failed to add Specialty.");
    }
  };

  const handleEditSpecialty = async (id) => {
    try {
      await axios.put(`/api/specialty/updateSpecialty/${id}`, {
        name: editMode.data,
      });
      toast.success("Specialty updated successfully.");
      setEditMode({ status: false, data: "" });
    } catch (error) {
      console.error("Unable to edit Specialty:", error);
      toast.error("Failed to update Specialty.");
    }
  };

  const handleDeleteSpecialty = async (id) => {
    try {
      await axios.delete(`/api/specialty/deleteSpecialty/${id}`);
      toast.success("Specialty deleted successfully.");
    } catch (error) {
      console.error("Unable to delete Specialty:", error);
      toast.error("Failed to delete Specialty.");
    }
    setShowConfirm(false);
    setSelectedId("");
  };
  useEffect(() => {
    fetchSpecialties();
  }, [handleAddSpecialty, handleEditSpecialty, handleDeleteSpecialty]);
  const filteredSpecialty = specialty.filter((item) =>
    (item?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="px-6 pt-2 bg-gray-50 w-full">
      <h1 className="text-2xl font-bold mb-5 text-gray-800">
        Manage Specialty
      </h1>

      {/* Add New Specialty */}
      <div className="bg-white shadow rounded-lg p-4 mb-5">
        <h2 className="text-lg font-semibold mb-4">Add New Specialty</h2>
        <form onSubmit={handleAddSpecialty} className="flex gap-4">
          <input
            type="text"
            value={data}
            placeholder="Specialty Name"
            onChange={(e) => setData(e.target.value)}
            className="flex-1 border px-3 py-2 rounded-md focus:ring focus:ring-blue-300"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-md shadow hover:bg-blue-600"
          >
            Add
          </button>
        </form>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search specialties..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border px-3 py-2 rounded-md focus:ring focus:ring-blue-300"
        />
      </div>

      {/* Specialty List */}
      <div className="overflow-y-auto max-h-[454px] bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Specialties</h2>
        {filteredSpecialty.length > 0 ? (
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">Specialty Name</th>
                <th className="border px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSpecialty.map((item) => (
                <tr key={item._id}>
                  <td className="border px-4 py-2">{item.name || "Unnamed"}</td>
                  <td className="border px-4 py-2 flex gap-2">
                    <button
                      onClick={() => {
                        setEditMode({ status: true, data: item.name });
                        setSelectedId(item._id);
                      }}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setShowConfirm(true);
                        setSelectedId(item._id);
                      }}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No Specialty found.</p>
        )}
      </div>

      {/* Confirm Delete */}
      {showConfirm && (
        <ConfirmAlert
          onConfirm={() => handleDeleteSpecialty(selectedId)}
          onCancel={() => {
            setShowConfirm(false);
            setSelectedId("");
          }}
          message="Are you sure you want to delete this Specialty?"
          info="Delete"
        />
      )}

      {/* Edit Specialty Modal */}
      {editMode.status && (
        <section className="fixed inset-0 w-full h-full z-50 flex justify-center items-center bg-[#0000007d] overflow-hidden">
          <div className="w-[66%] sm:w-[50%] md:w-[40%] lg:w-[28%] bg-white rounded-2xl shadow-sm px-8 py-6">
            <h1 className="text-lg font-semibold mb-2 text-center">
              Edit Specialty
            </h1>
            <div className="mb-6">
              <label className="my-4">Specialty :</label>
              <input
                type="text"
                value={editMode.data}
                placeholder="Specialty Name"
                onChange={(e) =>
                  setEditMode((prev) => ({ ...prev, data: e.target.value }))
                }
                className="w-full border px-3 py-2 rounded-md focus:ring focus:ring-blue-300 my-4"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                onClick={() => {
                  setEditMode({ status: false, data: "" });
                  setSelectedId("");
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => handleEditSpecialty(selectedId)}
              >
                Submit
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ManageSpecialty;
