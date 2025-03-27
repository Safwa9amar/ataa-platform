import { motion } from "framer-motion";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 5 },
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
  tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
};

export const Gallery = ({ images = [] }) => {
  return (
    <Carousel
      swipeable={false}
      draggable={false}
      showDots={true}
      responsive={responsive}
      ssr={true} // means to render carousel on server-side.
      infinite={true}
      autoPlay={true}
      autoPlaySpeed={1000}
      keyBoardControl={true}
      transitionDuration={500}
      className="w-full h-96"
      removeArrowOnDeviceType={["tablet", "mobile"]}
      dotListClass="custom-dot-list-style"
      itemClass="p-[40px]"
    >
      {images.map((image, index) => (
        <motion.div
          key={index}
          className="w-full h-96 rounded-md"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <img
            className="rounded-md object-cover w-full h-full"
            alt={`Uploaded image ${index + 1}`}
            src={`${process.env.NEXT_PUBLIC_API_UPLOADS_URL}/${image?.filename}`}
            loading="lazy"
          />
        </motion.div>
      ))}
    </Carousel>
  );
};
