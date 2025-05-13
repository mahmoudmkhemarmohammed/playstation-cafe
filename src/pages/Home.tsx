import { useEffect, useState } from "react";
import Card from "@components/playstation/Card";
import actGetDevicesStatusLength from "@store/devices/act/actGetDevicesStatusLength";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import actGetRevenues from "@store/revenues/act/actGetRevenues";
import actDeleteAllRevenues from "@store/revenues/act/actDeleteAllRevenues";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);
const Home = () => {
  const dispatch = useAppDispatch();
  const { generalStatistics } = useAppSelector((state) => state.devices);
  const { revenues } = useAppSelector((state) => state.revenues);
  const [dataUpdated, setDataUpdated] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

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

  const chartData = {
    labels: revenues.map((r) => r.date),
    datasets: [
      {
        label: "الإجمالي",
        data: revenues.map((r) => r.total),
        backgroundColor: "#2196F3",
      },
    ],
  };

  return (
    <div className="container">
      {/* Cards Section */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <Card
          message="الاجهزة المتاحة"
          count={generalStatistics?.availableEquipment}
        />
        <Card
          message="الاجهزة المستخدمة"
          count={generalStatistics?.usedEquipment}
        />
        {user?.role === "admin" && (
          <Card
            message="إجمالي الإيرادات الكلية"
            count={`${totalOverallRevenue} جنية`}
          />
        )}
      </div>

      {user?.role === "admin" && (
        <>
          <button
            onClick={handleStartAnewMonth}
            className="my-2 p-4 w-full rounded text-xl bg-gradient-to-r from-white to-[#9fe6cb] cursor-pointer shadow-lg"
          >
            بدء شهر جديد
          </button>
          {/* Chart Section */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg">
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: {
                      font: {
                        size: 16,
                        weight: "bold",
                      },
                    },
                  },
                },
                scales: {
                  x: {
                    ticks: {
                      font: {
                        size: 14,
                      },
                    },
                  },
                  y: {
                    beginAtZero: true,
                    ticks: {
                      font: {
                        size: 14,
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
