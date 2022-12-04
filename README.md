# ふるよにTwitterBot
ツイート内に含まれる象徴武器をメガミ名に自動変換し、変換結果をDMで送ってくれるbotです。

## 注意事項
* 個人利用用に作ったbotです。1度に取得するツイート数等、自分のユースケースに合わせた設定になっています。必要あれば自分で数値を書き換えて下さい
* 文脈を考慮せず変換をかけているため、象徴武器以外の用途でその単語が用いられている場合も自動変換されます
    * 今後余裕があれば頻出単語等を間引く処理を追加し、より正確性は向上させる予定です

## 使い方
Google Apps Scriptで動かします。
概要を以下に示しますが、詳細な手順は適宜検索して下さい。

1. TwitterDeveloperアカウントを取得し、API KeyとAPI secret Keyを入手します。
2. Google Apps ScriptでCallbackURLを作成し、その情報をTwitterDeveloper側に登録することで、連携させます
3. Google Apps ScriptにOAuth1とTwitterWebServiceを追加します
4. 本リポジトリのFuruyoniTwitterBot.jsをGoogle Apps Scriptに貼り付けます。
5. FuruyoniTwitterBot.js内の定数部分を適宜書き換えます。主な書き換え対象は以下のとおりです。
    * API Key（1で取得したものを設定）
    * API secret Key（1で取得したものを設定）
    * 変換結果送信先のユーザID（Twitterの画面から取得できるのか不明。自分はuserAPI投げて@表記の名前から変換結果を取得しました）
    * リストID（これはTwitterのリストの画面のURLから取得できます）
6. Google Apps ScriptでgetTweetFromList関数に対してトリガー実行を設定します。数値を書き換えた場合は自由ですが、デフォルトでは10分以内にリストに登録されたツイートを取得する作りになっているため、10分間隔で実行するように設定してください。

## 参考にさせていただいたリンク
[初心者がGASを使ってTwitter Botを作ってみた（コードもあるよ☆）](https://qiita.com/kagawakensan/items/bc8b8f0e333187b5f545)
