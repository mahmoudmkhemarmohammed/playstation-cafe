import { useAppDispatch, useAppSelector } from "@store/hooks";
import actGetProducts from "@store/products/act/actGetProducts";
import { useEffect } from "react";

const Products = () => {
  const { products } = useAppSelector(
    (state) => state.products
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(actGetProducts());
  }, [dispatch]);
  return (
    <div className="container gridList">
      {products.length > 0 &&
        products.map((product) => (
          <div key={product.id} className="bg-white p-3.5 rounded-md shadow h-52 flex flex-col items-center gap-2 justify-center">
            <h2 className="text-2xl font-bold">{product.name}</h2>
            <h3 className="text-xl">السعر: {product.price} جنية</h3>
          </div>
        ))}
    </div>
  );
};

export default Products;
