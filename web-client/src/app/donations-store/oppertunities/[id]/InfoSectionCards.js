import Image from "next/image";

function InfoSectionCards({ cards }) {
  return (
    <div className="w-full flex flex-wrap justify-center gap-2">
      {cards?.map((card, index) => (
        <div
          key={index}
          className="flex items-center justify-around gap-4 bg-mangoBlack p-10 rounded-lg"
        >
          <Image
            className="rounded-lg"
            width={200}
            height={200}
            src={card.image}
            alt={card.title}
          />
          <div className="flex flex-col gap-2 text-textColor">
            {Object.entries(JSON.parse(card.data)[0]).map(([key, value]) => (
              <div className="flex" key={key}>
                <p className="font-bold">{key} :</p>
                <p className="text-secondaryColor">{value}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default InfoSectionCards;
