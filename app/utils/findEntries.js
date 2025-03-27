export default function findEntriesByWilayaCode(wilayaCode) {
  return data.filter(entry => entry.wilaya_code === wilayaCode);
}
 