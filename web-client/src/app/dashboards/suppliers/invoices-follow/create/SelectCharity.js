import { useCredentials } from "@/context/CredentialsContext";
import { getAllCharities } from "@/services/charityService";
import { Option, Select } from "@material-tailwind/react";
import React, { useCallback, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";

export default function SelectCharity(props) {
  const { userToken } = useCredentials();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getData = useCallback(async () => {
    if (!userToken) return;
    setLoading(true);
    try {
      const charities = await getAllCharities(userToken);
      setData(charities);
    } catch (error) {
      console.error("Error fetching charities:", error);
    } finally {
      setLoading(false);
    }
  }, [userToken]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <>
      <label className="block text-sm text-blue-gray-600">{props.label}</label>
      <select
        className="py-2  bg-transparent w-full border-b border-blue-gray-300 shadow-sm hover:shadow-md font-ElMessiri text-sm"
        {...props}
        // onChange={(e) => props.setValue(e.target.value)}
      >
        {loading ? (
          <Skeleton height={40} count={3} />
        ) : (
          <>
            <option value=""></option>
            {data.map((charity) => (
              <option key={charity.id} value={charity.id}>
                {charity.legalName}
              </option>
            ))}
          </>
        )}
      </select>
    </>
  );
}
