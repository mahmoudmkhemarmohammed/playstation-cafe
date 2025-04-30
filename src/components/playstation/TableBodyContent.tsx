import ConfirmModal from "@components/feedback/ConfirmModal";
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
  dataUpdated,
}: TTableBodyContentProps) => {
  const [isDeleteSession, setIsDeleteSession] = useState(false);
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
    </tr>
  );
};

export default TableBodyContent;
