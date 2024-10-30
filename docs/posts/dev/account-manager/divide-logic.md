---
outline: [2, 4]
---

# リファクタリング - コントローラー

ここでは、先ほど実装したコントローラーをリファクタリングしてみようと思います。

今回は、

* [Clean Architecture 達人に学ぶソフトウェアの構造と設計](https://www.amazon.co.jp/Clean-Architecture-%E9%81%94%E4%BA%BA%E3%81%AB%E5%AD%A6%E3%81%B6%E3%82%BD%E3%83%95%E3%83%88%E3%82%A6%E3%82%A7%E3%82%A2%E3%81%AE%E6%A7%8B%E9%80%A0%E3%81%A8%E8%A8%AD%E8%A8%88-Robert-C-Martin/dp/4048930656)
* [エリック・エヴァンスのドメイン駆動設計: ソフトウェアの核心にある複雑さに立ち向かう](https://www.amazon.co.jp/%E3%82%A8%E3%83%AA%E3%83%83%E3%82%AF%E3%83%BB%E3%82%A8%E3%83%B4%E3%82%A1%E3%83%B3%E3%82%B9%E3%81%AE%E3%83%89%E3%83%A1%E3%82%A4%E3%83%B3%E9%A7%86%E5%8B%95%E8%A8%AD%E8%A8%88-Architects%E2%80%99Archive-%E3%82%BD%E3%83%95%E3%83%88%E3%82%A6%E3%82%A7%E3%82%A2%E9%96%8B%E7%99%BA%E3%81%AE%E5%AE%9F%E8%B7%B5-%E3%82%A8%E3%83%AA%E3%83%83%E3%82%AF%E3%83%BB%E3%82%A8%E3%83%B4%E3%82%A1%E3%83%B3%E3%82%B9/dp/4798121967?__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&crid=3MK56G7TOWRFG&dib=eyJ2IjoiMSJ9.14X9aNnAuDMjLncVF-NaRdIpoCsskHQWLhmKC8J81ibBWnzrYMcExIb3oJrFZzJO7uuNIF3fa_up0-xCeMRy6k5zW9uuP5mpWMyqus_wF0HgX6mcJj_EiIasnfrg0yjhvHqmdkopSQD_X-O47n8uw110l1nPzvgAq2DXaKq7Go9KRkK6juHJDIsdPrgnvlDC2R8ORUOpJn7nERAc0STwFaw8bsgCn-ZshgNffu1LoXY.WR-lGK2sA_5Bpk7PYnCnDwBxw6BHl5HvQTB0BKbXPYw&dib_tag=se&keywords=%E3%83%89%E3%83%A1%E3%82%A4%E3%83%B3%E9%A7%86%E5%8B%95%E8%A8%AD%E8%A8%88&qid=1730247995&s=books&sprefix=%E3%83%89%E3%83%A1%E3%82%A4%E3%83%B3%E9%A7%86%E5%8B%95%E8%A8%AD%E8%A8%88,stripbooks,250&sr=1-5)
* [ドメイン駆動設計入門 ボトムアップでわかる！ドメイン駆動設計の基本](https://www.amazon.co.jp/%E3%83%89%E3%83%A1%E3%82%A4%E3%83%B3%E9%A7%86%E5%8B%95%E8%A8%AD%E8%A8%88%E5%85%A5%E9%96%80-%E3%83%9C%E3%83%88%E3%83%A0%E3%82%A2%E3%83%83%E3%83%97%E3%81%A7%E3%82%8F%E3%81%8B%E3%82%8B%EF%BC%81%E3%83%89%E3%83%A1%E3%82%A4%E3%83%B3%E9%A7%86%E5%8B%95%E8%A8%AD%E8%A8%88%E3%81%AE%E5%9F%BA%E6%9C%AC-%E6%88%90%E7%80%AC-%E5%85%81%E5%AE%A3-ebook/dp/B082WXZVPC?__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&crid=3MK56G7TOWRFG&dib=eyJ2IjoiMSJ9.14X9aNnAuDMjLncVF-NaRdIpoCsskHQWLhmKC8J81ibBWnzrYMcExIb3oJrFZzJO7uuNIF3fa_up0-xCeMRy6k5zW9uuP5mpWMyqus_wF0HgX6mcJj_EiIasnfrg0yjhvHqmdkopSQD_X-O47n8uw110l1nPzvgAq2DXaKq7Go9KRkK6juHJDIsdPrgnvlDC2R8ORUOpJn7nERAc0STwFaw8bsgCn-ZshgNffu1LoXY.WR-lGK2sA_5Bpk7PYnCnDwBxw6BHl5HvQTB0BKbXPYw&dib_tag=se&keywords=%E3%83%89%E3%83%A1%E3%82%A4%E3%83%B3%E9%A7%86%E5%8B%95%E8%A8%AD%E8%A8%88&qid=1730247995&s=books&sprefix=%E3%83%89%E3%83%A1%E3%82%A4%E3%83%B3%E9%A7%86%E5%8B%95%E8%A8%AD%E8%A8%88,stripbooks,250&sr=1-4)

この辺を参考にしてみようと思います。

## 業務ロジックを切り離す

まずはさきほののコントローラーを持ってきます

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

このコードをリファクタリングしていこうと思います。

### コントローラーから業務ロジックとDB周りを切り離してみる

メールアドレスは一意のものになっており、重複がないのは業務ロジックかなって思います。

ので、この辺の業務ロジックとDB周りのコードを別のところに置こうと思います。とりあえず`packages`を切っていこうと思います。

### Laravelへの宣戦布告

これ、[PHP Conference Japan 2020, PHP WEBアプリケーション設計入門――10年先を見据えて作る, GMOインターネット | 成瀬 允宣 ( @nrslib )](https://www.youtube.com/watch?v=UTKJ-Lgn3aI&t=2513s)で登壇者の成瀬さんがおっしゃってたキーワードで結構好きなので勝手に持ってきました。

まずは、Laravelに`packages`ディレクトリを切っていこうと思います。

```bash
hogehoge@hogehoge:/var/www/html# mkdir packages
```

これで、Laravelプロジェクトのルートディレクトリに`packages`が切られました。今回はここに色々とコードを書いてみようと思います。

### パッケージ構成

ユースケースモデリング最中にちょっと出したパッケージもどきを持ってきます。

![パッケージもどき](/3-admin-usecase.png)

これは

* 従業員管理
* アカウント管理
* 貸与管理

の三つがあると思います。今回はこれに習ってパッケージを作成しようと思います。

まずは従業員管理についてです。

## 従業員パッケージを作成する

命名は結構雑ですが、許してください。


```bash
hogehhoge@hogehoge:/var/www/html# mkdir -p packages/Users/ApplicationService/Create
```

これで、とりあえず従業員パッケージを切りました。アプリケーションサービスまで一気に切りました。

そして、ここにファイルを作ります。

```bash
hogehoge@hogehoge:/var/www/html# touch packages/Users/ApplicationService/Create/CreateUserHandleService.php
```

今回はここに、業務ロジックを移植します。


```php
<?php

declare(strict_types=1);

namespace User\ApplicationService\Create;

use App\Models\User;
use Exception;
use illuminate\Support\Str;

class CreateUserHandleService
{
    public function handle(
        string $name,
        string $email,
        string $permission
    ) {
        $validate = [
            'name' => $name,
            'email' => $email,
            'permission' => $permission,
        ];

        if (User::where('email', $validate['email'])->first()) {
            throw new Exception('Email already exists.', 409);
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
    }
}
```

### コントローラーのリファクタリング

これで、コントローラーからこの辺のコードを切り離すことができますね。

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use User\ApplicationService\Create\CreateUserHandleService;

class CreateUserController extends Controller
{
    public function handle(
        Request $http_request,
        CreateUserHandleService $service
    ) {
        $validate = $http_request->validate(
            [
                'name' => ['required', 'string', 'between:1,20'],
                'email' => ['required', 'email:filter,dns', 'between:1,100'],
                'permission' => ['required', 'in:admin,employee,viewer', 'between:1,100'],
            ]
        );

        $service->handle(
            $validate['name'],
            $validate['email'],
            $validate['permission']
        );

        return response()->json();
    }
}
```

### クリーンアーキテクチャを考えてみる

いきなり変な話をぶち込んですみません。ここでアーキテクチャについて話しますね。

![clean architecture](/clean-architecture.png)

個人的にとても気になっていたフレームワークですが、今用意した`CreateUserHandleService.php`は`clean architecture`で言うところの`Application business rules`に位置するものだと思っています。

しかしこのファイルには、

```php
use App\Models\User;
use illuminate\Support\Str;
```

こんな感じのコードがあります。本来これらは一番外側の`Frameworks & Drivers`に来ると思うのですが、このアプリケーションに来てしまっています。

次回は、この辺のコードを引き剥がしていこうと思います。