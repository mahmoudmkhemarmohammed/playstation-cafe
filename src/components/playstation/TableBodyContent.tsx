import ConfirmModal from "@components/feedback/ConfirmModal";
import AddRevenue from "@components/forms/AddRevenue";
import actEditeStatus from "@store/devices/act/actEditeStatus";
import { useAppDispatch } from "@store/hooks";
import actRemoveClient from "@store/users/act/actRemoveClient";
import { TOrder } from "@types";
import { useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

type TTableBodyContentProps = {
  id: number;
  deviceId: number;
  name: string;
  startTime: string;
  endTime: string;
  orders: TOrder[];
  ordersRevenue: number;
  price: number;
  dataUpdated: boolean;
  setDataUpdated: (val: boolean) => void;
  isHistory: boolean;
};

const TableBodyContent = ({
  id,
  deviceId,
  name,
  startTime,
  endTime,
  price,
  setDataUpdated,
  ordersRevenue,
  orders,
  dataUpdated,
  isHistory,
}: TTableBodyContentProps) => {
  const [isDeleteSession, setIsDeleteSession] = useState(false);
  const [isPauseTime, setIsPauseTime] = useState(false);
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(actEditeStatus({ deviceId: deviceId, status: "متاح" }))
      .unwrap()
      .then(() => {
        setTimeout(() => {
          dispatch(actRemoveClient(id))
            .unwrap()
            .then(() => {
              setTimeout(() => {
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

  const formattedStartTime = dayjs(startTime)
    .tz("Africa/Cairo")
    .format("hh:mm A"); // 12-hour format with AM/PM
  const formattedEndTime = endTime
    ? dayjs(endTime).tz("Africa/Cairo").format("hh:mm A") // 12-hour format with AM/PM
    : "غير محدد";



  return (
    <tr className="bg-white *:rounded *:text-center *:py-4">
      <td>جهاز رقم {deviceId}</td>
      <td>{name}</td>
      <td>{formattedStartTime}</td>
      <td>{formattedEndTime}</td>
      <td className="flex flex-col justify-center items-center">
        {orders.map((el) => (
          <span key={el.id}>{`${el.quantity} ${el.name}`}</span>
        ))}
      </td>
      <td className="bg-green-400">{price}</td>
      {!isHistory && (
        <>
          <td className="bg-yellow-400 cursor-pointer">
            <span onClick={handlePauseTime}>إيقاف</span>
            {isPauseTime && (
              <AddRevenue
                startTime={startTime}
                isPauseTime={isPauseTime}
                deviceId={deviceId}
                id={id}
                setIsPauseTime={setIsPauseTime}
                setDataUpdated={setDataUpdated}
                dataUpdated={dataUpdated}
                ordersRevenue={ordersRevenue}
                price={price}
                name={name}
                orders={orders}
              />
            )}
          </td>
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
        </>
      )}
    </tr>
  );
};

export default TableBodyContent;
