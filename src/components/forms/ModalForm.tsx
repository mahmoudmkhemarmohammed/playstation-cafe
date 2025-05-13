import Loading from "@components/feedback/Loading";
import useModalForm from "@hooks/useModalForm";
import { TProduct } from "@types";

const ModalForm = ({
  setShowModal,
  showModal,
  deviceId,
  setDataUpdated,
  dataUpdated,
}: {
  setShowModal: (value: boolean) => void;
  showModal: boolean;
  deviceId: number;
  setDataUpdated: (val: boolean) => void;
  dataUpdated: boolean;
}) => {
  const {
    handleSubmit,
    onSubmit,
    register,
    errors,
    products,
    handleProductClick,
    handleQuantityChange,
    orders,
    showTotal,
    calculateTotal,
    isLoading,
    isOpenTime,
    setIsOpenTime,
    setSessionType
  } = useModalForm(
    deviceId,
    setShowModal,
    showModal,
    setDataUpdated,
    dataUpdated,
  );

  return (
    <div className="fixed z-[1000] w-full h-full bg-gradient-to-r from-[#9face6] to-[#74ebd5] left-0 top-0 flex justify-center items-center">
      {isLoading ? (
        <Loading />
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white w-[450px] shadow rounded-xl p-3 flex flex-col gap-3 py-7 px-5 *:flex *:flex-col"
        >
          <h2 className="text-center text-2xl">إنشاء طلب</h2>

          <div>
            <label htmlFor="name" className="text-[18px]">
              الاسم
            </label>
            <input
              id="name"
              type="text"
              {...register("name")}
              className="bg-gradient-to-r from-[#9face6] to-[#74ebd5] p-3 mt-2 rounded"
            />
            {errors.name && (
              <span className="text-red-600 text-sm mt-1">
                {errors.name.message}
              </span>
            )}
          </div>

          <div className="flex-row! gap-2">
            <input
              type="checkbox"
              id="openTime"
              className="w-5 h-5"
              onChange={() => setIsOpenTime(!isOpenTime)}
            />
            <label htmlFor="openTime" className="text-[18px]">
              وقت مفتوح
            </label>
          </div>

          <div className="flex flex-row! gap-2">

            <div className="flex items-center gap-2">
              <input className="w-5 h-5" type="radio" id="ood" name="type" defaultChecked onChange={() => setSessionType("زوجي")}/>
              <label htmlFor="ood">زوجي</label>
            </div>

            <div className="flex items-center gap-2">
              <input className="w-5 h-5" type="radio" id="multi" name="type" onChange={() => setSessionType("متعدد")}/>
              <label htmlFor="multi">متعدد</label>
            </div>

          </div>

          {!isOpenTime && (
            <div>
              <label htmlFor="time" className="text-[18px]">
                الوقت (بالدقائق)
              </label>
              <input
                defaultValue={1}
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
          )}

          <div>
            <label className="text-[18px]">المأكولات / المشروبات</label>
            <div className="flex justify-between flex-wrap gap-2 mt-3 overflow-y-scroll h-[110px]">
              {products
                .filter((product) => product.quantity > 0)
                .map((product: TProduct) => {
                  const selectedOrder = orders.find(
                    (order) => order.id === product.id
                  );
                  return (
                    <div
                      key={product.id}
                      className="flex justify-between items-center gap-2 bg-gradient-to-r from-[#9face6] to-[#74ebd5] p-2 rounded w-[45%] cursor-pointer"
                      onClick={() => handleProductClick(product)}
                    >
                      {product.name}
                      {selectedOrder && (
                        <input
                          type="number"
                          value={selectedOrder.quantity}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            handleQuantityChange(
                              product.id,
                              Number(e.target.value)
                            )
                          }
                          className="bg-white h-full min-w-[10%] rounded border-0 outline-0 p-1"
                        />
                      )}
                    </div>
                  );
                })}
            </div>
          </div>

          {showTotal() && (
            <p className="text-right font-bold text-lg">
              الإجمالي: {calculateTotal()} جنيه
            </p>
          )}

          <input
            type="submit"
            value="حفظ"
            className="text-[18px] bg-green-400 p-2 rounded-md cursor-pointer"
          />
          <button
            onClick={() => setShowModal(!showModal)}
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

export default ModalForm;
