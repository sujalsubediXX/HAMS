import {
  FaUserMd,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
} from "react-icons/fa";

const DoctorProfile = () => {
  const doctor = {
    name: "Dr. Sujal Subedi",
    specialty: "Cardiologist",
    experience: "15 years",
    education: "MD, Harvard Medical School",
    license: "CA-123456",
    email: "sujal.subedi@hospital.com",
    phone: "+1 (555) 123-4567",
    address: "123 Health St, Medical City, CA 90210",
    bio: "Dr. Sujal Subedi is a board-certified cardiologist with over 15 years of experience in treating complex heart conditions. He is dedicated to providing compassionate care and leveraging the latest medical advancements to improve patient outcomes.",
  };

  return (
    <div className="h-[100vh] w-[100%]  bg-gray-100 flex  items-center justify-center  ">
      <div className="w-[80vw] sm:w-[66vw] lg:w-[80vw] p-4">
        <div className=" mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-blue-500 text-white p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FaUserMd className="text-xl sm:text-4xl" />
              <div>
                <h1 className="text-[16px] md:text-2xl font-bold">{doctor.name}</h1>
                <p className="text-blue-200 text-[16px] md:text-2xl">{doctor.specialty}</p>
              </div>
            </div>
            <button className="flex items-center space-x-2 bg-white hover:bg-gray-100 text-gray-600 px-4 py-2 rounded-md text-[18px] md:text-xl">
              <FaEdit />
              <span>Edit Profile</span>
            </button>
          </div>

          <div className="p-6">
            <section className="mb-4 sm:mb-8">
              <h2 className="text-[18px] md:text-xl font-semibold text-gray-800 mb-4">
                Professional Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 text-[16px] md:text-xl">
                <div>
                  <p className="text-gray-500">Experience</p>
                  <p className="text-gray-800 font-medium">
                    {doctor.experience}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Education</p>
                  <p className="text-gray-800 font-medium">
                    {doctor.education}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">License</p>
                  <p className="text-gray-800 font-medium">{doctor.license}</p>
                </div>
              </div>
            </section>
            <section className="mb-5 sm:mb-8 text-[16px] md:text-xl">
              <h2 className=" font-semibold text-gray-800 mb-4">
                About
              </h2>
              <p className="text-gray-600">{doctor.bio}</p>
            </section>

            <section className="text-[16px] md:text-xl">
              <h2 className=" font-semibold text-gray-800 mb-4">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FaEnvelope className="text-blue-600" />
                  <p className="text-gray-800">{doctor.email}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <FaPhone className="text-blue-600" />
                  <p className="text-gray-800">{doctor.phone}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <FaMapMarkerAlt className="text-blue-600" />
                  <p className="text-gray-800">{doctor.address}</p>
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
