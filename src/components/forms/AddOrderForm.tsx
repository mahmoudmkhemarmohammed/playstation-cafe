import { useAppDispatch, useAppSelector } from "@store/hooks";
import { TProduct } from "@types";
import { useEffect, useState } from "react";
import actAddOrderToClient from "@store/users/act/actAddOrders";
import actGetProducts from "@store/products/act/actGetProducts";
import Loading from "@components/feedback/Loading";

const AddOrderForm = ({
  deviceId,
  setShowAddOrders,
  showAddOrders,
  dataUpdated,
  setDataUpdated,
}: {
  deviceId: number;
  setShowAddOrders: (val: boolean) => void;
  showAddOrders: boolean;
  dataUpdated: boolean;
  setDataUpdated: (val: boolean) => void;
}) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { products } = useAppSelector((state) => state.products);
  const [orders, setOrders] = useState<
    { id: number; name: string; quantity: number }[]
  >([]);

  const totalPrice = orders.reduce((total, order) => {
    const product = products.find((p) => p.id === order.id);
    return total + (product ? product.price * order.quantity : 0);
  }, 0);

  const handleProductClick = (product: TProduct) => {
    setOrders((prev) => {
      const existing = prev.find((order) => order.id === product.id);
      if (existing) return prev;
      return [...prev, { id: product.id, name: product.name, quantity: 1 }];
    });
  };

  const handleQuantityChange = (productId: number, quantity: number) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === productId ? { ...order, quantity } : order
      )
    );
  };

  const handleSaveOrders = () => {
    setIsLoading(!isLoading);
    orders.forEach((order) => {
      dispatch(
        actAddOrderToClient({
          deviceId: deviceId,
          newOrder: order,
          totalPrice,
        })
      )
        .unwrap()
        .then(() => {
          setTimeout(() => {
            setDataUpdated(!dataUpdated);
            setShowAddOrders(!showAddOrders);
            setIsLoading(!isLoading);
          }, 1500);
        });
    });
    setOrders([]);
  };

  useEffect(() => {
    dispatch(actGetProducts());
  }, [dispatch]);
  return (
    <div className="fixed w-full h-full bg-gradient-to-r from-[#9face6] to-[#74ebd5] left-0 top-0 flex justify-center items-center">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="bg-white w-[450px] shadow rounded-xl p-3 flex flex-col gap-3 py-7 px-5 *:flex *:flex-col">
          <h2 className="text-center text-2xl">إضافة مشروب</h2>

          <div>
            <label className="text-[18px]">المأكولات / المشروبات</label>
            <div className="flex justify-between flex-wrap gap-2 mt-3">
              {products.map((product: TProduct) => {
                const selectedOrder = orders.find(
                  (order) => order.id === product.id
                );
                return (
                  <div
                    key={product.id}
                    className="relative flex justify-between items-center gap-2 bg-gradient-to-r from-[#9face6] to-[#74ebd5] p-2 rounded w-[45%] cursor-pointer"
                    onClick={() => handleProductClick(product)}
                  >
                    {product.name}
                    {selectedOrder && (
                      <>
                        <input
                          type="number"
                          value={selectedOrder.quantity}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            handleQuantityChange(
                              product.id,
                              Number(e.target.value)
                            )
                          }
                          className="bg-white h-full w-[50px] rounded border-0 outline-0 p-1"
                          min={1}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOrders((prev) =>
                              prev.filter((o) => o.id !== product.id)
                            );
                          }}
                          className="text-red-600 text-xs font-bold bg-white p-2 rounded cursor-pointer"
                        >
                          حذف
                        </button>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {orders.length > 0 && (
            <p className="text-right text-lg font-semibold mt-2">
              السعر الإجمالي: {totalPrice} جنيه
            </p>
          )}

          <button
            onClick={handleSaveOrders}
            disabled={orders.length === 0}
            className={`text-[18px] p-2 rounded-md cursor-pointer ${
              orders.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-400"
            }`}
          >
            حفظ
          </button>

          <button
            onClick={() => setShowAddOrders(!showAddOrders)}
            type="button"
            className="text-[18px] bg-red-400 p-2 rounded-md cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      )}
    </div>
  );
};

export default AddOrderForm;
