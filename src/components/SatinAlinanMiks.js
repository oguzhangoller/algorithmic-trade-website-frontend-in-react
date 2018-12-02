import React from "react";
import axios from "axios";
import { history } from "../routers/AppRouter.js";
import { Dropdown, Button } from "semantic-ui-react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { Label } from "semantic-ui-react";

export class SatinAlinanMiks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      loaded: false,
      investable_symbols: [],
      volume_fraction_percent: [],
      items: [],
      error: false,
      errorMessage: undefined,
      data: {
        assets: [],
        task_parameters: {
          fund_description: undefined,
          fund_name: undefined,
          fund_image: undefined
        }
      }
    };

    this.onClick = this.onClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handlePercent = this.handlePercent.bind(this);
  }

  handleChange(e, { value }) {
    const url = "https://beta.miksinvest.com/miks/add-invested-symbol";
    const formData = new FormData();

    formData.append("symbol", value);

    axios({
      method: "post",
      url: url,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        session_id: localStorage.getItem("jwtToken"),
        app: "true"
      }
    })
      .then(response => {
        if (response.statusText === "OK") {
          console.log("ok");
          const parseData = JSON.parse(response.data.html);
          let tempData = this.state.data;
          if (!tempData.assets.some(e => e.symbol === parseData.asset.symbol)) {
            tempData.assets.push(parseData.asset);
          }

          this.setState({ data: tempData });
          var newItem = { item: 0 };
          let tempArr = this.state.volume_fraction_percent;
          tempArr.push(newItem);
          this.setState({ volume_fraction_percent: tempArr });
        } else {
          console.log("not ok");
          console.log(response.statusText);
          history.push("/failed");
        }
      })
      .catch(function(response) {
        console.log(response);
      });
  }

  handleClick(e) {
    const id = e.target.getAttribute("value");
    console.log(e.target.getAttribute("value"));
    const data1 = this.state.data;
    let array = this.state.volume_fraction_percent;
    const firstPercent = 100 - array[id].item;
    let ratio = 100 / firstPercent;

    array = array.map((data, key) => {
      return { item: Math.round(ratio * data.item * 10) / 10 };
    });

    data1.assets.splice(id, 1);
    this.setState({ data: data1 });

    array.splice(id, 1);

    this.setState({ volume_fraction_percent: array });
  }

  onClick(e) {
    let values = this.state.data.total_volume.split(".");
    let result = values[0];
    if (values.length > 1) {
      let cash = values[1].split(",");
      result += cash[0] + "." + cash[1];
    }

    if (
      e.target.id === "tamamini-sat" ||
      (e.target.id === "sat" && parseFloat(result) <= 10000)
    ) {
      const url = "https://beta.miksinvest.com/miks/close-invested-portfolio";

      axios({
        method: "post",
        url: url,
        headers: {
          "Content-Type": "multipart/form-data",
          session_id: localStorage.getItem("jwtToken"),
          app: "true"
        }
      })
        .then(response => {
          if (response.statusText === "OK") {
            console.log("ok");
            console.log(response);
            history.push(response.data.url);
          } else {
            console.log("not ok");
            console.log(response.statusText);
            history.push("/failed");
          }
        })
        .catch(function(response) {
          console.log(response);
        });
    } else if (e.target.id === "sat") {
      history.push("/emir/satis-emri-onayla/" + this.props.match.params.id);
    } else if (e.target.id === "al") {
      history.push(
        "/emir/satin-alma-emri-onayla/" + this.props.match.params.id
      );
    } else if (e.target.id === "duzenle") {
      this.setState({ edit: !this.state.edit });
    } else if (e.target.id === "onayla") {
      const url = "https://beta.miksinvest.com/miks/rebalance-portfolio";
      const formData = new FormData();
      let jsonData = "{";
      let sum = 0;
      this.state.volume_fraction_percent.map((datas, i) => {
        sum += datas.item;
      });

      console.log("sum degeri " + sum);
      if (sum < 95) {
        this.setState({
          error: true,
          errorMessage: "Miksteki ağırlık toplamı 100'den düşük olamaz"
        });
        setTimeout(
          function() {
            this.setState({ error: false });
          }.bind(this),
          3000
        );
        return;
      }
      sum = (100 - sum) * 0.01;
      const size = this.state.data.assets.length;
      const sumValue = sum / size;
      console.log("size : " + size + " sum " + sum + " sumvalue " + sumValue);

      this.state.data.assets.map((datas, i) => {
        let sym = datas.symbol;
        sym = '"' + sym + '":';
        jsonData += sym;
        jsonData += this.state.volume_fraction_percent[i].item * 0.01 + ",";
      });
      jsonData = jsonData.substring(0, jsonData.length - 1);
      jsonData += "}";
      console.log("json data ");
      console.log(jsonData);

      formData.append("target_portfolio", jsonData);

      axios({
        method: "post",
        url: url,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          session_id: localStorage.getItem("jwtToken"),
          app: "true"
        }
      })
        .then(response => {
          if (response.statusText === "OK") {
            console.log("ok");
            console.log(response);
            if (response.data.url) history.push(response.data.url);
            else {
              this.setState({
                error: true,
                errorMessage: response.data.notification
              });
            }
          } else {
            console.log("not ok");
            console.log(response.statusText);
            history.push("/failed");
          }
        })
        .catch(function(response) {
          console.log(response);
        });
    } else if (e.target.id === "iptal") {
      window.location.reload();
    }
  }

  handlePercent(value, i) {
    let array = this.state.volume_fraction_percent;
    console.log("before" + array[i].item);
    const firstPercent = 100 - array[i].item;
    const secondPercent = 100 - value;
    let ratio = secondPercent / firstPercent;

    array = array.map((data, key) => {
      if (data.item * ratio > 0.05)
        return { item: Math.round(ratio * data.item * 10) / 10 };
      else return { item: data.item };
    });
    array[i].item = parseFloat(value);
    this.setState({ volume_fraction_percent: array });
  }

  componentWillMount() {
    const url =
      "https://beta.miksinvest.com/satin-alinan-miks/" +
      this.props.match.params.id;

    const formData = new FormData();
    const token = localStorage.getItem("jwtToken");
    const app = "true";

    formData.append("session_id", token);
    formData.append("app", app);

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
          console.log("ok");
          console.log(response);
          this.setState({
            data: response.data.portfolio_data,
            investable_symbols: response.data.investable_symbols,
            items: response.data.investable_symbols.map(function(value, i) {
              return {
                key: i,
                text: value.symbol_description,
                value: value.symbol_name
              };
            }),
            loaded: true,
            volume_fraction_percent: response.data.portfolio_data.assets.map(
              (datas, i) => {
                return {
                  item: parseFloat(datas.volume_fraction_percent)
                };
              }
            )
          });
        } else {
          console.log("not ok");
          console.log(response.statusText);
          history.push("/failed");
        }
      })
      .catch(function(response) {
        console.log(response);
      });
  }

  render() {
    const imageurl = "https://beta.miksinvest.com/static";
    const style = {
      red: { color: "red" },
      green: { color: "green" }
    };

    if (this.state.loaded) {
      const datas = this.state.data;
      let items = this.state.items;

      return (
        <div>
          <div className="first-text"> Satın Alınan Miks </div>
          <ul>
            <div className="ui segment left">
              <div style={{ position: "relative" }}>
                <img
                  className="satin alinan miks image"
                  src={
                    imageurl + "/uploads/" + datas.task_parameters.fund_image
                  }
                />
                <div className="miks text on image">
                  {datas.task_parameters.fund_name}
                </div>
              </div>
              <div style={{ color: "grey" }}>
                <div className="left-segment-text">
                  Toplam Miktar:
                  <span className="tab3">{datas.total_volume}</span>
                </div>
                <div className="left-segment-text">
                  Toplam Maliyet:
                  <span className="tab3">{datas.total_cost}</span>
                </div>
                <div className="left-segment-text">
                  Kar/Zarar:
                  <span className="tab3">{datas.total_profit}</span>
                </div>
              </div>
              <div
                style={{
                  textAlign: "center",
                  fontSize: "22px",
                  marginTop: "40px"
                }}
              >
                Volatilite
                <img
                  style={{
                    display: "block",
                    margin: "0 auto",
                    width: "100px",
                    marginTop: "20px",
                    marginBottom: "20px"
                  }}
                  src={imageurl + datas.risk_image}
                />
              </div>
              <div className="ui button group" id="al" onClick={this.onClick}>
                Al
              </div>
              <div className="ui button group" id="sat" onClick={this.onClick}>
                Sat
              </div>
              <div
                className="ui button group"
                id="tamamini-sat"
                onClick={this.onClick}
              >
                Tamamını Sat
              </div>
              <div
                className="ui button group"
                id="duzenle"
                onClick={this.onClick}
              >
                Düzenle
              </div>
            </div>
            <div className="ui segment second">
              {" "}
              {datas.task_parameters.fund_description}
            </div>
            <div className="ui segment middle">
              {this.state.edit ? (
                <div>
                  <Dropdown
                    placeholder="Hisse Seç"
                    fluid
                    search
                    selection
                    options={this.state.items}
                    onChange={this.handleChange}
                  />{" "}
                  <div className="edit button segment">
                    <div
                      className="ui button edit"
                      id="onayla"
                      onClick={this.onClick}
                    >
                      {" "}
                      Onayla
                    </div>
                    <div
                      className="ui button edit"
                      id="iptal"
                      onClick={this.onClick}
                    >
                      {" "}
                      İptal Et
                    </div>{" "}
                  </div>
                  <div>
                    {this.state.error && (
                      <Label
                        id="satin-alinan-miks-warning"
                        pointing
                        color="red"
                      >
                        {this.state.errorMessage}
                      </Label>
                    )}
                  </div>
                </div>
              ) : (
                ""
              )}
              <table
                className="ui celled table detay"
                style={{ width: "100% !important" }}
              >
                <thead>
                  <tr>
                    <th>İsim</th>
                    <th>Sembol</th>
                    <th className="three wide">Ağırlık</th>
                    <th>Son Fiyat</th>
                    <th>Günlük Değişim</th>
                    <th>Aylık Değişim</th>
                    <th>Yıllık Değişim</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.data.assets &&
                    this.state.data.assets.map((datas, i) => {
                      return (
                        <tr key={i}>
                          <td>
                            <a>{datas.description}</a>
                          </td>
                          <td>
                            <a>{datas.symbol}</a>
                          </td>
                          <td>
                            {this.state.edit ? (
                              <div className="slider">
                                <Slider
                                  max={100}
                                  onChange={value => {
                                    this.handlePercent(value, i);
                                  }}
                                  step={0.1}
                                  value={
                                    this.state.volume_fraction_percent[i]
                                      ? this.state.volume_fraction_percent[i]
                                          .item
                                      : 0
                                  }
                                />
                              </div>
                            ) : (
                              ""
                            )}
                            {this.state.volume_fraction_percent[i]
                              ? this.state.volume_fraction_percent[i].item
                              : 0 + "%"}
                          </td>
                          <td>{datas.current_price}</td>
                          <td
                            style={
                              parseFloat(datas.daily_return_percent) > 0
                                ? style.green
                                : style.red
                            }
                          >
                            {datas.daily_return_percent + "%"}{" "}
                          </td>
                          <td
                            style={
                              parseFloat(datas.daily_return_percent) > 0
                                ? style.green
                                : style.red
                            }
                          >
                            {datas.monthly_return_percent + "%"}{" "}
                          </td>
                          <td
                            style={
                              parseFloat(datas.one_year_return_percent) > 0
                                ? style.green
                                : style.red
                            }
                          >
                            {datas.one_year_return_percent + "%"}
                          </td>

                          {this.state.edit ? (
                            <td>
                              <button
                                className="remove-button"
                                value={i}
                                onClick={this.handleClick}
                              >
                                X
                              </button>
                            </td>
                          ) : null}
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </ul>
        </div>
      );
    } else {
      return <div />;
    }
  }
}
