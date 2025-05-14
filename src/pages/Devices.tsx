import { useEffect, useState, useCallback } from "react";
import ModalForm from "@components/forms/ModalForm";
import PSCard from "@components/playstation/PSCard";
import TableBodyContent from "@components/playstation/TableBodyContent";
import TableHead from "@components/playstation/TableHead";
import actGetDevices from "@store/devices/act/actGetDevices";
import actGetUsers from "@store/users/act/actGetUsers";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import actEditeStatus from "@store/devices/act/actEditeStatus";
import ExtraTimeForm from "@components/forms/ExtraTimeForm";
import AddOrderForm from "@components/forms/AddOrderForm";
import actRemoveClient from "@store/users/act/actRemoveClient";
import actAddRevenues from "@store/revenues/act/actAddRevenues";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Notification from "@components/feedback/Notification";
import actAddClientToHistory from "@store/history/act/actAddClientToHistory";

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
  const [notifiedUsers, setNotifiedUsers] = useState<number[]>([]);
  const [processingSessions, setProcessingSessions] = useState<number[]>([]);
  const [processedUserIds, setProcessedUserIds] = useState<number[]>([]);
  const [isEndSession,setIsEndSession] = useState(false)

  const dispatch = useAppDispatch();
  const { data: devices, loading } = useAppSelector((state) => state.devices);
  const { data: users } = useAppSelector((state) => state.users);

  useEffect(() => {
    dispatch(actGetDevices());
    dispatch(actGetUsers());
  }, [dispatch, dataUpdated]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = dayjs().tz("Africa/Cairo");

      const expiredUsers = users.filter((user) => {
        if (user.isOpenTime || !user.endTime) return false;
        if (notifiedUsers.includes(user.id)) return false;

        const endTime = dayjs(user.endTime).tz("Africa/Cairo");
        return now.isAfter(endTime);
      });

      if (expiredUsers.length > 0) {
        expiredUsers.forEach((user) => {
          setNotifQueue((prev) => [
            ...prev,
            { name: user.name, deviceId: user.deviceId, userId: user.id },
          ]);

          setNotifiedUsers((prev) => [...prev, user.id]);
        });
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [users, notifiedUsers]);

  useEffect(() => {
    if (!showNotif && notifQueue.length > 0) {
      const next = notifQueue[0];
      setDeviceIdMessage(next.deviceId);
      setNameMessage(next.name);
      setShowNotif(true);
      setNotifQueue((prev) => prev.slice(1));
    }
  }, [notifQueue, showNotif]);

  const handleNewSession = () => {
    setShowModal(true);
  };

  const handleExtraTime = () => {
    setAddExtraTime(true);
  };

  const handleAddOrders = () => {
    setShowAddOrderForm(true);
  };

  const closeNotif = () => {
    setShowNotif(false);
  };

  const handleAddExtraTime = (deviceId: number | null) => {
    if (!deviceId) return;
    setDeviceId(deviceId);
    setAddExtraTime(true);
    setShowNotif(false);
  };

  const handleEndSession = useCallback(
    async (deviceId: number | null) => {
      setIsEndSession(true)
      if (!deviceId) return;
      if (processingSessions.includes(deviceId)) return;

      const user = users.find((u) => u.deviceId === deviceId);
      if (!user || processedUserIds.includes(user.id)) return;

      setProcessingSessions((prev) => [...prev, deviceId]);
      setProcessedUserIds((prev) => [...prev, user.id]);

      try {
        
        await dispatch(
          actAddRevenues({
            date: dayjs().tz("Africa/Cairo").format("YYYY-MM-DD"),
            total: user.price,
          })
        ).unwrap();
        
        await dispatch(actAddClientToHistory(user)).unwrap();
        await dispatch(actEditeStatus({ deviceId, status: "متاح" })).unwrap();
        await dispatch(actRemoveClient(user.id)).unwrap();

        setDataUpdated((prev) => !prev);
        setShowNotif(false);
        setIsEndSession(false)
      } catch (error) {
        console.error("Error ending session:", error);
      } finally {
        setProcessingSessions((prev) =>
          prev.filter((id) => id !== deviceId)
        );
        setIsEndSession(false)
      }
    },
    [dispatch, users, processingSessions, processedUserIds]
  );

  return (
    <div className="container">
      {showNotif && (
        <Notification
          deviceId={deviceIdMessage}
          user={nameMessage}
          closeNotif={closeNotif}
          onAddExtraTime={() => handleAddExtraTime(deviceIdMessage)}
          onEndSession={() => handleEndSession(deviceIdMessage)}
          isEndSession={isEndSession}
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
            <TableHead isHistory={false} />
            <tbody>
              {users.map((user) => (
                <TableBodyContent
                  key={user.id}
                  {...user}
                  dataUpdated={dataUpdated}
                  setDataUpdated={setDataUpdated}
                  isHistory={false}
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