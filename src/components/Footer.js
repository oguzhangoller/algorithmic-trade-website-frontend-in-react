import React from "react";
import { connect } from "react-redux";
import { loggedOut } from "../actions/LoginManager.js";
import { bindActionCreators } from "redux";
import "../style.css";

class Footer extends React.Component {
  render() {
    if (this.props.login) {
      return (
        <div id="footer">
        <div>
          Burada yer alan yatırım bilgi, yorum ve tavsiyeleri yatırım
          danışmanlığı kapsamında değildir. Yatırım danışmanlığı hizmeti,
          yetkili kuruluşlar tarafından kişilerin risk ve getiri tercihleri
          dikkate alınarak kişiye özel sunulmaktadır. Burada yer alan yorum ve
          tavsiyeler ise genel niteliktedir. Bu tavsiyeler mali durumunuz ile
          risk ve getiri tercihlerinize uygun olmayabilir. Bu nedenle, sadece
          burada yer alan bilgilere dayanılarak yatırım kararı verilmesi
          beklentilerinize uygun sonuçlar doğurmayabilir. Burada yer alan
          fiyatlar, veriler ve bilgilerin tam ve doğru olduğu garanti edilemez;
          içerik, haber verilmeksizin değiştirilebilir. Tüm veriler, güvenilir
          olduğuna inanılan kaynaklardan alınmıştır. Bu kaynakların kullanılması
          nedeni ile ortaya çıkabilecek hatalardan Algosis Yazılım Teknolojileri
          Ltd sorumlu değildir. BIST isim ve logosu 'Koruma Marka Belgesi'
          altında korunmakta olup izinsiz kullanılamaz, iktibas edilemez,
          değiştirilemez. BIST ismi altında açıklanan tüm bilgilerin telif
          hakları tamamen BIST'a ait olup, tekrar yayımlanamaz. Algosis Yazılım
          Teknolojileri Ltd, kurumsal internet adreslerinde diğer kurumlara ait
          internet adresi bağlantılarına (link) yer verebilir. Ancak, söz konusu
          internet bağlantıları üzerinden erişilen adres ve sayfalarda yer alan
          bilgi ve içeriğin doğruluğu ve hukuka uygunluğu hususunda garanti
          vermemektedir ve sorumluluk kabul etmemektedir. BIST piyasalarında
          oluşan tüm verilere ait telif hakları tamamen BIST’e ait olup, bu
          veriler tekrar yayınlanamaz. Pay Piyasası, Borçlanma Araçları
          Piyasası, Vadeli İşlem ve Opsiyon Piyasası verileri BIST kaynaklı en
          az 15 dakika gecikmeli verilerdir.
        </div>
        <div id="copyright">
        2017 Copyright © Algosis Yazılım Teknolojileri
        </div>
        </div>
      );
    } else {
      return <div />;
    }
  }
}

const mapStateToProps = state => {
  return {
    login: state.login
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators({ loggedOut }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Footer);
