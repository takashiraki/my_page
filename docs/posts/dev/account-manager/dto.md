---
outline: [2, 4]
---

# 従業員登録境界オブジェクト

ここでは、実際に境界オブジェクトを実装してみようと思います。

- DDD
- Clean architecture

この辺の書籍を元に実装をしてみています。

## まずはインターフェースを切る

![財務系アプリケーションのアーキテクチャサンプル](/finance-clean-architecture.png)

よくみる図とはまた別の、書籍に記載されてた画像です。

これをみると、コントローラーからアプリケーションの間には、DTOみたいなものと、Interfaceがあると思います。

今回は、これらを元に実装を行います。ので、まずはインターフェースを切ります。


```bash
mkdir -p packages/Users/UseCase/Create/Handle
touch packages/Users/UseCase/Create/Handle/CreateUserHandleRequester.php
```

ついでに、DTOみたいなのも作ってみます。

```bash
touch packages/Users/UseCase/Create/Handle/CreateUserHandleRequest.php
touch packages/Users/UseCase/Create/Handle/CreateUserHandleResponse.php
```

実際に中身を実装していきます。

```php
<?php

declare(strict_types=1);

namespace User\UseCase\Create\Handle;

readonly class CreateUserHandleRequest
{
    public function __construct(
        public string $name,
        public string $email,
        public string $permission
    ) {
    }
}
```

まずはリクエストです。

```php
<?php

declare(strict_types=1);

namespace User\UseCase\Create\Handle;

readonly class CreateUserHandleResponse
{
    public function __construct(
        public array|null $request_error_messages = null,
        public array|null $handle_error_messages = null,
    ) {
    }
}
```

レスポンスも実装していきます。

```php
<?php

declare(strict_types=1);

namespace User\UseCase\Create\Handle;

interface CreateUserHandleRequester
{
    public function handle(CreateUserHandleRequest $request): CreateUserHandleResponse;
}
```

最後にインターフェースを定義していきます。

![clean architecture sample](/clean-architecture-sample.png)

これで、この図でいうところの`boundary objects`みたいなのが実装できました。

## スタブの実装
次にスタブオブジェクトを作っておこうと思います。これは、コントローラーへの機能テストの時にあったら便利かなと思ったので、スタブ作っていこうと思います。

```bash
mkdir -p packages/Users/StubGenerator/Create/Handle
```

まずはディレクトリを切って

```php
<?php

declare(strict_types=1);

namespace Users\StubGenerator\Create\Handle;

use User\UseCase\Create\Handle\CreateUserHandleRequest;
use User\UseCase\Create\Handle\CreateUserHandleRequester;
use User\UseCase\Create\Handle\CreateUserHandleResponse;

class StubCreateUserHandleGenerator implements CreateUserHandleRequester
{
    public function handle(CreateUserHandleRequest $request): CreateUserHandleResponse
    {
        return new CreateUserHandleResponse();
    }
}
```

成功を必ず返すようにします。

## Presenterの実装

ここからは、財務系アプリケーションのアーキテクチャ例で出ていた、`Presenter`の実装をしてみようと思います。


```php
<?php

declare(strict_types=1);

namespace User\Presenter\Create\Handle;

use User\UseCase\Create\Handle\CreateUserHandleResponse;

interface CreateUserHandlePresenterInterface
{
    public function output(CreateUserHandleResponse $response): mixed;
}
```

正直できているのかわかりませんが、一旦このまま行ってみようと思います。

次からは実際にアプリケーションサービスを実装してみようと思います。