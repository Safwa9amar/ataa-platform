import { useCallback } from "react";
import API_ENDPOINTS from "../config/config";
import { useCredentials } from "../context/CredentialsContext";
import Share from "react-native-share";
import { updateUser } from "../services/userServices";
import { ToastAndroid } from "react-native";
import { processImageUrlToBase64 } from "../utils/imageUrlToBase64";
const useShareDonationOpportunity = () => {
  const { checkAuthentication, user, isLoggedIn, userToken } = useCredentials();

  const shareDonationOpportunity = useCallback(
    async (data, type) => {
      let based64Images = [];
      try {
        if (data.images.length) {
          based64Images = await Promise.all(
            data.images.map((image) =>
              processImageUrlToBase64(
                `${API_ENDPOINTS.BASE_URL}/uploads/${image.filename}`,
                image.filename
              )
            )
          );
        }
      } catch (error) {
        console.error("Error converting images to base64:", error);
      }

      try {
        const result = await Share.open({
          message: `${data.title}\n${data.description}\n ${API_ENDPOINTS.DONATION_OPERTUNITIES.GET_BY_ID}/${data.id}`,
          urls: based64Images,
        });
        console.log("Share result:", result);

        if (result.success) {
          if (!isLoggedIn) return;

          const points = 5; // Points are hardcoded to 5
          const updateData = {
            ambassadorRank: user.ambassadorRank + points,
          };

          try {
            const res = await updateUser(user.id, updateData, userToken);
            if (res) {
              ToastAndroid.show(
                `تمت مشاركة الفرصة بنجاح، تمت اضافة ${points} نقاط لتصنيفك في سفراء عطاء`,
                ToastAndroid.SHORT
              );
              checkAuthentication(userToken);
            }
          } catch (updateError) {
            console.error("Error updating user rank:", updateError);
            ToastAndroid.show(
              "حدث خطأ أثناء تحديث نقاط التصنيف، حاول مرة أخرى.",
              ToastAndroid.SHORT
            );
          }
        }
      } catch (error) {
        console.error("Error sharing donation opportunity:", error);
      }
    },
    [userToken, user, isLoggedIn, checkAuthentication]
  );

  return shareDonationOpportunity;
};

export default useShareDonationOpportunity;
