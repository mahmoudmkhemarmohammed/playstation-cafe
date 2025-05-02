import { useEffect, useState } from "react";
import ModalForm from "@components/forms/ModalForm";
import PSCard from "@components/playstation/PSCard";
import TableBodyContent from "@components/playstation/TableBodyContent";
import TableHead from "@components/playstation/TableHead";
import actGetDevices from "@store/devices/act/actGetDevices";
import actGetUsers from "@store/users/act/actGetUsers";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import actEditeStatus from "@store/devices/act/actEditeStatus";
import Notification from "@components/feedback/Notification";
import ExtraTimeForm from "@components/forms/ExtraTimeForm";
import AddOrderForm from "@components/forms/AddOrderForm";
import actRemoveClient from "@store/users/act/actRemoveClient";
import actAddRevenues from "@store/revenues/act/actAddRevenues";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const Devices = () => {
  const [showModal, setShowModal] = useState(false);
  const [deviceId, setDeviceId] = useState(0);
  const [deviceIdMessage, setDeviceIdMessage] = useState<null | number>(null);
  const [nameMessage, setNameMessage] = useState<null | string>(null);
  const [dataUpdated, setDataUpdated] = useState(false);
  const [addExtraTime, setAddExtraTime] = useState(false);
  const [showAddOrderForm, setShowAddOrderForm] = useState(false);
  const [notifQueue, setNotifQueue] = useState<any[]>([]);
  const [showNotif, setShowNotif] = useState(false);
  const dispatch = useAppDispatch();

  const { data: devices, loading } = useAppSelector((state) => state.devices);
  const { data: users } = useAppSelector((state) => state.users);

  // Load data initially and when updated
  useEffect(() => {
    dispatch(actGetDevices());
    dispatch(actGetUsers());
  }, [dispatch, dataUpdated]);

  // Parse time using dayjs
  const parseTime = (timeStr: string) => {
    const now = dayjs();
    const [hourStr, minuteStr, period] = timeStr.split(/[:\s]/);
    let hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);

    if (period === "PM" && hour < 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;

    return now.hour(hour).minute(minute).second(0).millisecond(0);
  };

  // Auto-check for expired sessions
  useEffect(() => {
    const interval = setInterval(() => {
      const now = dayjs();
      const expiredUsers = users.filter((user) => {
        if (user.isOpenTime) return false;
        const endTime = parseTime(user.endTime);
        return now.isAfter(endTime);
      });

      if (expiredUsers.length > 0) {
        expiredUsers.forEach(async (user) => {
          try {
            await dispatch(
              actAddRevenues({
                date: new Date().toLocaleDateString("en-CA"),
                total: user.price,
              })
            ).unwrap();

            await dispatch(
              actEditeStatus({ deviceId: user.deviceId, status: "متاح" })
            ).unwrap();

            await dispatch(actRemoveClient(user.id)).unwrap();

            setNotifQueue((prev) => [
              ...prev,
              { name: user.name, deviceId: user.deviceId },
            ]);

            setDataUpdated((prev) => !prev);
          } catch (error) {
            console.error("Error handling finished session:", error);
          }
        });
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [users, dispatch]);

  // Show one notification at a time from queue
  useEffect(() => {
    if (!showNotif && notifQueue.length > 0) {
      const next = notifQueue[0];
      setDeviceIdMessage(next.deviceId);
      setNameMessage(next.name);
      setShowNotif(true);
      setNotifQueue((prev) => prev.slice(1));
    }
  }, [notifQueue, showNotif]);

  const closeNotif = () => {
    setShowNotif(false);
  };

  const handleNewSession = () => {
    setShowModal(true);
  };

  const handleExtraTime = () => {
    setAddExtraTime(true);
  };

  const handleAddOrders = () => {
    setShowAddOrderForm(true);
  };

  return (
    <div className="container">
      {showNotif && (
        <Notification
          deviceId={deviceIdMessage}
          user={nameMessage}
          closeNotif={closeNotif}
        />
      )}

      {showModal && (
        <ModalForm
          setShowModal={setShowModal}
          showModal={showModal}
          deviceId={deviceId}
          setDataUpdated={setDataUpdated}
          dataUpdated={dataUpdated}
        />
      )}

      {addExtraTime && (
        <ExtraTimeForm
          deviceId={deviceId}
          setDataUpdated={setDataUpdated}
          dataUpdated={dataUpdated}
          setAddExtraTime={setAddExtraTime}
        />
      )}

      {showAddOrderForm && (
        <AddOrderForm
          deviceId={deviceId}
          setShowAddOrders={setShowAddOrderForm}
          showAddOrders={showAddOrderForm}
          dataUpdated={dataUpdated}
          setDataUpdated={setDataUpdated}
        />
      )}

      <div className="devices gridList">
        {loading === "pending" ? (
          <p className="text-4xl">جاري التحميل</p>
        ) : (
          devices.map((el) => (
            <PSCard
              key={el.id}
              {...el}
              handleNewSession={handleNewSession}
              setDeviceId={setDeviceId}
              handleExtraTime={handleExtraTime}
              handleAddOrders={handleAddOrders}
            />
          ))
        )}
      </div>

      <div className="users">
        <div className="w-full overflow-x-auto mt-2">
          <table className="min-w-max w-full border-separate border-spacing-2">
            <TableHead />
            <tbody>
              {users.map((user) => (
                <TableBodyContent
                  key={user.id}
                  {...user}
                  dataUpdated={dataUpdated}
                  setDataUpdated={setDataUpdated}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Devices;
