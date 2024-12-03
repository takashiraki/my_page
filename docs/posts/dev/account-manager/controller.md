---
outline: [2, 4]
---

# Controller

ここからは、`Controller`の実装に入ろうと思います。

## とりあえず途中経過

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\CreateUserRequest;
use Illuminate\Http\JsonResponse;
use User\UseCase\Create\Handle\CreateUserHandleRequest;
use User\UseCase\Create\Handle\CreateUserHandleRequester;

class CreateUserController extends Controller
{
    public function handle(
        CreateUserRequest $http_request,
        CreateUserHandleRequester $service
    ): JsonResponse {
        $app_request = new CreateUserHandleRequest(
            $http_request->input('name'),
            $http_request->input('email'),
            $http_request->input('permission')
        );

        $app_response = $service->handle($app_request);

        return response()->json();
    }
}
```

これ、めっちゃ途中です。ここで、`$app_response`に注目をすると

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

となっています。

これはDTOとして書いてみているんですが、なんか

- 結果を表すオブジェクト
- DTO

となっていて、責務が二個あるなと思ったので、結果を表すオブジェクトを作成します。

```php
<?php

declare(strict_types=1);

namespace User\UseCase\Create\Handle;

use USer\ApplicationService\Create\Handle\CreateUserHandleResult;

readonly class CreateUserHandleResponse
{
    public function __construct(
        public CreateUserHandleResult $result
    ) {
    }
}
```

こんな感じにしてみました。アプリケーションサービスも修正済みです。

## 結果コントローラーこんな感じ

こんな感じの実装に落ち着きました。

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\CreateUserRequest;
use Illuminate\Http\JsonResponse;
use User\UseCase\Create\Handle\CreateUserHandleRequest;
use User\UseCase\Create\Handle\CreateUserHandleRequester;

class CreateUserController extends Controller
{
    public function handle(
        CreateUserRequest $http_request,
        CreateUserHandleRequester $service
    ): JsonResponse {
        $app_request = new CreateUserHandleRequest(
            $http_request->input('name'),
            $http_request->input('email'),
            $http_request->input('permission')
        );

        $app_response = $service->handle($app_request);

        if ($app_response->result->iserror()) {
            $status = '';
            $message = [];

            if ($app_response->result->request_error_messages !== null) {
                $status = '422';
                $message = $app_response->result->request_error_messages;
            }

            if ($app_response->result->handle_error_messages !== null) {
                $status = '500';
                $message = $app_response->result->handle_error_messages;
            }

            return response()->json($message, $status);
        }

        return response()->json();
    }
}
```
テストも実装しました。

```php
<?php

declare(strict_types=1);

namespace Tests\Feature\User;

use App\Http\Requests\User\CreateUserRequest;
use Illuminate\Auth\Middleware\Authenticate;
use Illuminate\Support\Str;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class CreateUserTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();
        $this->withoutMiddleware(Authenticate::class);
    }

    public function testBasicHandle(): void
    {
        $response = $this->post(
            '/api/user/store',
            [
                'name' => 'test',
                'email' => 'hogehoge@hogehoge.com',
                'permission' => 'admin',
            ]
        );

        $response->assertStatus(200);
    }

    public function testBasicHandleJson(): void
    {
        $response = $this->postJson(
            '/api/user/store',
            [
                'name' => 'test',
                'email' => config('mail.test.email'),
            ]
        );

        $response->assertJson([]);
    }

    #[DataProvider('dataProvider')]
    public function testRequestError(array $params, array $expected): void
    {
        $request = new CreateUserRequest();

        $rules = $request->rules();

        $result = validator($params, $rules)->getMessageBag()->get($expected['key']);

        $this->assertSame(
            $expected['item'],
            $result[array_search($expected['key'], array_keys($result), true)]
        );
    }

    public static function dataProvider(): array
    {
        return [
            [
                [
                    'name' => '',
                    'email' => 'hogehoge@hogehoge.com',
                    'permission' => 'admin',
                ],
                [
                    'key' => 'name',
                    'item' => '名前は必ず指定してください。',
                ],
            ],
            [
                [
                    'name' => 1,
                    'email' => 'hogehoge@hogehoge.com',
                    'permission' => 'admin',
                ],
                [
                    'key' => 'name',
                    'item' => '名前は文字列を指定してください。',
                ],
            ],
            [
                [
                    'name' => 'hogehogehogehogehogehogehogehogehogehogehogehogehoge',
                    'email' => 'hogehoge@hogehoge.com',
                    'permission' => 'admin',
                ],
                [
                    'key' => 'name',
                    'item' => '名前は、50文字以下で指定してください。',
                ],
            ],
            [
                [
                    'name' => 'hogehoge',
                    'email' => '',
                    'permission' => 'admin',
                ],
                [
                    'key' => 'email',
                    'item' => 'メールアドレスは必ず指定してください。',
                ],
            ],
            [
                [
                    'name' => 'hogehoge',
                    'email' => 1,
                    'permission' => 'admin',
                ],
                [
                    'key' => 'email',
                    'item' => 'メールアドレスには、有効なメールアドレスを指定してください。',
                ],
            ],
            [
                [
                    'name' => 'hogehoge',
                    'email' => Str::random(100) . '@hogehoge.com',
                    'permission' => 'admin',
                ],
                [
                    'key' => 'email',
                    'item' => 'メールアドレスには、有効なメールアドレスを指定してください。',
                ],
            ],
            [
                [
                    'name' => 'hogehoge',
                    'email' => 'hogehoge@hogehoge.com',
                    'permission' => '',
                ],
                [
                    'key' => 'permission',
                    'item' => '権限は必ず指定してください。',
                ],
            ],
            [
                [
                    'name' => 'hogehoge',
                    'email' => 'hogehoge@hogehoge.com',
                    'permission' => 1,
                ],
                [
                    'key' => 'permission',
                    'item' => '選択された権限は正しくありません。',
                ],
            ],
            [
                [
                    'name' => 'hogehoge',
                    'email' => 'hogehoge@hogehoge.com',
                    'permission' => 'hogehoge',
                ],
                [
                    'key' => 'permission',
                    'item' => '選択された権限は正しくありません。',
                ],
            ],
        ];
    }
}
```

## DIについて
DIとは、依存関係逆転のことで、[Clean Architecture 達人に学ぶソフトウェアの構造と設計](https://www.kadokawa.co.jp/product/301806000678/)では、SOLID原則のDで紹介されています。

同書では

> ソースコードの依存関係が（具象ではなく）抽象だけを参照しているもの。それが最も柔軟なシステムである。これが『依存関係逆転の原則（DIP)』の伝えようとしていることである。

と書いてあります。これは。参照先をなるべく抽象クラスにしようぜってことだと理解しています。

例えば、コントローラーのコンストラクタを見ると

```php
public function handle(
    CreateUserRequest $http_request,
    CreateUserHandleRequester $service
): JsonResponse
```

このようになっていると思います。`CreateUserRequest $http_request,`こやつはすみません、って感じですが、`CreateUserHandleRequester $service`こちらは実際に中小に依存するようになっています。

```php
<?php

declare(strict_types=1);

namespace User\UseCase\Create\Handle;

interface CreateUserHandleRequester
{
    public function handle(CreateUserHandleRequest $app_request): CreateUserHandleResponse;
}
```

こうすることで、コントローラーはアプリケーションについて知らなくても良くなるってことになるんでしょう。