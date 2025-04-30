import { motion, AnimatePresence } from "motion/react";

const ConfirmModal = ({
  onClose,
  onConfirm,
  message,
}: {
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed top-0 left-0 w-full h-full bg-black/40 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.7, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-[400px] text-center"
        >
          <h2 className="text-xl font-semibold mb-4">{message}</h2>
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md cursor-pointer"
            >
              إغلاق
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md cursor-pointer"
            >
              موافق
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConfirmModal;
