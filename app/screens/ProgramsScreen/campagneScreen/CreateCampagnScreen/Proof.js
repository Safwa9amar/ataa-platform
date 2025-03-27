import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, FlatList } from "react-native";
import { useTheme } from "../../../../context/ThemeContext";
import Text from "../../../../components/Text";
import UploadFileProgress from "../../../../components/UploadFileProgress";
import SwipableItem from "../../../../components/SwipableItem";
import { checkFileType } from "../../../../utils/checkFileType";
import { useCreateCampaign } from "../../../../context/CreateCampaignContext";
import Icon from "../../../../components/Icon";
import AlertMessage from "../../../../components/AlertMessage";
import ScreensContainer from "../../../../components/ScreensContainer";
import { types } from "react-native-document-picker";
import FileDisplay from "../../../../components/FileDisplay";

const Proof = ({ route, setPageStatus }) => {
  const { theme } = useTheme();
  const { state, update, pickProofFiles } = useCreateCampaign();

  const handleDelete = (fileName) => {
    console.log("state", state.proofFiles);

    update(
      "proofFiles",
      state.proofFiles.filter((file) => file.fileName !== fileName)
    );
  };

  useEffect(() => {
    setPageStatus("Proof", !!state.proofFiles.length);
  }, [state.proofFiles]);

  return (
    <ScreensContainer>
      {state.message && (
        <AlertMessage
          onClose={() => update("message", "")}
          onConfirm={() => update("message", "")}
          message={state.message}
        />
      )}
      <TouchableOpacity
        style={{
          alignSelf: "center",
          width: "90%",
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 1,
          borderColor: theme.textColor,
          borderStyle: "dashed",
          borderRadius: 10,
        }}
        onPress={() => pickProofFiles()}
      >
        <Icon.Ionicons
          name="cloud-upload"
          size={50}
          color={theme.primaryColor}
        />
        <Text center>رفع ملف التحقق</Text>
        <Text center type="md">
          {route.params?.type == "donation-campaign"
            ? "يمكنك اختيار اكثر من ملف اما صورة، وثيقة، أو أي كان ما يثبت صحة الحملة"
            : "تقرير طبي يثبت صحة الحملة "}
        </Text>
        <Text center type="sm">
          الملفات المدعومة: jpg, jpeg, png, pdf, doc, docx, mp4
        </Text>
      </TouchableOpacity>

      <FlatList
        nestedScrollEnabled
        scrollEnabled={false}
        data={state.proofFiles}
        keyExtractor={(item) => item.fileName}
        contentContainerStyle={{
          display: "flex",
          alignItems: "center",
          marginVertical: 10,
          paddingHorizontal: 20,
        }}
        renderItem={({ item }) => (
          <SwipableItem
            rightActions={
              <Icon.AntDesign name="delete" size={32} color={theme.CARROT} />
            }
            onDelete={() => handleDelete(item.fileName)}
          >
            <FileDisplay filename={item.filename} mimetype={item.mimetype} />
          </SwipableItem>
        )}
      />
    </ScreensContainer>
  );
};

export default Proof;
