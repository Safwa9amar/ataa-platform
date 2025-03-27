import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
} from "react-native";
import React, { useState } from "react";
import Text from "../../../components/Text";
import Icon from "../../../components/Icon";
import Carousel from "react-native-snap-carousel";

import { Platform } from "react-native";

let LinearGradient;
if (Platform.OS !== "web") {
  LinearGradient = require("react-native-linear-gradient").default;
} else {
  // Use a web-specific alternative or a simple fallback
  LinearGradient = ({ children, style }) => <div style={style}>{children}</div>;
}
export default function HomeCarousel() {
  const [bannerIndex, setBannerIndex] = useState(0);

  const data = [
    {
      title: "برنامج الحملات",
      description: "كتابة وصف قصير يشمل الفكرة الخاصة بالخانة",
      backgroundImage:
        "https://thelyst.com/wp-content/uploads/2015/07/campaign-blog-graphic-01-1080x675.jpg",
      slideImage: "https://cdn-icons-png.freepik.com/512/7195/7195322.png",
      btnTitle: "تبرع الان",
    },
    {
      title: "قيم تجربتك مع عطاء",
      description: "كتابة وصف قصير يشمل الفكرة الخاصة بالخانة",
      slideImage:
        "https://static.vecteezy.com/system/resources/previews/009/636/657/original/reputation-3d-icon-png.png",
      backgroundImage:
        "https://static.vecteezy.com/system/resources/previews/003/337/483/non_2x/review-us-concept-illustration-free-vector.jpg",
      btnTitle: "تبرع الان",
    },
    {
      title: "خدمة بيوت الله",
      description: "كتابة وصف قصير يشمل الفكرة الخاصة بالخانة",
      slideImage:
        "https://static.vecteezy.com/system/resources/previews/022/782/285/non_2x/mosqoe-islamic-illustration-free-png.png",
      backgroundImage:
        "https://png.pngtree.com/thumb_back/fh260/background/20200808/pngtree-islamic-background-muharram-with-lantern-gold-ramadan-image_389096.jpg",
      btnTitle: "تبرع الان",
    },
  ];

  return (
    <ImageBackground
      source={{ uri: data[bannerIndex].backgroundImage }}
      style={styles.carouselContainer}
    >
      {Platform !== "web" && (
        <Carousel
          bounces={true}
          onSnapToItem={(index) => {
            setBannerIndex(index);
          }}
          data={data}
          renderItem={({ item }) => (
            <CarouselItem
              title={item.title}
              slideImage={item.slideImage}
              description={item.description}
              btnTitle={item.btnTitle}
            />
          )}
          sliderWidth={400}
          itemWidth={400}
          autoplay={true}
          autoplayInterval={3000}
          layout={"stack"}
          layoutCardOffset={5}
        />
      )}
    </ImageBackground>
  );
}

const CarouselItem = ({ title, description, btnTitle, slideImage }) => {
  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      colors={["#00BCD4", "#458E59"]}
      style={styles.gradientContainer}
    >
      {/* <TouchableOpacity style={styles.closeButton}>
        <Icon.AntDesign name="close" size={16} color="white" />
      </TouchableOpacity> */}
      <Text style={styles.title}>
        {title.length > 20 ? title.slice(0, 20) + "..." : title}
      </Text>
      <Text style={styles.description} type="bodyTextSmall">
        {description.length > 50
          ? description.slice(0, 50) + "..."
          : description}
      </Text>
      <TouchableOpacity style={styles.donateButton}>
        <Text style={styles.donateButtonText}>{btnTitle}</Text>
      </TouchableOpacity>
      <Image style={styles.foregroundImage} source={{ uri: slideImage }} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    backgroundColor: "white",
    height: 200,
    width: "100%",
    position: "relative",
    overflow: "hidden",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  backgroundImage: {
    height: "100%",
    width: "100%",
    marginBottom: 20,
    position: "absolute",
  },
  gradientContainer: {
    height: 150,
    width: "80%",
    justifyContent: "center",
    alignSelf: "center",
    gap: 5,
    borderRadius: 20,
    padding: 25,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  title: {
    color: "white",
  },
  description: {
    color: "white",
  },
  donateButton: {
    backgroundColor: "#F3A277",
    height: 30,
    width: 150,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  donateButtonText: {
    color: "white",
    fontSize: 14,
  },
  foregroundImage: {
    position: "absolute",
    bottom: -10,
    left: 0,
    width: 80,
    height: 80,
    zIndex: 100,
  },
});
