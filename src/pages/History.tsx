import TableBodyContent from "@components/playstation/TableBodyContent";
import TableHead from "@components/playstation/TableHead";
import actGetClients from "@store/history/act/actGetClients";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { useEffect } from "react";

const History = () => {
  const dispatch = useAppDispatch();
  const { users, loading } = useAppSelector((state) => state.history);

  useEffect(() => {
    dispatch(actGetClients());
  }, [dispatch]);
  return (
    <div className="container">
      <h2 className="text-4xl font-bold">الجلسات المنتهية</h2>
      {loading === "pending" ? (
        <h2 className="text-2xl">جاري التحميل</h2>
      ) : (
        <table className="min-w-max w-full border-separate border-spacing-2 mt-3">
          <TableHead isHistory={true}/>
          <tbody>
            {users.map((user) => (
              <TableBodyContent
                key={user.id}
                {...user}
                isHistory={true}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default History;
