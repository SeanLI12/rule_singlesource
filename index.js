import express from 'express';
import fs from 'fs-extra';
import { dirname } from 'path';
import path from 'path';
import { fileURLToPath } from 'url';
import cheerio from 'cheerio';
import bodyParser from 'body-parser';



const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3003;
let pageNamelistURL;
let popularlist=["o_GENERALRULES","o_FOOTBALL","o_BASKETBALL","o_PARLAYMULTIPLES","o_GASHOUT","o_BETBUILDER","o_OUTRIGHTS","o_EACHWAY","o_FREEBET"];

let allsports={
  "EN":"All Sports",
  "ZH":"所有体育",
  "ID":"Semua Olahraga",
  "JA":"すべてのスポーツ",
  "KM":"គ្រប់កីឡាទាំងអស់",
  "KO":"모든 스포츠",
  "PT":"Todos Os Esportes",
  "TH":"กีฬาทั้งหมด",
  "VI":"Tất Cả Các Môn Thể Thao"
 };
let pupularheader={
  "EN":"Popular",
  "ZH":"热门",
  "ID":"Popular",
  "JA":"人気",
  "KM":"ពេញនិយម",
  "KO":"인기있는",
  "PT":"Popular",
  "TH":"เป็นที่นิยม",
  "VI":"Tiêu Điểm"
 };
let sptitle={
  "EN":"Sport Rules",
  "ZH":"体育规则",
  "ID":"Peraturan Olahraga",
  "JA":"スポーツルール",
  "KM":"ច្បាប់​កីឡា",
  "KO":"스포츠 규칙",
  "PT":"Regras De Esportes",
  "TH":"กฎกีฬา",
  "VI":"Luật Thể Thao",
 }
