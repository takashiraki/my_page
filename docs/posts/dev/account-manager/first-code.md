---
outline: [2, 4]
---

# とりあえず書いてみる

まずは、とりあえずコントローラーに全てベタガキしてみようと思います。

## ユースケース記述

> ### 基本コース
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
> ### 代替コース
> 
> * ログインしていない場合 : ログイン画面にリダイレクト
> * バリデーションエラー：再度入力させる
> * すでにメールアドレスが登録されている場合 : 再度入力させる

### ロバストネス図

![ロバストネス図](/8-robustness.png)

## 実装

まずはコントローラーに決まってる範囲のみ全部書いてみようと思います。

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use illuminate\Support\Str;

class CreateUserController extends Controller
{
    public function handle(
        Request $http_request
    ) {
        $validate = $http_request->validate(
            [
                'name' => ['required', 'string', 'between:1,20'],
                'email' => ['required', 'email:filter,dns', 'between:1,100'],
                'permission' => ['required', 'in:admin,employee,viewer', 'between:1,100'],
            ]
        );

        if (User::where('email', $validate['email'])->first()) {
            return response()->json([], 409);
        }

        User::create(
            [
                'user_id' => (string)Str::uuid(),
                'user_name' => $validate['name'],
                'email' => $validate['email'],
                'permission' => $validate['permission'],
                'password' => bcrypt(Str::random(10)),
            ]
        );

        return response()->json();
    }
}
```

パスワードの通知とか結構やっていないので雑なんですけど、ざっくりとこんな感じのコードになると思います。ワンチャン違うかもしれないですが...

このコードは、コントローラーに

* バリデーション
* データベースとの連携

と複数の関心ごとをもっています。このままでは、バリデーションロジックを修正した時に、データベース周りにも影響が出るかもしれなかったりと、結構複雑な状態になっているので、それをまずは分けてみましょう。

コントローラーの責務は、データの仲介役です。ユーザーが入力したデータをアプリケーションに流すための役割であると思います。

次の項目で、実際にリファクタリングをしてみようと思います。