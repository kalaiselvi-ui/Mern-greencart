import React from "react";

const CategoryCard = ({ image, text }) => {
  return (
    <div className="flex flex-col items-center">
      <img
        className="group-hover:scale-108 transition max-w-28"
        src={image}
        alt=""
      />
      <p className="text-sm font-medium">{text}</p>
    </div>
  );
};

export default CategoryCard;
