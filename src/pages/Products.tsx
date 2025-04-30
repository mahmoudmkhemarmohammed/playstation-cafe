import { zodResolver } from "@hookform/resolvers/zod";
import { CiEdit } from "react-icons/ci";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import actAddProducts from "@store/products/act/actAddProducts";
import actGetProducts from "@store/products/act/actGetProducts";
import {
  addProductSchema,
  TaddProductSchema,
} from "@validations/addProductSchema";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import actEditProduct from "@store/products/act/actEditProduct";

const Products = () => {
  const { products } = useAppSelector((state) => state.products);
  const dispatch = useAppDispatch();
  const [isAddProduct, setIsAddProduct] = useState(false);
  const [isEditProduct, setIsEditProduct] = useState(false);
  const [dataUpdated, setDataUpdated] = useState(false);
  const [productId, setProductId] = useState<number | null>(null);
  const [productInfo, setProductInfo] = useState<null | {
    name: string;
    price: number;
  }>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaddProductSchema>({
    resolver: zodResolver(addProductSchema),
    mode: "onBlur",
  });

  const submitForm = (data: TaddProductSchema) => {
    dispatch(actAddProducts(data))
      .unwrap()
      .then(() => {
        setDataUpdated(!dataUpdated);
        setIsAddProduct(!isAddProduct);
      });
  };

  const saveChanges = (data: TaddProductSchema) => {
    dispatch(actEditProduct({ ...data, productId }))
      .unwrap()
      .then(() => {
        setIsEditProduct(!isEditProduct);
      });
  };

  const handleEditProduct = (id: number, name: string, price: number) => {
    setProductId(id);
    setProductInfo({ name, price });
    setIsEditProduct(!isEditProduct);
  };
  useEffect(() => {
    dispatch(actGetProducts());
  }, [dispatch, dataUpdated , isEditProduct]);

  return (
    <div className="container">
      <div className="gridList">
        {products.length > 0 &&
          products.map((product) => (
            <div
              key={product.id}
              className="bg-white p-3.5 rounded-md shadow h-52 flex flex-col items-center gap-2 justify-center relative"
            >
              <CiEdit
                size={30}
                className=" absolute right-5 top-5 cursor-pointer text-orange-600"
                onClick={() =>
                  handleEditProduct(product.id, product.name, product.price)
                }
              />
              <h2 className="text-2xl font-bold">{product.name}</h2>
              <h3 className="text-xl">السعر: {product.price} جنية</h3>
            </div>
          ))}
      </div>

      {isEditProduct && (
        <div className="fixed w-full h-full bg-gradient-to-r from-[#9face6] to-[#74ebd5] left-0 top-0 flex justify-center items-center">
          <form
            onSubmit={handleSubmit(saveChanges)}
            className="bg-white w-[450px] shadow rounded-xl p-3 flex flex-col gap-3 py-7 px-5 *:flex *:flex-col"
          >
            <h2 className="text-center text-2xl">تعديل منتج</h2>

            <div>
              <label htmlFor="name" className="text-[18px]">
                اسم المنتج
              </label>
              <input
                id="name"
                type="text"
                defaultValue={productInfo?.name}
                {...register("name")}
                className="bg-gradient-to-r from-[#9face6] to-[#74ebd5] p-3 mt-2 rounded"
              />
              {errors.name && (
                <span className="text-red-600 text-sm mt-1">
                  {errors.name.message}
                </span>
              )}
            </div>
            <div>
              <label htmlFor="price" className="text-[18px]">
                السعر
              </label>
              <input
                id="price"
                type="number"
                defaultValue={productInfo?.price}
                {...register("price", { valueAsNumber: true })}
                className="bg-gradient-to-r from-[#9face6] to-[#74ebd5] p-3 mt-2 rounded"
              />
              {errors.price && (
                <span className="text-red-600 text-sm mt-1">
                  {errors.price.message}
                </span>
              )}
            </div>
            <input
              type="submit"
              value="حفظ"
              className="text-[18px] bg-green-400 p-2 rounded-md cursor-pointer"
            />
            <button
              onClick={() => setIsEditProduct(!isEditProduct)}
              type="button"
              className="text-[18px] bg-red-400 p-2 rounded-md cursor-pointer"
            >
              إغلاق
            </button>
          </form>
        </div>
      )}

      {isAddProduct && (
        <div className="fixed w-full h-full bg-gradient-to-r from-[#9face6] to-[#74ebd5] left-0 top-0 flex justify-center items-center">
          <form
            onSubmit={handleSubmit(submitForm)}
            className="bg-white w-[450px] shadow rounded-xl p-3 flex flex-col gap-3 py-7 px-5 *:flex *:flex-col"
          >
            <h2 className="text-center text-2xl">إضافة منتج</h2>

            <div>
              <label htmlFor="name" className="text-[18px]">
                اسم المنتج
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
            <div>
              <label htmlFor="price" className="text-[18px]">
                السعر
              </label>
              <input
                id="price"
                type="number"
                {...register("price", { valueAsNumber: true })}
                className="bg-gradient-to-r from-[#9face6] to-[#74ebd5] p-3 mt-2 rounded"
              />
              {errors.price && (
                <span className="text-red-600 text-sm mt-1">
                  {errors.price.message}
                </span>
              )}
            </div>
            <input
              type="submit"
              value="إضافة"
              className="text-[18px] bg-green-400 p-2 rounded-md cursor-pointer"
            />
            <button
              onClick={() => setIsAddProduct(!isAddProduct)}
              type="button"
              className="text-[18px] bg-red-400 p-2 rounded-md cursor-pointer"
            >
              إغلاق
            </button>
          </form>
        </div>
      )}
      <button
        onClick={() => setIsAddProduct(!isAddProduct)}
        className="bg-white shadow py-4 rounded-md cursor-pointer mt-2.5 w-full text-xl"
      >
        إضافة منتج
      </button>
    </div>
  );
};

export default Products;
