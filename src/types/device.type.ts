import { TStatus } from "./status.type";

export type TDevice = {
  id: number;
  name: string;
  status: TStatus;
  handleNewSession: () => void;
  setDeviceId: (val:number) => void;
  handleExtraTime: () => void
  handleAddOrders: () => void
};
