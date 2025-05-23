import Loading from "@components/feedback/Loading";
import actEditeStatus from "@store/devices/act/actEditeStatus";
import actAddClientToHistory from "@store/history/act/actAddClientToHistory";
import { useAppDispatch } from "@store/hooks";
import actAddRevenues from "@store/revenues/act/actAddRevenues";
import actRemoveClient from "@store/users/act/actRemoveClient";
import { TOrder } from "@types";
import dayjs from "dayjs";
import { useState } from "react";

const AddRevenue = ({
  id,
  deviceId,
  setIsPauseTime,
  isPauseTime,
  setDataUpdated,
  dataUpdated,
  startTime,
  ordersRevenue,
  name,
  orders,
}: {
  id: number;
  deviceId: number;
  isPauseTime: boolean;
  dataUpdated: boolean;
  setIsPauseTime: (val: boolean) => void;
  setDataUpdated: (val: boolean) => void;
  startTime: string;
  ordersRevenue: number;
  name: string;
  orders: TOrder[];
}) => {
  const dateNow = new Date();
  const [pricePerMin, setPricePerMin] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const formattedStartTime = dayjs(startTime)
    .tz("Africa/Cairo")
    .format("hh:mm A");
  const formattedEndTime = dayjs(dateNow).tz("Africa/Cairo").format("hh:mm A");

  const start = dayjs(startTime).tz("Africa/Cairo");
  const end = dayjs(dateNow).tz("Africa/Cairo");

  const diffInMinutes = end.diff(start, "minute");

  const dispatch = useAppDispatch();

  const handleRemoveSession = async () => {
    await dispatch(actRemoveClient(id)).unwrap();
    await dispatch(
      actEditeStatus({ deviceId: deviceId, status: "متاح" })
    ).unwrap();
    setIsPauseTime(!isPauseTime);
    setDataUpdated(!dataUpdated);
  };

  const onSubmit = async () => {
    if (!isChecked) {
      alert("من فضلك اختر نوع اللعب (زوجي / متعدد)");
      return;
    }

    setIsLoading(true);
    const now = dayjs().tz("Africa/Cairo");
    const start = dayjs(startTime).tz("Africa/Cairo");

    const durationMinutes = now.diff(start, "minute") || 1;

    const actualPrice = Math.ceil(pricePerMin * durationMinutes);

    await dispatch(
      actAddRevenues({
        date: now.format("YYYY-MM-DD"),
        total: actualPrice + ordersRevenue,
      })
    ).unwrap();

    await dispatch(
      actAddClientToHistory({
        deviceId,
        endTime: now.format(),
        startTime,
        price: actualPrice + ordersRevenue,
        name,
        orders,
      })
    ).unwrap();

    await dispatch(actEditeStatus({ deviceId, status: "متاح" })).unwrap();
    await dispatch(actRemoveClient(id)).unwrap();

    setDataUpdated(!dataUpdated);
    setIsPauseTime(false);
    setIsLoading(false);
  };

  return (
    <div className="fixed z-[1000] w-full h-full bg-gradient-to-r from-[#9face6] to-[#74ebd5] left-0 top-0 flex justify-center items-center">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="bg-white w-[450px] shadow rounded-xl p-3 flex flex-col gap-3 py-7 px-5 *:flex *:flex-col">
          <h2 className="text-3xl">إيقاف الجلسة</h2>
          <div>
            <h2 className="text-xl">الوقت</h2>
            <div className="flex justify-evenly items-center mt-5">
              <span className="text-xl">{formattedStartTime}</span>
              <span className="text-xl">:</span>
              <span className="text-xl">{formattedEndTime}</span>
            </div>
          </div>
          <h2 className="text-xl mt-3">
            الوقت المستغرق : {diffInMinutes} دقيقة
          </h2>

          <h2 className="text-xl text-red-500">إختر نوع اللعب</h2>
          <div className="flex flex-row! gap-2 justify-center">
            <div className="flex items-center gap-2">
              <input
                className="w-5 h-5"
                type="radio"
                id="ood"
                name="type"
                onChange={() => {
                  setPricePerMin(0.5);
                  setIsChecked(true);
                }}
              />
              <label htmlFor="ood">زوجي</label>
            </div>

            <div className="flex items-center gap-2">
              <input
                className="w-5 h-5"
                type="radio"
                id="multi"
                name="type"
                onChange={() => {
                  setPricePerMin(0.75);
                  setIsChecked(true);
                }}
              />
              <label htmlFor="multi">متعدد</label>
            </div>
          </div>

          {isChecked && (
            <h2 className="text-xl mt-3">
              {Math.ceil(pricePerMin * diffInMinutes)} جنية
            </h2>
          )}

          <button
            className="text-[18px] bg-green-400 p-2 rounded-md cursor-pointer"
            onClick={onSubmit}
          >
            حفظ
          </button>
          <button
            className="text-[18px] bg-red-400 p-2 rounded-md cursor-pointer"
            onClick={() => setIsPauseTime(false)}
          >
            إغلاق
          </button>
          <button
            className="text-[18px] bg-red-400 p-2 rounded-md cursor-pointer"
            onClick={handleRemoveSession}
          >
            حذف الجلسة
          </button>
        </div>
      )}
    </div>
  );
};

export default AddRevenue;