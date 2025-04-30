import { zodResolver } from "@hookform/resolvers/zod";
import actAuthLogin from "@store/auth/act/actAuthLogin";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { signInSchema, TsignInType } from "@validations/signInSchema";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<TsignInType>({
    resolver: zodResolver(signInSchema),
    mode: "onBlur",
  });

  const submitForm: SubmitHandler<TsignInType> = (data) => {
    dispatch(actAuthLogin(data))
      .unwrap()
      .then(() => navigate("/home"));
  };
  return (
    <div className="h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit(submitForm)}
        className="bg-white shadow w-[400px] h-[400px] rounded-lg p-7"
      >
        <h2 className="text-2xl text-center mb-7">تسجيل الدخول الي النظام</h2>
        <div className="flex flex-col w-full">
          <label htmlFor="email" className="text-xl">
            الإيميل
          </label>
          <input
            type="email"
            id="email"
            {...register("email")}
            className="w-full p-3 bg-slate-200 my-2"
          />
          <p className="text-red-300">
            {errors?.email?.message && errors.email.message}
          </p>
        </div>
        <div>
          <label htmlFor="password" className="text-xl">
            كلمة السر
          </label>
          <input
            type="password"
            id="password"
            {...register("password")}
            className="w-full p-3 bg-slate-200 my-2"
          />
          <p className="text-red-300">
            {errors?.password?.message && errors.password.message}
          </p>
        </div>
        <input
          type="submit"
          value={loading === "pending" ? "جاري التحميل" : "دخول"}
          className="w-full bg-green-400 p-4 rounded cursor-pointer"
        />
        {error && <p className="text-red-300">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
