import { Suspense } from "react";
import { FiLoader } from "react-icons/fi";

const LoadingSuspance = ({ children }: { children: React.ReactNode }) => {
  const fallback = (
    <div className="fixed z-[1000] w-full h-full bg-gradient-to-r from-[#9face6] to-[#74ebd5] left-0 top-0 flex justify-center items-center">
        <FiLoader className={"animate-spin"} size={70}/>
    </div>
  );
  return <Suspense fallback={fallback}>{children}</Suspense>;
};

export default LoadingSuspance;
