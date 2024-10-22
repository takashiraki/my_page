import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
    base: "/my_page",
    title: "takashiraki",
    description: "takashiraki",
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: "Home", link: "/" },
            { text: "Tech blog", link: "/posts/techs/blog-top" },
            { text: "Photo log", link: "/posts/photos/blog-top" },
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
        },

        socialLinks: [
            { icon: "github", link: "https://github.com/takashiraki" },
            { icon: "twitter", link: "https://x.com/genkaitoppa_pg" },
        ],
    },
});
