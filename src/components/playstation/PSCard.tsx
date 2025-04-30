import img from "@assets/images/playstation_card.jpg";
import { TDevice } from "@types";

const PSCard = ({id, name, status , handleNewSession , setDeviceId , handleExtraTime , handleAddOrders}: TDevice) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow" onClick={() => setDeviceId(id)}>
      <div className="img">
        <img src={img} alt="img-card" className="rounded-xl" />
      </div>

      <div
        className={`text flex justify-between flex-wrap gap-2 text-center mt-4 *:grow ${
          status === "متاح" ? "*:w-[45%]" : status === "صيانة" ? "flex-col" : ""
        }`}
      >
        <h2 className="bg-[#74ebd5] p-2 rounded">{name}</h2>
        <h2 className="bg-[#9face6] p-2 rounded">{status}</h2>
        {status === "متاح" && (
          <h2 className="bg-[#88ff00] p-2 rounded cursor-pointer" onClick={handleNewSession}>بدء جلسة</h2>
        )}
        {status === "مستخدم" && (
          <h2 className="bg-[#ffd000] p-2 rounded cursor-pointer" onClick={handleExtraTime}>إضافة وقت</h2>
        )}
        {status === "مستخدم" && (
          <h2 onClick={handleAddOrders} className="bg-[#ea00ff] p-2 rounded cursor-pointer">
            إضافة مشروب
          </h2>
        )}
      </div>
    </div>
  );
};

export default PSCard;
