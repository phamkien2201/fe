import React from "react";
import { Button } from "@material-ui/core";

const ChangeInfoText = ({ onClick }) => {
  return (
    <Button className="updated-text" onClick={onClick}>
      Chỉnh sửa thông tin
    </Button>
  );
};

export default ChangeInfoText;
