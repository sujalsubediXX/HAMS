import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { useAuth } from "../../Utils/AuthProvider";

const DoctorProfile = () => {
  const { userData } = useAuth();
  
  return (
    <div className=" bg-gray-100 flex flex-col w-full h-[88vh] ">
      <div className=" h-full flex items-center justify-center  ">
        <div className=" shadow-2xl bg-white rounded-2xl overflow-hidden h-4/5 w-4/5">
          <div className="px-14 py-16 h-full">
            <section className="mb-4 sm:mb-8">
              <h2 className="text-[18px] md:text-xl font-semibold text-gray-800 mb-4">
                Professional Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 text-[16px] md:text-xl">
                <div>
                  <p className="text-gray-500">Experience</p>
                  <p className="text-gray-800">{userData.experience} years</p>
                </div>
                <div>
                  <p className="text-gray-500">Education</p>
                  <p className="text-gray-800 font-medium">
                    {userData.qualification}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Speciality</p>
                  <p className="text-gray-800 font-medium">
                    {userData.specialization}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">License</p>
                  <p className="text-gray-800 font-medium">
                    {userData.license}
                  </p>
                </div>
              </div>
            </section>

            <section className="text-[16px] md:text-xl">
              <h2 className=" font-semibold text-gray-800 mb-4">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FaEnvelope className="text-blue-600" />
                  <p className="text-gray-800">{userData.email}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <FaPhone className="text-blue-600" />
                  <p className="text-gray-800">{userData.phone}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <FaMapMarkerAlt className="text-blue-600" />
                  <p className="text-gray-800">{userData.address}</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
