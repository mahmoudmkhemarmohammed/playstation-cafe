import { useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import actGetRevenues from "@store/revenues/act/actGetRevenues";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const RevenuesPage = () => {
  const dispatch = useAppDispatch();
  const { revenues, loading, error } = useAppSelector(
    (state) => state.revenues
  );

  useEffect(() => {
    dispatch(actGetRevenues());
  }, [dispatch]);

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
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto text-right">
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-8 text-center text-gray-800">
        صفحة الإيرادات
      </h1>

      {loading === "pending" ? (
        <p className="text-center text-xl font-medium">جاري التحميل...</p>
      ) : error ? (
        <p className="text-center text-red-600 text-xl font-medium">{error}</p>
      ) : (
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
      )}
    </div>
  );
};

export default RevenuesPage;
