// 認証用インスタンスの生成
const twitter = TwitterWebService.getInstance(
  'XXXXXXXXXXXXX', // API Key
  'XXXXXXXXXXXXX'  // API secret Key
);

// アプリを連携認証
const authorize = () => {
  twitter.authorize();
};

// 認証解除
const reset = () => {
  twitter.reset();
};

// 認証後のコールバック関数
const authCallback = (request) => {
  return twitter.authCallback(request);
}

// 定数定義
// 正規表現
const regexp = /刀|古|心|薙|琵|拒|銃|炎|扇|笛|恐|忍|戦|傘|社|書|経|鎚|金|毒|絆|絡|機|友|乗|騎|新|爪|嵐|鎌|塵|旗|勾|橇|鏡|花|魂|櫂|信|兜|棹|面|剣|衣|算|鋸/g;
// 変換マップ
const convertMap = {
  '刀': 'ユリナ',
  '古': 'Aユリナ',
  '心': 'A2ユリナ',
  '薙': 'サイネ',
  '琵': 'Aサイネ',
  '拒': 'A2サイネ',
  '銃': 'ヒミカ',
  '炎': 'Aヒミカ',
  '扇': 'トコヨ',
  '笛': 'Aトコヨ',
  '恐': 'A2トコヨ',
  '忍': 'オボロ',
  '戦': 'Aオボロ',
  '傘': 'ユキヒ',
  '社': 'Aユキヒ',
  '書': 'シンラ',
  '経': 'Aシンラ',
  '鎚': 'ハガネ',
  '金': 'Aハガネ',
  '毒': 'チカゲ',
  '絆': 'Aチカゲ',
  '絡': 'クルル',
  '機': 'Aクルル',
  '友': 'A2クルル',
  '乗': 'サリヤ',
  '騎': 'サリヤ',
  '新': 'Aサリヤ',
  '爪': 'ライラ',
  '嵐': 'Aライラ',
  '鎌': 'ウツロ',
  '塵': 'Aウツロ',
  '旗': 'ホノカ',
  '勾': 'Aホノカ',
  '橇': 'コルヌ',
  '鏡': 'ヤツハ',
  '花': 'Aヤツハ',
  '魂': 'AAヤツハ',
  '櫂': 'ハツミ',
  '信': 'Aハツミ',
  '兜': 'ミズキ',
  '棹': 'メグミ',
  '面': 'カナヱ',
  '剣': 'カムヰ',
  '衣': 'レンリ',
  '算': 'アキナ',
  '鋸': 'シスイ'
};

// DM送信
const sendDM = (text) => {
  const recieverUserId = 'XXXXXXXXX';  // 送信先のユーザのID。@以降ではなく内部で振られている数字表記のIDを指定すること
  const service = twitter.getService();
  const endPointUrl = 'https://api.twitter.com/2/dm_conversations/with/' + recieverUserId + '/messages';
  const message = {
    text: text
  };
  const options = {
    method: 'post',
    muteHttpExceptions: false,
    contentType: 'application/json',
    payload: JSON.stringify(message)
  }

  const response = JSON.parse(service.fetch(endPointUrl, options));

  // リクエスト結果
  console.log(response);
};

// リストからツイート取得
const getTweetFromList = () => {
  const listId = 'XXXXXXXXXXXXXXXXXX';  // 取得対象のリストのID（数字表記）
  const service = twitter.getService();
  const endPointUrl = 'https://api.twitter.com/2/lists/' + listId + '/tweets?max_results=10&tweet.fields=created_at,author_id&expansions=author_id';
  const options = {
    method: 'get',
    muteHttpExceptions: false
  };

  const response = JSON.parse(service.fetch(endPointUrl, options));
  // 補足情報
  const includes = response.includes.users;

  // リクエスト結果
  console.log(response);

  // 10分以内のツイート抽出
  const tweetsWitin10Minutes = getTweetsWitin10Minutes(response.data);

  // 10分以内の各ツイートに対して処理
  tweetsWitin10Minutes.forEach((tweet) => {
    const text = tweet.text;
    // リストにある用語を含んでいれば変換
    const replacedText = replaceText(text);
    // 変換されている場合
    if (text !== replacedText) {
      // ユーザ名を探す
      const userData = includes.find((elem) => elem.id === tweet.author_id);
      const userName = userData ? userData.name : '';
      // DM送信内容
      const dmMessage = 'ツイート者: ' + userName + '\n\n' + replacedText;
      // DM送信
      sendDM(dmMessage);
    }
  });
};

// 略語をメガミ名に変換する関数
const replaceText = (text) => {
  const replacedText = text.replaceAll(regexp, (match) => {
    return convertMap[match]; 
  });
  return replacedText;
};

// 分加算関数
const addMinutes = (date, minutes) => {
  const copiedDate = new Date(date.getTime());
  copiedDate.setMinutes(copiedDate.getMinutes() + minutes);

  return copiedDate;
};

// 日付をparseし、ローカルタイムに変換する関数
const parseTime = (dateStr) => {
  const parsedDate = new Date(dateStr);

  return parsedDate;
};

// 10分以内のツイートを取得
const getTweetsWitin10Minutes = (dataList) => {
  const now = new Date();
  const nowTime = now.getTime();
  // 10分前
  const date10MinutesBefore = addMinutes(now, -10);
  const date10MinutesBeforeTime = date10MinutesBefore.getTime();

  const filteredList = dataList.filter((data) => {
    const createdDate = parseTime(data['created_at']);
    const createdDateTime = createdDate.getTime();

    return date10MinutesBeforeTime <= createdDateTime && createdDateTime <= nowTime;
  });

  return filteredList;
};