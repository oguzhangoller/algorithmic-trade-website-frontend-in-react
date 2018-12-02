import React, { Component } from "react";
import { Search, Grid, Header, Segment } from "semantic-ui-react";
import axios from "axios";
import { history } from "../routers/AppRouter.js";

export default class MiksSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      val: undefined,
      miks_result: { miks: [], assets: [] },
      tickerDict: [],
      username: undefined,
      isLoading: true,
      value: "",
      results: []
    };
    this.resetComponent = this.resetComponent.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleResultSelect = this.handleResultSelect.bind(this);
  }
  componentWillMount() {
    this.resetComponent();
  }

  resetComponent() {
    this.setState({ isLoading: false, results: [], value: "" });
  }

  handleResultSelect(e, { result }) {
    history.push("/miks-detayi/" + result.id);
  }

  handleSearchChange(e, { value }) {
    this.setState({
      isLoading: true,
      results: [],
      value: value
    });

    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetComponent();

      const url1 = "https://beta.miksinvest.com/search?search_str=";
      const url2 = "&search_str_eng=";

      const formData = new FormData();

      const token = localStorage.getItem("jwtToken");
      const app = "true";

      formData.append("session_id", token);
      formData.append("app", app);

      axios({
        method: "get",
        url: url1 + this.state.value + url2 + this.state.value,
        headers: {
          "Content-Type": "multipart/form-data",
          session_id: token,
          app: "true"
        }
      })
        .then(response => {
          this.setState({ miks_result: response.data.search_result });

          if (response.statusText === "OK") {
            console.log("ok");
          } else {
            console.log("not ok");
            history.push("/failed");
          }
        })
        .catch(function(response) {
          console.log(response);
        });
      this.setState({
        isLoading: false
      });
    }, 500);
  }

  render() {
    const { isLoading, value, results } = this.state;
    const imageUrl = "https://beta.miksinvest.com/static/uploads/";
    const miksResult =
      this.state.miks_result.miks &&
      this.state.miks_result.miks.map(function(datas, i) {
        return JSON.parse(
          '{"title":"' +
            datas[1] +
            '",' +
            '"image":' +
            '"' +
            imageUrl +
            datas[2] +
            '"' +
            "," +
            '"id":' +
            '"' +
            datas[0] +
            '"' +
            "}"
        );
      });

    const hisseResult =
      this.state.miks_result.assets &&
      this.state.miks_result.assets.map(function(datas, i) {
        return JSON.parse(
          '{"title":"' +
            datas[1] +
            '",' +
            '"description":' +
            '"' +
            datas[0] +
            '"' +
            "," +
            '"id":' +
            '"' +
            datas[0] +
            '"' +
            "}"
        );
      });

    return (
      <Search
        category
        loading={isLoading}
        onResultSelect={this.handleResultSelect}
        onSearchChange={this.handleSearchChange}
        results={{
          miksler: {
            name: "Miksler",
            results: miksResult
          },
          hisseler: {
            name: "Hisse,Kur & Emtia",
            results: hisseResult
          }
        }}
        value={value}
        {...this.props}
      />
    );
  }
}

