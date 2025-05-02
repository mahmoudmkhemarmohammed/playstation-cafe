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

const useModalForm = (
  deviceId: number,
  setShowModal: (val: boolean) => void,
  showModal: boolean,
  setDataUpdated: (val: boolean) => void,
  dataUpdated: boolean
) => {
  const currentTime = new Date();
  const [orders, setOrders] = useState<TOrder[]>([]);
  const [sessionPrice, setSessionPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenTime, setIsOpenTime] = useState(false);

  const dispatch = useAppDispatch();
  const { products } = useAppSelector((state) => state.products);

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<TaddSessionSchema>({
    resolver: zodResolver(addSessionSchema),
    mode: "onBlur",
  });

  const calculateOrdersRevenue = (): number => {
    return orders.reduce((total, order) => {
      const product = products.find((p: TProduct) => p.id === order.id);
      return product ? total + product.price * order.quantity : total;
    }, 0);
  };

  const calculateSessionRevenue = (): number => {
    return sessionPrice;
  };

  const calculateTotal = (): number => {
    return calculateOrdersRevenue() + calculateSessionRevenue();
  };

  const showTotal = (): boolean => {
    const time = watch("time") || 0;
    const hasValidOrders = orders.some((order) => order.quantity > 0);
    return (sessionPrice > 0 && time > 0 && !isOpenTime) || hasValidOrders;
  };

  const handleProductClick = (product: TProduct) => {
    if (!orders.find((order) => order.id === product.id)) {
      setOrders([
        ...orders,
        { id: product.id, name: product.name, quantity: 1 },
      ]);
    }
  };

  const handleQuantityChange = (id: number, value: number) => {
    const updatedOrders = orders.map((order) =>
      order.id === id ? { ...order, quantity: value } : order
    );
    setOrders(updatedOrders);
  };

  const onSubmit = (data: TaddSessionSchema) => {
    setIsLoading(true);

    const endTime =
      !isOpenTime && data.time
        ? new Date(currentTime.getTime() + data.time * 60 * 1000)
        : null;

    const filteredOrders = orders.filter((order) => order.quantity > 0);
    const sessionRevenue = isOpenTime ? 0 : calculateSessionRevenue();
    const ordersRevenue = calculateOrdersRevenue();
    const totalPrice = sessionRevenue + ordersRevenue;

    const formData = {
      name: data.name,
      startTime: dayjs(currentTime).toISOString(),
      endTime: isOpenTime || !endTime ? null : dayjs(endTime).toISOString(),
      orders: filteredOrders,
      price: isOpenTime ? "----" : totalPrice,
      deviceId,
      sessionPrice: isOpenTime ? 0 : sessionPrice,
      isOpenTime,
    };

    dispatch(actAddClient(formData))
      .unwrap()
      .then(() => {
        dispatch(actEditeStatus({ deviceId, status: "مستخدم" }));
        setTimeout(() => {
          setDataUpdated(!dataUpdated);
          setShowModal(!showModal);
          setIsLoading(false);
        }, 1500);
      });
  };

  useEffect(() => {
    dispatch(actGetProducts());
  }, [dispatch]);

  return {
    handleSubmit,
    onSubmit,
    register,
    errors,
    sessionPrice,
    setSessionPrice,
    products,
    handleProductClick,
    handleQuantityChange,
    orders,
    showTotal,
    calculateTotal,
    isLoading,
    isOpenTime,
    setIsOpenTime,
  };
};

export default useModalForm;