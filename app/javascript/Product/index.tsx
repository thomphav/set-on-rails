import React from "react";

const Product = ({ name, price }: { name: string; price: string }) => {
  return (
    <>
      <h1>
        {name} - {price}
      </h1>
    </>
  );
};

export default Product;