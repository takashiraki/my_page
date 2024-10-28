---
outline: [2, 4]
---

# ユースケース - 代替

基本ユースケースで作成したユースケースです。

> 管理者は、従業員一覧画面にある『追加』ボタンをクリックする。システムは登録画面を表示する。ユーザーは
> 
> * 従業員名
> * メールアドレス
> * 権限
>
> これらを入力する。管理者は『登録する』をクリックする。
>
> システムは、フォームの入力内容を受け取る。システムは従業員データを保存する。システムは完了画面を表示する。

今回は、ユースケース駆動を参考にしながら、代替コースを考えていこうと思います。

## 代替コースとは

基本コースでは、ユーザーはこちらが意図した通りの動きや内容を入力しているという暗黙の世界があります。
しかし、実際にユーザーはこちらが意図した通りに動かないなんてケースもある話だと思います。

そこで、こちらが意図しないケースを考えていくのが、代替コースでのメイントピックになります。

## 早速考えてみる

![管理者がユーザーを登録するユースケース](/6-admin-usecase.png)

まずは、このユースケース図では、ログインされている前提で話が進んでいますが、ログインをしていないケースがあるかもしれません。ので、ユースケースの代替コースに下記内容が追加されますね

> * ログインしていない場合 : 

ログインしていない場合は、ログイン画面に飛ぶのが一般的かなと思うので、それをそのまま記載してみましょう。

> * ログインしていない場合 : ログイン画面にリダイレクト

続いて、『問題分析』で出した従業員クラスから、考えてみましょう。

![それっぽいクラス図もどき](/2-class.png)

まずは、この従業員は名前と権限を持っています。代替コースでログインが出てきたということは、何かしらの情報でログインをするわけですね。

今回はこれは、メールアドレスとパスワードでログインできるようにしようと思います。よって、このクラス図は下記画像のようになると思います。

![それっぽいクラス図もどき](/3-class.png)

管理者は、これら情報を使ってユーザーの登録をするようになると思います。今回は初回パスワードはシステム側で作って、初回ログイン時にユーザーがパスワードを変えるような設定にしようと思います。

そうなると、従業員登録時に

* 従業員名
* メールアドレス
* 権限

これらを入力します。これらを普通に入力されないケースとして

* 従業員名、メールアドレス、権限が入力されていない
* 従業員名、メールアドレス、権限に非常に長い値が入力されている

などが考えられます。そのため、これらも代替コースに入ると思います。

> * ログインしていない場合 : ログイン画面にリダイレクト
> * 従業員名、メールアドレス、権限が入力されていない：再度入力させる
> * 従業員名、メールアドレス、権限に非常に長い値が入力されている：こちらも再度入力させる

こうなるのかなと。

また、従業員のメールアドレスは、会社の中では一人一個で重複は発生しないものになっています。なので

> * ログインしていない場合 : ログイン画面にリダイレクト
> * 従業員名、メールアドレス、権限が入力されていない：再度入力させる
> * 従業員名、メールアドレス、権限に非常に長い値が入力されている：こちらも再度入力させる
> * 既に同じメールアドレスが登録されている：再度入力させる

こんな感じになりますかね。

## ユースケースを振り返る

> ### 基本コース
> 管理者は、従業員一覧画面にある『追加』ボタンをクリックする。システムは登録画面を表示する。ユーザーは
> 
> * 従業員名
> * メールアドレス
> * 権限
>
> これらを入力する。管理者は『登録する』をクリックする。
>
> システムは、フォームの入力内容を受け取る。システムは従業員データを保存する。システムは完了画面を表示する。
>
> ### 代替コース
> 
> * ログインしていない場合 : ログイン画面にリダイレクト
> * 従業員名、メールアドレス、権限が入力されていない：再度入力させる
> * 従業員名、メールアドレス、権限に非常に長い値が入力されている：こちらも再度入力させる。

代替コースをブラッシュアップしたので、基本コースもブラッシュアップしてみましょう。

### バリデーションルール

> * 従業員名、メールアドレス、権限が入力されていない：再度入力させる
> * 従業員名、メールアドレス、権限に非常に長い値が入力されている：こちらも再度入力させる。

この代替コースについて考えてみます。

#### 従業員名

従業員名のバリデーションルールですが、思い当たる感じだと

* 1文字以上20文字以内くらい（今のところそんな感じがします）
* 文字列
* 入力必須

多分こんな感じですかね。長さは結構適当に決めてます

#### メールアドレス

メールアドレスのバリデーションルールは、思い当たる感じだと

* 1文字以上100文字以内くらい（今のところそんな感じがします）
* メールアドレス
* 入力必須

多分こんな感じですかね、こちらも長さは適当に決めてます

#### 権限

権限に関しては、

* 文字列
* 管理者、従業員、閲覧者のどれか
* 入力必須

このようになるかと思います。

これらバリデーションルールも一応追加しておいてもいいかなと思いました。

## ユースケースのブラッシュアップ

バリデーションルールで浮かんできたものを、ユースケースに反映させていきます。


> ### 基本コース
> 管理者は、従業員一覧画面にある『追加』ボタンをクリックする。システムは登録画面を表示する。ユーザーは
> 
> * 従業員名
> * メールアドレス
> * 権限
>
> これらを入力する。管理者は『登録する』をクリックする。
>
> システムは、フォームの入力内容を受け取る。システムは、下記バリデーションを実施する
>
> * 従業員名：入力必須、文字列、1文字以上20文字以内
> * メールアドレス：入力必須、メールアドレス、1文字以上100文字以内、重複していないか
> * 権限：入力必須、文字列、管理者、従業員、閲覧者のどれか
> 
> システムは従業員データを保存する。システムは完了画面を表示する。
>
> ### 代替コース
> 
> * ログインしていない場合 : ログイン画面にリダイレクト
> * バリデーションエラー：再度入力させる。

多分こんな感じになるかなと思います。

多分この章はこんな感じでいいかなと思います。個人的にはもうアプリ作れそうなのですが、ロバストネス分析くらいまで流行ってから、ソースコードを書いていこうと思います。