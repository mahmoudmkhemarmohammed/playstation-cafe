const Card = ({ message, count }: { message: string; count?: number | string }) => {
  return (
    <div className="bg-white p-3 rounded-lg text-center min-h-[250px] flex items-center flex-col justify-center shadow grow">
      <h2 className="text-2xl">{message}</h2>
      <h3 className="text-xl mt-4 bg-green-300 py-2 px-4 rounded">{count}</h3>
    </div>
  );
};

export default Card;
