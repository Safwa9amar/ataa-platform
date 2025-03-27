import { Rating } from "@material-tailwind/react";
import PropTpes from "prop-types";
const TestimonialCard = ({ name, grade, comment, rating, photo }) => {
  return (
    <div class="w-full h-full bg-mangoBlack shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow">
      <div class="flex items-center mb-4">
        <img
          src={`${process.env.NEXT_PUBLIC_API_UPLOADS_URL}/${photo}`}
          alt={name}
          class="w-16 h-16 rounded-full shadow-lg"
        />
        <div class="ml-4">
          <h3 class="text-xl font-semibold">{name}</h3>
          <p class="text-gray-500 dark:text-gray-300 text-sm">{grade}</p>
        </div>
      </div>
      <p class="text-gray-700 dark:text-gray-100">{comment}</p>
      <Rating readonly value={rating} />
    </div>
  );
};
TestimonialCard.proptypes = {
  name: PropTpes.string.isRequired,
  grade: PropTpes.string.isRequired,
  comment: PropTpes.string.isRequired,
  photo: PropTpes.string.isRequired,
  rating: PropTpes.number.isRequired,
};
export default TestimonialCard;
