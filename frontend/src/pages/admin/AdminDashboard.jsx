import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7f50",
  "#0088FE",
  "#00C49F",
];

const AdminDashboard = () => {


  const [data, setData] = useState([]);
  const [appointmentstats, getappointmentstats] = useState([]);
  const [ageStats, setagestats] = useState([]);
  const [topspecialty, settopspecialty] = useState([]);
  const [daydata, setdaydata] = useState([]);
  const [doctorData, setDoctorData] = useState([]);

  useEffect(() => {
    fetchGenderData();
    fetchAppointmentStats();
    fetchAgeStats();
    getTopSpecialties();
    fetchdaydata();
    fetchDoctorData();
  }, []);

  const fetchGenderData = async () => {
    try {
      const res = await axios.get("https://hams-eegi.onrender.com/api/user/gender-stats");
      const chartData = Object.entries(res.data).map(([gender, count]) => ({
        gender: gender.charAt(0).toUpperCase() + gender.slice(1),
        count,
      }));
      setData(chartData);
    } catch (err) {
      console.error("Error fetching gender data", err);
    }
  };
  const fetchAppointmentStats = async () => {
    try {
      const res = await axios.get("https://hams-eegi.onrender.com/api/appointment/appointmentstats");
      const chartData = Object.entries(res.data).map(([status, count]) => ({
        status: status.charAt(0).toUpperCase() + status.slice(1),
        count,
      }));
      getappointmentstats(chartData);
    } catch (err) {
      console.error("Error fetching gender data", err);
    }
  };
  const getTopSpecialties = async () => {
    try {
      const res = await axios.get("https://hams-eegi.onrender.com/api/appointment/getTopSpecialties");
      const chartData = res.data.map((item) => ({
        specialty: item._id.charAt(0).toUpperCase() + item._id.slice(1),
        value: item.count,
      }));
      settopspecialty(chartData);
    } catch (err) {
      console.error("Error fetching top specialties", err);
    }
  };

  const fetchAgeStats = async () => {
    try {
      const res = await axios.get("https://hams-eegi.onrender.com/api/user/getAgeStats");
      const chartData = Object.entries(res.data).map(([ageGroup, count]) => ({
        ageGroup: ageGroup.charAt(0).toUpperCase() + ageGroup.slice(1),
        count,
      }));
      setagestats(chartData);
    } catch (err) {
      console.error("Error fetching gender data", err);
    }
  };
  const fetchdaydata = async () => {
    try {
      const res = await axios.get("https://hams-eegi.onrender.com/api/appointment/getchartdata");
      setdaydata(res.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const fetchDoctorData = async () => {
    try {
      const res = await axios.get("https://hams-eegi.onrender.com/api/appointment/chartDoctorAppointments");
      setDoctorData(res.data);
    } catch (error) {
      console.error("Error fetching doctor appointment data:", error);
    }
  };

  return (
    <div className="p-6 grid gap-8 grid-cols-1 w-[86vw] md:grid-cols-2 lg:grid-cols-3 bg-gray-50 min-h-screen overflow-y-auto noscrollbar">
      <div className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Appointments This Week</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={daydata}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Patient Gender Ratio</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <XAxis dataKey="gender" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Patient Demographics</h2>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={ageStats}
              dataKey="count"
              nameKey="ageGroup"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {ageStats.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Appointment Status</h2>
        <ResponsiveContainer width="100%" height={210}>
          <PieChart>
            <Pie
              data={appointmentstats}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              label
            >
              {appointmentstats.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Top Specializations</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={topspecialty}>
            <XAxis dataKey="specialty" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Top 6 Appointments per Doctor</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={doctorData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="doctorName"
              interval={0}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;
