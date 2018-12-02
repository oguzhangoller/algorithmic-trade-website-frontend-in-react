import axios from "axios";
import { history } from "../routers/AppRouter.js";

export const favorite = props => {
  const url = "https://beta.miksinvest.com/favorite";

  const formData = new FormData();

  const token = localStorage.getItem("jwtToken");

  formData.append("portfolio_id", props.p_id);

  axios({
    method: "post",
    url: url,
    data: formData,
    headers: {
      session_id: token,
      app: "true",
      "Content-Type": "multipart/form-data"
    }
  })
    .then(response => {
      if (response.statusText === "OK") {
        console.log("favorilendi");
        console.log(response);
      } else {
        console.log("not ok");
        console.log(response.statusText);
        history.push("/failed");
      }
    })
    .catch(function(response) {
      //handle error
      console.log(response);
    });
};
