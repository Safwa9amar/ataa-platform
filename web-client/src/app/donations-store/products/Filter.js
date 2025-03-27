import { usePathname, useRouter } from "next/navigation";
import React from "react";
import Swal from "sweetalert2";

export default function Filter({ handleOpen, open }) {
  const router = useRouter();
  const pathname = usePathname();
  open &&
    Swal.fire({
      title: "تصفية عرض النتائج",
      html: (
        <div>
          <input type="number" />
        </div>
      ),
    });
}
