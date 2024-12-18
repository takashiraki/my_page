---
outline: [2, 4]
---

# ロバストネス分析 - 代替

前回は、基本コースのロバストネス図の作成を行いました。今回はこれに加えて、代替コースのロバストネス図の作成を行おうと思います。

## ユースケース記述
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

## ロバストネス図

![ロバストネス図](/6-robustness.png)

## 代替コースのロバストネス図を記載する

まずは、代替コースのおさらいをします。

### 代替コース

> **代替コース**
> 
> * ログインしていない場合 : ログイン画面にリダイレクト
> * バリデーションエラー：再度入力させる
> * すでにメールアドレスが登録されている場合 : 再度入力させる

代替コースはこんな感じになっています。これに全ての代替コースを追加していこうと思います。今回はログインはロバストネス図には記載しないで、2つ目から記載していこうと思います。

### バリデーションエラー

まずはバリデーションエラーの場合を考えます。バリデーションチェックに引っかかった場合は、再度入力させるため、入力画面をシステムは表示させます。

![ロバストネス図](/7-robustness.png)

これで、バリデーションエラー時のロバストネス図が完了だと思います。

### すでにメールアドレスが登録されている場合

この場合はエンティティを参照する必要がありますね。こちらも最終的にはユーザー登録画面を表示するようにしようとおもいます。


![ロバストネス図](/8-robustness.png)

これでおそらく全ての代替コースが完了したかなと思います。

最後にまとめましょう。

## 最終的なユースケース記述

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

## 最終的なロバストネス図

![ロバストネス図](/8-robustness.png)

これでおそらく完成でしょう。

ここからは実際にソースコードを書いていこうと思います。