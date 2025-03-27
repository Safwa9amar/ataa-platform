"use client";
import { DataFetchError } from "@/components/layouts/DataFetchError";
import {
  ButtonGroup,
  Chip,
  IconButton,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import { useEffect } from "react";
import { AiTwotoneEdit } from "react-icons/ai";
import { TbTrashXFilled } from "react-icons/tb";
import AddProductForm from "./AddProductForm";
import { deleteMyProduct } from "@/services/storeService";
import { useCredentials } from "@/context/CredentialsContext";
import { toast } from "react-toastify";
import { IoAddCircle } from "react-icons/io5";
import AddStock from "./AddStock";
import Swal from "sweetalert2";

const TABLE_HEAD = [
  "اسم المنتج",
  "الوصف",
  "السعر",
  "الكمية",
  "التصنيف",
  "options",
];

export function ProductsTable({
  keywords = "",
  page = 1,
  limit = 10,
  fetchProducts,
  data,
  isLoading,
  error,
  totalPages,
}) {
  const { userToken } = useCredentials();
  useEffect(() => {
    fetchProducts();
  }, [keywords, page, limit]);

  const handlePageChange = () => {
    // Update the page state (you can pass this function to pagination controls)
    // Example: setPage(newPage);
  };

  const handleDeleteMyProducts = async (id) => {
    await Swal.fire({
      title: "هل انت متأكد من ازالة المنتج",
      showCloseButton: true,
      showDenyButton: true,
      showConfirmButton: true,
      preConfirm: async () => {
        try {
          await deleteMyProduct(id, userToken);
          toast.success("تم ازالة المنتج بنجاح");
          fetchProducts();
        } catch (error) {
          toast.error("حدث خطأ ما يرجى اعادة المحاولة");
        }
      },
    });
  };

  if (isLoading) {
    return (
      <div className="w-full h-[20vh] flex justify-center items-center">
        <Spinner className="w-5 h-6" color="teal" />
      </div>
    );
  }

  if (error) {
    return <DataFetchError error={error} onRetry={fetchProducts} />;
  }

  return (
    <section className="w-full text-right space-y-5 my-5" dir="rtl">
      <div className="h-full w-full overflow-scroll border border-borderColor bg-mangoBlack rounded-lg  px-6">
        <table className="w-full">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-b border-borderColor pb-4 pt-10"
                >
                  <Typography
                    variant="small"
                    className="font-bold leading-none text-textColor"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((product) => {
              const { id, name, description, price, stock, category, color } =
                product;
              return (
                <tr
                  key={id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="py-4 border-b border-borderColor">
                    <Typography
                      variant="small"
                      className="font-bold text-textColor"
                    >
                      {name}
                    </Typography>
                  </td>
                  <td className="py-4 border-b border-borderColor">
                    <Typography
                      variant="small"
                      className="font-normal text-textColor"
                    >
                      {description}
                    </Typography>
                  </td>
                  <td className="py-4 border-b border-borderColor">
                    <Typography
                      variant="small"
                      className="font-normal text-textColor"
                    >
                      {price}
                    </Typography>
                  </td>
                  <td className="py-4 border-b border-borderColor">
                    <Chip
                      variant="outlined"
                      color={
                        stock > 10
                          ? "green"
                          : stock <= 10
                          ? "amber"
                          : stock === 0
                          ? "red"
                          : ""
                      }
                      variants="gradient"
                      className="text-center font-ElMessiri w-fit"
                      value={stock}
                    />
                  </td>
                  <td className="py-4 border-b border-borderColor">
                    <Chip
                      style={{
                        backgroundColor: category.color,
                      }}
                      variants="gradient"
                      className={`text-center text-white font-ElMessiri w-fit `}
                      value={category.name}
                    />
                  </td>
                  <td
                    dir="ltr"
                    className="py-4 border-b border-borderColor flex justify-end"
                  >
                    <ButtonGroup color="teal" size="sm">
                      <IconButton onClick={() => handleDeleteMyProducts(id)}>
                        <TbTrashXFilled size={20} />
                      </IconButton>
                      <AddStock
                        currentStock={stock}
                        productId={id}
                        fetchProducts={fetchProducts}
                      />
                    </ButtonGroup>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {/* <div className="flex justify-center mt-6">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`mx-1 px-4 py-2 border rounded ${
              page === index + 1
                ? "bg-blue-500 text-white"
                : "bg-white text-blue-500"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div> */}
    </section>
  );
}
