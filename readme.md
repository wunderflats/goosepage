# goosepage

goosepage is a super-easy pagination utility for mongoose cursors. :chicken:

## What goosepage does better than other pagination plugins

goosepage is very unopinionated about the way you query. You can pass in any mongoose cursor. If you wanted to find blog posts for a specific author and paginate the results, you can do:

```javascript
goosepage(BlogPost.find({ author: authorId }));
```

## Example

Let's say that you have a mongoose model `BlogPost` whose collection contains over 50 documents. You want to display them in a paginated way:

### Usage

```javascript
var goosepage = require('goosepage');

goosepage(BlogPost.find())
  .then((res) => console.log(res));
```

### Result

By default, this will query the **first 20 items** from **page 0**:

```javascript
var res = {
  // there are 52 documents in total for the query
  total: 52,
  // we are on page 0
  page: 0,
  // we queried 20 items per page
  itemsPerPage: 20,
  // the first 20 BlogPosts
  items: [...]
}
```

### Customize

You can customize the defaults by overriding:

```javascript
goosepage.defaults = {
  itemsPerPage: 20,
  page: 0
};
```

### Querying for more

If you want to query the second page, simply do:

```javascript
goosepage(BlogPost.find(), { page: 1 })
  .then((res) => console.log(res));
```

This will get you the next 20 items:

```javascript
var res = {
  total: 52,
  page: 1, // this changed
  itemsPerPage: 20,
  items: [...] // this changed
}
```

### Querying more items per page

For more or fewer items per page, you can always use `opts.itemsPerPage`:

```javascript
goosepage(BlogPost.find(), { itemsPerPage: 30 })
  .then((res) => console.log(res));
```

This will get you the next 20 items:

```javascript
var res = {
  total: 52,
  page: 0,
  itemsPerPage: 30, // this changed
  items: [...] // this changed
}
```

## Drawbacks

goosepage uses mongodb's `skip()` and `limit()` commands. This is not the fastest approach, even though it's fine for smaller datasets. If you are looking for a faster pagination solution, check out this article: [Fast paging with MongoDB](http://blog.mongodirector.com/fast-paging-with-mongodb).
