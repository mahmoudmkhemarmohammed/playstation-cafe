import actEditeStatus from "@store/devices/act/actEditeStatus";
import { useAppDispatch } from "@store/hooks";
import actAddRevenues from "@store/revenues/act/actAddRevenues";
import actRemoveClient from "@store/users/act/actRemoveClient";
import { useState } from "react";

const AddRevenue = ({
  id,
  deviceId,
  setIsPauseTime,
  isPauseTime,
  setDataUpdated,
  dataUpdated
}: {
  id: number;
  deviceId: number;
  isPauseTime: boolean;
  dataUpdated: boolean
  setIsPauseTime: (val: boolean) => void;
  setDataUpdated: (val: boolean) => void;
}) => {
  const [price, setPrice] = useState<number>(0);
  const dispatch = useAppDispatch();
  const sendData = async () => {
    try {
      await dispatch(
        actAddRevenues({
          date: new Date().toLocaleDateString("en-CA"),
          total: price,
        })
      ).unwrap();

      await dispatch(
        actEditeStatus({ deviceId: deviceId, status: "متاح" })
      ).unwrap();

      await dispatch(actRemoveClient(id)).unwrap();

      setDataUpdated(!dataUpdated);
    } catch (error) {
      console.error("Error handling finished session:", error);
    }
  };

  const handleRemoveSession = async () => {
    await dispatch(actRemoveClient(id)).unwrap();
    await dispatch(
      actEditeStatus({ deviceId: deviceId, status: "متاح" })
    ).unwrap();
    setIsPauseTime(!isPauseTime);
    setDataUpdated(!dataUpdated);
  };
  return (
    <div className="fixed z-[1000] w-full h-full bg-gradient-to-r from-[#9face6] to-[#74ebd5] left-0 top-0 flex justify-center items-center">
      <div className="bg-white w-[450px] shadow rounded-xl p-3 flex flex-col gap-3 py-7 px-5 *:flex *:flex-col">
        <h2>أيقاف الجلسة</h2>
        <div>
          <label htmlFor="price" className="text-[18px]">
            ادخل الارباح
          </label>
          <input
            onChange={(e) => setPrice(+e.target.value)}
            id="price"
            type="number"
            className="bg-gradient-to-r from-[#9face6] to-[#74ebd5] p-3 mt-2 rounded"
          />
        </div>
        <button
          className="text-[18px] bg-green-400 p-2 rounded-md cursor-pointer"
          onClick={sendData}
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
    </div>
  );
};

export default AddRevenue;
