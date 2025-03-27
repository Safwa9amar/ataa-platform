import { useState, useEffect } from "react";
import { fakerAR as faker } from "@faker-js/faker";

const useDynamicFakeData = (count = 10) => {
  const [fakeData, setFakeData] = useState([]);

  useEffect(() => {
    const generateFakeData = () => {
      const newData = Array.from({ length: count }, (_, index) => {
        return {
          id: index + 1,
          donator: faker.person.fullName(),
          amount: faker.finance.amount(),
          // Add more fields based on your requirements
        };
      });

      setFakeData(newData);
    };

    generateFakeData();
  }, [count]);

  return fakeData;
};

export default useDynamicFakeData;
