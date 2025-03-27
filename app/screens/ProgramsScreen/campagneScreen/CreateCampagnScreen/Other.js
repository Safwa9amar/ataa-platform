import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  LogBox,
  Platform,
  TextInput,
  TouchableOpacity,
} from "react-native";
import LabelContainer from "../../../../components/ButtonWithLabel";
import CustomDropDown from "../../../../components/CustomDropDown";
import Icon from "../../../../components/Icon";
import { InputWithFloatingLabel } from "../../../../components/InputWithFloatingLabel";
import { useTheme } from "../../../../context/ThemeContext";
import { useEffect } from "react";
import CollapsibleItem from "../../../../components/CollapsibleItem";
import { BloodType } from "../../bloodDoantionScreen/BloodDonationBooking";
import { useCreateCampaign } from "../../../../context/CreateCampaignContext";
import { useFieldCategoryContext } from "../../../../context/FieldCategoryContext";
import ScreensContainer from "../../../../components/ScreensContainer";
import PulsatingIcon from "../../../../components/PulsatingIcon";
import useFileUpload from "../../../../hooks/useFileUpload";
import Text from "../../../../components/Text";
import ContactDivider from "../../../../components/ContactDivider";
import AlertMessage from "../../../../components/AlertMessage";
import validator from "validator";
import { types } from "react-native-document-picker";
import API_ENDPOINTS from "../../../../config/config";

const BLOOD_TYPES = [
  {
    name: "A+",
    code: "A_POSITIVE",
  },

  {
    name: "A-",
    code: "A_NEGATIVE",
  },
  {
    name: "B+",
    code: "B_POSITIVE",
  },
  {
    name: "B-",
    code: "B_NEGATIVE",
  },
  {
    name: "O+",
    code: "O_POSITIVE",
  },
  {
    name: "O-",
    code: "O_NEGATIVE",
  },
  {
    name: "AB+",
    code: "AB_POSITIVE",
  },
  {
    name: "AB-",
    code: "AB_NEGATIVE",
  },
];

