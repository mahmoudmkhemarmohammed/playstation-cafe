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
  price,
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
  price: number | string;
  name: string;
  orders: TOrder[];
}) => {
  const dateNow = new Date();
  const [pricePerMin, setPricePerMin] = useState<number>(0.5);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const formattedStartTime = dayjs(startTime)
    .tz("Africa/Cairo")
    .format("hh:mm A"); // 12-hour format with AM/PM
  const formattedEndTime = dayjs(dateNow).tz("Africa/Cairo").format("hh:mm A"); // 12-hour format with AM/PM

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
    setIsLoading(true);
    const now = dayjs().tz("Africa/Cairo");
    const start = dayjs(startTime).tz("Africa/Cairo");

    // حساب عدد الدقائق الفعلية المستغرقة
    const durationMinutes = now.diff(start, "minute");

    // لو السعر "----" (جلسة مفتوحة)
    const isOpenSession = price === "----";

    // سعر الدقيقة لجلسة مفتوحة (حدد قيمته انت زي ما تحب)
    const openSessionPricePerMinute = pricePerMin; // مثال: 2 جنيه للدقيقة

    let actualPrice = 0;

    if (isOpenSession) {
      // جلسة مفتوحة = احسب بسعر الدقيقة المفتوحة
      actualPrice = Math.ceil(openSessionPricePerMinute * durationMinutes);
    } else {
      // جلسة عادية = احسب عادي من السعر الكلي والمدة
      const originalEnd = dayjs(end).tz("Africa/Cairo");
      const originalDuration = originalEnd.diff(start, "minute") || 1; // احتياط
      const pricePerMinute = +price / originalDuration; // تأكد السعر رقم
      actualPrice = Math.ceil(pricePerMinute * durationMinutes);
    }

    // 1- إضافة للأرباح
    await dispatch(
      actAddRevenues({
        date: now.format("YYYY-MM-DD"),
        total: actualPrice + ordersRevenue,
      })
    ).unwrap();

    // 2- إضافة للـ History
    await dispatch(
      actAddClientToHistory({
        deviceId,
        endTime: now.format(), // نهاية الجلسة اللحظية
        startTime,
        price: actualPrice + ordersRevenue,
        name,
        orders,
      })
    ).unwrap();

    // 3- تغيير حالة الجهاز لمتاح
    await dispatch(actEditeStatus({ deviceId, status: "متاح" })).unwrap();

    // 4- إزالة العميل من قائمة المستخدمين
    await dispatch(actRemoveClient(id)).unwrap();

    // 5- تحديث الـ State عشان الريفريش
    setDataUpdated(!dataUpdated);

    // 6- إغلاق الفورم
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
                  setPricePerMin(diffInMinutes * 0.5);
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
                  setPricePerMin(diffInMinutes * 0.75);
                  setIsChecked(true);
                }}
              />
              <label htmlFor="multi">متعدد</label>
            </div>
          </div>

          {isChecked && <h2 className="text-xl mt-3">{pricePerMin} جنية</h2>}
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
