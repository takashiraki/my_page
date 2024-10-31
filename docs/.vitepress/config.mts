import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
    base: "/my_page",
    title: "takashiraki",
    description: "takashiraki",
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        logo: "/fv.png",
        nav: [
            { text: "Home", link: "/" },
            { text: "Tech blog", link: "/posts/techs/blog-top" },
            { text: "Photo log", link: "/posts/photos/blog-top" },
            {
                text: "個人開発",
                items: [
                    {
                        text: "アカウント管理",
                        link: "/posts/dev/account-manager/introduction",
                    },
                ],
            },
        ],

        sidebar: {
            "/posts/techs/": [
                {
                    text: "Introduction",
                    items: [
                        {
                            text: "Blog top",
                            link: "/posts/techs/blog-top",
                        },
                    ],
                },
            ],
            "/posts/photos/": [
                {
                    text: "Introduction",
                    items: [
                        {
                            text: "Blog top",
                            link: "/posts/photos/blog-top",
                        },
                    ],
                },
            ],
            "/posts/dev/account-manager/": [
                {
                    text: "Introduction",
                    items: [
                        {
                            text: "はじめに",
                            link: "/posts/dev/account-manager/introduction",
                        },
                    ],
                },
                {
                    text: "分析",
                    items: [
                        {
                            text: "問題分析",
                            link: "/posts/dev/account-manager/problem",
                        },
                        {
                            text: "ユースケース - 基本",
                            link: "/posts/dev/account-manager/basic-usecase",
                        },
                        {
                            text: "ユースケース - 代替",
                            link: "/posts/dev/account-manager/instead-usecase",
                        },
                        {
                            text: "ロバストネス - 基本",
                            link: "/posts/dev/account-manager/basic-robustness",
                        },
                        {
                            text: "ロバストネス - 代替",
                            link: "/posts/dev/account-manager/instead-robustness",
                        },
                    ],
                },
                {
                    text: "実装",
                    items: [
                        {
                            text: "使用技術",
                            link: "/posts/dev/account-manager/tech",
                        },
                        {
                            text: "とりあえず書いてみる",
                            link: "/posts/dev/account-manager/first-code",
                        },
                        {
                            text: "リファクタ - コントローラー",
                            link: "/posts/dev/account-manager/divide-logic",
                        },
                        {
                            text: "実装 - 従業員ドメイン",
                            link: "/posts/dev/account-manager/clean-architecture",
                        },
                    ],
                },
            ],
        },

        socialLinks: [
            { icon: "github", link: "https://github.com/takashiraki" },
            { icon: "twitter", link: "https://x.com/genkaitoppa_pg" },
        ],
    },
});
