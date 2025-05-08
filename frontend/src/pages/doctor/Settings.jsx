import { FaCog, FaSave } from "react-icons/fa";

const Settings = () => {
  return (
    <div className="min-h-screen w-[88vw] bg-gray-100 p-4 md:p-8">
      <div className=" mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-500 text-white p-6 flex items-center space-x-4">
          <FaCog className="text-3xl" />
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        <div className="p-6 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700">Full Name</label>
                <input
                  type="text"
                  defaultValue="Dr. Sujal Patel"
                  className="w-full border rounded-md p-2 text-gray-800"
                />
              </div>
              <div>
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  defaultValue="sujal.patel@hospital.com"
                  className="w-full border rounded-md p-2 text-gray-800"
                />
              </div>
            </div>
          </section>

        
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Change Password</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700">Current Password</label>
                <input
                  type="password"
                  className="w-full border rounded-md p-2 text-gray-800"
                />
              </div>
              <div>
                <label className="block text-gray-700">New Password</label>
                <input
                  type="password"
                  className="w-full border rounded-md p-2 text-gray-800"
                />
              </div>
            </div>
          </section>

          <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
            <FaSave />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;