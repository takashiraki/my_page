---
outline: [2, 4]
---

# 実装 - 従業員ドメイン

今更ですが、ここからクリーンアーキテクチャに沿って、実装をしてみようと思います。

## まずはよくある図を見る

![clean architecture](/clean-architecture.png)

これがよくある図ですね。Entityを中心に、どんどん外側に広がって行ってる感じです。

中心への依存はokで、中心から外側への依存がNGみたいな感じです。ドメイン駆動設計でいうところの、ドメインと同じ意味合いなのではないかなと思います。

## クラス図の修正

![クラス図みたいなやつ](/3-class.png)

これ、僕が最初の方に書いたクラス図なんですけど、ちょっと間違ってましたね。多分正確にはしたみたいな感じになるかなと思います。

![クラス図みたいなやつ](/4-class.png)

会社に属している人や経営してる人は、さまざまな情報を持っています。

アカウントもその中の一つです。アカウントは従業員が持ってるさまざまな情報の中の一個として成り立っているのかなと思ったので、こんな感じにしてみました。

## 従業員ドメインオブジェクトを作ってみる

では、ドメイン駆動設計に沿って、まずはドメインオブジェクトから作ってみようと思います。

```bash
mkdir -p packages/Users/Domain/User
```

ここに色々と入れていこうと思います。

### 従業員クラス

```php
<?php

declare(strict_types=1);

namespace User\Domain\User;

class User
{
    public function __construct(
        private UserId $id,
        private UserName $name,
        private UserEmail $email,
        private UserPermission $permission
    ) {
    }

    public function userId(): UserId
    {
        return $this->id;
    }

    public function userName(): UserName
    {
        return $this->name;
    }

    public function userEmail(): UserEmail
    {
        return $this->email;
    }

    public function userPermission(): UserPermission
    {
        return $this->permission;
    }
}
```

まずは従業員オブジェクトについてです。それぞれ個別の値を値オブジェクトとして表現しています。

### 従業員ID(値オブジェクト)

```php
<?php

declare(strict_types=1);

namespace User\Domain\User;

use Basic\DomainService\StringValueObject;
use InvalidArgumentException;
use LengthException;

class UserId extends StringValueObject
{
    private const LENGTH = 36;

    public function __construct(
        string $value
    ) {
        if (empty($value) || trim($value) === '') {
            throw new InvalidArgumentException('User id is required.');
        }

        if (strlen($value) !== self::LENGTH) {
            throw new LengthException('User id must be 36 characters.');
        }

        parent::__construct($value);
    }
}

```
これで、従業員IDを値オブジェクトとして表現するようにしています。

### 従業員IDに関するテスト

ついでにテストも実装してみました。

```php
<?php

declare(strict_types=1);

namespace Tests\Unit\User\Domains;

use InvalidArgumentException;
use LengthException;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use User\Domain\User\UserId;

class UserIdTest extends TestCase
{
    public function testUserId(): void
    {
        $user_id = new UserId('hogehogehogehogehogehogehogehogehoge');

        $this->assertInstanceOf(UserId::class, $user_id);
    }

    public function testReturnValue(): void
    {
        $user_id = new UserId('hogehogehogehogehogehogehogehogehoge');

        $this->assertEquals('hogehogehogehogehogehogehogehogehoge', $user_id->value());
    }

    #[DataProvider('dataProvider')]
    public function testInvalidUserId(array $params, array $error): void
    {
        $this->expectException($error['exception']);
        $this->expectExceptionMessage($error['message']);

        new UserId($params['user_id']);
    }

    public static function dataProvider(): array
    {
        return [
            [
                [
                    'user_id' => ' ',
                ],
                [
                    'exception' => InvalidArgumentException::class,
                    'message' => 'User id is required.',
                ],
            ],
            [
                [
                    'user_id' => '',
                ],
                [
                    'exception' => InvalidArgumentException::class,
                    'message' => 'User id is required.',
                ],
            ],
            [
                [
                    'user_id' => 'hogehogehogehogehogehogehogehogehogehoge',
                ],
                [
                    'exception' => LengthException::class,
                    'message' => 'User id must be 36 characters.',
                ],
            ],
            [
                [
                    'user_id' => 'hogehogehogehogehogehogehogehoge',
                ],
                [
                    'exception' => LengthException::class,
                    'message' => 'User id must be 36 characters.',
                ],
            ],
        ];
    }
}
```

最近データプロバイダーってのを覚えて、試しに実装してみました。ユニットテスト書くの自信ないので、ここら辺はおいおいしっかり勉強していかないとですね。

一応他のテストも実装してから、アプリケーションサービスを実装してみようと思います。