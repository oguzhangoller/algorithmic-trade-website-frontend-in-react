import React from "react";
import { history } from "../routers/AppRouter.js";
import { favorite } from "./Favorite";
import { Rating } from "semantic-ui-react";

export class Table extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClick(e) {
    const id = e.target.getAttribute("value");

    if (id != null) {
      history.push({
        pathname: "/miks-detayi/" + id,
        state: { id: id }
      });
    }
  }

  handleRate(props) {
    favorite({ p_id: props });
  }

  render() {
    const style = {
      red: { color: "red" },
      green: { color: "green" }
    };
    const imageurl = "https://beta.miksinvest.com/static";

    return (
      <table
        className="ui selectable celled table"
        onClick={e => this.handleClick(e)}
      >
        <thead>
          <tr>
            <th>Miks Detayi</th>
            <th>Endeks</th>
            <th>Son 1 Ay</th>
            <th>Son 1 Yıl</th>
            <th>Volatilite</th>
          </tr>
        </thead>
        <tbody>
          {this.props.data &&
            this.props.data.map((datas, i) => {
              return (
                <tr key={i}>
                  <td value={datas.portfolio_id}>
                    <img
                      value={datas.portfolio_id}
                      className="portfolio image"
                      src={
                        imageurl +
                        "/uploads/" +
                        datas.portfolio_parameters.fund_image
                      }
                    />
                    <div>
                      <Rating
                        icon="star"
                        style={{ float: "right" }}
                        defaultRating={datas.favorite_flag ? 1 : 0}
                        maxRating={1}
                        onRate={id => this.handleRate(datas.portfolio_id)}
                      />
                    </div>
                    <div value={datas.portfolio_id} className="portfolio name">
                      {datas.portfolio_name}
                    </div>
                    {datas.portfolio_parameters.fund_description}
                  </td>
                  <td value={datas.portfolio_id}>{datas.risk_text}</td>
                  <td
                    style={
                      parseFloat(datas.monthly_return) > 0
                        ? style.green
                        : style.red
                    }
                    value={datas.portfolio_id}
                  >
                    {datas.monthly_return + "%"}
                  </td>
                  <td
                    style={
                      parseFloat(datas.yearly_return) > 0
                        ? style.green
                        : style.red
                    }
                    value={datas.portfolio_id}
                  >
                    {datas.yearly_return + "%"}
                  </td>
                  <td value={datas.portfolio_id}>
                    <img
                      className="risk image"
                      src={imageurl + datas.risk_image}
                      style={{
                        marginLeft:"auto",
                        marginRight:"auto",
                        display:"block"
                      }}
                    />
                    <div style={{ textAlign: "center" }}>
                      {" "}
                      {datas.risk_text}
                    </div>{" "}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    );
  }
}

