import TableHead from "@components/playstation/TableHead";
import actGetClients from "@store/history/act/actGetClients";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useEffect } from "react";

dayjs.extend(utc);
dayjs.extend(timezone);

const History = () => {
  const dispatch = useAppDispatch();
  const { users, loading } = useAppSelector((state) => state.history);

  useEffect(() => {
    dispatch(actGetClients());
  }, [dispatch]);

  return (
    <div className="container px-4">
      <h2 className="text-3xl md:text-4xl font-bold">الجلسات المنتهية</h2>
      {loading === "pending" ? (
        <h2 className="text-2xl">جاري التحميل...</h2>
      ) : (
        <div className="overflow-x-auto">
          <table className="hidden md:table min-w-max w-full border-separate border-spacing-2 mt-3">
            <TableHead isHistory={true} />
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="bg-white *:rounded *:text-center *:py-4"
                >
                  <td>جهاز رقم {user.deviceId}</td>
                  <td>{user.name}</td>
                  <td>
                    {dayjs(user.startTime).tz("Africa/Cairo").format("hh:mm A")}
                  </td>
                  <td>
                    {user.endTime
                      ? dayjs(user.endTime).tz("Africa/Cairo").format("hh:mm A")
                      : "غير محدد"}
                  </td>
                  <td>
                    {user.orders.length > 0 ? (
                      <div className="flex flex-col items-center gap-1">
                        {user.orders.map((el) => (
                          <span key={el.id}>{`${el.quantity} ${el.name}`}</span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">لا يوجد طلبات</span>
                    )}
                  </td>
                  <td className="bg-green-400 font-bold">{user.price} ج.م</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Responsive Cards for mobile */}
          <div className="flex flex-col gap-4 md:hidden mt-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded shadow-md p-4 flex flex-col gap-2"
              >
                <div className="font-semibold text-lg">
                  جهاز رقم {user.deviceId}
                </div>
                <div>
                  <span className="font-medium">الاسم:</span> {user.name}
                </div>
                <div>
                  <span className="font-medium">وقت البدء:</span>{" "}
                  {dayjs(user.startTime).tz("Africa/Cairo").format("hh:mm A")}
                </div>
                <div>
                  <span className="font-medium">وقت الانتهاء:</span>{" "}
                  {user.endTime
                    ? dayjs(user.endTime).tz("Africa/Cairo").format("hh:mm A")
                    : "غير محدد"}
                </div>
                <div>
                  <span className="font-medium">الطلبات:</span>{" "}
                  {user.orders.length > 0 ? (
                    <div className="flex flex-col gap-1 mt-1">
                      {user.orders.map((el) => (
                        <span key={el.id}>{`${el.quantity} ${el.name}`}</span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400 ml-1">لا يوجد طلبات</span>
                  )}
                </div>
                <div className="font-bold text-green-500">
                  {user.price} ج.م
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default History;