let localization={
	"All Terms":[
	   
	   {
		  "_CMSKEY":"o_GENERALRULES",
		  "EN":"General",
		  "ZH":"一般体育说明",
		  "ID":"Ringkasan",
		  "JA":"概要",
		  "KM":"ទស្សនៈទូទៅ",
		  "KO":"개요",
		  "PT":"Visão Geral",
		  "TH":"เนื้อหาโดยรวม",
		  "VI":"Cược Thể Thao",
		  "FILE":"general"
	   },
	   {
		  "_CMSKEY":"o_FOOTBALL",
		  "EN":"Football",
		  "ZH":"足球",
		  "ID":"Sepakbola",
		  "JA":"フットボール",
		  "KM":"កីឡាបាល់ទាត់",
		  "KO":"축구",
		  "PT":"Futebol",
		  "TH":"ฟุตบอล",
		  "VI":"Bóng Đá",
		  "FILE":"football"
	   },
	   {
		  "_CMSKEY":"o_BASKETBALL",
		  "EN":"Basketball",
		  "ZH":"篮球",
		  "ID":"Bola Basket",
		  "JA":"バスケットボール",
		  "KM":"កីឡាបាល់បោះ",
		  "KO":"농구",
		  "PT":"Basquete",
		  "TH":"บาสเกตบอล",
		  "VI":"Bóng Rổ",
		  "FILE":"basketball"
	   },
	   {
		  "_CMSKEY":"o_PARLAYMULTIPLES",
		  "EN":"Parlays Multiples",
		  "ZH":"连串过关/复式过关/组合过关",
		  "ID":"Parlays/multiples/taruhan Combo",
		  "JA":"パーレイ / マルチプル / コンボ ベット",
		  "KM":"ភ្នាល់គូបក/ភ្នាល់គូវិល/ភ្នាល់បកសរុប(Parlays / Multiples / Combo Bets)",
		  "KO":"팔레이 / 조합 베팅 / 콤보 베팅",
		  "PT":"Apostas Múltiplas / Combinadas / Acumuladas",
		  "TH":"พาร์เลย์ / มัลติเพิล / คอมโบ เบท",
		  "VI":"Cược Xâu/ Cược Liên Hoàn",
		  "FILE":"parlays-multiples"
	   },
	   {
		  "_CMSKEY":"o_GASHOUT",
		  "EN":"Cash Out",
		  "ZH":"提前结算规则",
		  "ID":"Peraturan Cash Out",
		  "JA":"キャッシュアウトルール",
		  "KM":"ក្បួន Cash Out",
		  "KO":"캐시 아웃 규칙",
		  "PT":"Regras De Cash Out",
		  "TH":"แคชเอ้าท์",
		  "VI":"Luật Trả Cược Sớm",
		  "FILE":"cashout"
	   },
	   {
		  "_CMSKEY":"o_OUTRIGHTS",
		  "EN":"Outright",
		  "ZH":"冠军",
		  "ID":"Outright",
		  "JA":"アウトライト",
		  "KM":"Outright (ការប្រកួតតាមព្រឹត្ដិការណ៍)",
		  "KO":"사전 예측 마켓",
		  "PT":"Apostas Para Campeão",
		  "TH":"การทายผล",
		  "VI":"Cược Chung Cuộc",
		  "FILE":"outright"
	   },
	   {
		  "_CMSKEY":"o_EACHWAY",
		  "EN":"Each Way",
		  "ZH":"独赢及位置的投注规则",
		  "ID":"Taruhan Peringkat (E/w) Rules",
		  "JA":"イーチウェイ (E/w) ルール\t  ",
		  "KM":"ច្បាប់​នៃ​ការ​ភ្នាល់",
		  "KO":"연승식 베팅(연승식) 규칙\t  ",
		  "PT":"Regras Each Way ",
		  "TH":"กฎการเดิมพัน  \"ทายอันดับ\"",
		  "VI":"Luật  Cược Thắng/xếp Hạng",
		  "FILE":"each-way"
	   },
	   {
		  "_CMSKEY":"o_AMERICANFOOTBALL",
		  "EN":"American Football",
		  "ZH":"美式足球",
		  "ID":"Sepak Bola Amerika",
		  "JA":"アメリカン　フットボール",
		  "KM":"American Football (បាល់ទាត់អាមេរិក)",
		  "KO":"미식 축구",
		  "PT":"Futebol Americano",
		  "TH":"อเมริกันฟุตบอล",
		  "VI":"Bóng Đá Mỹ",
		  "FILE":"american-football"
	   },
	   {
		  "_CMSKEY":"o_ARCHERYSHOOTING",
		  "EN":"Archery / Shooting",
		  "ZH":"射箭与射击",
		  "ID":"Pemanahan Dan Penembak",
		  "JA":"アーチェリー",
		  "KM":"ល្បែងបាញ់ព្រួញ",
		  "KO":"양궁 및 사격",
		  "PT":"Arco E Flecha",
		  "TH":"ยิงธนู &amp; ยิงปืน",
		  "VI":"Bắn Cung Và Bắn Súng",
		  "FILE":"archery"
	   },
	   {
		  "_CMSKEY":"o_ATHLETICS",
		  "EN":"Athletic",
		  "ZH":"田径",
		  "ID":"Atletik",
		  "JA":"陸上競技",
		  "KM":"Athletics (កីឡាអត្ដពលកម្ម)",
		  "KO":"육상",
		  "PT":"Atletismo",
		  "TH":"กรีฑา",
		  "VI":"điền Kinh",
		  "FILE":"athletic"
	   },
	   {
		  "_CMSKEY":"o_AUSSIERULES",
		  "EN":"Aussie Rules",
		  "ZH":"澳式足球",
		  "ID":"Aussie Rules",
		  "JA":"オージー　ルール",
		  "KM":"Aussie Rules (វិធានអូស្រ្តាលី)",
		  "KO":"호주 풋불 규칙",
		  "PT":"Futebol Australiano",
		  "TH":"กฎการเดิมพันแบบออสซี่",
		  "VI":"Aussie Rules",
		  "FILE":"aussie"
	   },
	   {
		  "_CMSKEY":"o_BADMINTON",
		  "EN":"Badminton",
		  "ZH":"羽毛球",
		  "ID":"Bulu Tangkis ",
		  "JA":"バトミントン",
		  "KM":"កីឡាវាយសី ",
		  "KO":"배드민턴",
		  "PT":"Badminton",
		  "TH":"แบดมินตัน",
		  "VI":"Cầu Lông",
		  "FILE":"badminton"
	   },
	   {
		  "_CMSKEY":"o_BASEBALL",
		  "EN":"Baseball",
		  "ZH":"棒球",
		  "ID":"Baseball",
		  "JA":"野球",
		  "KM":"Baseball (កីឡាវាយកូនបាល់)",
		  "KO":"야구",
		  "PT":"Beisebol",
		  "TH":"เบสบอล",
		  "VI":"Bóng Chày",
		  "FILE":"baseball"
	   },
	   {
		  "_CMSKEY":"o_BEACHSOCCER",
		  "EN":"Beach Soccer",
		  "ZH":"沙滩足球",
		  "ID":"Sepakbola Pantai",
		  "JA":"ビーチ サッカー",
		  "KM":"Beach Soccer (បាល់ទាត់លើឆ្នេរខ្សាច់)",
		  "KO":"비치사커",
		  "PT":"Futebol De Praia (Ou Futebol De Areia)",
		  "TH":"ฟุตบอลชายหาด",
		  "VI":"Bóng Đá Bãi Biển",
		  "FILE":"beach-soccer"
	   },
	   {
		  "_CMSKEY":"o_BEACHVALLEYBALL",
		  "EN":"Beach Volleyball",
		  "ZH":"沙滩排球",
		  "ID":"Voli Pantai",
		  "JA":"ビーチ バレーボール",
		  "KM":"Beach Volleyball (បាល់ទះលើឆ្នេរខ្សាច់)",
		  "KO":"비치 발리볼",
		  "PT":"Vôlei De Praia",
		  "TH":"วอลเลย์บอลชายหาด",
		  "VI":"Bóng Chuyền Bãi Biển",
		  "FILE":"beach-volleyball"
	   },
	   {
		  "_CMSKEY":"o_BOXINGFIGHTING",
		  "EN":"Boxing / Fighting",
		  "ZH":"拳击",
		  "ID":"Tinju",
		  "JA":"ボクシング",
		  "KM":"Boxing (កីឡាប្រដាល់)",
		  "KO":"권투",
		  "PT":"Boxe",
		  "TH":"มวย",
		  "VI":"Quyền Anh",
		  "FILE":"boxing"
	   },
	   {
		  "_CMSKEY":"o_CRICKET",
		  "EN":"Cricket",
		  "ZH":"板球",
		  "ID":"Kriket ",
		  "JA":"クリケット",
		  "KM":"Cricket (កីឡាគ្រីកឃេត)",
		  "KO":"크리켓",
		  "PT":"Cricket",
		  "TH":"อเมริกันฟุตบอล",
		  "VI":"Cricket",
		  "FILE":"cricket"
	   },
	   {
		  "_CMSKEY":"o_CYCLING",
		  "EN":"Cycling",
		  "ZH":"自行车",
		  "ID":"Sepeda",
		  "JA":"サイクリング",
		  "KM":"Cycling (កីឡាជិះកង់)",
		  "KO":"사이클",
		  "PT":"Ciclismo",
		  "TH":"ปั่นจักรยาน",
		  "VI":"đua Xe Đạp",
		  "FILE":"cycling"
	   },
	   {
		  "_CMSKEY":"o_DART",
		  "EN":"Darts",
		  "ZH":"飞镖",
		  "ID":"Panahan",
		  "JA":"ダーツ",
		  "KM":"កីឡាគប់ព្រួញ",
		  "KO":"다트",
		  "PT":"Dardos",
		  "TH":"ปาลูกดอก",
		  "VI":"Ném Phi Tiêu",
		  "FILE":"darts"
	   },
	   {
		  "_CMSKEY":"o_ESPORTS",
		  "EN":"Esports",
		  "ZH":"电子竞技",
		  "ID":"Esports",
		  "JA":"Esports",
		  "KM":"ច្បាប់ទូទៅ",
		  "KO":"E스포츠",
		  "PT":"Esports",
		  "TH":"อี-สปอร์ต",
		  "VI":"Esports",
		  "FILE":"esports"
	   },
	   {
		  "_CMSKEY":"o_FIELDHOCKEY",
		  "EN":"Field Hockey",
		  "ZH":"曲棍球",
		  "ID":"Lapangan Hoki",
		  "JA":"フィールドホッケー",
		  "KM":"Field Hockey (កីឡាវាយកូនបាល់លើវាល)",
		  "KO":"필드 하키",
		  "PT":"Hóquei De Campo",
		  "TH":"ฮอกกี้สนาม",
		  "VI":"Khúc Côn Cầu Sân Cỏ",
		  "FILE":"field-hockey"
	   },
	   {
		  "_CMSKEY":"o_FINANCIALBETS",
		  "EN":"Financial Bets",
		  "ZH":"金融投注",
		  "ID":"Taruhan Financial",
		  "JA":"ファイナンシャルベット",
		  "KM":"Financial Bets (ការភ្នាល់ហិរញ្ញវត្ថុ)",
		  "KO":"파이낸셜 베팅",
		  "PT":"Apostas Financeiras",
		  "TH":"ตลาดหุ้น",
		  "VI":"Cược Tài Chính",
		  "FILE":"financial-bets"
	   },
	   {
		  "_CMSKEY":"o_FUTSAL",
		  "EN":"Futsal",
		  "ZH":"室内足球",
		  "ID":"Futsal",
		  "JA":"フットサル",
		  "KM":"(ហ្វូតសាល)",
		  "KO":"풋살",
		  "PT":"Futsal",
		  "TH":"ฟุตซอล",
		  "VI":"Bóng Đá Trong Nhà",
		  "FILE":"futsal"
	   },
	   {
		  "_CMSKEY":"o_GOLF",
		  "EN":"Golf",
		  "ZH":"高尔夫球",
		  "ID":"Golf",
		  "JA":"ゴルフ",
		  "KM":"Golf វាយកូនគោល",
		  "KO":"골프",
		  "PT":"Golf",
		  "TH":"กอล์ฟ",
		  "VI":"Golf",
		  "FILE":"golf"
	   },
	   {
		  "_CMSKEY":"o_GYMNASTICS",
		  "EN":"Gymnastics",
		  "ZH":"体操",
		  "ID":"Olahraga Senam",
		  "JA":"器械体操",
		  "KM":"Gymnastics (កីឡាកាយសម្ព័ន្ធ)",
		  "KO":"체조",
		  "PT":"Ginástica",
		  "TH":"ยิมนาสติก",
		  "VI":"Thể Dục Dụng Cụ",
		  "FILE":"gymnastics"
	   },
	   {
		  "_CMSKEY":"o_HANDBALL",
		  "EN":"Handball",
		  "ZH":"手球",
		  "ID":"Bola Tangan",
		  "JA":"ハンドボール",
		  "KM":"(កីឡាបាល់គប់)",
		  "KO":"핸드볼",
		  "PT":"Handebol",
		  "TH":"แฮนบอล",
		  "VI":"Bóng Ném",
		  "FILE":"handball"
	   },
	   {
		  "_CMSKEY":"o_ICEHOCKEY",
		  "EN":"Ice Hockey",
		  "ZH":"冰球",
		  "ID":"Hoki Es ",
		  "JA":"アイスホッケー",
		  "KM":"(កីឡាវាយកូនបាល់លើទឹកកក)",
		  "KO":"아이스 하키",
		  "PT":"Hóquei No Gelo",
		  "TH":"ฮ็อกกี้น้ำแข็ง",
		  "VI":"Khúc Côn Cầu Sân Băng",
		  "FILE":"ice-hockey"
	   },
	   {
		  "_CMSKEY":"o_JUDO",
		  "EN":"Judo / Wrestling / Taekwondo",
		  "ZH":"柔道、摔跤、跆拳道",
		  "ID":"Judo",
		  "JA":"柔道",
		  "KM":"Judo (កីឡាយូដូ)",
		  "KO":"유도/레슬링/태권도",
		  "PT":"Judô",
		  "TH":"ยูโด/มวยปล้ำ/เทควันโด",
		  "VI":"Judo / Đấu Vật / Taekwondo",
		  "FILE":"judo"
	   },
	   {
		  "_CMSKEY":"o_LOTTERY",
		  "EN":"Lottery",
		  "ZH":"乐透彩票投注",
		  "ID":"Taruhan Lotre",
		  "JA":"ロッタリー・ ベッティング",
		  "KM":"Lottery Betting (ការចាក់ឆ្នោត)",
		  "KO":"복권",
		  "PT":"Apostas De Loteria",
		  "TH":"การเดิมพัน ลอตเตอรี่ ",
		  "VI":"Cược Xổ Số ",
		  "FILE":"lottery"
	   },
	   {
		  "_CMSKEY":"o_LACROSSE",
		  "EN":"Lacrosse",
		  "ZH":"长曲棍球",
		  "ID":"Lacrosse",
		  "JA":"ラクロス",
		  "KM":"Lacrosse (កីឡាវាយកូនបាល់)",
		  "KO":"라크로스",
		  "PT":"Lacrosse",
		  "TH":"อเมริกันฟุตบอล",
		  "VI":"Lacrosse",
		  "FILE":"lacrosse"
	   },
	   {
		  "_CMSKEY":"o_MEDALBETTING",
		  "EN":"Medal Sports / Medal Betting",
		  "ZH":"体育/奖章投注",
		  "ID":"Medal Sport / Taruhan Medali",
		  "JA":"メダル スポーツ / メダル ベッティング",
		  "KM":"Medal Sports / Medal Betting (កីឡាដណ្ដើមមេដាយ/ការភ្នាល់មេដាយ)",
		  "KO":"메달 스포츠/메달 배팅",
		  "PT":"Esportes Com Medalhas /apostas Em Medalhas",
		  "TH":"กีฬาประเภทเหรียญ / การเดิมพันเหรียญรางวัล",
		  "VI":"Cược Tổng Số Huy Chương",
		  "FILE":"medal-betting"
	   },
	   {
		  "_CMSKEY":"o_MOTOSPORT",
		  "EN":"Motor Sports",
		  "ZH":"赛车",
		  "ID":"Motor Sport",
		  "JA":"モーター スポーツ",
		  "KM":"Motor Sports (កីឡាប្រណាំងម៉ូតូ)",
		  "KO":"모터 스포츠",
		  "PT":"Corrida De Carros",
		  "TH":"การแข่งรถ",
		  "VI":"đua Xe Mô-tô",
		  "FILE":"motor-sports"
	   },
	   {
		  "_CMSKEY":"o_OLYMPICS",
		  "EN":"Olympics",
		  "ZH":"奥林匹克或相关事件投注",
		  "ID":"Olimpiade & Pertandingan Dunia",
		  "JA":"オリンピック / ワールド ゲーム",
		  "KM":"Olympics / World Games (កីឡាអូឡាំពិក / កីឡាពិភពលោក)",
		  "KO":"올림픽 / 국제 선수권 대회",
		  "PT":"Olimpíadas / Campeonatos Mundiais",
		  "TH":"โอลิมปิก/ การแข่งขันระดับชาติ",
		  "VI":"Olympics / Giải Đấu Thế Giới",
		  "FILE":"olympics"
	   },
	   {
		  "_CMSKEY":"o_SNOOKER",
		  "EN":"Snooker / Pool",
		  "ZH":"斯诺克/台球",
		  "ID":"Snooker / Billyar",
		  "JA":"スヌーカー / プール",
		  "KM":"កីឡាស្នូកឃ័រ ",
		  "KO":"스누커/포켓볼",
		  "PT":"Sinuca / Bilhar",
		  "TH":"สนุ๊กเกอร์ / พูล",
		  "VI":"Bida",
		  "FILE":"snooker"
	   },
	   {
		  "_CMSKEY":"o_ROWINGCANOEING",
		  "EN":"Rowing / Canoeing",
		  "ZH":"赛艇和皮划艇",
		  "ID":"Dayung & Kano",
		  "JA":"ローイング / カヌーイング(ボート競技)",
		  "KM":"Rowing / Canoeing (កីឡាអុំទូក/ចែវទូក)",
		  "KO":"조정과 카누",
		  "PT":"Remo / Canoagem",
		  "TH":"เรือพาย/เรือแคนู",
		  "VI":"đua Thuyền / Ca Nô",
		  "FILE":"rowing"
	   },
	   {
		  "_CMSKEY":"o_SOFTBALL",
		  "EN":"Softball",
		  "ZH":"垒球",
		  "ID":"Sepakbola",
		  "JA":"フットボール",
		  "KM":"កីឡាបាល់ទាត់",
		  "KO":"축구",
		  "PT":"Futebol",
		  "TH":"ฟุตบอล",
		  "VI":"Bóng Đá",
		  "FILE":"softball"
	   },
	   {
		  "_CMSKEY":"o_TABLETENNIS",
		  "EN":"Table Tennis",
		  "ZH":"兵乓球",
		  "ID":"Tenis MeJA",
		  "JA":"テーブルテニス（卓球）",
		  "KM":"កីឡាវាយប៉េងប៉ុង",
		  "KO":"탁구",
		  "PT":"Tênis De Mesa",
		  "TH":"ปิงปอง",
		  "VI":"Bóng Bàn",
		  "FILE":"table-tennis"
	   },
	   {
		  "_CMSKEY":"o_TENNIS",
		  "EN":"Tennis",
		  "ZH":"网球",
		  "ID":"Tenis",
		  "JA":"テニス",
		  "KM":" (កីឡាតិន្នីស)",
		  "KO":"테니스",
		  "PT":"Tênis",
		  "TH":"เทนนิส",
		  "VI":"Quần Vợt",
		  "FILE":"tennis"
	   },
	   {
		  "_CMSKEY":"o_TRIATHOLONMODERNPENTAHLON",
		  "EN":"Triathlon / Modern Pentahlon",
		  "ZH":"三项全能和现代五项运动",
		  "ID":"Triathlon Dan Pancalomba",
		  "JA":"トライアスロン＆モダン・ペンタロン（近代5種競技）",
		  "KM":"Triathlon And Modern Pentathlon Rules (កីឡាទ្រីយ៉ាថ្លុនិង កីឡាទំនើបទាំងប្រាំ)",
		  "KO":"철인 3종 경기와 근대 5종 경기",
		  "PT":"Triatlo & Pentatlo Moderno",
		  "TH":"กฎ ไตรกีฬา และ ปัญจกีฬาสมัยใหม่",
		  "VI":"Ba Và Năm Môn Thi Đấu Phối Hợp",
		  "FILE":"triathlon-modern-pentahlon"
	   },
	   {
		  "_CMSKEY":"o_VOLLEYBALL",
		  "EN":"Volleyball",
		  "ZH":"排球",
		  "ID":"Bola Voli",
		  "JA":"バレーボール",
		  "KM":"កីឡាបាល់ទះ",
		  "KO":"배구",
		  "PT":"Voleibol",
		  "TH":"วอลเลย์บอล",
		  "VI":"Bóng Chuyền",
		  "FILE":"volleyball"
	   },
	   {
		  "_CMSKEY":"o_WATERPOLO",
		  "EN":"Water Polo",
		  "ZH":"水球",
		  "ID":"Polo Air",
		  "JA":"ウォーター・ポロ（水球）",
		  "KM":"Water Polo (កីឡាបាល់គប់ក្នុងទឹក)",
		  "KO":"수구",
		  "PT":"Pólo Aquático",
		  "TH":"โปโลน้ำ",
		  "VI":"Bóng Nước",
		  "FILE":"water-polo"
	   },
	   {
		  "_CMSKEY":"o_WEIGHTLIFTING",
		  "EN":"Weightlifting",
		  "ZH":"举重",
		  "ID":"Weightlifting",
		  "JA":"ウェイトリフティング（重量上げ）",
		  "KM":"Weightlifting (កីឡាលើកទម្ងន់)",
		  "KO":"역도",
		  "PT":"Halterofilismo",
		  "TH":"กีฬายกน้ำหนัก",
		  "VI":"Cử Tạ",
		  "FILE":"weightlifting"
	   },
	   {
		  "_CMSKEY":"o_WINTERSPORTSWINTEROLYMPICS",
		  "EN":"Wintersports / Winter Olympics",
		  "ZH":"冬季运动& 冬季奥运会/比赛",
		  "ID":"Winter Sports & Winter Olympics / Games",
		  "JA":"ウィンター（冬季）スポーツ＆ウィンター（冬季）オリンピック / ゲーム",
		  "KM":"Wintersports-winterolympics (កីឡារដូវរងា និងកីឡាអូឡាំពិករដូវរងា/កីឡាផ្សេងៗ)",
		  "KO":"동계 스포츠/동계 올림픽",
		  "PT":"Esportes De Inverno & Jogos Olímpicos De Inverno",
		  "TH":"กีฬาฤดูหนาวและโอลิมปิกฤดูหนาว / เกม",
		  "VI":"Cược Thể Thao& Olympics Mùa Đông",
		  "FILE":"wintersports-winterolympics"
	   },
	   {
		  "_CMSKEY":"o_FREEBET",
		  "EN":"Free Bet",
		  "ZH":"免费投注",
		  "ID":"Free Bet",
		  "JA":"フリーベット",
		  "KM":"ច្បាប់ប្រាក់ភ្នាល់ឥតគិតថ្លៃ",
		  "KO":"프리벳",
		  "PT":"Apostas Grátis",
		  "TH":"ฟรีเดิมพัน",
		  "VI":"Cược Miễn Phí",
		  "FILE":"free-bets"
	   },
	   {
		  "_CMSKEY":"o_RUGBY",
		  "EN":"Rugby",
		  "ZH":"橄榄球联盟",
		  "ID":"Rugby",
		  "JA":"ラグビー",
		  "KM":"កីឡាបាល់ឱប",
		  "KO":"럭비 유니언 / 럭비 리그",
		  "PT":"Rugby",
		  "TH":"รักบี้ ลีก",
		  "VI":"Bóng Bầu Dục",
		  "FILE":"rugby"
	   }
	]
 };
