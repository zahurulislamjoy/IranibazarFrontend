import React from "react";
import Barcode from "react-barcode";

const ComponentToPrint = React.forwardRef((props, ref) => {
  return (
    <>
      <div ref={ref} className="barcode" style={{ textAlign: "center" }}>
        <span>
          <Barcode value={props.code} />
        </span>
        <p>Merina Soft Ltd.</p>
      </div>
    </>
  );
});
export default ComponentToPrint;
