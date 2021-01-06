function makeBookmarksArray() {
    return [
        {
            title: "Disney",
            url: "www.disney.com",
            description: "This is the desc for disney.com!",
            rating: 4,
            id: 1,
        },
        {
            title: "NYT",
            url: "www.nyt.com",
            description: "This is the desc for nyt.com!",
            rating: 3,
            id: 2,
        },
        {
            title: "test",
            url: "www.test.com",
            description: "This is the desc for test.com!",
            rating: 4,
            id: 3,
        },
        {
            title: "hello",
            url: "www.hello.com",
            description: "This is the desc for hello.com!",
            rating: 3,
            id: 4,
        },
    ];
}

module.exports = {
    makeBookmarksArray,
}