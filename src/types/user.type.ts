export type TOrder = {
  id: number;
  name: string;
  quantity: number;
};

export type TUser = {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  orders: TOrder[];
  price: number;
  deviceId: number;
  isOpenTime: boolean;
};

export type TOwner = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "user";
};