let footballAnchor={
  "All Terms": [
    {
      "EN": "General Rules",
      "anchor": "#generalrules",
      "ID": "Peraturan Umum",
      "JA": "一般規則",
      "KM": "ក្បួនទូទៅ",
      "KO": "일반규칙",
      "PT": "Regras Gerais",
      "TH": "กฎทั่วไป",
      "VI": "Luật Chung",
      "ZH": "一般规则"
    },
    {
      "EN": "Main Markets",
      "anchor": "#mainmarkets",
      "ID": "Pasar Utama",
      "JA": "メイン マーケット",
      "KM": "ទីផ្សារសំខាន់",
      "KO": "주요 마켓",
      "PT": "Mercados Principais",
      "TH": "ประเภทการเดิมพันหลัก",
      "VI": "Các Cược Chính",
      "ZH": "主要市场"
    },
    {
      "EN": "Goal Markets",
      "anchor": "#goalmarkets",
      "ID": "Pasar Gol",
      "JA": "ゴール マーケット",
      "KM": "ទីផ្សារគ្រាប់ស៊ុតបញ្ចូលទី",
      "KO": "득점 마켓",
      "PT": "Mercado de Gols",
      "TH": "ประเภทประตู",
      "VI": "Cược Bàn Thắng",
      "ZH": "进球集锦"
    },
    {
      "EN": "Players Markets",
      "anchor": "#playersmarkets",
      "ID": "Pasar Pemain",
      "JA": "プレーヤー マーケット",
      "KM": "ទីផ្សារកីឡាករ",
      "KO": "플레이어 마켓",
      "PT": "Jogadores",
      "TH": "ประเภทผู้เล่น",
      "VI": "Cược Cầu Thủ",
      "ZH": "球员"
    },
    {
      "EN": "Specials",
      "anchor": "#specials",
      "ID": "Spesial",
      "JA": "スペシャル",
      "KM": "ពិសេស",
      "KO": "스페셜",
      "PT": "Especiais",
      "TH": "พิเศษ ",
      "VI": "Cược Đặc Biệt",
      "ZH": "特别"
    },
    {
      "EN": "Corners",
      "anchor": "#corners",
      "ID": "Sudut",
      "JA": "コーナー",
      "KM": "បាល់ជ្រុង",
      "KO": "코너",
      "PT": "Escanteios",
      "TH": "เตะมุม",
      "VI": "Phạt Góc",
      "ZH": "角球"
    },
    {
      "EN": "Bookings / Cards",
      "anchor": "#bookingscards",
      "ID": "Bookings / Kartu",
      "JA": "ブッキング / カード",
      "KM": "ការពិន័យជាកាត",
      "KO": "반칙/카드",
      "PT": "Cartões",
      "TH": "จำนวนใบเตือน",
      "VI": "Thẻ Phạt",
      "ZH": "牌/卡"
    },
    {
      "EN": "Free Kicks",
      "anchor": "#freekicks",
      "ID": "Tendangan Bebas",
      "JA": "フリー キック",
      "KM": "បាល់ហ្វ្រីឃីក",
      "KO": "프리킥",
      "PT": "Faltas",
      "TH": "ฟรีคิก",
      "VI": "Đá Phạt",
      "ZH": "任意球"
    },
    {
      "EN": "Goal Kicks",
      "anchor": "#goalkicks",
      "ID": "Tendangan Gol",
      "JA": "ゴール キック",
      "KM": "បាល់ហ្គោលឃីក",
      "KO": "골킥",
      "PT": "Tiros de Meta",
      "TH": "ลูกตั้งเตะ",
      "VI": "Phát Bóng",
      "ZH": "射门"
    },
    {
      "EN": "Throw-Ins",
      "anchor": "#throwins",
      "ID": "Throw In / Lemparan",
      "JA": "スローイン",
      "KM": "បាល់បោះចូល",
      "KO": "스로인 (Throw-in)",
      "PT": "Laterais",
      "TH": "การทุ่มลูก",
      "VI": "Ném Biên",
      "ZH": "界外球"
    },
    {
      "EN": "Substitutions",
      "anchor": "#substitutions",
      "ID": "Substitusi",
      "JA": "サブスティチューション",
      "KM": "ការប្តូរកីឡាករ",
      "KO": "교체",
      "PT": "Substituições",
      "TH": "เปลี่ยนตัวผู้เล่น",
      "VI": "Thay Người",
      "ZH": "替换"
    },
    {
      "EN": "Offsides",
      "anchor": "#offsides",
      "ID": "Offsides",
      "JA": "オフサイド",
      "KM": "បាល់អកហ្សឺ",
      "KO": "오프사이드",
      "PT": "Impedimentos",
      "TH": "ล้ำหน้า",
      "VI": "Việt Vị",
      "ZH": "越位"
    },
    {
      "EN": "Penalty Markets",
      "anchor": "#penaltymarkets",
      "ID": "Pasar Penalti",
      "JA": "ペナルティー マーケット",
      "KM": "ទីផ្សារបាល់ប៉េណាល់ទី",
      "KO": "승부차기 마켓",
      "PT": "Pênaltis",
      "TH": "การเตะลูกโทษ",
      "VI": "Cược Phạt Đền",
      "ZH": "点球"
    },
    {
      "EN": "Competition Markets",
      "anchor": "#competitionmarkets",
      "ID": "Pasar Kompetisi",
      "JA": "コンペティション マーケット",
      "KM": "ទីផ្សារការប្រកួត",
      "KO": "대회 마켓",
      "PT": "Competições ",
      "TH": "ประเภทการแข่งขัน",
      "VI": "Cược Giải Đấu",
      "ZH": "比赛"
    },
    {
      "EN": "Combined Markets",
      "anchor": "#CombinedMarkets",
      "ID": "Gabungan Markets",
      "JA": "結合されたマーロロット",
      "KM": "ទីផ្សាររួមបញ្ចូលគ្នា",
      "KO": "결합 마켓",
      "PT": "Mercados Combinados",
      "TH": "รวมตลาด",
      "VI": "Cược Kết Hợp",
      "ZH": "综合市场"
    },
    {
      "EN": "Other Markets",
      "anchor": "#othermarkets",
      "ID": "Pasar Lainnya",
      "JA": "その他のマーケット ",
      "KM": "ទីផ្សារផ្សេងៗ",
      "KO": "그 외",
      "PT": "Outros",
      "TH": "ประเภทการเดิมพันอื่นๆ",
      "VI": "Cược Khác",
      "ZH": "其他"
    },
    {
      "EN": "Fantasy Matches",
      "anchor": "#fantasymarkets",
      "ID": "Pertandingan Fantasi",
      "JA": "ファンタジー・マッチ ",
      "KM": "ការប្រកួតសិប្បនិម្មិត",
      "KO": "판타지 경기",
      "PT": "Jogos Fantasia",
      "TH": "แฟนตาซี แมทช์",
      "VI": "Cược Trận Đấu Giả Định",
      "ZH": "奇幻赛事"
    },
    {
      "EN": "E-Football Matches",
      "anchor": "#efootballmatches",
      "ID": "Pertandingan E-Sepakbola",
      "JA": "E-フットボールマッチ",
      "KM": "(E-កីឡាបាល់ទាត់)",
      "KO": "E-축구 경기",
      "PT": "Partidas de E-Futebol",
      "TH": "การแข่งขัน อี-ฟุตบอล",
      "VI": "Các Trận Đấu E-Football",
      "ZH": "电竞足球赛事"
    },
    {
      "EN": "Bet Builder",
      "anchor": "#betbuilder",
      "ID": "Pembuat Taruhan",
      "JA": "ベットビルダー",
      "KM": "ការបង្កើតប័ណ្ណភ្នាល់",
      "KO": "베팅빌더",
      "PT": "Bet Builder",
      "TH": "สร้างบิลสเต็ป",
      "VI": "Cược Tùy Chọn",
      "ZH": "盘口编辑器"
    }
  ]
};

