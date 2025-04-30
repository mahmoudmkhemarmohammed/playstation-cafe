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

  // Parse time helper
  const parseTime = (timeStr: string): Date => {
    const [hourStr, minuteStr, period] = timeStr.split(/[:\s]/);
    let hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);

    if (period === "PM" && hour < 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;

    const now = new Date();
    now.setSeconds(0);
    now.setMilliseconds(0);
    now.setHours(hour);
    now.setMinutes(minute);

    return now;
  };

  // Auto-check for expired sessions
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const expiredUsers = users.filter((user) => {
        const endTime = parseTime(user.endTime);
        return now >= endTime;
      });

      if (expiredUsers.length > 0) {
        expiredUsers.forEach(async (user) => {
          try {
            // Add revenue once per user
            await dispatch(
              actAddRevenues({
                date: new Date().toLocaleDateString("en-CA"),
                total: user.price,
              })
            ).unwrap();

            // Set device to available
            await dispatch(
              actEditeStatus({ deviceId: user.deviceId, status: "متاح" })
            ).unwrap();

            // Remove client from list
            await dispatch(actRemoveClient(user.id)).unwrap();

            // Queue notification
            setNotifQueue((prev) => [...prev, { name: user.name, deviceId: user.deviceId }]);

            // Trigger update
            setDataUpdated((prev) => !prev);
          } catch (error) {
            console.error("Error handling finished session:", error);
          }
        });
      }
    }, 30000); // Every 30s

    return () => clearInterval(interval);
  }, [users, dispatch]);

  // Show one notification at a time from queue
  useEffect(() => {
    if (!showNotif && notifQueue.length > 0) {
      const next = notifQueue[0];
      setDeviceIdMessage(next.deviceId);
      setNameMessage(next.name);
      setShowNotif(true);
      setNotifQueue((prev) => prev.slice(1)); // remove from queue
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
      {/* Notification */}
      {showNotif && (
        <Notification
          deviceId={deviceIdMessage}
          user={nameMessage}
          closeNotif={closeNotif}
        />
      )}

      {/* Modal Form */}
      {showModal && (
        <ModalForm
          setShowModal={setShowModal}
          showModal={showModal}
          deviceId={deviceId}
          setDataUpdated={setDataUpdated}
          dataUpdated={dataUpdated}
        />
      )}

      {/* Extra Time Form */}
      {addExtraTime && (
        <ExtraTimeForm
          deviceId={deviceId}
          setDataUpdated={setDataUpdated}
          dataUpdated={dataUpdated}
          setAddExtraTime={setAddExtraTime}
        />
      )}

      {/* Add Order Form */}
      {showAddOrderForm && (
        <AddOrderForm
          deviceId={deviceId}
          setShowAddOrders={setShowAddOrderForm}
          showAddOrders={showAddOrderForm}
          dataUpdated={dataUpdated}
          setDataUpdated={setDataUpdated}
        />
      )}

      {/* Devices */}
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

      {/* Active Sessions Table */}
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