import { useAppDispatch, useAppSelector } from "@store/hooks";
import actGetProducts from "@store/products/act/actGetProducts";
import actAddClient from "@store/users/act/actAddClient";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addSessionSchema,
  TaddSessionSchema,
} from "@validations/addSessionSchema";
import { TOrder, TProduct } from "@types";
import actEditeStatus from "@store/devices/act/actEditeStatus";
import dayjs from "dayjs";
import actChangeProductQuantity from "@store/products/act/actChangeProductQuantity";

const useModalForm = (
  deviceId: number,
  setShowModal: (val: boolean) => void,
  showModal: boolean,
  setDataUpdated: (val: boolean) => void,
  dataUpdated: boolean
) => {
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((state) => state.products);

  const [orders, setOrders] = useState<TOrder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenTime, setIsOpenTime] = useState<boolean>(false);
  const [sessionType, setSessionType] = useState<"زوجي" | "متعدد">("زوجي");

  const currentTime = new Date();

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<TaddSessionSchema>({
    resolver: zodResolver(addSessionSchema),
    mode: "onBlur",
  });

  // --------- حساب سعر الجلسة بناءً على الوقت ونوع الجلسة ---------
  const calculateSessionPrice = (): number => {
    const time = watch("time") || 0;
    const pricePerMinute = sessionType === "زوجي" ? 0.5 : 0.75;
    return time * pricePerMinute;
  };

  // --------- Calculations ---------
  const calculateOrdersRevenue = (): number =>
    orders.reduce((total, order) => {
      const product = products.find((p: TProduct) => p.id === order.id);
      return product ? total + product.price * order.quantity : total;
    }, 0);

  const calculateSessionRevenue = (): number =>
    isOpenTime ? 0 : calculateSessionPrice();

  const calculateTotal = (): number =>
    calculateOrdersRevenue() + calculateSessionRevenue();

  const showTotal = (): boolean => {
    const time = watch("time") || 0;
    const hasValidOrders = orders.some((order) => order.quantity > 0);
    return (time > 0 && !isOpenTime) || hasValidOrders;
  };

  // --------- Handlers ---------
  const handleProductClick = (product: TProduct) => {
    if (!orders.find((order) => order.id === product.id)) {
      setOrders((prevOrders) => [
        ...prevOrders,
        { id: product.id, name: product.name, quantity: 1 },
      ]);
    }
  };

  const handleQuantityChange = (id: number, value: number) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, quantity: value } : order
      )
    );
  };

  const onSubmit = (data: TaddSessionSchema) => {
    setIsLoading(true);

    const endTime =
      !isOpenTime && data.time
        ? new Date(currentTime.getTime() + data.time * 60 * 1000)
        : null;

    const filteredOrders = orders.filter((order) => order.quantity > 0);
    const sessionRevenue = isOpenTime ? 0 : calculateSessionPrice();
    const ordersRevenue = calculateOrdersRevenue();
    const totalPrice = sessionRevenue + ordersRevenue;

    const formData = {
      name: data.name,
      startTime: dayjs(currentTime).toISOString(),
      endTime: isOpenTime || !endTime ? null : dayjs(endTime).toISOString(),
      orders: filteredOrders,
      price: isOpenTime ? "----" : totalPrice,
      deviceId,
      sessionPrice: sessionRevenue,
      isOpenTime,
    };

    dispatch(actAddClient(formData))
      .unwrap()
      .then(() => {
        if (orders.length > 0) {
          dispatch(actChangeProductQuantity(orders));
        }
      })
      .then(() => {
        dispatch(actEditeStatus({ deviceId, status: "مستخدم" }));
        setTimeout(() => {
          setDataUpdated(!dataUpdated);
          setShowModal(!showModal);
          setIsLoading(false);
        }, 1500);
      });
  };

  // --------- Effects ---------
  useEffect(() => {
    dispatch(actGetProducts());
  }, [dispatch]);

  return {
    handleSubmit,
    onSubmit,
    register,
    errors,
    products,
    handleProductClick,
    handleQuantityChange,
    orders,
    showTotal,
    calculateTotal,
    isLoading,
    isOpenTime,
    setIsOpenTime,
    setSessionType
  };
};

export default useModalForm;
