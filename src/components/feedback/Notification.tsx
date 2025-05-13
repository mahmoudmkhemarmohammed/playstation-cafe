import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import sound from "@assets/sounds/timeout-90320.mp3";

interface Props {
  user: string | null;
  deviceId: number | null;
  closeNotif: () => void;
  onAddExtraTime: () => void;
  onEndSession: () => void;
}

const Notification = ({
  user,
  deviceId,
  closeNotif,
  onAddExtraTime,
  onEndSession,
}: Props) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 1;
      audioRef.current.play();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-28 right-5 bg-white px-8 py-4 rounded-lg shadow-lg z-50 flex flex-col items-center gap-3"
      >
        <span className="text-3xl">⏰</span>
        <span className="text-xl">انتهى وقت الجهاز رقم : {deviceId}</span>
        <span className="text-xl">المستخدم : {user}</span>

        <div className="flex gap-3 mt-2">
          <button
            onClick={onAddExtraTime}
            className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded-md cursor-pointer"
          >
            إضافة وقت
          </button>
          <button
            onClick={onEndSession}
            className="bg-red-700 hover:bg-red-800 text-white py-1 px-3 rounded-md cursor-pointer"
          >
            إنهاء الجلسة
          </button>
        </div>

        <span
          className="w-full text-center rounded-md p-2 bg-red-400 cursor-pointer mt-2"
          onClick={closeNotif}
        >
          إغلاق
        </span>

        <audio ref={audioRef} src={sound} loop />
      </motion.div>
    </AnimatePresence>
  );
};

export default Notification;