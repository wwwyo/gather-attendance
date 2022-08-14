gather-notification
---

GatherTownで誰かが入室したときにIncoming Webhookでユーザー名を通知する

## 環境構築

### Node.jsをインストール

```
$ which node
/usr/bin/node
$ which npm
/usr/bin/npm
```

### TypeScriptをインストール

```
$ npm install -g typescript
$ which tsc
/usr/bin/tsc
```

### ビルド（`./index.js`が生成される）

```
$ npm install
$ npm run build
```

### 環境変数の設定

`.env`を作成する。

`.env`の例

```
SPACE_ID=hiPW2zdYas9ZsZXN\HPCS
API_KEY=XXXXXXXXXXXXXXXX
HOOKS_URL=https://hooks.slack.com/services/A/B/C,https://hooks.slack.com/services/D/E/F
```

#### SPACE_ID

スーペスのID。これはURLから分かる。
例えば`https://app.gather.town/app/hiPW2zdYas9ZsZXN/HPCS`の場合、`hiPW2zdYas9ZsZXN\HPCS`となる（`/`を`\`に置き換える）。

#### API_KEY

そのスペースのメンバーがAPI Keyを作成する（Adminである必要があるかは不明）。
API Keyは https://app.gather.town/apikeys から作成できる。

#### HOOKS_URL

通知したいアプリのHooks URLを`,`区切りで設定する。

Slackの場合は https://api.slack.com/start からHooks URLを作成する。
これはSlackのAdminではない自分でもできた。

## 実行

```
$ node index.js
```