let countrys=[
  "en",
  "id",
  "ja",
  "km",
  "ko",
  "pt",
  "th",
  "vi",
  "zh"
];



let passw={
  pass:"Design2022"
}


function loadHTML(path){
  return new Promise(function(resolve,reject){
    fs.readFile(path,'utf8',function(err,data){
      if(err){
          console.log(err);
          reject(err);
      }
      resolve(data)
  });
  })
}
function writeHTML(data,path){
  return new Promise(function(resolve,reject){
    fs.outputFile(path,data.html(),'utf-8',function(err){
      if(err){
        console.log(err);
       
      }
      resolve()
    })
  })
}

const initServer = async () => {

  app.use('/', express.static(path.join(__dirname, './')));

  app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));

 
  app.use(bodyParser.json('application/json'));

  app.post('/validate', function(request, response){
     console.log(request.body.password);      // your JSON
     // echo the result back
     if(request.body.password===passw.pass){
      response.send("ok")
     }else{
      response.send("password wrong")
     }
     

  });
    
    

    
	let tobeinput=[]

   for(var c=0;c<countrys.length;c++){
    pageNamelistURL= Object.values(localization["All Terms"]);

    let rulepath_landing=__dirname+"/landing.html"
    let landing=await loadHTML(rulepath_landing);
    let $$ = cheerio.load(landing);
		//football
		/* let rulepath_football=__dirname+"/"+countrys[c]+"/sports/football.html"
		let footballpage=await loadHTML(rulepath_football);
    let $$$ = cheerio.load(footballpage);
		
		
		for(var b=0;b<$$$("#linktable a").length;b++){
			
			let county=countrys[c].toUpperCase();
			console.log($$$("#linktable a")[b].children[0].data);
			let objecttoinput={};
			objecttoinput[county]=$$$("#linktable a")[b].children[0].data;
			objecttoinput["anchor"]=$$$("#linktable a")[b].attribs.href;
			if(tobeinput[b]==undefined){
				tobeinput[b]={};
			}
			Object.assign(tobeinput[b], objecttoinput);
			
		} */

		


    //end
    $$("#popularheader").append(pupularheader[countrys[c].toUpperCase()]);
    $$("#atozheader").append(allsports[countrys[c].toUpperCase()]);
		if($$("img").length>0){
			$$("img").attr("src","../../img/banner.png");
		}
		if($$("link").length>0){
			//$$("link").attr("href","https://sports-preview.188sbk.com/assets/sportsRules/css/rules-style.css?vs=a68aa80008");
			$$("link").attr("href","../../../css/rules-style.css?vs=a68aa80008");
		}
		if($$("script").length>0){
			$$("script").remove();
		}
    let landingobj=pageNamelistURL;
    let appenstring;
    let appenstring_all;
    for(var k=0;k<popularlist.length;k++){
      
      for(var i=0;i<pageNamelistURL.length;i++){
        if(pageNamelistURL[i]._CMSKEY==popularlist[k]){
          if(appenstring!=undefined){
            appenstring=appenstring+`<div class='items'><a href='./${pageNamelistURL[i].FILE}.html'>${pageNamelistURL[i][countrys[c].toUpperCase()]}</a></div>`;
          }else{
            appenstring=`<div class='items'><a href='./${pageNamelistURL[i].FILE}.html'>${pageNamelistURL[i][countrys[c].toUpperCase()]}</a></div>`;
          }
          
          $$("#popular").html(appenstring);
          landingobj.splice(i, 1);
        }
      }
      
    }
    for (var i=0;i<landingobj.length;i++){
      if(appenstring_all!=undefined){
        appenstring_all=appenstring_all+`<div class='items'><a href='./${landingobj[i].FILE}.html'>${landingobj[i][countrys[c].toUpperCase()]}</a></div>`;
      }else{
        appenstring_all=`<div class='items'><a href='./${landingobj[i].FILE}.html'>${landingobj[i][countrys[c].toUpperCase()]}</a></div>`;
      }
      $$("#sportatoz").html(appenstring_all);
      
    }
    let landingheaderhtml=`<h1 id='sportRule' class='home'><div id='pageSubName'>${sptitle[countrys[c].toUpperCase()]}</div></h1>`;
    $$("body").prepend(landingheaderhtml);
		await writeHTML($$,"./patched/"+countrys[c]+"/sports/landing.html"); 
    appenstring=undefined;
    for(var i=0;i<pageNamelistURL.length;i++){
      let rulepath;
      

     
      rulepath=__dirname+"/"+countrys[c]+"/sports/"+Object.values(localization["All Terms"])[i].FILE+".html"
      
     
      let rule=await loadHTML(rulepath);

      let $ = cheerio.load(rule);
    
        let filename=Object.values(localization["All Terms"])[i].FILE;
 

        
       
        if($("style").length>0){
          $("style").remove();
        }
        if($("script").length>0){
          $("script").remove();
        }

        if($("link").length>0){
          //$$("link").attr("href","https://sports-preview.188sbk.com/assets/sportsRules/css/rules-style.css?vs=a68aa80008");
			$$("link").attr("href","../../../css/rules-style.css?vs=a68aa80008");
        }
        function isComment(index, node) {
          return node.type === 'comment'
        }
        $.root().contents().filter(isComment).remove();
        $('head').contents().filter(isComment).remove();
        $('body').contents().filter(isComment).remove();
        let headerhtml=`<h1 id='sportRule'><a id='back' href='./landing.html'><img alt='back' src='../../img/chevron_left.png'/></a><div id='pageSubName'>${sptitle[countrys[c].toUpperCase()]}</div><div id='pageName'>${Object.values(localization["All Terms"])[i][countrys[c].toUpperCase()]}</div></h1>`;
        
				$("body").prepend(headerhtml);
        
        await writeHTML($,"./patched/"+countrys[c]+"/sports/"+filename+".html"); 
    } 

    
    
  }   
    
  //footballAnchor["All Terms"]=tobeinput;
    

}


initServer().catch(err => {
    console.log(err);
  })
  