// دالة لعكس النصوص العربية
const reverseText = (text) => {
  return text.split(" ").reverse().join(" ");
};

module.exports = {
  reverseText,
};
