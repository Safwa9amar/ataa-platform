import React, { useEffect, useState } from "react";
import CharityCard from "./CharityCard";
import ScreensContainer from "../../../../components/ScreensContainer";
import { getAllCharityAssociations } from "../../../../services/charityAssociationService";
import { useCredentials } from "../../../../context/CredentialsContext";
import CharityCardSkeleton from "../../../../components/skeleton/CharityCardSkeleton";
import { RefreshControl } from "react-native";

const CharitiesDisplay = ({ showModel }) => {
  const { userToken } = useCredentials();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  let getData = async () => {
    try {
      setLoading(true);
      let data = await getAllCharityAssociations(userToken);
      if (data) {
        setData(data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <ScreensContainer
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={getData} />
      }
      style={{
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
      }}
    >
      {loading ? (
        <>
          <CharityCardSkeleton />
          <CharityCardSkeleton />
        </>
      ) : (
        data.map((item, index) => (
          <CharityCard showModel={showModel} key={index} {...item} />
        ))
      )}
    </ScreensContainer>
  );
};

export default CharitiesDisplay;
