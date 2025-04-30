// components/ui/Notification.tsx
import { AnimatePresence, motion } from "motion/react";
import sound from "@assets/sounds/timeout-90320.mp3";
interface Props {
  user: string | null;
  deviceId: number | null;
  closeNotif: () => void;
}

const Notification = ({ user, deviceId, closeNotif }: Props) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-5 right-5 bg-red-500 text-white px-8 py-4 rounded-lg shadow-lg z-50 flex flex-col items-center gap-3"
      >
        <span className="text-3xl">⏰</span>
        <span className="text-xl">إنتهي وقت الجهاز رقم : {deviceId}</span>
        <span className="text-xl">المستخدم : {user}</span>
        <span
          className="w-full text-center text-red-400 rounded-md p-2 bg-white cursor-pointer"
          onClick={closeNotif}
        >
          إغلاق
        </span>
        <audio src={sound} autoPlay loop></audio>
      </motion.div>
    </AnimatePresence>
  );
};

export default Notification;
