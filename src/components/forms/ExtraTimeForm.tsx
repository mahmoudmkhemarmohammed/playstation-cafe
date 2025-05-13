import Loading from "@components/feedback/Loading";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "@store/hooks";
import actAddExtraTime from "@store/users/act/actAddExtraTime";
import actGetClientByDeviceId from "@store/users/act/actGetClientByDeviceId";
import {
  addExtraTimeSchema,
  TaddExtraTimeSchema,
} from "@validations/addExtraTimeSchema";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const ExtraTimeForm = ({
  deviceId,
  setDataUpdated,
  dataUpdated,
  setAddExtraTime,
}: {
  deviceId: number;
  setAddExtraTime: (val: boolean) => void;
  setDataUpdated: (val: boolean) => void;
  dataUpdated: boolean;
}) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [sessionType, setSessionType] = useState<"زوجي" | "متعدد">("زوجي");

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<TaddExtraTimeSchema>({
    resolver: zodResolver(addExtraTimeSchema),
    mode: "onBlur",
  });

  const submitForm = (data: TaddExtraTimeSchema) => {
    setIsLoading(true);
    dispatch(
      actAddExtraTime({
        deviceId,
        extraTime: data.time,
        price: sessionType === "زوجي" ? data.time * 0.5 : data.time * 0.75,
      })
    )
      .unwrap()
      .then(() => {
        setTimeout(() => {
          setIsLoading(false);
          setDataUpdated(!dataUpdated);
          setAddExtraTime(false);
        }, 1500);
      });
  };

  useEffect(() => {
    dispatch(actGetClientByDeviceId(deviceId));
  }, [dispatch, deviceId]);

  return (
    <div className="fixed z-[1000] w-full h-full bg-gradient-to-r from-[#9face6] to-[#74ebd5] left-0 top-0 flex justify-center items-center">
      {isLoading ? (
        <Loading />
      ) : (
        <form
          onSubmit={handleSubmit(submitForm)}
          className="bg-white w-[450px] shadow rounded-xl p-3 flex flex-col gap-3 py-7 px-5 *:flex *:flex-col"
        >
          <h2 className="text-center text-2xl">إضافة وقت إضافي</h2>

          <div>
            <label htmlFor="time" className="text-[18px]">
              الوقت (بالدقائق)
            </label>
            <input
              id="time"
              type="number"
              {...register("time", { valueAsNumber: true })}
              className="bg-gradient-to-r from-[#9face6] to-[#74ebd5] p-3 mt-2 rounded"
            />
            {errors.time && (
              <span className="text-red-600 text-sm mt-1">
                {errors.time.message}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <div className="flex items-center gap-2">
              <input
                className="w-5 h-5"
                type="radio"
                id="ood"
                name="type"
                onChange={() => setSessionType("زوجي")}
              />
              <label htmlFor="ood">زوجي</label>
            </div>

            <div className="flex items-center gap-2">
              <input
                className="w-5 h-5"
                type="radio"
                id="multi"
                name="type"
                onChange={() => setSessionType("متعدد")}
              />
              <label htmlFor="multi">متعدد</label>
            </div>
          </div>

          <input
            type="submit"
            value="حفظ"
            className="text-[18px] bg-green-400 p-2 rounded-md cursor-pointer"
          />
          <button
            onClick={() => setAddExtraTime(false)}
            type="button"
            className="text-[18px] bg-red-400 p-2 rounded-md cursor-pointer"
          >
            إغلاق
          </button>
        </form>
      )}
    </div>
  );
};

export default ExtraTimeForm;
