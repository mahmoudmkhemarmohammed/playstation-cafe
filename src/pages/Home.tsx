import { useEffect, useState } from "react";
import Card from "@components/playstation/Card";
import actGetDevicesStatusLength from "@store/devices/act/actGetDevicesStatusLength";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import actGetRevenues from "@store/revenues/act/actGetRevenues";
import actDeleteAllRevenues from "@store/revenues/act/actDeleteAllRevenues";

const Home = () => {
  const dispatch = useAppDispatch();
  const { generalStatistics } = useAppSelector((state) => state.devices);
  const { revenues } = useAppSelector((state) => state.revenues);
  const [dataUpdated, setDataUpdated] = useState(false);

  const chartData = revenues.map((rev) => ({
    date: new Date(rev.date).toLocaleDateString("ar-EG"),
    total: rev.total,
  }));

  const totalOverallRevenue = revenues.reduce((sum, rev) => sum + rev.total, 0);

  useEffect(() => {
    dispatch(actGetDevicesStatusLength());
    dispatch(actGetRevenues());
  }, [dispatch, dataUpdated]);

  const handleStartAnewMonth = () => {
    dispatch(actDeleteAllRevenues())
      .unwrap()
      .then(() => {
        setTimeout(() => {
          setDataUpdated(!dataUpdated);
        }, 1500);
      });
  };

  return (
    <div className="container">
      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          message="الاجهزة المتاحة"
          count={generalStatistics?.availableEquipment}
        />
        <Card
          message="الاجهزة المستخدمة"
          count={generalStatistics?.usedEquipment}
        />
        <Card
          message="الاجهزة في الصيانة"
          count={generalStatistics?.maintenanceEquipment}
        />
        <Card
          message="إجمالي الإيرادات الكلية"
          count={`${totalOverallRevenue} جنية`}
        />
      </div>

      <button
        onClick={handleStartAnewMonth}
        className="my-2 p-4 w-full rounded text-xl bg-gradient-to-r from-white to-[#9fe6cb] cursor-pointer shadow-lg"
      >
        بدء شهر جديد
      </button>

      {/* Chart Section */}
      <div className="bg-white rounded-2xl shadow-md p-4 w-full h-[500px]">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          تطور الإيرادات
        </h2>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#4f46e5"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Home;
