---
outline: [2, 4]
---

# アプリケーションサービス

ここからは実際にアプリケーションサービスを実装してみようと思います。
まずは、ユースケース記述を持ってこようと思います。

## ユースケース

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

ここで、

> システムはメールアドレス重複がないか

という記載をしています。これを命ずるための場所と、

> システムは従業員データを保存する

これを命ずる場所を作ってあげるところから始めようと思います。

最初は従業員ドメインオブジェクトに作ろうと思ったのですが、

```php
<?php
$user = new User();

$user->create();
```

みたいになると、ユーザー自身に作成しろと命じていたり

```php
<?php
$user = new User();

$exist = $user->existByEmail();
```

みたいにユーザー自身に存在するか否かを命ずる形になってしまい、なんか変だなと思ったので、

* ドメインサービス
* リポジトリ

この辺を作っていきます。

なお、この辺も

* [Clean Architecture 達人に学ぶソフトウェアの構造と設計](https://www.kadokawa.co.jp/product/301806000678/)
* [エリック・エヴァンスのドメイン駆動設計](https://www.shoeisha.co.jp/book/detail/9784798126708)

この辺を参考にしています。

### ドメインサービスを実装してみる

早速ドメインサービスを実装してみようと思います。

```php
<?php

declare(strict_types=1);

namespace User\Domain\User;

interface UserDomainServiceInterface
{
    public function existByEmail(UserEmail $email): bool;
}
```

とりあえず同じユーザーメールアドレスが存在するかをここで確認できるようにします。

### リポジトリを実装してみる

次に、いきなりですがリポジトリの実装をしてみようと思います。

```php
<?php

declare(strict_types=1);

namespace User\Domain\User;

interface UserRepositoryInterface
{
    public function create(User $user): void;
}
```

こんな感じになるかなと思います。いきなりですがリポジトリの実装をしてみようと思います

> システムは従業員データを保存する。

のユースケースのためのメソッドにはなりますが、一旦このままでいこうと思います。
必要なメソッドは必要な時に定義していきます。許してください。

### 必要なインターフェースを切っていく

* `Uuid`の生成
* `Transaction`

この辺もインターフェースを切っていこうと思います。

まずは、`Uuid`についてです。

```php
<?php

declare(strict_types=1);

namespace Basic\ApplicationService;

interface UuidInterface
{
    public function generate(): string;
}
```

次に``Transaction`です。

```php
<?php

declare(strict_types=1);

namespace Basic\ApplicationService;

interface TransactionInterface
{
    public function begin(): void;

    public function commit(): void;

    public function rollback(): void;
}
```

これで、多分実装準備できたかなとこの段階では思ってます。

## アプリケーションサービスの実装

早速アプリケーションサービス実装準備に入ります。

### まずはテストを作る

とりあえずテストを作ってみます。

```php
<?php

declare(strict_types=1);

namespace Tests\Unit\User\ApplicationService;

use Basic\ApplicationService\RandomStringInterface;
use Basic\ApplicationService\TransactionInterface;
use Basic\ApplicationService\UuidInterface;
use Exception;
use PHPUnit\Framework\TestCase;
use User\ApplicationService\Create\Handle\CreateUserHandleApplicationService;
use User\ApplicationService\Error\UserError;
use User\Domain\User\HashedPassword;
use User\Domain\User\PasswordHasherInterface;
use User\Domain\User\User;
use User\Domain\User\UserDomainServiceInterface;
use User\Domain\User\UserEmail;
use User\Domain\User\UserFactoryInterface;
use User\Domain\User\UserRepositoryInterface;
use User\UseCase\Create\Handle\CreateUserHandleRequest;
use User\UseCase\Create\Handle\CreateUserHandleResponse;

class CreateUserHandleApplicationServiceTest extends TestCase
{
    private UserFactoryInterface $user_factory;

    private UserDomainServiceInterface $user_domain_service;

    private UserRepositoryInterface $user_repository;

    private PasswordHasherInterface $password_hasher;

    private RandomStringInterface $random_string;

    private UuidInterface $uuid;

    private TransactionInterface $transaction;

    public function setUp(): void
    {
        parent::setUp();

        $this->user_factory = $this->createStub(UserFactoryInterface::class);
        $this->user_domain_service = $this->createStub(UserDomainServiceInterface::class);
        $this->user_repository = $this->createStub(UserRepositoryInterface::class);
        $this->password_hasher = $this->createStub(PasswordHasherInterface::class);
        $this->random_string = $this->createStub(RandomStringInterface::class);
        $this->uuid = $this->createStub(UuidInterface::class);
        $this->transaction = $this->createStub(TransactionInterface::class);
    }

    public function testSuccess(): void
    {
        $this->user_domain_service->method('existByEmail')->willReturn(false);

        $this->user_factory->method('createUserEmail')
            ->willReturn($this->createStub(UserEmail::class));

        $this->uuid->method('generate')->willReturn('hogehogehogehogehogehgoehogehogehoge');

        $this->user_factory->method('create')
            ->willReturn($this->createStub(User::class));

        $this->random_string->method('generate')->willReturn('hogehogehogehogehogehogehogehogehoge');

        $this->password_hasher->method('hash')->willReturn(
            $this->createStub(HashedPassword::class)
        );

        $app_request = new CreateUserHandleRequest(
            'hogehgoe',
            'hogehoge@example.com',
            'admin'
        );

        $expect_app_response = new CreateUserHandleResponse();

        $interactor = new CreateUserHandleApplicationService(
            $this->user_factory,
            $this->user_domain_service,
            $this->user_repository,
            $this->password_hasher,
            $this->random_string,
            $this->uuid,
            $this->transaction
        );

        $actual_app_response = $interactor->handle($app_request);

        $this->assertEquals($expect_app_response, $actual_app_response);
    }

    public function testEmailError(): void
    {
        $this->user_domain_service->method('existByEmail')->willReturn(true);

        $this->user_factory->method('createUserEmail')
            ->willReturn($this->createStub(UserEmail::class));

        $app_request = new CreateUserHandleRequest(
            'hogehgoe',
            'hogehoge@example.com',
            'admin'
        );

        $expect_app_response = new CreateUserHandleResponse(
            request_error_messages:[
                'email' => UserError::EMAIL_ALREADY_EXIST,
            ]
        );

        $interactor = new CreateUserHandleApplicationService(
            $this->user_factory,
            $this->user_domain_service,
            $this->user_repository,
            $this->password_hasher,
            $this->random_string,
            $this->uuid,
            $this->transaction
        );

        $actual_app_response = $interactor->handle($app_request);

        $this->assertEquals($expect_app_response, $actual_app_response);
    }

    public function testHandleError(): void
    {
        $this->user_domain_service->method('existByEmail')->willReturn(false);

        $this->user_factory->method('createUserEmail')
            ->willReturn($this->createStub(UserEmail::class));

        $this->uuid->method('generate')->willReturn('hogehogehogehogehogehgoehogehogehoge');

        $this->user_factory->method('create')
            ->willReturn($this->createStub(User::class));

        $this->random_string->method('generate')->willReturn('hogehogehogehogehogehogehogehogehoge');

        $this->password_hasher->method('hash')->willReturn(
            $this->createStub(HashedPassword::class)
        );

        $this->user_repository->method('create')->willThrowException(new Exception('error'));

        $app_request = new CreateUserHandleRequest(
            'hogehgoe',
            'hogehoge@example.com',
            'admin'
        );

        $expect_app_response = new CreateUserHandleResponse(
            handle_error_messages:[
                'handle_error' => 'error',
            ]
        );

        $interactor = new CreateUserHandleApplicationService(
            $this->user_factory,
            $this->user_domain_service,
            $this->user_repository,
            $this->password_hasher,
            $this->random_string,
            $this->uuid,
            $this->transaction
        );

        $actual_app_response = $interactor->handle($app_request);

        $this->assertEquals($expect_app_response, $actual_app_response);
    }
}
```

こんな感じなんですかね、テスト勉強しないといけないなと思いました。

また、テスト書きながら勝手に

* `RandomStringInterface`
* `UserFactoryInterface`
* `PasswordHasherInterface`

とかがないなと思って勝手に切っておりまする。そして、これを元に実装をしてみました。

```php
<?php

declare(strict_types=1);

namespace User\ApplicationService\Create\Handle;

use Basic\ApplicationService\RandomStringInterface;
use Basic\ApplicationService\TransactionInterface;
use Basic\ApplicationService\UuidInterface;
use Exception;
use User\ApplicationService\Error\UserError;
use User\Domain\User\PasswordHasherInterface;
use User\Domain\User\UserDomainServiceInterface;
use User\Domain\User\UserFactoryInterface;
use User\Domain\User\UserRepositoryInterface;
use User\UseCase\Create\Handle\CreateUserHandleRequest;
use User\UseCase\Create\Handle\CreateUserHandleRequester;
use User\UseCase\Create\Handle\CreateUserHandleResponse;

class CreateUserHandleApplicationService implements CreateUserHandleRequester
{
    private const PASSWORD_LENGTH = 8;

    public function __construct(
        private UserFactoryInterface $user_factory,
        private UserDomainServiceInterface $user_domain_service,
        private UserRepositoryInterface $user_repository,
        private PasswordHasherInterface $password_hasher,
        private RandomStringInterface $random_string,
        private UuidInterface $uuid,
        private TransactionInterface $transaction
    ) {
    }

    public function handle(CreateUserHandleRequest $app_request): CreateUserHandleResponse
    {
        if ($this->user_domain_service->existByEmail(
            $this->user_factory->createUserEmail($app_request->email)
        )) {
            return new CreateUserHandleResponse(
                request_error_messages:[
                    'email' => UserError::EMAIL_ALREADY_EXIST,
                ]
            );
        }

        $this->transaction->begin();

        $raw_password = $this->random_string->generate(self::PASSWORD_LENGTH);

        try {
            $this->user_repository->create(
                $this->user_factory->create(
                    $this->uuid->generate(),
                    $app_request->name,
                    $app_request->email,
                    $app_request->permission,
                    $this->password_hasher->hash($raw_password)
                )
            );

            $this->transaction->commit();
        } catch (Exception $exception) {
            $this->transaction->rollback();

            return new CreateUserHandleResponse(
                handle_error_messages:[
                    'handle_error' => $exception->getMessage(),
                ]
            );
        }

        return new CreateUserHandleResponse();
    }
}
```

これでテストを実行してみて、

```bash
php artisan test tests/Unit/User/ApplicationService/CreateUserHandleApplicationServiceTest.php 

   PASS  Tests\Unit\User\ApplicationService\CreateUserHandleApplicationServiceTest
  ✓ success                                                                                                                                                                                       0.01s  
  ✓ email error
  ✓ handle error

  Tests:    3 passed (3 assertions)
  Duration: 0.05s
```

無事に通りましたね！これで登録のアプリケーションサービスは問題ないかなと。

次はコントローラーとか実装していこうかなと思ってます。