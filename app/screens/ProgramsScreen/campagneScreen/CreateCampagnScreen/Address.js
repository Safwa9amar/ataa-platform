import React, { useEffect, useState, useCallback } from "react";

// Custom Hooks
import { useTheme } from "../../../../context/ThemeContext";

// Components
import LabelContainer from "../../../../components/ButtonWithLabel";
import CustomDropDown from "../../../../components/CustomDropDown";

import { useCreateCampaign } from "../../../../context/CreateCampaignContext";
import Icon from "../../../../components/Icon";
import { useAlgeriaCitiesContext } from "../../../../context/AlgeriaCitiesContext";
import validator from "validator";

const Address = ({ setPageStatus }) => {
  const { wilayas, dairas, communes, fetchDairas, fetchCommunes } =
    useAlgeriaCitiesContext();

  const { state, update } = useCreateCampaign();
  const { theme } = useTheme();

  useEffect(() => {
    const { wilaya, daira } = state;
    fetchDairas(wilaya);
    fetchCommunes(wilaya, daira);
  }, [state.wilaya, state.daira]);

  useEffect(() => {
    const { wilaya, daira, commune } = state;
    let isValid =
      validator.isEmpty(wilaya?.toString()) &&
      validator.isEmpty(daira?.toString()) &&
      validator.isEmpty(commune?.toString());
    if (!isValid) {
      setPageStatus("Address", true);
    } else {
      setPageStatus("Address", false);
    }
  }, [state]);

  const renderDropdown = (
    label,
    data,
    valueField,
    value,
    labelField,
    searchField,
    handleChange
  ) => (
    <LabelContainer width="95%" label={label}>
      <CustomDropDown
        handleChanges={handleChange}
        data={data}
        value={value}
        valueField={valueField}
        labelField={labelField}
        searchField={searchField}
        icon={
          <Icon.Ionicons name="location" size={20} color={theme.textColor} />
        }
      />
    </LabelContainer>
  );

  return (
    <>
      {renderDropdown(
        "الولاية",
        wilayas,
        "wilaya_code",
        state.wilaya.toString(),
        "wilaya_name",
        "wilaya_name_ascii",
        (val) => update("wilaya", val.wilaya_code)
      )}
      {renderDropdown(
        "الدائرة",
        dairas,
        "daira_name_ascii",
        state.daira,
        "daira_name",
        "daira_name_ascii",
        (val) => update("daira", val.daira_name_ascii)
      )}
      {renderDropdown(
        "البلدية",
        communes,
        "id",
        state.commune,
        "commune_name",
        "commune_name_ascii",
        (val) => update("commune", Number(val.id))
      )}
    </>
  );
};

export default Address;