export default function Other({
  route,
  deletePage,
  restorePage,
  setPageStatus,
}) {
  const { theme } = useTheme();
  const { state, update, pickImages, deleteFile, remove } = useCreateCampaign();
  const { fields, categories } = useFieldCategoryContext();

  const isCampaignStatusValid = () =>
    ["URGENT", "NOT_URGENT", "ONGOING"].includes(state.campaignStatus);

  // Helper function to determine if the campaign is a blood campaign
  const isBloodCampaign = () => route?.params?.type === "BLOOD";

  // Helper function to determine if the campaign is a donation campaign
  const isDonationCampaign = () => route?.params?.type === "donation-campaign";
  useEffect(() => {
    if (state.campaignStatus === "ONGOING") {
      deletePage("Proof");
    } else {
      restorePage();
    }
  }, [state.campaignStatus]);
  useEffect(() => {
    if (isDonationCampaign()) {
      update("CampaignType", "MONEY");
    }
    if (isBloodCampaign()) {
      update("CampaignType", "BLOOD");
    }
  }, [route?.params?.type]);

  useEffect(() => {
    if (isDonationCampaign()) {
      const isDonationValid =
        state.targetAmount > 0 &&
        validator.isLength(state.bankAccount, { min: 5, max: 23 }) &&
        isCampaignStatusValid();

      const isOngoingValid =
        state.campaignStatus === "ONGOING" &&
        // state.categoryId > 0 &&
        state.fieldId > 0;

      setPageStatus("Other", isDonationValid || isOngoingValid);
    }

    if (isBloodCampaign()) {
      const isBloodValid =
        state.bloodBankName &&
        validator.isURL(state.googleMapLink) &&
        state.selectedBloodType &&
        isCampaignStatusValid();

      setPageStatus("Other", isBloodValid);
    }
  }, [state, categories, fields]);

  const NanToZero = (val) => (isNaN(val) ? 0 : val);

  return (
    <ScreensContainer style={{ paddingBottom: 100, gap: 10 }}>
      <LabelContainer width="95%" label="حالة الحملة">
        <CustomDropDown
          handleChanges={(val) => {
            update("campaignStatus", val.status);
            if (val.status !== "ONGOING") {
              remove("categoryId");
              remove("fieldId");
            }
          }}
          data={[
            { status: "URGENT", ar_status: "مستعجلة" },
            { status: "NOT_URGENT", ar_status: "غير مستعجلة" },
            { status: "ONGOING", ar_status: "صدقة جارية" },
          ]}
          valueField="status"
          value={state.campaignStatus}
          labelField="ar_status"
          searchField="status"
          icon={
            <Icon.Ionicons
              name="checkmark-circle"
              size={20}
              color={theme.textColor}
            />
          }
        />
      </LabelContainer>

      {state.campaignStatus && (
        <>
          {isDonationCampaign() && state.campaignStatus === "ONGOING" && (
            <>
              <LabelContainer width="95%" label="مجال صرف الصدقة">
                <CustomDropDown
                  handleChanges={(val) => update("fieldId", val.id)}
                  data={fields}
                  valueField="id"
                  value={state.fieldId}
                  labelField="ar_title"
                  searchField="ar_title"
                  icon={
                    <Icon.FontAwesome5
                      name="map-signs"
                      size={20}
                      color={theme.textColor}
                    />
                  }
                />
              </LabelContainer>
              <LabelContainer width="95%" label="صنف صرف الصدقة">
                <CustomDropDown
                  handleChanges={(value) => update("categoryId", value.id)}
                  data={categories.filter(
                    (item) => item.fieldId === state.fieldId
                  )}
                  valueField="id"
                  value={state.categoryId}
                  labelField="ar_title"
                  searchField="ar_title"
                  icon={
                    <Icon.Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={theme.textColor}
                    />
                  }
                />
              </LabelContainer>
            </>
          )}

          {!isBloodCampaign() &&
            (state.campaignStatus === "URGENT" ||
              state.campaignStatus === "NOT_URGENT") && (
              <>
                <InputWithFloatingLabel
                  onChangeText={(val) =>
                    update("numOfBeneficiaries", parseInt(val))
                  }
                  keyboardType="numeric"
                  label={"عدد المستفيدين في حالة وجدوها"}
                  value={NanToZero(state.numOfBeneficiaries?.toString()) || 0}
                  icon={
                    <Icon.Ionicons
                      name="people"
                      size={20}
                      color={theme?.secondaryTextColor}
                    />
                  }
                />
                <LabelContainer
                  width="95%"
                  label="المبلغ أو عدد الوحدات المستهدف"
                >
                  <CustomDropDown
                    handleChanges={(value) =>
                      update("CampaignType", value.type)
                    }
                    data={[
                      { id: 1, ar_title: "مبلغ", type: "MONEY" },
                      { id: 2, ar_title: "عدد الوحدات", type: "GOODS" },
                    ]}
                    valueField="type"
                    value={state.CampaignType}
                    labelField="ar_title"
                    searchField="ar_title"
                    icon={
                      <Icon.Ionicons
                        name="cash"
                        size={20}
                        color={theme?.secondaryTextColor}
                      />
                    }
                  />
                </LabelContainer>
                {state.CampaignType === "MONEY" && (
                  <InputWithFloatingLabel
                    onChangeText={(val) =>
                      update("targetAmount", parseInt(val))
                    }
                    keyboardType="numeric"
                    label={"المبلغ بالدينار الجزائري"}
                    value={NanToZero(state.targetAmount?.toString())}
                    icon={
                      <Icon.Ionicons
                        name="cash"
                        size={20}
                        color={theme?.secondaryTextColor}
                      />
                    }
                  />
                )}
                {state.CampaignType === "GOODS" && (
                  <>
                    <InputWithFloatingLabel
                      onChangeText={(val) => {
                        update("numberOfUnits", parseInt(val));
                        update(
                          "targetAmount",
                          parseInt(val) * state.unitPrice || 0
                        );
                      }}
                      keyboardType="numeric"
                      label={"عدد الوحدات"}
                      value={NanToZero(state.numberOfUnits?.toString())}
                      icon={
                        <Icon.Ionicons
                          name="cash"
                          size={20}
                          color={theme?.secondaryTextColor}
                        />
                      }
                    />
                    <InputWithFloatingLabel
                      onChangeText={(val) => {
                        update("unitPrice", parseInt(val));
                        update(
                          "targetAmount",
                          parseInt(val) * state.numberOfUnits || 0
                        );
                      }}
                      keyboardType="numeric"
                      label={"سعر الوحدة بالدينار الجزائري"}
                      value={
                        NanToZero(state.unitPrice?.toString()) ||
                        +process.env.APP_CURRENCY_NAME
                      }
                      icon={
                        <Icon.Ionicons
                          name="cash"
                          size={20}
                          color={theme?.secondaryTextColor}
                        />
                      }
                    />
                    <InputWithFloatingLabel
                      editable={false}
                      label={"المبلغ الاجملي للوحدات بالدينار الجزائري"}
                      value={
                        NanToZero(
                          (state.unitPrice * state.numberOfUnits)?.toString()
                        ) + process.env.APP_CURRENCY_NAME
                      }
                      icon={
                        <Icon.Ionicons
                          name="cash"
                          size={20}
                          color={theme?.secondaryTextColor}
                        />
                      }
                    />
                  </>
                )}
              </>
            )}

          {isDonationCampaign() && state.campaignStatus !== "ONGOING" && (
            <>
              <InputWithFloatingLabel
                numberOfLines={3}
                type="bank"
                onChangeText={(e) => update("bankAccount", e)}
                maxLength={20}
                value={state.bankAccount}
                keyboardType="numeric"
                placeholder={"1234567890-12"}
                label={"رقم الحساب البنكي او البريدي للحملة"}
                icon={
                  <Icon.Ionicons
                    name="card"
                    size={20}
                    color={theme?.secondaryTextColor}
                  />
                }
              />
              <CollapsibleItem
                icon={
                  <Icon.Ionicons name="add" size={20} color={theme.textColor} />
                }
                style={{
                  backgroundColor: theme.mangoBlack,
                  padding: 20,
                  margin: 10,
                  alignSelf: "center",
                  borderRadius: 10,
                  width: "95%",
                }}
                fontSize={"sm"}
                label={
                  "في حالة لم يكن صاحب الحساب البنكي \n ليس هو صاحب الحساب على المنصة"
                }
              >
                <InputWithFloatingLabel
                  onChangeText={(e) => update("ownerName", e)}
                  value={state.ownerName}
                  icon={
                    <Icon.Ionicons
                      name="person"
                      size={20}
                      color={theme?.secondaryTextColor}
                    />
                  }
                  label={"اسم صاحب الحساب"}
                />
                <InputWithFloatingLabel
                  type="NIN"
                  onChangeText={(e) => update("ownerID", e)}
                  value={NanToZero(state.ownerID)}
                  keyboardType="numeric"
                  icon={
                    <Icon.Ionicons
                      name="person"
                      size={20}
                      color={theme?.secondaryTextColor}
                    />
                  }
                  label={"رقم بطاقة التعريف"}
                />
                <InputWithFloatingLabel
                  type="phone"
                  onChangeText={(e) => update("ownerPhone", e)}
                  value={NanToZero(state.ownerPhone)}
                  keyboardType="numeric"
                  icon={
                    <Icon.Ionicons
                      name="call"
                      size={20}
                      color={theme?.secondaryTextColor}
                    />
                  }
                  label={"رقم الهاتف"}
                />
                <InputWithFloatingLabel
                  type="email"
                  onChangeText={(e) => update("ownerEmail", e)}
                  value={state.ownerEmail}
                  icon={
                    <Icon.Ionicons
                      name="mail"
                      size={20}
                      color={theme?.secondaryTextColor}
                    />
                  }
                  label={"البريد الإلكتروني"}
                />
              </CollapsibleItem>
            </>
          )}

          {isBloodCampaign() && (
            <>
              <LabelContainer width="95%" label="فصيلة الدم المطلوبة">
                <FlatList
                  onLayout={() => update("CampaignType", "BLOOD")}
                  inverted
                  data={BLOOD_TYPES}
                  horizontal
                  contentContainerStyle={{
                    padding: 10,
                    gap: 10,
                    flexDirection: "row-reverse",
                  }}
                  renderItem={({ item }) => (
                    <BloodType
                      key={item}
                      selected={state.selectedBloodType}
                      onPress={() => update("selectedBloodType", item.code)}
                      name={item.name}
                      code={item.code}
                    />
                  )}
                />
              </LabelContainer>
              {state.campaignStatus !== "ONGOING" && (
                <InputWithFloatingLabel
                  onChangeText={(val) => {
                    update("numberOfUnits", parseInt(val));
                    update(
                      "targetAmount",
                      parseInt(val) * state.unitPrice || 0
                    );
                  }}
                  keyboardType="numeric"
                  label={"عدد الوحدات"}
                  value={NanToZero(state.numberOfUnits?.toString())}
                  icon={
                    <Icon.MaterialCommunityIcons
                      name="blood-bag"
                      size={20}
                      color={theme?.secondaryTextColor}
                    />
                  }
                />
              )}
              <InputWithFloatingLabel
                onChangeText={(e) => update("bloodBankName", e)}
                icon={null}
                numberOfLines={4}
                value={state.bloodBankName}
                label={
                  "اسم البنك/المصحة الخاصة/المستشفى العمومي المتكفل بالحملة"
                }
              />
              <InputWithFloatingLabel
                type="url"
                onChangeText={(e) => update("googleMapLink", e)}
                icon={
                  <Icon.Ionicons name="map" size={20} color={theme.textColor} />
                }
                value={state.googleMapLink}
                numberOfLines={2}
                label={"رابط الموقع على خرائط غوغل"}
                // TODO : open google map and get the location ? this can be done using react-native-maps
              />
            </>
          )}

          <ContactDivider>
            <PulsatingIcon onPress={() => pickImages(types.images)}>
              <Icon.MaterialCommunityIcons name="image-plus" size={32} />
            </PulsatingIcon>
          </ContactDivider>
          {state.message && (
            <AlertMessage
              onClose={() => update("message", "")}
              onConfirm={() => update("message", "")}
              message={state.message}
            />
          )}
          <Text center type="md" style={{ margin: 10 }}>
            اضافة صور للحملة حتى يتم عرضها على المنصة يجب ان تكون صور ذات جدوة
            عالية ومناسبة لمعايير مجتمع عطاء
          </Text>

          <FlatList
            nestedScrollEnabled={true}
            scrollEnabled={false}
            data={state.images}
            keyExtractor={(item, index) => index?.toString()}
            numColumns={3}
            contentContainerStyle={{
              padding: 10,
              gap: 10,
              alignItems: "center",
            }}
            renderItem={({ item }) => (
              <ImageBackground
                source={{ uri: `${API_ENDPOINTS.UPLOADS}/${item.filename}` }}
                style={{
                  width: 100,
                  height: 100,
                  margin: 5,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    deleteFile(item.filename);
                    update(
                      "images",
                      state.images.filter(
                        (img) => img.filename !== item.filename
                      )
                    );
                  }}
                  style={{
                    backgroundColor: "rgba(0,0,0,0.5)",
                    padding: 5,
                    borderRadius: 10,
                  }}
                >
                  <Icon.MaterialCommunityIcons
                    name="delete"
                    size={20}
                    color="white"
                  />
                </TouchableOpacity>
              </ImageBackground>
            )}
          />
        </>
      )}
    </ScreensContainer>
  );
}
