import ConfirmModal from "@components/feedback/ConfirmModal";
import AddRevenue from "@components/forms/AddRevenue";
import actEditeStatus from "@store/devices/act/actEditeStatus";
import { useAppDispatch } from "@store/hooks";
import actRemoveClient from "@store/users/act/actRemoveClient";
import { TOrder } from "@types";
import { useState } from "react";

type TTableBodyContentProps = {
  id: number;
  deviceId: number;
  name: string;
  startTime: string;
  endTime: string;
  orders: TOrder[];
  price: number;
  dataUpdated: boolean;
  isOpenTime: boolean;
  setDataUpdated: (val: boolean) => void;
};
const TableBodyContent = ({
  id,
  deviceId,
  name,
  startTime,
  endTime,
  orders,
  price,
  setDataUpdated,
  isOpenTime,
  dataUpdated,
}: TTableBodyContentProps) => {
  const [isDeleteSession, setIsDeleteSession] = useState(false);
  const [isPauseTime, setIsPauseTime] = useState(false);
  const dispatch = useAppDispatch();
  const handleClick = () => {
    // Update device status to "Available"
    dispatch(actEditeStatus({ deviceId: deviceId, status: "متاح" }))
      .unwrap()
      .then(() => {
        setTimeout(() => {
          // Delete user session
          dispatch(actRemoveClient(id))
            .unwrap()
            .then(() => {
              setTimeout(() => {
                // Trigger data refresh
                setDataUpdated(!dataUpdated);
              }, 1000);
            });
        }, 1000);
      });
  };
  const handleClose = () => {
    setIsDeleteSession(!isDeleteSession);
  };


  const handlePauseTime = () => {
    setIsPauseTime(!isPauseTime);
  };
  return (
    <tr className="bg-white *:rounded *:text-center *:py-4">
      <td>جهاز رقم {deviceId}</td>
      <td>{name}</td>
      <td>{startTime}</td>
      <td>{endTime}</td>
      <td className="flex flex-col justify-center items-center">
        {orders.map((el) => (
          <span key={el.id}>{`${el.quantity} ${el.name}`}</span>
        ))}
      </td>
      <td className="bg-green-400">{price}</td>
      {isOpenTime ? (
        <td className="bg-yellow-400 cursor-pointer">
          <span onClick={handlePauseTime}>إيقاف</span>
          {isPauseTime && (
            <AddRevenue
              isPauseTime={isPauseTime}
              deviceId={deviceId}
              id={id}
              setIsPauseTime={setIsPauseTime}
              setDataUpdated={setDataUpdated}
            />
          )}
        </td>
      ) : (
        <td className="bg-red-400 cursor-pointer" onClick={handleClose}>
          حذف
          {isDeleteSession && (
            <ConfirmModal
              message="هل أنت متأكد من حذف الجلسة؟"
              onClose={handleClose}
              onConfirm={handleClick}
            />
          )}
        </td>
      )}
    </tr>
  );
};

export default TableBodyContent;
