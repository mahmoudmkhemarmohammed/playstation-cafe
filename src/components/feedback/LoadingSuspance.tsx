import { Suspense } from "react";

const LoadingSuspance = ({ children }: { children: React.ReactNode }) => {
  const fallback = (
    <div className="fixed z-[1000] w-full h-full bg-gradient-to-r from-[#9face6] to-[#74ebd5] left-0 top-0 flex justify-center items-center">
      <div className="flex justify-center items-center min-h-heightLayout">
        <div className="relative w-48 h-48 flex justify-center items-center">
          {/* Rings */}
          <div className="absolute w-full h-full border-8 border-transparent rounded-full border-b-purple-400 animate-rotate1"></div>
          <div className="absolute w-full h-full border-8 border-transparent rounded-full border-b-pink-500 animate-rotate2"></div>
          <div className="absolute w-full h-full border-8 border-transparent rounded-full border-b-cyan-400 animate-rotate3"></div>
          <div className="absolute w-full h-full border-8 border-transparent rounded-full border-b-yellow-400 animate-rotate4"></div>

          {/* Loading Text */}
          <h3 className="text-white text-lg font-semibold">loading</h3>
        </div>
      </div>
    </div>
  );
  return <Suspense fallback={fallback}>{children}</Suspense>;
};

export default LoadingSuspance;