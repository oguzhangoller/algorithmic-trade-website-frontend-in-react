import React from "react";
import axios from "axios";
import { history } from "../routers/AppRouter.js";
import forEach from "lodash.foreach";

export class EmirDetayi extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      moneyLeft: false,

      data: {
        orders_data: [],
        portfolio_parameters: {
          fund_name: undefined,
          fund_image: undefined,
          fund_description: undefined
        }
      }
    };
    this.onClick = this.onClick.bind(this);
  }

  onClick(e){
      if(this.state.moneyLeft){
            history.push('/satin-alinan-miks/'+this.state.data.portfolio_id)
      }
      else {
        history.push("/emir/emir-onayla/" + this.props.match.params.id1);
      }
  }

  componentWillMount() {
    const url =
      "https://beta.miksinvest.com/emir/emir-detayi/" +
      this.props.match.params.id1 +
      "/" +
      this.props.match.params.id2;

    const token = localStorage.getItem("jwtToken");
    const app = "true";

    axios({
      method: "get",
      url: url,
      headers: {
        "Content-Type": "multipart/form-data",
        session_id: token,
        app: "true"
      }
    })
      .then(response => {
        if (response.statusText === "OK") {
          this.setState({ data: response.data.data, loaded: true });

          let values = response.data.data.total_volume.split(".");
          let result = values[0];
          console.log("result " + parseFloat(result));
          if (parseFloat(result) > 0) {
            this.setState({ moneyLeft: true });
          } else this.setState({ moneyLeft: false });

          console.log("response");
          console.log(response);
        } else {
          history.push("/failed");
        }
      })
      .catch(function(response) {
        console.log(response);
      });
  }

  render() {
    let items = [];
    const imageurl = "https://beta.miksinvest.com/static";
    const style1 = {
      red: { color: "red" },
      green: { color: "green" }
    };

    forEach(this.state.data.orders_data, function(value, key) {
      items.push(value);
    });

    if (this.state.loaded) {
        let buttonName = this.state.moneyLeft ? "Yatırımına Gözat" : "Yatırım Yap"
      return (
        <ul>
          <br />
          <br />
          <font style={{ fontSize: "18px" }}> Emir Detayı </font>
          <div className="ui segment">
            <div style={{ marginLeft: "10px", marginBottom: "10px" }}>
              <font> {this.state.data.portfolio_name} </font>
            </div>
            <img
              id="miks-detay-resim"
              src={
                imageurl +
                "/uploads/" +
                this.state.data.portfolio_parameters.fund_image
              }
            />
            <div className="detay-buttons">
              <div
                className="ui button miksdetay"
                id="yatirim"
                onClick={this.onClick}
              >
                {buttonName}
              </div>{" "}
              <br />
            </div>
            <div id="upper-section-detay">
              <div id="left-section-detay">
                <div>
                {this.state.data.total_buy_flag
                      ? "Alınan Miktar"
                      : "Satılan Miktar"}
                  <font style={{ float: "right", color: "black" }}>
                    {this.state.data.total_buy_flag
                      ? this.state.data.total_buy_amount
                      : this.state.data.total_sell_amount}
                  </font>
                </div>
                <hr />
                <div>
                  Miksteki Yatırım
                  <font style={{ float: "right", color: "black" }}>
                    {this.state.data.total_volume}
                  </font>
                </div>
                <div>
                  Ödenen Komisyon{" "}
                  <font style={{ float: "right", color: "black" }}>
                    {this.state.data.commission_cost}
                  </font>
                </div>
                <div>
                  Emir Tipi{" "}
                  <font style={{ float: "right", color: "black" }}>
                    {this.state.data.total_buy_flag ? "Al" : "Sat"}
                  </font>
                </div>
                <div>
                  Emir Zamanı
                  <font style={{ float: "right", color: "black" }}>
                    {this.state.data.order_date}
                  </font>
                </div>
              </div>
            </div>
            <hr style={{ marginTop: "60px" }} />

            <div style={{ marginTop: "30px", textAlign: "center" }}>
              <font id="bottom-yazi">
                {" "}
                Lütfen aşağıdaki bilgileri doğrulayın. Emirler her bir sembol
                için pay bazında iletileceği için emirin toplam parasal değeri
                belirlemiş olduğunuz değerden farklı olacaktır. Fiyatlar
                değişebildiği için toplam miktar tahminidir.{" "}
              </font>
            </div>
          </div>

          <table className="ui celled table">
            <thead>
              <tr>
                <th>Sembol Detayı</th>
                <th>Sembol</th>
                <th>İşlem</th>
                <th>Lot Sayısı</th>
                <th>Fiyat</th>
                <th>Miktar</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
              {items.map((datas, i) => {
                return (
                  <tr key={i}>
                    <td>{datas.symbol_description}</td>
                    <td>{datas.symbol_name}</td>
                    <td>{datas.action}</td>
                    <td>{datas.volume_lot}</td>
                    <td>{datas.price}</td>
                    <td>{datas.order_cost}</td>
                    <td>
                      <font style={{ color: "green" }}>{datas.status}</font>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </ul>
      );
    } else {
      return <div />;
    }
  }
}
