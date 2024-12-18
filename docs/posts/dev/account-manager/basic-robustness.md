---
outline: [2, 4]
---

# ロバストネス分析 - 基本

先ほどまでで一旦完成した、ユースケースを持ってきます。

## ユースケース

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
> * バリデーションエラー：再度入力させる

今回は、このユースケースをもとに、『ユースケース駆動開発実践ガイド』を参考にしながら、ロバストネス分析をやってみようと思います。

## ロバストネス図作成

今回ユーザー登録は、一覧リストの右上にある『追加』ボタンみたいなもので追加を始めることにします。

そうなると、最初のロバストネス図は下記のようになると思います。

![ロバストネス図](/1-robustness.png)

これに、追加する動作を加えていきます。

![ロバストネス図](/2-robustness.png)

おそらくこんな感じになると思います。続いて、システムはユーザー登録画面を表示します。

![ロバストネス図](/3-robustness.png)

続いて、ユーザーは

* 従業員名
* メールアドレス
* 権限

これらを入力します。

![ロバストネス図](/4-robustness.png)

コード変えたら図が縦になりました、びっくり。

まずは基本コースのみを考えるので、次はメールアドレス重複を確認するようにします。
後々アーキテクチャのところで書こうと思いますが、コントローラーのバリデーションでは入力内容が意図するものか否かを確認するようにして、アプリケーションコード内で、メールアドレスの重複チェックをするようにしようとおもいます。

ので、ユースケースも一部ブラッシュアップですね。

> **基本コース**
> 
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
> * メールアドレス：入力必須、メールアドレス、1文字以上100文字以内
> * 権限：入力必須、文字列、管理者、従業員、閲覧者のどれか
>
> その後、システムはメールアドレス重複がないか、データベースに問い合わせる
> 
> システムは従業員データを保存する。システムは完了画面を表示する。
>
> **代替コース**
> 
> * ログインしていない場合 : ログイン画面にリダイレクト
> * バリデーションエラー：再度入力させる
> * すでにメールアドレスが登録されている場合 : 再度入力させる

こんな感じにブラッシュアップされるのかなと思います。

動きとしては、情報入力後にユーザーは『登録する』みたいなボタンをクリックして、システムが動き出す感じになるかと思います。

![ロバストネス図](/5-robustness.png)

バリデーションチェックが完了したら、システムはメアド重複を確認して、問題なければ従業員を登録して、システムは完了画面を表示させます。

![ロバストネス図](/6-robustness.png)

おそらくこれで、従業員登録に関する基本コースのロバストネス図は完了だと思います。

次の回では、代替コースのロバストネス図を追加していこうと思います。