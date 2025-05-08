import { FaUsers, FaSearch } from "react-icons/fa";

const Patients = () => {
  const patients = [
    { id: 1, name: "John Doe", age: 45, condition: "Hypertension", lastVisit: "2025-04-20" },
    { id: 2, name: "Jane Smith", age: 32, condition: "Diabetes", lastVisit: "2025-04-25" },
    { id: 3, name: "Mike Johnson", age: 60, condition: "Heart Disease", lastVisit: "2025-05-01" },
  ];

  return (
    <div className="min-h-screen w-[88vw] bg-gray-100 p-4 md:p-8">
      <div className=" mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-500 text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <FaUsers className="text-3xl" />
            <h1 className="text-2xl font-bold">My Patients</h1>
          </div>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients..."
              className="pl-10 pr-4 py-2 rounded-md text-gray-800 bg-white"
            />
          </div>
        </div>

        {/* Patients List */}
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-3">Name</th>
                  <th className="p-3">Age</th>
                  <th className="p-3">Condition</th>
                  <th className="p-3">Last Visit</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{patient.name}</td>
                    <td className="p-3">{patient.age}</td>
                    <td className="p-3">{patient.condition}</td>
                    <td className="p-3">{patient.lastVisit}</td>
                    <td className="p-3">
                      <button className="text-blue-600 hover:text-blue-800">View Profile</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Patients;